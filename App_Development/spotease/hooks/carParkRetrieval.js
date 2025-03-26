import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const carParkRetrieval = (selectedDestination, filterRadius) => {
  //State Variables
  const [carParks, setCarParks] = useState(null);
  const [readyCPFlag, setReadyCPFlag] = useState(false);

  //Variables For Function
  const router = useRouter();
  const [error, setError] = useState("");
  const API_URL = `https://sc2006-backend-spotease.onrender.com/carpark/carParkRetrieval`;
  const handleRetrieval = async () => {
    setReadyCPFlag(false);
    const x_coord = selectedDestination[0].X;
    const y_coord = selectedDestination[0].Y;

    setError(""); // Clear previous errors
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x_coord, y_coord, filterRadius }),
      });

      const text = await response.text(); // ✅ Get raw response to avoid JSON parse errors

      // ✅ Check if response is valid JSON before parsing
      let data;
      try {
        data = JSON.parse(text);
        setCarParks(data);
        //console.log(data);
      } catch (err) {
        throw new Error(`Invalid JSON response: ${text}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Internal Server Error");
    }
  };

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
