import checkIndoorRequired from './checkIndoorRequired';

const indoorCarpark = [
  "MULTI-STOREY CAR PARK",
  "SURFACE/MULTI- CAR PARK",
  "COVERED CAR PARK",
  "BASEMENT CAR PARKSTOREY",
  "MECHANISED CAR PARK",
];


const carparkTypeFilter = (weatherForecastInput, carparkInfo, selectedFilters) => {
  // console.log("carparkInfo:", carparkInfo);
  // console.log("selectedFilters:", selectedFilters);

  if (!weatherForecastInput || !(carparkInfo.length > 0) || !selectedFilters) return;

  let IndoorCarparkList = [];
  let IndoorRequired = checkIndoorRequired(weatherForecastInput, selectedFilters); // ✅ use helper

  // console.log("weather:", weatherForecastInput);
  // console.log("Indoor Required:", IndoorRequired);

  if (!IndoorRequired) {
    // console.log("No filter applied, returning all car parks.");
    return carparkInfo;
  }
  for (let i = 0; i < carparkInfo.length; i++) {
    if (indoorCarpark.includes(carparkInfo[i].CARPARK_TYPE)) {
      IndoorCarparkList.push(carparkInfo[i]);
    }
  }
  // console.log("Indoor Carpark List:", IndoorCarparkList);
  return IndoorCarparkList;
};

export default carparkTypeFilter;