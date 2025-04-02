const url = "https://api.data.gov.sg/v1/transport/carpark-availability";
const options = { method: "GET" };

const retrieveLotsAPI = async () => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items[0].carpark_data;
  } catch (error) {
    console.error(error);
  }
};

export default retrieveLotsAPI;
