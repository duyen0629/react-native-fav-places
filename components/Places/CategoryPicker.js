import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORIES } from "../../constants/categories";
import { Colors } from "../../constants/colors";

function CategoryPicker({ selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen((current) => !current);
  }

  function selectCategoryHandler(category) {
    onCategoryChange(category);
    setIsOpen(false);
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleDropdown}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed, isOpen && styles.triggerOpen]}
      >
        <Text style={styles.triggerText}>{selectedCategory}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={Colors.primary700} />
      </Pressable>
      {isOpen && (
        <View style={styles.dropdown}>
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <Pressable
                key={category}
                onPress={() => selectCategoryHandler(category)}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{category}</Text>
                {isSelected && <Ionicons name="checkmark" size={18} color={Colors.primary700} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default CategoryPicker;

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primary100,
    backgroundColor: Colors.surfaceSoft,
  },
  triggerOpen: {
    borderColor: Colors.primary400,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  triggerPressed: {
    opacity: 0.9,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray700,
    marginRight: 8,
  },
  dropdown: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: Colors.primary400,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.surface,
    overflow: "hidden",
    elevation: 4,
    shadowColor: Colors.primary500,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.primary50,
  },
  optionSelected: {
    backgroundColor: Colors.primary50,
  },
  optionPressed: {
    backgroundColor: Colors.surfaceSoft,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: Colors.gray700,
    marginRight: 8,
  },
  optionTextSelected: {
    fontWeight: "700",
    color: Colors.primary700,
  },
});
