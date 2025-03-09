/**
 * Utility functions to safely interact with localStorage
 * Prevents errors during server-side rendering when localStorage is not available
 */

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Safely get an item from localStorage
 * @param key The key to retrieve
 * @param defaultValue Optional default value if key doesn't exist
 * @returns The stored value or defaultValue if not found
 */
export const getItem = <T>(key: string, defaultValue?: T): T | null | undefined => {
  if (!isBrowser) return defaultValue || null;
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue || null;
    
    // Try to parse as JSON, but return as string if parsing fails
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue || null;
  }
};

/**
 * Safely set an item in localStorage
 * @param key The key to set
 * @param value The value to store (objects will be stringified)
 * @returns true if successful, false otherwise
 */
export const setItem = <T>(key: string, value: T): boolean => {
  if (!isBrowser) return false;
  
  try {
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 * @param key The key to remove
 * @returns true if successful, false otherwise
 */
export const removeItem = (key: string): boolean => {
  if (!isBrowser) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Safely clear all items from localStorage
 * @returns true if successful, false otherwise
 */
export const clear = (): boolean => {
  if (!isBrowser) return false;
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get all keys from localStorage
 * @returns Array of keys or empty array if error
 */
export const getAllKeys = (): string[] => {
  if (!isBrowser) return [];
  
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting all keys from localStorage:', error);
    return [];
  }
}; 