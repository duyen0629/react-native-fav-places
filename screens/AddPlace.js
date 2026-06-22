import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";

function AddPlace({ navigation }) {
  function createPlaceHandler(placeData) {
    insertPlace(placeData)
      .then(() => {
        navigation.navigate("AllPlaces");
      })
      .catch((error) => {
        Alert.alert("Could not save place. Please try again later.");
      });
  }
  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
