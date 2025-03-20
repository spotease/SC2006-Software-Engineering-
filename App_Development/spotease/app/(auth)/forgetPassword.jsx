import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import EntryBox from "../../components/EntryBox";
import CustomButton from "../../components/CustomButton";
import logo from '../../assets/images/SpotEaseLogo.png';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = `https://sc2006-backend-spotease.onrender.com/forgetpassword`;
console.log(API_URL);

export default function forgetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleForgetPassword = async () => {
      // Validate empty fields
      if (!email.trim()) {
        Alert.alert("Error", "Email cannot be empty. Try again.");
        return;
      }
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          Alert.alert("Success", "Check your email for the password reset link.");
          router.push("/resetpassword");
        } else {
          Alert.alert("Error", data.error || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to send request. Please try again later.");
      }
    };

    return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Reset Your Password</Text>

      <EntryBox
        placeholder = "Email"
        value = {email}
        onChangeText = {setEmail}
        keyboardType = "email-address"
      />

      <CustomButton title="Reset Password" onPress={handleForgetPassword} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor:"#2E2E2E",flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#00E6E6", marginBottom: 20 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  logo: {width: 400, height: 200, marginBottom: 15},
});