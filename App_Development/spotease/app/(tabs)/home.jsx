/*
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";

const OneMap = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          html, body, #mapdiv { height: 100%; margin: 0; padding: 0; }
        </style>
        <link rel="stylesheet" href="https://www.onemap.gov.sg/web-assets/libs/leaflet/leaflet.css" />
        <script src="https://www.onemap.gov.sg/web-assets/libs/leaflet/onemap-leaflet.js"></script>
      </head>
      <body>
        <div id="mapdiv"></div>
        <script>
          let sw = L.latLng(1.144, 103.535);
          let ne = L.latLng(1.494, 104.502);
          let bounds = L.latLngBounds(sw, ne);

          let map = L.map('mapdiv', {
            center: L.latLng(1.2868108, 103.8545349),
            zoom: 16
          });

          map.setMaxBounds(bounds);

          let basemap = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
            detectRetina: true,
            maxZoom: 19,
            minZoom: 11,
            attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
          });

          basemap.addTo(map);

          window.addEventListener('message', function(event) {
            let location = JSON.parse(event.data);
            if (location && location.latitude && location.longitude) {
              let userMarker = L.marker([location.latitude, location.longitude]).addTo(map);
              userMarker.bindPopup("You are here!").openPopup();
              map.setView([location.latitude, location.longitude], 16);
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        source={{ html: htmlContent }}
        originWhitelist={["*"]}
        injectedJavaScript={
          location ? `window.postMessage(${JSON.stringify(location)});` : ""
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OneMap;
*/

import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import polyline from "polyline";

const home = () => {
  const routeGeometry =
    "mfgGeslyRHL@z@?rCfAAxA?t@??z@?bF?~@?b@?f@@xC?T?lB?TB`@BLH\\FPLb@`@r@j@h@d@Zp@Xx@Nz@Lp@A|D]TCpAGtCOh@CZCpACr@Ab@AfCA`CB^@`@@b@@d@BnALtA`@dBr@|KtExBhAFD\\X|@r@fD`DPPv@~@PVLRP\\JRZv@R|@Jl@Hh@TPXL`@DxC[tCg@zC]ZLNLNXq@fKg@`NVvGz@lHVzAhA`FlBjGxGxQtFdOlNz_@`CtFlDfHx@rB\\pAt@xDjEvTx@bEzIdv@r@pGlAzHVvBz@xF`@tDTjEJvGFdCNlB^hBj@vBr@`C`CzHfB|Fj@nB^dBN~ACjJQ`B]vAy@lBa@n@c@p@mArAeHbF{AdAwMbJ_D~BeBdBeBlB_AvAq@fAmAjCq@pBo@xBm@vCs@dDs@hCqAxD_ApB_@`A[|AI`B@bANnBr@fDbAlEbChLX~BKxE]bJkAf[MpDC`Hf@`XDv@PbA^xAtA`EbFnKhAdD`AlErEzS@HXvBBlB[dBeAdCcAxB[`AM`ACrBn@lHFxAAdAQjAc@nAqAxBiCvBmArAqAhB]l@g@bAm@fBeDzK}@zBeDlH_FlKyCvGy@`Ci@hCS~A[jBi@hBs@fBy@rAkQlSuA~AoD`EaErEqAxAsOnNoDhDgEtDeF|EuHbHcBpB_BlCiAhCeA`Dc@rCStCAdCJ`CTtBd@pCd@lBj@`Br@lAz@`A`Aj@~@f@`EtAv@V|@ZdAb@`Aj@t@p@r@`Av@vAfDjK|DrMfAzEp@tCv@pDrA~BdA`AtAt@tBv@rMvEdBbAbAv@r@t@jAzAhAzAjDlF`B~CvAjDjBpFbD`Kn@jCPxAVvC@xBAxB[|Ci@vCkAlDgB~DeEhJUb@_LzUcBnD_Rn`@wN~ZqC~F_AtBcBvDk@dBc@nB[fBSjBM~ACbBC|BQvCa@pCs@hCa@fA_@v@u@~As@dAcBhBcC~BwBtBoGxFwDnDwB|BiB`CqAnByBpE{C|FuApCsAhDsAbEcA|Dw@jFYxDS~GOdGOvGShCu@lDyA`FuBhHu@~AcL~M_NjOg@z@[r@i@jA[lAQbAKzAC`ADzAH`ARlATx@Vx@d@bAlAfBpCrCdXrUtChC`@^jCzBjB|AzBlB|@j@bC|AfU~N|B`BlHjG`Ah@rC~Bd@`@Jh@@z@UHqA\\w@PMPCL@R?XNFDNlBCj@J^RxDlE`@b@i@V}Ax@cCbB}BxCi@Z[F]?yCKu@D]HOJWZQ\\I`@S`AQd@m@n@{@p@~DfFTZLJ\\@nFo@\\@ZF|BzA_@POPk@?]?i@?]??_BM@aBR_@F";
  const routeCoordinates = polyline.decode(routeGeometry);

  const onMarkerPress = () => {
    // You can perform any action here when the marker is clicked (no redirection)
    //alert("Marker clicked, but no redirection!");
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 1.2868108, // Center latitude
          longitude: 103.8545349, // Center longitude
          latitudeDelta: 0.05, // Zoom level
          longitudeDelta: 0.05, // Zoom level
        }}
        provider="google" // Set the provider to Google Maps
        toolbarEnabled={false} // Disable the toolbar (which might include extra UI like redirection)
        showsUserLocation={false} // Hide user location
      >
        {/* Marker 1 */}
        <Marker
          coordinate={{
            latitude: 1.35245,
            longitude: 103.94467,
          }}
          onPress={onMarkerPress}
        >
          {/* You can customize the marker */}
        </Marker>
        {/* Marker 2 */}
        <Marker
          coordinate={{
            latitude: 1.34832,
            longitude: 103.68313,
          }}
        >
          {/* You can customize the marker */}
        </Marker>
        <Polyline
          coordinates={routeCoordinates.map((coord) => ({
            latitude: coord[0],
            longitude: coord[1],
          }))}
          strokeColor="blue" // Route line color
          strokeWidth={4} // Line thickness
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default home;
