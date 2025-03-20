/* import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
import SearchBar from "../../components/SearchBar";
import FilterButton from "../../components/FilterButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const carParks = [
  {
    id: 1,
    name: "The Wave",
    address: "110 Nanyang Cres, Singapore 636956",
    distance: "500M",
    availableLots: 50,
    parkingRates: "$1.50/hour",
    googleReview: "4.5/5",
  },
  {
    id: 2,
    name: "The Hive",
    address: "52 Nanyang Ave · 6791 1744",
    distance: "800M",
    availableLots: 30,
    parkingRates: "$2.00/hour",
    googleReview: "4.2/5",
  },
  {
    id: 3,
    name: "Marina Barrage",
    address: "8 Marina Gardens Dr, Singapore 018951",
    distance: "2KM",
    availableLots: 100,
    parkingRates: "$1.00/hour",
    googleReview: "4.7/5",
  },
]; // Mock data with details

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSearch = (query) => {
    if (query.toLowerCase() === "jurong point") {
      setSearchResults(carParks);
    } else {
      setSearchResults([]);
    }
  };

  const handleFilterSelect = (filters) => {
    setSelectedFilters(filters);
    console.log("Selected filters:", filters);
    // filter logic here
  };

  const filterOptions = [
    { label: "1. Shortest Distance", value: "shortest_distance" },
    { label: "2. Cheapest Parking", value: "cheapest_parking" },
    { label: "3. EV Parking", value: "ev_parking" },
    { label: "4. Sheltered Parking", value: "sheltered_parking" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBarContainer}>
          <SearchBar onSearch={handleSearch} />
        </View>

        <FilterButton
          filterOptions={filterOptions}
          onFilterSelect={handleFilterSelect}
        >
          <TouchableOpacity
            style={styles.filterIconContainer}
            onPress={() => {}}
          >
            <Ionicons name="filter" size={20} color="#00C3FF" />
          </TouchableOpacity>
        </FilterButton>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }} // Singapore
      />

      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.carParkItem}
              onPress={() =>
                router.push({
                  pathname: "/viewCarParkDetails",
                  params: { carPark: JSON.stringify(item) }, // Pass car park details as params
                })
              }
            >
              <Text style={styles.carParkName}>{item.name}</Text>
              <Text style={styles.carParkAddress}>{item.address}</Text>
              <Text style={styles.carParkDistance}>{item.distance}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  searchWrapper: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBarContainer: {
    flex: 1,
    marginRight: 5,
  },
  filterIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    padding: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  map: {
    flex: 1,
  },
  carParkItem: {
    backgroundColor: "#2E2E2E",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  carParkName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  carParkAddress: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  carParkDistance: {
    fontSize: 12,
    color: "#00C3FF",
  },
}); 

export default Home; */
