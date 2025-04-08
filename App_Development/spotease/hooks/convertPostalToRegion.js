// 010000–059999	City	City
// 060000–069999	Chinatown	City
// 070000–079999	Tanjong Pagar	City
// 080000–089999	Anson	City
// 090000–097999	Telok Blangah	Queenstown
// 098000–099999	Sentosa	Sentosa
// 110000–119999	Pasir Panjang	Queenstown
// 120000–129999	Clementi	Clementi
// 130000–139999	Buona Vista	Queenstown
// 140000–149999	Queenstown	Queenstown
// 150000–169999	Bukit Merah	Bukit Merah
// 170000–179999	High Street	City
// 180000–187999	Beach Road	City
// 188000–189999	Middle Road	City
// 190000–199999	Rochor	City
// 200000–209999	Little India	City
// 220000–228999	Orchard	City
// 229000–229999	Cairnhill	City
// 230000–239999	River Valley	City
// 247000–258999	Tanglin	Tanglin
// 259000–259999	Holland Road	Tanglin
// 260000–269999	Bukit Timah	Bukit Timah
// 280000–289999	Newton	Novena
// 290000–299999	Novena	Novena
// 300000–306999	Balestier	Toa Payoh
// 307000–309999	Novena	Novena
// 310000–319999	Toa Payoh	Toa Payoh
// 330000–339999	Kallang	Kallang
// 340000–349999	Macpherson	Kallang
// 350000–359999	Potong Pasir	Kallang
// 380000–389999	Geylang	Geylang
// 397000–399999	Kallang 2	Kallang
// 400000–409999	Eunos	Bedok
// 410000–419999	Kembangan	Bedok
// 420000–429999	Katong	Marine Parade
// 430000–439999	Joo Chiat	Marine Parade
// 440000–449999	Marine Parade	Marine Parade
// 450000–459999	Siglap	Bedok
// 460000–469999	Bayshore	Bedok
// 470000–479999	Chai Chee	Bedok
// 480000–489999	Bedok	Bedok
// 490000–499999	Changi	Changi
// 500000–509999	Loyang	Pasir Ris
// 510000–519999	Pasir Ris	Pasir Ris
// 520000–529999	Tampines	Tampines
// 530000–539999	Hougang	Hougang
// 540000–549999	Sengkang	Sengkang
// 550000–559999	Serangoon	Serangoon
// 560000–569999	Ang Mo Kio	Ang Mo Kio
// 570000–579999	Bishan	Bishan
// 580000–589999	Upper Bukit Timah	Bukit Timah
// 590000–599999	Clementi Park	Clementi
// 600000–609999	Jurong East	Jurong East
// 628000–628999	Pioneer	Pioneer
// 629000–636999	Jurong West 2	Jurong West
// 637000–638999	Tuas	Tuas
// 639000–639999	Jalan Bahar	Jalan Bahar
// 640000–643999	Jurong West	Jurong West
// 650000–659999	Bukit Batok	Bukit Batok
// 670000–679999	Bukit Panjang	Bukit Panjang
// 680000–689999	Choa Chu Kang	Choa Chu Kang
// 690000–699999	Tengah	Tengah
// 710000–719999	Lim Chu Kang	Lim Chu Kang
// 720000–728999	Sungei Kadut	Sungei Kadut
// 729000–729999	Mandai	Mandai
// 730000–739999	Woodlands	Woodlands
// 750000–759999	Sembawang	Sembawang
// 760000–769999	Yishun	Yishun
// 787000–787999	Tagore	Ang Mo Kio
// 788000–788999	Yio Chu Kang	Ang Mo Kio
// 797000–809999	Seletar	Seletar
// 819000–819999	Changi 2	Changi
// 820000–829999	Punggol	Punggol
import React, { useState, useEffect } from "react";
import searchAPI from "./searchAPI"; // Import custom searchAPI hook
const postal_mapping = {
  "City": [
    ["000000", "059999"],    // City 1
    ["060000", "069999"],    // City 2
    ["070000", "079999"],    // City 3
    ["080000", "089999"],    // City 4
    ["170000", "239999"],    // City 5
    ["240000", "246999"],    // City 6
  ],
  "Queenstown": [
    ["090000", "097999"],
    ["110000", "119999"],
    ["130000", "149999"],
  ],
  "Sentosa": [["098000", "099999"]],
  "Bukit Merah": [["150000", "169999"]],
  "Tanglin": [["247000", "259999"]],
  "Bukit Timah": [
    ["260000", "269999"],
    ["270000", "279999"],
    ["580000", "589999"],
  ],
  "Novena": [
    ["280000", "289999"],
    ["290000", "299999"],
  ],
  "Toa Payoh": [
    ["300000", "306999"],
    ["310000", "319999"],
    ["320000", "329999"],
  ],
  "Kallang": [
    ["330000", "339999"],
    ["340000", "349999"],
    ["350000", "359999"],
    ["360000", "379999"],
    ["397000", "399999"],
  ],
  "Geylang": [["380000", "389999"], ["390000", "396999"]],
  "Bedok": [
    ["400000", "419999"],
    ["450000", "489999"],
  ],
  "Marine Parade": [["420000", "449999"]],
  "Changi": [["490000", "499999"], ["819000", "819999"]],
  "Pasir Ris": [["500000", "519999"]],
  "Tampines": [["520000", "529999"]],
  "Hougang": [["530000", "539999"]],
  "Sengkang": [["540000", "549999"]],
  "Serangoon": [["550000", "559999"]],
  "Ang Mo Kio": [
    ["560000", "569999"],
    ["787000", "787999"],
    ["788000", "788999"],
    ["789000", "796999"],
  ],
  "Bishan": [["570000", "579999"]],
  "Clementi": [["590000", "599999"]],
  "Jurong East": [["600000", "627999"]],
  "Pioneer": [["628000", "628999"]],
  "Jurong West": [["629000", "636999"], ["640000", "649999"]],
  "Tuas": [["637000", "638999"]],
  "Jalan Bahar": [["639000", "639999"]],
  "Bukit Batok": [["650000", "669999"]],
  "Bukit Panjang": [["670000", "679999"]],
  "Choa Chu Kang": [["680000", "689999"]],
  "Tengah": [["690000", "699999"]],
  "Western Water Catchment": [["700000", "709999"]],
  "Lim Chu Kang": [["710000", "719999"]],
  "Sungei Kadut": [["720000", "728999"]],
  "Mandai": [["729000", "729999"]],
  "Woodlands": [["730000", "749999"]],
  "Sembawang": [["750000", "759999"]],
  "Yishun": [["760000", "786999"]],
  "Seletar": [["797000", "809999"], ["810000", "818999"]],
  "Punggol": [["820000", "999999"]],
};


