import decodePolyline from "./decodePolyline";

const authToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlYmU0OWUwNzZjNDIxZmNjNGM1YWI2ZTA1OGE0ZWVmYiIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC1uZXctMTYzMzc5OTU0Mi5hcC1zb3V0aGVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbS9hcGkvdjIvdXNlci9zZXNzaW9uIiwiaWF0IjoxNzQzMDE3MTU1LCJleHAiOjE3NDMyNzYzNTUsIm5iZiI6MTc0MzAxNzE1NSwianRpIjoiNXhwTm9ZM1BvMHJjYldpVCIsInVzZXJfaWQiOjYzMTMsImZvcmV2ZXIiOmZhbHNlfQ.IQ5B9xu_gQHV07NksS-IgVlfIN51nDLvMZ8CZJqdowQ"; // Replace with your access token

function routingAPI(startDestination, endDestination) {
  if (!startDestination || !endDestination) {
    return;
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
  console.log(url);

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `${authToken}`, // API token for authorization
    },
  })
    .then((response) => response.json()) // Parse response as JSON
    .then((data) => console.log(data)) // Log the data to the console
    .catch((error) => console.error("Error:", error)); // Log any errors
}
export default routingAPI;
