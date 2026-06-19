import { View, Text, Pressable, Image, StyleSheet } from "react-native";

function PlaceItem({ place }) {
  return (
    <Pressable>
      <Image source={{ uri: place.imageUri }} />
      <View>
        <Text>{place.title}</Text>
        <Text>{place.address}</Text>
      </View>
    </Pressable>
  );
}
export default PlaceItem;

const styles = StyleSheet.create({
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
});
