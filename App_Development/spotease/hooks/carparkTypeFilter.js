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


const carparkTypeFilter = (weatherForecastInput, carparkInfo) => {
  const [filteredParking,setFilteredParking] = useState([]); // Initialize filteredParking state

  

  useEffect(() => {
    console.log("Weather Forecast Input:", weatherForecastInput);
    // console.log("Carpark Info:", carparkInfo); 
    if (!weatherForecastInput || !carparkInfo.length) 
    {
      setFilteredParking([]);
      return;

    }
    
    //const IndoorRequired = recommendIndoor.includes(weatherForecastInput);
    const IndoorRequired = weatherForecastInput.sheltered_parking;
    if (!IndoorRequired) {
      setFilteredParking(carparkInfo); // No filter applied if the weather is not in the recommended indoor list
      console.log("INDOOR:"+filteredParking);
      return;
    }

    let tempList = [];

    // Iterate through carparkInfo and filter for indoor car parks
    for (let i = 0; i < carparkInfo.length; i++) {
      if (indoorCarpark.includes(carparkInfo[i].CARPARK_TYPE)) {
        tempList.push(carparkInfo[i]);
      }
    }

    setFilteredParking(tempList);

},[weatherForecastInput, carparkInfo]); // Add dependencies to the useEffect

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