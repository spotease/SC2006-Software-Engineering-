import { useState, useEffect } from "react";

//Custom Hook for fetching search results
const API_URL = `https://sc2006-backend-spotease.onrender.com/carparkRetrival`; // ✅ Correct API endpoint

const searchAPI = (userInput) => {
  // State variables
  const [searchResults, setSearchResults] = useState(null);
  const [loadingFlag, setLoadingFlag] = useState(false);

  useEffect(() => {
    setLoadingFlag(true); // Set loading flag to true

    if (!userInput) {
      setSearchResults(null);
      setLoadingFlag(false);
      return;
    }

    //Fetch Function
    const fetchSearch = async () => {
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
        // console.log(data);
        setSearchResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFlag(false); // Set loading flag to false
      }
    };

    fetchSearch();
  }, [userInput]);
  return { searchResults, loadingFlag };
};

export default searchAPI;
