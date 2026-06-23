import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { Colors } from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import Button from "../UI/Button";
import Place from "../../models/place";

function PlaceForm({ onCreatePlace }) {
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
    const placeData = new Place(enteredTitle, selectedImage, pickedLocation);
    onCreatePlace(placeData);
  }

  return (
    <ScrollView style={styles.form} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>💗 Title</Text>
        <TextInput
          value={enteredTitle}
          onChangeText={changeTitleHandler}
          style={styles.input}
          placeholder="Name your cozy spot..."
          placeholderTextColor={Colors.gray500}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>🌸 Photo</Text>
        <ImagePicker onImageTaken={takeImageHandler} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>🎀 Location</Text>
        <LocationPicker onLocationPicked={pickLocationHandler} />
      </View>
      <Button onPress={savePlaceHandler}>Save My Place </Button>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.primary100,
    elevation: 2,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.gray700,
    marginBottom: 12,
  },
  input: {
    marginVertical: 4,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary100,
    backgroundColor: Colors.surfaceSoft,
    color: Colors.gray700,
  },
});
