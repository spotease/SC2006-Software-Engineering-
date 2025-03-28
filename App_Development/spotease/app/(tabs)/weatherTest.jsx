<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';
import ConvertPostalToRegion from '../../hooks/convertPostalToRegion';

const WeatherTest = () => {
  const [userInput, setUserInput] = useState("");
  const {region} = ConvertPostalToRegion({userInput});
  console.log(region)
=======
import React, { useState } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';
import ConvertPostalToRegion from '../../hooks/convertPostalToRegion';
import CarparkTypeFilter from '../../hooks/carparkTypeFilter'

const WeatherTest = () => {
  const [userInput, setUserInput] = useState("");

  // Call ConvertPostalToRegion function properly
  const {region} = ConvertPostalToRegion({ userInput });
  const {forecastResult} = WeatherAPI({region});
  const { buildingTypeResult } = CarparkTypeFilter(forecastResult) || {}; // Handle undefine

  //forecast result


>>>>>>> 8d264ad1fb8fa67fa13012776460051a9f434897
  const handleSearch = (input) => {
    setUserInput(input);
  };

  return (
    <View style={styles.container}>
      <SearchBar query={userInput} onSearch={handleSearch} />
<<<<<<< HEAD
      <WeatherAPI userInput={region} />
=======
      <Text>{buildingTypeResult}</Text>

>>>>>>> 8d264ad1fb8fa67fa13012776460051a9f434897
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
