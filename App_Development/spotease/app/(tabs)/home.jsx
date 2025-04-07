import React, { useState, useEffect, useRef } from "react";
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
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import searchAPI from "../../hooks/searchAPI";
import * as Location from "expo-location";
import carParkRetrieval from "../../hooks/carParkRetrieval";
import WeatherAPI from "../../hooks/weatherAPI";
import carparkTypeFilter from "../../hooks/carparkTypeFilter";
import ConvertPostalToRegion from "../../hooks/convertPostalToRegion";
import createLocationHistory from "../../hooks/createLocationHistory";
import calculateDistance from "../../hooks/calculateDistanceXY";
import ConvertCoords from "../../hooks/ConvertCoords";

const Home = () => {
  let [filteredParking] = [];
  const mapRef = useRef(null); // Create a ref for MapView
  const [selectedFilters, setSelectedFilters] = useState(null);
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

  //useEffect to populateCPMarkers
  useEffect(() => {
    const populateCPMarkers = async () => {
      let region = ConvertPostalToRegion(selectedDest.POSTAL);
      let forecastResult = await WeatherAPI(region);
      filteredParking = carparkTypeFilter(
        forecastResult,
        sortedCarParks,
        selectedFilters
      );

      setCarParkMarkers([]); // Clear previous markers
      if (filteredParking && filteredParking.length > 0) {
        // console.log("Filtered Parking:", filteredParking);
        filteredParking.map((item) => {
          //console.log(item);
          addCarParkMarker(item);
        });
      }
    };
    populateCPMarkers();
  }, [sortedCarParks, selectedFilters]); // Add dependencies to the useEffect

  //Run once when the component mounts
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let [X, Y] = ConvertCoords.WGS84ToSVY21(
        loc.coords.latitude,
        loc.coords.longitude
      );
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        LATITUDE: loc.coords.latitude,
        LONGITUDE: loc.coords.longitude,
        X: X,
        Y: Y,
      });
    };

    // Reset all filters to false by default
    getLocation();
    const updatedFilters = {
      sheltered_parking: false, // Reset to false
      weather_parking_recommendation: false, // Reset to false
    };
    setSelectedFilters(updatedFilters); // Update the state with the new filters
  }, []);

  const handleFilterSelect = async (filters) => {
    // Reset all filters to false by default
    const updatedFilters = {
      sheltered_parking: false, // Reset to false
      weather_parking_recommendation: false, // Reset to false
    };

    // Update the selected filters state with the new filters object
    setSelectedFilters(updatedFilters);

    // If distance is set, adjust the filter radius
    if (filters.distance != undefined) {
      setFilterRadius(filters.distance / 2);
    }

    if (filters.sheltered_parking) {
      updatedFilters.sheltered_parking = true;
    }
    if (filters.weather_parking_recommendation) {
      updatedFilters.weather_parking_recommendation = true;
    }
    setSelectedFilters(updatedFilters); // Update the state with the new filters
    console.log("Selected filters:", updatedFilters);
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

    // ✅ Call API to save location history
    createLocationHistory({
      coordinates: {
        latitude: item.LATITUDE,
        longitude: item.LONGITUDE,
        x_coor: item.X,
        y_coor: item.Y,
      },
      locationAddress: item.ADDRESS,
      locationType: "destination",
    });

    // Animate the map to the destination
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
    const DISTANCEAWAYFROMLOC = calculateDistance(
      location.X,
      location.Y,
      item.X,
      item.Y
    );
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
      DISTANCEAWAYFROMLOC: DISTANCEAWAYFROMLOC,
      LOTS_AVAILABLE: item.CARPARK_INFO[0].lots_available,
      TOTAL_LOTS: item.CARPARK_INFO[0].total_lots,
    };
    setCarParkMarkers((prevCarParkMarkers) => [
      ...prevCarParkMarkers,
      newMarker,
    ]);
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
        ref={mapRef} // Attach ref here
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
        {carParkMarkers.map((item) => (
          <Marker
            key={item.CARPARK_NO}
            coordinate={{
              latitude: item.LATITUDE,
              longitude: item.LONGITUDE,
            }}
            pinColor="blue" // Car parks are marked in blue
            onPress={() => {
              router.push({
                pathname: "/carParkDetails",
                params: {
                  lotsavailable: item.LOTS_AVAILABLE,
                  address: item.ADDRESS,
                  totallots: item.TOTAL_LOTS,
                  carparktype: item.CARPARK_TYPE,
                  distanceaway: item.DISTANCEAWAY,
                  distanceawayfromloc: item.DISTANCEAWAYFROMLOC,
                  lat: item.LATITUDE,
                  lng: item.LONGITUDE,
                },
              });
            }}
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
