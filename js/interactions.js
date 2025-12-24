/**
 * Interactions Module - Horizontal Timeline
 * Handles user interactions and event listeners for horizontal layout
 */

import { highlightConnections, drawConnections, showMovementDetails } from './timeline.js';
import { getMovements } from './config.js';

/**
 * Sets up all event listeners for user interactions
 */
export function setupInteractions() {
  setupBarInteractions();
  setupConnectionClicks();
  setupWindowResize();
}

/**
 * Sets up click and hover interactions for movement bars
 */
function setupBarInteractions() {
  const timeline = document.getElementById('timeline');

  // Click on bar to show details in sidebar
  timeline.addEventListener('click', (event) => {
    const bar = event.target.closest('.movement-bar');
    if (bar && !event.target.closest('.connection-link')) {
      const movementId = bar.getAttribute('data-id');
      if (movementId) {
        showMovementDetails(movementId);
      }
    }
  });

  // Hover to highlight connections
  timeline.addEventListener('mouseenter', (event) => {
    const bar = event.target.closest('.movement-bar');
    if (bar) {
      const movementId = bar.getAttribute('data-id');
      highlightConnections(movementId, true);
    }
  }, true);

  timeline.addEventListener('mouseleave', (event) => {
    const bar = event.target.closest('.movement-bar');
    if (bar) {
      const movementId = bar.getAttribute('data-id');
      highlightConnections(movementId, false);
    }
  }, true);
}

/**
 * Sets up click interactions for connection links in sidebar
 */
function setupConnectionClicks() {
  const timeline = document.getElementById('timeline');

  timeline.addEventListener('click', (event) => {
    const link = event.target.closest('.connection-link');
    if (link) {
      event.stopPropagation();
      const targetId = link.getAttribute('data-target');
      if (targetId) {
        // Scroll to the movement bar and show its details
        scrollToMovementBar(targetId);
        showMovementDetails(targetId);
      }
    }
  });
}

/**
 * Sets up window resize handler
 */
function setupWindowResize() {
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const movements = getMovements();
      drawConnections(movements);
    }, 150);
  });
}

/**
 * Scrolls to a specific movement bar and highlights it
 * @param {string} id - Movement ID to scroll to
 */
export function scrollToMovementBar(id) {
  const bar = document.querySelector(`[data-id="${id}"]`);
  if (!bar) {
    console.warn(`Movement with ID '${id}' not found`);
    return;
  }

  // Scroll the visualization container to bring bar into view
  const visualizationContainer = document.querySelector('.timeline-visualization');
  const barRect = bar.getBoundingClientRect();
  const containerRect = visualizationContainer.getBoundingClientRect();

  // Calculate scroll position (horizontal scroll)
  const scrollLeft = bar.offsetLeft - containerRect.width / 2 + bar.offsetWidth / 2;
  visualizationContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });

  // Flash effect
  bar.style.animation = 'flash 1s ease';
  setTimeout(() => {
    bar.style.animation = '';
  }, 1000);
}
