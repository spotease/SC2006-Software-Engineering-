import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert,} from 'react-native';

const fetchLocationHistory = async (locationData) => {

    
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

    }catch(error){
        console.error('Error Fetching Location',err);
    }
}


export default fetchLocationHistory
