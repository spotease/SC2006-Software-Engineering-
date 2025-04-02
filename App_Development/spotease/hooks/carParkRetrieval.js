import { useEffect, useState, useRef } from "react";
import { Alert } from "react-native";
import calculateDistance from "./calculateDistanceXY";
import ConvertCoords from "./ConvertCoords";
import retrieveLotsAPI from "./retrieveLotsAPI";

/* Return Values are sortedCarParks, readyCPFlag */
const carParkRetrieval = (selectedDestination, filterRadius) => {
  //State Variables
  const [carParks, setCarParks] = useState([]);
  const [sortedCarParks, setSortedCarParks] = useState([]);
  const [readyCPFlag, setReadyCPFlag] = useState(false);
  const [lotsData, setLotsData] = useState([]);
  const API_URL = `https://sc2006-backend-spotease.onrender.com/carpark/carParkRetrieval`;

  const isBusy = useRef(false);

  const handleRetrieval = async () => {
    if (isBusy.current) return;
    isBusy.current = true;
    setReadyCPFlag(false);
    if (!selectedDestination || selectedDestination.X == undefined) {
      setCarParks([]);
      isBusy.current = false;
      return;
    }

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

      // Save data into carParks after getting response
      const data = await response.json();
      setCarParks(data);
      // Once carParks is updated, retrieve lots data
      const lots = await retrieveLotsAPI();
      setLotsData(lots);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Internal Server Error");
    } finally {
      isBusy.current = false;
    }
  };

  const processCarParks = async () => {
    if (isBusy.current) return;
    isBusy.current = true;
    try {
      if (carParks.length > 0 && lotsData.length > 0) {
        const processed = carParks.map((item) => {
          const carparkInfo = lotsData.find(
            (cp) => cp.carpark_number === item.car_park_no
          );
          let carpark_info = {
            lot_type: NaN,
            lots_available: NaN,
            total_lots: NaN,
          };
          let updatetime = NaN;
          if (carparkInfo !== undefined) {
            carpark_info = carparkInfo.carpark_info;
            updatetime = carparkInfo.update_datetime;
          }

          const [cLat, cLng] = ConvertCoords.SVY21ToWGS84(
            item.x_coord,
            item.y_coord
          );
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
            CARPARK_INFO: carpark_info,
            UPDATETIME: updatetime,
            DISTANCEAWAY: distance,
          };
        });

        const sorted = processed.sort(
          (a, b) => a.DISTANCEAWAY - b.DISTANCEAWAY
        );
        setSortedCarParks(sorted);
        console.log(sortedCarParks);
        setReadyCPFlag(true);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      isBusy.current = false;
    }
  };

  //When FilterRadius or SelectedDestination Is Updated, Retrieve Nearby Carparks
  useEffect(() => {
    handleRetrieval();
  }, [selectedDestination, filterRadius]);

  //Processing of carParks after carParks or lotsData is updated.
  useEffect(() => {
    processCarParks();
  }, [carParks, lotsData]);
  return { sortedCarParks, readyCPFlag };
};

export default carParkRetrieval;
