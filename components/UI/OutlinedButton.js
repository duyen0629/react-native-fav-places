import { Pressable, Text, StyleSheet, View } from "react-native";
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

function OutlinedButton({ onPress, icon, children, style }) {
  const iconName = SOLID_ICONS[icon] ?? icon;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={16} color={Colors.textLight} />
      </View>
      <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>
        {children}
      </Text>
    </Pressable>
  );
}

export default OutlinedButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 24,
    elevation: 2,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary100,
  },
  pressed: {
    opacity: 0.85,
    backgroundColor: Colors.primary50,
    transform: [{ scale: 0.96 }],
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary400,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  text: {
    color: Colors.primary700,
    fontWeight: "700",
    fontSize: 14,
    flexShrink: 1,
  },
});
