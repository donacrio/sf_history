/**
 * Data Validation Module
 * Validates movement configuration data to ensure correctness
 */

/**
 * Validates movement data structure
 * @param {Array} movements - Array of movement objects
 * @returns {Array} Array of error messages (empty if valid)
 */
export function validateMovementData(movements) {
  const errors = [];
  const ids = new Set();

  if (!Array.isArray(movements)) {
    errors.push('Movements data must be an array');
    return errors;
  }

  movements.forEach((movement, idx) => {
    // Required fields
    if (!movement.id) {
      errors.push(`Movement ${idx}: missing 'id' field`);
    } else {
      // Check for duplicate IDs
      if (ids.has(movement.id)) {
        errors.push(`Duplicate movement ID: '${movement.id}'`);
      }
      ids.add(movement.id);
    }

    if (!movement.title) errors.push(`Movement ${idx}: missing 'title' field`);
    if (!movement.period) errors.push(`Movement ${idx}: missing 'period' field`);
    if (typeof movement.year !== 'number') {
      errors.push(`Movement ${idx}: 'year' must be a number`);
    }
    if (!movement.description) errors.push(`Movement ${idx}: missing 'description' field`);

    // Context validation
    if (movement.context) {
      const requiredContextFields = ['historical', 'philosophical', 'literary', 'scientific', 'themes'];
      requiredContextFields.forEach(field => {
        if (!movement.context[field]) {
          errors.push(`Movement ${idx} (${movement.id}): missing context.${field}`);
        }
      });
    }

    // Authors validation
    if (!Array.isArray(movement.authors) || movement.authors.length === 0) {
      errors.push(`Movement ${idx} (${movement.id}): must have at least one author`);
    } else {
      movement.authors.forEach((author, authorIdx) => {
        if (!author.name) {
          errors.push(`Movement ${idx} (${movement.id}), author ${authorIdx}: missing 'name'`);
        }
        if (!author.gender || !['M', 'F'].includes(author.gender)) {
          errors.push(`Movement ${idx} (${movement.id}), author ${authorIdx}: 'gender' must be 'M' or 'F'`);
        }
      });
    }

    // Works validation
    if (!Array.isArray(movement.works) || movement.works.length === 0) {
      errors.push(`Movement ${idx} (${movement.id}): must have at least one work`);
    }
  });

  // Second pass: validate connection references
  movements.forEach((movement, idx) => {
    if (movement.connections) {
      const connectionTypes = ['influence', 'reaction', 'evolution', 'related'];
      connectionTypes.forEach(type => {
        if (movement.connections[type]) {
          movement.connections[type].forEach(conn => {
            if (!conn.to) {
              errors.push(`Movement ${idx} (${movement.id}): connection missing 'to' field`);
            } else if (!ids.has(conn.to)) {
              errors.push(`Movement ${idx} (${movement.id}): invalid connection to '${conn.to}' (no such movement)`);
            }
            if (!conn.desc) {
              errors.push(`Movement ${idx} (${movement.id}): connection to '${conn.to}' missing 'desc' field`);
            }
          });
        }
      });
    }
  });

  return errors;
}

/**
 * Logs validation errors to console
 * @param {Array} errors - Array of error messages
 */
export function logValidationErrors(errors) {
  if (errors.length > 0) {
    console.error('❌ Configuration Validation Errors:');
    errors.forEach((error, idx) => {
      console.error(`  ${idx + 1}. ${error}`);
    });
  } else {
    console.log('✅ Configuration validation passed');
  }
}
