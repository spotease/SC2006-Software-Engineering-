import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { SearchBar } from "react-native-elements";

export default function homeTest() {
  let [searchResults, setSearchResults] = useState(null);
  let [loadingFlag, setLoadingFlag] = useState(false);
  const [userInput, setUserInput] = useState("");
  state = { search: "" };

  const fetchSearch = async () => {
    setLoadingFlag(true); // Set loading flag to true
    try {
      const baseURL = "https://www.onemap.gov.sg/api/common/elastic/search?";
      const params = new URLSearchParams({
        searchVal: userInput, // Dynamically set searchVal
        returnGeom: "Y",
        getAddrDetails: "Y",
      });
      if (!userInput) {
        setSearchResults(null);
        return null;
      }
      const url = `${baseURL}${params}`;
      const authToken =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlYmU0OWUwNzZjNDIxZmNjNGM1YWI2ZTA1OGE0ZWVmYiIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC1uZXctMTYzMzc5OTU0Mi5hcC1zb3V0aGVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbS9hcGkvdjIvdXNlci9wYXNzd29yZCIsImlhdCI6MTc0MTY4OTUzNywiZXhwIjoxNzQxOTQ4NzM3LCJuYmYiOjE3NDE2ODk1MzcsImp0aSI6IlpDMXlIQlF6d0o5TGNPVDQiLCJ1c2VyX2lkIjo2MzEzLCJmb3JldmVyIjpmYWxzZX0.reqCarba6knwaMSo_DOA_clMtZ3E-XwZBcth_oG8gQw"; // Replace with your access token

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${authToken}`, // API token for authorization
        },
      });
      if (!response.ok) {
        throw new Error("Failed To Fetch");
      }

      const data = await response.json();
      console.log(data);
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFlag(false); // Set loading flag to false
    }
  };

  useEffect(() => {
    fetchSearch();
  }, []);

  return (
    <View style={styles.container}>
      {loadingFlag && <Text>Loading...</Text>}
      <Text style={styles.resultText}>Search Results:</Text>
      {searchResults &&
      searchResults.results &&
      searchResults.results.length > 0 ? (
        <ScrollView style={styles.searchResultsContainer}>
          {/* Display only the first 10 results */}
          {searchResults.results.slice(0, 10).map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text>{result.ADDRESS}</Text>
              <Text>Latitude: {result.LATITUDE}</Text>
              <Text>Longitude: {result.LONGITUDE}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>No results found.</Text>
      )}
      <SearchBar
        style={styles.searchBar}
        placeholder="Enter search query"
        onChangeText={(userInput) => setUserInput(userInput)}
        clearButtonMode="always"
        value={userInput}
      />
      <Text>{userInput}</Text>
      <Button title="Fetch Data" onPress={fetchSearch} />
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
