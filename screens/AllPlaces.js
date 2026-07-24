import { View, StyleSheet, Alert, Linking } from "react-native";
import PlacesList from "../components/Places/PlacesList";
import CategoryFilter, { ALL_CATEGORIES } from "../components/Places/CategoryFilter";
import SortFilter, { SORT_DEFAULT, SORT_NEAREST } from "../components/Places/SortFilter";
import IconButton from "../components/UI/IconButton";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { fetchPlaces } from "../util/database";
import { sortPlacesByDistance, withDistances } from "../util/distance";

function AllPlaces() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [sortMode, setSortMode] = useState(SORT_DEFAULT);
  const [userCoords, setUserCoords] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      setLoadedPlaces(places);
    }

    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  const refreshUserLocation = useCallback(async ({ promptIfNeeded = false } = {}) => {
    let permission = await Location.getForegroundPermissionsAsync();

    if (permission.status !== "granted" && promptIfNeeded) {
      permission = await Location.requestForegroundPermissionsAsync();
    }

    if (permission.status !== "granted") {
      setLocationDenied(true);
      setUserCoords(null);
      return false;
    }

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setUserCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLocationDenied(false);
      return true;
    } catch {
      setLocationDenied(true);
      setUserCoords(null);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!isFocused || sortMode !== SORT_NEAREST) {
      return;
    }
    refreshUserLocation({ promptIfNeeded: false });
  }, [isFocused, sortMode, refreshUserLocation]);

  async function handleSortChange(nextMode) {
    if (nextMode === SORT_NEAREST) {
      const granted = await refreshUserLocation({ promptIfNeeded: true });
      if (!granted) {
        Alert.alert(
          "Location needed",
          "Allow location access to sort places by distance from you.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ],
        );
        setSortMode(SORT_DEFAULT);
        return;
      }
    }
    setSortMode(nextMode);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <IconButton icon="notifications" size={18} onPress={() => navigation.navigate("NearbyAlerts")} />
          <IconButton
            icon="map"
            size={18}
            onPress={() => navigation.navigate("PlacesMap", { category: selectedCategory })}
          />
          <IconButton icon="add" size={20} onPress={() => navigation.navigate("AddPlace", { resetForm: true })} />
        </View>
      ),
    });
  }, [navigation, selectedCategory]);

  const displayedPlaces = useMemo(() => {
    const filtered =
      selectedCategory === ALL_CATEGORIES
        ? loadedPlaces
        : loadedPlaces.filter((place) => place.category === selectedCategory);

    if (sortMode !== SORT_NEAREST || !userCoords) {
      return filtered.map((place) => ({ ...place, distanceMeters: undefined }));
    }

    return sortPlacesByDistance(withDistances(filtered, userCoords.lat, userCoords.lng));
  }, [loadedPlaces, selectedCategory, sortMode, userCoords]);

  return (
    <View style={styles.container}>
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <SortFilter
        sortMode={sortMode}
        onSortChange={handleSortChange}
        locationDenied={sortMode === SORT_NEAREST && locationDenied}
      />
      <PlacesList
        places={displayedPlaces}
        totalPlacesCount={loadedPlaces.length}
        selectedCategory={selectedCategory}
        showDistance={sortMode === SORT_NEAREST && userCoords != null}
      />
    </View>
  );
}

export default AllPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
