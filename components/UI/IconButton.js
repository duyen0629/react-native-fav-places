import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

const SOLID_ICONS = {
  add: "add",
  camera: "camera",
  map: "map",
  location: "location",
  trash: "trash",
  save: "checkmark",
  edit: "create",
  notifications: "notifications",
};

function IconButton({ icon, size = 24, onPress }) {
  const iconName = SOLID_ICONS[icon] ?? icon;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]} hitSlop={8}>
      <Ionicons name={iconName} size={size} color={Colors.textLight} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
