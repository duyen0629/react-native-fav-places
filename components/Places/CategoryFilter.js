import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { CATEGORIES } from "../../constants/categories";
import { Colors } from "../../constants/colors";

export const ALL_CATEGORIES = "All";

const FILTER_OPTIONS = [ALL_CATEGORIES, ...CATEGORIES];

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {FILTER_OPTIONS.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <Pressable
            key={category}
            onPress={() => onCategoryChange(category)}
            style={({ pressed }) => [styles.chip, isSelected && styles.chipSelected, pressed && styles.chipPressed]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export default CategoryFilter;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary100,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
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
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.gray700,
  },
  chipTextSelected: {
    color: Colors.textLight,
  },
});
