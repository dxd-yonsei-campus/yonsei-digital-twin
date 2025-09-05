# Yonsei Digital Twin

Yonsei Digital Twin is built using [Astro](https://astro.build/), [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs) and [React](https://react.dev/).

## Prerequisites

- [Node.js v22.0.0 or higher](https://nodejs.org/)
- [pnpm v10](https://pnpm.io/)

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

## Updating Building Data

The data for each building can be found in `src/data/buildings/`. Each campus is stored as a separate `JSON` file. The accepted keys are described below. Keys in **_bold italics_** are required.

| Key                  | Data Type          | Description                                                                                                                              |
| -------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **_id_**             | `string`, `number` | Unique id for the building. Corresponds to the OSM id (if available).                                                                    |
| **_name_**           | `string`           | Name of the building in Korean.                                                                                                          |
| **_name_en_**        | `string`           | Name of the building in English.                                                                                                         |
| address              | `string`           | Address of the building in English.                                                                                                      |
| **_latitude_**       | `number`           | Latitude of the building, used to position the camera upon search.                                                                       |
| **_longitude_**      | `number`           | Longitude of the building, used to position the camera upon search.                                                                      |
| extrusionOffset      | `number`           | Height above ground level (in meters) where the building begins, relative to the terrain.                                                |
| terrainOffset        | `number`           | Height above ground level (in meters) where the terrain for this building begins, used for the invisible picking layer.                  |
| height               | `number`           | Height of the building.                                                                                                                  |
| geometry             | `object`           | Specifies the `type` (e.g. polygon) and `coordinates` i.e. bounding box for the building                                                 |
| floor_level          | `number`           | The number of floors for the building.                                                                                                   |
| approval_date        | `date`             | A date when the building was approved in the `YYYY-MM-DD` format. `YYYY` is also accepted.                                               |
| construction_type    | `string`           | Construction type in Korean.                                                                                                             |
| construction_type_en | `string`           | Construction type in English.                                                                                                            |
| total_floor_area     | `number`           | Total floor area in square metres.                                                                                                       |
| total_building_area  | `number`           | Total building area in square metres.                                                                                                    |
| images               | `string[]`         | An array of string containing the file path to the images. Images should be stored within `src` to allow for Astro's image optimisation. |

## Draco Loader

The application supports custom models compressed by both Draco and Meshoptimiser using Three.js. The `public/draco` folder contains the necessary decoders for using the Draco loaders.

To re-generate the decoders, run the following command:

```
pnpm draco
```
