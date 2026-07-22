import * as TaskManager from "expo-task-manager";
import { GeofencingEventType } from "expo-location";
import { GEOFENCE_TASK_NAME } from "../constants/nearbyAlerts";
import { notifyNearbyPlaceById } from "./nearbyAlerts";

TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.warn("Nearby alerts geofencing error:", error.message);
    return;
  }

  const { eventType, region } = data ?? {};
  if (eventType !== GeofencingEventType.Enter || !region?.identifier) {
    return;
  }

  const placeId = Number(region.identifier);
  if (!Number.isFinite(placeId)) {
    return;
  }

  try {
    await notifyNearbyPlaceById(placeId);
  } catch (notifyError) {
    console.warn("Could not send nearby place notification:", notifyError);
  }
});
