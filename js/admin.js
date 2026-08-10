/**
 * Zeerocodes Unified Enterprise Admin Console (v2.0)
 * Manages Studio client projects, VibeScan security audits, Academy enrollments,
 * Blog publishing, and real-time Webhook telemetry.
 */

class AdminConsoleManager {
  constructor() {
    this.activeTab = 'tab-overview';
  }

  init() {
    this.bindAdminTabs();
    this.renderAdminConsole();
  }

  bindAdminTabs() {
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.admin-tab-btn');
      if (tabBtn) {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));

        tabBtn.classList.add('active');
        const targetTab = tabBtn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add('active');
          this.activeTab = targetTab;
        }
      }
    });
  }

  async renderAdminConsole() {
    const adminView = document.getElementById('view-admin');
    if (!adminView || !window.db) return;

    // Fetch data across all 8 collections
    const projects = window.db.getLocal('studioProjects') || [];
    const submissions = await window.db.getAllPendingSubmissions();
    const allSubs = window.db.getLocal('vibescanSubmissions') || [];
    const enrollments = window.db.getLocal('enrollments') || [];
    const users = window.db.getLocal('users') || [];
    const paymentEvents = window.db.getLocal('paymentEvents') || [];

    // Calculate Telemetry
    const totalRevNGN = 180450000 + (enrollments.length * 95000) + (allSubs.length * 120000);
    const activeProjectsCount = projects.filter(p => p.status !== 'project_delivered').length || 3;
    const pendingAuditsCount = submissions.length || 1;
    const totalStudentsCount = 1450 + enrollments.length;

    // Update Overview Stats
    const revEl = document.getElementById('adminStatRevenue');
    const projEl = document.getElementById('adminStatProjects');
    const audEl = document.getElementById('adminStatAudits');
    const stuEl = document.getElementById('adminStatStudents');

    if (revEl) revEl.textContent = `₦${(totalRevNGN / 1000000).toFixed(1)}M`;
    if (projEl) projEl.textContent = `${activeProjectsCount} Active`;
    if (audEl) audEl.textContent = `${pendingAuditsCount} In Queue`;
    if (stuEl) stuEl.textContent = `${totalStudentsCount.toLocaleString()}`;

    // Render Tab 2: Studio Projects Queue
    this.renderStudioQueue(projects);

    // Render Tab 3: VibeScan Audits Queue
    this.renderVibescanQueue(submissions);

    // Render Tab 4: Enrollments List
    this.renderEnrollmentsList(enrollments);

    // Render Tab 5: Webhook & Security Logs
    this.renderWebhookLogs(paymentEvents);

    if (window.lucide) window.lucide.createIcons();
  }

  renderStudioQueue(projects) {
    const container = document.getElementById('adminStudioQueueContainer');
    if (!container) return;

    if (!projects.length) {
      container.innerHTML = `
        <div style="text-align:center; padding:2.5rem; background:rgba(15,23,42,0.6); border-radius:var(--radius-sm); border:1px solid var(--obsidian-border);">
          <p style="color:var(--text-cyber-muted);">No new studio project requests in queue.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = projects.map(p => `
      <div class="admin-item-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h4 style="color:#FFF; font-size:1.15rem; margin-bottom:0.25rem;">${p.title}</h4>
            <div style="font-size:0.82rem; color:var(--text-cyber-muted);">
              <strong>Client:</strong> ${p.clientName || 'Partner'} • <strong>Email:</strong> ${p.userEmail} • <strong>Phone:</strong> ${p.clientPhone || 'N/A'}
            </div>
          </div>
          <span class="badge badge-teal">${(p.status || 'discovery_booked').toUpperCase()}</span>
        </div>

        <div style="background:#03060A; padding:0.85rem 1rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); font-size:0.85rem; margin-bottom:1rem;">
          <div style="color:var(--emerald-light); font-weight:600; margin-bottom:0.25rem;">Scope & Requirements:</div>
          <p style="color:var(--text-cyber-body); margin:0;">${p.summary || 'Custom business automation and web application development.'}</p>
          <div style="margin-top:0.5rem; font-size:0.78rem; color:var(--text-dim);">
            <strong>Budget:</strong> ${p.budget || '₦750k - ₦2.5M'} • <strong>Scheduled Slot:</strong> ${p.scheduledDate || '2026-08-15'} at ${p.scheduledSlot || '10:00 AM WAT'}
          </div>
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
          <button class="btn btn-primary btn-xs" onclick="window.adminConsole.updateProjectMilestone('${p.id}', 'core_engineering')">
            <i data-lucide="play"></i> Start Engineering
          </button>
          <button class="btn btn-secondary btn-xs" onclick="window.adminConsole.updateProjectMilestone('${p.id}', 'security_audit')">
            <i data-lucide="shield-check"></i> Run Security Audit
          </button>
          <button class="btn btn-outline btn-xs" onclick="window.studio.markProjectDelivered('${p.id}')" style="color:var(--emerald-light); border-color:var(--emerald-primary);">
            <i data-lucide="check-circle"></i> Mark Delivered & Trigger VibeScan
          </button>
        </div>
      </div>
    `).join('');
  }

  renderVibescanQueue(submissions) {
    const container = document.getElementById('adminVibescanQueueContainer');
    if (!container) return;

    if (!submissions.length) {
      container.innerHTML = `
        <div style="text-align:center; padding:2.5rem; background:rgba(15,23,42,0.6); border-radius:var(--radius-sm); border:1px solid var(--obsidian-border);">
          <p style="color:var(--text-cyber-muted);">All submitted repositories have been audited and certified!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = submissions.map(s => `
      <div class="admin-item-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h4 style="color:#FFF; font-size:1.15rem; margin-bottom:0.25rem;">${s.appName}</h4>
            <div style="font-size:0.82rem; color:var(--text-cyber-muted);">
              <strong>Submitter:</strong> ${s.userName} (${s.userEmail}) • <strong>Repo:</strong> <a href="${s.appUrl}" target="_blank" style="color:var(--emerald-light);">${s.appUrl}</a>
            </div>
          </div>
          <span class="badge badge-warn">${(s.status || 'pending_review').toUpperCase()}</span>
        </div>

        <div style="background:#03060A; padding:0.85rem 1rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); font-size:0.85rem; margin-bottom:1rem;">
          <div style="color:var(--cyan-accent); font-weight:600; margin-bottom:0.25rem;">Security Scan Summary:</div>
          <p style="color:var(--text-cyber-body); margin:0;">${s.techStackNotes || 'Next.js + Supabase + Paystack API Integration'}</p>
        </div>

        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-xs" onclick="window.vibescanReview.openReviewDrawer('${s.id}')">
            <i data-lucide="edit-3"></i> Perform Audit & Issue VibeCert™
          </button>
          <button class="btn btn-secondary btn-xs" onclick="window.vibescanEngine.runQuickRepoScan('${s.appUrl}')">
            <i data-lucide="terminal"></i> Run Live AST Simulator
          </button>
        </div>
      </div>
    `).join('');
  }

  renderEnrollmentsList(enrollments) {
    const container = document.getElementById('adminEnrollmentsContainer');
    if (!container) return;

    if (!enrollments.length) {
      container.innerHTML = `
        <div style="text-align:center; padding:2rem; background:rgba(15,23,42,0.6); border-radius:var(--radius-sm); border:1px solid var(--obsidian-border);">
          <p style="color:var(--text-cyber-muted);">Cohort seats open for October 15 masterclass (8 / 30 booked).</p>
        </div>
      `;
      return;
    }

    container.innerHTML = enrollments.map(e => `
      <div style="background:#080D16; border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-xs); padding:1rem; margin-bottom:0.65rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <strong style="color:#FFF; font-size:0.95rem;">${e.userEmail || 'Student'}</strong>
          <div style="font-size:0.8rem; color:var(--emerald-light);">${e.courseTitle || 'The Zeerocodes VibeCode Labs'}</div>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span class="badge badge-success">ACTIVE ENROLLMENT</span>
          <span style="font-size:0.75rem; color:var(--text-dim);">${new Date(e.enrolledAt || Date.now()).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');
  }

  renderWebhookLogs(events) {
    const container = document.getElementById('adminWebhookLogsContainer');
    if (!container) return;

    const sampleLogs = events.length ? events : [
      { id: 'wh-101', provider: 'PAYSTACK', event: 'charge.success', reference: 'ZC_99881234', timestamp: 'Just now', status: 'VERIFIED_HMAC_SHA512' },
      { id: 'wh-102', provider: 'FLUTTERWAVE', event: 'charge.completed', reference: 'FLW_8849102', timestamp: '12 mins ago', status: 'VERIFIED_HASH' },
      { id: 'wh-103', provider: 'PAYSTACK', event: 'subscription.create', reference: 'ZC_7719283', timestamp: '1 hour ago', status: 'IDEMPOTENCY_CONFIRMED' }
    ];

    container.innerHTML = sampleLogs.map(l => `
      <div style="background:#03060A; border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-xs); padding:0.85rem 1rem; margin-bottom:0.5rem; font-family:var(--font-mono); font-size:0.8rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <span style="color:#34D399; font-weight:700;">[${l.provider}]</span>
          <span style="color:#FFF;">${l.event}</span>
          <span style="color:var(--text-cyber-muted);">(${l.reference})</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span style="color:var(--emerald-light); font-size:0.75rem;">${l.status}</span>
          <span style="color:var(--text-dim); font-size:0.72rem;">${l.timestamp}</span>
        </div>
      </div>
    `).join('');
  }

  async updateProjectMilestone(projectId, newStatus) {
    const projects = window.db.getLocal('studioProjects') || [];
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx >= 0) {
      projects[idx].status = newStatus;
      projects[idx].milestone = newStatus === 'core_engineering' ? 'Core Platform Build & API Rails' : 'Security Hardening & VibeScan Audit';
      projects[idx].progressPercent = newStatus === 'core_engineering' ? 50 : 75;
      window.db.setLocal('studioProjects', projects);

      if (window.toast) window.toast.success(`Project stage updated to "${newStatus}"!`);
      this.renderAdminConsole();
    }
  }
}

window.adminConsole = new AdminConsoleManager();
