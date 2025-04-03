// import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { MaterialIcons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import axios from 'axios';

// export default function SearchHistory() {
//   const [historyData, setHistoryData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Assuming you have the logged-in user's email saved in your state or context
//   const email = "user@example.com"; // Replace with actual email from context or storage

//   useEffect(() => {
//     const fetchHistoryData = async () => {
//       try {
//         const response = await axios.get(`https://sc2006-backend-spotease.onrender.com/location/${email}`);
//         const data = response.data.data;

//         // Group the locations by date
//         const groupedData = groupByDate(data);

//         setHistoryData(groupedData);
//         setLoading(false);
//       } catch (error) {
//         setError("Failed to fetch location history");
//         setLoading(false);
//       }
//     };

//     fetchHistoryData();
//   }, [email]);

//   // Group data by date
//   const groupByDate = (locations) => {
//     const grouped = {};
//     locations.forEach((location) => {
//       const date = new Date(location.timestamp).toLocaleDateString();
//       if (!grouped[date]) {
//         grouped[date] = [];
//       }
//       grouped[date].push({
//         time: new Date(location.timestamp).toLocaleTimeString(),
//         location: location.locationName,
//         type: location.locationType,
//       });
//     });
//     return Object.keys(grouped).map((date) => ({
//       date,
//       entries: grouped[date],
//     }));
//   };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
//         <ActivityIndicator size="large" color="#00ff00" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
//         <Text style={{ color: 'white' }}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#121212', padding: 16 }}>
//       {/* Back Button */}
//       <TouchableOpacity onPress={() => router.push("(tabs)/history")} style={styles.backButton}>
//         <MaterialIcons name="arrow-back" size={24} color="white" />
//       </TouchableOpacity>
      
//       <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
//         History
//       </Text>
      
//       <FlatList
//         data={historyData}
//         keyExtractor={(item) => item.date}
//         renderItem={({ item }) => (
//           <View style={{ marginBottom: 16 }}>
//             <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.date}</Text>
//             {item.entries.map((entry, index) => (
//               <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
//                 <Text style={{ color: 'white', fontSize: 16 }}>{entry.time}</Text>
//                 <Text style={{ color: 'gray', fontSize: 16 }}>{entry.location}</Text>
//                 <Text style={{ color: 'gray', fontSize: 16 }}>{entry.type}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       />
      
//       <TouchableOpacity
//         style={{ backgroundColor: '#008080', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 }}>
//         <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Clear History</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   backButton: {
//     marginBottom: 15,
//   },
// });

import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import fetchLocationHistory from '../../hooks/fetchLocationHistory';
import clearLocationHistory from '../../hooks/clearLocationHistory';

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
        coordinates: location.coordinates
      });
    });
    
    return Object.keys(grouped).map((date) => ({
      date,
      entries: grouped[date],
    }));
  };

// Then update your handleClearHistory function:
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
              const { success, error, deletedCount } = await clearLocationHistory();
              
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#00C3FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <Text style={{ color: 'white' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.push("(tabs)/history")} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Search History</Text>
      
      {historyData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No search history available</Text>
        </View>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.date}
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
                    Lat: {entry.coordinates.latitude.toFixed(4)}, 
                    Lng: {entry.coordinates.longitude.toFixed(4)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        />
      )}
      
      <TouchableOpacity 
        style={styles.clearButton}
        onPress={handleClearHistory}
      >
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#1E1E1E', 
    padding: 16
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    color: 'white', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    color: '#00C3FF', 
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 8,
  },
  entryContainer: {
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeText: {
    color: '#A4D200', 
    fontSize: 14,
    fontWeight: 'bold',
  },
  typeText: {
    color: '#888', 
    fontSize: 14,
  },
  locationText: {
    color: 'white', 
    fontSize: 16,
    marginBottom: 4,
  },
  coordsText: {
    color: '#888', 
    fontSize: 12,
  },
  clearButton: {
    backgroundColor: '#00C3FF', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 16
  },
  clearButtonText: {
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  }
});