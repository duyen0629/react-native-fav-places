import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Alert } from "react-native";
import { Colors } from "../constants/colors";
import { useState, useLayoutEffect, useCallback } from "react";
import IconButton from "../components/UI/IconButton";

function Map({ navigation, route }) {
  const isReadOnly = route.params?.readOnly;
  const initialLocation =
    route.params?.initialLat != null && route.params?.initialLng != null
      ? { lat: route.params.initialLat, lng: route.params.initialLng }
      : null;
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const region = {
    latitude: initialLocation?.lat || 37.7749,
    longitude: initialLocation?.lng || -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  function handleSelectLocation(event) {
    if (isReadOnly) {
      return;
    }
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
    if (isReadOnly) {
      return;
    }
    navigation.setOptions({
      headerRight: () => <IconButton icon="save" size={18} onPress={savePickedLocationHandler} />,
    });
  }, [navigation, savePickedLocationHandler, isReadOnly]);

  return (
    <MapView initialRegion={region} style={styles.map} onPress={handleSelectLocation}>
      {selectedLocation && (
        <Marker
          title="Picked Location"
          pinColor={Colors.primary500}
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
