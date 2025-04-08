import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import routingAPI from '../../spotease/hooks/routingAPI';
import decodePolyline from '../../spotease/hooks/decodePolyline'; 

export default function NavigateScreen() {
  const { address, lat, lng } = useLocalSearchParams();
  const mapRef = useRef(null); //ref to mapview 
  const [routeData, setRouteData] = useState(null); // Raw route data from API
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Decoded route coordinates
  const [currentLocation, setCurrentLocation] = useState(null); // User's live location
  const [heading, setHeading] = useState(0); // User's direction (in degrees)
  const [arrived, setArrived] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Tracks step in instructions 
  const lastRoutedLocation = useRef(null);
  const router = useRouter();

  const destination = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng)
  };

  // Decode the route geometry when routeData changes
  useEffect(() => {
    if (routeData?.route_geometry) {
      const decoded = decodePolyline(routeData.route_geometry);
      const formattedCoords = decoded.map(coord => ({
        latitude: coord[0],
        longitude: coord[1]
      }));
      setRouteCoordinates(formattedCoords);
    }
  }, [routeData]);

  // Get initial route
  useEffect(() => {
    const getRoute = async () => {
      if (!currentLocation) return;
      
      const start = {
        LATITUDE: currentLocation.coords.latitude,
        LONGITUDE: currentLocation.coords.longitude
      };
      
      const end = {
        LATITUDE: destination.latitude,
        LONGITUDE: destination.longitude
      };

      const route = await routingAPI(start, end);
      setRouteData(route);
    };

    getRoute();
  }, [currentLocation]);

  // Track user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission denied');
        return;
      }

      // Get initial position
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);

      // Watch for position updates
      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        distanceInterval: 3, // still update location every 3m
      }, (newLocation) => {
        setCurrentLocation(newLocation);
        setHeading(newLocation.coords.heading);
      
        // Check if user has moved >10m since last API call
        if (
          !lastRoutedLocation.current ||
          calculateDistance(
            lastRoutedLocation.current.latitude,
            lastRoutedLocation.current.longitude,
            newLocation.coords.latitude,
            newLocation.coords.longitude
          ) > 10
        ) {
          lastRoutedLocation.current = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
      
          // Recalculate route
          const start = {
            LATITUDE: newLocation.coords.latitude,
            LONGITUDE: newLocation.coords.longitude
          };
          
          const end = {
            LATITUDE: destination.latitude,
            LONGITUDE: destination.longitude
          };
      
          routingAPI(start, end).then(route => {
            setRouteData(route);
          });
        }
      
        // Check if arrived
        const distance = calculateDistance(
          newLocation.coords.latitude,
          newLocation.coords.longitude,
          destination.latitude,
          destination.longitude
        );
      
        if (distance < 20) {
          setArrived(true);
        }
      });      
    })();
  }, []);

  // Update Current Step
  useEffect(() => {
    if (!currentLocation || !routeData?.route_instructions) return;
  
    // Check distance to each step's coordinate
    routeData.route_instructions.forEach((step, index) => {
      const [_, __, ___, coordsStr] = step;
      const [stepLat, stepLng] = coordsStr.split(',').map(parseFloat);
      
      const distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        stepLat,
        stepLng
      );
  
      // If within 20m of a step, advance to next instruction
      if (distance < 20 && index > currentStepIndex) {
        setCurrentStepIndex(index);
      }
    });
  }, [currentLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula 
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  if (!currentLocation) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  function DirectionsPanel({ instructions, currentIndex }) {
    if (!instructions || currentIndex >= instructions.length) return null;
    
    // Get current instruction and next 
    const visibleInstructions = instructions.slice(
      currentIndex, 
      Math.min(currentIndex + 2, instructions.length)
    );
  
    return (
      <View style={styles.directionsContainer}>
        <Text style={styles.directionsHeader}>Step by step instructions</Text>

        {visibleInstructions.map((step, index) => {
          const [turnType, street, distance, _, __, distanceStr, ___, ____, _____, fullInstruction] = step;
          const isCurrent = index === 0;
          
          return (
            <View 
              key={index} 
              style={[
                styles.stepContainer,
                isCurrent && styles.currentStepContainer
              ]}
            >
              <Text style={[
                styles.stepText,
                isCurrent && styles.currentStepText
              ]}>
                {isCurrent ? "Current: " : "Next: "}
                {fullInstruction}
                {distance > 0 && ` (${distanceStr})`}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  const handleEndTrip = () => {
    Location.stopLocationUpdatesAsync();
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
        followsUserLocation
      >
        {/* Route Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#3498db"
            strokeWidth={4}
          />
        )}

        {/* Destination Marker */}
        <Marker coordinate={destination} pinColor="red" />

        {/* User Direction Indicator */}
        <Marker
          coordinate={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }}
          rotation={heading}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>↑</Text>
          </View>
        </Marker>
      </MapView>

      {/* Step-by-step instructions */}
      {routeData?.route_instructions && (
        <DirectionsPanel 
            instructions={routeData.route_instructions} 
            currentIndex={currentStepIndex} 
        />
      )}

      {/* End Trip Button - Floating at bottom */}
      <TouchableOpacity 
        style={styles.endTripButton} 
        onPress={handleEndTrip}
      >
        <Text style={styles.endTripText}>End Trip</Text>
      </TouchableOpacity>


      {/* Arrival Notification */}
      {arrived && (
        <View style={styles.arrivalContainer}>
          <Text style={styles.arrivalText}>You have arrived at {address}</Text>
        </View>
      )}
    </View>
  );
}
// reduce styles if needed
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  arrow: {
    backgroundColor: '#FFFFFFB3',
    borderRadius: 20,
    padding: 5,
  },
  arrowText: {
    fontSize: 20,
    color: 'blue',
  },
  directionsHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  directionsContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    maxHeight: 230, 
  },
  directionsTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  stepContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currentStepContainer: {
    backgroundColor: '#f0f8ff',
  },
  stepText: {
    fontSize: 14,
    color: '#666',
  },
  currentStepText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3498db',
  },
  arrivalContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  arrivalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  endTripButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FF3B30', // Red color for action button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  endTripText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});