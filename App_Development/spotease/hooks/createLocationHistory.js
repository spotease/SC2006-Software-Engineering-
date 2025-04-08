import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const createLocationHistory = async (locationData) => {
  const token = await AsyncStorage.getItem('authToken');

  // If no token, silently skip history creation (guest mode)
  if (!token) {
    console.log('Guest user: Skipping location history save.');
    return;
  }

  try {
    const res = await fetch('https://sc2006-backend-spotease.onrender.com/profile/createLocationHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(locationData),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn('Non-JSON response:', text);
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (res.ok) {
      Alert.alert('Success', data.message);
    } else {
      Alert.alert('Error', data.error || 'Failed to save location');
    }
  } catch (error) {
    console.error('Error saving location:', error);
    Alert.alert('Error', error.message || 'Something went wrong.');
  }
};

export default createLocationHistory;
