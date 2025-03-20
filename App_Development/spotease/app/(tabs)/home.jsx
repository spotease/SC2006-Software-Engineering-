import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import SearchBar from "../../components/SearchBar";
import FilterButton from "../../components/FilterButton";
import { Ionicons } from "@expo/vector-icons";
import searchAPI from "../../hooks/searchAPI";
import convertWGS84ToSVY21 from "../../hooks/convertWGS84ToSVY21";
import * as Location from "expo-location";

const Home = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [resultAvailable, setResultAvailable] = useState(false);
  const [processedResults, setProcessedResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { searchResults, loadingFlag } = searchAPI(searchQuery);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [destMarker, setDestMarker] = useState({});

  // Get current location when the app loads
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleFilterSelect = (filters) => {
    setSelectedFilters(filters);
    console.log("Selected filters:", filters);
  };

  const handleDestinationPress = (item) => {
    const markerProperties = {
      ADDRESS: item.ADDRESS,
      LATITUDE: item.LATITUDE,
      LONGITUDE: item.LONGITUDE,
      X: item.X,
      Y: item.Y,
    };
    setDestMarker(markerProperties);
    setSearchQuery("");
    console.log("Destination Selected");
  };

  const addMarker = (item) => {
    const newMarker = {
      id: mapMarkers.length + 1,
      ADDRESS: item.ADDRESS,
      LATITUDE: item.LATITUDE,
      LONGITUDE: item.LONGITUDE,
      X: item.X,
      Y: item.Y,
    };

    setMapMarkers((prevMapMarkers) => [...prevMapMarkers, newMarker]);
  };

  const filterOptions = [
    { label: "1. Shortest Distance", value: "shortest_distance" },
    { label: "2. Cheapest Parking", value: "cheapest_parking" },
    { label: "3. EV Parking", value: "ev_parking" },
    { label: "4. Sheltered Parking", value: "sheltered_parking" },
  ];

  useEffect(() => {
    if (searchResults && searchResults.results) {
      const slicedResults = searchResults.results.slice(0, 5); // Slice the first 5 results
      const processing = slicedResults.map((result) => {
        const ADDRESS = result.ADDRESS;
        const LATITUDE = parseFloat(result.LATITUDE);
        const LONGITUDE = parseFloat(result.LONGITUDE);
        const [X, Y] = convertWGS84ToSVY21(LATITUDE, LONGITUDE);
        return {
          ADDRESS,
          LONGITUDE,
          LATITUDE,
          X,
          Y,
        };
      });
      setProcessedResults(processing);
      setResultAvailable(true);
      setProcessedResults(processing); // Store processed results in state
      setResultAvailable(true); // Set result available flag to true
    } else {
      setResultAvailable(false);
    }
  }, [searchResults]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBarContainer}>
          <SearchBar query={searchQuery} onSearch={setSearchQuery} />
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
        region={
          location || {
            latitude: 1.3521, // Default: Singapore if current location is denied
            longitude: 103.8198,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/*Destination Marker*/}
        {destMarker.LATITUDE && destMarker.LONGITUDE && (
          <Marker
            coordinate={{
              latitude: destMarker.LATITUDE,
              longitude: destMarker.LONGITUDE,
            }}
          ></Marker>
        )}
        {/* You can customize the marker */}
        {processedResults &&
          processedResults.map((carPark, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: carPark.LATITUDE,
                longitude: carPark.LONGITUDE,
              }}
              title={carPark.ADDRESS}
              description={`Lat: ${carPark.LATITUDE}, Lng: ${carPark.LONGITUDE}`}
              pinColor="blue" // Car parks are marked in red
            />
          ))}
      </MapView>

      {resultAvailable && !loadingFlag && (
        <FlatList
          data={processedResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                handleDestinationPress(item);
              }}
            >
              <View style={styles.box}>
                <Text style={styles.carParkAddress}>{item.ADDRESS}</Text>
              </View>
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
  carParkAddress: {
    fontSize: 14,
    color: "#4B0082",
  },
  box: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#A4D200",
    borderColor: "#A4D200",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
