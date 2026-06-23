import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { getCategoryIcon } from "../../constants/categories";

function PlaceItem({ place }) {
  const navigation = useNavigation();
  const categoryIcon = getCategoryIcon(place.category);

  function selectPlaceHandler() {
    navigation.navigate("PlaceDetails", { placeId: place.id });
  }

  return (
    <Pressable style={({ pressed }) => [styles.item, pressed && styles.pressed]} onPress={selectPlaceHandler}>
      <Image source={{ uri: place.imageUri }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.categoryRow}>
          <Text style={styles.category}>{place.category}</Text>
        </View>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.address} numberOfLines={2}>
          {place.address}
        </Text>
      </View>
      <View style={styles.categoryBadge}>
        {categoryIcon && <Image source={categoryIcon} style={styles.categoryBadgeIcon} resizeMode="contain" />}
      </View>
    </Pressable>
  );
}
export default PlaceItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    marginVertical: 8,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary100,
    elevation: 3,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  image: {
    width: 96,
    height: 96,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  info: {
    flex: 1,
    padding: 14,
  },
  title: {
    fontWeight: "800",
    fontSize: 17,
    color: Colors.gray700,
    marginBottom: 4,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  category: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    flex: 1,
  },
  address: {
    fontSize: 13,
    color: Colors.gray500,
    lineHeight: 18,
  },
  categoryBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryBadgeIcon: {
    width: 22,
    height: 22,
  },
});
