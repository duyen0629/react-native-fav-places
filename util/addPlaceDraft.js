let draft = {
  enteredTitle: "",
  selectedImage: null,
  pickedLocation: null,
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
  };
}
