import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createLocationHistory from '../../hooks/createLocationHistory';
import fetchLocationHistory from '../../hooks/fetchLocationHistory';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';
import ConvertPostalToRegion from '../../hooks/convertPostalToRegion';
import useAutoLogout from '../../hooks/useAutoLogout';

const WeatherTest = () => {
  const [userInput, setUserInput] = useState('');
  const [locationHistory, setLocationHistory] = useState([]);
  const { resetTimer } = useAutoLogout();

  const { region } = ConvertPostalToRegion({ userInput });
  const { forecast } = WeatherAPI({ userInput: region });

  const handleSearch = (input) => {
    setUserInput(input);
    resetTimer();
  };

  const handleTapAnywhere = () => {
    Keyboard.dismiss();
    resetTimer();
  };

  const handleSaveLocation = async () => {
    const mockData = {
      coordinates: {
        latitude: 1.3521,
        longitude: 103.8198,
        x_coor: 123.45,
        y_coor: 678.90,
      },
      locationAddress: region || 'Unknown Area',
      locationType: 'WeatherTest',
    };

    await createLocationHistory(mockData);
  };

  const handleFetchLocation = async () => {
    const data = await fetchLocationHistory();
    if (data?.history) {
      setLocationHistory(data.history);
      console.log("📍 Location History:", data.history);
    }
  };

  const renderLocationHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>📍 Location History:</Text>
      {locationHistory.map((item, index) => (
        <View key={index} style={styles.historyItem}>
          <Text>{item.locationAddress}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={handleTapAnywhere}>
      <View style={styles.container}>
        <SearchBar query={userInput} onSearch={handleSearch} />
        <Text>Region: {region}</Text>
        <Text>Forecast: {forecast || 'No forecast available'}</Text>
        <Text style={styles.infoText}>Tap screen to reset inactivity timer</Text>

        <Button title="Save Mock Location" onPress={handleSaveLocation} />
        <Button title="View Mock Location" onPress={handleFetchLocation} />

        {locationHistory.length > 0 && renderLocationHistory()}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  infoText: {
    marginTop: 20,
    color: 'gray',
  },
  historyContainer: {
    marginTop: 20,
    backgroundColor: '#e9f2ff',
    borderRadius: 10,
    padding: 10,
  },
  historyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  historyItem: {
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

export default WeatherTest;
