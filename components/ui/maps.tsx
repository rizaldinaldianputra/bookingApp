import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function OSMMap() {
  const BOGOR_LATITUDE = -6.595038;
  const BOGOR_LONGITUDE = 106.799736;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>#map { height: 100%; width: 100%; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${BOGOR_LATITUDE}, ${BOGOR_LONGITUDE}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);
          L.marker([${BOGOR_LATITUDE}, ${BOGOR_LONGITUDE}]).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView originWhitelist={['*']} source={{ html }} />
    </View>
  );
}
