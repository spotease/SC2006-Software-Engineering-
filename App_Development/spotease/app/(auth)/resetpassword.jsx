import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import EntryBox from "../../components/EntryBox";
import CustomButton from "../../components/CustomButton";
import logo from '../../assets/images/SpotEaseLogo.png';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = `https://sc2006-backend-spotease.onrender.com/password/resetpassword`;
console.log(API_URL);

export default function resetPassword() {
    const router = useRouter();
    const [OTP, setOTP] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [error, setError] = useState("");

    const handleResetPassword = async () => {
      // Validate empty fields
      if (!OTP.trim() || !password.trim() || !password1.trim()) {
        Alert.alert("Error", "All fields are required. Try again.");
        return;
      }
      
      // Check if passwords match
      if (password !== password1) {
        setError("Passwords do not match! Please try again.");
        Alert.alert("Error", "Passwords do not match! Please try again.");
        setPassword1(""); // Clear input for user
        return;
      }
    
      try {
        const resetResponse = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ OTP, password }),
        });
    
        // Check if the response is okay (status code 200)
        if (!resetResponse.ok) {
          const errorData = await resetResponse.json();
          Alert.alert("Error", errorData.error || "An error occurred while resetting the password.");
          return;
        }
    
        // Parse the success response
        const data = await resetResponse.json();
        Alert.alert("Success", data.message || "Password reset successfully!");
        router.push("/login"); // Redirect to login page
      } catch (error) {
        console.error("Error resetting password:", error);
        Alert.alert("Error", "Internal Server Error");
      }
    };

    return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Reset Your Password</Text>

      <EntryBox
        placeholder = "OTP"
        value = {OTP}
        keyboardType = "numeric"
        onChangeText = {setOTP}
      />

      <EntryBox
        placeholder = "Password"
        value = {password}
        onChangeText = {setPassword}
        secureTextEntry
      />

      <EntryBox
        placeholder = "Confirm Password"
        value = {password1}
        onChangeText = {setPassword1}
        secureTextEntry
      />

      <CustomButton title="Reset Password" onPress={handleResetPassword} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor:"#2E2E2E",flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#00E6E6", marginBottom: 20 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  logo: {width: 400, height: 200, marginBottom: 15},
});