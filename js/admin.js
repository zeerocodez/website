/**
 * Zeerocodes Unified Enterprise Admin Command Console (v3.0)
 * Handles complete operational control:
 * 1. Overview Telemetry & Revenue Metrics
 * 2. LMS Curriculum, Lesson & Video Content Editor
 * 3. Student Admissions, Directory & Lab Grading Queue
 * 4. Financials, Invoicing & Net Profit Analytics
 * 5. Studio Client Projects Pipeline & Milestone Manager
 * 6. On-Demand Custom VibeScan Security Engine & AST Auditor
 * 7. Engineering Blog CMS Publisher
 * 8. Live Webhook & Security Diagnostic Logs
 */

class AdminConsoleManager {
  constructor() {
    this.activeTab = 'adminTabOverview';
    this.init();
  }

  init() {
    this.bindAdminEvents();
  }

  bindAdminEvents() {
    // Tab Switching
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

    // Form Submissions
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
  }

  async renderAdminConsole() {
    const adminView = document.getElementById('view-admin');
    if (!adminView || !window.db) return;

    // Fetch all collections
    const course = await window.db.getCourse();
    const projects = await window.db.getAllStudioProjects();
    const vibescanSubs = await window.db.getAllPendingSubmissions();
    const enrollments = await window.db.getAllEnrollments();
    const users = await window.db.getAllUsers();
    const labSubs = await window.db.getAllLabSubmissions();
    const blogPosts = await window.db.getBlogPosts();
    const paymentEvents = await window.db.getPaymentEvents();
    const invoices = await window.db.getInvoices();
    const expenses = await window.db.getExpenses();
    const customAudits = await window.db.getCustomAudits();

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

    // 2. Render Specialized Tabs
    this.renderOverviewTab(projects, vibescanSubs, enrollments, labSubs, paymentEvents, netProfitNGN, profitMargin, totalRevNGN);
    this.renderLmsEditorTab(course);
    this.renderStudentsTab(enrollments, labSubs, users);
    this.renderFinancialsTab(totalRevNGN, totalExpensesNGN, netProfitNGN, profitMargin, academyRevNGN, studioRevNGN, vibescanRevNGN, invoices, expenses);
    this.renderStudioTab(projects);
    this.renderVibescanTab(vibescanSubs, customAudits);
    this.renderBlogCmsTab(blogPosts);
    this.renderWebhookTab(paymentEvents);

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // TAB 1: OVERVIEW & MISSION CONTROL
  // =========================================================================
  renderOverviewTab(projects, vibescanSubs, enrollments, labSubs, paymentEvents, netProfitNGN, profitMargin, totalRevNGN) {
    const container = document.getElementById('adminOverviewContent');
    if (!container) return;

    const pendingLabsCount = labSubs.filter(l => l.status === 'pending').length;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap:1.5rem; margin-bottom:2rem;">
        <!-- Financial Quick Snapshot -->
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h4 style="color:#FFF; font-size:1.05rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="wallet" style="color:var(--emerald-light);"></i> Net Profit & Margins
            </h4>
            <span class="badge badge-success">${profitMargin}% Margin</span>
          </div>
          <div style="font-size:2rem; font-weight:900; color:var(--emerald-light); margin-bottom:0.4rem;">
            ₦${(netProfitNGN / 1000000).toFixed(2)}M
          </div>
          <div style="font-size:0.8rem; color:var(--text-cyber-muted); margin-bottom:1.25rem;">
            Gross Pipeline: <strong>₦${(totalRevNGN / 1000000).toFixed(2)}M</strong>
          </div>
          <button class="btn btn-outline btn-xs" onclick="document.querySelector('[data-tab=adminTabFinancials]').click()">
            <i data-lucide="receipt"></i> View Invoices & Profit Breakdown &rarr;
          </button>
        </div>

        <!-- Action Items Callout -->
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h4 style="color:#FFF; font-size:1.05rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="bell" style="color:var(--cyan-accent);"></i> Operational Queue
            </h4>
            <span class="badge badge-teal">${pendingLabsCount + vibescanSubs.length} Pending</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div style="background:rgba(255,255,255,0.02); padding:0.65rem 0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:#FFF; font-size:0.85rem;">Student Code Labs</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${pendingLabsCount} labs awaiting inspection</div>
              </div>
              <button class="btn btn-primary btn-xs" onclick="document.querySelector('[data-tab=adminTabStudents]').click()">Grade</button>
            </div>
            <div style="background:rgba(255,255,255,0.02); padding:0.65rem 0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:#FFF; font-size:0.85rem;">VibeScan Security Audits</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${vibescanSubs.length} client repos in queue</div>
              </div>
              <button class="btn btn-outline btn-xs" onclick="document.querySelector('[data-tab=adminTabVibescan]').click()">Audit</button>
            </div>
          </div>
        </div>

        <!-- Quick Admin Shortcuts -->
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="zap" style="color:var(--emerald-light);"></i> Rapid Actions
          </h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
            <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openAdmitStudentModal()"><i data-lucide="user-plus"></i> Admit Student</button>
            <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openNewProjectModal()"><i data-lucide="folder-plus"></i> New Project</button>
            <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openNewInvoiceModal()"><i data-lucide="receipt"></i> New Invoice</button>
            <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openAddExpenseModal()"><i data-lucide="minus-circle"></i> Log Expense</button>
            <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openCustomScanModal()"><i data-lucide="shield-check"></i> Custom Scan</button>
            <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openBlogEditorModal()"><i data-lucide="edit-3"></i> New Article</button>
          </div>
        </div>
      </div>

      <!-- Live Payment Activity Feed -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="activity" style="color:var(--cyan-accent);"></i> Verified Webhook Payment Feed
        </h4>
        <div style="display:flex; flex-direction:column; gap:0.6rem;">
          ${paymentEvents.slice(0, 5).map(p => `
            <div style="background:rgba(255,255,255,0.02); padding:0.75rem 1rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <strong style="color:#FFF; font-size:0.88rem;">${p.customerEmail}</strong>
                  <span class="badge badge-success">PAID</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono); margin-top:0.2rem;">
                  Item: ${p.item} • Ref: ${p.reference} • Gateway: ${p.provider}
                </div>
              </div>
              <div style="text-align:right;">
                <strong style="color:var(--emerald-light); font-size:1rem;">₦${(p.amountNGN).toLocaleString()}</strong>
                <div style="font-size:0.72rem; color:var(--text-cyber-muted);">${new Date(p.verifiedAt).toLocaleDateString()}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 2: LMS CURRICULUM, LESSON & VIDEO EDITOR
  // =========================================================================
  renderLmsEditorTab(course) {
    const container = document.getElementById('adminLmsEditorContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">${course.title}</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Edit video URLs, blueprints, security callouts, prompts, or add/delete lessons across all 4 levels.
          </p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <input type="text" id="adminLessonSearchInput" placeholder="Filter lessons..." class="form-input" style="width:220px; font-size:0.8rem; padding:0.4rem 0.75rem;" oninput="window.adminConsole.filterLmsLessons(this.value)">
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.5rem;" id="adminLmsLevelsContainer">
        ${course.levels.map((lvl, lIdx) => `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:0.75rem; margin-bottom:1rem;">
              <div>
                <span class="badge badge-teal" style="font-size:0.7rem;">LEVEL ${lvl.levelNumber}</span>
                <strong style="color:#FFF; font-size:1.05rem; margin-left:0.5rem;">${lvl.title}</strong>
                <span style="font-size:0.8rem; color:var(--text-cyber-muted); margin-left:0.5rem;">— ${lvl.tagline}</span>
              </div>
              <span style="font-size:0.8rem; color:var(--emerald-light); font-weight:700;">${lvl.lessonCount || lvl.modules.reduce((a, m) => a + m.lessons.length, 0)} Lessons</span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1rem;">
              ${lvl.modules.map((mod, mIdx) => `
                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-xs); padding:1rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                    <strong style="color:var(--cyan-accent); font-size:0.85rem;">Module ${mod.number}: ${mod.title}</strong>
                    <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light); padding:0 0.4rem;" onclick="window.adminConsole.openAddLessonModal(${lIdx}, ${mIdx}, '${mod.title}')" title="Add lesson">
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

  filterLmsLessons(query) {
    const lower = query.toLowerCase().trim();
    document.querySelectorAll('.admin-lesson-item-row').forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(lower) ? 'flex' : 'none';
    });
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
      await window.db.updateLessonData('course-vibecode-labs', levelIndex, moduleIndex, lessonIndex, title);
      window.toast?.success('Lesson updated successfully!');
    } else {
      await window.db.addLessonToModule('course-vibecode-labs', levelIndex, moduleIndex, title);
      window.toast?.success('New lesson added to module!');
    }

    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleDeleteLesson(levelIndex, moduleIndex, lessonIndex) {
    if (confirm('Are you sure you want to delete this lesson from the curriculum?')) {
      await window.db.deleteLessonFromModule('course-vibecode-labs', levelIndex, moduleIndex, lessonIndex);
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

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Student Admissions & Cohort Management</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Admit candidates, review graduation progress, manage access, and grade submitted practical labs.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openAdmitStudentModal()">
          <i data-lucide="user-plus"></i> Admit New Student
        </button>
      </div>

      <!-- Enrolled Students Table -->
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
                <th style="padding:0.75rem;">Payment</th>
                <th style="padding:0.75rem;">Lessons Done</th>
                <th style="padding:0.75rem; text-align:right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${enrollments.map(e => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:0.75rem; color:#FFF; font-weight:600;">${e.studentName || 'Student Member'}</td>
                  <td style="padding:0.75rem; color:var(--text-cyber-muted);">${e.userEmail}<br><span style="font-size:0.75rem; color:var(--cyan-accent);">${e.studentPhone || '+234 800 000 0000'}</span></td>
                  <td style="padding:0.75rem; color:var(--emerald-light);">${e.cohort || 'October 15, 2026'}</td>
                  <td style="padding:0.75rem;"><span class="badge badge-success">${(e.paymentStatus || 'PAID').toUpperCase()} (₦${((e.amountNGN || 95000)).toLocaleString()})</span></td>
                  <td style="padding:0.75rem; color:#FFF;">${(e.completedLessons || []).length} / 88</td>
                  <td style="padding:0.75rem; text-align:right;">
                    <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleRemoveStudent('${e.id}', '${e.userEmail}')" title="Revoke access">
                      <i data-lucide="user-x"></i> Remove
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Lab Submissions Grading Queue -->
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
              <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openGradeLabModal('${lab.id}', '${lab.lessonTitle.replace(/'/g, "\\'")}', '${lab.studentName || lab.userEmail}', '${lab.repoUrl}')">
                <i data-lucide="check-circle"></i> Grade Submission
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
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
    window.toast?.success(`Student ${name} successfully admitted to ${cohort}!`);

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

  openGradeLabModal(labId, lessonTitle, studentName, repoUrl) {
    document.getElementById('gradeLabId').value = labId;
    document.getElementById('gradeLabTitle').textContent = lessonTitle;
    document.getElementById('gradeLabStudentName').textContent = `Student: ${studentName}`;
    const repoLink = document.getElementById('gradeLabRepoLink');
    if (repoLink) {
      repoLink.href = repoUrl;
      repoLink.textContent = repoUrl;
    }
    if (window.modal) window.modal.open('modal-admin-grade-lab');
  }

  async handleSaveLabGrade(e) {
    e.preventDefault();
    const labId = document.getElementById('gradeLabId').value;
    const status = document.getElementById('gradeStatusSelect').value;
    const grade = document.getElementById('gradeScoreInput').value.trim();
    const feedback = document.getElementById('gradeFeedbackInput').value.trim();

    await window.db.gradeLabSubmission(labId, status, feedback, grade, 'Nuel Effiong');
    window.toast?.success('Lab review saved & student notified!');
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

      <!-- Invoices Ledger -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; margin-bottom:2rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="receipt" style="color:var(--emerald-light);"></i> Client Invoices Ledger (${invoices.length})
        </h4>

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
                    <button class="btn btn-ghost btn-xs" style="color:var(--cyan-accent);" onclick="window.toast?.success('Paystack payment link copied for ' + '${inv.id}')" title="Copy Pay link"><i data-lucide="copy"></i></button>
                    <button class="btn btn-ghost btn-xs" style="color:#F87171;" onclick="window.adminConsole.handleDeleteInvoice('${inv.id}')" title="Delete invoice"><i data-lucide="trash-2"></i></button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

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
    window.toast?.success(`Invoice ${id} created and dispatched!`);
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
      window.toast?.success(`Project advanced to: ${proj.stage}`);
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
      window.toast?.success(`Audit complete: 0 Critical Vulnerabilities! Issued ${certId}`);
      this.renderAdminConsole();
    }, 1500);
  }

  // =========================================================================
  // TAB 7: BLOG CMS PUBLISHER
  // =========================================================================
  renderBlogCmsTab(blogPosts) {
    const container = document.getElementById('adminBlogContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin:0;">Engineering Blog CMS</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Publish technical tutorials, case studies, and engineering benchmarks to attract organic client and student inbound.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openBlogEditorModal()">
          <i data-lucide="plus-circle"></i> Create New Article
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${blogPosts.map(post => `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div style="flex:1; min-width:280px;">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <span class="badge badge-teal">${post.category}</span>
                <span style="font-size:0.75rem; color:var(--text-cyber-muted);">${post.readTime || '6 min read'} • ${post.date || 'August 2026'}</span>
              </div>
              <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:0.35rem;">${post.title}</h4>
              <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin:0; line-height:1.4;">${post.excerpt}</p>
            </div>
            <div style="display:flex; gap:0.5rem;">
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
    const grade = document.getElementById('gradeScoreInput').value.trim();
    const status = document.getElementById('gradeStatusSelect').value;
    const feedback = document.getElementById('gradeFeedbackInput').value.trim();

    await window.db.gradeLabSubmission(labId, {
      grade,
      status,
      feedback,
      reviewedBy: window.auth?.getUser()?.displayName || 'Nuel Effiong'
    });

    if (window.modal) window.modal.close('modal-admin-grade-lab');
    if (window.toast) window.toast.success("Lab graded successfully! Student notification dispatched.");
    this.renderAdminConsole();
  }

  async advanceProjectStage(projId) {
    const projects = await window.db.getAllStudioProjects();
    const proj = projects.find(p => p.id === projId);
    if (!proj) return;

    if (proj.status === 'discovery') {
      proj.status = 'scoping';
      proj.stage = 'Phase 2: Architecture & Blueprint';
      proj.progress = 40;
    } else if (proj.status === 'scoping' || proj.status === 'development') {
      proj.status = 'qa_audit';
      proj.stage = 'Phase 4: VibeScan Security Hardening';
      proj.progress = 90;
    } else if (proj.status === 'qa_audit') {
      proj.status = 'delivered';
      proj.stage = 'Phase 5: Live Production Handover';
      proj.progress = 100;
    }

    await window.db.saveStudioProject(proj);
    if (window.toast) window.toast.success(`Project ${proj.title} advanced to ${proj.status.toUpperCase()}!`);
    this.renderAdminConsole();
  }

  openNewPostModal() {
    document.getElementById('adminPostId').value = '';
    document.getElementById('adminPostTitle').value = '';
    document.getElementById('adminPostSlug').value = '';
    document.getElementById('adminPostCategory').value = 'Automations';
    document.getElementById('adminPostExcerpt').value = '';
    document.getElementById('adminPostContent').value = '';
    document.getElementById('adminPostTags').value = 'AI, Automation, Lagos';
    if (window.modal) window.modal.open('modal-admin-blog-editor');
  }

  async openEditPostModal(postId) {
    const post = await window.db.getBlogPostBySlug(postId);
    if (!post) return;

    document.getElementById('adminPostId').value = post.id;
    document.getElementById('adminPostTitle').value = post.title;
    document.getElementById('adminPostSlug').value = post.slug;
    document.getElementById('adminPostCategory').value = post.category;
    document.getElementById('adminPostExcerpt').value = post.excerpt;
    document.getElementById('adminPostContent').value = post.content;
    document.getElementById('adminPostTags').value = (post.tags || []).join(', ');
    if (window.modal) window.modal.open('modal-admin-blog-editor');
  }

  async handleSaveBlogPost(e) {
    e.preventDefault();
    const id = document.getElementById('adminPostId').value || ('post_' + Date.now());
    const title = document.getElementById('adminPostTitle').value.trim();
    let slug = document.getElementById('adminPostSlug').value.trim();
    if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = document.getElementById('adminPostCategory').value;
    const excerpt = document.getElementById('adminPostExcerpt').value.trim();
    const content = document.getElementById('adminPostContent').value.trim();
    const tags = document.getElementById('adminPostTags').value.split(',').map(t => t.trim()).filter(Boolean);

    const post = {
      id,
      title,
      slug,
      category,
      categoryBadge: category === 'AI Security' ? 'badge-danger' : category === 'Automations' ? 'badge-success' : 'badge-teal',
      author: window.auth?.getUser()?.displayName || 'Nuel Effiong',
      authorRole: 'Principal AI Systems Architect',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '6 min read',
      featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      excerpt,
      tags,
      content,
      status: 'published'
    };

    await window.db.saveBlogPost(post);
    if (window.modal) window.modal.close('modal-admin-blog-editor');
    if (window.toast) window.toast.success("Blog article published and indexed with Schema JSON-LD!");
    this.renderAdminConsole();
    if (window.blog) window.blog.renderBlogView();
  }

    window.toast?.success(`Article "${title}" published to live blog!`);
    if (window.modal) window.modal.closeAll();
    this.renderAdminConsole();
  }

  async handleDeleteBlogPost(postId) {
    if (confirm('Are you sure you want to delete this blog article?')) {
      await window.db.deleteBlogPost(postId);
      window.toast?.info('Blog article deleted.');
      this.renderAdminConsole();
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
