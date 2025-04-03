import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const clearLocationHistory = async () => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) {
    return {
      success: false,
      error: 'No authentication token found'
    };
  }

  try {
    const response = await fetch(
      'https://sc2006-backend-spotease.onrender.com/profile/clear-location-history',
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // First get the response text
    const responseText = await response.text();

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      // If parsing fails, check if it's an HTML error page
      if (responseText.includes('<!DOCTYPE html>')) {
        throw new Error('Server returned HTML error page');
      }
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to clear history',
        status: response.status
      };
    }

    return {
      success: true,
      message: data.message || 'History cleared successfully',
      deletedCount: data.deletedCount
    };

  } catch (error) {
    console.error('Clear location history error:', error);
    return {
      success: false,
      error: error.message || 'Network error'
    };
  }
};

export default clearLocationHistory;