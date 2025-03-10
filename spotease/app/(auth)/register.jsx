import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import EntryBox from "../../components/EntryBox";
import CustomButton from "../../components/CustomButton";
import logo from '../../assets/images/SpotEaseLogo.png';

export default function register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
      setError(""); // Clear previous errors
    
      if (!email.trim() || !password.trim() || !password1.trim()) {
        setError("Email and Password cannot be empty.");
        return;
      }
    
      if (password !== password1) {
        setError("Passwords do not match! Please try again.");
        return;
      }
    
      try {
        const response = await fetch("http://192.168.1.5:5001/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (data.data === "User already exists") {
          setError("User already exists! Try logging in.");
          return;
        }
    
        if (data.status === "User registered") {
          Alert.alert("Success", "Account registered successfully.");
          router.push("/login");
        } else {
          setError("Registration failed. Try again.");
        }
      } catch (error) {
        console.error(error);
        setError("Server error. Please try again later.");
      }
    };
    

    return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Register</Text>

      <EntryBox
        placeholder = "Email"
        value = {email}
        onChangeText = {setEmail}
        keyboardType = "email-address"
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

      <CustomButton title="Register" onPress={handleRegister} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor:"#2E2E2E",flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#00E6E6", marginBottom: 20 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  logo: {width: 400, height: 200, marginBottom: 15},
});