import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import SearchBar from "../../components/SearchBar";
import ConvertCoords from "../../hooks/ConvertCoords";
import searchAPI from "../../hooks/searchAPI";
import carParkRetrieval from "../../hooks/carParkRetrieval";

export default function homeTest() {
  const [userInput, setUserInput] = useState("");
  const { searchResults, loadingFlag } = searchAPI(userInput);
  const { sortedCarParks, readyCPFlag } = carParkRetrieval(
    searchResults[0],
    100
  );

  return (
    <View style={styles.container}>
      {loadingFlag && <Text>Loading...</Text>}
      <Text style={styles.resultText}>Search Results:</Text>
      {!loadingFlag ? (
        <ScrollView style={styles.searchResultsContainer}>
          {/* Display only the first 10 results */}
          {searchResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
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
