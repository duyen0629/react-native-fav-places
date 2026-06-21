import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Alert } from "react-native";
import { useState, useLayoutEffect, useCallback } from "react";
import IconButton from "../components/UI/IconButton";

function Map({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const region = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  function handleSelectLocation(event) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;
    setSelectedLocation({ lat, lng });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert("No location picked!", "Please press on the map to pick a location.");
      return;
    }
    navigation.navigate("AddPlace", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton icon="save" size={24} color={tintColor} onPress={savePickedLocationHandler} />
      ),
    });
  }, [navigation, savePickedLocationHandler]);

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
