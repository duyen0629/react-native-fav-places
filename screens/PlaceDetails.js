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
      headerRight: ({ tintColor }) => (
        <IconButton icon="trash" size={24} color={tintColor} onPress={deletePlaceHandler} />
      ),
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
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <View>
      <Image source={{ uri: loadedPlace.imageUri }} style={styles.image} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{loadedPlace.address}</Text>
        </View>
      </View>
      <OutlinedButton icon="map" onPress={showOnMapHandler}>
        View on Map
      </OutlinedButton>
    </View>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
