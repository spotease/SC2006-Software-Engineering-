import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import SearchBar from "../../components/SearchBar";
import ConvertCoords from "../../hooks/ConvertCoords";
import calculateDistance from "../../hooks/calculateDistanceXY";
import searchAPI from "../../hooks/searchAPI";
import carParkRetrieval from "../../hooks/carParkRetrieval";

export default function homeTest() {
  const [userInput, setUserInput] = useState("");
  const [processedResults, setProcessedResults] = useState([]);
  const [resultAvailable, setResultAvailable] = useState(false);
  const { searchResults, loadingFlag } = searchAPI(userInput);

  const carParkData = [
    {
      "Car Park No": "ACB",
      Address: "BLK 270/271 ALBERT CENTRE BASEMENT CAR PARK",
      "X Coord": 30314.7936,
      "Y Coord": 31490.4942,
      "Car Park Type": "BASEMENT CAR PARK",
      "Type Of Parking System": "ELECTRONIC PARKING",
      "Short Term Parking": "WHOLE DAY",
      "Free Parking": "NO",
      "Night Parking": "YES",
      "Car Park Decks": "1",
      "Gantry Height": "1.8",
      "Car Park Basement": "Y",
    },
    {
      "Car Park No": "ACM",
      Address: "BLK 98A ALJUNIED CRESCENT",
      "X Coord": 33758.4144,
      "Y Coord": 33695.5198,
      "Car Park Type": "MULTI-STOREY CAR PARK",
      "Type Of Parking System": "ELECTRONIC PARKING",
      "Short Term Parking": "WHOLE DAY",
      "Free Parking": "SUN & PH FR 7AM-10.30PM",
      "Night Parking": "YES",
      "Car Park Decks": "5",
      "Gantry Height": "2.1",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AH1",
      Address: "BLK 101 JALAN DUSUN",
      "X Coord": 29257.7203,
      "Y Coord": 34500.3599,
      "Car Park Type": "SURFACE CAR PARK",
      "Type Of Parking System": "ELECTRONIC PARKING",
      "Short Term Parking": "WHOLE DAY",
      "Free Parking": "SUN & PH FR 7AM-10.30PM",
      "Night Parking": "YES",
      "Car Park Decks": "0",
      "Gantry Height": "0",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AK19",
      Address: "BLOCK 253 ANG MO KIO STREET 21",
      "X Coord": 28185.4359,
      "Y Coord": 39012.6664,
      "Car Park Type": "SURFACE CAR PARK",
      "Type Of Parking System": "COUPON PARKING",
      "Short Term Parking": "7AM-7PM",
      "Free Parking": "NO",
      "Night Parking": "NO",
      "Car Park Decks": "0",
      "Gantry Height": "0",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AK31",
      Address: "BLK 302/348 ANG MO KIO STREET 31",
      "X Coord": 29482.029,
      "Y Coord": 38684.1754,
      "Car Park Type": "SURFACE CAR PARK",
      "Type Of Parking System": "COUPON PARKING",
      "Short Term Parking": "NO",
      "Free Parking": "NO",
      "Night Parking": "NO",
      "Car Park Decks": "0",
      "Gantry Height": "0",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AK52",
      Address: "BLK 513 ANG MO KIO STREET 53",
      "X Coord": 29889.3457,
      "Y Coord": 39382.8134,
      "Car Park Type": "SURFACE CAR PARK",
      "Type Of Parking System": "COUPON PARKING",
      "Short Term Parking": "WHOLE DAY",
      "Free Parking": "NO",
      "Night Parking": "YES",
      "Car Park Decks": "0",
      "Gantry Height": "0",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AK83",
      Address: "BLK 5022 TO 5095 ANG MO KIO INDUSTRIAL PARK 2",
      "X Coord": 31397.2241,
      "Y Coord": 39851.6191,
      "Car Park Type": "SURFACE CAR PARK",
      "Type Of Parking System": "COUPON PARKING",
      "Short Term Parking": "NO",
      "Free Parking": "NO",
      "Night Parking": "NO",
      "Car Park Decks": "0",
      "Gantry Height": "0",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AK9",
      Address: "ANG MO KIO AVENUE 9",
      "X Coord": 29674.8184,
      "Y Coord": 40616.875,
      "Car Park Type": "SURFACE CAR PARK",
      "Type Of Parking System": "COUPON PARKING",
      "Short Term Parking": "NO",
      "Free Parking": "NO",
      "Night Parking": "NO",
      "Car Park Decks": "0",
      "Gantry Height": "0",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AM14",
      Address: "BLK 227 ANG MO KIO STREET 23",
      "X Coord": 28777.0707,
      "Y Coord": 38973.9528,
      "Car Park Type": "MULTI-STOREY CAR PARK",
      "Type Of Parking System": "ELECTRONIC PARKING",
      "Short Term Parking": "WHOLE DAY",
      "Free Parking": "NO",
      "Night Parking": "YES",
      "Car Park Decks": "6",
      "Gantry Height": "2.15",
      "Car Park Basement": "N",
    },
    {
      "Car Park No": "AM16",
      Address: "BLK 256A ANG MO KIO STREET 21",
      "X Coord": 28267.0582,
      "Y Coord": 39151.8344,
      "Car Park Type": "MULTI-STOREY CAR PARK",
      "Type Of Parking System": "ELECTRONIC PARKING",
      "Short Term Parking": "WHOLE DAY",
      "Free Parking": "SUN & PH FR 7AM-10.30PM",
      "Night Parking": "YES",
      "Car Park Decks": "2",
      "Gantry Height": "2.15",
      "Car Park Basement": "N",
    },
  ];
  const [carParksWithinRadius, setCarParkWithinRadius] = useState(null);
  const { carParks, readyCPFlag } = carParkRetrieval(processedResults[0], 200);

  useEffect(() => {
    if (searchResults && searchResults.results) {
      const slicedResults = searchResults.results.slice(0, 5); // Slice the first 5 results
      //console.log(slicedResults);
      const processing = slicedResults.map((result) => {
        const ADDRESS = result.ADDRESS;
        const LATITUDE = parseFloat(result.LATITUDE);
        const LONGITUDE = parseFloat(result.LONGITUDE);
        const [X, Y] = ConvertCoords.WGS84ToSVY21(LATITUDE, LONGITUDE);
        const [testLat, testLog] = ConvertCoords.SVY21ToWGS84(X, Y);
        console.log(testLat, testLog);
        const radius = 500;
        carParksWithinRadius1 = carParkData.filter((carPark) => {
          const distance = calculateDistance(
            X,
            Y,
            carPark["X Coord"],
            carPark["Y Coord"]
          );
          //console.log(distance);
          return distance <= radius;
        });
        setCarParkWithinRadius(carParksWithinRadius);

        return {
          ADDRESS,
          LONGITUDE,
          LATITUDE,
          X,
          Y,
        };
      });
      //console.log(processing);
      setProcessedResults(processing); // Store processed results in state
      setResultAvailable(true); // Set result available flag to true
    } else {
      setResultAvailable(false); // Set result available flag to false
    }
  }, [searchResults]);

  return (
    <View style={styles.container}>
      {loadingFlag && <Text>Loading...</Text>}
      <Text style={styles.resultText}>Search Results:</Text>
      {resultAvailable && !loadingFlag ? (
        <ScrollView style={styles.searchResultsContainer}>
          {/* Display only the first 10 results */}
          {processedResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text>{result.ADDRESS}</Text>
              <Text>
                Latitude: {result.LATITUDE} Longitude: {result.LONGITUDE}
              </Text>
              <Text>
                X: {result.X} Y: {result.Y}
              </Text>
              <Text>
                Distance:
                {calculateDistance(
                  result.X,
                  result.Y,
                  carParkData[9]["X Coord"],
                  carParkData[9]["Y Coord"]
                )}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>No results found.</Text>
      )}
      <SearchBar onSearch={setUserInput} />
      <Text>{userInput}</Text>
      {carParksWithinRadius ? (
        carParksWithinRadius.map((carPark, index) => (
          <View key={index}>
            <Text>{carPark["Car Park No"]}</Text>
          </View>
        ))
      ) : (
        <Text>NIL</Text>
      )}
      {readyCPFlag && carParks[0] ? (
        <Text>{carParks[0].address}</Text>
      ) : (
        <Text>False</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  dataContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  resultText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
});
