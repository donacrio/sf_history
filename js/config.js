/**
 * Configuration Loader Module
 * Loads and validates configuration data from JSON
 */

import { validateMovementData, logValidationErrors } from './validation.js';

// Global cache for loaded config
let configData = null;

/**
 * Loads configuration from JSON file
 * @returns {Promise<Object>} Configuration data
 * @throws {Error} If loading or validation fails
 */
export async function loadConfig() {
  try {
    const response = await fetch('./config/movements.json');

    if (!response.ok) {
      throw new Error(`Failed to load configuration: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate the data
    const errors = validateMovementData(data.movements);

    if (errors.length > 0) {
      logValidationErrors(errors);
      throw new Error('Configuration validation failed. See console for details.');
    }

    // Log success
    logValidationErrors([]);

    // Cache the data
    configData = data;

    return data;
  } catch (error) {
    console.error('Error loading configuration:', error);
    throw error;
  }
}

/**
 * Gets the movements array from loaded config
 * @returns {Array} Array of movement objects
 */
export function getMovements() {
  if (!configData || !configData.movements) {
    console.warn('Configuration not loaded. Call loadConfig() first.');
    return [];
  }
  return configData.movements;
}

/**
 * Gets metadata from loaded config
 * @returns {Object} Metadata object
 */
export function getMetadata() {
  if (!configData || !configData.metadata) {
    return {
      title: 'Timeline',
      subtitle: '',
      version: '1.0.0'
    };
  }
  return configData.metadata;
}

/**
 * Finds a movement by ID
 * @param {string} id - Movement ID to find
 * @returns {Object|null} Movement object or null if not found
 */
export function findMovementById(id) {
  const movements = getMovements();
  return movements.find(m => m.id === id) || null;
}
