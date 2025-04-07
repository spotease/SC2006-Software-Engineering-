import { useEffect,useState } from "react";

const indoorCarpark = [
  "MULTI-STOREY CAR PARK",
  "SURFACE/MULTI- CAR PARK",
  "COVERED CAR PARK",
  "BASEMENT CAR PARKSTOREY",
  "MECHANISED CAR PARK",
];

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


const carparkTypeFilter = (weatherForecastInput, carparkInfo,selectedFilters) => {
  const [filteredParking,setFilteredParking] = useState([]); // Initialize filteredParking state

  

  useEffect(() => {
    if (!weatherForecastInput || !(carparkInfo.length >0)||!selectedFilters) 
    {
      setFilteredParking([]);
      return;

    }
    let tempList = [];
    let IndoorRequired=false;
    if (selectedFilters.sheltered_parking) IndoorRequired = true;
    else if (selectedFilters.weather_parking_recommendation) IndoorRequired = recommendIndoor.includes(weatherForecastInput)
    console.log("weather:",weatherForecastInput);
    console.log("Indoor Required:", IndoorRequired);

    if (!IndoorRequired) {
      console.log("No filter applied, returning all car parks.");
      setFilteredParking(carparkInfo); // No filter applied if the weather is not in the recommended indoor list
      return;
    }


    // Iterate through carparkInfo and filter for indoor car parks
    for (let i = 0; i < carparkInfo.length; i++) {
      if (indoorCarpark.includes(carparkInfo[i].CARPARK_TYPE)) {
        tempList.push(carparkInfo[i]);
      }
    }

    setFilteredParking(tempList);

},[weatherForecastInput, carparkInfo,selectedFilters]); // Add dependencies to the useEffect

  return {filteredParking};
}

export default carparkTypeFilter;


// Possible values for forecast include:
// Fair
// Fair (Day)
// Fair (Night)
// Fair and Warm
// Partly Cloudy
// Partly Cloudy (Day)
// Partly Cloudy (Night)
// Cloudy
// Hazy
// Slightly Hazy
// Windy
// Mist
// Fog
// Light Rain
// Moderate Rain
// Heavy Rain
// Passing Showers
// Light Showers
// Showers
// Heavy Showers
// Thundery Showers
// Heavy Thundery Showers
// Heavy Thundery Showers with Gusty Winds