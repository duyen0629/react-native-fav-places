import { DEFAULT_CATEGORY } from "../constants/categories";

class Place {
  constructor(title, imageUri, location, category = DEFAULT_CATEGORY, id = null) {
    this.title = title;
    this.imageUri = imageUri;
    this.category = category;
    this.address = location.address;
    this.location = { lat: location.lat, lng: location.lng };
    this.id = id;
  }
}

export default Place;
