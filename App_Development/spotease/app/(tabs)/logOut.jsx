import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useLogout from '../../hooks/useLogout'; // Import your existing hook

export default function LogoutScreen() {
  const logout = useLogout(); // Get the logout function from your hook

  // Immediately trigger logout when screen loads
  React.useEffect(() => {
    logout(); // Call your existing logout function
  }, []);

  return (
    <View style={styles.container}>
      <MaterialIcons 
        name="logout" 
        size={30} 
        color="#00C3FF" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E'
  }
});