import { View, StyleSheet, Alert, Text, Image } from "react-native";
import { useEffect, useState } from "react";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location";
import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getMapPreview } from "../../util/location";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { getAddress } from "../../util/location";

function isValidLocation(location) {
  return location?.lat != null && location?.lng != null;
}

function LocationPicker({ onLocationPicked, location }) {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [pickedLocation, setPickedLocation] = useState(isValidLocation(location) ? location : null);
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

  useEffect(() => {
    if (isValidLocation(location)) {
      setPickedLocation(location);
    } else if (location == null) {
      setPickedLocation(null);
    }
  }, [location]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const lat = route.params?.pickedLat;
    const lng = route.params?.pickedLng;

    if (lat == null || lng == null) {
      return;
    }

    setPickedLocation({ lat, lng });
    navigation.setParams({ pickedLat: undefined, pickedLng: undefined });
  }, [isFocused, route.params?.pickedLat, route.params?.pickedLng, navigation]);

  useEffect(() => {
    async function handleLocation() {
      if (!isValidLocation(pickedLocation)) {
        return;
      }
      if (pickedLocation.address) {
        onLocationPicked(pickedLocation);
        return;
      }
      try {
        const address = await getAddress(pickedLocation.lat, pickedLocation.lng);
        onLocationPicked({ ...pickedLocation, address });
      } catch {
        // Keep coordinates in form state even if reverse geocoding fails.
        onLocationPicked({
          ...pickedLocation,
          address: "Unknown address",
        });
      }
    }
    handleLocation();
  }, [pickedLocation, onLocationPicked]);

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

  async function getLocationHandler() {
    if (isValidLocation(pickedLocation)) {
      navigation.navigate("Map", {
        initialLat: pickedLocation.lat,
        initialLng: pickedLocation.lng,
        returnScreen: route.name,
      });
      return;
    }

    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const locationResult = await getCurrentPositionAsync();
    if (!locationResult) {
      Alert.alert("Could not get location!", "Please try again later.");
      return;
    }
    navigation.navigate("Map", {
      initialLat: locationResult.coords.latitude,
      initialLng: locationResult.coords.longitude,
      returnScreen: route.name,
    });
  }

  const hasLocation = isValidLocation(pickedLocation);

  let locationPreview = (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>Where is your happy place?</Text>
    </View>
  );
  if (hasLocation) {
    const imagePreviewUrl = getMapPreview(pickedLocation.lat, pickedLocation.lng);
    locationPreview = <Image source={{ uri: imagePreviewUrl }} style={styles.mapImage} />;
  }
  return (
    <View>
      <View style={[styles.mapPreview, hasLocation ? styles.filledPreview : styles.placeholderPreview]}>
        {locationPreview}
      </View>
      <OutlinedButton icon="location" onPress={getLocationHandler}>
        Get Location
      </OutlinedButton>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surfaceSoft,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.primary200,
    borderStyle: "dashed",
  },
  placeholderPreview: {
    height: 90,
  },
  filledPreview: {
    height: 180,
    borderStyle: "solid",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.gray500,
    fontWeight: "600",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
});
