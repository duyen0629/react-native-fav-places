import { View, StyleSheet } from "react-native";
import PlacesList from "../components/Places/PlacesList";
import CategoryFilter, { ALL_CATEGORIES } from "../components/Places/CategoryFilter";
import IconButton from "../components/UI/IconButton";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { fetchPlaces } from "../util/database";

function AllPlaces() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      setLoadedPlaces(places);
    }

    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

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

  const filteredPlaces = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES) {
      return loadedPlaces;
    }
    return loadedPlaces.filter((place) => place.category === selectedCategory);
  }, [loadedPlaces, selectedCategory]);

  return (
    <View style={styles.container}>
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <PlacesList
        places={filteredPlaces}
        totalPlacesCount={loadedPlaces.length}
        selectedCategory={selectedCategory}
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
