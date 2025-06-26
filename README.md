# Yonsei Digital Twin

Yonsei Digital Twin is built using [Astro](https://astro.build/), [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs) and React.

## Getting Started

1. Install dependencies `pnpm i`
2. Add environment variables for Mapbox
   ```
   // .env
   PUBLIC_MAPBOX_TOKEN="pk.eyXXXXXXXXXX"
   ```
3. Run the application `pnpm dev`

## Adding Custom Models

The application supports custom 3D models using [three.js](https://threejs.org/). It is recommended to optimise the size of 3D models before hosting them using tools such as [`gltfpack`](https://github.com/zeux/meshoptimizer).

```sh
# If you do not want to install gltfpack package
npx gltfpack -i rhino.gltf -o rhino-output.gltf -cc

# If you want to install the gltfpack package
npm install -g gltfpack
gltfpack -i rhino.gltf -o rhino-output.gltf -cc
```
