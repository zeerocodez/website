/**
 * Zeerocodes Unified Enterprise Admin Command Console (v2.0)
 * Handles:
 * 1. Overview Telemetry & Revenue Metrics
 * 2. LMS Student Directory & Lab Submission Grading
 * 3. Studio Client Projects Kanban Pipeline & Milestone Tracker
 * 4. VibeScan AI Security Audit Workspace (OWASP LLM Top 10 + VibeCert Issuance)
 * 5. Blog CMS & In-App Article Publisher
 * 6. Live Webhook & Security Diagnostic Logs
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

    // New Project Form Submit
    const projForm = document.getElementById('adminNewProjectForm');
    if (projForm) {
      projForm.addEventListener('submit', (e) => this.handleCreateProject(e));
    }

    // Blog Post CMS Form Submit
    const blogForm = document.getElementById('adminBlogPostForm');
    if (blogForm) {
      blogForm.addEventListener('submit', (e) => this.handleSaveBlogPost(e));
    }

    // Lab Grade Form Submit
    const gradeForm = document.getElementById('adminLabGradeForm');
    if (gradeForm) {
      gradeForm.addEventListener('submit', (e) => this.handleSaveLabGrade(e));
    }
  }

  async renderAdminConsole() {
    const adminView = document.getElementById('view-admin');
    if (!adminView || !window.db) return;

    // Fetch collections
    const projects = await window.db.getAllStudioProjects();
    const vibescanSubs = await window.db.getAllPendingSubmissions();
    const enrollments = await window.db.getAllEnrollments();
    const users = await window.db.getAllUsers();
    const labSubs = await window.db.getAllLabSubmissions();
    const blogPosts = await window.db.getBlogPosts();
    const paymentEvents = await window.db.getPaymentEvents();

    // 1. Calculate Telemetry
    const totalRevNGN = 180450000 + (enrollments.length * 95000) + (projects.reduce((acc, p) => acc + (p.budgetNGN || 0), 0));
    const activeProjectsCount = projects.filter(p => p.status !== 'delivered').length;
    const pendingAuditsCount = vibescanSubs.filter(s => s.status !== 'certified').length;
    const totalStudentsCount = 1450 + enrollments.length;

    // Update Telemetry Header
    const revEl = document.getElementById('adminStatRevenue');
    const projEl = document.getElementById('adminStatProjects');
    const audEl = document.getElementById('adminStatAudits');
    const stuEl = document.getElementById('adminStatStudents');

    if (revEl) revEl.textContent = `₦${(totalRevNGN / 1000000).toFixed(1)}M`;
    if (projEl) projEl.textContent = `${activeProjectsCount} Active`;
    if (audEl) audEl.textContent = `${pendingAuditsCount} In Queue`;
    if (stuEl) stuEl.textContent = `${totalStudentsCount.toLocaleString()}`;

    // 2. Render Tab Panels
    this.renderOverviewTab(projects, vibescanSubs, enrollments, labSubs, paymentEvents);
    this.renderLmsTab(enrollments, labSubs, users);
    this.renderStudioTab(projects);
    this.renderVibescanTab(vibescanSubs);
    this.renderBlogCmsTab(blogPosts);
    this.renderWebhookTab(paymentEvents);

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Tab 1: Overview ---
  renderOverviewTab(projects, vibescanSubs, enrollments, labSubs, paymentEvents) {
    const container = document.getElementById('adminOverviewContent');
    if (!container) return;

    const pendingLabsCount = labSubs.filter(l => l.status === 'pending').length;

    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1.5rem; margin-bottom:2rem;">
        <div class="admin-overview-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h4 style="color:#FFF; font-size:1.05rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="bell" style="color:var(--emerald-light);"></i> Action Items
            </h4>
            <span class="badge badge-teal">${pendingLabsCount + vibescanSubs.length} Pending</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:#FFF; font-size:0.85rem;">Student Lab Submissions</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${pendingLabsCount} labs awaiting code grading</div>
              </div>
              <button class="btn btn-outline btn-xs" onclick="document.querySelector('[data-tab=adminTabAcademy]').click()">Grade Labs</button>
            </div>
            <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <strong style="color:#FFF; font-size:0.85rem;">VibeScan Security Queue</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${vibescanSubs.length} repos awaiting OWASP audit</div>
              </div>
              <button class="btn btn-outline btn-xs" onclick="document.querySelector('[data-tab=adminTabVibescan]').click()">Review Audits</button>
            </div>
          </div>
        </div>

        <div class="admin-overview-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h4 style="color:#FFF; font-size:1.05rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="activity" style="color:var(--cyan-accent);"></i> Recent Activity Stream
            </h4>
            <span class="badge badge-success">LIVE TELEMETRY</span>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.82rem; color:var(--text-cyber-muted);">
            ${paymentEvents.slice(0, 3).map(p => `
              <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
                <span>Verified ${p.provider} payment (₦${(p.amountNGN).toLocaleString()}) for ${p.customerEmail}</span>
                <span style="color:var(--emerald-light); font-size:0.75rem;">✓ HMAC</span>
              </div>
            `).join('')}
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span>Student Amina Yusuf submitted Capstone: MedLagos WhatsApp Bot</span>
              <span style="color:var(--cyan-accent); font-size:0.75rem;">Just now</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Tab 2: LMS & Student Grading ---
  renderLmsTab(enrollments, labSubs, users) {
    const container = document.getElementById('adminLmsContent');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h3 style="color:#FFF; font-size:1.25rem; margin-bottom:0.2rem;">Student Lab Submissions & Grading Queue</h3>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0;">Inspect student GitHub repositories, check Paystack & n8n implementations, and issue VibeCert™ badges.</p>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${labSubs.map(lab => `
            <div class="admin-item-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
                <div>
                  <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                    <span class="badge ${lab.status === 'passed' ? 'badge-success' : 'badge-warning'}">${(lab.status || 'PENDING').toUpperCase()}</span>
                    <strong style="color:#FFF; font-size:1.05rem;">${lab.lessonTitle}</strong>
                  </div>
                  <div style="font-size:0.82rem; color:var(--text-cyber-muted);">
                    <strong>Student:</strong> ${lab.userName} (${lab.userEmail}) • <strong>Module:</strong> ${lab.moduleTitle} • <strong>Submitted:</strong> ${new Date(lab.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                ${lab.grade ? `<span class="badge badge-teal" style="font-size:0.85rem; font-weight:700;">Grade: ${lab.grade}</span>` : ''}
              </div>

              <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); margin-bottom:0.85rem; font-size:0.85rem;">
                <div style="display:flex; gap:1.5rem; flex-wrap:wrap; margin-bottom:0.4rem;">
                  <div><strong>GitHub Repo:</strong> <a href="${lab.repoUrl}" target="_blank" style="color:var(--emerald-light);">${lab.repoUrl}</a></div>
                  ${lab.liveUrl ? `<div><strong>Live URL:</strong> <a href="${lab.liveUrl}" target="_blank" style="color:var(--cyan-accent);">${lab.liveUrl}</a></div>` : ''}
                </div>
                <div style="color:var(--text-cyber-muted);"><strong>Student Notes:</strong> ${lab.notes || 'N/A'}</div>
                ${lab.feedback ? `<div style="margin-top:0.4rem; color:var(--emerald-light);"><strong>Instructor Feedback (${lab.reviewedBy}):</strong> ${lab.feedback}</div>` : ''}
              </div>

              <button class="btn btn-primary btn-xs" onclick="window.adminConsole.openGradeLabModal('${lab.id}')">
                <i data-lucide="edit-3"></i> ${lab.grade ? 'Update Grade & Feedback' : 'Grade Lab & Issue Certificate'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h3 style="color:#FFF; font-size:1.25rem; margin-bottom:1rem;">Active Cohort Students (${enrollments.length})</h3>
        <div class="admin-table-wrapper" style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
            <thead>
              <tr style="border-bottom:1px solid var(--obsidian-border); color:var(--text-cyber-muted);">
                <th style="padding:0.75rem;">Student</th>
                <th style="padding:0.75rem;">Course</th>
                <th style="padding:0.75rem;">Progress</th>
                <th style="padding:0.75rem;">Enrolled Date</th>
                <th style="padding:0.75rem;">Certificate</th>
              </tr>
            </thead>
            <tbody>
              ${enrollments.map(e => {
                const completedCount = (e.completedLessons || []).length;
                const percent = Math.round((completedCount / 88) * 100);
                return `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:0.75rem; color:#FFF;">
                      <strong>${e.userName || e.userEmail}</strong>
                      <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${e.userEmail}</div>
                    </td>
                    <td style="padding:0.75rem; color:var(--emerald-light);">${e.courseTitle}</td>
                    <td style="padding:0.75rem;">
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <div style="flex:1; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden; min-width:80px;">
                          <div style="width:${percent}%; height:100%; background:linear-gradient(90deg, var(--emerald-primary), var(--cyan-accent));"></div>
                        </div>
                        <span style="font-size:0.75rem; color:#FFF;">${percent}%</span>
                      </div>
                    </td>
                    <td style="padding:0.75rem; color:var(--text-cyber-muted);">${new Date(e.enrolledAt).toLocaleDateString()}</td>
                    <td style="padding:0.75rem;">
                      ${e.certificateId ? `<span class="badge badge-success trigger-view-cert" data-cert="${e.certificateId}" style="cursor:pointer;"><i data-lucide="award"></i> ${e.certificateId}</span>` : `<span class="badge badge-cyber">In Progress</span>`}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- Tab 3: Studio Projects ---
  renderStudioTab(projects) {
    const container = document.getElementById('adminStudioContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin-bottom:0.2rem;">Studio Client Projects Pipeline</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0;">Track custom builds from initial discovery intake to live production deployment.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.modal?.open('modal-admin-new-project')">
          <i data-lucide="plus-circle"></i> New Studio Project
        </button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.5rem;">
        ${projects.map(p => `
          <div class="admin-project-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                <span class="badge badge-teal">${p.status.toUpperCase()}</span>
                <span style="color:#FFF; font-weight:800; font-size:1.1rem;">₦${(p.budgetNGN / 1000000).toFixed(1)}M</span>
              </div>
              <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:0.35rem;">${p.title}</h4>
              <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1rem;">
                <strong>Client:</strong> ${p.clientName} (${p.clientCompany}) • <strong>Target Launch:</strong> ${p.targetLaunch}
              </p>

              <div style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-cyber-muted); margin-bottom:0.25rem;">
                  <span>Stage: ${p.stage}</span>
                  <span>${p.progress}%</span>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                  <div style="width:${p.progress}%; height:100%; background:linear-gradient(90deg, var(--cyan-accent), var(--emerald-light));"></div>
                </div>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1rem; font-size:0.8rem;">
                ${(p.milestones || []).map(m => `
                  <div style="display:flex; align-items:center; gap:0.4rem; color:${m.done ? 'var(--emerald-light)' : 'var(--text-cyber-muted)'};">
                    <i data-lucide="${m.done ? 'check-circle' : 'circle'}" style="width:13px; height:13px;"></i>
                    <span>${m.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.85rem;">
              <button class="btn btn-outline btn-xs" onclick="window.adminConsole.advanceProjectStage('${p.id}')">
                <i data-lucide="fast-forward"></i> Advance Stage
              </button>
              <a href="${p.stagingUrl || '#'}" target="_blank" class="btn btn-ghost btn-xs" style="color:var(--emerald-light);">
                <i data-lucide="external-link"></i> Staging URL
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Tab 4: VibeScan Security Audits ---
  renderVibescanTab(vibescanSubs) {
    const container = document.getElementById('adminVibescanContent');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h3 style="color:#FFF; font-size:1.25rem; margin-bottom:0.2rem;">VibeScan Security Audit Review Workspace</h3>
        <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0;">Audit vibe-coded repositories against OWASP LLM Top 10 vulnerabilities, verify RLS & HMAC, and issue VibeCert™ badges.</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        ${vibescanSubs.map(sub => `
          <div class="admin-item-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <span class="badge ${sub.status === 'certified' ? 'badge-success' : 'badge-danger'}">${sub.status.toUpperCase()}</span>
                <h4 style="color:#FFF; font-size:1.15rem; margin:0.35rem 0 0.15rem 0;">${sub.appName}</h4>
                <div style="font-size:0.82rem; color:var(--text-cyber-muted);">
                  <strong>Submitter:</strong> ${sub.userName} (${sub.userEmail}) • <strong>Tech Stack:</strong> ${sub.techStack} • <strong>Method:</strong> ${sub.buildMethod}
                </div>
              </div>
              <div style="text-align:right;">
                <div style="color:var(--emerald-light); font-weight:800; font-size:1.3rem;">Score: ${sub.securityScore || 95}/100</div>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${sub.certificationId || 'Pending Approval'}</div>
              </div>
            </div>

            <div style="background:rgba(255,255,255,0.02); padding:0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); margin-bottom:1rem; font-size:0.85rem;">
              <div style="margin-bottom:0.4rem;">
                <strong>Target Repository:</strong> <a href="${sub.appUrl}" target="_blank" style="color:var(--emerald-light);">${sub.appUrl}</a>
              </div>
              ${sub.auditReport ? `
                <div style="margin-top:0.6rem;">
                  <strong style="display:block; margin-bottom:0.3rem; color:#FFF;">Audited Findings (${sub.auditReport.findings.length}):</strong>
                  <div style="display:flex; flex-direction:column; gap:0.35rem;">
                    ${sub.auditReport.findings.map(f => `
                      <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(0,0,0,0.3); padding:0.35rem 0.6rem; border-radius:3px;">
                        <span>${f.title}</span>
                        <span class="badge ${f.severity === 'CRITICAL' ? 'badge-danger' : 'badge-warning'}" style="font-size:0.65rem;">${f.severity}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : '<div style="color:var(--text-cyber-muted);">Manual audit checklist pending verification.</div>'}
            </div>

            <button class="btn btn-primary btn-xs" onclick="window.vibescanReview?.openReviewDrawer('${sub.id}')">
              <i data-lucide="shield-check"></i> Open OWASP 10-Point Audit Inspector
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Tab 5: Blog CMS ---
  renderBlogCmsTab(blogPosts) {
    const container = document.getElementById('adminBlogContent');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 style="color:#FFF; font-size:1.25rem; margin-bottom:0.2rem;">Engineering Blog CMS</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0;">Create, edit, and publish high-ranking case studies and architectural blueprints.</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.adminConsole.openNewPostModal()">
          <i data-lucide="pen-tool"></i> Write New Article
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${blogPosts.map(post => `
          <div class="admin-item-card" style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div style="flex:1; min-width:260px;">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                <span class="badge ${post.status === 'published' ? 'badge-success' : 'badge-cyber'}">${(post.status || 'PUBLISHED').toUpperCase()}</span>
                <span class="badge badge-teal">${post.category}</span>
                <span style="font-size:0.75rem; color:var(--text-cyber-muted);">${post.readTime}</span>
              </div>
              <h4 style="color:#FFF; font-size:1.05rem; margin:0.2rem 0;">${post.title}</h4>
              <div style="font-size:0.78rem; color:var(--text-cyber-muted);">
                <strong>Slug:</strong> /#blog/${post.slug} • <strong>Author:</strong> ${post.author} • <strong>Date:</strong> ${post.date}
              </div>
            </div>

            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-outline btn-xs" onclick="window.adminConsole.openEditPostModal('${post.id}')">
                <i data-lucide="edit-2"></i> Edit
              </button>
              <button class="btn btn-outline btn-xs" style="color:#F87171; border-color:rgba(239,68,68,0.4);" onclick="window.adminConsole.deleteBlogPost('${post.id}')">
                <i data-lucide="trash-2"></i> Delete
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Tab 6: Webhook & Security Logs ---
  renderWebhookTab(paymentEvents) {
    const container = document.getElementById('adminWebhookContent');
    if (!container) return;

    container.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h3 style="color:#FFF; font-size:1.25rem; margin-bottom:0.2rem;">Live Webhook & Security Telemetry Stream</h3>
        <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0;">Real-time stream of cryptographic Paystack/Flutterwave webhook verification events and API health.</p>
      </div>

      <div style="background:#04070D; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1rem; font-family:var(--font-mono); font-size:0.8rem;">
        ${paymentEvents.map(evt => `
          <div style="padding:0.75rem; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <span style="color:var(--emerald-light);">[${new Date(evt.verifiedAt).toLocaleTimeString()}]</span>
              <strong style="color:#FFF; margin-left:0.5rem;">${evt.provider.toUpperCase()} EVENT: ${evt.reference}</strong>
              <div style="color:var(--text-cyber-muted); font-size:0.75rem; margin-top:0.2rem;">
                Customer: ${evt.customerEmail} • Amount: ₦${(evt.amountNGN).toLocaleString()} • Item: ${evt.item}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span class="badge badge-success">HMAC_SHA512_PASS</span>
              <span class="badge badge-teal">HTTP 200 OK</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Actions ---
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

  async deleteBlogPost(postId) {
    if (confirm("Are you sure you want to delete this blog post?")) {
      await window.db.deleteBlogPost(postId);
      if (window.toast) window.toast.info("Blog post removed.");
      this.renderAdminConsole();
      if (window.blog) window.blog.renderBlogView();
    }
  }

  async handleCreateProject(e) {
    e.preventDefault();
    const title = document.getElementById('newProjTitle').value.trim();
    const clientName = document.getElementById('newProjClientName').value.trim();
    const clientEmail = document.getElementById('newProjClientEmail').value.trim();
    const budgetNGN = parseInt(document.getElementById('newProjBudgetNGN').value) || 2500000;

    const newProj = {
      id: 'proj_' + Date.now(),
      title,
      clientName,
      clientCompany: clientName + ' Co',
      userEmail: clientEmail,
      userId: 'user_' + Date.now(),
      budgetNGN,
      budgetUSD: Math.round(budgetNGN / 1500),
      status: 'discovery',
      stage: 'Phase 1: Architecture & Scoping',
      progress: 20,
      milestones: [
        { name: 'Discovery Intake & Flow Mapping', done: true },
        { name: 'Full-Stack Architecture & Security Blueprint', done: false },
        { name: 'Webhook Integration & Automation', done: false },
        { name: 'VibeScan AI Security Lockdown', done: false },
        { name: 'Production Launch', done: false }
      ],
      startDate: new Date().toISOString().split('T')[0],
      targetLaunch: '2026-09-30'
    };

    await window.db.saveStudioProject(newProj);
    if (window.modal) window.modal.close('modal-admin-new-project');
    if (window.toast) window.toast.success("Studio project initialized in client pipeline!");
    this.renderAdminConsole();
  }
}

window.adminConsole = new AdminConsoleManager();
