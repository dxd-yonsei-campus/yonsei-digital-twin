import * as THREE from 'three';
import mapboxgl, { type Map, type CustomLayerInterface } from 'mapbox-gl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const modelOrigin: [number, number] = [126.9384, 37.5647];
const modelAltitude = 0;
const modelRotate = [Math.PI / 2, 0, 0];

const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
  modelOrigin,
  modelAltitude,
);

const modelTransform = {
  translateX: modelAsMercatorCoordinate.x,
  translateY: modelAsMercatorCoordinate.y,
  translateZ: modelAsMercatorCoordinate.z,
  rotateX: modelRotate[0],
  rotateY: modelRotate[1],
  rotateZ: modelRotate[2],
  /* Since the 3D model is in real world meters, a scale transform needs to be
   * applied since the CustomLayerInterface expects units in MercatorCoordinates.
   */
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};

export const createCustomLayer = (map: Map): CustomLayerInterface => {
  const camera = new THREE.Camera();
  const scene = new THREE.Scene();

  const directionalLight1 = new THREE.DirectionalLight(0xffffff);
  directionalLight1.position.set(0, -70, 100).normalize();
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff);
  directionalLight2.position.set(0, 70, 100).normalize();
  scene.add(directionalLight2);

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder); // Required for gltfpack models
  loader.load('/models/rhino-simple/model.gltf', (gltf) => {
    scene.add(gltf.scene);
  });

  const renderer = new THREE.WebGLRenderer({
    canvas: map.getCanvas(),
    context: map.painter.context.gl,
    antialias: true,
  });

  renderer.autoClear = false;

  return {
    id: 'rhino-simple',
    type: 'custom',
    renderingMode: '3d',
    onAdd: () => {
      // Add logic that runs on layer addition if necessary.
    },
    render: (gl, matrix) => {
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
      const finalMatrix = m.multiply(l);
      camera.projectionMatrix = finalMatrix.clone();
      const near = 0.1;
      const far = 1000000; // Very large far plane to prevent clipping when panning

      // Modify the projection matrix to use custom near/far planes
      // elements[10]: Controls the Z-buffer depth mapping
      // elements[14]: Controls the near/far plane relationship
      camera.projectionMatrix.elements[10] = -(far + near) / (far - near);
      camera.projectionMatrix.elements[14] = -(2 * far * near) / (far - near);

      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };
};
