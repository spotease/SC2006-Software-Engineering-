import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import fetchLocationHistory from "../../functions/History Related/fetchLocationHistory";
import clearLocationHistory from "../../functions/History Related/clearLocationHistory";

export default function SearchHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocationHistory = async () => {
      try {
        const data = await fetchLocationHistory();

        if (data?.history) {
          // Group the locations by date
          const groupedData = groupByDate(data.history);
          setHistoryData(groupedData);
        } else {
          setHistoryData([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching location history:", error);
        setError("Failed to fetch location history");
        setLoading(false);
      }
    };

    getLocationHistory();
  }, []);

  // Group data by date
  const groupByDate = (locations) => {
    const grouped = {};

    locations.forEach((location) => {
      const date = new Date(location.timestamp).toLocaleDateString();

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push({
        time: new Date(location.timestamp).toLocaleTimeString(),
        location: location.locationAddress,
        type: location.locationType || "destination",
        coordinates: location.coordinates,
      });
    });

    return Object.keys(grouped).map((date) => ({
      date,
      entries: grouped[date],
    }));
  };

  const handleClearHistory = async () => {
    try {
      Alert.alert(
        "Clear History",
        "This will permanently delete all your location records. Continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Clear All",
            onPress: async () => {
              setLoading(true);
              try {
                const { success, error, deletedCount } =
                  await clearLocationHistory();

                if (success) {
                  setHistoryData([]); // Clear local state immediately
                  Alert.alert(
                    "Success",
                    deletedCount
                      ? `Cleared ${deletedCount} location records`
                      : "Location history cleared"
                  );
                } else {
                  Alert.alert("Error", error || "Failed to clear history");
                }
              } catch (err) {
                console.error("Clear error:", err);
                Alert.alert("Error", "Failed to complete the request");
              } finally {
                setLoading(false);
              }
            },
            style: "destructive",
          },
        ]
      );
    } catch (error) {
      console.error("Alert error:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#00C3FF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "white" }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back("(tabs)/history")}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Search History</Text>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={historyData}
          keyExtractor={(item) => item.date}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No search history available</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{item.date}</Text>
              {item.entries.map((entry, index) => (
                <View key={index} style={styles.entryContainer}>
                  <View style={styles.entryRow}>
                    <Text style={styles.timeText}>{entry.time}</Text>
                    <Text style={styles.typeText}>{entry.type}</Text>
                  </View>
                  <Text style={styles.locationText}>{entry.location}</Text>
                  <Text style={styles.coordsText}>
                    Lat: {entry.coordinates.latitude.toFixed(4)}, Lng:{" "}
                    {entry.coordinates.longitude.toFixed(4)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          // Add padding at the bottom to ensure content isn't hidden behind the fixed button
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      </View>

      {/* Fixed Clear Button */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}
        >
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  headerContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    color: "#00C3FF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  entryContainer: {
    backgroundColor: "#2E2E2E",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  timeText: {
    color: "#A4D200",
    fontSize: 14,
    fontWeight: "bold",
  },
  typeText: {
    color: "#888",
    fontSize: 14,
  },
  locationText: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  coordsText: {
    color: "#888",
    fontSize: 12,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.8)", // Semi-transparent background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  clearButton: {
    backgroundColor: "#00C3FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    fontStyle: "italic",
  },
});
