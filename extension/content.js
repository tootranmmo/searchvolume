// XPath Workflow Extension - Content Script
(function() {
  'use strict';

  let sidebar = null;
  let isOpen = false;
  let steps = [];
  let currentXPath = '//';
  let isSelectionMode = false;
  let history = [];

  // Create sidebar on page load
  function createSidebar() {
    if (sidebar) return;

    sidebar = document.createElement('div');
    sidebar.id = 'xpath-workflow-sidebar';
    sidebar.className = 'xpath-sidebar';
    sidebar.style.display = 'none';

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <h2>XPath Builder</h2>
        <p class="sidebar-subtitle">Build XPath step by step</p>
      </div>

      <div class="sidebar-content">
        <!-- Current XPath Display -->
        <div class="xpath-display">
          <label>Current XPath:</label>
          <div class="xpath-output">
            <code id="xpath-code">//</code>
            <button id="copy-btn" class="btn-icon" title="Copy to clipboard">📋</button>
          </div>
          <div class="xpath-info">
            <span id="match-count" class="match-count">0 matches</span>
          </div>
        </div>

        <!-- Selection Mode -->
        <div class="selection-mode">
          <button id="select-element-btn" class="btn-primary">
            🖱️ Select Element on Page
          </button>
        </div>

        <!-- Step Builder -->
        <div class="step-builder">
          <h3>Add Step</h3>
          <div class="step-options">
            <button class="btn-step" data-type="tag">+ Tag Name</button>
            <button class="btn-step" data-type="attribute">+ Attribute</button>
            <button class="btn-step" data-type="text">+ Text Contains</button>
            <button class="btn-step" data-type="position">+ Position</button>
            <button class="btn-step" data-type="custom">+ Custom</button>
          </div>
        </div>

        <!-- Steps List -->
        <div class="steps-list" id="steps-list" style="display: none;">
          <h3>Steps (<span id="steps-count">0</span>)</h3>
          <ul id="steps-container"></ul>
        </div>

        <!-- Actions -->
        <div class="sidebar-actions">
          <button id="undo-btn" class="btn-secondary">↶ Undo</button>
          <button id="clear-btn" class="btn-secondary">🗑️ Clear All</button>
        </div>

        <!-- Quick Templates -->
        <div class="quick-templates">
          <h3>Quick Templates</h3>
          <div class="template-buttons">
            <button class="btn-template" data-xpath="//a[@href]">All Links</button>
            <button class="btn-template" data-xpath="//img[@src]">All Images</button>
            <button class="btn-template" data-xpath="//button">All Buttons</button>
            <button class="btn-template" data-xpath="//*[@class]">With Class</button>
          </div>
        </div>

        <!-- Selected Element Info -->
        <div class="selected-info" id="selected-info" style="display: none;">
          <h3>Selected Element</h3>
          <div class="element-details" id="element-details"></div>
        </div>
      </div>
    `;

    document.body.appendChild(sidebar);
    attachEventListeners();
  }

  function attachEventListeners() {
    // Copy button
    document.getElementById('copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(currentXPath);
      showNotification('XPath copied to clipboard!');
    });

    // Select element button
    document.getElementById('select-element-btn').addEventListener('click', () => {
      toggleSelectionMode();
    });

    // Step buttons
    document.querySelectorAll('.btn-step').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        handleAddStep(type);
      });
    });

    // Template buttons
    document.querySelectorAll('.btn-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const xpath = e.target.dataset.xpath;
        setXPath(xpath);
      });
    });

    // Undo button
    document.getElementById('undo-btn').addEventListener('click', undoStep);

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', clearSteps);
  }

  function handleAddStep(type) {
    let value, description;

    switch(type) {
      case 'tag':
        value = prompt('Enter tag name (e.g., div, span, a):');
        if (value) description = `Tag: ${value}`;
        break;
      case 'attribute':
        value = prompt('Enter attribute (e.g., class="example"):');
        if (value) description = `Attribute: ${value}`;
        break;
      case 'text':
        value = prompt('Enter text to search:');
        if (value) description = `Text: ${value}`;
        break;
      case 'position':
        value = prompt('Enter position (e.g., 1, 2, last()):');
        if (value) description = `Position: ${value}`;
        break;
      case 'custom':
        value = prompt('Enter custom XPath part:');
        if (value) description = `Custom: ${value}`;
        break;
    }

    if (value) {
      addStep(type, value, description);
    }
  }

  function addStep(type, value, description) {
    const step = {
      id: Date.now().toString(),
      type,
      value,
      description
    };

    steps.push(step);
    history.push(currentXPath);
    buildXPath();
    renderSteps();
  }

  function removeStep(id) {
    steps = steps.filter(step => step.id !== id);
    buildXPath();
    renderSteps();
  }

  function buildXPath() {
    if (steps.length === 0) {
      currentXPath = '//';
      updateXPathDisplay();
      return;
    }

    let xpath = '//';
    steps.forEach((step, index) => {
      switch (step.type) {
        case 'tag':
          xpath += step.value;
          break;
        case 'attribute':
          xpath += `[@${step.value}]`;
          break;
        case 'text':
          xpath += `[contains(text(), '${step.value}')]`;
          break;
        case 'position':
          xpath += `[${step.value}]`;
          break;
        case 'custom':
          xpath += step.value;
          break;
      }
      if (index < steps.length - 1 && step.type === 'tag') {
        xpath += '/';
      }
    });

    currentXPath = xpath;
    updateXPathDisplay();
  }

  function updateXPathDisplay() {
    document.getElementById('xpath-code').textContent = currentXPath;
    testXPath();
  }

  function testXPath() {
    try {
      const result = document.evaluate(
        currentXPath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );

      const count = result.snapshotLength;
      const matchCountEl = document.getElementById('match-count');
      matchCountEl.textContent = `${count} ${count === 1 ? 'match' : 'matches'}`;
      matchCountEl.className = count > 0 ? 'match-count has-matches' : 'match-count';

      highlightMatches(result);
    } catch (error) {
      document.getElementById('match-count').textContent = '0 matches';
      document.getElementById('match-count').className = 'match-count';
    }
  }

  function highlightMatches(result) {
    // Remove previous highlights
    document.querySelectorAll('.xpath-highlight').forEach(el => {
      el.classList.remove('xpath-highlight');
    });

    // Add highlights
    for (let i = 0; i < result.snapshotLength; i++) {
      const node = result.snapshotItem(i);
      if (node instanceof Element && node.id !== 'xpath-workflow-sidebar') {
        node.classList.add('xpath-highlight');
      }
    }
  }

  function renderSteps() {
    const container = document.getElementById('steps-container');
    const stepsList = document.getElementById('steps-list');
    const stepsCount = document.getElementById('steps-count');

    if (steps.length === 0) {
      stepsList.style.display = 'none';
      return;
    }

    stepsList.style.display = 'block';
    stepsCount.textContent = steps.length;

    container.innerHTML = steps.map((step, index) => `
      <li class="step-item" data-id="${step.id}">
        <span class="step-number">${index + 1}</span>
        <div class="step-info">
          <span class="step-type">${step.type}</span>
          <span class="step-description">${step.description}</span>
        </div>
        <button class="btn-remove" data-id="${step.id}">✕</button>
      </li>
    `).join('');

    // Attach remove listeners
    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        removeStep(e.target.dataset.id);
      });
    });
  }

  function undoStep() {
    if (steps.length === 0) return;
    steps.pop();
    if (history.length > 0) {
      currentXPath = history.pop();
    }
    buildXPath();
    renderSteps();
  }

  function clearSteps() {
    steps = [];
    history = [];
    currentXPath = '//';
    updateXPathDisplay();
    renderSteps();
  }

  function setXPath(xpath) {
    currentXPath = xpath;
    updateXPathDisplay();
  }

  function toggleSelectionMode() {
    isSelectionMode = !isSelectionMode;
    const btn = document.getElementById('select-element-btn');

    if (isSelectionMode) {
      btn.textContent = '🎯 Click element to select...';
      btn.classList.add('active');
      enableSelectionMode();
    } else {
      btn.textContent = '🖱️ Select Element on Page';
      btn.classList.remove('active');
      disableSelectionMode();
    }
  }

  function enableSelectionMode() {
    document.addEventListener('click', handleElementClick, true);
    document.addEventListener('mouseover', handleElementHover, true);
    document.addEventListener('mouseout', handleElementOut, true);
  }

  function disableSelectionMode() {
    document.removeEventListener('click', handleElementClick, true);
    document.removeEventListener('mouseover', handleElementHover, true);
    document.removeEventListener('mouseout', handleElementOut, true);

    document.querySelectorAll('.xpath-hover').forEach(el => {
      el.classList.remove('xpath-hover');
    });
  }

  function handleElementClick(e) {
    if (e.target.closest('#xpath-workflow-sidebar')) return;

    e.preventDefault();
    e.stopPropagation();

    const element = e.target;
    const xpath = generateXPathForElement(element);
    setXPath(xpath);
    showSelectedElementInfo(element);

    toggleSelectionMode();
  }

  function handleElementHover(e) {
    if (e.target.closest('#xpath-workflow-sidebar')) return;
    e.target.classList.add('xpath-hover');
  }

  function handleElementOut(e) {
    e.target.classList.remove('xpath-hover');
  }

  function generateXPathForElement(element) {
    if (element.id) {
      return `//*[@id="${element.id}"]`;
    }

    const parts = [];
    let current = element;

    while (current && current !== document.body) {
      let index = 1;
      let sibling = current.previousElementSibling;

      while (sibling) {
        if (sibling.tagName === current.tagName) {
          index++;
        }
        sibling = sibling.previousElementSibling;
      }

      const tagName = current.tagName.toLowerCase();
      const part = index > 1 ? `${tagName}[${index}]` : tagName;
      parts.unshift(part);

      current = current.parentElement;
    }

    return '//' + parts.join('/');
  }

  function showSelectedElementInfo(element) {
    const info = document.getElementById('selected-info');
    const details = document.getElementById('element-details');

    let html = `<p><strong>Tag:</strong> ${element.tagName.toLowerCase()}</p>`;
    if (element.id) html += `<p><strong>ID:</strong> ${element.id}</p>`;
    if (element.className) html += `<p><strong>Class:</strong> ${element.className}</p>`;

    details.innerHTML = html;
    info.style.display = 'block';
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'xpath-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  function toggleSidebar() {
    if (!sidebar) {
      createSidebar();
    }

    isOpen = !isOpen;
    sidebar.style.display = isOpen ? 'block' : 'none';
  }

  // Listen for toggle event from popup
  window.addEventListener('xpath-toggle-sidebar', toggleSidebar);

  // Initialize
  createSidebar();

})();
