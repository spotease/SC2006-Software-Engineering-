import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/config'; // You'll need to create this file with your backend URL

const USER_ID_KEY = 'user_id';

// Get the current user ID from secure storage
export const getUserId = async () => {
  try {
    let userId = await SecureStore.getItemAsync(USER_ID_KEY);
    
    // If no user ID, check if user is logged in
    if (!userId) {
      // You might want to check for user login state here
      // For now, we'll return null if no userId is found
      return null;
    }
    
    return userId;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

// Save a location to the backend
export const saveLocationToHistory = async (coordinates, locationName = '', locationType = '') => {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const response = await fetch(`${API_URL}/save-location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        coordinates,
        locationName,
        locationType
      }),
    });
    
    const result = await response.json();
    
    if (result.status !== 'Success') {
      throw new Error(result.message || 'Failed to save location');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};

// Get location history from the backend
export const getLocationHistory = async (limit = 50, skip = 0) => {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const response = await fetch(`${API_URL}/location-history/${userId}?limit=${limit}&skip=${skip}`);
    const result = await response.json();
    
    if (result.status !== 'Success') {
      throw new Error(result.message || 'Failed to get location history');
    }
    
    return formatLocationHistory(result.data);
  } catch (error) {
    console.error('Error getting location history:', error);
    throw error;
  }
};

// Clear location history
export const clearLocationHistory = async () => {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    const response = await fetch(`${API_URL}/location-history/${userId}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (result.status !== 'Success') {
      throw new Error(result.message || 'Failed to clear location history');
    }
    
    return result;
  } catch (error) {
    console.error('Error clearing location history:', error);
    throw error;
  }
};

// Format location history for display
const formatLocationHistory = (history) => {
  const groupedByDate = {};
  
  history.forEach(loc => {
    // Format the date
    const date = new Date(loc.timestamp);
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    // Format the time
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    // Create or update the date group
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = {
        date: dateStr,
        entries: []
      };
    }
    
    // Add the entry to the date group
    groupedByDate[dateStr].entries.push({
      time: timeStr,
      location: loc.locationName || '',
      type: loc.locationType || '',
      coordinates: loc.coordinates,
      id: loc._id.toString()
    });
  });
  
  // Convert the object to an array and sort by date (newest first)
  return Object.values(groupedByDate).sort((a, b) => {
    const dateA = a.date.split('/').reverse().join('');
    const dateB = b.date.split('/').reverse().join('');
    return dateB.localeCompare(dateA);
  });
};
