import { View, StyleSheet, Alert, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getMapPreview } from "../../util/location";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";

function LocationPicker() {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [pickedLocation, setPickedLocation] = useState(null);
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };

      if (mapPickedLocation) {
        setPickedLocation(mapPickedLocation);
      }
    }
  }, [route, isFocused]);

  async function verifyPermissions() {
    if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("Insufficient Permissions!", "You need to grant location permissions to use this app.");
      return false;
    }
    return true;
  }

  function pickOnMapHandler() {
    navigation.navigate("Map");
  }
  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const location = await getCurrentPositionAsync();
    if (!location) {
      Alert.alert("Could not get location!", "Please try again later or pick a location on the map.");
      return;
    }
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  let locationPreview = <Text>No location picked yet.</Text>;
  if (pickedLocation) {
    const imagePreviewUrl = getMapPreview(pickedLocation.lat, pickedLocation.lng);
    locationPreview = <Image source={{ uri: imagePreviewUrl }} style={styles.mapImage} />;
  }
  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Get Location
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
