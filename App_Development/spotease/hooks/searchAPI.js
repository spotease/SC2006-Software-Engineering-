import { useState, useEffect, useRef } from "react";
import ConvertCoords from "../functions/Location Related/convertCoords";
//Custom Hook for fetching search results
const searchAPI = (userInput) => {
  // State variables
  const [retrieveSearch, setRetrieveSearch] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingFlag, setLoadingFlag] = useState(false);

  const isBusy = useRef(false);
  //Fetch Function
  const fetchSearch = async () => {
    if (isBusy.current) return;
    isBusy.current = true;

    try {
      const baseURL = "https://www.onemap.gov.sg/api/common/elastic/search?";
      const params = new URLSearchParams({
        searchVal: userInput, // Dynamically set searchVal
        returnGeom: "Y",
        getAddrDetails: "Y",
      });

      const url = `${baseURL}${params}`;
      const authToken =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlYmU0OWUwNzZjNDIxZmNjNGM1YWI2ZTA1OGE0ZWVmYiIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC1uZXctMTYzMzc5OTU0Mi5hcC1zb3V0aGVhc3QtMS5lbGIuYW1hem9uYXdzLmNvbS9hcGkvdjIvdXNlci9wYXNzd29yZCIsImlhdCI6MTc0MTY4OTUzNywiZXhwIjoxNzQxOTQ4NzM3LCJuYmYiOjE3NDE2ODk1MzcsImp0aSI6IlpDMXlIQlF6d0o5TGNPVDQiLCJ1c2VyX2lkIjo2MzEzLCJmb3JldmVyIjpmYWxzZX0.reqCarba6knwaMSo_DOA_clMtZ3E-XwZBcth_oG8gQw"; // Replace with your access token

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `${authToken}`, // API token for authorization
        },
      });
      if (!response.ok) {
        throw new Error("Failed To Fetch");
      }

      const data = await response.json();
      //console.log(data);
      setRetrieveSearch(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingFlag(false); // Set loading flag to false
      isBusy.current = false;
    }
  };

  useEffect(() => {
    setLoadingFlag(true); // Set loading flag to true
    if (!userInput) {
      setRetrieveSearch(null);
      setSearchResults([]);
      setLoadingFlag(false);
      return;
    }

    fetchSearch();
  }, [userInput]);

  useEffect(() => {
    if (isBusy.current) return;
    isBusy.current = true;
    if (retrieveSearch && retrieveSearch.results) {
      const slicedResults = retrieveSearch.results.slice(0, 5); // Slice the first 5 results
      const processing = slicedResults.map((result) => {
        const ADDRESS = result.ADDRESS;
        const LATITUDE = parseFloat(result.LATITUDE);
        const LONGITUDE = parseFloat(result.LONGITUDE);
        const [X, Y] = ConvertCoords.WGS84ToSVY21(LATITUDE, LONGITUDE);
        const POSTAL = result.POSTAL;
        return {
          ADDRESS,
          LONGITUDE,
          LATITUDE,
          POSTAL,
          X,
          Y,
        };
      });
      setSearchResults(processing); // Store processed results in state
      //console.log(searchResults);
    } else {
      setSearchResults([]);
    }
    isBusy.current = false;
  }, [retrieveSearch]);
  return { searchResults, loadingFlag };
};

export default searchAPI;
