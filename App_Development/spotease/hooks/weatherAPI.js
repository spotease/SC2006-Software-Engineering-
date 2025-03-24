// hooks/weatherAPI.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WeatherAPI = ({ userInput }) => {
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
          forecastResult.area.toLowerCase().includes(userInput.trim().toLowerCase())
        );

        if (match) {
          setForecast(match);
          console.log(`Forecast for ${match.area}: ${match.forecastResult}`);
        } else {
          setForecast(null);
          console.log("No matching forecast found.");
        }
      } catch (error) {
        console.error("Weather API error:", error);
      }
    };

    fetchWeather();
  }, [userInput]);

  return (
    <View style={styles.container}>
      {forecast ? (
        <Text style={styles.result}>
          {forecast.area}: {forecast.forecast}
        </Text>
      ) : (
        <Text style={styles.placeholder}>Enter a region name to search forecast</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  result: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
  },
});

export default WeatherAPI;
