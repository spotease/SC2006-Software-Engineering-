import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import SearchBar from '../../components/SearchBar';
import WeatherAPI from '../../hooks/weatherAPI';
import ConvertPostalToRegion from '../../hooks/convertPostalToRegion';
import jwtDecode from 'jwt-decode';

const WeatherTest = () => {
  const [userInput, setUserInput] = useState('');
  const [profile, setProfile] = useState(null);

  const { region } = ConvertPostalToRegion({ userInput });
  const { forecast } = WeatherAPI({ userInput: region });

  const handleSearch = (input) => {
    setUserInput(input);
  };

  const token = 'your_jwt_token_here'; // 🔐 Replace this with your real token or load from AsyncStorage

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true;
    }
  };

  const fetchProfile = async () => {
    if (!token || isTokenExpired(token)) {
      Alert.alert('Session expired', 'Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
      } else {
        Alert.alert('Error', data.error || 'Failed to retrieve profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar query={userInput} onSearch={handleSearch} />
      <Text>Region: {region}</Text>
      <Text>Forecast: {forecast}</Text>

      <View style={styles.divider} />

      <Button title="Fetch Profile" onPress={fetchProfile} />

      {profile && (
        <View style={styles.profileBox}>
          <Text>Email: {profile.email}</Text>
          <Text>ID: {profile.id}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  divider: {
    marginVertical: 20,
    height: 1,
    backgroundColor: '#ccc',
  },
  profileBox: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
  }
});

export default WeatherTest;
