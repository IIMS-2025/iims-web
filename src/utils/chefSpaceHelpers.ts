import { colors } from '../styles/colors';

/**
 * Returns the appropriate color for an ingredient based on its name
 * @param ingredient - The ingredient object with a name property
 * @returns Hex color string
 */
export const getIngredientIcon = (ingredient: { name?: string }): string => {
  if (ingredient.name?.toLowerCase().includes("cheese")) {
    return colors.warning; // Orange for cheese
  }
  return colors.success; // Green for others
};
