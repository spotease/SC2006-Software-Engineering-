const recommendIndoor = [
  "Light Rain",
  "Moderate Rain",
  "Heavy Rain",
  "Passing Showers",
  "Thundery Showers",
  "Heavy Thundery Showers",
  "Heavy Thundery Showers with Gusty Winds",
  "Cloudy",
  "Showers",
];

const checkIndoorRequired = (forecast, selectedFilters) => {
  if (!selectedFilters) return false;

  if (selectedFilters.sheltered_parking) return true;
  if (selectedFilters.weather_parking_recommendation) {
    return recommendIndoor.includes(forecast);
  }

  return false;
};

export default checkIndoorRequired;
