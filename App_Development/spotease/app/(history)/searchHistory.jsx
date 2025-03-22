import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getLocationHistory, clearLocationHistory } from '../../services/locationService';

export default function SearchHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load the location history
  const loadHistory = async () => {
    try {
      setLoading(true);
      const history = await getLocationHistory();
      setHistoryData(history);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load location history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refreshing the history
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
  };

  // Handle clearing the history
  const handleClearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear your location history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await clearLocationHistory();
              setHistoryData([]);
              Alert.alert('Success', 'Your location history has been cleared.');
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear location history.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Load the history when the component mounts
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', padding: 16 }}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.push("(tabs)/history")} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Location History
      </Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#008080" style={{ marginTop: 20 }} />
      ) : historyData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
            No location history found.{'\n'}Your searched locations will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{item.date}</Text>
              {item.entries.map((entry, index) => (
                <TouchableOpacity 
                  key={entry.id || index} 
                  style={styles.historyItem}
                  onPress={() => {
                    // Navigate to the map with these coordinates
                    if (entry.coordinates) {
                      router.push({
                        pathname: '(tabs)',
                        params: {
                          latitude: entry.coordinates.latitude,
                          longitude: entry.coordinates.longitude,
                          locationName: entry.location
                        }
                      });
                    }
                  }}
                >
                  <Text style={styles.timeText}>{entry.time}</Text>
                  <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                    {entry.location || 'Unnamed location'}
                  </Text>
                  <Text style={styles.typeText}>{entry.type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
      
      <TouchableOpacity
        style={styles.clearButton}
        onPress={handleClearHistory}
        disabled={loading || historyData.length === 0}
      >
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    width: '20%',
  },
  locationText: {
    color: '#B0B0B0',
    fontSize: 16,
    width: '60%',
  },
  typeText: {
    color: '#008080',
    fontSize: 16,
    width: '20%',
    textAlign: 'right',
  },
  clearButton: {
    backgroundColor: '#008080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});