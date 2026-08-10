/**
 * Zeerocodes Application Orchestrator (v2.0)
 * Links UI components, Course Catalog, Dashboard Rendering, Admin Queue, LMS, Payments, and Structured Audit Review.
 */

class ZeerocodesApp {
  constructor() {
    this.init();
  }

  async init() {
    console.log("🚀 Zeerocodes Initializing (Teach • Build • Protect)...");
    
    // Bind all static and dynamic forms
    this.bindAuthForms();
    this.bindIntakeForms();
    this.bindContactForm();
    this.bindMobileNavigation();
    this.bindActionTriggers();

    // Render public courses
    await this.renderAcademyCourses();

    // Bind Wiz-Style 3-Pillar Hero Stage Switcher
    document.addEventListener('click', (e) => {
      const stageBtn = e.target.closest('.wiz-tab-btn');
      if (stageBtn) {
        const stageId = stageBtn.getAttribute('data-stage');
        document.querySelectorAll('.wiz-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.wiz-stage-card').forEach(c => c.classList.remove('active'));
        stageBtn.classList.add('active');
        const targetCard = document.getElementById(stageId);
        if (targetCard) targetCard.classList.add('active');
        if (window.lucide) window.lucide.createIcons();
      }
    });

    // Bind Equinet-Style FAQ Accordions
    document.addEventListener('click', (e) => {
      const faqBtn = e.target.closest('.faq-question-btn');
      if (faqBtn) {
        const card = faqBtn.closest('.faq-card');
        if (card) {
          card.classList.toggle('active');
        }
      }
    });

    // Bind Currency Switcher Buttons
    document.addEventListener('click', (e) => {
      const currencyBtn = e.target.closest('.currency-btn');
      if (currencyBtn && window.payments) {
        const curr = currencyBtn.getAttribute('data-currency');
        window.payments.setCurrency(curr);
      }
    });

    // Initialize Cyber Terminal Simulator
    if (window.vibescanEngine && window.vibescanEngine.initCyberTerminal) {
      window.vibescanEngine.initCyberTerminal();
    }

    // Initial auth UI update
    if (window.auth) {
      window.auth.updateNavigationUI();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // =========================================================================
  // 1. PUBLIC ACADEMY COURSE CATALOG (EQUINET-STYLE PEDAGOGY)
  // =========================================================================
  async renderAcademyCourses() {
    const container = document.getElementById('academyCoursesGrid');
    if (!container || !window.db) return;

    const courses = await window.db.getCourses();
    const curr = window.payments ? window.payments.activeCurrency : 'NGN';

    container.innerHTML = courses.map(course => {
      const formattedPrice = window.payments ? window.payments.formatPrice(course.priceNGN) : `₦${course.priceNGN.toLocaleString()}`;
      return `
        <div class="course-card">
          <div class="course-card-header">
            <div class="course-badge">${course.level}</div>
            <div class="course-duration"><i data-lucide="clock"></i> ${course.duration}</div>
          </div>
          <h3 class="course-title">${course.title}</h3>
          <p class="course-short-desc">${course.shortDesc}</p>
          
          <div class="course-tools-strip">
            <span class="tool-tag">n8n</span>
            <span class="tool-tag">WhatsApp API</span>
            <span class="tool-tag">Paystack</span>
            <span class="tool-tag">Claude 3.7</span>
            <span class="tool-tag">OWASP Top 10</span>
          </div>

          <!-- Equinet-Style Curriculum Accordion Drawer -->
          <div class="curriculum-accordion">
            <button type="button" class="curriculum-header-btn" onclick="this.nextElementSibling.classList.toggle('active')">
              <span><i data-lucide="book-open" style="width:14px; height:14px; display:inline; vertical-align:middle;"></i> View Detailed Syllabus (${course.modules.length} Modules)</span>
              <i data-lucide="chevron-down" style="width:14px; height:14px;"></i>
            </button>
            <div class="curriculum-modules-drawer">
              ${course.modules.map(mod => `
                <div class="module-item">
                  <i data-lucide="check-circle-2"></i>
                  <span>${mod}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="course-card-footer">
            <div class="course-pricing">
              <span class="price-ngn" style="font-size:1.25rem; font-weight:800; color:var(--teal-primary);">${formattedPrice}</span>
              <span class="price-usd" style="font-size:0.8rem; color:var(--text-muted);">(${curr})</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.app.handleEnrollCourse('${course.id}')">
              <i data-lucide="credit-card"></i> Enroll in Cohort
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Section B: Payment-Gated Academy Enrollment
   */
  async handleEnrollCourse(courseId) {
    if (!window.auth || !window.auth.isAuthenticated()) {
      if (window.toast) window.toast.info("Please sign in or create an account to enroll.");
      if (window.modal) window.modal.openAuth('signup');
      return;
    }

    const course = await window.db.getCourseById(courseId);
    if (!course) return;

    // Launch Paystack / Flutterwave checkout modal
    if (window.payments) {
      window.payments.openCheckoutModal({
        type: 'academy_enrollment',
        itemId: course.id,
        itemTitle: course.title,
        amountNGN: course.priceNGN,
        amountUSD: course.priceUSD
      });
    }
  }

  // =========================================================================
  // 2. USER DASHBOARD RENDERING (UNIFIED ACCOUNT SYSTEM)
  // =========================================================================
  async renderUserDashboard() {
    const user = window.auth ? window.auth.getUser() : null;
    if (!user) return;

    // Account Bar Details
    const emailEl = document.getElementById('dashUserEmail');
    const nameEl = document.getElementById('dashUserName');
    const roleBadgeEl = document.getElementById('dashRoleBadge');
    const verifiedBadgeEl = document.getElementById('dashVerifiedBadge');
    const emailVerifyBanner = document.getElementById('dashEmailVerifyBanner');

    if (emailEl) emailEl.textContent = user.email;
    if (nameEl) nameEl.textContent = user.displayName || 'Zeerocodes Member';
    if (roleBadgeEl) {
      roleBadgeEl.textContent = (user.role || 'user').toUpperCase();
      roleBadgeEl.className = `badge badge-${user.role || 'user'}`;
    }

    // Email Verification Status Banner
    if (user.emailVerified) {
      if (verifiedBadgeEl) {
        verifiedBadgeEl.innerHTML = `<span class="badge badge-success"><i data-lucide="check-check"></i> Email Verified</span>`;
      }
      if (emailVerifyBanner) emailVerifyBanner.classList.add('d-none');
    } else {
      if (verifiedBadgeEl) {
        verifiedBadgeEl.innerHTML = `<span class="badge badge-warning"><i data-lucide="alert-circle"></i> Unverified</span>`;
      }
      if (emailVerifyBanner) emailVerifyBanner.classList.remove('d-none');
    }

    // Load User Enrollments
    await this.renderDashboardEnrollments(user.uid);

    // Load User VibeScan Submissions
    await this.renderDashboardSubmissions(user.uid);

    // Load User Studio Projects
    await this.renderDashboardStudioProjects(user.uid);

    if (window.lucide) window.lucide.createIcons();
  }

  async renderDashboardEnrollments(userId) {
    const container = document.getElementById('dashEnrollmentsList');
    if (!container || !window.db) return;

    const enrollments = await window.db.getUserEnrollments(userId);
    if (enrollments.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon"><i data-lucide="graduation-cap"></i></div>
          <h4>No Course Enrollments Yet</h4>
          <p>Gain hands-on skills in AI automation, WhatsApp workflows, and secure coding for emerging markets.</p>
          <a href="#academy" class="btn btn-secondary btn-sm"><i data-lucide="compass"></i> Explore Academy Courses</a>
        </div>
      `;
    } else {
      container.innerHTML = enrollments.map(enr => `
        <div class="dash-item-card">
          <div class="dash-item-header">
            <div>
              <span class="badge badge-teal">Academy Course</span>
              <h4 class="dash-item-title">${enr.courseTitle}</h4>
            </div>
            <span class="badge badge-success">${enr.completed ? '100% Completed' : 'Active'}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-label">
              <span>Progress</span>
              <span>${enr.progressPercent || 0}% Complete</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${enr.progressPercent || 0}%;"></div>
            </div>
          </div>
          <div class="dash-item-actions">
            <button class="btn btn-primary btn-sm" onclick="window.lms.openCoursePlayer('${enr.id}')">
              <i data-lucide="play"></i> Launch Course Player
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.modal.openVibescanIntake('academy')">
              <i data-lucide="shield-check"></i> Audit Project Code
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  async renderDashboardSubmissions(userId) {
    const container = document.getElementById('dashSubmissionsList');
    if (!container || !window.db) return;

    const submissions = await window.db.getSubmissionsForUser(userId);
    if (submissions.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon"><i data-lucide="shield-alert"></i></div>
          <h4>No VibeScan Audits Submitted</h4>
          <p>Verify your AI-assisted or vibe-coded applications against the OWASP Top 10 before investor or public launch.</p>
          <button class="btn btn-secondary btn-sm" onclick="window.modal.openVibescanIntake('dashboard')">
            <i data-lucide="shield-plus"></i> Submit App for Security Audit
          </button>
        </div>
      `;
    } else {
      container.innerHTML = submissions.map(sub => {
        let statusBadge = `<span class="badge badge-warning">Pending Review</span>`;
        if (sub.status === 'in_progress') statusBadge = `<span class="badge badge-teal">In Auditor Review</span>`;
        if (sub.status === 'certified') statusBadge = `<span class="badge badge-success">Certified Safe (${sub.certificationId || 'Verified'})</span>`;
        if (sub.status === 'not_certified' || sub.status === 'rejected') statusBadge = `<span class="badge badge-error">Remediation Needed</span>`;

        return `
          <div class="dash-item-card">
            <div class="dash-item-header">
              <div>
                <span class="badge badge-teal">VibeScan Audit</span>
                <h4 class="dash-item-title">${sub.appName}</h4>
                <div class="dash-item-meta">
                  <span><i data-lucide="git-branch"></i> ${sub.buildMethod}</span>
                  <span><i data-lucide="calendar"></i> ${new Date(sub.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div>${statusBadge}</div>
            </div>
            <p class="dash-item-desc"><strong>Tech Stack:</strong> ${sub.techStack}</p>
            <div class="dash-item-actions">
              <a href="${sub.appUrl}" target="_blank" rel="noreferrer" class="btn btn-outline btn-sm">
                <i data-lucide="external-link"></i> Repo Link
              </a>
              <button class="btn btn-secondary btn-sm" onclick="window.vibescanReview.openUserReportViewer('${sub.id}')">
                <i data-lucide="file-text"></i> View Audit Findings & Badge
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  async renderDashboardStudioProjects(userId) {
    const container = document.getElementById('dashStudioProjectsList');
    if (!container || !window.db) return;

    const projects = await window.db.getStudioProjectsForUser(userId);
    if (projects.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon"><i data-lucide="cpu"></i></div>
          <h4>No Studio Projects Active</h4>
          <p>Need custom WhatsApp automation, Paystack invoice bots, or business system integration?</p>
          <button class="btn btn-secondary btn-sm trigger-calendly-booking">
            <i data-lucide="calendar"></i> Book a Studio Discovery Session
          </button>
        </div>
      `;
    } else {
      container.innerHTML = projects.map(proj => {
        const isDelivered = proj.status === 'project_delivered' || proj.progressPercent === 100;
        return `
          <div class="dash-item-card">
            <div class="dash-item-header">
              <div>
                <span class="badge badge-teal">Studio Engagement</span>
                <h4 class="dash-item-title">${proj.title}</h4>
              </div>
              <span class="badge badge-${isDelivered ? 'success' : 'teal'}">${proj.milestone}</span>
            </div>
            <p class="dash-item-desc">${proj.summary}</p>
            <div class="progress-bar-container">
              <div class="progress-bar-label">
                <span>Build Phase</span>
                <span>${proj.progressPercent}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${proj.progressPercent}%;"></div>
              </div>
            </div>

            ${isDelivered ? `
              <div style="margin-top:0.75rem; background:var(--mint-bg); padding:0.6rem 0.8rem; border-radius:var(--radius-sm); border:1px solid var(--green-secondary); display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.8rem; color:var(--teal-dark); font-weight:600;">System Delivered! Protect your automation:</span>
                <button class="btn btn-primary btn-xs" onclick="window.studio.openDeliveredStudioCrossSell('${proj.id}')">
                  <i data-lucide="shield"></i> VibeScan Audit
                </button>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  }

  // =========================================================================
  // 3. ADMIN DASHBOARD RENDERING (ROLE-GATED)
  // =========================================================================
  async renderAdminDashboard() {
    if (!window.auth || !window.auth.isAdmin()) {
      window.location.hash = '#dashboard';
      return;
    }

    const pendingQueueContainer = document.getElementById('adminSubmissionsQueue');
    const usersTableContainer = document.getElementById('adminUsersTableBody');
    const totalUsersCount = document.getElementById('adminStatTotalUsers');
    const pendingAuditsCount = document.getElementById('adminStatPendingAudits');
    const activeEnrollmentsCount = document.getElementById('adminStatEnrollments');

    if (!window.db) return;

    // Submissions sorted oldest first
    const allSubmissions = await window.db.getAllPendingSubmissions();
    allSubmissions.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

    const allUsers = await window.db.getAllUsers();

    if (totalUsersCount) totalUsersCount.textContent = allUsers.length;
    if (pendingAuditsCount) {
      const pending = allSubmissions.filter(s => s.status === 'pending_review' || s.status === 'in_progress');
      pendingAuditsCount.textContent = pending.length;
    }
    if (activeEnrollmentsCount) {
      const enrollments = window.db.getLocal('enrollments') || [];
      activeEnrollmentsCount.textContent = enrollments.length;
    }

    // Render Pending Queue
    if (pendingQueueContainer) {
      if (allSubmissions.length === 0) {
        pendingQueueContainer.innerHTML = `<tr><td colspan="6" class="text-center py-4">No submissions in queue.</td></tr>`;
      } else {
        pendingQueueContainer.innerHTML = allSubmissions.map(sub => `
          <tr>
            <td>
              <strong>${sub.appName}</strong><br>
              <span class="text-muted text-sm">${sub.userName || sub.userEmail}</span>
            </td>
            <td><a href="${sub.appUrl}" target="_blank" class="table-link"><i data-lucide="external-link"></i> ${sub.appUrl.replace('https://', '').substring(0, 24)}...</a></td>
            <td><span class="badge badge-outline">${sub.buildMethod}</span></td>
            <td>
              <span class="badge badge-referral badge-ref-${sub.referralSource || 'direct'}">
                ${(sub.referralSource || 'direct').toUpperCase()}
              </span>
            </td>
            <td>
              <span class="badge badge-${sub.status === 'certified' ? 'success' : (sub.status === 'not_certified' ? 'error' : 'warning')}">
                ${sub.status.replace('_', ' ').toUpperCase()}
              </span>
            </td>
            <td class="action-cell">
              <button class="btn btn-sm btn-primary" onclick="window.vibescanReview.openStructuredReview('${sub.id}')">
                <i data-lucide="check-square"></i> Structured Audit Form
              </button>
            </td>
          </tr>
        `).join('');
      }
    }

    // Render Users Table
    if (usersTableContainer) {
      usersTableContainer.innerHTML = allUsers.map(u => `
        <tr>
          <td>
            <strong>${u.displayName || 'Zeerocodes Member'}</strong><br>
            <span class="text-muted text-sm">${u.email}</span>
          </td>
          <td>
            <span class="badge badge-${u.emailVerified ? 'success' : 'warning'}">
              ${u.emailVerified ? 'Verified' : 'Pending'}
            </span>
          </td>
          <td>
            <span class="badge badge-${u.role === 'admin' ? 'teal' : 'outline'}">
              ${(u.role || 'user').toUpperCase()}
            </span>
          </td>
          <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}</td>
          <td>
            <button class="btn btn-outline btn-xs" onclick="window.app.toggleSpecificUserRole('${u.uid}', '${u.role === 'admin' ? 'user' : 'admin'}')">
              Make ${u.role === 'admin' ? 'User' : 'Admin'}
            </button>
          </td>
        </tr>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  async toggleSpecificUserRole(userId, newRole) {
    const user = await window.db.getUser(userId);
    if (user) {
      user.role = newRole;
      await window.db.saveUser(user);
      if (window.toast) window.toast.info(`Updated user role to ${newRole.toUpperCase()}`);
      await this.renderAdminDashboard();
    }
  }

  previewCertBadge(certId) {
    const certs = window.db.getLocal('certifications') || [];
    const cert = certs.find(c => c.certId === certId) || {
      certId: certId || 'VIBECERT-2026-0042',
      appName: 'Sample AI Application',
      grade: 'Grade A (Verified Safe)',
      issuedDate: '2026-08-01'
    };

    const certBadgeModal = document.getElementById('modal-cert-preview');
    if (certBadgeModal) {
      document.getElementById('badgeCertId').textContent = cert.certId;
      document.getElementById('badgeAppName').textContent = cert.appName;
      document.getElementById('badgeGrade').textContent = cert.grade;
      document.getElementById('badgeIssueDate').textContent = cert.issuedDate;
      window.modal.open('modal-cert-preview');
    }
  }

  // =========================================================================
  // 4. FORM BINDINGS & LISTENERS
  // =========================================================================
  bindAuthForms() {
    // Sign In Form
    const loginForm = document.getElementById('auth-form-login');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value;
        try {
          await window.auth.signInWithEmail(email, pass);
          window.modal.closeAll();
          window.location.hash = email.includes('admin') ? '#admin' : '#dashboard';
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Sign Up Form
    const signupForm = document.getElementById('auth-form-signup');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pass = document.getElementById('signupPassword').value;
        try {
          await window.auth.signUpWithEmail(email, pass, name);
          window.modal.closeAll();
          window.location.hash = '#dashboard';
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Google Sign-In Buttons
    document.querySelectorAll('.btn-google-auth').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await window.auth.signInWithGoogle();
          window.modal.closeAll();
          window.location.hash = '#dashboard';
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Sign Out Buttons
    document.querySelectorAll('.btn-sign-out').forEach(btn => {
      btn.addEventListener('click', () => {
        window.auth.signOut();
      });
    });

    // Auth Modal Tab Switchers
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        window.modal.openAuth(tab);
      });
    });

    // Resend Email Verification Button
    const resendBtn = document.getElementById('btnResendVerification');
    if (resendBtn) {
      resendBtn.addEventListener('click', () => {
        window.auth.sendVerificationEmail();
      });
    }

    // Structured Audit Form Submit
    const structForm = document.getElementById('structuredAuditForm');
    if (structForm) {
      structForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
          authHandlingStatus: document.getElementById('auditAuthSelect').value,
          authHandlingNotes: document.getElementById('auditAuthNotes').value,
          dataExposureStatus: document.getElementById('auditDataSelect').value,
          dataExposureNotes: document.getElementById('auditDataNotes').value,
          dependencyRiskStatus: document.getElementById('auditDepSelect').value,
          dependencyRiskNotes: document.getElementById('auditDepNotes').value,
          apiSecurityStatus: document.getElementById('auditApiSelect').value,
          apiSecurityNotes: document.getElementById('auditApiNotes').value,
          overallOutcome: document.getElementById('auditOutcomeSelect').value,
          summaryNotes: document.getElementById('auditSummaryNotes').value
        };

        await window.vibescanReview.submitAuditReport(formData);
      });
    }
  }

  bindIntakeForms() {
    // VibeScan Submission Intake Form (triggers Payment gate)
    const vibescanForm = document.getElementById('vibescanIntakeForm');
    if (vibescanForm) {
      vibescanForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!window.auth || !window.auth.isAuthenticated()) {
          window.modal.openAuth('signup');
          return;
        }

        const user = window.auth.getUser();
        const appName = document.getElementById('vibescanAppName').value;
        const appUrl = document.getElementById('vibescanAppUrl').value;
        const techStack = document.getElementById('vibescanTechStack').value;
        const buildMethod = document.getElementById('vibescanBuildMethod').value;
        const refSource = document.getElementById('vibescanReferralSource').value || 'direct';
        const notes = document.getElementById('vibescanNotes').value;

        window.modal.closeAll();

        // Launch Payment Checkout before entering the admin queue
        if (window.payments) {
          window.payments.openCheckoutModal({
            type: 'vibescan_audit',
            itemId: 'audit-comprehensive',
            itemTitle: `VibeScan Security Audit: ${appName}`,
            amountNGN: 120000,
            amountUSD: 80,
            metadata: {
              userName: user.displayName,
              appName: appName,
              appUrl: appUrl,
              techStack: techStack,
              buildMethod: buildMethod,
              referralSource: refSource,
              notes: notes
            }
          });
        }
      });
    }

    // Firebase Config Form
    const fbConfigForm = document.getElementById('firebaseConfigForm');
    if (fbConfigForm) {
      fbConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const apiKey = document.getElementById('fbCfgApiKey').value.trim();
        const authDomain = document.getElementById('fbCfgAuthDomain').value.trim();
        const projectId = document.getElementById('fbCfgProjectId').value.trim();
        const appId = document.getElementById('fbCfgAppId').value.trim();

        window.zeerocodesFirebase.saveConfig({
          apiKey, authDomain, projectId, appId,
          storageBucket: `${projectId}.appspot.com`,
          messagingSenderId: '1234567890'
        });
        window.modal.closeAll();
      });
    }
  }

  bindContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        if (window.toast) {
          window.toast.success(`Thank you, ${name}! Your inquiry has been received. We'll reply within 1 business day.`);
        }
        contactForm.reset();
      });
    }
  }

  bindMobileNavigation() {
    const toggleBtns = document.querySelectorAll('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer');
    const overlay = document.querySelector('.mobile-nav-overlay');

    if (toggleBtns && drawer && overlay) {
      toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          drawer.classList.toggle('active');
          overlay.classList.toggle('active');
        });
      });

      overlay.addEventListener('click', () => {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
      });
    }
  }

  bindActionTriggers() {
    // Delegated click handler for actions anywhere in the DOM
    document.addEventListener('click', (e) => {
      // 1. Calendly / Studio Booking trigger
      if (e.target.closest('.trigger-calendly-booking')) {
        if (window.modal) window.modal.openBooking();
      }

      // 2. Command Palette trigger
      if (e.target.closest('.cmd-palette-trigger')) {
        if (window.modal) window.modal.open('modal-command-palette');
      }

      // 3. Quick role toggle
      if (e.target.closest('.btn-toggle-role')) {
        if (window.auth) window.auth.toggleRole();
      }

      // 4. Reset sample seed data
      if (e.target.closest('.btn-reset-demo-data')) {
        if (confirm("Reset local sandbox data to fresh seed state?")) {
          window.db.resetToSampleData();
          if (window.toast) window.toast.info("Database reset to initial sample state.");
          window.location.reload();
        }
      }
    });

    // Command Palette Trigger
    this.bindCommandPalette();

    // Academy Filters & Search
    this.bindAcademyFilters();

    // Dashboard Tabs
    this.bindDashboardTabs();

    // Back to Top Button
    this.bindBackToTop();

    // Initialize Interactive Calculators & Visualizers
    setTimeout(() => {
      if (typeof window.initRoiCalculator === 'function') {
        window.initRoiCalculator();
      }
      if (typeof window.initEncryptionVisualizer === 'function') {
        window.initEncryptionVisualizer();
      }
    }, 100);
  }

  // =========================================================================
  // 4. COMMAND PALETTE (CMD+K / CTRL+K)
  // =========================================================================
  bindCommandPalette() {
    const paletteModal = document.getElementById('modal-command-palette');
    const searchInput = document.getElementById('cmdSearchInput');
    const resultsContainer = document.getElementById('cmdResultsList');

    const openPalette = () => {
      if (window.modal) window.modal.open('modal-command-palette');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 80);
        renderPaletteItems('');
      }
    };

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
      }
    });

    // Header search button click
    document.querySelectorAll('.cmd-palette-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openPalette();
      });
    });

    const paletteActions = [
      { title: 'Browse Academy Courses', category: 'Navigation', icon: 'graduation-cap', action: () => { window.location.hash = '#academy'; window.modal.closeAll(); } },
      { title: 'Automation Studio Consulting', category: 'Navigation', icon: 'workflow', action: () => { window.location.hash = '#studio'; window.modal.closeAll(); } },
      { title: 'VibeScan Security Audits', category: 'Navigation', icon: 'shield-check', action: () => { window.location.hash = '#vibescan'; window.modal.closeAll(); } },
      { title: 'My Unified Dashboard', category: 'Navigation', icon: 'layout-dashboard', action: () => { window.location.hash = '#dashboard'; window.modal.closeAll(); } },
      { title: 'Admin Review Queue', category: 'Navigation', icon: 'shield-alert', action: () => { window.location.hash = '#admin'; window.modal.closeAll(); } },
      { title: 'Calculate AI Automation ROI', category: 'Interactive Tools', icon: 'calculator', action: () => { window.location.hash = '#studio'; window.modal.closeAll(); document.getElementById('roiCalculatorSection')?.scrollIntoView({ behavior: 'smooth' }); } },
      { title: 'Launch Interactive Codebase Scanner', category: 'Security Tools', icon: 'scan', action: () => { window.modal.closeAll(); window.vibescanEngine.openLiveScannerModal(); } },
      { title: 'Verify VibeCert™ Security Badge', category: 'Security Tools', icon: 'check-circle-2', action: () => { window.modal.closeAll(); window.vibescanEngine.openPublicVerifyPortal('VIBECERT-2026-0042'); } },
      { title: 'Book Workflow Discovery Session', category: 'Studio Action', icon: 'calendar', action: () => { window.modal.closeAll(); window.modal.openBooking('Custom AI Automation Consulting'); } },
      { title: 'Toggle User / Admin Role', category: 'Developer', icon: 'user-check', action: () => { window.auth.toggleRole(); window.modal.closeAll(); } },
      { title: 'Reset Sandbox Seed Data', category: 'Developer', icon: 'refresh-cw', action: () => { window.db.resetToSampleData(); window.modal.closeAll(); window.location.reload(); } }
    ];

    const renderPaletteItems = (filterText) => {
      if (!resultsContainer) return;
      const lower = filterText.toLowerCase().trim();
      const filtered = paletteActions.filter(item => item.title.toLowerCase().includes(lower) || item.category.toLowerCase().includes(lower));

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.88rem;">No matching commands found.</div>`;
        return;
      }

      resultsContainer.innerHTML = filtered.map((item, idx) => `
        <div class="cmd-item" data-idx="${idx}" onclick="window.app.executePaletteAction(${idx})">
          <div class="cmd-item-left">
            <i data-lucide="${item.icon}"></i>
            <span>${item.title}</span>
          </div>
          <span class="cmd-item-badge">${item.category}</span>
        </div>
      `).join('');

      this.currentFilteredPalette = filtered;
      if (window.lucide) window.lucide.createIcons();
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderPaletteItems(e.target.value);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && this.currentFilteredPalette && this.currentFilteredPalette.length > 0) {
          e.preventDefault();
          this.executePaletteAction(0);
        }
      });
    }
  }

  executePaletteAction(idx) {
    if (this.currentFilteredPalette && this.currentFilteredPalette[idx]) {
      this.currentFilteredPalette[idx].action();
    }
  }

  // =========================================================================
  // 5. ACADEMY COURSE CATALOG FILTERS & SEARCH
  // =========================================================================
  bindAcademyFilters() {
    const searchInput = document.getElementById('academySearchInput');
    const categoryPills = document.querySelectorAll('.category-pill');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterAcademyCourses(e.target.value, this.currentAcademyCategory || 'all');
      });
    }

    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.getAttribute('data-cat') || 'all';
        this.currentAcademyCategory = cat;
        const searchVal = document.getElementById('academySearchInput')?.value || '';
        this.filterAcademyCourses(searchVal, cat);
      });
    });
  }

  async filterAcademyCourses(query = '', category = 'all') {
    const container = document.getElementById('academyCoursesGrid');
    if (!container || !window.db) return;

    let courses = await window.db.getCourses();
    const q = query.toLowerCase().trim();

    if (category !== 'all') {
      courses = courses.filter(c => {
        const str = `${c.title} ${c.shortDesc} ${c.slug}`.toLowerCase();
        if (category === 'n8n') return str.includes('n8n') || str.includes('automation');
        if (category === 'whatsapp') return str.includes('whatsapp') || str.includes('bot');
        if (category === 'vibecoding') return str.includes('vibe') || str.includes('cursor') || str.includes('security');
        if (category === 'saas') return str.includes('saas') || str.includes('prompt');
        return true;
      });
    }

    if (q) {
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.shortDesc.toLowerCase().includes(q) || 
        c.modules.some(m => m.toLowerCase().includes(q))
      );
    }

    if (courses.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; background:var(--surface-white); padding:3rem; border-radius:var(--radius-md); text-align:center; border:1px solid var(--mint-border);">
          <i data-lucide="search" style="width:36px; height:36px; color:var(--text-muted); margin-bottom:0.75rem;"></i>
          <h4>No matching courses found</h4>
          <p style="color:var(--text-muted); font-size:0.9rem;">Try adjusting your search terms or category filter.</p>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('academySearchInput').value=''; window.app.filterAcademyCourses('', 'all');">
            Clear Filters
          </button>
        </div>
      `;
    } else {
      container.innerHTML = courses.map(course => `
        <div class="course-card">
          <div class="course-card-header">
            <div class="course-badge">${course.level}</div>
            <div class="course-duration"><i data-lucide="clock"></i> ${course.duration}</div>
          </div>
          <h3 class="course-title">${course.title}</h3>
          <p class="course-short-desc">${course.shortDesc}</p>
          
          <div class="curriculum-preview">
            <div class="curriculum-toggle" onclick="this.nextElementSibling.classList.toggle('active')">
              <span><i data-lucide="layers"></i> Curriculum Outline (${course.modules.length} Modules)</span>
              <i data-lucide="chevron-down"></i>
            </div>
            <ul class="curriculum-list">
              ${course.modules.map(mod => `<li><i data-lucide="check-circle-2"></i> ${mod}</li>`).join('')}
            </ul>
          </div>

          <div class="course-card-footer">
            <div class="course-pricing">
              <span class="price-ngn">₦${course.priceNGN.toLocaleString()}</span>
              <span class="price-usd">($${course.priceUSD})</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.app.handleEnrollCourse('${course.id}')">
              <i data-lucide="credit-card"></i> Enroll & Checkout
            </button>
          </div>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 6. DASHBOARD TABS
  // =========================================================================
  bindDashboardTabs() {
    const tabBtns = document.querySelectorAll('.dash-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = btn.getAttribute('data-tab') || 'overview';
        this.switchDashboardTab(targetTab);
      });
    });
  }

  switchDashboardTab(tabId) {
    const sections = document.querySelectorAll('.dash-section-box');
    if (tabId === 'overview') {
      sections.forEach(s => s.classList.remove('d-none'));
    } else {
      sections.forEach(s => {
        if (s.getAttribute('data-dash-section') === tabId) {
          s.classList.remove('d-none');
        } else {
          s.classList.add('d-none');
        }
      });
    }
  }

  // =========================================================================
  // 7. BACK TO TOP FLOATING BUTTON
  // =========================================================================
  bindBackToTop() {
    const btn = document.getElementById('btnBackToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ZeerocodesApp();
});

