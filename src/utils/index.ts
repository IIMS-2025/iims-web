export * from './chefSpaceHelpers';

// localStorage utilities for user preferences
export const getUserGuideToggle = (): boolean => {
  const stored = localStorage.getItem('userGuideEnabled');
  return stored !== null ? JSON.parse(stored) : false; // Default to false
};

export const setUserGuideToggle = (enabled: boolean): void => {
  localStorage.setItem('userGuideEnabled', JSON.stringify(enabled));
};
