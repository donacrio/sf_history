/**
 * Timeline Rendering Module - Horizontal Layout
 * Renders movements as horizontal bars with time axis
 */

import { findMovementById } from './config.js';
import { parsePeriod, getYearRange, assignLanes, generateDecades, yearToPosition } from './utils.js';

let currentSelection = null;
let yearRange = { minYear: 1800, maxYear: 2030 };

/**
 * Renders the complete horizontal timeline
 * @param {Array} movements - Array of movement objects
 */
export function renderTimeline(movements) {
  const container = document.getElementById('timeline');
  container.innerHTML = '';

  // Assign lanes to prevent overlaps
  const movementsWithLanes = assignLanes(movements);

  // Get year range
  yearRange = getYearRange(movements);

  // Create layout: visualization (left) + details sidebar (right)
  container.innerHTML = `
    <div class="timeline-visualization">
      <div class="time-axis" id="time-axis"></div>
      <svg class="connections" id="connections-svg"></svg>
      <div class="movements-bars" id="movements-bars"></div>
    </div>
    <div class="details-sidebar hidden" id="details-sidebar">
      <p>Cliquez sur un courant pour voir ses détails</p>
    </div>
  `;

  // Start with sidebar hidden
  container.classList.add('sidebar-hidden');

  // Render time axis with decades
  renderTimeAxis();

  // Render movement bars
  renderMovementBars(movementsWithLanes);

  // Draw connections
  setTimeout(() => drawConnections(movements), 100);
}

/**
 * Renders the time axis with decade markers
 */
function renderTimeAxis() {
  const timeAxis = document.getElementById('time-axis');
  const decades = generateDecades(yearRange.minYear, yearRange.maxYear);

  // Ensure the axis line extends to 100% of its container width (which is already 300%)
  timeAxis.style.minWidth = '100%';

  decades.forEach(decade => {
    const position = yearToPosition(decade, yearRange.minYear, yearRange.maxYear);
    const marker = document.createElement('div');
    marker.className = 'decade-marker';
    marker.style.left = `${position}%`;
    marker.innerHTML = `
      <div class="decade-line"></div>
      <div class="decade-label">${decade}</div>
    `;
    timeAxis.appendChild(marker);
  });
}

/**
 * Renders movement bars
 * @param {Array} movements - Movements with lane assignments
 */
function renderMovementBars(movements) {
  const barsContainer = document.getElementById('movements-bars');
  const laneHeight = 70; // Height of each lane (bar + spacing)
  const barHeight = 60; // Height of the bar itself

  // Calculate container height based on number of lanes
  const maxLane = Math.max(...movements.map(m => m.lane || 0));
  barsContainer.style.height = `${(maxLane + 1) * laneHeight + 20}px`;

  movements.forEach(movement => {
    const { start, end } = parsePeriod(movement.period);
    const startPos = yearToPosition(start, yearRange.minYear, yearRange.maxYear);
    const endPos = yearToPosition(end, yearRange.minYear, yearRange.maxYear);
    const width = endPos - startPos;

    const bar = document.createElement('div');
    bar.className = 'movement-bar';
    bar.dataset.id = movement.id;
    bar.style.left = `${startPos}%`;
    bar.style.width = `${width}%`;
    bar.style.top = `${movement.lane * laneHeight}px`;

    bar.innerHTML = `
      <div class="movement-bar-content">
        <div class="movement-bar-title">${movement.title}</div>
        <div class="movement-bar-period">${movement.period}</div>
      </div>
    `;

    barsContainer.appendChild(bar);
  });
}

/**
 * Shows movement details in the sidebar
 * @param {string} movementId - Movement ID to display
 */
