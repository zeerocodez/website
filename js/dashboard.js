/* ==========================================================================
   ZEEROCODES AUTOMATION - ENTERPRISE DASHBOARD SHOWCASE LOGIC
   Telemetry Generator, Live Threat Stream, & Governance Controls
   ========================================================================== */

class EnterpriseDashboard {
  constructor() {
    this.streamPaused = false;
    this.threatLogContainer = document.getElementById('auditLogStream');
    this.metrics = {
      pipelines: 24,
      threatRate: 99.98,
      latency: 42,
      tokenSavings: 3.4
    };

    this.sampleLogEvents = [
      { text: "PII Sanitized in Financial Intake Pipeline #408", level: "success", badge: "SANITIZED", latency: "6ms" },
      { text: "Prompt Injection Attack Neutralized (Vector Similarity: 0.94)", level: "alert", badge: "BLOCKED", latency: "12ms" },
      { text: "Kyber-1024 Quantum Key Exchange Verified with Node-US-EAST", level: "success", badge: "ENCRYPTED", latency: "8ms" },
      { text: "SOC2 Compliance Merkle Proof Logged [Block #849204]", level: "success", badge: "VERIFIED", latency: "4ms" },
      { text: "Model Hallucination Filter Triggered (Confidence < 85%)", level: "alert", badge: "RETRY_SAFE", latency: "18ms" },
      { text: "Unusual Token Rate Spike Mitigated for Org-Enterprise-84", level: "blocked", badge: "RATE_LIMITED", latency: "2ms" },
      { text: "Zero-Knowledge Age Verification Succeeded (0 PII Leaked)", level: "success", badge: "ZK_PASSED", latency: "9ms" }
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.startLiveStream();
    this.startTelemetryTicker();
  }

  bindEvents() {
    // Menu navigation
    const menuItems = document.querySelectorAll('.dash-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        menuItems.forEach(m => m.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        const view = target.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Pause/Play stream button
    const pauseBtn = document.getElementById('btnPauseStream');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.streamPaused = !this.streamPaused;
        pauseBtn.innerText = this.streamPaused ? 'Resume Stream' : 'Pause Stream';
        pauseBtn.classList.toggle('btn-outline-emerald', this.streamPaused);
      });
    }

    // Clear stream button
    const clearBtn = document.getElementById('btnClearStream');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.threatLogContainer) this.threatLogContainer.innerHTML = '';
      });
    }

    // Guardrail toggles
    const toggles = document.querySelectorAll('.guardrail-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const id = e.target.id;
        const state = e.target.checked ? 'ENABLED' : 'DISABLED';
        this.addLogEvent(`Security Guardrail [${id}] set to ${state}`, state === 'ENABLED' ? 'success' : 'alert', 'CONFIG_CHANGE', '1ms');
      });
    });
  }

  switchView(view) {
    const mainView = document.getElementById('dashViewMain');
    const pipelinesView = document.getElementById('dashViewPipelines');
    const governanceView = document.getElementById('dashViewGovernance');

    if (!mainView) return;

    if (view === 'pipelines') {
      mainView.style.display = 'none';
      if (governanceView) governanceView.style.display = 'none';
      if (pipelinesView) pipelinesView.style.display = 'block';
    } else if (view === 'governance') {
      mainView.style.display = 'none';
      if (pipelinesView) pipelinesView.style.display = 'none';
      if (governanceView) governanceView.style.display = 'block';
    } else {
      mainView.style.display = 'block';
      if (pipelinesView) pipelinesView.style.display = 'none';
      if (governanceView) governanceView.style.display = 'none';
    }
  }

  addLogEvent(text, level, badge, latency) {
    if (!this.threatLogContainer || this.streamPaused) return;

    const row = document.createElement('div');
    row.className = `audit-row ${level}`;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    let badgeClass = 'badge-success';
    if (level === 'alert') badgeClass = 'badge-warning';
    if (level === 'blocked') badgeClass = 'badge-danger';

    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <span style="color: var(--text-muted); font-size:0.7rem;">[${timestamp}]</span>
        <span>${text}</span>
      </div>
      <div style="display:flex; align-items:center; gap:0.5rem;">
        <span class="badge ${badgeClass}">${badge}</span>
        <span style="color: var(--text-dim); font-size:0.7rem;">${latency}</span>
      </div>
    `;

    this.threatLogContainer.prepend(row);

    // Keep max 15 entries
    while (this.threatLogContainer.children.length > 15) {
      this.threatLogContainer.removeChild(this.threatLogContainer.lastChild);
    }
  }

  startLiveStream() {
    setInterval(() => {
      if (!this.streamPaused) {
        const randomEvent = this.sampleLogEvents[Math.floor(Math.random() * this.sampleLogEvents.length)];
        this.addLogEvent(randomEvent.text, randomEvent.level, randomEvent.badge, randomEvent.latency);
      }
    }, 2800);
  }

  startTelemetryTicker() {
    setInterval(() => {
      // Micro fluctuation for realistic dashboard metrics
      const latencyEl = document.getElementById('dashValLatency');
      if (latencyEl) {
        const currentLatency = 40 + Math.floor(Math.random() * 6);
        latencyEl.innerText = `${currentLatency} ms`;
      }

      const tokensEl = document.getElementById('dashValTokens');
      if (tokensEl) {
        const curTokens = (3.4 + Math.random() * 0.05).toFixed(2);
        tokensEl.innerText = `${curTokens}M/mo`;
      }
    }, 4000);
  }
}

// Global initialization
window.initEnterpriseDashboard = function() {
  return new EnterpriseDashboard();
};
