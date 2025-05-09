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
import WeatherAPI from "../../functions/Carpark Related/weatherAPI";
import carparkTypeFilter from "../../functions/Carpark Related/carparkTypeFilter";
import ConvertPostalToRegion from "../../functions/Location Related/convertPostalToRegion";
import createLocationHistory from "../../functions/History Related/createLocationHistory";
import calculateDistance from "../../functions/Location Related/calculateDistance";
import { useLocalSearchParams } from "expo-router";

const Home = () => {
  const mapRef = useRef(null);
  const [selectedFilters, setSelectedFilters] = useState({
    sheltered_parking: false,
    weather_parking_recommendation: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(null);
  const { searchResults, loadingFlag } = searchAPI(searchQuery);
  const [selectedDest, setSelectedDest] = useState(null);
  const [filterRadius, setFilterRadius] = useState(1000 / 2);
  const { sortedCarParks } = carParkRetrieval(
    selectedDest,
    filterRadius
  );
  const [carParkMarkers, setCarParkMarkers] = useState([]);
  const [destMarker, setDestMarker] = useState({});
  const params = useLocalSearchParams();
  const initialParamProcessed = useRef(false);

  useEffect(() => {
    if (!selectedDest || !sortedCarParks || !selectedFilters) return;

    const populateCPMarkers = async () => {
      const region = ConvertPostalToRegion(selectedDest.POSTAL);
      const forecastResult = await WeatherAPI(region);
      console.log("Postal Code", selectedDest.POSTAL);
      console.log("Region", region);
      console.log("Forecast Result:", forecastResult);

      const filtered = carparkTypeFilter(
        forecastResult,
        sortedCarParks,
        selectedFilters
      );

      setCarParkMarkers([]); // Clear previous markers
      setCarParkMarkers(
        filtered.map((item) => ({
          id: item.CARPARK_NO,
          ADDRESS: item.ADDRESS,
          LATITUDE: item.LATITUDE,
          LONGITUDE: item.LONGITUDE,
          CARPARK_TYPE: item.CARPARK_TYPE,
          LOTS_AVAILABLE: item.CARPARK_INFO[0].lots_available,
          TOTAL_LOTS: item.CARPARK_INFO[0].total_lots,
          DISTANCEAWAY: item.DISTANCEAWAY,
          DISTANCEAWAYFROMLOC: calculateDistance.LatLongCoord(
            location.LATITUDE,
            location.LONGITUDE,
            item.LATITUDE,
            item.LONGITUDE
          ),
        }))
      );
    };

    // First run (populate markers immediately)
    console.log("populate");
    populateCPMarkers();

    // Zoom animation based on filter radius
    if (mapRef.current && selectedDest) {
      const delta = (filterRadius + 500) / 100000;
      mapRef.current.animateToRegion(
        {
          latitude: selectedDest.LATITUDE,
          longitude: selectedDest.LONGITUDE,
          latitudeDelta: delta,
          longitudeDelta: delta,
        },
        1500
      );
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

  // Process initial address parameter only once
  useEffect(() => {
    if (params?.address && !initialParamProcessed.current) {
      setSearchQuery(params.address);
      initialParamProcessed.current = true;
    }
  }, [params]);

  const handleFilterSelect = (filters) => {
    const updatedFilters = {
      sheltered_parking: !!filters.sheltered_parking,
      weather_parking_recommendation: !!filters.weather_parking_recommendation,
    };

    if (filters.distance !== undefined) {
      setFilterRadius(filters.distance / 2);
    }

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
    setSearchQuery(""); // Clear search query after selecting a destination
    console.log("Destination Selected");

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

  // Function to handle search input changes
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const filterOptions = [
    { label: "1. Sheltered Parking", value: "sheltered_parking" },
    {
      label: "2. Weather Parking Recommendation",
      value: "weather_parking_recommendation",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBarContainer}>
          <SearchBar query={searchQuery} onSearch={handleSearchChange} />
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
            key={`dest-${destMarker.LATITUDE}-${destMarker.LONGITUDE}`}
          />
        )}

        {/* Car Park Markers */}
        {carParkMarkers.map((item) => (
          <Marker
            key={`${item.id}-${item.LATITUDE}-${item.LONGITUDE}`}
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
          keyExtractor={(item, index) => `${item.ADDRESS}-${index}`}
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
  itemContainer: {
    marginHorizontal: 10,
    marginTop: 2,
    marginBottom: 2,
  },
});

export default Home;
