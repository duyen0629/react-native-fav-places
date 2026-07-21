import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import { init } from "./util/database";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import PlaceDetails from "./screens/PlaceDetails";
import EditPlace from "./screens/EditPlace";
import PlacesMap from "./screens/PlacesMap";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary500,
          },
          safeAreaInsets: {
            top: insets.top + 10,
            bottom: insets.bottom,
            left: insets.left,
            right: insets.right,
          },
          headerTintColor: Colors.textLight,
          headerBackTitleVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={{
              title: "Favorite Places",
            }}
          />
          <Stack.Screen
            name="AddPlace"
            component={AddPlace}
            options={{
              title: "Add a New Place",
              freezeOnBlur: true,
            }}
          />
          <Stack.Screen
            name="EditPlace"
            component={EditPlace}
            options={{
              title: "Edit Place",
              freezeOnBlur: true,
            }}
          />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen
            name="PlacesMap"
            component={PlacesMap}
            options={{
              title: "Places Map",
            }}
          />
          <Stack.Screen
            name="PlaceDetails"
            component={PlaceDetails}
            options={{
              title: "Loading place data...",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await init();
      } finally {
        setDbInitialized(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (dbInitialized) {
      SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
