import decodePolyline from "./decodePolyline";
import getAuthToken from "./getAuthToken";

async function routingAPI(startDestination, endDestination) {
  if (!startDestination || !endDestination) {
    console.log("Missing start or end destination");
    return null; // Return null to indicate failure
  }

  try {
    const authToken = await getAuthToken();
    console.log(authToken);
    if (!authToken) {
      console.log("Failed to retrieve auth token.");
      return null; // Return null if token retrieval fails
    }

    const baseURL = "https://www.onemap.gov.sg/api/public/routingsvc/route?";
    const startPointStr =
      "start=" +
      startDestination.LATITUDE +
      "%2C" +
      startDestination.LONGITUDE +
      "&";
    const endPointStr =
      "end=" + endDestination.LATITUDE + "%2C" + endDestination.LONGITUDE + "&";
    const routeType = "routeType=drive";
    const url = baseURL + startPointStr + endPointStr + routeType;

    //console.log(url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data; // Return the routing data
  } catch (error) {
    console.error("Error in routingAPI:", error);
    return null; // Return null in case of error
  }
}

export default routingAPI;
