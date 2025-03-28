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
import ConvertCoords from "../../hooks/ConvertCoords";
import * as Location from "expo-location";
import carParkRetrieval from "../../hooks/carParkRetrieval";

const Home = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [resultAvailable, setResultAvailable] = useState(false);
  const [processedResults, setProcessedResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState({});
  const { searchResults, loadingFlag } = searchAPI(searchQuery);

  const [selectedDest, setSelectedDest] = useState(null);
  const [filterRadius, setFilterRadius] = useState(0);
  const { carParks, readyCPFlag } = carParkRetrieval(
    selectedDest,
    filterRadius
  );

  const [mapMarkers, setMapMarkers] = useState([]);
  const [destMarker, setDestMarker] = useState({});

  useEffect(() => {
    if (readyCPFlag && carParks) {
      const processedCarparks = carParks.map((item) => {
        const [cLatitude, cLongtitude] = ConvertCoords.SVY21ToWGS84(
          item.x_coord,
          item.y_coord
        );
        return {
          ADDRESS: item.address,
          CARPARK_NO: item.car_park_no,
          LATITUDE: cLatitude,
          LONGITUDE: cLongtitude,
          X: item.x_coord,
          Y: item.y_coord,
        };
      });
      console.log("Test 2:");
      console.log(processedCarparks);
      processedCarparks.map((item) => {
        console.log(item);
        addMarker(item);
      });
    }
  }, [readyCPFlag, carParks]);

  // Get current location when the app loads
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
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
    setFilterRadius(100);
    setDestMarker(markerProperties);
    setSelectedDest(item);
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
        const [X, Y] = ConvertCoords.WGS84ToSVY21(LATITUDE, LONGITUDE);
        return {
          ADDRESS,
          LONGITUDE,
          LATITUDE,
          X,
          Y,
        };
      });
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
        initialRegion={{
          latitude: 1.2868108, // Center latitude
          longitude: 103.8545349, // Center longitude
          latitudeDelta: 0.05, // Zoom level
          longitudeDelta: 0.05, // Zoom level
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {mapMarkers &&
          mapMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.LATITUDE,
                longitude: marker.LONGITUDE,
              }}
              title={marker.CARPARK_NO}
              description={marker.ADDRESS}
            ></Marker>
          ))}
        {/*Destination Marker*/}
        {destMarker.LATITUDE && destMarker.LONGITUDE && (
          <Marker
            coordinate={{
              latitude: destMarker.LATITUDE,
              longitude: destMarker.LONGITUDE,
            }}
          ></Marker>
        )}
        {/*User Location Marker*/}
        {userLocation.latitude && userLocation.longitude && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Hello"
            pinColor="white"
          ></Marker>
        )}
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
