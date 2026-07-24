import { Platform } from "react-native";
import * as Location from "expo-location";
import {
  AndroidImportance,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from "./localNotifications";
import {
  ALERT_RADIUS_OPTIONS,
  DEFAULT_ALERT_RADIUS,
  GEOFENCE_TASK_NAME,
  MAX_GEOFENCES,
  NEARBY_CHANNEL_ID,
  NOTIFICATION_SOUND,
  NOTIFY_COOLDOWN_MS,
  SETTINGS_KEYS,
} from "../constants/nearbyAlerts";
import {
  fetchAlertPlaces,
  fetchPlaceById,
  getSetting,
  setSetting,
  updatePlaceAlertEnabled,
} from "./database";
import { distanceMeters } from "./distance";

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function cooldownKey(placeId) {
  return `nearbyLastNotified:${placeId}`;
}

export async function ensureNotificationSetup() {
  if (Platform.OS === "android") {
    await setNotificationChannelAsync(NEARBY_CHANNEL_ID, {
      name: "Nearby places",
      importance: AndroidImportance.HIGH,
      sound: NOTIFICATION_SOUND,
      vibrationPattern: [0, 250, 120, 250],
      lightColor: "#EC407A",
    });
  }
}

export async function getAlertSettings() {
  const enabledValue = await getSetting(SETTINGS_KEYS.enabled, "0");
  const radiusValue = Number(await getSetting(SETTINGS_KEYS.radius, String(DEFAULT_ALERT_RADIUS)));
  const radius = ALERT_RADIUS_OPTIONS.includes(radiusValue) ? radiusValue : DEFAULT_ALERT_RADIUS;

  return {
    enabled: enabledValue === "1",
    radius,
  };
}

export async function requestAlertPermissions() {
  await ensureNotificationSetup();

  const notificationPermission = await requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  if (notificationPermission.status !== "granted") {
    return { granted: false, reason: "notifications" };
  }

  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== "granted") {
    return { granted: false, reason: "location" };
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== "granted") {
    return { granted: false, reason: "background" };
  }

  return { granted: true };
}

export async function setAlertsEnabled(enabled) {
  if (enabled) {
    const permission = await requestAlertPermissions();
    if (!permission.granted) {
      await setSetting(SETTINGS_KEYS.enabled, "0");
      await stopGeofencingIfNeeded();
      return permission;
    }
  }

  await setSetting(SETTINGS_KEYS.enabled, enabled ? "1" : "0");
  await syncGeofences();
  return { granted: true };
}

export async function setAlertRadius(radius) {
  const nextRadius = ALERT_RADIUS_OPTIONS.includes(radius) ? radius : DEFAULT_ALERT_RADIUS;
  await setSetting(SETTINGS_KEYS.radius, String(nextRadius));
  await syncGeofences();
  return nextRadius;
}

export async function setPlaceAlert(placeId, enabled) {
  if (enabled) {
    const settings = await getAlertSettings();
    if (!settings.enabled) {
      const permission = await setAlertsEnabled(true);
      if (!permission.granted) {
        return permission;
      }
    } else {
      const permission = await requestAlertPermissions();
      if (!permission.granted) {
        return permission;
      }
    }
  }

  await updatePlaceAlertEnabled(placeId, enabled);
  await syncGeofences();
  return { granted: true };
}

async function stopGeofencingIfNeeded() {
  const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
  if (started) {
    await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
  }
}

export async function syncGeofences() {
  const settings = await getAlertSettings();
  if (!settings.enabled) {
    await stopGeofencingIfNeeded();
    return { monitoring: 0 };
  }

  const places = await fetchAlertPlaces(MAX_GEOFENCES);
  if (!places.length) {
    await stopGeofencingIfNeeded();
    return { monitoring: 0 };
  }

  const regions = places.map((place) => ({
    identifier: String(place.id),
    latitude: place.lat,
    longitude: place.lng,
    radius: settings.radius,
    notifyOnEnter: true,
    notifyOnExit: false,
  }));

  await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
  return { monitoring: regions.length };
}

export async function canNotifyForPlace(placeId) {
  const lastNotified = Number(await getSetting(cooldownKey(placeId), "0"));
  if (!lastNotified) {
    return true;
  }
  return Date.now() - lastNotified >= NOTIFY_COOLDOWN_MS;
}

export async function markPlaceNotified(placeId) {
  await setSetting(cooldownKey(placeId), String(Date.now()));
}

export async function notifyNearbyPlace(place) {
  if (!place?.id || !(await canNotifyForPlace(place.id))) {
    return false;
  }

  await ensureNotificationSetup();
  await scheduleNotificationAsync({
    content: {
      title: "You're nearby!",
      body: `${place.title} is close by.`,
      data: { placeId: place.id, type: "nearby-place" },
      sound: NOTIFICATION_SOUND,
      ...(Platform.OS === "android" ? { channelId: NEARBY_CHANNEL_ID } : {}),
    },
    trigger: null,
  });
  await markPlaceNotified(place.id);
  return true;
}

export async function notifyNearbyPlaceById(placeId) {
  const place = await fetchPlaceById(placeId);
  if (!place?.alertEnabled) {
    return false;
  }

  const settings = await getAlertSettings();
  if (!settings.enabled) {
    return false;
  }

  return notifyNearbyPlace(place);
}

/** Foreground fallback (useful in Expo Go / when geofencing is unavailable). */
export async function checkNearbyPlacesNow() {
  const settings = await getAlertSettings();
  if (!settings.enabled) {
    return [];
  }

  const permission = await Location.getForegroundPermissionsAsync();
  if (permission.status !== "granted") {
    return [];
  }

  const places = await fetchAlertPlaces(MAX_GEOFENCES);
  if (!places.length) {
    return [];
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const { latitude, longitude } = position.coords;
  const nearby = [];

  for (const place of places) {
    const distance = distanceMeters(latitude, longitude, place.lat, place.lng);
    if (distance <= settings.radius) {
      const didNotify = await notifyNearbyPlace(place);
      if (didNotify) {
        nearby.push({ place, distance });
      }
    }
  }

  return nearby;
}
