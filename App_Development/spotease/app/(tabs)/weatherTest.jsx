import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';
import ConvertPostalToRegion from '../../hooks/convertPostalToRegion';
import useAutoLogout from '../../hooks/useAutoLogout';

const WeatherTest = () => {
  const [userInput, setUserInput] = useState('');
  const { resetTimer } = useAutoLogout(); // 👈 use resetTimer

  const { region } = ConvertPostalToRegion({ userInput });
  const { forecast } = WeatherAPI({ userInput: region });

  const handleSearch = (input) => {
    setUserInput(input);
    resetTimer();
  };

  const handleTapAnywhere = () => {
    Keyboard.dismiss(); // optional
    resetTimer(); // 👈 reset on screen tap
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
