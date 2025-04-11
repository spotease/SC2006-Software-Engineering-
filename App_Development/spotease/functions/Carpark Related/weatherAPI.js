const WeatherAPI = async (userInput) => {
  const url = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Extract forecasts
    const forecastData = data.items[0].forecasts;

    // Find forecast for the user-input area (case-insensitive match)
    const match = forecastData.find((forecastResult) =>
      forecastResult.area.toLowerCase().includes(userInput.toLowerCase())
    );

    if (match) {
      return match.forecast;
    } else {
      return null;
      console.log("No matching forecast found.");
    }
  } catch (error) {
    console.error("Weather API error:", error);
  }
};

export default WeatherAPI;
