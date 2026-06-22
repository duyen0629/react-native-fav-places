class Place {
  constructor(title, imageUri, location, id = null) {
    this.title = title;
    this.imageUri = imageUri;
    this.address = location.address;
    this.location = { lat: location.lat, lng: location.lng };
    this.id = id;
  }
}

export default Place;
