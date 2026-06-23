import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

const SOLID_ICONS = {
  add: "add",
  camera: "camera",
  map: "map",
  location: "location",
  trash: "trash",
  save: "checkmark-circle",
};

function IconButton({ icon, size = 22, onPress, variant = "header" }) {
  const isHeader = variant === "header";
  const iconName = SOLID_ICONS[icon] ?? icon;
  const iconColor = isHeader ? Colors.primary500 : Colors.textLight;
  const circleColor = isHeader ? Colors.textLight : Colors.primary400;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <View style={[styles.iconCircle, { backgroundColor: circleColor, width: size + 20, height: size + 20 }]}>
        <Ionicons name={iconName} size={size} color={iconColor} />
      </View>
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    padding: 2,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.92 }],
  },
  iconCircle: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
