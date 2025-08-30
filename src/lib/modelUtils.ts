import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import mapboxgl, { type Map, type CustomLayerInterface } from 'mapbox-gl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

type CustomLayerProps = {
  map: Map;
  latitude: number;
  longitude: number;
  id: string;
  modelUrl: string;
  altitude?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
};

export const createCustomLayer = ({
  map,
  latitude,
  longitude,
  id,
  modelUrl,
  altitude = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
}: CustomLayerProps): CustomLayerInterface => {
  const origin: [number, number] = [longitude, latitude];
  const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    origin,
    altitude,
  );

  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: rotateX,
    rotateY: rotateY,
    rotateZ: rotateZ,
    /* Since the 3D model is in real world meters, a scale transform needs to be
     * applied since the CustomLayerInterface expects units in MercatorCoordinates.
     */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * scale,
  };

  const camera = new THREE.PerspectiveCamera();
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas: map.getCanvas(),
    context: map.painter.context.gl,
    antialias: true,
  });
  renderer.autoClear = false;

  // Lighting Setup
  renderer.toneMapping = THREE.LinearToneMapping;
  renderer.toneMappingExposure = Math.pow(2, -0.6); // reduce intensity of toneMapping
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnvironment = new RoomEnvironment();
  const envTexture = pmremGenerator.fromScene(roomEnvironment).texture;
  scene.environment = envTexture;

  const dracoLoader = new DRACOLoader();
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  dracoLoader.setDecoderPath('/draco/');
  loader.setMeshoptDecoder(MeshoptDecoder); // Required for gltfpack models
  const allMeshes: THREE.Object3D<THREE.Object3DEventMap>[] = [];
  loader.load(modelUrl, (gltf) => {
    gltf.scene.traverse((child) => {
      allMeshes.push(child);

      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material;
        if (material.opacity < 1) {
          material.transparent = true;
        }
      }
    });
    scene.add(gltf.scene);
  });

  return {
    id: id,
    type: 'custom',
    renderingMode: '3d',
    onAdd: () => {
      // Add logic that runs on layer addition if necessary.
    },
    render: (gl, matrix) => {
      const canvas = map.getCanvas();

      // Trigger repaint to render the model with the correct aspect ratio
      renderer.setSize(canvas.width, canvas.height, false);

      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX,
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY,
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ,
      );

      const m = new THREE.Matrix4().fromArray(matrix);
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ,
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale,
          ),
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      // Set camera projection matrix with extended clipping planes
      camera.projectionMatrix = m.multiply(l);

      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };
};
