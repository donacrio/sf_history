/**
 * Interactions Module - Horizontal Timeline
 * Handles user interactions and event listeners for horizontal layout
 */

import {
  highlightConnections,
  drawConnections,
  showMovementDetails,
} from "./timeline.js";
import { getMovements } from "./config.js";

/**
 * Sets up all event listeners for user interactions
 */
export function setupInteractions() {
  setupBarInteractions();
  setupConnectionClicks();
  setupWindowResize();
  setupSidebarToggle();
  setupZoomControls();
}

/**
 * Sets up click and hover interactions for movement bars
 */
function setupBarInteractions() {
  const timeline = document.getElementById("timeline");

  // Click on bar to show details in sidebar
  timeline.addEventListener("click", (event) => {
    const bar = event.target.closest(".movement-bar");
    if (bar && !event.target.closest(".connection-link")) {
      const movementId = bar.getAttribute("data-id");
      if (movementId) {
        showMovementDetails(movementId);
      }
    }
  });

  // Hover to highlight connections
  timeline.addEventListener(
    "mouseenter",
    (event) => {
      const bar = event.target.closest(".movement-bar");
      if (bar) {
        const movementId = bar.getAttribute("data-id");
        highlightConnections(movementId, true);
      }
    },
    true
  );

  timeline.addEventListener(
    "mouseleave",
    (event) => {
      const bar = event.target.closest(".movement-bar");
      if (bar) {
        const movementId = bar.getAttribute("data-id");
        highlightConnections(movementId, false);
      }
    },
    true
  );
}

/**
 * Sets up click interactions for connection links in sidebar
 */
function setupConnectionClicks() {
  const timeline = document.getElementById("timeline");

  timeline.addEventListener("click", (event) => {
    const link = event.target.closest(".connection-link");
    if (link) {
      event.stopPropagation();
      const targetId = link.getAttribute("data-target");
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
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const movements = getMovements();
      drawConnections(movements);
    }, 150);
  });
}

/**
 * Sets up sidebar toggle button functionality
 */
function setupSidebarToggle() {
  const toggleButton = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("details-sidebar");
  const container = document.getElementById("timeline");

  if (!toggleButton || !sidebar || !container) return;

  toggleButton.addEventListener("click", () => {
    const isActive = toggleButton.classList.contains("active");

    if (isActive) {
      // Hide sidebar
      sidebar.classList.add("hidden");
      container.classList.add("sidebar-hidden");
      toggleButton.classList.remove("active");
    } else {
      // Show sidebar
      sidebar.classList.remove("hidden");
      container.classList.remove("sidebar-hidden");
      toggleButton.classList.add("active");
    }
  });
}

/**
 * Sets up zoom controls functionality
 */
function setupZoomControls() {
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");
  const zoomLevelDisplay = document.getElementById("zoom-level");
  const timeAxis = document.getElementById("time-axis");
  const movementBars = document.getElementById("movements-bars");
  const connectionsSvg = document.getElementById("connections-svg");

  if (!zoomInBtn || !zoomOutBtn || !zoomLevelDisplay) return;

  let zoomLevel = 4.0; // 200% actual = 100% display (default - zoomed in 2x)
  const minZoom = 0.5; // 50% actual = 25% display
  const maxZoom = 8.0; // 800% actual = 400% display
  const zoomStep = 0.5; // 50% increments in actual zoom

  function updateZoom(newZoom) {
    zoomLevel = Math.max(minZoom, Math.min(maxZoom, newZoom));

    // Update display (divide by 2 to show 2x zoom as 100%)
    zoomLevelDisplay.textContent = `${Math.round(zoomLevel * 50)}%`;

    // Apply zoom to timeline elements
    // Base width is 300%, zoomLevel 2.0 gives 600% (which displays as 100%)
    if (timeAxis) {
      timeAxis.style.width = `${300 * zoomLevel}%`;
    }
    if (movementBars) {
      movementBars.style.width = `${300 * zoomLevel}%`;
    }
    if (connectionsSvg) {
      connectionsSvg.style.width = `${300 * zoomLevel}%`;
    }

    // Redraw connections after zoom
    setTimeout(() => {
      const movements = getMovements();
      drawConnections(movements);
    }, 50);
  }

  zoomInBtn.addEventListener("click", () => {
    updateZoom(zoomLevel + zoomStep);
  });

  zoomOutBtn.addEventListener("click", () => {
    updateZoom(zoomLevel - zoomStep);
  });

  // Keyboard shortcuts: Ctrl/Cmd + / Ctrl/Cmd -
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      updateZoom(zoomLevel + zoomStep);
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "-" || e.key === "_")) {
      e.preventDefault();
      updateZoom(zoomLevel - zoomStep);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
      e.preventDefault();
      updateZoom(4.0); // Reset to 100% (which is 2x zoom)
    }
  });

  // Set initial zoom to 2x (displays as 100%)
  updateZoom(4.0);
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
  const visualizationContainer = document.querySelector(
    ".timeline-visualization"
  );
  const barRect = bar.getBoundingClientRect();
  const containerRect = visualizationContainer.getBoundingClientRect();

  // Calculate scroll position (horizontal scroll)
  const scrollLeft =
    bar.offsetLeft - containerRect.width / 2 + bar.offsetWidth / 2;
  visualizationContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });

  // Flash effect
  bar.style.animation = "flash 1s ease";
  setTimeout(() => {
    bar.style.animation = "";
  }, 1000);
}
