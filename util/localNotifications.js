/**
 * Local-notification helpers via deep imports.
 * Avoids `import 'expo-notifications'` which loads push-token auto-registration
 * and logs a red Expo Go error on Android (SDK 53+) even when we only use local alerts.
 */
import { setNotificationHandler } from "expo-notifications/build/NotificationsHandler";
import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
} from "expo-notifications/build/NotificationsEmitter";
import { requestPermissionsAsync } from "expo-notifications/build/NotificationPermissions";
import scheduleNotificationAsync from "expo-notifications/build/scheduleNotificationAsync";
import setNotificationChannelAsync from "expo-notifications/build/setNotificationChannelAsync";
import { AndroidImportance } from "expo-notifications/build/NotificationChannelManager.types";

export {
  setNotificationHandler,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  requestPermissionsAsync,
  scheduleNotificationAsync,
  setNotificationChannelAsync,
  AndroidImportance,
};
