import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { Colors } from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";

function PlaceForm() {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [pickedLocation, setPickedLocation] = useState(null);

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }
  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }
  const pickLocationHandler = useCallback(
    (location) => {
      setPickedLocation(location);
    },
    [setPickedLocation],
  );

  function savePlaceHandler() {
    console.log(enteredTitle);
    console.log(selectedImage);
    console.log(pickedLocation);
  }
  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput value={enteredTitle} onChangeText={changeTitleHandler} style={styles.input} />
      </View>
      <ImagePicker onImageTaken={takeImageHandler} />
      <LocationPicker onLocationPicked={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary700,
  },
  input: {
    narginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
