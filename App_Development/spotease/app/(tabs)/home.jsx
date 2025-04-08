import React, { useState, useEffect,useRef} from "react";
import {View, StyleSheet, FlatList, Text, TouchableOpacity} from "react-native";
import MapView, { Marker } from "react-native-maps";
import SearchBar from "../../components/SearchBar";
import FilterButton from "../../components/FilterButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import searchAPI from "../../hooks/searchAPI";
import * as Location from "expo-location";
import carParkRetrieval from "../../hooks/carParkRetrieval";
import WeatherAPI from "../../hooks/weatherAPI";
import carparkTypeFilter from "../../hooks/carparkTypeFilter";
import ConvertPostalToRegion from "../../hooks/convertPostalToRegion";
// import routingAPI from "../../hooks/routingAPI";




const Home = () => {
  const mapRef = useRef(null); // Create a ref for MapView
  const [selectedFilters, setSelectedFilters] = useState({
    sheltered_parking: false,
    weather_parking_recommendation: false,
  });
    const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const { searchResults, loadingFlag } = searchAPI(searchQuery); // Variable to store searchResults from User Input
  const [selectedDest, setSelectedDest] = useState(null); // Variable to store Destination of User
  const [filterRadius, setFilterRadius] = useState(1000 / 2); // Variable to store Filter Distance in (m)
  const { sortedCarParks } = carParkRetrieval(
    //Variable to store nearby Carparks sorted by nearest distance
    selectedDest,
    filterRadius
  );
  const [carParkMarkers, setCarParkMarkers] = useState([]); // Variable to store nearby Carpark Markers
  const [destMarker, setDestMarker] = useState({}); // Variable to store selected destination of User

  
  //Starting Initialization
  // useEffect(() => {
  //   // Reset all filters to false by default
  //   const updatedFilters = {
  //     sheltered_parking: false,  // Reset to false
  //     weather_parking_recommendation: false,  // Reset to false
  //   };
  //   setCarParkMarkers([]); 
  //   setSelectedFilters(updatedFilters); // Update the state with the new filters
  // },[]);


  useEffect(() => {
    if (!selectedDest || !sortedCarParks || !selectedFilters) return;
  
    const populateCPMarkers = async () => {
      const region = ConvertPostalToRegion(selectedDest.POSTAL);
      const forecastResult = await WeatherAPI(region);
      console.log("Postal Code", selectedDest.POSTAL);
      console.log("Region",region)
      console.log("Forecast Result:", forecastResult);

      const filtered = carparkTypeFilter(forecastResult, sortedCarParks, selectedFilters);
  
      setCarParkMarkers([]); // Clear previous markers
      setCarParkMarkers(filtered.map(item => ({
        id: item.CARPARK_NO,
        ADDRESS: item.ADDRESS,
        LATITUDE: item.LATITUDE,
        LONGITUDE: item.LONGITUDE,
        CARPARK_TYPE: item.CARPARK_TYPE,
        LOTS_AVAILABLE: item.LOTS_AVAILABLE,
        TOTAL_LOTS: item.TOTAL_LOTS,
        DISTANCEAWAY: item.DISTANCEAWAY
      })));
    };
  
    // First run (populate markers immediately)
    populateCPMarkers();
  
    // Zoom animation based on filter radius
    if (mapRef.current && selectedDest) {
      const delta = (filterRadius+500) / 100000;
      mapRef.current.animateToRegion({
        latitude: selectedDest.LATITUDE,
        longitude: selectedDest.LONGITUDE,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }, 1500);
    }
  
    // Second run after animation (ensures proper iOS display)
    const timeoutId = setTimeout(() => {
      populateCPMarkers();
    }, 3000); 
  
    return () => clearTimeout(timeoutId); // Cleanup
  }, [selectedFilters, sortedCarParks, selectedDest]);
  
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
        LATITUDE: loc.coords.latitude,
        LONGITUDE: loc.coords.longitude,

      });
    })();
  }, []);

  const handleFilterSelect = (filters) => {
    const updatedFilters = {
      sheltered_parking: !!filters.sheltered_parking,
      weather_parking_recommendation: !!filters.weather_parking_recommendation,
    };
  
    if (filters.distance !== undefined) {
      setFilterRadius(filters.distance / 2);
    }
  
    // console.log("Selected filters:", updatedFilters);
    setSelectedFilters(updatedFilters);
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

  if (mapRef.current) {
    mapRef.current.animateToRegion(
      {
        latitude: item.LATITUDE,
        longitude: item.LONGITUDE,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      2000
    );
  }
};

  

  const addCarParkMarker = (item) => {
    const newMarker = {
      id: carParkMarkers.length + 1,
      ADDRESS: item.ADDRESS,
      LATITUDE: item.LATITUDE,
      LONGITUDE: item.LONGITUDE,
      X: item.X,
      Y: item.Y,
      CARPARK_NO: item.CARPARK_NO,
      CARPARK_TYPE: item.CARPARK_TYPE,
      CARPARK_INFO: item.CARPARK_INFO,
      DISTANCEAWAY: item.DISTANCEAWAY,
      LOTS_AVAILABLE: item.LOTS_AVAILABLE,
      TOTAL_LOTS: item.TOTAL_LOTS
    };

    setCarParkMarkers((prevCarParkMarkers) => [...prevCarParkMarkers, newMarker]);
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
      ref={mapRef}
      style={styles.map}
      region={
        location || {
          latitude: 1.3521,
          longitude: 103.8198,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }
      }
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {/* Destination Marker */}
      {destMarker.LATITUDE && destMarker.LONGITUDE && (
        <Marker
          coordinate={{
            latitude: destMarker.LATITUDE,
            longitude: destMarker.LONGITUDE,
          }}
          key={`dest-${destMarker.LATITUDE}-${destMarker.LONGITUDE}`} // Unique key for destination marker
        />
      )}
      
      {/* Car Park Markers */}
      {carParkMarkers.map((item) => (
        <Marker
          key={`${item.CARPARK_NO}-${item.LATITUDE}-${item.LONGITUDE}`} // Combine CARPARK_NO and LAT/LNG to ensure uniqueness
          coordinate={{
            latitude: item.LATITUDE,
            longitude: item.LONGITUDE,
          }}
          pinColor="blue"
          onPress={() => {
            router.push({
              pathname: "/carParkDetails",
              params: {
                lotsavailable: item.LOTS_AVAILABLE,
                address: item.ADDRESS,
                totallots: item.TOTAL_LOTS,
                carparktype: item.CARPARK_TYPE,
                distanceaway: item.DISTANCEAWAY,
                lat: item.LATITUDE,
                lng: item.LONGITUDE,
              }
            });
          }}
        />
      ))}
    </MapView>

      {!loadingFlag && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `${item.ADDRESS}-${index}`}          renderItem={({ item }) => (
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
    color: "#E0E0E0",
  },
  box: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#5C6BC0",
    borderColor: "#5C6BC0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

export default Home; 