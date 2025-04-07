import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function CarParkDetails() {
  const {
    address,
    lotsavailable,
    totallots,
    carparktype,
    distanceaway,
    distanceawayfromloc,
    lat,
    lng,
  } = useLocalSearchParams();
  const router = useRouter(); // Initialize the router

  const availabilityText = `${lotsavailable}/${totallots}`;
  const percentageAvailable = (lotsavailable / totallots) * 100;
  const lotsColor = percentageAvailable < 50 ? "red" : "green";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Park Details</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        <Text style={styles.address}>{address}</Text>

        <View style={styles.distanceContainer}>
          <MaterialIcons name="location-pin" size={18} color="red" />
          <Text style={styles.distance}>
            {Math.round(distanceawayfromloc)}m away{" "}
          </Text>
        </View>

        {/* Information Boxes */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <FontAwesome5 name="car" size={30} color="white" />
            <Text style={styles.lotsAvailable}>
              <Text style={[styles.lotsText, { color: lotsColor }]}>
                {availabilityText}
              </Text>{" "}
              Lots available
            </Text>
          </View>

          <View style={styles.infoBox}>
            <FontAwesome5 name="building" size={30} color="white" />
            <Text style={styles.carParkType}>{carparktype}</Text>
          </View>
        </View>

        {/* Navigate Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/navigateScreen",
              params: {
                address,
                lat,
                lng,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2A47",
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#374B6D",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  detailsContainer: {
    backgroundColor: "#2D4059",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  address: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  distance: {
    fontSize: 16,
    color: "white",
    marginLeft: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  infoBox: {
    backgroundColor: "#162B4D",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "48%",
  },
  lotsAvailable: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  lotsText: {
    fontWeight: "bold",
    color: "red",
  },
  carParkType: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
