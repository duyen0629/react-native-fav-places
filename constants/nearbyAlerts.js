export const GEOFENCE_TASK_NAME = "nearby-place-alerts";
export const NEARBY_CHANNEL_ID = "nearby-places";
export const NOTIFICATION_SOUND = "notification_sound.wav";

export const MAX_GEOFENCES = 20;
export const DEFAULT_ALERT_RADIUS = 200;
export const ALERT_RADIUS_OPTIONS = [100, 200, 500];
export const NOTIFY_COOLDOWN_MS = 2 * 60 * 60 * 1000;

export const SETTINGS_KEYS = {
  enabled: "nearbyAlertsEnabled",
  radius: "nearbyAlertsRadius",
};
