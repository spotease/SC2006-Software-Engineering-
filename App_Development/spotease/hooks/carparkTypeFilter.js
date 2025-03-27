import React, { useState, useEffect } from "react";

const carparkType = {
    "indoor": ["MULTI-STOREY CAR PARK","SURFACE/MULTI- CAR PARK","COVERED CAR PARK","BASEMENT CAR PARKSTOREY","MECHANISED CAR PARK"],
    "outdoor": ["SURFACE CAR PARK","MECHANISED AND SURFACE CAR PARK"],
}

const recommendIndoor = [
    "Light Rain",
    "Moderate Rain",
    "Heavy Rain",
    "Thundery Showers",
    "Heavy Thundery Showers",
    "Heavy Thundery Showers with Gusty Winds"
];


const carparkTypeFilter = (weatherForecastInput, carparkInfo) => {
    const IndoorRequired = recommendIndoor.includes(weatherForecastInput);
    const preferredType = IndoorRequired ? "indoor":"outdoor";
    processedCarparkInfo = carparkInfo.map((item) => {
        if(carparkType[preferredType].includes(processedCarparkInfo)&&IndoorRequired) 
            return item;

        return null;
    })


   
}

export default carparkTypeFilter;


//SURFACE CAR PARK
// MULTI-STOREY CAR PARK
// BASEMENT CAR PARKSTOREY
// SURFACE/MULTI- CAR PARK
// COVERED CAR PARK
// MECHANISED AND SURFACE CAR PARK
// MECHANISED CAR PARK


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