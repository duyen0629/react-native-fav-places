import { Alert } from "react-native";
import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../util/database";
import { resetAddPlaceDraft } from "../util/addPlaceDraft";

function AddPlace({ navigation }) {
  function createPlaceHandler(placeData) {
    insertPlace(placeData)
      .then(() => {
        resetAddPlaceDraft();
        navigation.popToTop();
      })
      .catch(() => {
        Alert.alert("Could not save place. Please try again later.");
      });
  }
  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
