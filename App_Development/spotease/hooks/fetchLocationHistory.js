import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert,} from 'react-native';

const fetchLocationHistory = async () => {

    
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
        const res = await fetch('https://sc2006-backend-spotease.onrender.com/profile/fetchLocationHistory', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn('Non-JSON response from server:', text)
      throw new Error('Invalid JSON response');
    }


    if (!res.ok){
      console.error('Error Fecthing Location', data.error);
      return;
    }

    return data;


    }catch(error){
        console.error('Error Fetching Location',error);
    }
}


export default fetchLocationHistory
