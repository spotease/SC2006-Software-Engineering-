import polyline from "polyline";

export function decodePolyline(routeGeometry) {
  return polyline.decode(routeGeometry);
}

export default decodePolyline;
/*How to Display Polyline*/
/*
<Polyline
  coordinates={routeCoordinates.map((coord) => ({
    latitude: coord[0],
    longitude: coord[1],
  }))}
  strokeColor="blue" // Route line color
  strokeWidth={4} // Line thickness
/>
*/
