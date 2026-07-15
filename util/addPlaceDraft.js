import { DEFAULT_CATEGORY } from "../constants/categories";

let draft = {
  enteredTitle: "",
  selectedImages: [],
  pickedLocation: null,
  selectedCategory: DEFAULT_CATEGORY,
};

export function getAddPlaceDraft() {
  return draft;
}

export function updateAddPlaceDraft(updates) {
  draft = { ...draft, ...updates };
}

export function resetAddPlaceDraft() {
  draft = {
    enteredTitle: "",
    selectedImages: [],
    pickedLocation: null,
    selectedCategory: DEFAULT_CATEGORY,
  };
}
