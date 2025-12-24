/**
 * Main Application Entry Point
 * Initializes and runs the timeline visualization
 */

import { loadConfig, getMovements, getMetadata } from './config.js';
import { renderTimeline } from './timeline.js';
import { setupInteractions } from './interactions.js';

/**
 * Initializes the application
 */
async function init() {
  try {
    // Show loading indicator
    showLoading();

    // Load configuration
    const config = await loadConfig();

    // Update page metadata
    updateMetadata(config.metadata || {});

    // Get movements
    const movements = getMovements();

    // Render timeline
    renderTimeline(movements);

    // Setup interactions
    setupInteractions();

    // Hide loading indicator
    hideLoading();

    console.log(`✅ Timeline initialized with ${movements.length} movements`);
  } catch (error) {
    console.error('Failed to initialize timeline:', error);
    showError(error.message);
  }
}

/**
 * Updates page metadata (title, subtitle)
 * @param {Object} metadata - Metadata object
 */
function updateMetadata(metadata) {
  if (metadata.title) {
    document.title = metadata.title;
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = `🌌 ${metadata.title} 🚀`;
  }

  if (metadata.subtitle) {
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = metadata.subtitle;
  }
}

/**
 * Shows loading indicator
 */
function showLoading() {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '<div style="text-align: center; padding: 50px; color: #00d4ff; font-size: 1.2em;">⏳ Chargement...</div>';
}

/**
 * Hides loading indicator
 */
function hideLoading() {
  // Loading is replaced by actual content in renderTimeline
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = `
    <div style="text-align: center; padding: 50px; color: #ff6b00;">
      <h2>❌ Erreur</h2>
      <p>${message}</p>
      <p style="color: #888; margin-top: 20px;">Consultez la console pour plus de détails.</p>
    </div>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
