import { useEffect, useState } from "react";
import { Alert } from "react-native";
import calculateDistance from "./calculateDistanceXY";
import ConvertCoords from "./ConvertCoords";

const carParkRetrieval = (selectedDestination, filterRadius) => {
  //State Variables
  const [carParks, setCarParks] = useState(null);
  const [sortedCarParks, setSortedCarParks] = useState(null);
  const [readyCPFlag, setReadyCPFlag] = useState(false);

  //Variables For Function
  const API_URL = `https://sc2006-backend-spotease.onrender.com/carpark/carParkRetrieval`;
  const handleRetrieval = async () => {
    setReadyCPFlag(false);
    const x_coord = selectedDestination.X;
    const y_coord = selectedDestination.Y;
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
