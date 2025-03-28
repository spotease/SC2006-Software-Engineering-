<<<<<<< HEAD
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
=======
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import calculateDistance from "./calculateDistanceXY";
import ConvertCoords from "./ConvertCoords";
>>>>>>> 8d264ad1fb8fa67fa13012776460051a9f434897

/* Return Values are sortedCarParks, readyCPFlag */
const carParkRetrieval = (selectedDestination, filterRadius) => {
  //State Variables
  const [carParks, setCarParks] = useState(null);
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
  const [sortedCarParks, setSortedCarParks] = useState(null);
>>>>>>> 8d264ad1fb8fa67fa13012776460051a9f434897
  const [readyCPFlag, setReadyCPFlag] = useState(false);
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6

  //Variables For Function
<<<<<<< HEAD
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
=======
  const API_URL = `https://sc2006-backend-spotease.onrender.com/carpark/carParkRetrieval`;
  const handleRetrieval = async () => {
    setReadyCPFlag(false);
    const x_coord = selectedDestination.X;
    const y_coord = selectedDestination.Y;
>>>>>>> 8d264ad1fb8fa67fa13012776460051a9f434897
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
<<<<<<< HEAD
=======
        //console.log(data);
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6
=======
>>>>>>> 8d264ad1fb8fa67fa13012776460051a9f434897
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
    console.log("Filter Radius: " + filterRadius);
    console.log(
      selectedDestination.ADDRESS +
        " " +
        selectedDestination.X +
        " " +
        selectedDestination.Y
    );
    handleRetrieval();
  }, [selectedDestination]);

  useEffect(() => {
    if (carParks) {
      //console.log(carParks);
      let processedCarparkData = processData();
      setSortedCarParks(sortByNearest(processedCarparkData));
      console.log(sortedCarParks);
      setReadyCPFlag(true);
    }
  }, [carParks]);

  /* Function to process and remove unnecessary data */
  function processData() {
    processedCarparkData = carParks.map((item) => {
      const [cLatitude, cLongtitude] = ConvertCoords.SVY21ToWGS84(
        item.x_coord,
        item.y_coord
      );
      const distanceAway = calculateDistance(
        selectedDestination.X,
        selectedDestination.Y,
        item.x_coord,
        item.y_coord
      );
      return {
        ADDRESS: item.address,
        CARPARK_NO: item.car_park_no,
        CARPARK_TYPE: item.car_park_type,
        LATITUDE: cLatitude,
        LONGITUDE: cLongtitude,
        X: item.x_coord,
        Y: item.y_coord,
        DISTANCEAWAY: distanceAway,
      };
    });
    return processedCarparkData;
  }
  function sortByNearest(processedCarparkData) {
    return processedCarparkData.sort((a, b) => a.DISTANCEAWAY - b.DISTANCEAWAY);
  }
  return { sortedCarParks, readyCPFlag };
};

export default carParkRetrieval;
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6
