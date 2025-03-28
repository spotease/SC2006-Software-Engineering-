import proj4 from "proj4";

// Coordinate system definitions
const wgs84 = "EPSG:4326"; // WGS84
const svy21 =
  "+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +datum=WGS84 +units=m +no_defs"; // SVY21

const convertWGS84ToSVY21 = (latitude, longitude) => {
  if (isFinite(latitude) && isFinite(longitude)) {
    // Perform the coordinate transformation
    const result = proj4(wgs84, svy21, [longitude, latitude]);

    // Round the X and Y coordinates to whole numbers (integers)
    const roundedX = Math.round(result[0]);
    const roundedY = Math.round(result[1]);

    return [roundedX, roundedY]; // Returns [X, Y]
  }
};

export default convertWGS84ToSVY21;
