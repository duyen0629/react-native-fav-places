import { View, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";

function LocationPicker() {
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

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
    console.log("Pick on map");
  }
  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    console.log(hasPermission);
    if (!hasPermission) {
      return;
    }
    const location = await getCurrentPositionAsync();
    if (!location) {
      Alert.alert("Could not get location!", "Please try again later or pick a location on the map.");
      return;
    }
    console.log(location);
  }

  return (
    <View>
      <View style={styles.mapPreview}></View>
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
});
