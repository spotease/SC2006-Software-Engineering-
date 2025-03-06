import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import EntryBox from "../../components/EntryBox";
import CustomButton from "../../components/CustomButton";
import JustTextButton from '../../components/JustTextButton';

export default function register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    <View>
      <Text>register</Text>
    </View>
  )
}