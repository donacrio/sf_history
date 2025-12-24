/**
 * Interactions Module
 * Handles user interactions and event listeners
 */

import { highlightConnections, drawConnections } from './timeline.js';
import { getMovements } from './config.js';

/**
 * Sets up all event listeners for user interactions
 */
export function setupInteractions() {
  setupCardInteractions();
  setupConnectionClicks();
  setupWindowResize();
}

/**
 * Sets up click and hover interactions for movement cards
 */
function setupCardInteractions() {
  // Use event delegation for dynamically created elements
  const timeline = document.getElementById('timeline');

  timeline.addEventListener('click', (event) => {
    const card = event.target.closest('.movement-card');
    if (card && !event.target.closest('.connection-link')) {
      toggleDetails(card);
    }
  });

  timeline.addEventListener('mouseenter', (event) => {
    const card = event.target.closest('.movement-card');
    if (card) {
      const movementId = card.getAttribute('data-id');
      highlightConnections(movementId, true);
    }
  }, true);

  timeline.addEventListener('mouseleave', (event) => {
    const card = event.target.closest('.movement-card');
    if (card) {
      const movementId = card.getAttribute('data-id');
      highlightConnections(movementId, false);
    }
  }, true);
}

/**
 * Sets up click interactions for connection links
 */
function setupConnectionClicks() {
  const timeline = document.getElementById('timeline');

  timeline.addEventListener('click', (event) => {
    const link = event.target.closest('.connection-link');
    if (link) {
      event.stopPropagation();
      const targetId = link.getAttribute('data-target');
      if (targetId) {
        scrollToMovement(targetId);
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
 * Toggles the expanded state of a movement card
 * @param {HTMLElement} card - The movement card element
 */
function toggleDetails(card) {
  const details = card.querySelector('.details');
  const isExpanded = details.classList.contains('show');

  // Close all other cards
  document.querySelectorAll('.details.show').forEach(d => {
    d.classList.remove('show');
    d.parentElement.classList.remove('expanded');
  });

  // Toggle this card
  if (!isExpanded) {
    details.classList.add('show');
    card.classList.add('expanded');

    // Redraw connections after expansion animation
    setTimeout(() => {
      const movements = getMovements();
      drawConnections(movements);
    }, 300);
  }
}

/**
 * Scrolls to a specific movement and highlights it
 * @param {string} id - Movement ID to scroll to
 */
export function scrollToMovement(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (!card) {
    console.warn(`Movement with ID '${id}' not found`);
    return;
  }

  // Scroll to card
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Expand if not already expanded
  const details = card.querySelector('.details');
  if (!details.classList.contains('show')) {
    toggleDetails(card);
  }

  // Flash effect
  card.style.animation = 'flash 1s ease';
  setTimeout(() => {
    card.style.animation = '';
  }, 1000);
}
