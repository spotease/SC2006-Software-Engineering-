<<<<<<< HEAD
import React, { useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import EntryBox from "../../components/EntryBox";
import CustomButton from "../../components/CustomButton";
import logo from "../../assets/images/SpotEaseLogo.png";
import Config from "react-native-config";
=======
import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6

const carParkRetrieval = (selectedDestination, filterRadius) => {
  //State Variables
  const [carParks, setCarParks] = useState(null);
<<<<<<< HEAD
=======
  const [readyCPFlag, setReadyCPFlag] = useState(false);
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6

  //Variables For Function
  const router = useRouter();
  const [error, setError] = useState("");
<<<<<<< HEAD
  const API_URL = `https://sc2006-backend-spotease.onrender.com/carParkRetrieval`;

  const handleRetrieval = async () => {
    setError(""); // Clear previous errors

=======
  const API_URL = `https://sc2006-backend-spotease.onrender.com/carpark/carParkRetrieval`;
  const handleRetrieval = async () => {
    setReadyCPFlag(false);
    const x_coord = selectedDestination[0].X;
    const y_coord = selectedDestination[0].Y;

    setError(""); // Clear previous errors
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
        body: JSON.stringify({ email, password }),
=======
        body: JSON.stringify({ x_coord, y_coord, filterRadius }),
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6
      });

      const text = await response.text(); // ✅ Get raw response to avoid JSON parse errors

      // ✅ Check if response is valid JSON before parsing
      let data;
      try {
        data = JSON.parse(text);
        setCarParks(data);
<<<<<<< HEAD
=======
        //console.log(data);
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6
      } catch (err) {
        throw new Error(`Invalid JSON response: ${text}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Internal Server Error");
    }
  };
<<<<<<< HEAD
  return { carParks };
};
=======

  useEffect(() => {
    setReadyCPFlag(false);
    if (!selectedDestination) {
      setCarParks(null);
      return;
    }
    handleRetrieval();
  }, [selectedDestination]);

  useEffect(() => {
    setReadyCPFlag(false);
    if (carParks) {
      console.log("Car Parks have been updated:", carParks);
      setReadyCPFlag(true);
    }
  }, [carParks]);

  return { carParks, readyCPFlag };
};

export default carParkRetrieval;
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6
