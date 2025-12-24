/**
 * Utility Functions Module
 * Helper functions for timeline rendering
 */

/**
 * Parses a period string into start and end years
 * @param {string} period - Period string (e.g., "1920-1960", "2000-présent")
 * @returns {Object} Object with start and end years
 */
export function parsePeriod(period) {
  if (!period) {
    return { start: 2000, end: 2025 };
  }

  const parts = period.split('-');
  const start = parseInt(parts[0], 10);

  // Handle "présent" or "present"
  if (parts[1] && (parts[1].toLowerCase().includes('présent') || parts[1].toLowerCase().includes('present'))) {
    return { start, end: new Date().getFullYear() };
  }

  const end = parts[1] ? parseInt(parts[1], 10) : start + 10;

  return { start, end };
}

/**
 * Gets the range of years across all movements
 * @param {Array} movements - Array of movement objects
 * @returns {Object} Object with min and max years
 */
export function getYearRange(movements) {
  let minYear = Infinity;
  let maxYear = -Infinity;

  movements.forEach(movement => {
    const { start, end } = parsePeriod(movement.period);
    minYear = Math.min(minYear, start);
    maxYear = Math.max(maxYear, end);
  });

  // Round to nearest decade
  minYear = Math.floor(minYear / 10) * 10;
  maxYear = Math.ceil(maxYear / 10) * 10;

  return { minYear, maxYear };
}

/**
 * Auto-stacking algorithm to prevent overlapping bars
 * Assigns a lane (row) to each movement to minimize overlaps
 * @param {Array} movements - Array of movement objects with parsed periods
 * @returns {Array} Array of movements with assigned lane numbers
 */
export function assignLanes(movements) {
  // Sort movements by start year
  const sorted = [...movements].sort((a, b) => {
    const aPeriod = parsePeriod(a.period);
    const bPeriod = parsePeriod(b.period);
    return aPeriod.start - bPeriod.start;
  });

  // Track occupied lanes: array of lane objects with end year
  const lanes = [];

  sorted.forEach(movement => {
    const { start, end } = parsePeriod(movement.period);

    // Find first available lane (lane where last movement ended before this starts)
    let assignedLane = -1;
    for (let i = 0; i < lanes.length; i++) {
      if (lanes[i] <= start) {
        assignedLane = i;
        lanes[i] = end; // Update lane's end year
        break;
      }
    }

    // If no available lane found, create a new one
    if (assignedLane === -1) {
      assignedLane = lanes.length;
      lanes.push(end);
    }

    // Add lane assignment to movement
    movement.lane = assignedLane;
  });

  return movements;
}

/**
 * Generates decade markers for the time axis
 * @param {number} minYear - Minimum year
 * @param {number} maxYear - Maximum year
 * @returns {Array} Array of decade years
 */
export function generateDecades(minYear, maxYear) {
  const decades = [];
  for (let year = minYear; year <= maxYear; year += 10) {
    decades.push(year);
  }
  return decades;
}

/**
 * Converts a year to a horizontal position percentage
 * @param {number} year - Year to convert
 * @param {number} minYear - Minimum year in range
 * @param {number} maxYear - Maximum year in range
 * @returns {number} Position as percentage (0-100)
 */
export function yearToPosition(year, minYear, maxYear) {
  const range = maxYear - minYear;
  const offset = year - minYear;
  return (offset / range) * 100;
}
