import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';

const WeatherTest = () => {
  const [userInput, setUserInput] = useState("");

  const handleSearch = (input) => {
    setUserInput(input);
  };

  return (
    <View style={styles.container}>
      <SearchBar query={userInput} onSearch={handleSearch} />
      <WeatherAPI userInput={userInput} />
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
