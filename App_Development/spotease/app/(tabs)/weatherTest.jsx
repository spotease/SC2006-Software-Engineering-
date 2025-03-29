import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';
import ConvertPostalToRegion from '../../hooks/convertPostalToRegion';
import useAutoLogout from '../../hooks/useAutoLogout';

const WeatherTest = () => {
  const [userInput, setUserInput] = useState('');
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
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }
  
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
  
    try {
      const res = await fetch('https://sc2006-backend-spotease.onrender.com/profile/locationHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mockData),
      });
  
      const text = await res.text(); 
  
      let data;
      try {
        data = JSON.parse(text); 
      } catch (err) {
        console.warn('Non-JSON response:', text); 
        throw new Error(`Invalid JSON response: ${text}`);
      }
  
      if (res.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.error || 'Failed to save location');
      }
    } catch (err) {
      console.error('Error saving location:', err);
      Alert.alert('Error', err.message || 'Something went wrong.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleTapAnywhere}>
      <View style={styles.container}>
        <SearchBar query={userInput} onSearch={handleSearch} />
        <Text>Region: {region}</Text>
        <Text>Forecast: {forecast || 'No forecast available'}</Text>
        <Text style={{ marginTop: 20, color: 'gray' }}>
          Tap screen to reset inactivity timer
        </Text>

        <Button title="Save Mock Location" onPress={handleSaveLocation} />
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
});

export default WeatherTest;
