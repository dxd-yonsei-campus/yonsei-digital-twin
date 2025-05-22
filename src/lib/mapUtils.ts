export const flyToLocation = (longitude: number, latitude: number) => {
  window.map.flyTo({
    center: [longitude, latitude],
    zoom: 17,
    pitch: 45,
    bearing: 0,
    duration: 2000,
  });
};
