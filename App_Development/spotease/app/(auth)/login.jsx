import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import EntryBox from "../../components/EntryBox";
import CustomButton from "../../components/CustomButton";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import JustTextButton from '../../components/JustTextButton';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <EntryBox
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <EntryBox
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <JustTextButton title="Forgot Password?" onPress={() => router.push("/(auth)/forgetpassword")} containerStyle={{alignItems:"flex-end"}}/>

      <CustomButton title="Login" onPress={() => router.push("/home")} />

      <JustTextButton title="Don't have an account? Register" onPress={() => router.push("/(auth)/register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor:"#2E2E2E",flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#00E6E6", marginBottom: 20 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
});
