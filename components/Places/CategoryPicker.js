import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CATEGORY_OPTIONS, getCategoryIcon } from "../../constants/categories";
import { Colors } from "../../constants/colors";

function CategoryPicker({ selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedIcon = getCategoryIcon(selectedCategory);

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
        <View style={styles.triggerContent}>
          {selectedIcon && <Image source={selectedIcon} style={styles.triggerIcon} resizeMode="contain" />}
          <Text style={styles.triggerText}>{selectedCategory}</Text>
        </View>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color={Colors.primary700} />
      </Pressable>
      {isOpen && (
        <View style={styles.dropdown}>
          {CATEGORY_OPTIONS.map(({ label }) => {
            const isSelected = selectedCategory === label;
            const icon = getCategoryIcon(label);
            return (
              <Pressable
                key={label}
                onPress={() => selectCategoryHandler(label)}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <View style={styles.optionContent}>
                  {icon && <Image source={icon} style={styles.optionIcon} resizeMode="contain" />}
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{label}</Text>
                </View>
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
  triggerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  triggerIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  triggerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray700,
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
  optionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  optionIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: Colors.gray700,
  },
  optionTextSelected: {
    fontWeight: "700",
    color: Colors.primary700,
  },
});
