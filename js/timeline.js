/**
 * Timeline Rendering Module
 * Handles rendering of the timeline visualization
 */

import { findMovementById } from './config.js';

/**
 * Renders the complete timeline
 * @param {Array} movements - Array of movement objects
 */
export function renderTimeline(movements) {
  const timeline = document.getElementById('timeline');

  // Clear existing content
  timeline.innerHTML = '';

  // Add SVG canvas for connections
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'connections');
  timeline.appendChild(svg);

  // Render each movement
  movements.forEach((movement, index) => {
    const movementElement = createMovementElement(movement, index);
    timeline.appendChild(movementElement);
  });

  // Draw connections after DOM is ready
  setTimeout(() => drawConnections(movements), 100);

  // Redraw on window resize
  window.addEventListener('resize', () => drawConnections(movements));
}

/**
 * Creates a movement DOM element
 * @param {Object} movement - Movement data
 * @param {number} index - Index in the timeline
 * @returns {HTMLElement} Movement element
 */
function createMovementElement(movement, index) {
  const isLeft = index % 2 === 0;
  const movementDiv = document.createElement('div');
  movementDiv.className = `movement ${isLeft ? 'left' : 'right'}`;

  // Count authors by gender
  const maleAuthors = movement.authors.filter(a => a.gender === 'M');
  const femaleAuthors = movement.authors.filter(a => a.gender === 'F');

  // Build HTML
  movementDiv.innerHTML = `
    <div class="timeline-dot" style="top: 50px;"></div>
    <div class="movement-card" data-id="${movement.id}">
      <div class="movement-title">
        ${movement.title}
        <span class="period">${movement.period}</span>
        <span class="expand-icon">▼</span>
      </div>
      <div class="description">${movement.description}</div>

      <div class="details">
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

        ${movement.context ? `
          <div class="section-title">🌍 Contexte & Enjeux</div>
          <div class="context-section">
            <div class="context-item">
              <div class="context-label">📅 Contexte historique</div>
              <div class="context-text">${movement.context.historical}</div>
            </div>
            <div class="context-item">
              <div class="context-label">🤔 Questions philosophiques</div>
              <div class="context-text">${movement.context.philosophical}</div>
            </div>
            <div class="context-item">
              <div class="context-label">✍️ Innovations littéraires</div>
              <div class="context-text">${movement.context.literary}</div>
            </div>
            <div class="context-item">
              <div class="context-label">🔬 Concepts scientifiques</div>
              <div class="context-text">${movement.context.scientific}</div>
            </div>
            <div class="context-item">
              <div class="context-label">💭 Thèmes récurrents</div>
              <div class="context-text">${movement.context.themes}</div>
            </div>
          </div>
        ` : ''}

        ${renderConnectionsSection(movement)}
      </div>
    </div>
  `;

  return movementDiv;
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
  const svg = document.querySelector('svg.connections');
  if (!svg) return;

  svg.innerHTML = '';

  movements.forEach(movement => {
    const fromPos = getMovementPosition(movement.id);
    if (!fromPos) return;

    if (movement.connections) {
      Object.entries(movement.connections).forEach(([type, connections]) => {
        if (connections) {
          connections.forEach(conn => {
            const toPos = getMovementPosition(conn.to);
            if (!toPos) return;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            // Bézier curve for elegant connection
            const controlX1 = fromPos.x + (toPos.x - fromPos.x) * 0.3;
            const controlY1 = fromPos.y;
            const controlX2 = fromPos.x + (toPos.x - fromPos.x) * 0.7;
            const controlY2 = toPos.y;

            const d = `M ${fromPos.x} ${fromPos.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toPos.x} ${toPos.y}`;

            path.setAttribute('d', d);
            path.setAttribute('class', `connection-line ${type}`);
            path.setAttribute('data-from', movement.id);
            path.setAttribute('data-to', conn.to);

            svg.appendChild(path);
          });
        }
      });
    }
  });
}

/**
 * Gets the position of a movement card
 * @param {string} id - Movement ID
 * @returns {Object|null} Position {x, y} or null
 */
function getMovementPosition(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (!card) return null;

  const rect = card.getBoundingClientRect();
  const container = document.querySelector('.timeline-container');
  const containerRect = container.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2 - containerRect.left,
    y: rect.top + rect.height / 2 - containerRect.top + container.scrollTop
  };
}

/**
 * Highlights connections for a specific movement
 * @param {string} movementId - Movement ID
 * @param {boolean} highlight - Whether to highlight or unhighlight
 */
export function highlightConnections(movementId, highlight) {
  const lines = document.querySelectorAll('.connection-line');

  lines.forEach(line => {
    const from = line.getAttribute('data-from');
    const to = line.getAttribute('data-to');

    if (from === movementId || to === movementId) {
      if (highlight) {
        line.classList.add('active');
        // Highlight connected cards
        const connectedId = from === movementId ? to : from;
        const connectedCard = document.querySelector(`[data-id="${connectedId}"]`);
        if (connectedCard) {
          connectedCard.classList.add('highlighted');
        }
      } else {
        line.classList.remove('active');
        const connectedId = from === movementId ? to : from;
        const connectedCard = document.querySelector(`[data-id="${connectedId}"]`);
        if (connectedCard) {
          connectedCard.classList.remove('highlighted');
        }
      }
    }
  });
}
