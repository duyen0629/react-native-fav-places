import { Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

function Button({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginTop: 8,
    backgroundColor: Colors.primary500,
    borderRadius: 32,
    elevation: 5,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: Colors.primary200,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  text: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textLight,
    letterSpacing: 0.4,
  },
});
