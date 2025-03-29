import proj4 from "proj4";

// Coordinate system definitions
const wgs84 = "+proj=longlat +datum=WGS84 +no_defs"; // WGS84
const svy21 =
  "+proj=tmerc +lat_0=1.36666666666667 +lon_0=103.833333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +datum=WGS84 +units=m +no_defs"; // SVY21

const WGS84ToSVY21 = (latitude, longitude) => {
  if (isFinite(latitude) && isFinite(longitude)) {
    // Perform the coordinate transformation
    const result = proj4(wgs84, svy21, [longitude, latitude]);

    // Round the X and Y coordinates to 4d.p (float)
    const roundedX = Math.round(result[0] * 10000) / 10000;
    const roundedY = Math.round(result[1] * 10000) / 10000;

    return [roundedX, roundedY]; // Returns [X, Y]
  }
};

const SVY21ToWGS84 = (x_coords, y_coords) => {
  if (isFinite(x_coords) && isFinite(y_coords)) {
    // Perform the coordinate transformation
    const result = proj4(svy21, wgs84, [x_coords, y_coords]);

    //Result[1] = Latituide, Result[0] = Longtituide
    return [result[1], result[0]];
  }
};

export default { SVY21ToWGS84, WGS84ToSVY21 };
