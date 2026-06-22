import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import { Colors } from "../constants/colors";
import { useEffect } from "react";

function PlaceDetails({ route }) {
  const selectedPlaceId = route.params.placeId;

  function showOnMapHandler() {}

  useEffect(() => {}, [selectedPlaceId]);

  return (
    <ScrollView>
      {/* <Image source={{ uri: place.imageUri }} style={styles.image} /> */}
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>{/* <Text style={styles.address}>{place.address}</Text> */}</View>
      </View>
      <OutlinedButton icon="map" onPress={showOnMapHandler}>
        View on Map
      </OutlinedButton>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
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