export function showMovementDetails(movementId) {
  const movement = findMovementById(movementId);
  if (!movement) return;

  currentSelection = movementId;

  // Update bar selection states
  document.querySelectorAll('.movement-bar').forEach(bar => {
    if (bar.dataset.id === movementId) {
      bar.classList.add('selected');
    } else {
      bar.classList.remove('selected');
    }
  });

  const sidebar = document.getElementById('details-sidebar');
  const container = document.getElementById('timeline');
  const toggleButton = document.getElementById('sidebar-toggle');

  // Show sidebar when movement is clicked
  sidebar.classList.remove('empty', 'hidden');
  container.classList.remove('sidebar-hidden');
  if (toggleButton) {
    toggleButton.classList.add('active');
  }

  // Count authors by gender
  const maleAuthors = movement.authors.filter(a => a.gender === 'M');
  const femaleAuthors = movement.authors.filter(a => a.gender === 'F');

  sidebar.innerHTML = `
    <div class="sidebar-title">${movement.title}</div>
    <div class="sidebar-period">${movement.period}</div>
    <div class="sidebar-description">${movement.description}</div>

    ${movement.context ? `
      <div class="section-title">🌍 Contexte & Enjeux</div>
      <div class="context-section">
        <div class="context-item">
          <div class="context-label">📅 Contexte historique</div>
          <div class="context-text">${movement.context.historical}</div>
        </div>
        <div class="context-item">
          <div class="context-label">💭 Thèmes récurrents</div>
          <div class="context-text">${movement.context.themes}</div>
        </div>
        <div class="context-item">
          <div class="context-label">🤔 Questionnements de société</div>
          <div class="context-text">${movement.context.questionnements}</div>
        </div>
        <div class="context-item">
          <div class="context-label">🔬 Concepts scientifiques</div>
          <div class="context-text">${movement.context.scientific}</div>
        </div>
        <div class="context-item">
          <div class="context-label">✍️ Innovations littéraires</div>
          <div class="context-text">${movement.context.literary}</div>
        </div>
      </div>
    ` : ''}

    <div class="section-title">👥 Auteur·ice·s majeur·e·s (${femaleAuthors.length}♀ / ${maleAuthors.length}♂)</div>
    <div class="authors">
      ${movement.authors.map(author => `
        <div class="author ${author.gender === 'F' ? 'female' : ''} ${author.favorite ? 'favorite' : ''}">
          ${author.name} ${author.gender === 'F' ? '♀' : '♂'}
        </div>
      `).join('')}
    </div>

    <div class="section-title">📚 Œuvres marquantes</div>
    <div class="works">
      ${movement.works.map(work => `
        <div class="work">${work}</div>
      `).join('')}
    </div>

    ${renderConnectionsSection(movement)}
  `;

  // Redraw connections to highlight
  const movements = Array.from(document.querySelectorAll('.movement-bar')).map(bar =>
    findMovementById(bar.dataset.id)
  ).filter(Boolean);
  drawConnections(movements);
}

/**
 * Renders the connections section for a movement
 * @param {Object} movement - Movement data
 * @returns {string} HTML string for connections
 */
