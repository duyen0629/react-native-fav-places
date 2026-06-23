import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import { Colors } from "../constants/colors";
import { useEffect, useState } from "react";
import { fetchPlaceById } from "../util/database";

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
      navigation.setOptions({
        title: place.title,
      });
    }

    loadPlaceData();
  }, [selectedPlaceId]);

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
