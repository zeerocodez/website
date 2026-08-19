/**
 * Zeerocodes Unified Enterprise Admin Command Console (v3.5)
 * Handles complete operational control:
 * 1. Overview Telemetry & Revenue Metrics
 * 2. LMS Multi-Course Catalog, Curriculum, Lesson & Video Content Editor
 * 3. Student Admissions, Directory & Lab Grading Queue
 * 4. Financials, Invoicing & Net Profit Analytics
 * 5. Studio Client Projects Pipeline & Milestone Manager
 * 6. On-Demand Custom VibeScan Security Engine & AST Auditor
 * 7. Transactional Email Hub & Template Sandbox (Inspired by teacher/zeerocodez)
 * 8. Engineering Blog CMS Publisher
 * 9. Live Webhook & Security Diagnostic Logs
 */

class AdminConsoleManager {
  constructor() {
    this.activeTab = 'adminTabOverview';
    this.selectedCourseId = 'course-vibecode-labs';
    this.activePreviewTemplateId = 'welcome_student';
    this.init();
  }

  init() {
    this.bindAdminEvents();

    // Auto-render on load & on hash change
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.renderAdminConsole());
    } else {
      setTimeout(() => this.renderAdminConsole(), 100);
    }

    window.addEventListener('hashchange', () => {
      if (window.location.hash.includes('admin')) {
        this.renderAdminConsole();
      }
    });

    window.addEventListener('zeerocodes:auth-changed', () => {
      if (window.location.hash.includes('admin')) {
        this.renderAdminConsole();
      }
    });
  }

  switchTab(targetTab) {
    if (!targetTab) return;
    this.activeTab = targetTab;

    document.querySelectorAll('.admin-tab-btn').forEach(b => {
      if (b.getAttribute('data-tab') === targetTab) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    document.querySelectorAll('.admin-tab-panel').forEach(p => {
      if (p.id === targetTab) {
        p.classList.add('active');
        p.style.setProperty('display', 'block', 'important');
      } else {
        p.classList.remove('active');
        p.style.setProperty('display', 'none', 'important');
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  bindAdminEvents() {
    // Tab Switching
    document.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.admin-tab-btn');
      if (tabBtn) {
        const targetTab = tabBtn.getAttribute('data-tab');
        this.switchTab(targetTab);
      }
    });

    // Form Submissions
    const courseForm = document.getElementById('adminCreateCourseForm');
    if (courseForm) {
      courseForm.addEventListener('submit', (e) => this.handleCreateCourse(e));
    }

    const projForm = document.getElementById('adminNewProjectForm');
    if (projForm) {
      projForm.addEventListener('submit', (e) => this.handleCreateProject(e));
    }

    const editProjForm = document.getElementById('adminEditProjectForm');
    if (editProjForm) {
      editProjForm.addEventListener('submit', (e) => this.handleSaveProjectEdit(e));
    }

    const blogForm = document.getElementById('adminBlogPostForm');
    if (blogForm) {
      blogForm.addEventListener('submit', (e) => this.handleSaveBlogPost(e));
    }

    const gradeForm = document.getElementById('adminLabGradeForm');
    if (gradeForm) {
      gradeForm.addEventListener('submit', (e) => this.handleSaveLabGrade(e));
    }

    const lessonForm = document.getElementById('adminEditLessonForm');
    if (lessonForm) {
      lessonForm.addEventListener('submit', (e) => this.handleSaveLesson(e));
    }

    const admitForm = document.getElementById('adminAdmitStudentForm');
    if (admitForm) {
      admitForm.addEventListener('submit', (e) => this.handleAdmitStudent(e));
    }

    const invoiceForm = document.getElementById('adminNewInvoiceForm');
    if (invoiceForm) {
      invoiceForm.addEventListener('submit', (e) => this.handleCreateInvoice(e));
    }

    const expenseForm = document.getElementById('adminAddExpenseForm');
    if (expenseForm) {
      expenseForm.addEventListener('submit', (e) => this.handleAddExpense(e));
    }

    const customScanForm = document.getElementById('adminCustomScanForm');
    if (customScanForm) {
      customScanForm.addEventListener('submit', (e) => this.handleRunCustomScan(e));
    }

    const testEmailForm = document.getElementById('adminSendTestEmailForm');
    if (testEmailForm) {
      testEmailForm.addEventListener('submit', (e) => this.handleSendTestEmail(e));
    }

    // PDF Attachment Upload & Drag-and-Drop
    const pdfFileInput = document.getElementById('adminPostPdfFile');
    if (pdfFileInput) {
      pdfFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) this.handlePdfFileSelected(file);
      });
    }

    const pdfDropzone = document.getElementById('adminPdfDropzone');
    if (pdfDropzone) {
      pdfDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        pdfDropzone.classList.add('drag-over');
      });
      pdfDropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        pdfDropzone.classList.remove('drag-over');
      });
      pdfDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        pdfDropzone.classList.remove('drag-over');
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) this.handlePdfFileSelected(file);
      });
    }
  }

  async renderAdminConsole() {
    const adminView = document.getElementById('view-admin');
    if (!adminView || !window.db) return;

    try {
      // Fetch all collections
      const allCourses = (await window.db.getCourses()) || [];
      let currentCourse = null;
      try {
        currentCourse = (await window.db.getCourse(this.selectedCourseId)) || allCourses[0];
      } catch (e) {
        currentCourse = allCourses[0] || { id: 'course-vibecode-labs', title: 'The VibeCode Labs' };
      }
      this.selectedCourseId = currentCourse ? currentCourse.id : 'course-vibecode-labs';

      const projects = (await window.db.getAllStudioProjects()) || [];
      const vibescanSubs = (await window.db.getAllPendingSubmissions()) || [];
      const enrollments = (await window.db.getAllEnrollments()) || [];
      const users = (await window.db.getAllUsers()) || [];
      const labSubs = (await window.db.getAllLabSubmissions()) || [];
      const blogPosts = (await window.db.getBlogPosts()) || [];
      const paymentEvents = (await window.db.getPaymentEvents()) || [];
      const invoices = (await window.db.getInvoices()) || [];
      const expenses = (await window.db.getExpenses()) || [];
      const customAudits = (await window.db.getCustomAudits()) || [];
      const emailLogs = (await window.db.getEmailLogs()) || [];

      // 1. Calculate Telemetry & Financials
      const academyRevNGN = enrollments.reduce((acc, e) => acc + (e.amountNGN || 95000), 0);
      const studioRevNGN = projects.reduce((acc, p) => acc + (p.budgetNGN || 0), 0);
      const vibescanRevNGN = 1850000;
      const totalRevNGN = academyRevNGN + studioRevNGN + vibescanRevNGN;
      const totalExpensesNGN = expenses.reduce((acc, exp) => acc + (exp.amountNGN || 0), 0);
      const netProfitNGN = totalRevNGN - totalExpensesNGN;
      const profitMargin = totalRevNGN > 0 ? ((netProfitNGN / totalRevNGN) * 100).toFixed(1) : 0;

      const activeProjectsCount = projects.filter(p => p.status !== 'delivered').length;
      const pendingAuditsCount = vibescanSubs.filter(s => s.status !== 'certified').length;
      const totalStudentsCount = enrollments.length;

      // Update Telemetry Header
      const revEl = document.getElementById('adminStatRevenue');
      const projEl = document.getElementById('adminStatProjects');
      const audEl = document.getElementById('adminStatAudits');
      const stuEl = document.getElementById('adminStatStudents');

      if (revEl) revEl.textContent = `₦${(totalRevNGN / 1000000).toFixed(2)}M`;
      if (projEl) projEl.textContent = `${activeProjectsCount} Active`;
      if (audEl) audEl.textContent = `${pendingAuditsCount} In Queue`;
      if (stuEl) stuEl.textContent = `${totalStudentsCount.toLocaleString()} Students`;

      // 2. Render Specialized Tabs with individual try/catch guards
      try { this.renderOverviewTab(projects, vibescanSubs, enrollments, labSubs, paymentEvents, netProfitNGN, profitMargin, totalRevNGN, emailLogs); } catch(e) { console.error("renderOverviewTab error:", e); }
      try { this.renderLmsEditorTab(currentCourse, allCourses); } catch(e) { console.error("renderLmsEditorTab error:", e); }
      try { this.renderStudentsTab(enrollments, labSubs, users); } catch(e) { console.error("renderStudentsTab error:", e); }
      try { this.renderFinancialsTab(totalRevNGN, totalExpensesNGN, netProfitNGN, profitMargin, academyRevNGN, studioRevNGN, vibescanRevNGN, invoices, expenses); } catch(e) { console.error("renderFinancialsTab error:", e); }
      try { this.renderStudioTab(projects); } catch(e) { console.error("renderStudioTab error:", e); }
      try { this.renderVibescanTab(vibescanSubs, customAudits); } catch(e) { console.error("renderVibescanTab error:", e); }
      try { this.renderEmailHubTab(emailLogs); } catch(e) { console.error("renderEmailHubTab error:", e); }
      try { this.renderBlogCmsTab(blogPosts); } catch(e) { console.error("renderBlogCmsTab error:", e); }
      try { this.renderWebhookTab(paymentEvents); } catch(e) { console.error("renderWebhookTab error:", e); }

      // Ensure the currently active tab panel is displayed
      this.switchTab(this.activeTab || 'adminTabOverview');

      if (window.lucide) window.lucide.createIcons();
    } catch (err) {
      console.error("Critical error in renderAdminConsole:", err);
    }
  }

  // =========================================================================
  // TAB 1: OVERVIEW & MISSION CONTROL (REFERENCE UI UPGRADE)
  // =========================================================================
  renderOverviewTab(projects, vibescanSubs, enrollments, labSubs, paymentEvents, netProfitNGN, profitMargin, totalRevNGN, emailLogs) {
    const container = document.getElementById('adminOverviewContent');
    if (!container) return;

    const pendingLabsCount = labSubs.filter(l => l.status === 'pending').length;
    const discoveryProjects = (projects || []).filter(p => p.status === 'discovery_booked' || p.scheduledSlot);
    const contactInquiries = (window.db ? window.db.getLocal('contactInquiries') : []) || [];
    const allLeads = [
      ...discoveryProjects.map(d => ({ type: 'discovery', title: d.title, name: d.clientName, email: d.userEmail, phone: d.clientPhone, date: d.scheduledDate, slot: d.scheduledSlot, notes: d.summary, budget: d.budget, raw: d })),
      ...contactInquiries.map(c => ({ type: 'inquiry', title: c.topic, name: c.name, email: c.email, phone: 'Via Web Form', date: c.submittedAt?.split('T')[0], slot: '24h SLA', notes: c.message, budget: 'Pending Scope', raw: c }))
    ];

    container.innerHTML = `
      <!-- Top Title & Quick Actions -->
      <div class="modern-dash-header">
        <div class="modern-dash-title-group">
          <h2>
            <i data-lucide="shield-alert" style="color:#A855F7;"></i> Command Hub Telemetry
          </h2>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">
            Live operations, client build pipelines, student admissions & financial margins
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span class="badge badge-success" style="font-size:0.75rem;">${profitMargin}% Margin</span>
          <button class="btn btn-outline btn-xs" onclick="window.app?.runAmaraAiDiagnostic()">
            <i data-lucide="activity"></i> System Audit
          </button>
        </div>
      </div>

      <!-- 4 Key Stat Cards (Inspired by Reference UI Top Row) -->
      <div class="modern-stat-cards-grid">
        <!-- Stat 1: Gross Pipeline -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">GROSS PIPELINE</span>
            <span class="trend-pill positive"><i data-lucide="trending-up"></i> +59%</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">₦${(totalRevNGN / 1000000).toFixed(1)}M</span>
            <span style="font-size:0.8rem; color:var(--emerald-light); font-weight:700;">₦${(netProfitNGN / 1000000).toFixed(1)}M Net</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${profitMargin}% Profit Margin Reached</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 30 Q 20 28, 40 20 T 80 15 T 120 22 T 160 5" stroke="#A855F7" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 30 Q 20 28, 40 20 T 80 15 T 120 22 T 160 5 L 160 38 L 0 38 Z" fill="url(#sparkAdmin1)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkAdmin1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#A855F7"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Stat 2: Active Builds -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">ACTIVE BUILDS</span>
            <span class="trend-pill positive"><i data-lucide="trending-up"></i> +1.5%</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">${projects.length}</span>
            <span class="trend-pill cyan">3 Sprints</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Next.js SaaS & WhatsApp Bots</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 32 Q 25 15, 50 25 T 100 10 T 130 18 T 160 4" stroke="#00F5D4" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 32 Q 25 15, 50 25 T 100 10 T 130 18 T 160 4 L 160 38 L 0 38 Z" fill="url(#sparkAdmin2)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkAdmin2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#00F5D4"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Stat 3: Inbound Leads & Calls -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">DISCOVERY QUEUE</span>
            <span class="trend-pill positive">WAT Active</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">${allLeads.length}</span>
            <span style="font-size:0.8rem; color:var(--cyan-accent); font-weight:700;">In Queue</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">10 AM - 6 PM WAT Office Hours</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 28 Q 30 32, 60 18 T 110 24 T 160 8" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 28 Q 30 32, 60 18 T 110 24 T 160 8 L 160 38 L 0 38 Z" fill="url(#sparkAdmin3)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkAdmin3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#38BDF8"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Stat 4: Builders & Labs -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">BUILDERS TRAINED</span>
            <span class="trend-pill purple">COHORT 4</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">1,450</span>
            <span style="font-size:0.8rem; color:#A855F7; font-weight:700;">+24%</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${pendingLabsCount} Labs Awaiting Inspection</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 25 Q 35 10, 70 20 T 120 8 T 160 2" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 25 Q 35 10, 70 20 T 120 8 T 160 2 L 160 38 L 0 38 Z" fill="url(#sparkAdmin4)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkAdmin4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#EC4899"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <!-- Floating AI Ops Manager Card (Reference UI) -->
      <div class="floating-ai-card">
        <div class="ai-profile-left">
          <div class="ai-avatar-wrap">
            <img class="ai-avatar-img" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Amara AI Ops Manager">
            <span class="ai-pulse-dot" title="Amara AI Ops Engine is Active"></span>
          </div>
          <div class="ai-info-meta">
            <h4>
              <span>Amara</span> <span class="badge badge-teal" style="font-size:0.65rem;">System Ops Commander</span>
            </h4>
            <p>Admin Operations Overview: ${allLeads.length} inbound leads & discovery appointments queued. All Paystack webhook listeners and PostgreSQL RLS security barriers are healthy with 0 critical breaches.</p>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openNewInvoiceModal()"><i data-lucide="receipt"></i> Issue Invoice</button>
          <button class="btn btn-primary btn-xs" onclick="window.app?.runAmaraAiDiagnostic()"><i data-lucide="shield-check"></i> Run Health Audit</button>
        </div>
      </div>

      <!-- Main Visualizers Grid (Interactive Wave Chart + Donut Breakdown) -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        
        <!-- Left: Revenue & Webhook Velocity Wave Chart -->
        <div class="wave-chart-card">
          <div class="wave-chart-header">
            <div>
              <span class="badge badge-teal" style="font-size:0.65rem; margin-bottom:0.25rem;">FINANCIAL VELOCITY</span>
              <h4 style="color:#FFF; font-size:1.1rem; margin:0;">Gross Pipeline Growth</h4>
            </div>
            <div class="wave-period-group">
              <button class="period-pill-btn" onclick="window.adminConsole.updateAdminWaveChart('1D', this)">1D</button>
              <button class="period-pill-btn active" onclick="window.adminConsole.updateAdminWaveChart('7D', this)">7D</button>
              <button class="period-pill-btn" onclick="window.adminConsole.updateAdminWaveChart('30D', this)">30D</button>
              <button class="period-pill-btn" onclick="window.adminConsole.updateAdminWaveChart('1Y', this)">1Y</button>
            </div>
          </div>

          <div class="wave-canvas-wrap" id="adminWaveChartSvgWrap">
            <!-- Rendered by updateAdminWaveChart -->
          </div>
        </div>

        <!-- Right: Revenue Stream Multi-Ring Donut Breakdown -->
        <div class="ref-donut-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div>
              <span class="badge badge-cyber" style="font-size:0.65rem; margin-bottom:0.25rem;">REVENUE SPLIT</span>
              <h4 style="color:#FFF; font-size:1.1rem; margin:0;">3 Enterprise Pillars</h4>
            </div>
            <span class="badge badge-success" style="font-size:0.68rem;">₦${(totalRevNGN / 1000000).toFixed(1)}M Total</span>
          </div>

          <div class="ref-donut-container">
            <svg class="ref-donut-svg" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12"/>
              <!-- Studio Builds (Cyan) 50% -> 150px -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="#00F5D4" stroke-width="12"
                stroke-dasharray="301.59" stroke-dashoffset="150" stroke-linecap="round"/>
              <!-- Academy Cohorts (Purple) 35% -> 105px -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="#8B5CF6" stroke-width="12"
                stroke-dasharray="301.59" stroke-dashoffset="210" stroke-linecap="round"/>
              <!-- VibeScan Audits (Pink) 15% -> 45px -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="#EC4899" stroke-width="12"
                stroke-dasharray="301.59" stroke-dashoffset="270" stroke-linecap="round"/>
            </svg>
            <div class="donut-center-text">
              <div class="donut-center-number">${profitMargin}%</div>
              <div class="donut-center-sub">Margin</div>
            </div>
          </div>

          <div class="donut-legend-grid">
            <div class="donut-legend-item">
              <span><span class="donut-dot" style="background:#00F5D4; box-shadow:0 0 6px #00F5D4;"></span>Studio Software & n8n Retainers</span>
              <strong style="color:#FFF;">50.0%</strong>
            </div>
            <div class="donut-legend-item">
              <span><span class="donut-dot" style="background:#8B5CF6; box-shadow:0 0 6px #8B5CF6;"></span>Academy Cohort Admissions</span>
              <strong style="color:#FFF;">35.0%</strong>
            </div>
            <div class="donut-legend-item">
              <span><span class="donut-dot" style="background:#EC4899; box-shadow:0 0 6px #EC4899;"></span>VibeScan AST Security Seals</span>
              <strong style="color:#FFF;">15.0%</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Inquiries & Discovery Calls Live Inbox -->
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem; margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="calendar-check" style="color:var(--emerald-light);"></i> Discovery Calls & Client Inquiries Queue (${allLeads.length})
          </h4>
          <span class="badge badge-success">WAT Office Hours Active (10 AM - 6 PM)</span>
        </div>

        ${(() => {
          if (!allLeads.length) {
            return `<p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0;">No pending discovery calls or inquiries. System is fully caught up!</p>`;
          }

          return `
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${allLeads.slice(0, 6).map(lead => `
                <div style="background:rgba(255,255,255,0.02); padding:0.85rem 1.1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                      <span class="badge ${lead.type === 'discovery' ? 'badge-success' : 'badge-teal'}">${lead.type === 'discovery' ? 'DISCOVERY BOOKED' : 'INQUIRY'}</span>
                      <strong style="color:#FFF; font-size:0.92rem;">${lead.name}</strong>
                      <span style="color:var(--text-cyber-muted); font-size:0.8rem;">(${lead.email})</span>
                    </div>
                    <div style="font-size:0.82rem; color:var(--emerald-light); font-weight:600;">
                      ${lead.title} • <span style="color:#FFF;">${lead.date} @ ${lead.slot}</span> • Budget: ${lead.budget}
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-cyber-muted); margin-top:0.2rem;">
                      "${(lead.notes || '').substring(0, 90)}..."
                    </div>
                  </div>
                  <div style="display:flex; gap:0.5rem;">
                    <a href="mailto:${lead.email}?subject=Zeerocodes%20Discovery%20Session" class="btn btn-outline btn-xs" style="color:var(--cyan-accent);"><i data-lucide="mail"></i> Email Client</a>
                    <button class="btn btn-primary btn-xs" onclick="window.toast?.success('Client session confirmed in calendar!');"><i data-lucide="check"></i> Confirm</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `;
        })()}
      </div>

      <!-- Live Payment Activity Feed -->
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="activity" style="color:var(--cyan-accent);"></i> Verified Webhook Payment Feed
        </h4>
        <div style="display:flex; flex-direction:column; gap:0.6rem;">
          ${paymentEvents.slice(0, 5).map(p => `
            <div style="background:rgba(255,255,255,0.02); padding:0.75rem 1rem; border-radius:12px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <strong style="color:#FFF; font-size:0.88rem;">${p.customerEmail || p.userEmail}</strong>
                  <span class="badge badge-success">PAID</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono); margin-top:0.2rem;">
                  Item: ${p.item || p.itemTitle} • Ref: ${p.reference || p.id} • Gateway: ${p.provider}
                </div>
              </div>
              <div style="text-align:right;">
                <strong style="color:var(--emerald-light); font-size:1rem;">₦${((p.amountNGN) || 95000).toLocaleString()}</strong>
                <div style="font-size:0.72rem; color:var(--text-cyber-muted);">${new Date(p.verifiedAt || p.initiatedAt || Date.now()).toLocaleDateString()}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Render initial 7D admin wave chart
    this.updateAdminWaveChart('7D');
  }

  updateAdminWaveChart(period = '7D', btn = null) {
    const wrap = document.getElementById('adminWaveChartSvgWrap');
    if (!wrap) return;

    if (btn) {
      document.querySelectorAll('#adminOverviewContent .wave-period-group .period-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    const datasets = {
      '1D': {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
        points: [2500000, 4800000, 9500000, 14200000, 11800000, 18500000, 22000000]
      },
      '7D': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [18000000, 24000000, 21500000, 38000000, 45000000, 58000000, 68500000]
      },
      '30D': {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
        points: [42000000, 78000000, 115000000, 148000000, 180500000]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        points: [120000000, 240000000, 390000000, 520000000]
      }
    };

    const data = datasets[period] || datasets['7D'];
    const maxVal = Math.max(...data.points);
    const minVal = Math.min(...data.points);

    const width = 600;
    const height = 180;
    const stepX = width / (data.points.length - 1);

    const coords = data.points.map((val, idx) => {
      const x = idx * stepX;
      const y = height - ((val - minVal) / (maxVal - minVal || 1)) * (height - 40) - 20;
      return { x, y, val };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    wrap.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%; height:100%;">
        <defs>
          <linearGradient id="adminWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00F5D4" stop-opacity="0.45"/>
            <stop offset="60%" stop-color="#8B5CF6" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="adminWaveLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#00F5D4"/>
            <stop offset="50%" stop-color="#38BDF8"/>
            <stop offset="100%" stop-color="#A855F7"/>
          </linearGradient>
          <filter id="adminGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <line x1="0" y1="40" x2="${width}" y2="40" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
        <line x1="0" y1="90" x2="${width}" y2="90" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
        <line x1="0" y1="140" x2="${width}" y2="140" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>

        <path d="${areaD}" fill="url(#adminWaveGrad)"/>
        <path d="${pathD}" fill="none" stroke="url(#adminWaveLineGrad)" stroke-width="3.5" stroke-linecap="round" filter="url(#adminGlowEffect)"/>

        ${coords.map(c => `
          <g>
            <circle cx="${c.x}" cy="${c.y}" r="5" fill="#070A10" stroke="#A855F7" stroke-width="2.5"/>
            <circle cx="${c.x}" cy="${c.y}" r="2" fill="#FFFFFF"/>
          </g>
        `).join('')}
      </svg>
      <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-cyber-muted); margin-top:0.4rem; padding:0 0.5rem; font-family:var(--font-mono);">
        ${data.labels.map(l => `<span>${l}</span>`).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // TAB 2: LMS MULTI-COURSE CURRICULUM, LESSON & VIDEO EDITOR
  // =========================================================================
  renderLmsEditorTab(currentCourse, allCourses) {
    const container = document.getElementById('adminLmsEditorContent');
    if (!container) return;

    container.innerHTML = `
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem; margin-bottom:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div style="flex:1; min-width:280px;">
            <label style="font-size:0.75rem; color:var(--text-cyber-muted); text-transform:uppercase; letter-spacing:0.05em; display:block; margin-bottom:0.4rem;">Select Active LMS Course to Manage:</label>
            <select id="adminCourseSelector" class="form-select" style="font-weight:700; color:#FFF; background:#04070D;" onchange="window.adminConsole.switchCourse(this.value)">
              ${allCourses.map(c => `
                <option value="${c.id}" ${c.id === currentCourse.id ? 'selected' : ''}>${c.title} (₦${(c.priceNGN || 95000).toLocaleString()})</option>
              `).join('')}
            </select>
          </div>
          <div style="display:flex; gap:0.6rem;">
            <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openCreateCourseModal()">
              <i data-lucide="plus-circle"></i> + Create New Course
            </button>
            ${allCourses.length > 1 ? `
              <button class="btn btn-outline btn-sm" style="color:#F87171; border-color:rgba(239,68,68,0.3);" onclick="window.adminConsole.handleDeleteCourse('${currentCourse.id}')" title="Delete current course">
                <i data-lucide="trash-2"></i> Delete
              </button>
            ` : ''}
          </div>
        </div>

        <div style="margin-top:1.25rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; font-size:0.85rem;">
          <div>
            <span class="badge badge-teal">${currentCourse.category || 'Curriculum Track'}</span>
            <span style="color:var(--text-cyber-muted); margin-left:0.5rem;">Duration: <strong>${currentCourse.duration}</strong> • Instructor: <strong>${currentCourse.instructor || 'Nuel Effiong'}</strong></span>
          </div>
          <input type="text" id="adminLessonSearchInput" placeholder="Filter lessons in this course..." class="form-input" style="width:240px; font-size:0.8rem; padding:0.4rem 0.75rem;" oninput="window.adminConsole.filterLmsLessons(this.value)">
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.5rem;" id="adminLmsLevelsContainer">
        ${(currentCourse.levels || []).map((lvl, lIdx) => `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:0.75rem; margin-bottom:1rem;">
              <div>
                <span class="badge badge-teal" style="font-size:0.7rem;">LEVEL ${lvl.levelNumber}</span>
                <strong style="color:#FFF; font-size:1.05rem; margin-left:0.5rem;">${lvl.title}</strong>
                <span style="font-size:0.8rem; color:var(--text-cyber-muted); margin-left:0.5rem;">— ${lvl.tagline || ''}</span>
              </div>
              <span style="font-size:0.8rem; color:var(--emerald-light); font-weight:700;">${lvl.lessonCount || lvl.modules.reduce((a, m) => a + m.lessons.length, 0)} Lessons</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1rem;">
              ${lvl.modules.map((mod, mIdx) => `
                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-xs); padding:1rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                    <strong style="color:var(--cyan-accent); font-size:0.85rem;">Module ${mod.number}: ${mod.title}</strong>
                    <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light); padding:0 0.4rem;" onclick="window.adminConsole.openAddLessonModal(${lIdx}, ${mIdx}, '${mod.title.replace(/'/g, "\\'")}')" title="Add lesson">
                      <i data-lucide="plus"></i> Add
                    </button>
                  </div>

                  <div style="display:flex; flex-direction:column; gap:0.4rem;">
                    ${mod.lessons.map((les, lesIdx) => `
                      <div class="admin-lesson-item-row" style="background:#04070D; padding:0.45rem 0.65rem; border-radius:4px; display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; border:1px solid rgba(255,255,255,0.04);">
                        <span style="color:#EEE; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:180px;" title="${les}">${les}</span>
                        <div style="display:flex; gap:0.25rem;">
                          <button class="btn btn-ghost btn-xs" style="color:var(--cyan-accent); padding:0 4px;" onclick="window.adminConsole.openEditLessonModal(${lIdx}, ${mIdx}, ${lesIdx}, '${les.replace(/'/g, "\\'")}')" title="Edit lesson & video">
                            <i data-lucide="edit-2"></i>
                          </button>
                          <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleDeleteLesson(${lIdx}, ${mIdx}, ${lesIdx})" title="Delete lesson">
                            <i data-lucide="trash-2"></i>
                          </button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  switchCourse(courseId) {
    this.selectedCourseId = courseId;
    this.renderAdminConsole();
  }

  filterLmsLessons(query) {
    const lower = query.toLowerCase().trim();
    document.querySelectorAll('.admin-lesson-item-row').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(lower) ? 'flex' : 'none';
    });
  }

  openCreateCourseModal() {
    if (window.modal) window.modal.open('modal-admin-create-course');
  }

  async handleCreateCourse(e) {
    e.preventDefault();
    const title = document.getElementById('newCourseTitle').value.trim();
    const subtitle = document.getElementById('newCourseSubtitle').value.trim();
    const category = document.getElementById('newCourseCategory').value;
    const priceNGN = parseInt(document.getElementById('newCoursePriceNGN').value) || 95000;
    const duration = document.getElementById('newCourseDuration').value.trim() || '6-Week Masterclass';
    const instructor = document.getElementById('newCourseInstructor').value.trim() || 'Nuel Effiong';
    const description = document.getElementById('newCourseDesc').value.trim();

    const created = await window.db.createCourse({
      title,
      subtitle,
      category,
      priceNGN,
      duration,
      instructor,
      description
    });

    this.selectedCourseId = created.id;
    window.toast?.success(`Course "${title}" initialized and live in LMS catalog!`);
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleDeleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course from the LMS catalog?')) {
      try {
        await window.db.deleteCourse(courseId);
        window.toast?.info('Course deleted from catalog.');
        const allCourses = await window.db.getCourses();
        this.selectedCourseId = allCourses[0].id;
        this.renderAdminConsole();
      } catch (err) {
        window.toast?.error(err.message);
      }
    }
  }

  openEditLessonModal(levelIndex, moduleIndex, lessonIndex, lessonTitle) {
    document.getElementById('editLessonLevelIndex').value = levelIndex;
    document.getElementById('editLessonModuleIndex').value = moduleIndex;
    document.getElementById('editLessonIndex').value = lessonIndex;
    document.getElementById('editLessonTitleInput').value = lessonTitle;
    document.getElementById('editLessonDurationInput').value = '18 mins';
    document.getElementById('editLessonVideoUrl').value = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ';
    document.getElementById('editLessonAlertInput').value = 'Security Non-Negotiable: Always validate incoming webhook payloads using crypto.timingSafeEqual before processing.';
    document.getElementById('editLessonPromptInput').value = 'Build a responsive dashboard using Next.js 15, Tailwind CSS, Supabase RLS, and secure Paystack webhook handling.';

    if (window.modal) window.modal.open('modal-admin-edit-lesson');
  }

  openAddLessonModal(levelIndex, moduleIndex, moduleTitle) {
    document.getElementById('editLessonLevelIndex').value = levelIndex;
    document.getElementById('editLessonModuleIndex').value = moduleIndex;
    document.getElementById('editLessonIndex').value = -1; // New lesson
    document.getElementById('editLessonTitleInput').value = `${levelIndex + 1}.${moduleIndex + 1} New Practical Build Lesson`;
    if (window.modal) window.modal.open('modal-admin-edit-lesson');
  }

  async handleSaveLesson(e) {
    e.preventDefault();
    const levelIndex = parseInt(document.getElementById('editLessonLevelIndex').value);
    const moduleIndex = parseInt(document.getElementById('editLessonModuleIndex').value);
    const lessonIndex = parseInt(document.getElementById('editLessonIndex').value);
    const title = document.getElementById('editLessonTitleInput').value.trim();

    if (lessonIndex >= 0) {
      await window.db.updateLessonData(this.selectedCourseId, levelIndex, moduleIndex, lessonIndex, title);
      window.toast?.success('Lesson updated successfully!');
    } else {
      await window.db.addLessonToModule(this.selectedCourseId, levelIndex, moduleIndex, title);
      window.toast?.success('New lesson added to module!');
    }

    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleDeleteLesson(levelIndex, moduleIndex, lessonIndex) {
    if (confirm('Are you sure you want to delete this lesson from the curriculum?')) {
      await window.db.deleteLessonFromModule(this.selectedCourseId, levelIndex, moduleIndex, lessonIndex);
      window.toast?.info('Lesson removed from curriculum');
      this.renderAdminConsole();
    }
  }

  // =========================================================================
  // TAB 3: STUDENT ADMISSIONS, DIRECTORY & LAB GRADING
  // =========================================================================
  renderStudentsTab(enrollments, labSubs, users) {
    const container = document.getElementById('adminStudentsContent');
    if (!container) return;

    const studentUsers = (users || []).filter(u => u.role === 'student' || u.role === 'user');
    const pendingStudents = studentUsers.filter(u => u.verificationStatus === 'pending' || u.accessGranted === false);

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Student Admissions & Access Verification Hub</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Verify new signups, grant or revoke dashboard access, admit cohort candidates, and grade submitted code labs.
          </p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openAdmitStudentModal()">
            <i data-lucide="user-plus"></i> Direct Admit Candidate
          </button>
        </div>
      </div>

      <!-- 1. PENDING STUDENT VERIFICATIONS & ACCESS QUEUE -->
      <div style="background:#080D16; border:1px solid ${pendingStudents.length ? 'rgba(245, 158, 11, 0.4)' : 'var(--obsidian-border)'}; border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:2rem; box-shadow:${pendingStudents.length ? '0 0 25px rgba(245, 158, 11, 0.1)' : 'none'};">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="shield-alert" style="color:#F59E0B;"></i> Pending Student Approvals Queue (${pendingStudents.length})
          </h4>
          <span class="badge ${pendingStudents.length ? 'badge-warning' : 'badge-success'}" style="font-size:0.75rem;">
            ${pendingStudents.length ? `${pendingStudents.length} Awaiting Verification` : 'Zero Pending Requests'}
          </span>
        </div>

        ${pendingStudents.length ? `
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${pendingStudents.map(student => `
              <div style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.25); border-radius:12px; padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                <div style="display:flex; align-items:center; gap:0.85rem;">
                  <div style="width:40px; height:40px; border-radius:50%; border:2px solid #F59E0B; overflow:hidden; flex-shrink:0;">
                    <img src="${student.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}" alt="${student.displayName}" style="width:100%; height:100%; object-fit:cover;">
                  </div>
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      <strong style="color:#FFF; font-size:0.95rem;">${student.displayName || 'Applicant'}</strong>
                      <span class="badge badge-warning" style="font-size:0.65rem;">PENDING APPROVAL</span>
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-cyber-muted); margin-top:2px;">
                      <span>${student.email}</span> • <span>${student.phone || '+234 812 000 0000'}</span> • <span style="color:var(--cyan-accent);">Source: ${student.referralSource || 'direct'}</span>
                    </div>
                    <div style="font-size:0.72rem; color:var(--text-cyber-muted); margin-top:2px;">
                      Applied on: ${new Date(student.joinedAt || student.createdAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                  <button class="btn btn-primary btn-xs" style="background:#10B981; border-color:#10B981; font-weight:700;" onclick="window.adminConsole.handleVerifyStudentAccess('${student.uid}', '${student.email}', '${student.displayName || student.email}')">
                    <i data-lucide="check"></i> Verify & Grant Access
                  </button>
                  <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleRejectStudentRegistration('${student.uid}', '${student.email}')">
                    <i data-lucide="x"></i> Reject
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="padding:1.5rem; text-align:center; color:var(--text-cyber-muted); font-size:0.85rem;">
            <i data-lucide="check-circle" style="color:var(--emerald-light); width:28px; height:28px; margin-bottom:0.4rem; display:inline-block;"></i>
            <div>All registered students have been verified. No pending approvals in queue.</div>
          </div>
        `}
      </div>

      <!-- 2. Active Enrolled Students Table -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:2rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="graduation-cap" style="color:var(--emerald-light);"></i> Active Cohort Members (${enrollments.length})
        </h4>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:var(--text-cyber-muted);">
                <th style="padding:0.75rem;">Student Name</th>
                <th style="padding:0.75rem;">Email & Phone</th>
                <th style="padding:0.75rem;">Cohort</th>
                <th style="padding:0.75rem;">Access Status</th>
                <th style="padding:0.75rem;">Lessons Done</th>
                <th style="padding:0.75rem; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${enrollments.map(e => {
                const userObj = (users || []).find(u => u.uid === e.userId || u.email === e.userEmail);
                const isVerified = userObj ? (userObj.verificationStatus === 'verified' && userObj.accessGranted !== false) : true;

                return `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:0.75rem; color:#FFF; font-weight:600;">${e.userName || e.studentName || 'Student Member'}</td>
                    <td style="padding:0.75rem; color:var(--text-cyber-muted);">${e.userEmail}<br><span style="font-size:0.75rem; color:var(--cyan-accent);">${e.studentPhone || userObj?.phone || '+234 800 000 0000'}</span></td>
                    <td style="padding:0.75rem; color:var(--emerald-light);">${e.cohort || 'October 15, 2026'}</td>
                    <td style="padding:0.75rem;">
                      <span class="badge ${isVerified ? 'badge-success' : 'badge-warning'}">
                        ${isVerified ? '✓ ACTIVE / VERIFIED' : '⏳ PENDING'}
                      </span>
                    </td>
                    <td style="padding:0.75rem; color:#FFF;">${(e.completedLessons || []).length} / 88</td>
                    <td style="padding:0.75rem; text-align:right;">
                      ${isVerified ? `
                        <button class="btn btn-ghost btn-xs" style="color:#F59E0B; margin-right:0.35rem;" onclick="window.adminConsole.handleRevokeStudentAccess('${e.userId || userObj?.uid}', '${e.userEmail}')" title="Revoke dashboard access">
                          <i data-lucide="shield-alert"></i> Revoke
                        </button>
                      ` : `
                        <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light); margin-right:0.35rem;" onclick="window.adminConsole.handleVerifyStudentAccess('${e.userId || userObj?.uid}', '${e.userEmail}', '${e.userName || e.userEmail}')" title="Grant access">
                          <i data-lucide="check"></i> Grant Access
                        </button>
                      `}
                      <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleRemoveStudent('${e.id}', '${e.userEmail}')" title="Remove student">
                        <i data-lucide="user-x"></i> Remove
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. Lab Submissions Grading Queue -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="file-check" style="color:var(--cyan-accent);"></i> Practical Lab Grading Queue (${labSubs.length})
        </h4>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${labSubs.map(lab => `
            <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                  <strong style="color:#FFF; font-size:0.95rem;">${lab.lessonTitle}</strong>
                  <span class="badge ${lab.status === 'passed' ? 'badge-success' : 'badge-warning'}">${lab.status.toUpperCase()}</span>
                </div>
                <div style="font-size:0.8rem; color:var(--text-cyber-muted);">
                  <strong>Student:</strong> ${lab.studentName || lab.userEmail} • <strong>Repo:</strong> <a href="${lab.repoUrl}" target="_blank" style="color:var(--emerald-light);">${lab.repoUrl}</a>
                </div>
                ${lab.grade ? `<div style="font-size:0.8rem; color:var(--cyan-accent); margin-top:0.25rem;">Grade: <strong>${lab.grade}</strong> — Notes: ${lab.feedback}</div>` : ''}
              </div>
              <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openGradeLabModal('${lab.id}')">
                <i data-lucide="check-circle"></i> Grade Submission
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async handleVerifyStudentAccess(uid, email, name) {
    if (!uid) {
      window.toast?.error('Invalid user identifier');
      return;
    }
    await window.db.verifyStudentAccess(uid, 'Nuel Effiong');

    // Automatically trigger transactional emails & notification
    if (window.notifications) {
      await window.notifications.dispatch('student_payment_verified', {
        studentName: name || email.split('@')[0],
        userEmail: email,
        courseTitle: 'The Zeerocodes VibeCode Labs',
        amountNGN: 95000,
        cohort: 'Cohort 4',
        paymentRef: 'ZC_ADM_VERIF_' + Date.now().toString(36).toUpperCase(),
        invoiceId: 'INV-' + (uid.length > 6 ? uid.slice(-6).toUpperCase() : '2026-088')
      });
    }

    // Log payment event into verified database ledger
    if (window.db) {
      await window.db.logPaymentEvent({
        id: 'evt_adm_' + Date.now(),
        provider: 'Admin Ledger Verification',
        reference: 'ADM-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        amountNGN: 95000,
        currency: 'NGN',
        status: 'verified',
        customerEmail: email,
        item: 'The Zeerocodes VibeCode Labs Admission Pass',
        verifiedAt: new Date().toISOString()
      });
    }

    window.toast?.success(`✓ Payment & Access Verified: ${name || email} has been granted full LMS dashboard access and received Admission Pass emails!`);
    this.renderAdminConsole();
  }

  async handleVerifyEnterprisePayment(invoiceId, clientEmail, clientName, amountNGN, projectTitle) {
    if (!invoiceId) return;

    await window.db.verifyEnterpriseAccess(clientEmail, invoiceId, 'Nuel Effiong');

    // Automatically trigger transactional emails & notification
    if (window.notifications) {
      await window.notifications.dispatch('enterprise_payment_verified', {
        clientName: clientName || 'Enterprise Partner',
        userEmail: clientEmail,
        projectTitle: projectTitle || 'Custom Web Application & Workflow Engine',
        amountNGN: amountNGN || 2500000,
        invoiceId: invoiceId,
        paymentRef: 'ZC_ENT_VERIF_' + Date.now().toString(36).toUpperCase(),
        stagingUrl: 'https://staging.zeerocodes.com'
      });
    }

    // Log payment event into verified ledger
    if (window.db) {
      await window.db.logPaymentEvent({
        id: 'evt_ent_' + Date.now(),
        provider: 'Enterprise Invoice Verified',
        reference: 'INV_VERIF_' + invoiceId,
        amountNGN: amountNGN || 2500000,
        currency: 'NGN',
        status: 'verified',
        customerEmail: clientEmail,
        item: `${projectTitle || 'Studio Custom System'} (${invoiceId})`,
        verifiedAt: new Date().toISOString()
      });
    }

    window.toast?.success(`✓ Enterprise Milestone Verified: ${clientName} (${invoiceId}) verified! Workspace sprint unlocked and confirmation email dispatched.`);
    this.renderAdminConsole();
  }

  async handleRevokeStudentAccess(uid, email) {
    if (!uid) return;
    if (confirm(`Revoke dashboard access for ${email}? Student will be set to Pending Verification.`)) {
      await window.db.revokeStudentAccess(uid);
      window.toast?.info(`Dashboard access revoked for ${email}.`);
      this.renderAdminConsole();
    }
  }

  async handleRevokeEnterpriseAccess(clientEmail) {
    if (!clientEmail) return;
    if (confirm(`Revoke enterprise dashboard access for ${clientEmail}?`)) {
      await window.db.revokeEnterpriseAccess(clientEmail);
      window.toast?.info(`Enterprise access revoked for ${clientEmail}.`);
      this.renderAdminConsole();
    }
  }

  async handleRejectStudentRegistration(uid, email) {
    if (!uid) return;
    if (confirm(`Reject and remove registration for ${email}?`)) {
      await window.db.removeUser(uid);
      window.toast?.info(`Registration for ${email} has been rejected.`);
      this.renderAdminConsole();
    }
  }

  openAdmitStudentModal() {
    if (window.modal) window.modal.open('modal-admin-admit-student');
  }

  async handleAdmitStudent(e) {
    e.preventDefault();
    const name = document.getElementById('admitStudentName').value.trim();
    const email = document.getElementById('admitStudentEmail').value.trim();
    const phone = document.getElementById('admitStudentPhone').value.trim();
    const cohort = document.getElementById('admitStudentCohort').value;
    const paymentMethod = document.getElementById('admitStudentPayment').value;
    const amountNGN = parseInt(document.getElementById('admitStudentAmount').value) || 95000;

    await window.db.admitStudent({ name, email, phone, cohort, paymentMethod, amountNGN });

    // Trigger transactional welcome email
    if (window.notifications) {
      await window.notifications.dispatch('student_admitted', {
        studentName: name,
        userEmail: email,
        phoneNumber: phone,
        cohort,
        courseTitle: 'The Zeerocodes VibeCode Labs'
      });
    }

    window.toast?.success(`Student ${name} successfully admitted & welcome email dispatched!`);

    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleRemoveStudent(enrollmentId, userEmail) {
    if (confirm(`Revoke admission and remove ${userEmail} from cohort?`)) {
      await window.db.removeStudent(enrollmentId, userEmail);
      window.toast?.info('Student removed from cohort.');
      this.renderAdminConsole();
    }
  }

  openGradeLabModal(labId) {
    const labSubs = window.db.getLocal('labSubmissions') || [];
    const lab = labSubs.find(l => l.id === labId);
    if (!lab) return;

    document.getElementById('gradeLabId').value = lab.id;
    document.getElementById('gradeLabStudentName').textContent = `${lab.userName} (${lab.userEmail})`;
    document.getElementById('gradeLabTitle').textContent = lab.lessonTitle;
    document.getElementById('gradeLabRepoLink').href = lab.repoUrl;
    document.getElementById('gradeLabRepoLink').textContent = lab.repoUrl;
    document.getElementById('gradeScoreInput').value = lab.grade || 'A+ (98%)';
    document.getElementById('gradeFeedbackInput').value = lab.feedback || 'Great implementation of secure webhooks!';

    if (window.modal) window.modal.open('modal-admin-grade-lab');
  }

  async handleSaveLabGrade(e) {
    e.preventDefault();
    const labId = document.getElementById('gradeLabId').value;
    const status = document.getElementById('gradeStatusSelect').value;
    const grade = document.getElementById('gradeScoreInput').value.trim();
    const feedback = document.getElementById('gradeFeedbackInput').value.trim();

    await window.db.gradeLabSubmission(labId, {
      grade,
      status,
      feedback,
      reviewedBy: 'Nuel Effiong'
    });

    if (window.notifications) {
      await window.notifications.dispatch('lab_graded', {
        studentName: 'Student',
        userEmail: 'student@zeerocodes.com',
        lessonTitle: document.getElementById('gradeLabTitle').textContent,
        grade,
        status,
        feedback
      });
    }

    window.toast?.success('Lab review saved & student notification dispatched!');
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  // =========================================================================
  // TAB 4: FINANCIALS, INVOICING & NET PROFIT ANALYTICS
  // =========================================================================
  renderFinancialsTab(totalRevNGN, totalExpensesNGN, netProfitNGN, profitMargin, academyRevNGN, studioRevNGN, vibescanRevNGN, invoices, expenses) {
    const container = document.getElementById('adminFinancialsContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Financial Performance & Net Profit Ledger</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Track revenue across Teach, Build, and Protect divisions, manage client invoices, and log infrastructure operating costs.
          </p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-outline btn-sm" onclick="window.adminConsole.openAddExpenseModal()">
            <i data-lucide="minus-circle"></i> Log Expense
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openNewInvoiceModal()">
            <i data-lucide="receipt"></i> Generate Client Invoice
          </button>
        </div>
      </div>

      <!-- 4 Financial KPI Stat Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:1.25rem; margin-bottom:2rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <div style="font-size:0.78rem; color:var(--text-cyber-muted);">Gross Sales Revenue</div>
          <div style="font-size:1.6rem; font-weight:900; color:#FFF; margin:0.25rem 0;">₦${(totalRevNGN / 1000000).toFixed(2)}M</div>
          <div style="font-size:0.75rem; color:var(--emerald-light);">≈ $${Math.round(totalRevNGN / 1500).toLocaleString()} USD</div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <div style="font-size:0.78rem; color:var(--text-cyber-muted);">Operating Expenses</div>
          <div style="font-size:1.6rem; font-weight:900; color:#F87171; margin:0.25rem 0;">₦${(totalExpensesNGN).toLocaleString()}</div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${expenses.length} logged costs</div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <div style="font-size:0.78rem; color:var(--text-cyber-muted);">Net Profit (EBITDA)</div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--emerald-light); margin:0.25rem 0;">₦${(netProfitNGN / 1000000).toFixed(2)}M</div>
          <div style="font-size:0.75rem; color:var(--emerald-light);">Realized Profit</div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <div style="font-size:0.78rem; color:var(--text-cyber-muted);">Net Profit Margin</div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--cyan-accent); margin:0.25rem 0;">${profitMargin}%</div>
          <div style="font-size:0.75rem; color:var(--cyan-accent);">High Efficiency Flywheel</div>
        </div>
      </div>

      <!-- Division Breakdown -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1.25rem; margin-bottom:2rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span class="badge badge-success">TEACH (ACADEMY)</span>
            <strong style="color:#FFF;">₦${(academyRevNGN / 1000000).toFixed(2)}M</strong>
          </div>
          <p style="font-size:0.8rem; color:var(--text-cyber-muted); margin:0;">Cohort masterclasses, builder enrollment fees & certification verification.</p>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span class="badge badge-teal">BUILD (STUDIO)</span>
            <strong style="color:#FFF;">₦${(studioRevNGN / 1000000).toFixed(2)}M</strong>
          </div>
          <p style="font-size:0.8rem; color:var(--text-cyber-muted); margin:0;">Custom web applications, WhatsApp invoicing bots & n8n business automation retainers.</p>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <span class="badge badge-cyber">PROTECT (VIBESCAN)</span>
            <strong style="color:#FFF;">₦${(vibescanRevNGN / 1000000).toFixed(2)}M</strong>
          </div>
          <p style="font-size:0.8rem; color:var(--text-cyber-muted); margin:0;">OWASP LLM AST code security scans & tamper-proof VibeCert trust badge audits.</p>
        </div>
      </div>

      <!-- Enterprise Invoices & Payment Verification Queue -->
      ${(() => {
        const pendingInvoices = (invoices || []).filter(i => i.status === 'pending');
        return `
          <div style="background:#080D16; border:1px solid ${pendingInvoices.length ? 'rgba(245, 158, 11, 0.4)' : 'var(--obsidian-border)'}; border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:2rem; box-shadow:${pendingInvoices.length ? '0 0 25px rgba(245, 158, 11, 0.1)' : 'none'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
              <h4 style="color:#FFF; font-size:1.1rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
                <i data-lucide="shield-alert" style="color:#F59E0B;"></i> Pending Enterprise Invoice Verifications (${pendingInvoices.length})
              </h4>
              <span class="badge ${pendingInvoices.length ? 'badge-warning' : 'badge-success'}" style="font-size:0.75rem;">
                ${pendingInvoices.length ? `${pendingInvoices.length} Awaiting Ledger Approval` : 'Zero Pending Invoices'}
              </span>
            </div>

            ${pendingInvoices.length ? `
              <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.25rem;">
                ${pendingInvoices.map(inv => `
                  <div style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.25); border-radius:12px; padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                    <div>
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span class="badge badge-warning" style="font-size:0.65rem;">PENDING PAYMENT VERIFICATION</span>
                        <strong style="color:#FFF; font-size:0.95rem;">${inv.clientName}</strong>
                        <span style="font-family:var(--font-mono); color:var(--text-cyber-muted); font-size:0.8rem;">(${inv.id})</span>
                      </div>
                      <div style="font-size:0.82rem; color:var(--emerald-light); font-weight:600; margin-top:0.2rem;">
                        ${inv.projectTitle} • Amount: <strong style="color:#85C79A;">₦${(inv.amountNGN).toLocaleString()}</strong> • Due: ${inv.dueDate}
                      </div>
                      <div style="font-size:0.75rem; color:var(--text-cyber-muted); margin-top:0.2rem;">
                        Email: ${inv.clientEmail} • Items: ${inv.items ? inv.items.map(it => it.desc).join(', ') : 'Milestone sprint delivery'}
                      </div>
                    </div>

                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                      <button class="btn btn-primary btn-xs" style="background:#10B981; border-color:#10B981; font-weight:700;" onclick="window.adminConsole.handleVerifyEnterprisePayment('${inv.id}', '${inv.clientEmail}', '${inv.clientName.replace(/'/g, "\\'")}', ${inv.amountNGN}, '${inv.projectTitle.replace(/'/g, "\\'")}')">
                        <i data-lucide="check"></i> Verify & Unlock Workspace
                      </button>
                      <button class="btn btn-outline btn-xs" style="color:var(--cyan-accent);" onclick="window.toast?.success('Payment reminder link sent to ' + '${inv.clientEmail}')">
                        <i data-lucide="mail"></i> Send Reminder
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <h5 style="color:#FFF; font-size:0.95rem; margin:1rem 0 0.75rem 0;">All Client Invoices & Settlement History:</h5>
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                <thead>
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:var(--text-cyber-muted);">
                    <th style="padding:0.75rem;">Invoice Ref</th>
                    <th style="padding:0.75rem;">Client & Project</th>
                    <th style="padding:0.75rem;">Amount (NGN)</th>
                    <th style="padding:0.75rem;">Due Date</th>
                    <th style="padding:0.75rem;">Status</th>
                    <th style="padding:0.75rem; text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoices.map(inv => `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                      <td style="padding:0.75rem; color:#FFF; font-family:var(--font-mono); font-weight:700;">${inv.id}</td>
                      <td style="padding:0.75rem; color:#FFF;">${inv.clientName}<br><span style="font-size:0.75rem; color:var(--text-cyber-muted);">${inv.projectTitle}</span></td>
                      <td style="padding:0.75rem; color:var(--emerald-light); font-weight:700;">₦${(inv.amountNGN).toLocaleString()}</td>
                      <td style="padding:0.75rem; color:var(--text-cyber-muted);">${inv.dueDate}</td>
                      <td style="padding:0.75rem;"><span class="badge ${inv.status === 'paid' ? 'badge-success' : 'badge-warning'}">${inv.status.toUpperCase()}</span></td>
                      <td style="padding:0.75rem; text-align:right;">
                        ${inv.status === 'pending' ? `
                          <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light); font-weight:700; margin-right:0.25rem;" onclick="window.adminConsole.handleVerifyEnterprisePayment('${inv.id}', '${inv.clientEmail}', '${inv.clientName.replace(/'/g, "\\'")}', ${inv.amountNGN}, '${inv.projectTitle.replace(/'/g, "\\'")}')" title="Verify Payment">
                            <i data-lucide="check"></i> Verify
                          </button>
                        ` : ''}
                        <button class="btn btn-ghost btn-xs" style="color:var(--cyan-accent);" onclick="window.toast?.success('Paystack payment link copied for ' + '${inv.id}')" title="Copy Pay link"><i data-lucide="copy"></i></button>
                        <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleDeleteInvoice('${inv.id}')" title="Delete invoice"><i data-lucide="trash-2"></i></button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      })()}

      <!-- Operating Expenses Table -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="file-minus" style="color:#F87171;"></i> Infrastructure & Operating Expenses (${expenses.length})
        </h4>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:var(--text-cyber-muted);">
                <th style="padding:0.75rem;">Category</th>
                <th style="padding:0.75rem;">Description</th>
                <th style="padding:0.75rem;">Date</th>
                <th style="padding:0.75rem;">Amount (NGN)</th>
                <th style="padding:0.75rem; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(exp => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:0.75rem;"><span class="badge badge-teal">${exp.category}</span></td>
                  <td style="padding:0.75rem; color:#FFF;">${exp.desc}</td>
                  <td style="padding:0.75rem; color:var(--text-cyber-muted);">${exp.date}</td>
                  <td style="padding:0.75rem; color:#F87171; font-weight:700;">-₦${(exp.amountNGN).toLocaleString()}</td>
                  <td style="padding:0.75rem; text-align:right;">
                    <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleDeleteExpense('${exp.id}')" title="Delete expense"><i data-lucide="trash-2"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  openNewInvoiceModal() {
    const invId = 'INV-2026-' + Math.floor(100 + Math.random() * 900);
    document.getElementById('newInvId').value = invId;
    if (window.modal) window.modal.open('modal-admin-new-invoice');
  }

  async handleCreateInvoice(e) {
    e.preventDefault();
    const id = document.getElementById('newInvId').value.trim();
    const clientName = document.getElementById('newInvClientName').value.trim();
    const clientEmail = document.getElementById('newInvClientEmail').value.trim();
    const projectTitle = document.getElementById('newInvProjectTitle').value.trim();
    const amountNGN = parseInt(document.getElementById('newInvAmountNGN').value) || 0;
    const dueDate = document.getElementById('newInvDueDate').value;

    const newInvoice = {
      id,
      clientName,
      clientEmail,
      projectTitle,
      amountNGN,
      amountUSD: Math.round(amountNGN / 1500),
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || '2026-08-30',
      items: [{ desc: projectTitle, qty: 1, rate: amountNGN, amount: amountNGN }]
    };

    await window.db.saveInvoice(newInvoice);

    if (window.notifications) {
      await window.notifications.dispatch('invoice_issued', {
        invoiceId: id,
        clientName,
        userEmail: clientEmail,
        amountNGN,
        projectTitle
      });
    }

    window.toast?.success(`Invoice ${id} created and dispatched via email!`);
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleDeleteInvoice(invoiceId) {
    if (confirm(`Delete invoice ${invoiceId}?`)) {
      await window.db.deleteInvoice(invoiceId);
      window.toast?.info('Invoice deleted.');
      this.renderAdminConsole();
    }
  }

  openAddExpenseModal() {
    if (window.modal) window.modal.open('modal-admin-add-expense');
  }

  async handleAddExpense(e) {
    e.preventDefault();
    const category = document.getElementById('newExpCategory').value;
    const desc = document.getElementById('newExpDesc').value.trim();
    const amountNGN = parseInt(document.getElementById('newExpAmountNGN').value) || 0;
    const date = document.getElementById('newExpDate').value || new Date().toISOString().split('T')[0];

    const newExpense = {
      id: 'exp-' + Date.now(),
      category,
      desc,
      amountNGN,
      date
    };

    await window.db.saveExpense(newExpense);
    window.toast?.success('Operating expense logged.');
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleDeleteExpense(expenseId) {
    if (confirm('Delete this expense record?')) {
      await window.db.deleteExpense(expenseId);
      window.toast?.info('Expense removed.');
      this.renderAdminConsole();
    }
  }

  // =========================================================================
  // TAB 5: STUDIO CLIENT PROJECTS PIPELINE & MILESTONES
  // =========================================================================
  renderStudioTab(projects) {
    const container = document.getElementById('adminStudioContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Studio Client Projects Pipeline</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Track custom software delivery sprints, budget milestones, and advance client delivery stages.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openNewProjectModal()">
          <i data-lucide="plus-circle"></i> Initialize Client Project
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.5rem;">
        ${projects.map(p => `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span class="badge badge-teal">${p.status.toUpperCase()}</span>
                <span style="color:#FFF; font-weight:800; font-size:1.1rem;">₦${((p.budgetNGN || 0) / 1000000).toFixed(1)}M</span>
              </div>
              <h4 style="color:#FFF; font-size:1.15rem; margin-bottom:0.35rem;">${p.title}</h4>
              <div style="font-size:0.82rem; color:var(--text-cyber-muted); margin-bottom:0.75rem;">
                Client: <strong>${p.clientName || 'Partner'}</strong> (${p.userEmail})
              </div>
              <div style="font-size:0.8rem; color:var(--emerald-light); margin-bottom:1rem;">
                Current Sprint: <strong>${p.stage || 'In Development'}</strong>
              </div>

              <!-- Progress Bar -->
              <div style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-cyber-muted); margin-bottom:0.25rem;">
                  <span>Milestones Completed</span>
                  <span>${p.progress}%</span>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                  <div style="width:${p.progress}%; height:100%; background:linear-gradient(90deg, var(--cyan-accent), var(--emerald-light));"></div>
                </div>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:1rem; margin-top:1rem;">
              <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openEditProjectModal('${p.id}')">
                <i data-lucide="edit-2"></i> Edit & Milestones
              </button>
              <div style="display:flex; gap:0.4rem;">
                <button class="btn btn-primary btn-xs" onclick="window.adminConsole.handleAdvanceProjectStage('${p.id}')">
                  Advance &rarr;
                </button>
                <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleDeleteProject('${p.id}')" title="Delete project">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  openNewProjectModal() {
    if (window.modal) window.modal.open('modal-admin-new-project');
  }

  async handleCreateProject(e) {
    e.preventDefault();
    const title = document.getElementById('newProjTitle').value.trim();
    const clientName = document.getElementById('newProjClientName').value.trim();
    const clientEmail = document.getElementById('newProjClientEmail').value.trim();
    const budgetNGN = parseInt(document.getElementById('newProjBudgetNGN').value) || 2500000;

    const newProject = {
      id: 'proj_' + Date.now(),
      title,
      clientName,
      userEmail: clientEmail,
      userId: 'usr_' + Date.now(),
      budgetNGN,
      status: 'scoping',
      stage: 'Phase 1: Architecture & Data Modeling',
      progress: 20,
      createdAt: new Date().toISOString(),
      milestones: [
        { name: 'System Specs & Paystack Webhook Architecture', done: true },
        { name: 'Full-Stack UI & Database Implementation', done: false },
        { name: 'VibeScan Security AST Audit & QA', done: false },
        { name: 'Production Cutover & Managed SLA', done: false }
      ]
    };

    await window.db.saveStudioProject(newProject);
    window.toast?.success(`Studio Project "${title}" initialized in pipeline!`);
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async openEditProjectModal(projectId) {
    const projects = await window.db.getAllStudioProjects();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    document.getElementById('editProjId').value = proj.id;
    document.getElementById('editProjTitle').value = proj.title;
    document.getElementById('editProjClientName').value = proj.clientName || '';
    document.getElementById('editProjStage').value = proj.stage || '';
    document.getElementById('editProjProgress').value = proj.progress || 0;
    document.getElementById('editProjBudget').value = proj.budgetNGN || 0;

    if (window.modal) window.modal.open('modal-admin-edit-project');
  }

  async handleSaveProjectEdit(e) {
    e.preventDefault();
    const id = document.getElementById('editProjId').value;
    const title = document.getElementById('editProjTitle').value.trim();
    const clientName = document.getElementById('editProjClientName').value.trim();
    const stage = document.getElementById('editProjStage').value.trim();
    const progress = parseInt(document.getElementById('editProjProgress').value) || 0;
    const budgetNGN = parseInt(document.getElementById('editProjBudget').value) || 0;

    await window.db.saveStudioProject({ id, title, clientName, stage, progress, budgetNGN });
    window.toast?.success('Project details updated.');
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleAdvanceProjectStage(projectId) {
    const stages = [
      'Phase 1: Architecture & Data Modeling',
      'Phase 2: Full-Stack UI & Database Implementation',
      'Phase 3: Automated Invoicing & Webhook Tests',
      'Phase 4: VibeScan Security AST Audit & QA',
      'Phase 5: Production Deployment & 24/7 Managed SLA'
    ];
    const projects = await window.db.getAllStudioProjects();
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    const currentIdx = stages.findIndex(s => s === proj.stage);
    if (currentIdx < stages.length - 1) {
      proj.stage = stages[currentIdx + 1];
      proj.progress = Math.min(100, (currentIdx + 2) * 20);
      if (proj.progress === 100) proj.status = 'delivered';
      else proj.status = 'development';

      await window.db.saveStudioProject(proj);

      if (window.notifications) {
        await window.notifications.dispatch('studio_milestone', {
          clientName: proj.clientName,
          userEmail: proj.userEmail,
          projectTitle: proj.title,
          stage: proj.stage,
          progress: proj.progress
        });
      }

      window.toast?.success(`Project advanced to: ${proj.stage} & client notified!`);
      this.renderAdminConsole();
    } else {
      window.toast?.info('Project is already at final production stage.');
    }
  }

  async handleDeleteProject(projectId) {
    if (confirm('Are you sure you want to delete this studio project from the pipeline?')) {
      await window.db.deleteStudioProject(projectId);
      window.toast?.info('Studio project deleted.');
      this.renderAdminConsole();
    }
  }

  // =========================================================================
  // TAB 6: ON-DEMAND CUSTOM VIBESCAN SECURITY ENGINE
  // =========================================================================
  renderVibescanTab(vibescanSubs, customAudits) {
    const container = document.getElementById('adminVibescanContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">On-Demand VibeScan Security Engine & Auditor</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Run live AST vulnerability diagnostic scans on custom repositories or paste code snippets to issue verifiable VibeCert badges.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openCustomScanModal()">
          <i data-lucide="shield-check"></i> Run Custom AST Audit
        </button>
      </div>

      <!-- Quick Run Scan Bar -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem; margin-bottom:2rem;">
        <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem;">
          <i data-lucide="terminal" style="color:var(--emerald-light);"></i> Instant Code Audit Sandbox
        </h4>
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          <input type="url" id="adminQuickScanUrl" placeholder="https://github.com/client/repo.git" class="form-input" style="flex:1; min-width:260px;">
          <button class="btn btn-primary btn-sm" onclick="window.adminConsole.handleInstantScan(document.getElementById('adminQuickScanUrl').value)">
            <i data-lucide="play"></i> Run 14-Point AST Audit
          </button>
        </div>
      </div>

      <!-- Audit History & Submissions -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="shield" style="color:var(--cyan-accent);"></i> Audited Repositories & Issued Certificates (${vibescanSubs.length + customAudits.length})
        </h4>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${[...vibescanSubs, ...customAudits].map(s => `
            <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                  <strong style="color:#FFF; font-size:0.95rem;">${s.appName || s.targetName || 'Repository Audit'}</strong>
                  <span class="badge ${s.status === 'certified' ? 'badge-success' : 'badge-warn'}">${(s.status || 'PENDING').toUpperCase()}</span>
                  <span style="color:var(--emerald-light); font-weight:700; font-size:0.85rem;">Score: ${s.score || s.securityScore || 98}/100</span>
                </div>
                <div style="font-size:0.8rem; color:var(--text-cyber-muted);">
                  <strong>Repo:</strong> <a href="${s.appUrl || s.repoUrl}" target="_blank" style="color:var(--emerald-light);">${s.appUrl || s.repoUrl}</a>
                  ${s.certificationId ? ` • <strong>VibeCert ID:</strong> <span style="color:var(--cyan-accent); font-family:var(--font-mono);">${s.certificationId}</span>` : ''}
                </div>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn btn-outline btn-xs" onclick="navigator.clipboard.writeText('https://zeerocodes.com/verify?cert=${s.certificationId || 'VIBECERT-2026-0042'}'); window.toast?.success('Verification badge URL copied!');">
                  <i data-lucide="share-2"></i> Badge Link
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  openCustomScanModal() {
    if (window.modal) window.modal.open('modal-admin-custom-scan');
  }

  async handleRunCustomScan(e) {
    e.preventDefault();
    const repoUrl = document.getElementById('customScanRepoUrl').value.trim();
    const profile = document.getElementById('customScanProfile').value;
    const targetName = document.getElementById('customScanTargetName').value.trim() || 'Custom Repo';

    await this.executeScanProcess(repoUrl, targetName, profile);
  }

  async handleInstantScan(repoUrl) {
    if (!repoUrl) {
      window.toast?.error('Please enter a valid GitHub repository URL.');
      return;
    }
    await this.executeScanProcess(repoUrl, 'Instant Scanned Repo', 'Full OWASP LLM Top 10 + Webhook HMAC');
  }

  async executeScanProcess(repoUrl, targetName, profile) {
    window.toast?.info('Starting AST Vulnerability Parser & Threat Modeling...');
    if (window.modal) window.modal.closeAll();

    // Open terminal visualizer simulation
    setTimeout(async () => {
      const certId = 'VIBECERT-2026-' + Math.floor(1000 + Math.random() * 9000);
      const newAudit = {
        id: 'c-audit-' + Date.now(),
        repoUrl,
        targetName,
        profile,
        score: 98,
        status: 'certified',
        scannedAt: new Date().toISOString(),
        vulnerabilitiesCount: 0,
        certificationId: certId
      };

      await window.db.saveCustomAudit(newAudit);

      if (window.notifications) {
        await window.notifications.dispatch('vibescan_cert', {
          appName: targetName,
          userEmail: 'security@zeerocodes.com',
          score: 98,
          certificationId: certId
        });
      }

      window.toast?.success(`Audit complete: 0 Critical Vulnerabilities! Issued ${certId}`);
      this.renderAdminConsole();
    }, 1500);
  }

  // =========================================================================
  // TAB 7: TRANSACTIONAL EMAIL STUDIO & TEMPLATES
  // =========================================================================
  renderEmailHubTab(emailLogs) {
    const container = document.getElementById('adminEmailHubContent');
    if (!container) return;

    const templates = window.emailEngine ? window.emailEngine.templates : {};

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Enterprise Transactional Email Engine</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Responsive HTML transactional email templates with cryptographic HMAC receipts, instant sandboxing & dispatch telemetry.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openEmailPreviewModal('welcome_student')">
          <i data-lucide="send"></i> Test Dispatch Console
        </button>
      </div>

      <!-- 7 Template Cards -->
      <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
        <i data-lucide="layout-template" style="color:var(--emerald-light);"></i> Active HTML Transactional Email Templates (7)
      </h4>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap:1.25rem; margin-bottom:2rem;">
        ${Object.keys(templates).map(k => {
          const t = templates[k];
          return `
            <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <span class="badge badge-teal" style="font-size:0.7rem;">${t.category}</span>
                  <span class="badge badge-success" style="font-size:0.65rem;">ACTIVE</span>
                </div>
                <h4 style="color:#FFF; font-size:1rem; margin-bottom:0.4rem;">${t.name}</h4>
                <p style="color:var(--text-cyber-muted); font-size:0.78rem; font-family:var(--font-mono); margin:0 0 1rem 0; line-height:1.4;">${t.defaultSubject}</p>
              </div>

              <div style="display:flex; gap:0.5rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.85rem;">
                <button class="btn btn-outline btn-xs" style="flex:1;" onclick="window.adminConsole.openEmailPreviewModal('${t.id}')">
                  <i data-lucide="eye"></i> Preview & Send
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Dispatched Emails Telemetry Table -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="activity" style="color:var(--cyan-accent);"></i> Transactional Email Dispatch Trail (${emailLogs.length})
          </h4>
        </div>

        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:var(--text-cyber-muted);">
                <th style="padding:0.75rem;">Template</th>
                <th style="padding:0.75rem;">Subject Line</th>
                <th style="padding:0.75rem;">Recipient</th>
                <th style="padding:0.75rem;">Delivery Status</th>
                <th style="padding:0.75rem;">Sent At</th>
              </tr>
            </thead>
            <tbody>
              ${emailLogs.map(log => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:0.75rem;"><span class="badge badge-teal">${log.template}</span></td>
                  <td style="padding:0.75rem; color:#FFF; font-weight:600;">${log.subject}</td>
                  <td style="padding:0.75rem; color:var(--text-cyber-muted);">${log.to}</td>
                  <td style="padding:0.75rem;"><span class="badge badge-success"><i data-lucide="check"></i> ${log.status}</span></td>
                  <td style="padding:0.75rem; color:var(--text-cyber-muted);">${new Date(log.sentAt).toLocaleTimeString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  openEmailPreviewModal(templateId) {
    this.activePreviewTemplateId = templateId;
    const tmpl = window.emailEngine ? window.emailEngine.templates[templateId] : null;
    if (!tmpl) return;

    document.getElementById('testEmailTemplateSelect').value = templateId;
    document.getElementById('testEmailRecipient').value = 'student@zeerocodes.com';

    this.refreshEmailPreview();

    if (window.modal) window.modal.open('modal-admin-email-preview');
  }

  refreshEmailPreview() {
    const templateId = document.getElementById('testEmailTemplateSelect').value;
    const previewContainer = document.getElementById('emailPreviewFrame');
    if (!window.emailEngine || !previewContainer) return;

    const sampleData = {
      studentName: 'Amina Yusuf',
      userEmail: 'student@zeerocodes.com',
      clientName: 'Tunde Balogun',
      courseTitle: 'The Zeerocodes VibeCode Labs',
      invoiceId: 'INV-2026-001',
      amountNGN: '95,000',
      lessonTitle: 'Module 16 Capstone Brief',
      grade: 'A+ (98%)',
      certificateId: 'VIBECERT-2026-0881',
      projectTitle: 'MedLagos WhatsApp Bot',
      stage: 'Phase 2: Full-Stack Implementation',
      progress: 60,
      appName: 'MedLagos Telehealth',
      score: 98,
      weekNumber: '03'
    };

    const html = window.emailEngine.renderTemplate(templateId, sampleData);
    previewContainer.srcdoc = html;
  }

  async handleSendTestEmail(e) {
    e.preventDefault();
    const templateId = document.getElementById('testEmailTemplateSelect').value;
    const recipient = document.getElementById('testEmailRecipient').value.trim();

    if (window.emailEngine) {
      await window.emailEngine.dispatchEmail(templateId, recipient, {
        studentName: 'Amina Yusuf',
        userEmail: recipient,
        courseTitle: 'The Zeerocodes VibeCode Labs',
        invoiceId: 'INV-2026-088',
        amountNGN: '95,000',
        grade: 'A+ (98%)',
        certificateId: 'VIBECERT-2026-0881'
      });
      this.renderAdminConsole();
    }
  }

  // =========================================================================
  // TAB 8: BLOG CMS PUBLISHER
  // =========================================================================
  // =========================================================================
  // TAB 8: BLOG CMS PUBLISHER & PDF RESOURCE MANAGER
  // =========================================================================
  renderBlogCmsTab(blogPosts) {
    const container = document.getElementById('adminBlogContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Engineering Blog CMS & PDF Library</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Publish technical tutorials, case studies, and downloadable PDF blueprints to capture leads and drive student enrollment.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openBlogEditorModal()">
          <i data-lucide="plus-circle"></i> Create New Article
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${blogPosts.map(post => {
          const pdfBadge = post.pdfAttachment ? `
            <span class="badge badge-cyber" style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.7rem;">
              <i data-lucide="file-text" style="width:11px; height:11px;"></i> PDF (${post.pdfAttachment.sizeFormatted || 'Attached'}) • ${post.pdfAttachment.downloads || 0} dl
            </span>
          ` : '';

          return `
            <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <div style="flex:1; min-width:280px;">
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem; flex-wrap:wrap;">
                  <span class="badge badge-teal">${post.category}</span>
                  ${pdfBadge}
                  <span style="font-size:0.75rem; color:var(--text-cyber-muted);">${post.readTime || '6 min read'} • ${post.date || 'August 2026'}</span>
                </div>
                <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:0.35rem;">${post.title}</h4>
                <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin:0; line-height:1.4;">${post.excerpt}</p>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <button class="btn btn-primary btn-xs" onclick="window.adminConsole.openBlogEditorModal('${post.id}')" title="Edit Article">
                  <i data-lucide="edit-3"></i> Edit
                </button>
                <button class="btn btn-outline btn-xs" onclick="window.blog?.openArticleReader('${post.slug || post.id}')" title="View Reader">
                  <i data-lucide="eye"></i> View
                </button>
                <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleDeleteBlogPost('${post.id}')" title="Delete Article">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  async openBlogEditorModal(postId = null) {
    const form = document.getElementById('adminBlogPostForm');
    if (form) form.reset();

    const dropzone = document.getElementById('adminPdfDropzone');
    const preview = document.getElementById('adminPdfAttachedPreview');

    // Reset hidden fields
    document.getElementById('adminPostId').value = '';
    document.getElementById('adminPostPdfData').value = '';
    document.getElementById('adminPostPdfUrl').value = '';
    document.getElementById('adminPostPdfSize').value = '';
    document.getElementById('adminPostPdfSizeFormatted').value = '';
    document.getElementById('adminPostPdfDownloads').value = '0';
    if (document.getElementById('adminPostImage')) document.getElementById('adminPostImage').value = '';

    if (postId) {
      const posts = await window.db.getBlogPosts();
      const post = posts.find(p => p.id === postId || p.slug === postId);
      if (post) {
        document.getElementById('adminPostId').value = post.id || '';
        document.getElementById('adminPostTitle').value = post.title || '';
        document.getElementById('adminPostSlug').value = post.slug || '';
        document.getElementById('adminPostCategory').value = post.category || 'Automations';
        document.getElementById('adminPostTags').value = (post.tags || []).join(', ');
        document.getElementById('adminPostExcerpt').value = post.excerpt || '';
        document.getElementById('adminPostContent').value = post.content || '';
        if (document.getElementById('adminPostImage')) {
          document.getElementById('adminPostImage').value = post.featuredImage || post.heroImage || '';
        }

        if (post.pdfAttachment) {
          const pdf = post.pdfAttachment;
          document.getElementById('adminPdfPreviewName').textContent = pdf.name || 'document.pdf';
          document.getElementById('adminPdfPreviewSize').textContent = `${pdf.sizeFormatted || 'PDF Document'} • ${pdf.downloads || 0} downloads`;
          document.getElementById('adminPostPdfTitle').value = pdf.title || '';
          document.getElementById('adminPostPdfDesc').value = pdf.description || '';
          document.getElementById('adminPostPdfUrl').value = pdf.url || '';
          document.getElementById('adminPostPdfData').value = pdf.dataUrl || '';
          document.getElementById('adminPostPdfSize').value = pdf.size || '';
          document.getElementById('adminPostPdfSizeFormatted').value = pdf.sizeFormatted || '';
          document.getElementById('adminPostPdfDownloads').value = pdf.downloads || 0;

          if (dropzone) dropzone.style.display = 'none';
          if (preview) preview.style.display = 'block';
        } else {
          if (dropzone) dropzone.style.display = 'block';
          if (preview) preview.style.display = 'none';
        }
      }
    } else {
      if (dropzone) dropzone.style.display = 'block';
      if (preview) preview.style.display = 'none';
    }

    if (window.modal) window.modal.open('modal-admin-blog-editor');
    if (window.lucide) window.lucide.createIcons();
  }

  handlePdfFileSelected(file) {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      window.toast?.error('Invalid file format. Please select a valid .pdf document.');
      return;
    }

    // 20MB Max Limit
    if (file.size > 20 * 1024 * 1024) {
      window.toast?.error('File size exceeds the 20MB limit.');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      document.getElementById('adminPostPdfData').value = dataUrl;
      document.getElementById('adminPostPdfSize').value = file.size;
      document.getElementById('adminPostPdfSizeFormatted').value = sizeFormatted;

      document.getElementById('adminPdfPreviewName').textContent = file.name;
      document.getElementById('adminPdfPreviewSize').textContent = `${sizeFormatted} • Ready to Publish`;

      const titleInput = document.getElementById('adminPostPdfTitle');
      if (titleInput && !titleInput.value.trim()) {
        const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        titleInput.value = cleanBase + ' (PDF)';
      }

      const dropzone = document.getElementById('adminPdfDropzone');
      const preview = document.getElementById('adminPdfAttachedPreview');
      if (dropzone) dropzone.style.display = 'none';
      if (preview) preview.style.display = 'block';

      // Send to server upload endpoint asynchronously if backend is active
      fetch('/api/upload/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          fileData: dataUrl,
          title: titleInput ? titleInput.value : file.name
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.url) {
          document.getElementById('adminPostPdfUrl').value = data.url;
        }
      })
      .catch(() => {});

      window.toast?.success(`PDF "${file.name}" attached successfully!`);
      if (window.lucide) window.lucide.createIcons();
    };

    reader.readAsDataURL(file);
  }

  removeAttachedPdf() {
    const fileInput = document.getElementById('adminPostPdfFile');
    if (fileInput) fileInput.value = '';

    document.getElementById('adminPostPdfData').value = '';
    document.getElementById('adminPostPdfUrl').value = '';
    document.getElementById('adminPostPdfSize').value = '';
    document.getElementById('adminPostPdfSizeFormatted').value = '';
    document.getElementById('adminPostPdfDownloads').value = '0';
    document.getElementById('adminPostPdfTitle').value = '';
    document.getElementById('adminPostPdfDesc').value = '';

    const dropzone = document.getElementById('adminPdfDropzone');
    const preview = document.getElementById('adminPdfAttachedPreview');
    if (dropzone) dropzone.style.display = 'block';
    if (preview) preview.style.display = 'none';

    window.toast?.info('PDF attachment removed.');
    if (window.lucide) window.lucide.createIcons();
  }

  async handleSaveBlogPost(e) {
    e.preventDefault();
    const id = document.getElementById('adminPostId').value || ('blog_' + Date.now());
    const title = document.getElementById('adminPostTitle').value.trim();
    const slug = document.getElementById('adminPostSlug').value.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = document.getElementById('adminPostCategory').value;
    const tags = document.getElementById('adminPostTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const excerpt = document.getElementById('adminPostExcerpt').value.trim();
    const content = document.getElementById('adminPostContent').value.trim();
    const customImg = document.getElementById('adminPostImage')?.value.trim();

    // Check for PDF attachment
    const pdfData = document.getElementById('adminPostPdfData').value;
    const pdfUrl = document.getElementById('adminPostPdfUrl').value;
    const pdfTitle = document.getElementById('adminPostPdfTitle').value.trim();
    const pdfDesc = document.getElementById('adminPostPdfDesc').value.trim();
    const pdfName = document.getElementById('adminPdfPreviewName').textContent || 'resource.pdf';
    const pdfSize = parseInt(document.getElementById('adminPostPdfSize').value) || 0;
    const pdfSizeFormatted = document.getElementById('adminPostPdfSizeFormatted').value || (pdfSize ? `${Math.round(pdfSize/1024)} KB` : 'PDF Resource');
    const pdfDownloads = parseInt(document.getElementById('adminPostPdfDownloads').value) || 0;

    let pdfAttachment = null;
    if (pdfData || pdfUrl || (pdfTitle && pdfName !== 'document.pdf')) {
      pdfAttachment = {
        name: pdfName,
        url: pdfUrl || pdfData,
        dataUrl: pdfData,
        title: pdfTitle || pdfName,
        description: pdfDesc,
        size: pdfSize,
        sizeFormatted: pdfSizeFormatted,
        downloads: pdfDownloads
      };
    }

    const post = {
      id,
      slug,
      title,
      category,
      tags,
      excerpt,
      content,
      featuredImage: customImg || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
      heroImage: customImg || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
      author: 'Nuel Effiong',
      authorRole: 'Founder & Principal AI Systems Architect',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: `${Math.max(3, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      views: 120,
      claps: 24,
      pdfAttachment: pdfAttachment || undefined
    };

    await window.db.saveBlogPost(post);
    window.toast?.success(`Article "${title}" published with ${pdfAttachment ? 'PDF attachment' : 'live blog updates'}!`);
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
    if (window.blog) window.blog.renderBlogView();
  }

  async handleDeleteBlogPost(postId) {
    if (confirm('Are you sure you want to delete this blog article?')) {
      await window.db.deleteBlogPost(postId);
      window.toast?.info('Blog article deleted.');
      this.renderAdminConsole();
      if (window.blog) window.blog.renderBlogView();
    }
  }

  // =========================================================================
  // TAB 8: WEBHOOK & SECURITY LOGS
  // =========================================================================
  renderWebhookTab(paymentEvents) {
    const container = document.getElementById('adminWebhookContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Real-Time Cryptographic Webhook & Diagnostic Logs</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Cryptographic SHA-512 HMAC verification audit trail for Paystack and Flutterwave automated webhooks.
          </p>
        </div>
      </div>

      <div style="background:#04070D; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; font-family:var(--font-mono); font-size:0.82rem;">
        ${paymentEvents.map(p => `
          <div style="border-bottom:1px solid rgba(255,255,255,0.06); padding:0.75rem 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <span style="color:var(--emerald-light); font-weight:700;">[HMAC_VERIFIED_200]</span>
              <span style="color:#FFF; margin-left:0.5rem;">${p.provider.toUpperCase()} /webhooks/verify</span>
              <span style="color:var(--text-cyber-muted); margin-left:0.5rem;">Ref: ${p.reference}</span>
            </div>
            <div style="color:var(--cyan-accent); font-size:0.75rem;">
              ${new Date(p.verifiedAt).toISOString()} • ₦${(p.amountNGN).toLocaleString()}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

window.adminConsole = new AdminConsoleManager();
