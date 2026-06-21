import PlacesList from "../components/Places/PlacesList";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

function AllPlaces({ route }) {
  const isFocused = useIsFocused();
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  useEffect(() => {
    if (isFocused && route.params) {
      const placeData = route.params.placeData;
      setLoadedPlaces((prevPlaces) => [...prevPlaces, placeData]);
    }
  }, [isFocused, route.params]);

  return <PlacesList places={loadedPlaces} />;
}

export default AllPlaces;
