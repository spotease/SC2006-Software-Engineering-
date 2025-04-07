import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { Link } from "expo-router";
import reverseGeocode from "../hooks/reverseGeocode";
import { useEffect,useState } from "react";
import WeatherAPI from "../hooks/weatherAPI"; // Import the weather API utility
import ConvertPostalToRegion from "../hooks/convertPostalToRegion";
import * as Location from "expo-location";


export default function BeforeHome() {
  // Mock data
  const searchHistory = ["Marina Barrage", "Marina Bay Sands", "Marina Square", "Choa Chu Kang", "Jurong Point"];
  const savedLocations = ["Level 6, Block B", "Level 7, Block C", "Level 1, Block A"];  // Helper component to render items without border on last one
  const [AddressNearby, setAddressNearby] = useState(null); // State to store the address nearby
  // const {selectedRegion} = ConvertPostalToRegion(AddressNearby); // Call the function to convert postal code to region
  // const {forecast} = WeatherAPI(selectedRegion);
  const renderItem = ({ item }) => (
    <View style={styles.itemInBox}>
      <Text style={styles.boxText}>{item}</Text>
    </View>
  );

  

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      
      AddressNearby = await reverseGeocode(loc.coords.latitude, loc.coords.longitude);
      setAddressNearby(AddressNearby);

      // const {selectedRegion} = ConvertPostalToRegion(AddressNearby[0].POSTAL); // Call the function to convert postal code to region
      //let Region = ConvertPostalToRegion(AddressNearby[0].POSTAL); // Convert postal code to region
    })();
  }, []);


  return (
    <View style={styles.container}>
    {/* Car Icon */}
    <Image 
        source={require("../assets/images/beforeHomeRaining.png")} 
        style={styles.carIcon}
      />
      {/* Search Bar (Links to Home) */}
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchBarText}>Start Search!</Text>
        </TouchableOpacity>
      </Link>

      {/* text */}
      <Text style={styles.subtitle}>
        Where would you like to park today? </Text>

      {/* Search History */}
      <Text style={styles.sectionTitle}>Search History</Text>
      <View style={styles.searchHistoryBox}>
        <FlatList
          data={searchHistory}
          renderItem={({ item, index }) => renderItem({ item, index, data: searchHistory })}
          keyExtractor={(item) => item}
          scrollEnabled={true}
        />
      </View>

      {/* Saved Locations Section */}
      <Text style={styles.sectionTitle}>Saved Parking Locations</Text>
      <View style={styles.savedLocationsBox}>
        <FlatList
          data={savedLocations}
          renderItem={({ item, index }) => renderItem({ item, index, data: savedLocations })}
          keyExtractor={(item) => item}
          scrollEnabled={true}
        />
      </View>
    </View>
  );
}

// Reuse the same styles from previous example
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
        fontWeight: "600",   // bold
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
        backgroundColor: '#6694FF', // Blue
        borderRadius: 10,
        marginBottom: 20,
        maxHeight: 115, 
    },
    savedLocationsBox: {
        backgroundColor: '#A3C02F', // Green
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