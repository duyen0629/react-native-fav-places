import { FlatList, View, Text, StyleSheet } from "react-native";
import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";

function PlacesList({ places }) {
  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackTitle}>No favorites yet!</Text>
        <Text style={styles.fallbackText}>Tap the button above to add your very first special place.</Text>
      </View>
    );
  }
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PlaceItem place={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default PlacesList;

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.gray700,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 16,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 24,
  },
});
