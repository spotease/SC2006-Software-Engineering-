import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';
import ConvertPostalToRegion from '../../hooks/convertPostalToRegion';

const WeatherTest = () => {
  const [userInput, setUserInput] = useState("");
  const {region} = ConvertPostalToRegion({userInput});
  console.log(region)
  const handleSearch = (input) => {
    setUserInput(input);
  };

  return (
    <View style={styles.container}>
      <SearchBar query={userInput} onSearch={handleSearch} />
      <WeatherAPI userInput={region} />
    </View>
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
