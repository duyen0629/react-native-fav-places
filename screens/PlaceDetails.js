import { View, Text, StyleSheet, Image, Alert, ScrollView, useWindowDimensions } from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import IconButton from "../components/UI/IconButton";
import { Colors } from "../constants/colors";
import { getCategoryIcon } from "../constants/categories";
import { useEffect, useLayoutEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { deletePlace, fetchPlaceById } from "../util/database";
import { parseImageUris } from "../util/images";

function PlaceDetails({ route, navigation }) {
  const selectedPlaceId = route.params.placeId;
  const isFocused = useIsFocused();
  const { width: windowWidth } = useWindowDimensions();
  const [loadedPlace, setLoadedPlace] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const galleryWidth = windowWidth - 32;

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: loadedPlace.lat,
      initialLng: loadedPlace.lng,
      readOnly: true,
    });
  }

  function editPlaceHandler() {
    navigation.navigate("EditPlace", { placeId: selectedPlaceId });
  }

  useEffect(() => {
    async function loadPlaceData() {
      const place = await fetchPlaceById(selectedPlaceId);
      setLoadedPlace(place);
      setActivePhotoIndex(0);
    }

    if (isFocused) {
      loadPlaceData();
    }
  }, [selectedPlaceId, isFocused]);

  useLayoutEffect(() => {
    if (!loadedPlace) {
      return;
    }

    navigation.setOptions({
      title: loadedPlace.title,
      headerRight: () => (
        <View style={styles.headerActions}>
          <IconButton icon="edit" size={20} onPress={editPlaceHandler} />
          <IconButton icon="trash" size={22} onPress={deletePlaceHandler} />
        </View>
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

  function handleGalleryScroll(event) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / galleryWidth);
    setActivePhotoIndex(index);
  }

  if (!loadedPlace) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.loadingEmoji}>💕</Text>
        <Text style={styles.loadingText}>Loading place data...</Text>
      </View>
    );
  }

  const categoryIcon = getCategoryIcon(loadedPlace.category);
  const imageUris = parseImageUris(loadedPlace.imageUris ?? loadedPlace.imageUri);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.imageWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleGalleryScroll}
          scrollEventThrottle={16}
          style={{ width: galleryWidth }}
        >
          {imageUris.map((uri) => (
            <Image key={uri} source={{ uri }} style={[styles.image, { width: galleryWidth }]} />
          ))}
        </ScrollView>
        {imageUris.length > 1 && (
          <View style={styles.dots}>
            {imageUris.map((uri, index) => (
              <View key={uri} style={[styles.dot, index === activePhotoIndex && styles.dotActive]} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.addressCard}>
        <View style={styles.category}>
          {categoryIcon && <Image source={categoryIcon} style={styles.categoryIcon} resizeMode="contain" />}
          <Text style={styles.categoryText}>{loadedPlace.category}</Text>
        </View>
        <Text style={styles.addressLabel}>Address</Text>
        <Text style={styles.address}>{loadedPlace.address}</Text>
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 32,
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: Colors.surfaceSoft,
  },
  image: {
    height: 280,
  },
  dots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    backgroundColor: Colors.textLight,
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
  category: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary50,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.primary700,
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
