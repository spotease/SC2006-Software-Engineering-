import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import SearchBar from "../../components/SearchBar";
import searchAPI from "../../hooks/searchAPI";
import carParkRetrieval from "../../hooks/carParkRetrieval";
import WeatherAPI from "../../hooks/weatherAPI";
import carparkTypeFilter from "../../hooks/carparkTypeFilter";
import ConvertPostalToRegion from "../../hooks/convertPostalToRegion";

export default function homeTest() {
  const [userInput, setUserInput] = useState("");
  const { searchResults, loadingFlag } = searchAPI(userInput);
  const { sortedCarParks, readyCPFlag } = carParkRetrieval(
    searchResults[0],
    200
  );
  const { region } = ConvertPostalToRegion({ userInput });
  const { forecast } = WeatherAPI({ userInput: region });
  const [filteredParking, setFilteredParking] = useState({});
  useEffect(() => {
    setFilteredParking(
      carparkTypeFilter({
        weatherForecastInput: forecast,
        carparkInfo: sortedCarParks,
      })
    );
    if (filteredParking.length >= 1) {
      console.log("Hello");
      console.log(filteredParking);
    }
  }, [searchResults]);

  return (
    <View style={styles.container}>
      {loadingFlag && <Text>Loading...</Text>}
      <Text style={styles.resultText}>Search Results:</Text>
      {!loadingFlag ? (
        <ScrollView style={styles.searchResultsContainer}>
          {/* Display only the first 10 results */}
          {searchResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text>Testing Region:{region}</Text>
              <Text>Forecast: {forecast}</Text>
              <Text>{result.ADDRESS}</Text>
              <Text>
                Latitude: {result.LATITUDE} Longitude: {result.LONGITUDE}
              </Text>
              <Text>
                X: {result.X} Y: {result.Y}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>No results found.</Text>
      )}
      <SearchBar onSearch={setUserInput} />
      <Text>{userInput}</Text>
      {readyCPFlag && sortedCarParks[0] ? (
        <Text>{sortedCarParks[0].ADDRESS}</Text>
      ) : (
        <Text>False</Text>
      )}
      <Text>Filtered Parking:</Text>
      {filteredParking.length > 0 ? (
        filteredParking.map((park, index) => (
          <View key={index}>
            <Text>{park.ADDRESS}</Text>
          </View>
        ))
      ) : (
        <Text>No filtered parking available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  resultText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});