const ConvertPostalToRegion = (selectedPOSTAL) => {
  let resultPostalCode = selectedPOSTAL;

  for (const area in postal_mapping) {
    const ranges = postal_mapping[area];
    for (let i = 0; i < ranges.length; i++) {
      const start = Number(ranges[i][0]);
      const end = Number(ranges[i][1]);
      if (resultPostalCode >= start && resultPostalCode <= end) {
        return area;
      }
    }
  }
};

export default ConvertPostalToRegion;


//   const [selectedRegion, setSelectedRegion] = useState(""); // To store the region
//   /*
//   const { searchResults, loadingFlag } = searchAPI(userInput); // Fetching data with searchAPI hook using userInput

//   // Effect to update postal code when search results are available
//   useEffect(() => {
//     if (searchResults && searchResults.length >= 1 && !loadingFlag) {
//       // Assuming you want to take the first result's postal code
//       const resultPostalCode = searchResults[0].POSTAL;
//       console.log(searchResults);
//       // console.log(resultPostalCode);

//       for (const area in postal_mapping) {
//         const start = Number(postal_mapping[area][0]);
//         const end = Number(postal_mapping[area][1]);
//         if (resultPostalCode >= start && resultPostalCode <= end) {
//           setRegion(area);
//           console.log(region);
//           break;
//         }
//       }
//     }
//   }, [searchResults]);
//   */
//  useEffect(()=>{


//   if(selectedPOSTAL != null){
//     console.log(selectedPOSTAL);
//     const resultPostalCode = selectedPOSTAL;
//     for (const area in postal_mapping) {
//       const start = Number(postal_mapping[area][0]);
//       const end = Number(postal_mapping[area][1]);
//       if (resultPostalCode >= start && resultPostalCode <= end) {
//         setSelectedRegion(area);
//         break;
//       }
//     }
//   }
// },[selectedPOSTAL]);
//  return { selectedRegion };
// };

// export default ConvertPostalToRegion;
