import { DEFAULT_CATEGORY } from "../constants/categories";
import { parseImageUris, serializeImageUris } from "../util/images";

class Place {
  constructor(title, imageUris, location, category = DEFAULT_CATEGORY, id = null) {
    if (!location || location.lat == null || location.lng == null) {
      throw new Error("Place requires a valid location.");
    }
    this.title = title;
    this.imageUris = parseImageUris(imageUris);
    this.imageUri = serializeImageUris(this.imageUris);
    this.category = category;
    this.address = location.address ?? "Unknown address";
    this.location = { lat: location.lat, lng: location.lng };
    this.id = id;
  }
}

export default Place;
