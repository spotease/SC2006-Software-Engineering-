import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import reverseGeocode from "../hooks/reverseGeocode";
import { weatherAPI } from "../hooks/weatherAPI";
import ConvertPostalToRegion from "../hooks/convertPostalToRegion";
import fetchLocationHistory from "../hooks/fetchLocationHistory";
import * as Location from "expo-location";

export default function BeforeHome() {
  const [searchHistory, setSearchHistory] = useState([]);

  // Fetch search history on mount
  useEffect(() => {
    const getLocationHistory = async () => {
      try {
        const data = await fetchLocationHistory();
        if (data?.history?.length) {
          const flattened = data.history.map(item => item.locationAddress);
          setSearchHistory(flattened.slice(0, 5)); // Display recent 5 for example
        } else {
          setSearchHistory([]);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    getLocationHistory();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      let AddressNearby = await reverseGeocode(loc.coords.latitude, loc.coords.longitude);

      const { selectedRegion } = ConvertPostalToRegion(AddressNearby[0].POSTAL);
      let forecastWeather = weatherAPI(selectedRegion);
    })();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemInBox}>
      <Text style={styles.boxText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/beforeHomeRaining.png")} style={styles.carIcon} />
      
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchBarText}>Start Search!</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.subtitle}>Where would you like to park today?</Text>

      {/* Search History */}
      <Text style={styles.sectionTitle}>Search History</Text>
      <View style={styles.searchHistoryBox}>
        <FlatList
          data={searchHistory}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1E1E1E",
  },
  searchBar: {
    backgroundColor: "#2E2E2E",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  searchBarText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  carIcon: {
    marginTop: 55,
    width: 350,
    height: 220,
    alignSelf: "center",
    marginBottom: 20,
  },
  subtitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: 'italic',
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchHistoryBox: {
    backgroundColor: '#6694FF',
    borderRadius: 10,
    marginBottom: 20,
    maxHeight: 115,
  },
  itemInBox: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  boxText: {
    color: '#FFFFFF',
    fontWeight: "600",
    fontSize: 15,
  },
});
