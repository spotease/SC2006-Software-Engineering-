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
  const [sortedCarParks, setSortedCarParks] = useState([]);
  const [readyCPFlag, setReadyCPFlag] = useState(false);
>>>>>>> bd60e5122ff942ab64fc5e6bf6b06457bef7c9f6

  const API_URL = `https://sc2006-backend-spotease.onrender.com/carpark/carParkRetrieval`;

  useEffect(() => {
    const handleRetrieval = async () => {
      if (!selectedDestination || !selectedDestination.X || !selectedDestination.Y) {
        setCarParks([]);
        setReadyCPFlag(false);
        return;
      }

      setReadyCPFlag(false);
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            x_coord: selectedDestination.X,
            y_coord: selectedDestination.Y,
            filterRadius,
          }),
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
          setCarParks(data);
        } catch (err) {
          throw new Error(`Invalid JSON response: ${text}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Alert.alert("Error", "Internal Server Error");
      }
    };

    handleRetrieval();
  }, [selectedDestination, filterRadius]);

  useEffect(() => {
    if (carParks) {
      const processed = carParks.map((item) => {
        const [cLat, cLng] = ConvertCoords.SVY21ToWGS84(item.x_coord, item.y_coord);
        const distance = calculateDistance(
          selectedDestination.X,
          selectedDestination.Y,
          item.x_coord,
          item.y_coord
        );
        return {
          ADDRESS: item.address,
          CARPARK_NO: item.car_park_no,
          CARPARK_TYPE: item.car_park_type,
          LATITUDE: cLat,
          LONGITUDE: cLng,
          X: item.x_coord,
          Y: item.y_coord,
          DISTANCEAWAY: distance,
        };
      });

      const sorted = processed.sort((a, b) => a.DISTANCEAWAY - b.DISTANCEAWAY);
      setSortedCarParks(sorted);
      setReadyCPFlag(true);
    }
  }, [carParks]);

  return { sortedCarParks, readyCPFlag };
};

export default useCarParkRetrieval;
