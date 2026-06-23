export const CATEGORY_OPTIONS = [
  { label: "Restaurant / Cafe", icon: require("../assets/icons/icon_restaurant.png") },
  { label: "Entertainment", icon: require("../assets/icons/icon_entertainment.png") },
  { label: "Shopping", icon: require("../assets/icons/icon_shopping.png") },
  { label: "Nature & Parks", icon: require("../assets/icons/icon_nature_park.png") },
  { label: "Attractions & Landmarks", icon: require("../assets/icons/icon_attraction.png") },
  { label: "Fitness & Sports", icon: require("../assets/icons/icon_fitness.png") },
  { label: "Work & Study", icon: require("../assets/icons/icon_work.png") },
];

export const CATEGORIES = CATEGORY_OPTIONS.map((category) => category.label);

export const DEFAULT_CATEGORY = CATEGORIES[0];

export function getCategoryIcon(categoryLabel) {
  return CATEGORY_OPTIONS.find((category) => category.label === categoryLabel)?.icon ?? null;
}
