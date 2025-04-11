import getAuthToken from "../Auth/getAuthToken";

async function reverseGeocode(LATITUDE, LONGITUDE) {
  if (!LATITUDE || !LONGITUDE) {
    console.log("Missing latitude or longitude");
    return null; // Return null to indicate failure
  }

  try {
    const authToken = await getAuthToken();
    if (!authToken) {
      console.log("Failed to retrieve auth token.");
      return null; // Return null if token retrieval fails
    }

    const baseURL = "https://www.onemap.gov.sg/api/public/revgeocode?";
    const locationStr = `location=${LATITUDE},${LONGITUDE}&`; // Format the location parameter
    const buffer = "buffer=500&"; // Buffer size

    const URL = baseURL + locationStr + buffer; // Construct the URL
    console.log(URL); // Log the URL for debugging

    const response = await fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = (await response.json()).GeocodeInfo;
    return data;
  } catch (error) {
    console.error("Error in reverseGeocode:", error);
    return null; // Return null in case of error
  }
}

export default reverseGeocode;
