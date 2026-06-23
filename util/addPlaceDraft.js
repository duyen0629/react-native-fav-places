import { DEFAULT_CATEGORY } from "../constants/categories";

let draft = {
  enteredTitle: "",
  selectedImage: null,
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
    selectedImage: null,
    pickedLocation: null,
    selectedCategory: DEFAULT_CATEGORY,
  };
}
