import MapView, { Marker } from "react-native-maps";
import { StyleSheet } from "react-native";
import { useState } from "react";

function Map() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  function handleSelectLocation(event) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ lat, lng });
  }

  const region = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <MapView initialRegion={region} style={styles.map} onPress={handleSelectLocation}>
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{ latitude: selectedLocation.lat, longitude: selectedLocation.lng }}
        />
      )}
    </MapView>
  );
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
