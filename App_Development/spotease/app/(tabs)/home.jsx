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
import * as Location from "expo-location";
import carParkRetrieval from "../../hooks/carParkRetrieval";
import WeatherAPI from "../../hooks/weatherAPI";
import carparkTypeFilter from "../../hooks/carparkTypeFilter";
import ConvertPostalToRegion from "../../hooks/convertPostalToRegion";



const Home = () => {
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { searchResults, loadingFlag } = searchAPI(searchQuery);

  const [selectedDest, setSelectedDest] = useState(null);
  const [filterRadius, setFilterRadius] = useState(100);
  const { sortedCarParks, readyCPFlag } = carParkRetrieval(
    selectedDest,
    filterRadius
  );

  const [mapMarkers, setMapMarkers] = useState([]);
  const [destMarker, setDestMarker] = useState({});
  const { selectedRegion } = ConvertPostalToRegion(selectedDest);
  const {forecast} = WeatherAPI(selectedRegion);
  //const {filteredParking} = carparkTypeFilter(forecast,sortedCarParks);
  const {filteredParking} = carparkTypeFilter(selectedFilters,sortedCarParks);



  // useEffect(() => {
  //   if (readyCPFlag && sortedCarParks) {
  //     // console.log("Test 2:");
  //     // console.log(sortedCarParks);
  //     setMapMarkers([]); // Clear previous markers
  //     sortedCarParks.map((item) => {
  //       // console.log(item);
  //       //addMarker(item);
  //     });
  //   }
  // }, [readyCPFlag]);

  useEffect(() => {
    if(filteredParking && filteredParking.length > 0) {
      console.log("Filtered Parking:", filteredParking);
      setMapMarkers([]); // Clear previous markers
      filteredParking.map((item) => {
        // console.log(item);
        addMarker(item);
      });
    }
  },[filteredParking]);
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
    // Reset all filters to false by default
    const updatedFilters = {
      sheltered_parking: false,  // Reset to false
      weather_parking_recommendation: false,  // Reset to false
      ...filters,  // Spread the incoming filters to apply the selected filter
    };
  
    // Log the updated filter values after resetting
    console.log("selected filters:", updatedFilters);
  
    // Update the selected filters state with the new filters object
    setSelectedFilters(updatedFilters);
  
    // If distance is set, adjust the filter radius
    if (updatedFilters.distance != undefined) {
      setFilterRadius(updatedFilters.distance / 2);
    }
  
    // Handle Sheltered Parking filter logic
    if (updatedFilters.sheltered_parking) {
      console.log("Sheltered parking filter selected");
      // Implement sheltered parking filtering logic
      
    }
  
    // Handle Weather Parking Recommendation filter logic
    if (updatedFilters.weather_parking_recommendation) {
      console.log("Weather parking recommendation filter selected");
      console.log(selectedRegion);
      console.log(forecast);

    }
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
    setSelectedDest(item);
    setSearchQuery("");
    console.log("Destination Selected");
  };

  const addMarker = (item) => {
    console.log("Adding marker:", item.ADDRESS);
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
    { label: "1. Sheltered Parking", value: "sheltered_parking" }, 
    {
      label: "2. Weather Parking Recommendation",
      value: "weather_parking_recommendation",
    }, // This is just an example, you can adjust the labels accordingly.
  ];
  

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
        {mapMarkers.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.LATITUDE,
                longitude: item.LONGITUDE,
              }}
              title={item.ADDRESS}
              description={`Lat: ${item.LATITUDE}, Lng: ${item.LONGITUDE}`}
              pinColor="blue" // Car parks are marked in red
            />
          ))}
      </MapView>

      {!loadingFlag && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
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