function renderConnectionsSection(movement) {
  if (!movement.connections) return '';

  const typeLabels = {
    influence: { icon: '→', label: 'Influence directe sur' },
    reaction: { icon: '⚡', label: 'Réaction contre' },
    evolution: { icon: '↗', label: 'Évolution de' },
    related: { icon: '↔', label: 'En lien avec' }
  };

  let connectionsHTML = '';

  Object.entries(movement.connections).forEach(([type, connections]) => {
    if (connections && connections.length > 0) {
      const typeInfo = typeLabels[type];
      connectionsHTML += `
        <div class="connection-group">
          <div class="connection-type-title ${type}">
            ${typeInfo.icon} ${typeInfo.label}
          </div>
          ${connections.map(conn => {
            const targetMovement = findMovementById(conn.to);
            return `
              <div class="connection-link ${type}" data-target="${conn.to}">
                <strong>${targetMovement ? targetMovement.title : conn.to}</strong>
                <br><small>${conn.desc}</small>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  });

  if (connectionsHTML) {
    return `
      <div class="section-title">🔗 Connexions avec d'autres courants</div>
      <div class="connections-section">
        ${connectionsHTML}
      </div>
    `;
  }

  return '';
}

/**
 * Draws connection lines between movements
 * @param {Array} movements - Array of movement objects
 */
export function drawConnections(movements) {
  const svg = document.getElementById('connections-svg');
  if (!svg) return;

  svg.innerHTML = '';

  movements.forEach(movement => {
    if (!movement.connections) return;

    Object.entries(movement.connections).forEach(([type, connections]) => {
      if (connections) {
        connections.forEach(conn => {
          const fromBar = document.querySelector(`[data-id="${movement.id}"]`);
          const toBar = document.querySelector(`[data-id="${conn.to}"]`);

          if (!fromBar || !toBar) return;

          const fromRect = fromBar.getBoundingClientRect();
          const toRect = toBar.getBoundingClientRect();
          const containerRect = svg.parentElement.getBoundingClientRect();

          // Calculate connection points (from right edge of from-bar to left edge of to-bar)
          const fromX = fromRect.right - containerRect.left;
          const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
          const toX = toRect.left - containerRect.left;
          const toY = toRect.top + toRect.height / 2 - containerRect.top;

          // Create curved arrow path
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

          // Bezier curve with proper control points
          const controlX1 = fromX + (toX - fromX) * 0.3;
          const controlY1 = fromY;
          const controlX2 = fromX + (toX - fromX) * 0.7;
          const controlY2 = toY;

          const d = `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;

          path.setAttribute('d', d);
          path.setAttribute('class', `connection-line ${type}`);
          path.setAttribute('data-from', movement.id);
          path.setAttribute('data-to', conn.to);

          // Highlight if connected to current selection
          if (currentSelection && (movement.id === currentSelection || conn.to === currentSelection)) {
            path.classList.add('active');
          }

          svg.appendChild(path);

          // Add arrowhead marker
          const arrowhead = addArrowhead(svg, toX, toY, Math.atan2(toY - controlY2, toX - controlX2), type);
          arrowhead.setAttribute('data-from', movement.id);
          arrowhead.setAttribute('data-to', conn.to);

          // Highlight arrowhead if connected to current selection
          if (currentSelection && (movement.id === currentSelection || conn.to === currentSelection)) {
            arrowhead.classList.add('active');
          }
        });
      }
    });
  });
}

/**
 * Adds an arrowhead to the SVG
 * @param {SVGElement} svg - SVG element
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} angle - Angle in radians
 * @param {string} type - Connection type for styling
 */
function addArrowhead(svg, x, y, angle, type) {
  const arrowSize = 8;
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

  // Calculate arrowhead points
  const point1X = x;
  const point1Y = y;
  const point2X = x - arrowSize * Math.cos(angle - Math.PI / 6);
  const point2Y = y - arrowSize * Math.sin(angle - Math.PI / 6);
  const point3X = x - arrowSize * Math.cos(angle + Math.PI / 6);
  const point3Y = y - arrowSize * Math.sin(angle + Math.PI / 6);

  polygon.setAttribute('points', `${point1X},${point1Y} ${point2X},${point2Y} ${point3X},${point3Y}`);
  polygon.setAttribute('class', `connection-arrowhead ${type}`);

  // Match the line color
  const colors = {
    influence: '#00d4ff',
    reaction: '#ff6b00',
    evolution: '#00ff88',
    related: '#ff00ff'
  };
  polygon.setAttribute('fill', colors[type] || '#00d4ff');

  svg.appendChild(polygon);
  return polygon;
}

/**
 * Highlights connections for a specific movement
 * @param {string} movementId - Movement ID
 * @param {boolean} highlight - Whether to highlight or unhighlight
 */
export function highlightConnections(movementId, highlight) {
  const lines = document.querySelectorAll('.connection-line');
  const arrowheads = document.querySelectorAll('.connection-arrowhead');
  const bars = document.querySelectorAll('.movement-bar');

  if (highlight) {
    // Highlight connected bars, lines, and arrowheads
    lines.forEach(line => {
      const from = line.getAttribute('data-from');
      const to = line.getAttribute('data-to');

      if (from === movementId || to === movementId) {
        line.classList.add('active');
        const connectedId = from === movementId ? to : from;
        const connectedBar = document.querySelector(`[data-id="${connectedId}"]`);
        if (connectedBar) {
          connectedBar.classList.add('highlighted');
        }
      }
    });

    arrowheads.forEach(arrowhead => {
      const from = arrowhead.getAttribute('data-from');
      const to = arrowhead.getAttribute('data-to');

      if (from === movementId || to === movementId) {
        arrowhead.classList.add('active');
      }
    });
  } else {
    // Remove highlight unless it's the current selection
    lines.forEach(line => {
      const from = line.getAttribute('data-from');
      const to = line.getAttribute('data-to');

      if (from === movementId || to === movementId) {
        if (!currentSelection || (from !== currentSelection && to !== currentSelection)) {
          line.classList.remove('active');
        }
      }
    });

    arrowheads.forEach(arrowhead => {
      const from = arrowhead.getAttribute('data-from');
      const to = arrowhead.getAttribute('data-to');

      if (from === movementId || to === movementId) {
        if (!currentSelection || (from !== currentSelection && to !== currentSelection)) {
          arrowhead.classList.remove('active');
        }
      }
    });

    bars.forEach(bar => {
      if (bar.dataset.id !== currentSelection) {
        bar.classList.remove('highlighted');
      }
    });
  }
}

/**
 * Gets the current selection
 * @returns {string|null} Current movement ID or null
 */
export function getCurrentSelection() {
  return currentSelection;
}
