import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert,} from 'react-native';

const createLocationHistory = async (locationData) => {

    
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
        const res = await fetch('https://sc2006-backend-spotease.onrender.com/profile/locationHistory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(locationData),
    });

    const text = await res.text();
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
    } catch (err) {
        console.error('Error saving location:', err);
        Alert.alert('Error', err.message || 'Something went wrong.');
    }


}

export default createLocationHistory;
