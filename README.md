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
| extrusionOffset      | `number`           | Height above ground level (in meters) where the building begins.                                                                         |
| terrain_offset       | `number`           | Height above ground level (in meters) where the terrain for this building begins, used for the invisible picking layer.                  |
| height               | `number`           | Height of the building. Used to draw extrusions for the OSM model.                                                                       |
| geometry             | `object`           | Specifies the `type` (e.g. polygon) and `coordinates` i.e. bounding box for the building. Used to draw extrusions for the OSM model.     |
| monthly_energy_use   | `string`           | The filename for the monthly energy use `.json` file found in `src/data/monthly-energy-use/`                                             |
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

## CFD Simulations

Yonsei Digital Twin displays CFD data exported from Tecplot 360 through the following process.

1. Tecplot data is exported as a `.dat` file.
2. The `.dat` file is processed to generate a `.csv` file with the columns: `X`, `Y`, `Z`, `U`, `V`, `W`, `P`.
   - `X`, `Y`, `Z` are the coordinates relative to the middle of the simulation model.
   - `U`, `V`, `W` are the velocity components in the x, y, and z directions.
   - `P` is the pressure.
3. The `.csv` file is processed to generate a `.geojson` file using a script. The coordinates can be obtained by adding the `X`, `Y`, and `Z` values to the `latitude` and `longitude` values of the building. The `.geojson` file looks like this:
   ```json
   {"type":"FeatureCollection","features":[
      {"type":"Feature","geometry":{"type":"Point","coordinates":[126.94518967314733,37.57008159207998]},"properties":{"X":599.11471,"Y":599.07609,"Z":64.5,"U":10.0,"V":9.9419134,"W":-2.3716261,"magnitude":14.299169640622521,"P":0.075587698}},
      {"type":"Feature","geometry":{"type":"Point","coordinates":[126.94523463778984,37.57008159207998]},"properties":{"X":603.08235,"Y":599.07609,"Z":64.5,"U":10.0,"V":11.376602,"W":-1.8296889,"magnitude":15.256960199764146,"P":0.11355485}},
      {"type":"Feature","geometry":{"type":"Point","coordinates":[126.9452796025457,37.57008159207998]},"properties":{"X":607.05,"Y":599.07609,"Z":64.5,"U":10.0,"V":11.857287,"W":-0.71368451,"magnitude":15.527543288626921,"P":0.1008483}} ...]
   }
   ```
4. The `.geojson` file is processed using [`tippecanoe`](https://github.com/mapbox/tippecanoe) to generate a `.mbtiles` file. The example shows how to convert a `input.geojson` file to a `output.mbtiles` file.
   ```sh
   tippecanoe -o output.mbtiles --drop-densest-as-needed -zg input.geojson
   ```
5. The `.mbtiles` file is served using a mbtiles server, such as using Mapbox Studio or a custom MBTiles server.
   - Using Mapbox Studio
     1. Login to [Mapbox account](https://account.mapbox.com)
     2. Select 'Data manager'
     3. Click 'New tileset'
     4. Upload the `.mbtiles` file
6. The `.mbtiles` file can be added into Mapbox GLJS using the following code:

   - Adding the source

     ```js
     // Using Mapbox Studio
     map.addSource('cfd', {
       type: 'vector',
       url: 'mapbox://<tileset-id>', // click the share button to see the tileset id
     });

     // Using a self-hosted server
     map.addSource('cfd', {
       type: 'vector',
       tiles: ['http://localhost:8000/tiles/{z}/{x}/{y}'],
     });
     ```

   - Displaying the data

     ```js
     map.addLayer({
       id: 'points',
       type: 'circle',
       source: 'cfd', // corresponds to the source name in addSource
       'source-layer': 'output', // corresponds to the output file name in tippecanoe, unless using the --layer flag
       paint: {
         'circle-radius': 3,
         'circle-color': [
           'interpolate',
           ['linear'],
           ['get', 'P'],
           0,
           '#440154',
           0.1,
           '#21918c',
           0.2,
           '#fde725',
         ],
       },
     });
     ```
