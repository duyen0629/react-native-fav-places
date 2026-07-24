import { View, Pressable, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export const SORT_DEFAULT = "default";
export const SORT_NEAREST = "nearest";

function SortFilter({ sortMode, onSortChange, locationDenied = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Sort</Text>
      <Pressable
        onPress={() => onSortChange(SORT_DEFAULT)}
        style={({ pressed }) => [
          styles.chip,
          sortMode === SORT_DEFAULT && styles.chipSelected,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.chipText, sortMode === SORT_DEFAULT && styles.chipTextSelected]}>Default</Text>
      </Pressable>
      <Pressable
        onPress={() => onSortChange(SORT_NEAREST)}
        style={({ pressed }) => [
          styles.chip,
          sortMode === SORT_NEAREST && styles.chipSelected,
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.chipText, sortMode === SORT_NEAREST && styles.chipTextSelected]}>Nearest</Text>
      </Pressable>
      {sortMode === SORT_NEAREST && locationDenied && (
        <Text style={styles.hint}>Location needed</Text>
      )}
    </View>
  );
}

export default SortFilter;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginRight: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary100,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    borderColor: Colors.primary500,
    backgroundColor: Colors.primary500,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.gray700,
  },
  chipTextSelected: {
    color: Colors.textLight,
  },
  pressed: {
    opacity: 0.85,
  },
  hint: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary700,
  },
});
