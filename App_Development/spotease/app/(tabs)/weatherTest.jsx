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


  const handleSearch = (input) => {
    setUserInput(input);
  };

  return (
    <View style={styles.container}>
      <SearchBar query={userInput} onSearch={handleSearch} />
      <Text>{buildingTypeResult}</Text>

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
