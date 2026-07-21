import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { useIsFocused } from "@react-navigation/native";
import { fetchPlaces } from "../util/database";
import { Colors } from "../constants/colors";
import { ALL_CATEGORIES } from "../components/Places/CategoryFilter";

const FALLBACK_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

function getRegionForPlaces(places) {
  if (!places.length) {
    return FALLBACK_REGION;
  }

  if (places.length === 1) {
    return {
      latitude: places[0].lat,
      longitude: places[0].lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }

  let minLat = places[0].lat;
  let maxLat = places[0].lat;
  let minLng = places[0].lng;
  let maxLng = places[0].lng;

  for (const place of places) {
    minLat = Math.min(minLat, place.lat);
    maxLat = Math.max(maxLat, place.lat);
    minLng = Math.min(minLng, place.lng);
    maxLng = Math.max(maxLng, place.lng);
  }

  const latitude = (minLat + maxLat) / 2;
  const longitude = (minLng + maxLng) / 2;
  const latitudeDelta = Math.max((maxLat - minLat) * 1.4, 0.05);
  const longitudeDelta = Math.max((maxLng - minLng) * 1.4, 0.05);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
}

function PlacesMap({ route, navigation }) {
  const isFocused = useIsFocused();
  const mapRef = useRef(null);
  const selectedCategory = route.params?.category ?? ALL_CATEGORIES;
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlaces() {
      setIsLoading(true);
      try {
        const loadedPlaces = await fetchPlaces();
        setPlaces(loadedPlaces);
      } finally {
        setIsLoading(false);
      }
    }

    if (isFocused) {
      loadPlaces();
    }
  }, [isFocused]);

  const filteredPlaces = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES) {
      return places;
    }
    return places.filter((place) => place.category === selectedCategory);
  }, [places, selectedCategory]);

  const initialRegion = useMemo(() => getRegionForPlaces(filteredPlaces), [filteredPlaces]);

  useEffect(() => {
    if (isLoading || !mapRef.current || filteredPlaces.length === 0) {
      return;
    }

    if (filteredPlaces.length === 1) {
      mapRef.current.animateToRegion(getRegionForPlaces(filteredPlaces), 350);
      return;
    }

    mapRef.current.fitToCoordinates(
      filteredPlaces.map((place) => ({
        latitude: place.lat,
        longitude: place.lng,
      })),
      {
        edgePadding: { top: 72, right: 48, bottom: 72, left: 48 },
        animated: true,
      },
    );
  }, [filteredPlaces, isLoading]);

  const openPlaceDetails = useCallback(
    (placeId) => {
      navigation.navigate("PlaceDetails", { placeId });
    },
    [navigation],
  );

  if (isLoading) {
    return (
      <View style={styles.fallback}>
        <ActivityIndicator size="large" color={Colors.primary500} />
        <Text style={styles.fallbackText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.lat, longitude: place.lng }}
            pinColor={Colors.primary500}
            onCalloutPress={() => openPlaceDetails(place.id)}
          >
            <Callout onPress={() => openPlaceDetails(place.id)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{place.title}</Text>
                <Text style={styles.calloutCategory}>{place.category}</Text>
                <Text style={styles.calloutHint}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {filteredPlaces.length === 0 && (
        <View style={styles.emptyOverlay} pointerEvents="none">
          <Text style={styles.emptyTitle}>
            {places.length === 0 ? "No favorites yet" : "No places in this category"}
          </Text>
          <Text style={styles.emptyText}>
            {places.length === 0
              ? "Add a place from the home screen to see it here."
              : `Nothing saved under "${selectedCategory}" yet.`}
          </Text>
        </View>
      )}
    </View>
  );
}

export default PlacesMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: 12,
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.gray500,
    fontWeight: "500",
  },
  emptyOverlay: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 40,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: Colors.primary100,
    elevation: 4,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.gray700,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray500,
    lineHeight: 20,
  },
  callout: {
    minWidth: 140,
    maxWidth: 220,
    padding: 4,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.gray700,
    marginBottom: 2,
  },
  calloutCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary700,
    marginBottom: 4,
  },
  calloutHint: {
    fontSize: 11,
    color: Colors.gray500,
  },
});
