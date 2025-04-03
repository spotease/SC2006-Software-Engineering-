// City	010000 - 059999
// Bukit Merah	070000 - 089999
// Sentosa	098000 - 099999
// Southern Islands	099000 - 099999
// Queenstown	100000 - 119999
// Clementi	120000 - 129999
// Bukit Timah	240000 - 259999
// Bukit Panjang	660000 - 669999
// Bedok	460000 - 469999
// Geylang	380000 - 409999
// Marine Parade	440000 - 449999
// Kallang	330000 - 339999
// Toa Payoh	310000 - 319999
// Bishan	570000 - 579999
// Ang Mo Kio	560000 - 569999
// Jurong East	600000 - 609999
// Jurong West	640000 - 649999
// Boon Lay	640000 - 649999
// Bukit Batok	650000 - 659999
// Choa Chu Kang	680000 - 689999
// Tampines	520000 - 529999
// Pasir Ris	510000 - 519999
// Hougang	530000 - 539999
// Sengkang	540000 - 549999
// Serangoon	550000 - 559999
// Punggol	820000 - 829999
// Sungei Kadut	728000 - 728999
// Mandai	729000 - 729999
// Woodlands	730000 - 739999
// Lim Chu Kang	710000 - 719999
// Yishun	760000 - 769999
// Seletar	797000 - 797999
// Novena	307000 - 307999
// Tanglin	247000 - 249999
// Changi	498000 - 499999
// Paya Lebar	409000 - 409999
// Pulau Tekong	508000 - 508999
// Pulau Ubin	508000 - 508999
// Pioneer	628000 - 628999
// Jurong Island	627000 - 627999
// Western Water Catchment	700000 - 709999
// Tengah	690000 - 699999
// Tuas	637000 - 639999
// Bukit Timah	240000 - 259999
// Central Water Catchment	298000 - 299999
// Jalan Bahar	649000 - 649999
// Sembawang	750000 - 759999
import React, { useState, useEffect } from "react";
import searchAPI from "./searchAPI"; // Import custom searchAPI hook

const postal_mapping = {
  City: ["010000", "059999"],
  "Bukit Merah": ["070000", "089999"],
  Sentosa: ["098000", "099999"],
  "Southern Islands": ["099000", "099999"],
  Queenstown: ["100000", "119999"],
  Clementi: ["120000", "129999"],
  "Bukit Timah": ["240000", "259999"],
  "Bukit Panjang": ["660000", "669999"],
  Bedok: ["460000", "469999"],
  Geylang: ["380000", "409999"],
  "Marine Parade": ["440000", "449999"],
  Kallang: ["330000", "339999"],
  "Toa Payoh": ["310000", "319999"],
  Bishan: ["570000", "579999"],
  "Ang Mo Kio": ["560000", "569999"],
  "Jurong East": ["600000", "609999"],
  "Jurong West": ["640000", "649999"],
  "Boon Lay": ["640000", "649999"],
  "Bukit Batok": ["650000", "659999"],
  "Choa Chu Kang": ["680000", "689999"],
  Tampines: ["520000", "529999"],
  "Pasir Ris": ["510000", "519999"],
  Hougang: ["530000", "539999"],
  Sengkang: ["540000", "549999"],
  Serangoon: ["550000", "559999"],
  Punggol: ["820000", "829999"],
  "Sungei Kadut": ["728000", "728999"],
  Mandai: ["729000", "729999"],
  Woodlands: ["730000", "739999"],
  "Lim Chu Kang": ["710000", "719999"],
  Yishun: ["760000", "769999"],
  Seletar: ["797000", "797999"],
  Novena: ["307000", "307999"],
  Tanglin: ["247000", "249999"],
  Changi: ["498000", "499999"],
  "Paya Lebar": ["409000", "409999"],
  "Pulau Tekong": ["508000", "508999"],
  "Pulau Ubin": ["508000", "508999"],
  Pioneer: ["628000", "628999"],
  "Jurong Island": ["627000", "627999"],
  "Western Water Catchment": ["700000", "709999"],
  Tengah: ["690000", "699999"],
  Tuas: ["637000", "639999"],
  "Bukit Timah": ["240000", "259999"],
  "Central Water Catchment": ["298000", "299999"],
  "Jalan Bahar": ["649000", "649999"],
  Sembawang: ["750000", "759999"],
};

const ConvertPostalToRegion = (selectedDest) => {
  const [selectedRegion, setSelectedRegion] = useState(""); // To store the region
  /*
  const { searchResults, loadingFlag } = searchAPI(userInput); // Fetching data with searchAPI hook using userInput

  // Effect to update postal code when search results are available
  useEffect(() => {
    if (searchResults && searchResults.length >= 1 && !loadingFlag) {
      // Assuming you want to take the first result's postal code
      const resultPostalCode = searchResults[0].POSTAL;
      console.log(searchResults);
      // console.log(resultPostalCode);

      for (const area in postal_mapping) {
        const start = Number(postal_mapping[area][0]);
        const end = Number(postal_mapping[area][1]);
        if (resultPostalCode >= start && resultPostalCode <= end) {
          setRegion(area);
          console.log(region);
          break;
        }
      }
    }
  }, [searchResults]);
  */
 useEffect(()=>{


  if(selectedDest != null){
    const resultPostalCode = selectedDest.POSTAL;


    for (const area in postal_mapping) {
      const start = Number(postal_mapping[area][0]);
      const end = Number(postal_mapping[area][1]);
      if (resultPostalCode >= start && resultPostalCode <= end) {
        setSelectedRegion(area);
        break;
      }
    }
  }
},[selectedDest]);
 return { selectedRegion };
};

export default ConvertPostalToRegion;
