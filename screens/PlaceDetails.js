import { View, Text, StyleSheet, Image, Alert } from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import IconButton from "../components/UI/IconButton";
import { Colors } from "../constants/colors";
import { useEffect, useLayoutEffect, useState } from "react";
import { deletePlace, fetchPlaceById } from "../util/database";

function PlaceDetails({ route, navigation }) {
  const selectedPlaceId = route.params.placeId;
  const [loadedPlace, setLoadedPlace] = useState(null);

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: loadedPlace.lat,
      initialLng: loadedPlace.lng,
      readOnly: true,
    });
  }

  useEffect(() => {
    async function loadPlaceData() {
      const place = await fetchPlaceById(selectedPlaceId);
      setLoadedPlace(place);
    }

    loadPlaceData();
  }, [selectedPlaceId]);

  useLayoutEffect(() => {
    if (!loadedPlace) {
      return;
    }

    navigation.setOptions({
      title: loadedPlace.title,
      headerRight: () => <IconButton icon="trash" size={22} onPress={deletePlaceHandler} />,
    });
  }, [navigation, loadedPlace, selectedPlaceId]);

  function deletePlaceHandler() {
    Alert.alert("Delete Place", "Are you sure you want to delete this place?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePlace(selectedPlaceId);
            navigation.goBack();
          } catch {
            Alert.alert("Error", "Could not delete place. Please try again.");
          }
        },
      },
    ]);
  }

  if (!loadedPlace) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.loadingEmoji}>💕</Text>
        <Text style={styles.loadingText}>Loading place data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: loadedPlace.imageUri }} style={styles.image} />
      </View>
      <View style={styles.addressCard}>
        <Text style={styles.addressLabel}>🎀 Address</Text>
        <Text style={styles.address}>{loadedPlace.address}</Text>
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray500,
    fontWeight: "500",
  },
  imageWrapper: {
    margin: 16,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  image: {
    height: 280,
    width: "100%",
  },
  addressCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary400,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.gray500,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  address: {
    color: Colors.gray700,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  actions: {
    marginTop: 20,
    alignItems: "center",
  },
});
