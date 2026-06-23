import { ScrollView, Pressable, Text, StyleSheet, Image } from "react-native";
import { CATEGORIES, getCategoryIcon } from "../../constants/categories";
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
        const icon = category !== ALL_CATEGORIES ? getCategoryIcon(category) : null;

        return (
          <Pressable
            key={category}
            onPress={() => onCategoryChange(category)}
            style={({ pressed }) => [styles.chip, isSelected && styles.chipSelected, pressed && styles.chipPressed]}
          >
            {icon && <Image source={icon} style={styles.chipIcon} resizeMode="contain" />}
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
    flexDirection: "row",
    alignItems: "center",
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
  chipIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
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
