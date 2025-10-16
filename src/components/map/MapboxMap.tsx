import { buildingLayer, hoveredId, selectedCampus, selectedId } from '@/store';
import mapboxgl, {
  type Point,
  type DataDrivenPropertyValueSpecification,
} from 'mapbox-gl';
import {
  getAllBuildings,
  getCameraForCampus,
  updateSelectedCampus,
  handleSelectBuilding,
} from '@/lib/mapApi';
import type { BuildingLayerType } from '@/types/map';
import { createCustomLayer } from '@/lib/modelUtils';
import { toast } from 'sonner';
import { useTranslations } from '@/i18n/utils';
import type { Feature, Polygon, GeoJsonProperties } from 'geojson';
import { findGroupForId } from '@/lib/mapUtils';
import { ELEMENT_IDS } from '@/lib/consts';
import { useEffect, useRef, type Ref } from 'react';

const MapboxMap = () => {
  const mapContainerRef = useRef<HTMLElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);

  useEffect(() => {
    const lang =
      document.querySelector('html')?.getAttribute('lang') === 'ko'
        ? 'ko'
        : 'en';
    const t = useTranslations(lang);

    mapboxgl.accessToken = import.meta.env.PUBLIC_MAPBOX_TOKEN;

    const initialCamera = getCameraForCampus(selectedCampus.get());

    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v11',
      container: mapContainerRef.current as HTMLElement,
      antialias: true,
      attributionControl: false,
      logoPosition: 'top-right',
      minZoom: 14,
      maxZoom: 18,
      language: lang,
      ...initialCamera,
    });

    // Store map instance in ref
    mapRef.current = map;

    // Expose map instance to window
    window.map = map;

    map.addControl(new mapboxgl.AttributionControl(), 'top-left');
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add camera move listener to update selected campus
    map.on('moveend', () => {
      const center = map.getCenter();
      updateSelectedCampus(center.lng, center.lat);
    });

    const allBuildingData = getAllBuildings();
    const buildingsFeaturesData = allBuildingData.map((building) => {
      return {
        type: 'Feature',
        geometry: building.geometry,
        id: building.id,
        properties: {
          height: building.height || 0,
          min_height: 0,
        },
      };
    }) as Feature<Polygon, GeoJsonProperties>[];

    map.on('style.load', () => {
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;

      const labelLayerId = layers.find(
        (layer) =>
          layer.type === 'symbol' && layer.layout && layer.layout['text-field'],
      )?.id;

      if (!labelLayerId) {
        return;
      }

      const buildingHeights = Object.fromEntries(
        allBuildingData
          .filter((building) => Boolean(building.height))
          .map((building) => {
            const height = building.height || 0;
            const extrusionOffset = building.extrusionOffset || 0;
            const totalHeight = height + extrusionOffset;
            return [String(building.id), totalHeight];
          }),
      );

      const extrusionOffsets = Object.fromEntries(
        allBuildingData
          .filter((building) => Boolean(building.extrusionOffset))
          .map((building) => {
            return [String(building.id), building.extrusionOffset || 0];
          }),
      );

      const fillExtrusionHeightExpression: DataDrivenPropertyValueSpecification<number> =
        [
          'case',
          // Check if custom height exists in your dictionary
          ['has', ['to-string', ['id']], ['literal', buildingHeights]],
          // If it exists, use the custom height
          ['get', ['to-string', ['id']], ['literal', buildingHeights]],
          // Otherwise, fall back to OSM height data
          ['get', 'height'],
        ];

      const fillExtrusionBaseExpression: DataDrivenPropertyValueSpecification<number> =
        [
          'case',
          ['has', ['to-string', ['id']], ['literal', extrusionOffsets]],
          ['get', ['to-string', ['id']], ['literal', extrusionOffsets]],
          ['get', 'min_height'],
        ];

      map.addSource('custom-extrusions', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: buildingsFeaturesData,
        },
      });

      map.addLayer(
        {
          id: 'osm-buildings',
          type: 'fill-extrusion',
          source: 'custom-extrusions',
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': fillExtrusionHeightExpression,
            'fill-extrusion-base': fillExtrusionBaseExpression,
            'fill-extrusion-opacity': 1,
          },
        },
        labelLayerId,
      );

      map.addLayer(
        {
          id: 'selected-building',
          type: 'fill-extrusion',
          source: 'custom-extrusions',
          filter: ['==', ['get', 'id'], ''],
          paint: {
            'fill-extrusion-color': '#003876',
            'fill-extrusion-height': fillExtrusionHeightExpression,
            'fill-extrusion-base': fillExtrusionBaseExpression,
            'fill-extrusion-opacity': 1,
          },
        },
        labelLayerId,
      );

      const buildingHeightsWithOffset = Object.fromEntries(
        allBuildingData
          .filter((building) => Boolean(building.height))
          .map((building) => {
            const height = building.height || 0;
            const extrusionOffset = building.extrusionOffset || 0;
            const terrainOffset = building.terrain_offset || 0;
            const totalHeight = height + extrusionOffset + terrainOffset;
            return [String(building.id), totalHeight];
          }),
      );

      const totalOffsets = Object.fromEntries(
        allBuildingData
          .filter(
            (building) =>
              Boolean(building.terrain_offset) ||
              Boolean(building.extrusionOffset),
          )
          .map((building) => {
            const extrusionOffset = building?.extrusionOffset || 0;
            const terrainOffset = building?.terrain_offset || 0;
            return [String(building.id), terrainOffset + extrusionOffset];
          }),
      );

      const fillExtrusionWithTerrainHeightExpression: DataDrivenPropertyValueSpecification<number> =
        [
          'case',
          [
            'has',
            ['to-string', ['id']],
            ['literal', buildingHeightsWithOffset],
          ],
          [
            'get',
            ['to-string', ['id']],
            ['literal', buildingHeightsWithOffset],
          ],
          ['get', 'height'],
        ];

      const fillExtrusionBaseWithTerrainExpression: DataDrivenPropertyValueSpecification<number> =
        [
          'case',
          ['has', ['to-string', ['id']], ['literal', totalOffsets]],
          ['get', ['to-string', ['id']], ['literal', totalOffsets]],
          ['get', 'min_height'],
        ];

      map.addLayer(
        {
          id: 'selectable-buildings',
          type: 'fill-extrusion',
          source: 'custom-extrusions',
          paint: {
            'fill-extrusion-height': fillExtrusionWithTerrainHeightExpression,
            'fill-extrusion-base': fillExtrusionBaseWithTerrainExpression,
            'fill-extrusion-opacity': 0,
          },
        },
        labelLayerId,
      );

      const rhinoSimpleSinchonLayer = createCustomLayer({
        map: map,
        longitude: 126.939304,
        latitude: 37.566086,
        modelUrl: '/models/rhino-simple/sinchon.gltf',
        id: 'rhino-simple-sinchon',
        altitude: 108,
        rotateX: Math.PI / 2,
      });
      map.addLayer(rhinoSimpleSinchonLayer, labelLayerId);

      const rhinoSimpleSongdoLayer = createCustomLayer({
        map: map,
        longitude: 126.6699,
        latitude: 37.382016,
        modelUrl: '/models/rhino-simple/songdo.gltf',
        id: 'rhino-simple-songdo',
        altitude: -10,
        rotateX: Math.PI / 2,
      });
      map.addLayer(rhinoSimpleSongdoLayer, labelLayerId);

      const rhinoDetailedSinchon = createCustomLayer({
        map: map,
        longitude: 126.939304,
        latitude: 37.566086,
        modelUrl: '/models/rhino-detailed/sinchon.gltf',
        id: 'rhino-detailed-sinchon',
        altitude: 108,
        rotateX: Math.PI / 2,
      });
      map.addLayer(rhinoDetailedSinchon, labelLayerId);
    });

    map.on('click', (e) => {
      let currentSelectedId: number | string = '';
      const $buildingLayer = buildingLayer.get();

      if ($buildingLayer === '') {
        return;
      }

      const layerName =
        $buildingLayer === 'osm' ? 'osm-buildings' : 'selectable-buildings';
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerName],
      });

      if (features.length) {
        const building = features[0];
        const buildingId = building.id;
        currentSelectedId = buildingId || '';
      } else {
        currentSelectedId = '';
        map.setFilter('selected-building', ['==', ['id'], '']);
      }

      handleSelectBuilding(currentSelectedId, lang);
    });

    selectedId.listen((selectedId) => {
      if (selectedId) {
        const groupIds = findGroupForId(selectedId);

        if (groupIds) {
          map.setFilter('selected-building', [
            'all',
            ['in', ['id'], ['literal', groupIds]],
          ]);
        } else {
          map.setFilter('selected-building', ['==', ['id'], selectedId]);
        }

        if (buildingLayer.get() == 'osm') {
          map.setLayoutProperty('selected-building', 'visibility', 'visible');
        }
      } else {
        map.setFilter('selected-building', ['==', ['id'], '']);
        map.setLayoutProperty('selected-building', 'visibility', 'none');
      }
    });

    const setBuildingLayer = (layer: BuildingLayerType) => {
      map.setLayoutProperty('osm-buildings', 'visibility', 'none');
      map.setLayoutProperty('selected-building', 'visibility', 'none');
      map.setLayoutProperty('rhino-simple-sinchon', 'visibility', 'none');
      map.setLayoutProperty('rhino-simple-songdo', 'visibility', 'none');
      map.setLayoutProperty('rhino-detailed-sinchon', 'visibility', 'none');
      if (layer === 'osm') {
        map.setLayoutProperty('osm-buildings', 'visibility', 'visible');
        map.setLayoutProperty('selected-building', 'visibility', 'visible');
      } else if (layer === 'rhino-simple') {
        map.setLayoutProperty('rhino-simple-sinchon', 'visibility', 'visible');
        map.setLayoutProperty('rhino-simple-songdo', 'visibility', 'visible');
      } else if (layer === 'rhino-detailed') {
        map.setLayoutProperty(
          'rhino-detailed-sinchon',
          'visibility',
          'visible',
        );
      }
    };

    const NAVBAR_HEIGHT =
      document.getElementById(ELEMENT_IDS['navbar'])?.offsetHeight || 0;
    const RHINO_SIMPLE_LEGEND_HEIGHT =
      document.getElementById(ELEMENT_IDS['rhinoSimpleLegend'])?.offsetHeight ||
      0;
    let pollingInterval: ReturnType<typeof setInterval> | null = null;

    map.on('style.load', () => {
      const initialBuildingLayer = buildingLayer.get();
      setBuildingLayer(initialBuildingLayer);
    });

    let currentMousePoint = { x: 0, y: 0 };
    let hoveredPoint: Point;
    map.on('mousemove', 'selectable-buildings', (e) => {
      hoveredPoint = e.point;
      currentMousePoint = { x: e.point.x, y: e.point.y };
    });

    map.on('drag', ({ originalEvent }) => {
      const mouseEvent = originalEvent as MouseEvent;
      currentMousePoint = {
        x: mouseEvent.offsetX,
        y: mouseEvent.offsetY,
      };
    });

    map.on('mouseenter', 'selectable-buildings', (e) => {
      currentMousePoint = { x: e.point.x, y: e.point.y };
      if (!pollingInterval) {
        if (buildingLayer.get() !== 'rhino-simple') {
          return;
        }

        pollingInterval = setInterval(() => {
          const features = map.queryRenderedFeatures(hoveredPoint, {
            layers: ['selectable-buildings'],
          });
          console.log(currentMousePoint);

          if (features.length) {
            const building = features[0];
            hoveredId.set(building.id || '');
          }

          const tooltip = document.getElementById(
            ELEMENT_IDS['yearlyEuiTooptip'],
          );
          if (tooltip) {
            const tooltipRect = tooltip.getBoundingClientRect();
            const mapWidth = window.innerWidth;
            const mapHeight = window.innerHeight;

            let top = currentMousePoint.y + 8;
            let left = currentMousePoint.x + 8;

            if (currentMousePoint.x + tooltipRect.width + 8 > mapWidth) {
              left = currentMousePoint.x - tooltipRect.width - 8;
            }

            const maxVisibleY =
              mapHeight - NAVBAR_HEIGHT - RHINO_SIMPLE_LEGEND_HEIGHT;
            if (top + tooltipRect.height + 8 > maxVisibleY) {
              top = maxVisibleY - tooltipRect.height - 8;
            }

            tooltip.style.setProperty('top', `${top}px`);
            tooltip.style.setProperty('left', `${left}px`);
          }
        }, 25);
      }
    });

    const hideHoverTooltip = () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        hoveredId.set('');
      }
    };

    map.on('mouseleave', 'selectable-buildings', () => {
      hideHoverTooltip();
    });

    map.on('resize', 'selectable-buildings', () => {
      hideHoverTooltip();
    });

    map.on('rotate', () => {
      hideHoverTooltip();
    });

    buildingLayer.listen((layer) => {
      if (!layer) {
        toast.warning(t('notify.no_model'), {
          duration: Infinity,
          id: 'no-model',
          dismissible: false,
        });
      } else {
        toast.dismiss('no-model');
      }

      setBuildingLayer(layer);
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const eventHandler = (event: Event) => {
      if (
        event instanceof TransitionEvent &&
        event.propertyName === 'right' &&
        mapRef.current
      ) {
        mapRef.current.resize();
      }
    };

    sidebar.addEventListener('transitionend', eventHandler);

    return () => {
      sidebar.removeEventListener('transitionend', eventHandler);
    };
  }, []);

  return (
    <div
      ref={mapContainerRef as Ref<HTMLDivElement>}
      className="h-dvh w-full"
    ></div>
  );
};

export default MapboxMap;
