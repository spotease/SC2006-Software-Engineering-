import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router'; 
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const ViewCarParkDetails = () => {
  const { carPark } = useLocalSearchParams();
  const parsedCarPark = JSON.parse(carPark);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="#00C3FF" />
      </TouchableOpacity>

      <View style={styles.detailBox}>
        <Text style={styles.title}>{parsedCarPark.name}</Text>
        <View style={styles.addressDistanceContainer}>
          <MaterialIcons name="location-on" size={20} color="#00C3FF" />
          <Text style={styles.detailText}>{parsedCarPark.address}</Text>
        </View>
        <View style={styles.addressDistanceContainer}>
          <MaterialCommunityIcons name="map-marker-distance" size={20} color="#00C3FF" />
          <Text style={styles.detailText}>{parsedCarPark.distance}</Text>
        </View>
      </View>

      <View style={styles.detailBox}>
        <View style={styles.iconTextContainer}>
          <MaterialIcons name="local-parking" size={24} color="#00C3FF" />
          <Text style={styles.detailTitle}>Available Lots</Text>
        </View>
        <Text style={styles.detailText}>{parsedCarPark.availableLots}</Text>
      </View>

      <View style={styles.detailBox}>
        <View style={styles.iconTextContainer}>
          <FontAwesome name="money" size={24} color="#00C3FF" />
          <Text style={styles.detailTitle}>Parking Rates</Text>
        </View>
        <Text style={styles.detailText}>{parsedCarPark.parkingRates}</Text>
      </View>

      <View style={styles.detailBox}>
        <View style={styles.iconTextContainer}>
          <FontAwesome name="star" size={24} color="#00C3FF" />
          <Text style={styles.detailTitle}>Google Review</Text>
        </View>
        <Text style={styles.detailText}>{parsedCarPark.googleReview}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100, 
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    position: 'absolute', 
    top: 55, 
    left: 20, 
    zIndex: 1, 
  },
  detailBox: {
    backgroundColor: '#2E2E2E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  addressDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#CCCCCC',
  },
});

export default ViewCarParkDetails;