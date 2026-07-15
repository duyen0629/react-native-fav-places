import { View, Text, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/colors";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import CategoryPicker from "./CategoryPicker";
import Button from "../UI/Button";
import Place from "../../models/place";
import { fetchPlaceCount } from "../../util/database";
import { getAddPlaceDraft, updateAddPlaceDraft, resetAddPlaceDraft } from "../../util/addPlaceDraft";
import { DEFAULT_CATEGORY } from "../../constants/categories";
import { parseImageUris } from "../../util/images";

function placeToFormState(place) {
  return {
    enteredTitle: place.title,
    selectedImages: parseImageUris(place.imageUris ?? place.imageUri),
    pickedLocation: {
      lat: place.lat,
      lng: place.lng,
      address: place.address,
    },
    selectedCategory: place.category ?? DEFAULT_CATEGORY,
  };
}

function PlaceForm({ onCreatePlace, initialPlace = null, submitLabel = "Save My Place" }) {
  const route = useRoute();
  const navigation = useNavigation();
  const isEditing = initialPlace != null;
  const initialFormState = initialPlace ? placeToFormState(initialPlace) : null;
  const [enteredTitle, setEnteredTitle] = useState(initialFormState?.enteredTitle ?? "");
  const [selectedImages, setSelectedImages] = useState(initialFormState?.selectedImages ?? []);
  const [pickedLocation, setPickedLocation] = useState(initialFormState?.pickedLocation ?? null);
  const [selectedCategory, setSelectedCategory] = useState(initialFormState?.selectedCategory ?? DEFAULT_CATEGORY);
  const [formReady, setFormReady] = useState(isEditing);

  useEffect(() => {
    async function initForm() {
      if (isEditing) {
        updateAddPlaceDraft(placeToFormState(initialPlace));
        setFormReady(true);
        return;
      }

      if (route.params?.resetForm) {
        resetAddPlaceDraft();
      }

      const draft = getAddPlaceDraft();
      const draftImages = parseImageUris(draft.selectedImages ?? draft.selectedImage);

      if (!route.params?.resetForm && (draft.enteredTitle || draftImages.length > 0 || draft.pickedLocation)) {
        setEnteredTitle(draft.enteredTitle);
        setSelectedImages(draftImages);
        setPickedLocation(draft.pickedLocation);
        setSelectedCategory(draft.selectedCategory ?? DEFAULT_CATEGORY);
        setFormReady(true);
        return;
      }

      const count = await fetchPlaceCount();
      const title = `Fav ${count + 1}`;
      setEnteredTitle(title);
      setSelectedCategory(DEFAULT_CATEGORY);
      updateAddPlaceDraft({
        enteredTitle: title,
        selectedImages: [],
        pickedLocation: null,
        selectedCategory: DEFAULT_CATEGORY,
      });
      setFormReady(true);
    }

    initForm();
  }, [isEditing, initialPlace]);

  useEffect(() => {
    if (isEditing || !route.params?.resetForm) {
      return;
    }

    async function resetForm() {
      resetAddPlaceDraft();
      const count = await fetchPlaceCount();
      const title = `Fav ${count + 1}`;
      setEnteredTitle(title);
      setSelectedImages([]);
      setPickedLocation(null);
      setSelectedCategory(DEFAULT_CATEGORY);
      updateAddPlaceDraft({
        enteredTitle: title,
        selectedImages: [],
        pickedLocation: null,
        selectedCategory: DEFAULT_CATEGORY,
      });
      navigation.setParams({ resetForm: undefined, pickedLat: undefined, pickedLng: undefined });
    }

    resetForm();
  }, [route.params?.resetForm, navigation, isEditing]);

  useEffect(() => {
    if (!formReady) {
      return;
    }
    updateAddPlaceDraft({ enteredTitle });
  }, [enteredTitle, formReady]);

  useEffect(() => {
    if (!formReady) {
      return;
    }
    updateAddPlaceDraft({ selectedImages });
  }, [selectedImages, formReady]);

  useEffect(() => {
    if (!formReady) {
      return;
    }
    updateAddPlaceDraft({ pickedLocation });
  }, [pickedLocation, formReady]);

  useEffect(() => {
    if (!formReady) {
      return;
    }
    updateAddPlaceDraft({ selectedCategory });
  }, [selectedCategory, formReady]);

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function imagesChangeHandler(uris) {
    setSelectedImages(parseImageUris(uris));
  }

  const pickLocationHandler = useCallback(
    (location) => {
      setPickedLocation(location);
    },
    [setPickedLocation],
  );

  function savePlaceHandler() {
    if (!enteredTitle?.trim()) {
      Alert.alert("Missing title", "Please enter a title for this place.");
      return;
    }
    if (selectedImages.length === 0) {
      Alert.alert("Missing photo", "Please add at least one photo for this place.");
      return;
    }
    if (pickedLocation?.lat == null || pickedLocation?.lng == null) {
      Alert.alert("Missing location", "Please pick a location for this place.");
      return;
    }

    const placeData = new Place(enteredTitle.trim(), selectedImages, pickedLocation, selectedCategory);
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
        <Text style={[styles.sectionLabel, styles.fieldSpacing]}>Category</Text>
        <CategoryPicker selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>🌸 Photos</Text>
        <ImagePicker onImagesChange={imagesChangeHandler} imageUris={selectedImages} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>🎀 Location</Text>
        <LocationPicker onLocationPicked={pickLocationHandler} location={pickedLocation} />
      </View>
      <Button onPress={savePlaceHandler}>{submitLabel}</Button>
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
  fieldSpacing: {
    marginTop: 16,
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
