// hooks/weatherAPI.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherAPI = ({userInput}) => {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    if (!userInput) return;

    const fetchWeather = async () => {
      const url = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

      try {
        const response = await fetch(url);
        const data = await response.json();

        // Extract forecasts
        const forecasts = data.items[0].forecasts;

        // Find forecast for the user-input area (case-insensitive match)
        const match = forecasts.find(forecastResult =>
          forecastResult.area.toLowerCase().includes(userInput.toLowerCase())
        );

        if (match) {
          setForecast(match.forecast);
        } else {
          setForecast(null);
          console.log("No matching forecast found.");
        }

        return forecast;
      } catch (error) {
        console.error("Weather API error:", error);
      }
    };

    fetchWeather();
  }, [userInput]);

  return {forecast};
};


export default WeatherAPI;


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