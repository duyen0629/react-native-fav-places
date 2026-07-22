import { useEffect, useState } from "react";
import { Alert, View, Text, StyleSheet } from "react-native";
import PlaceForm from "../components/Places/PlaceForm";
import { fetchPlaceById, updatePlace } from "../util/database";
import { resetAddPlaceDraft } from "../util/addPlaceDraft";
import { Colors } from "../constants/colors";
import { syncGeofences } from "../util/nearbyAlerts";

function EditPlace({ route, navigation }) {
  const placeId = route.params.placeId;
  const [place, setPlace] = useState(null);

  useEffect(() => {
    async function loadPlace() {
      try {
        const loadedPlace = await fetchPlaceById(placeId);
        if (!loadedPlace) {
          Alert.alert("Place not found", "This place could not be loaded.");
          navigation.goBack();
          return;
        }
        setPlace(loadedPlace);
      } catch {
        Alert.alert("Error", "Could not load place. Please try again.");
        navigation.goBack();
      }
    }

    loadPlace();
  }, [placeId, navigation]);

  function updatePlaceHandler(placeData) {
    updatePlace(placeId, placeData)
      .then(async () => {
        resetAddPlaceDraft();
        await syncGeofences();
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert("Could not update place. Please try again later.");
      });
  }

  if (!place) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.loadingText}>Loading place...</Text>
      </View>
    );
  }

  return <PlaceForm onCreatePlace={updatePlaceHandler} initialPlace={place} submitLabel="Update Place" />;
}

export default EditPlace;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray500,
    fontWeight: "500",
  },
});
