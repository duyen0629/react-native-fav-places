import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import { init } from "./util/database";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import PlaceDetails from "./screens/PlaceDetails";
import EditPlace from "./screens/EditPlace";
import PlacesMap from "./screens/PlacesMap";
import NearbyAlerts from "./screens/NearbyAlerts";
import { checkNearbyPlacesNow, ensureNotificationSetup, syncGeofences } from "./util/nearbyAlerts";
import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
} from "./util/localNotifications";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function RootNavigator({ navigationRef, onNavigationReady }) {
  const insets = useSafeAreaInsets();

  return (
    <NavigationContainer ref={navigationRef} onReady={onNavigationReady}>
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
          name="NearbyAlerts"
          component={NearbyAlerts}
          options={{
            title: "Nearby Alerts",
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
  const navigationRef = useRef(null);
  const pendingPlaceId = useRef(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    async function prepare() {
      try {
        await init();
        await ensureNotificationSetup();
        await syncGeofences();
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

  function openPlaceFromNotification(placeId) {
    if (!placeId) {
      return;
    }
    if (navigationRef.current?.isReady()) {
      navigationRef.current.navigate("PlaceDetails", { placeId });
      return;
    }
    pendingPlaceId.current = placeId;
  }

  function handleNavigationReady() {
    if (pendingPlaceId.current != null) {
      navigationRef.current?.navigate("PlaceDetails", { placeId: pendingPlaceId.current });
      pendingPlaceId.current = null;
    }
  }

  useEffect(() => {
    function navigateFromNotification(response) {
      openPlaceFromNotification(response?.notification?.request?.content?.data?.placeId);
    }

    const subscription = addNotificationResponseReceivedListener(navigateFromNotification);

    getLastNotificationResponseAsync().then((response) => {
      if (response) {
        navigateFromNotification(response);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        checkNearbyPlacesNow().catch(() => {});
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  if (!dbInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator navigationRef={navigationRef} onNavigationReady={handleNavigationReady} />
    </SafeAreaProvider>
  );
}
