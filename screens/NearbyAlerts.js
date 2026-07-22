import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  Linking,
  ScrollView,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Colors } from "../constants/colors";
import { ALERT_RADIUS_OPTIONS, MAX_GEOFENCES } from "../constants/nearbyAlerts";
import {
  checkNearbyPlacesNow,
  getAlertSettings,
  setAlertRadius,
  setAlertsEnabled,
  syncGeofences,
} from "../util/nearbyAlerts";
import { fetchAlertPlaces } from "../util/database";

function permissionMessage(reason) {
  if (reason === "notifications") {
    return "Notification permission is required to alert you when you are near a saved place.";
  }
  if (reason === "background") {
    return "Background location (Always) is required so alerts can work when the app is closed. You can enable it in system Settings.";
  }
  return "Location permission is required for nearby place alerts.";
}

function NearbyAlerts() {
  const [enabled, setEnabled] = useState(false);
  const [radius, setRadius] = useState(ALERT_RADIUS_OPTIONS[1]);
  const [monitoringCount, setMonitoringCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const settings = await getAlertSettings();
    const alertPlaces = await fetchAlertPlaces(MAX_GEOFENCES);
    setEnabled(settings.enabled);
    setRadius(settings.radius);
    setMonitoringCount(settings.enabled ? alertPlaces.length : 0);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  async function handleToggle(nextValue) {
    setBusy(true);
    try {
      const result = await setAlertsEnabled(nextValue);
      if (!result.granted) {
        Alert.alert("Permission needed", permissionMessage(result.reason), [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]);
        await refresh();
        return;
      }
      await refresh();
    } catch {
      Alert.alert("Could not update nearby alerts. Please try again.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleRadiusChange(nextRadius) {
    if (nextRadius === radius) {
      return;
    }
    setBusy(true);
    try {
      await setAlertRadius(nextRadius);
      await refresh();
    } catch {
      Alert.alert("Could not update alert radius.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCheckNow() {
    setBusy(true);
    try {
      await syncGeofences();
      const nearby = await checkNearbyPlacesNow();
      if (!nearby.length) {
        Alert.alert("No nearby places", "None of your alert-enabled places are within the selected radius right now.");
      } else {
        Alert.alert(
          "Nearby alert sent",
          nearby.map((item) => item.place.title).join(", "),
        );
      }
    } catch {
      Alert.alert("Could not check nearby places right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.title}>Nearby alerts</Text>
            <Text style={styles.subtitle}>Get notified when you approach a saved place.</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            disabled={busy}
            trackColor={{ false: Colors.primary100, true: Colors.primary400 }}
            thumbColor={enabled ? Colors.primary700 : Colors.surface}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Alert radius</Text>
        <View style={styles.radiusRow}>
          {ALERT_RADIUS_OPTIONS.map((option) => {
            const selected = option === radius;
            return (
              <Pressable
                key={option}
                onPress={() => handleRadiusChange(option)}
                disabled={busy}
                style={({ pressed }) => [
                  styles.radiusChip,
                  selected && styles.radiusChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.radiusText, selected && styles.radiusTextSelected]}>{option}m</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Status</Text>
        <Text style={styles.statusText}>
          {enabled
            ? `Monitoring ${monitoringCount} place${monitoringCount === 1 ? "" : "s"} (up to ${MAX_GEOFENCES}).`
            : "Alerts are off. Turn them on, then enable alerts on individual places."}
        </Text>
        <Text style={styles.hint}>
          Open a place and turn on “Alert me nearby”. Background alerts work best in a development or production
          build{Platform.OS === "ios" ? " with Always location access" : ""}.
        </Text>
      </View>

      {enabled && (
        <Pressable
          onPress={handleCheckNow}
          disabled={busy}
          style={({ pressed }) => [styles.checkButton, pressed && styles.pressed, busy && styles.disabled]}
        >
          <Text style={styles.checkButtonText}>Check nearby now</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

export default NearbyAlerts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    elevation: 2,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary800,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray700,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  radiusRow: {
    flexDirection: "row",
    gap: 10,
  },
  radiusChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.primary50,
    alignItems: "center",
  },
  radiusChipSelected: {
    backgroundColor: Colors.primary500,
  },
  radiusText: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary700,
  },
  radiusTextSelected: {
    color: Colors.textLight,
  },
  statusText: {
    fontSize: 15,
    color: Colors.gray700,
    lineHeight: 22,
    marginBottom: 10,
  },
  hint: {
    fontSize: 13,
    color: Colors.gray500,
    lineHeight: 19,
  },
  checkButton: {
    marginTop: 4,
    backgroundColor: Colors.primary500,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.primary200,
  },
  checkButtonText: {
    color: Colors.textLight,
    fontWeight: "800",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.55,
  },
});
