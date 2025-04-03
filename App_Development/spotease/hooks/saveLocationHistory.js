// File: hooks/saveLocationHistory.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const saveLocationHistory = async (locationData) => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) {
    console.warn('User not authenticated');
    return false;
  }
  
  try {
    const response = await fetch('https://sc2006-backend-spotease.onrender.com/profile/createLocationHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(locationData)
    });
    
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn('Non-JSON response from server:', text);
      throw new Error('Invalid JSON response');
    }
    
    if (!response.ok) {
      console.error('Error saving location:', data.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving location history:', error);
    return false;
  }
};

export default saveLocationHistory;