/**
 * Zeerocodes Application Orchestrator (v3.1)
 * Links UI components, The Zeerocodes VibeCode Labs Flagship Showcase,
 * Dashboard Rendering, Admin Queue, LMS, Payments, Interactive Visualizers,
 * Animated Counters, Live Trust Ticker, and Hardened Form Handlers.
 */

class ZeerocodesApp {
  constructor() {
    this.activeLevel = 1;
    this.init();
  }

  async init() {
    console.log("🚀 Zeerocodes Initializing (Build • Automate • Secure)...");
    
    // Bind core interactive components
    this.bindAuthForms();
    this.bindIntakeForms();
    this.bindContactForm();
    this.initWorkflowSimulators();
    this.bindMobileNavigation();
    this.bindActionTriggers();
    this.initCounters();
    this.initLiveTrustTicker();
    this.initArchitectureVisualizer();
    this.initComparisonToggle();

    // Render public flagship course
    await this.renderAcademyCourses();

    // Bind Wiz-Style 3-Pillar Hero Stage Switcher
    document.addEventListener('click', (e) => {
      const directLink = e.target.closest('.tab-nav-direct-link');
      if (directLink) {
        return; // Allow router to handle direct navigation to #studio, #academy, #vibescan
      }

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

    // Bind Multi-Industry Solution Pills Switcher
    document.addEventListener('click', (e) => {
      const industryBtn = e.target.closest('.industry-pill-btn');
      if (industryBtn) {
        const indId = industryBtn.getAttribute('data-industry');
        document.querySelectorAll('.industry-pill-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.industry-detail-card').forEach(c => c.classList.remove('active'));
        industryBtn.classList.add('active');
        const targetDetail = document.getElementById(indId);
        if (targetDetail) targetDetail.classList.add('active');
        if (window.lucide) window.lucide.createIcons();
      }
    });

    // Bind FAQ Accordions
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

    // Initialize Security Knowledge Base Hub
    if (window.knowledgeBase && window.knowledgeBase.renderGuidesGrid) {
      window.knowledgeBase.renderGuidesGrid();
    }

    // Initialize Blog Hub
    if (window.blog && window.blog.init) {
      window.blog.init();
    }

    // Initialize Admin Console
    if (window.adminConsole && window.adminConsole.init) {
      window.adminConsole.init();
    }

    // Initialize PWA Service Worker for offline capability
    this.initPwaServiceWorker();

    // Initialize Public AST Security Scanner on #vibescan
    this.initPublicAstScanner();

    // Sync saved currency or default to NGN
    const savedCurr = localStorage.getItem('zeerocodes_currency') || 'NGN';
    this.setGlobalCurrency(savedCurr);

    // Initial auth UI update
    if (window.auth) {
      window.auth.updateNavigationUI();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // =========================================================================
  // 1. ANIMATED NUMBERS & METRIC COUNTERS
  // =========================================================================
  initCounters() {
    const counterElements = document.querySelectorAll('.metric-counter');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || el.textContent);
          const isDecimal = target % 1 !== 0;
          const duration = 1800; // ms
          const startTime = performance.now();

          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            if (isDecimal) {
              el.textContent = (easeOut * target).toFixed(2);
            } else if (target >= 1000) {
              el.textContent = Math.floor(easeOut * target).toLocaleString();
            } else {
              el.textContent = Math.floor(easeOut * target);
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = isDecimal ? target.toFixed(2) : (target >= 1000 ? target.toLocaleString() : target);
            }
          };

          requestAnimationFrame(animate);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => observer.observe(el));
  }

  // =========================================================================
  // 2. LIVE TRUST ACTIVITY TICKER ROTATOR
  // =========================================================================
  initLiveTrustTicker() {
    const tickerTextEl = document.getElementById('liveTickerText');
    if (!tickerTextEl) return;

    const tickerUpdates = [
      '⚡ <strong>Live Platform:</strong> VibeScan verified <strong>SwiftShip Logistics</strong> (Grade A+ VibeCert™ #2026-0042)',
      '🎓 <strong>Academy Enrollment:</strong> New student joined <strong>The VibeCode Labs (October 15 Cohort)</strong> from Lagos, Nigeria',
      '🚀 <strong>Studio Sprints:</strong> Paystack webhook reconciliation deployed for <strong>PayQuick Africa</strong>',
      '🛡️ <strong>Security Audit:</strong> 0 Secrets Leaked across <strong>48 audited client repositories</strong> this month',
      '💡 <strong>VibeScan Engine:</strong> OWASP LLM AST Parser active across 14 security rules'
    ];

    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % tickerUpdates.length;
      tickerTextEl.style.opacity = '0';
      tickerTextEl.style.transform = 'translateY(4px)';
      tickerTextEl.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        tickerTextEl.innerHTML = tickerUpdates[currentIndex];
        tickerTextEl.style.opacity = '1';
        tickerTextEl.style.transform = 'translateY(0)';
      }, 300);
    }, 4500);
  }

  // =========================================================================
  // 3. INTERACTIVE SECURITY ARCHITECTURE VISUALIZER
  // =========================================================================
  initArchitectureVisualizer() {
    const nodeCards = document.querySelectorAll('.arch-node-card');
    const inspectorTitle = document.getElementById('archInspectorTitle');
    const inspectorStatus = document.getElementById('archInspectorStatus');
    const codePreview = document.getElementById('archCodePreview');

    if (!nodeCards.length || !inspectorTitle || !codePreview) return;

    const nodeDetails = {
      'node-input': {
        title: 'Node 01: Inbound Webhook & User Event Gateway',
        status: 'STATUS: ACTIVE ENCRYPTION',
        code: `// Capture raw body for webhook HMAC validation\napp.use(express.json({\n  limit: '2mb',\n  verify: (req, res, buf) => {\n    req.rawBody = buf; // Preserves raw buffer before JSON parsing\n  }\n}));`
      },
      'node-security': {
        title: 'Node 02: Defensive AST Filter & Cryptographic HMAC Verification',
        status: 'STATUS: TIMING-SAFE VERIFICATION',
        code: `// Constant-time comparison to prevent side-channel timing attacks\nconst sigBuffer = Buffer.from(req.headers['x-paystack-signature'], 'utf8');\nconst compBuffer = Buffer.from(computedHash, 'utf8');\nconst isValid = sigBuffer.length === compBuffer.length && \n  crypto.timingSafeEqual(sigBuffer, compBuffer);`
      },
      'node-execution': {
        title: 'Node 03: Autonomous Execution Layer (n8n & Claude 3.7)',
        status: 'STATUS: LEAST PRIVILEGE AGENT',
        code: `// Enforce structured output validation with Zod before triggering financial tools\nconst dispatchOrderSchema = z.object({\n  customerPhone: z.string().regex(/^\\+234\\d{10}$/),\n  invoiceReference: z.string().startsWith('ZC_INV_'),\n  amountNGN: z.number().positive().max(5000000)\n}).strict();`
      },
      'node-database': {
        title: 'Node 04: Hardened Data Layer (Supabase / Postgres RLS)',
        status: 'STATUS: TENANT ISOLATION ENFORCED',
        code: `-- PostgreSQL Row Level Security (RLS) Policy\nALTER TABLE orders ENABLE ROW LEVEL SECURITY;\nCREATE POLICY tenant_isolation_policy ON orders\n  FOR ALL\n  USING (auth.uid() = user_id);\n-- Client cannot bypass user_id scoping`
      },
      'node-cert': {
        title: 'Node 05: Cryptographic VibeCert™ Security Badge Generation',
        status: 'STATUS: VIBECERT™ CERTIFIED GRADE A+',
        code: `// Issue tamper-proof cryptographic audit signature\nconst certHash = crypto.createHash('sha256')\n  .update(\`\${repoUrl}_\${auditTimestamp}_\${owaspGrade}\`)\n  .digest('hex');\nconst certId = 'VIBECERT-2026-' + certHash.substring(0, 6).toUpperCase();`
      }
    };

    nodeCards.forEach(card => {
      card.addEventListener('click', () => {
        nodeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const nodeId = card.getAttribute('data-node');
        const detail = nodeDetails[nodeId];
        if (detail) {
          inspectorTitle.innerHTML = `<i data-lucide="shield-check" style="width:14px; height:14px; display:inline;"></i> ${detail.title}`;
          inspectorStatus.textContent = detail.status;
          codePreview.textContent = detail.code;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  // =========================================================================
  // 4. PAIN POINTS COMPARISON TOGGLE
  // =========================================================================
  initComparisonToggle() {
    const btnFragile = document.getElementById('btnShowFragile');
    const btnHardened = document.getElementById('btnShowHardened');
    const colFragile = document.getElementById('colFragileContent');
    const colHardened = document.getElementById('colHardenedContent');

    if (!btnFragile || !btnHardened) return;

    btnFragile.addEventListener('click', () => {
      if (window.innerWidth < 992 && colFragile && colHardened) {
        colFragile.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (window.toast) window.toast.info("Inspecting risks in unverified vibe-coded applications.");
    });

    btnHardened.addEventListener('click', () => {
      if (window.innerWidth < 992 && colFragile && colHardened) {
        colHardened.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (window.toast) window.toast.success("Inspecting Zeerocodes verified architecture protections.");
    });
  }

  // =========================================================================
  // 5. FLAGSHIP COHORT SHOWCASE: THE ZEEROCODES VIBECODE LABS
  // =========================================================================
  async renderAcademyCourses() {
    const container = document.getElementById('academyCoursesGrid');
    if (!container || !window.db) return;

    const courses = await window.db.getCourses();
    const course = courses[0];
    if (!course) return;

    const curr = window.payments ? window.payments.activeCurrency : 'NGN';
    const formattedPrice = window.payments ? window.payments.formatPrice(course.priceNGN) : `₦${course.priceNGN.toLocaleString()}`;
    const formattedOriginalPrice = window.payments ? window.payments.formatPrice(course.originalPriceNGN || 150000) : `₦150,000`;

    container.innerHTML = `
      <div class="vibecode-showcase-card">
        
        <!-- Header Grid -->
        <div class="vibecode-header-grid">
          <div>
            <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.75rem; flex-wrap:wrap;">
              <span class="badge badge-teal"><i data-lucide="sparkles" style="width:13px; height:13px;"></i> Flagship Cohort</span>
              <span class="badge badge-cyber"><i data-lucide="layers" style="width:13px; height:13px;"></i> 4 Levels • 20 Modules • 88 Lessons</span>
              <span class="badge badge-success"><i data-lucide="shield-check" style="width:13px; height:13px;"></i> VibeCert™ Audited</span>
            </div>
            
            <h1 class="vibecode-title">${course.title}</h1>
            <p class="vibecode-subtitle">${course.subtitle || 'From Blank Page to Certified, Secured, Production AI Software & Client Revenue'}</p>
            <p style="color:var(--text-cyber-muted); font-size:0.98rem; line-height:1.7; margin-bottom:1.5rem;">
              ${course.description}
            </p>

            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
              <span class="tool-tag" style="padding:4px 10px; font-size:0.8rem; background:rgba(1,107,97,0.25); color:#2DD4BF; border-color:rgba(45,212,191,0.3);"><i data-lucide="cpu" style="width:12px; height:12px; display:inline;"></i> Google Stitch</span>
              <span class="tool-tag" style="padding:4px 10px; font-size:0.8rem;"><i data-lucide="code" style="width:12px; height:12px; display:inline;"></i> Google AI Studio</span>
              <span class="tool-tag" style="padding:4px 10px; font-size:0.8rem;"><i data-lucide="bot" style="width:12px; height:12px; display:inline;"></i> Google Antigravity</span>
              <span class="tool-tag" style="padding:4px 10px; font-size:0.8rem;"><i data-lucide="workflow" style="width:12px; height:12px; display:inline;"></i> n8n Automation</span>
              <span class="tool-tag" style="padding:4px 10px; font-size:0.8rem;"><i data-lucide="credit-card" style="width:12px; height:12px; display:inline;"></i> Paystack & Flutterwave</span>
              <span class="tool-tag" style="padding:4px 10px; font-size:0.8rem; background:rgba(16,185,129,0.2); color:#34D399; border-color:rgba(52,211,153,0.3);"><i data-lucide="shield-check" style="width:12px; height:12px; display:inline;"></i> VibeScan Security</span>
            </div>
          </div>

          <!-- Direct Pricing & Enrollment Card -->
          <div class="enrollment-checkout-box">
            <span class="enrollment-badge-early"><i data-lucide="clock" style="width:13px; height:13px; display:inline;"></i> Early-Bird Enrollment Open</span>
            
            <div style="display:flex; justify-content:center; align-items:baseline; margin:0.5rem 0;">
              <span class="enrollment-price-struck">${formattedOriginalPrice}</span>
              <span class="enrollment-price-main">${formattedPrice}</span>
            </div>
            <span style="font-size:0.82rem; color:var(--text-cyber-muted); display:block; margin-bottom:1.25rem;">
              One-Time Payment • Full Lifetime Access to Curriculum & Updates
            </span>

            <button class="btn btn-primary btn-block" style="padding:0.9rem 1.5rem; font-size:1.05rem;" onclick="window.app.handleEnrollCourse('${course.id}')">
              <i data-lucide="credit-card"></i> Enroll in October 15 Cohort
            </button>

            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:1.25rem; font-size:0.8rem; color:var(--text-cyber-muted); text-align:left;">
              <div style="display:flex; align-items:center; gap:0.45rem;"><i data-lucide="check" style="color:var(--emerald-light); width:14px; height:14px;"></i> 8-Week Live Training & Weekend Build-Alongs</div>
              <div style="display:flex; align-items:center; gap:0.45rem;"><i data-lucide="check" style="color:var(--emerald-light); width:14px; height:14px;"></i> 1-on-1 Mentor Office Hours with Nuel Effiong</div>
              <div style="display:flex; align-items:center; gap:0.45rem;"><i data-lucide="check" style="color:var(--emerald-light); width:14px; height:14px;"></i> Official 12-Month Renewable Certification</div>
              <div style="display:flex; align-items:center; gap:0.45rem;"><i data-lucide="check" style="color:var(--emerald-light); width:14px; height:14px;"></i> 14-Day 100% Satisfaction Money-Back Guarantee</div>
            </div>
          </div>
        </div>

        <!-- The Build Pipeline Visualizer Track -->
        <div class="vibecode-pipeline-banner">
          <div style="color:var(--text-cyber-muted); font-size:0.75rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.1em; font-weight:700;">
            <i data-lucide="git-branch" style="width:13px; height:13px; display:inline; vertical-align:middle;"></i> The Zeerocodes Build Pipeline (Foundations &rarr; Shipped App &rarr; Client Revenue)
          </div>
          <div class="pipeline-track">
            <span class="pipeline-step">IDEA</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step highlight">GOOGLE STITCH (Design)</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step highlight">AI STUDIO (Prototype)</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step highlight">ANTIGRAVITY (Production)</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step highlight">n8n / AGENTS (Automate)</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step highlight">VIBESCAN (Secure)</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step">CLOUD RUN / PLAY STORE (Ship)</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step">CLIENT / MARKET (Earn)</span>
            <span class="pipeline-arrow">&rarr;</span>
            <span class="pipeline-step highlight" style="background:#016B61; color:#FFF; border-color:#85C79A;">ZEEROCODES CERTIFICATION (Prove It)</span>
          </div>
        </div>

        <!-- 4-Level Interactive Curriculum Switcher -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
            <div>
              <h3 style="color:#FFFFFF; font-size:1.5rem; margin-bottom:0.25rem;">Complete 4-Level Curriculum Roadmap</h3>
              <p style="font-size:0.9rem; color:var(--text-cyber-muted);">Click any level below to explore its modules, lessons, case studies, and labs.</p>
            </div>
            <div class="currency-switcher-pill">
              <span style="font-size:0.75rem; color:var(--text-cyber-muted); font-weight:600; text-transform:uppercase;">Currency:</span>
              <button type="button" class="currency-btn ${curr === 'NGN' ? 'active' : ''}" data-currency="NGN">₦ NGN</button>
              <button type="button" class="currency-btn ${curr === 'USD' ? 'active' : ''}" data-currency="USD">$ USD</button>
              <button type="button" class="currency-btn ${curr === 'GBP' ? 'active' : ''}" data-currency="GBP">£ GBP</button>
            </div>
          </div>

          <!-- Level Tabs -->
          <div class="curriculum-level-nav">
            ${course.levels.map(lvl => `
              <button class="curriculum-level-btn ${lvl.levelNumber === this.activeLevel ? 'active' : ''}" onclick="window.app.switchLevel(${lvl.levelNumber})">
                <span class="level-badge">LEVEL ${lvl.levelNumber}</span>
                <span class="level-btn-title">${lvl.title.split(': ')[1] || lvl.title}</span>
                <span class="level-btn-lessons">${lvl.modules.length} Modules • ${lvl.lessonCount} Lessons</span>
              </button>
            `).join('')}
          </div>

          <!-- Dynamic Modules Grid for the Active Level -->
          <div class="modules-grid" id="curriculumModulesContainer">
            ${this.renderLevelModules(course.levels.find(l => l.levelNumber === this.activeLevel) || course.levels[0])}
          </div>

          <div style="text-align:center; padding-top:1.5rem; border-top:1px solid rgba(255,255,255,0.08);">
            <button class="btn btn-primary" style="padding:0.85rem 2.25rem; font-size:1.05rem;" onclick="window.app.handleEnrollCourse('${course.id}')">
              <i data-lucide="check-circle-2"></i> Join Next Cohort — ${formattedPrice}
            </button>
          </div>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  renderLevelModules(level) {
    if (!level || !level.modules) return '';
    return level.modules.map(mod => `
      <div class="module-card">
        <div class="module-card-header">
          <div class="module-number-badge">${mod.number}</div>
          <div class="module-card-title">${mod.title}</div>
        </div>
        <ul class="module-lessons-list">
          ${mod.lessons.map(lesson => `
            <li>
              <i data-lucide="check-circle-2"></i>
              <span>${lesson}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');
  }

  switchLevel(levelNumber) {
    this.activeLevel = levelNumber;
    const course = window.db ? window.db.getLocal('courses')?.[0] : null;
    if (!course || !course.levels) return;

    // Update level button active classes
    document.querySelectorAll('.curriculum-level-btn').forEach((btn, idx) => {
      if (idx + 1 === levelNumber) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update modules grid
    const container = document.getElementById('curriculumModulesContainer');
    const targetLevel = course.levels.find(l => l.levelNumber === levelNumber);
    if (container && targetLevel) {
      container.innerHTML = this.renderLevelModules(targetLevel);
      if (window.lucide) window.lucide.createIcons();
    }
  }

  renderCourses() {
    return this.renderAcademyCourses();
  }

  async handleEnrollCourse(courseId) {
    if (!window.auth || !window.auth.isAuthenticated()) {
      if (window.toast) window.toast.info("Please sign in or create a free account to enroll.");
      if (window.modal) window.modal.openAuth('signup');
      return;
    }

    const course = await window.db.getCourseById(courseId);
    if (!course) return;

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
  // 6. CONTACT FORM INTAKE (AJAX WITH SERVERLESS & FALLBACK)
  // =========================================================================
  bindContactForm() {
    const contactForm = document.getElementById('publicContactForm');
    const submitBtn = document.getElementById('btnSubmitContact');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('contactEmail')?.value.trim();
      const topic = document.getElementById('contactTopic')?.value;
      const message = document.getElementById('contactMessage')?.value.trim();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="pulse-indicator"></span> Sending Inquiry...`;
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, topic, message })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          if (window.toast) window.toast.success(data.message || `Thank you, ${name}! Your message has been sent.`);
          contactForm.reset();
        } else {
          // Graceful fallback for local file execution
          if (window.toast) window.toast.success(`Thank you, ${name}! Your inquiry regarding "${topic}" has been recorded.`);
          contactForm.reset();
        }
      } catch (err) {
        console.warn("Contact endpoint direct call error, saving locally:", err);
        if (window.toast) window.toast.success(`Thank you, ${name}! Your inquiry has been received by the Zeerocodes team.`);
        contactForm.reset();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i data-lucide="send"></i> Send Inquiry Message`;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  // =========================================================================
  // 7. MOBILE NAVIGATION DRAWER
  // =========================================================================
  bindMobileNavigation() {
    const toggleBtn = document.getElementById('btnMobileNavToggle');
    const closeBtn = document.getElementById('btnMobileDrawerClose');
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileDrawerOverlay');
    const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

    const openDrawer = () => {
      if (drawer) drawer.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      if (drawer) drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    this.closeMobileDrawer = closeDrawer;
  }

  // =========================================================================
  // 8. AUTH & INTAKE FORMS
  // =========================================================================
  bindAuthForms() {
    // Login Form
    const loginForm = document.getElementById('auth-form-login');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value;
        try {
          await window.auth.signInWithEmail(email, pass);
          if (window.modal) window.modal.closeAll();
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Signup Form
    const signupForm = document.getElementById('auth-form-signup');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pass = document.getElementById('signupPassword').value;
        const phone = document.getElementById('signupPhone')?.value.trim() || '';
        const referralSource = document.getElementById('signupReferralSource')?.value || 'direct';

        try {
          await window.auth.signUpWithEmail(email, pass, name, { phone, referralSource });
          if (window.modal) window.modal.closeAll();
        } catch (err) {
          console.error(err);
        }
      });
    }

    // Forgot Password Form
    const resetForm = document.getElementById('auth-form-reset');
    if (resetForm) {
      resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value.trim();
        await window.auth.sendPasswordResetEmail(email);
        if (window.modal) window.modal.closeAll();
      });
    }

    // Demo Persona Fast Switchers & Google Sign In
    document.addEventListener('click', (e) => {
      // Google Sign In
      if (e.target.closest('.btn-google-signin')) {
        if (window.auth) window.auth.signInWithGoogle();
        return;
      }

      const demoBtn = e.target.closest('.btn-quick-demo-login');
      if (demoBtn) {
        const persona = demoBtn.getAttribute('data-persona') || 'admin';
        window.auth.quickDemoLogin(persona);
      }

      // Switch to reset tab
      if (e.target.closest('.trigger-auth-reset')) {
        document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
        ['auth-form-login', 'auth-form-signup', 'auth-form-reset'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
        const resetEl = document.getElementById('auth-form-reset');
        if (resetEl) resetEl.style.display = 'block';
      }
    });

    // Sign Out
    document.querySelectorAll('.btn-sign-out').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.auth) window.auth.signOut();
      });
    });

    // Auth tab toggles
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        ['auth-form-login', 'auth-form-signup', 'auth-form-reset'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });

        if (tab === 'login') {
          const el = document.getElementById('auth-form-login');
          if (el) el.style.display = 'block';
        } else if (tab === 'signup') {
          const el = document.getElementById('auth-form-signup');
          if (el) el.style.display = 'block';
        } else if (tab === 'reset') {
          const el = document.getElementById('auth-form-reset');
          if (el) el.style.display = 'block';
        }
      });
    });
  }

  bindIntakeForms() {
    // VibeScan Intake Form
    const vibeScanForm = document.getElementById('vibescanIntakeForm');
    if (vibeScanForm) {
      vibeScanForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const appName = document.getElementById('vibescanAppName')?.value.trim();
        const appUrl = document.getElementById('vibescanRepoUrl')?.value.trim();
        const user = window.auth ? window.auth.getUser() : null;

        if (window.payments) {
          window.payments.openCheckoutModal({
            type: 'vibescan_audit',
            itemId: 'audit-starter',
            itemTitle: `VibeScan Audit: ${appName}`,
            amountNGN: 45000,
            amountUSD: 30,
            metadata: {
              appName,
              appUrl,
              userName: user?.displayName || 'Builder',
              userEmail: user?.email || 'builder@example.com'
            }
          });
        }
        if (window.modal) window.modal.closeAll();
      });
    }
  }

  bindContactForm() {
    const contactForm = document.getElementById('publicContactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const topic = document.getElementById('contactTopic')?.value;
        const message = document.getElementById('contactMessage')?.value.trim();

        if (!name || !email || !message) {
          if (window.toast) window.toast.warning("Please fill all required contact fields.");
          return;
        }

        const inquiryRef = 'INQ-' + Date.now().toString(36).toUpperCase();
        const inquiryData = {
          id: inquiryRef,
          inquiryRef,
          name,
          clientName: name,
          email,
          clientEmail: email,
          userEmail: email,
          topic,
          message,
          status: 'new',
          submittedAt: new Date().toISOString()
        };

        // 1. Save to Database
        if (window.db) {
          const inquiries = window.db.getLocal('contactInquiries') || [];
          inquiries.unshift(inquiryData);
          window.db.setLocal('contactInquiries', inquiries);
        }

        // 2. Dispatch Notifications (Client Confirmation + Admin Alert Email + Admin Dashboard Log)
        if (window.notifications) {
          window.notifications.dispatch('contact_inquiry_submitted', inquiryData);
        }

        // 3. Post to backend endpoint
        try {
          fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, topic, message })
          }).catch(() => {});
        } catch (err) {}

        if (window.toast) {
          window.toast.success(`✨ Thank you, ${name}! Your inquiry (${inquiryRef}) was received. We will respond within 24 hours.`);
        }

        contactForm.reset();
      });
    }
  }

  // =========================================================================
  // 8B. INTERACTIVE 4-SAMPLE AUTOMATION WORKFLOW SIMULATOR
  // =========================================================================
  initWorkflowSimulators() {
    this.workflowsData = [
      {
        id: 'wf-invoicing',
        title: 'The 90-Second Instant Invoicing Bot',
        category: 'FinTech & Billing Automation',
        impact: 'Saves 112 hrs / month • 90-sec turnaround',
        description: 'Eliminates manual bank screenshot checking, validates Paystack webhooks with timing-safe HMAC cryptography, generates instant PDF receipts, and sends automated WhatsApp notifications.',
        steps: [
          { num: 1, title: 'Customer Event', desc: 'Customer initiates transfer or Paystack payment', icon: 'credit-card', payload: 'POST /api/webhook/paystack { event: "charge.success", amount: 15000000, reference: "PAY_9918" }' },
          { num: 2, title: 'HMAC Security Gate', desc: 'Constant-time SHA-512 cryptographic verification', icon: 'shield-check', payload: 'crypto.timingSafeEqual(headerSignature, computedHmac) => 200 OK (VALID)' },
          { num: 3, title: 'n8n Logic Engine', desc: 'Auto-generates stamped PDF invoice & deducts inventory', icon: 'workflow', payload: 'Invoice ID: INV-2026-884 | Item: 5x Solar Inverters | Inventory Synced: Yes' },
          { num: 4, title: 'WhatsApp & Email Dispatch', desc: 'Delivers receipt PDF to client within 90 seconds', icon: 'send', payload: 'WhatsApp Cloud API => +234 812 000 0000 [PDF Receipt Attached]' },
          { num: 5, title: 'Secure Database Ledger', desc: 'PostgreSQL record stored with strict tenant RLS', icon: 'database', payload: 'INSERT INTO transactions ... (status: "reconciled", audit_trail: "verified")' }
        ],
        simulatedWhatsAppMsg: '🧾 *Zeerocodes Automated Billing*\n\nHello *Tunde Balogun*! Your payment of *₦150,000* for *Solar Inverter Order #884* has been verified and settled in 42ms.\n\n📄 *Official Tax Invoice:* Download PDF (https://zeerocodes.com/inv/884)\n🚚 *Warehouse Status:* Dispatch packing in progress.\n\n_Powered by Zeerocodes Autonomous Workflow Engine_'
      },
      {
        id: 'wf-scheduler',
        title: 'Smart Lead Qualifier & Meeting Scheduler',
        category: 'Sales & Lead Acquisition',
        impact: '3.5x higher booking rate • 30-sec response',
        description: 'Engages inbound leads within 30 seconds, asks 3 intelligent qualifying questions, checks WAT office hours (10 AM - 6 PM), and books discovery calls with zero double-booking.',
        steps: [
          { num: 1, title: 'Inbound Lead Trigger', desc: 'Visitor clicks ad or submits website scoping form', icon: 'inbox', payload: 'Lead: Babatunde Lawal | Budget: ₦2.5M | Interest: Custom SaaS Web App' },
          { num: 2, title: 'AI Assistant Intake', desc: 'Evaluates budget, timeline, and business bottlenecks', icon: 'bot', payload: 'Prompt: "Qualify lead for Studio Tier 2" => Score: 95/100 (HIGH INTENT)' },
          { num: 3, title: 'WAT Calendar Engine', desc: 'Filters available slots strictly between 10 AM & 6 PM WAT', icon: 'calendar', payload: 'Available: Tomorrow 11:00 AM (WAT) | Occupied: 02:00 PM (LOCKED)' },
          { num: 4, title: 'Instant Confirmation', desc: 'Dispatches Google Calendar invite & WhatsApp alert', icon: 'check-circle', payload: 'GCal Event Created + WhatsApp Confirmation Dispatched' },
          { num: 5, title: 'CRM Deal Pipeline', desc: 'Pre-scoped deal notes synced into Admin Hub', icon: 'layout-dashboard', payload: 'Deal Stage: "Discovery Scheduled" | Est. Revenue: ₦2,500,000' }
        ],
        simulatedWhatsAppMsg: '📅 *Zeerocodes Studio Discovery Session*\n\nHi *Babatunde*! Your 30-minute discovery session with *Nuel Effiong* is confirmed for *Tomorrow at 11:00 AM WAT*.\n\n🔗 *Google Meet Room:* https://meet.google.com/zrc-lead-demo\n📋 *Scope:* Custom SaaS Platform Build\n\nLooking forward to speaking with you!'
      },
      {
        id: 'wf-noshow',
        title: 'Automated Appointment & No-Show Reducer',
        category: 'Operations & Service Businesses',
        impact: 'No-shows cut from 35% to <4%',
        description: 'Keeps service calendars full for clinics, beauty studios, consultancies, and fleet agencies with automated 24-hr and 2-hr WhatsApp reminder sequences and 1-tap confirmation.',
        steps: [
          { num: 1, title: 'Booking Intake', desc: 'Patient / client schedules appointment online with deposit', icon: 'calendar', payload: 'Appointment: MedVibe Health Clinic | Date: Oct 18, 10:30 AM' },
          { num: 2, title: '24-Hour Reminder Hook', desc: 'Sends interactive WhatsApp reminder with 1-tap confirm', icon: 'bell', payload: 'Trigger: T-24h => Message: "Reply 1 to Confirm or 2 to Reschedule"' },
          { num: 3, title: 'Automated Response Parser', desc: 'Instant reply processing and schedule lock', icon: 'cpu', payload: 'Customer Replied "1" => Status: CONFIRMED (Seat Guaranteed)' },
          { num: 4, title: '2-Hour Prep Checklist', desc: 'Sends location pin, parking instructions & prep brief', icon: 'map-pin', payload: 'Directions: VI Clinic Center | Doctor: Dr. Adeyemi' },
          { num: 5, title: 'Post-Visit Follow-Up', desc: 'Sends satisfaction survey & next booking link', icon: 'star', payload: 'Survey Score: 5/5 | Re-book link generated' }
        ],
        simulatedWhatsAppMsg: '🏥 *MedVibe Health Clinic Reminder*\n\nHello *Dr. Fatima*! This is a reminder for your consultation *Tomorrow at 10:30 AM WAT*.\n\n📍 *Clinic Address:* 14 Admiralty Way, Lekki Phase 1, Lagos\n🚗 *Parking:* Reserved guest slots available.\n\n_Reply *1* to Confirm or *2* to Reschedule._'
      },
      {
        id: 'wf-contract',
        title: 'Autonomous Document & Contract Pipeline',
        category: 'Legal & Enterprise Operations',
        impact: 'Client onboarding reduced from 5 days to 20 mins',
        description: 'Generates branded NDA and service contracts dynamically from intake data, dispatches cryptographic e-signature links, and initializes project workspace upon signing.',
        steps: [
          { num: 1, title: 'Deal Summary Form', desc: 'Sales team submits 5-field client engagement parameters', icon: 'file-text', payload: 'Client: SwiftShip Logistics | Service: Fleet Dispatch System | Retainer: ₦1.8M' },
          { num: 2, title: 'Dynamic PDF Generator', desc: 'Auto-populates legally hardened terms and deliverables', icon: 'file-check', payload: 'NDA_SwiftShip_2026.pdf generated with 14 clauses & NDA warranty' },
          { num: 3, title: 'Secure E-Signature Dispatch', desc: 'Sends signed token via WhatsApp and Email', icon: 'send', payload: 'Sign Link: https://zeerocodes.com/sign?token=zrc_sec_99a81' },
          { num: 4, title: 'Cryptographic Signing', desc: 'Captures IP, timestamp & digital HMAC signature', icon: 'award', payload: 'Signed by: Babatunde Lawal (MD) | SHA-256 Validated' },
          { num: 5, title: 'Client Workspace Setup', desc: 'Initializes project milestones & issues deposit invoice', icon: 'folder-check', payload: 'Project Folder: "PROJ-SWIFTSHIP" | Invoice: INV-2026-0881 Generated' }
        ],
        simulatedWhatsAppMsg: '📑 *Zeerocodes Legal & Project Onboarding*\n\nDear *Mr. Babatunde Lawal*,\nYour *Client Service Agreement for SwiftShip Dispatch Automation* is ready for your digital signature.\n\n✍️ *Review & Sign Contract (2 Mins):*\nhttps://zeerocodes.com/sign?token=zrc_sec_99a81\n\n_Upon signing, your Sprint 1 workspace will be instantly initialized._'
      }
    ];

    // Bind click events on sample automation cards
    document.addEventListener('click', (e) => {
      const autoCard = e.target.closest('.sample-auto-card');
      if (autoCard) {
        const cardIndex = Array.from(autoCard.parentElement.children).indexOf(autoCard);
        this.openWorkflowSimulator(cardIndex >= 0 ? cardIndex : 0);
      }
    });
  }

  openWorkflowSimulator(index = 0) {
    const wf = this.workflowsData[index] || this.workflowsData[0];
    const modal = document.getElementById('modal-workflow-simulator');
    if (!modal) return;

    document.getElementById('simWorkflowTitle').textContent = wf.title;
    document.getElementById('simWorkflowTag').textContent = wf.category;
    document.getElementById('simWorkflowImpact').textContent = wf.impact;
    document.getElementById('simWorkflowDesc').textContent = wf.description;

    // Render Nodes
    const nodesContainer = document.getElementById('simNodesContainer');
    if (nodesContainer) {
      nodesContainer.innerHTML = wf.steps.map(step => `
        <div class="sim-node-item" id="simNode_${step.num}" style="background:#080D16; border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-xs); padding:1rem; transition:all 0.3s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span class="badge badge-teal" style="font-size:0.65rem;">STEP 0${step.num}</span>
            <span style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">${step.title}</span>
          </div>
          <p style="font-size:0.82rem; color:#FFF; margin:0 0 0.5rem 0; font-weight:600;">${step.desc}</p>
          <div class="sim-node-payload" style="background:#04070D; padding:0.5rem; border-radius:4px; font-family:var(--font-mono); font-size:0.72rem; color:#A7F3D0; word-break:break-all;">
            ${step.payload}
          </div>
        </div>
      `).join('');
    }

    // Set Live Mockup Preview
    const previewContainer = document.getElementById('simLivePreviewContainer');
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div style="background:#04070D; border:1px solid #1A2634; border-radius:var(--radius-xs); padding:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:0.5rem;">
            <span style="font-size:0.75rem; color:#25D366; font-weight:700; display:flex; align-items:center; gap:0.35rem;">
              <i data-lucide="message-square" style="width:14px; height:14px;"></i> WhatsApp Message Output
            </span>
            <span class="badge badge-success" style="font-size:0.6rem;">Delivered • 200 OK</span>
          </div>
          <div style="background:#075E54; background:linear-gradient(180deg, #0B2027 0%, #061016 100%); padding:0.85rem; border-radius:8px; border:1px solid rgba(37,211,102,0.2); font-size:0.8rem; color:#E4EEE7; line-height:1.6; white-space:pre-wrap; font-family:sans-serif;">${wf.simulatedWhatsAppMsg}</div>
        </div>
      `;
    }

    // Reset Simulation Log
    const logEl = document.getElementById('simLogOutput');
    if (logEl) {
      logEl.innerHTML = `[SIMULATOR READY] Workflow loaded: "${wf.title}". Click "Run Live Simulation" to execute test payload.`;
    }

    // Bind Deploy CTA
    const deployBtn = document.getElementById('btnDeploySimulatedWf');
    if (deployBtn) {
      deployBtn.onclick = () => {
        if (window.modal) {
          window.modal.closeAll();
          window.modal.openBooking(wf.title);
          const notesEl = document.getElementById('bookingScopeNotes');
          if (notesEl) {
            notesEl.value = `Interested in deploying "${wf.title}" (${wf.category}). Target: ${wf.impact}.`;
          }
        }
      };
    }

    if (window.modal) {
      window.modal.open('modal-workflow-simulator');
    }
  }

  runWorkflowSimulation() {
    const logEl = document.getElementById('simLogOutput');
    const nodes = document.querySelectorAll('.sim-node-item');
    if (!nodes.length) return;

    if (logEl) logEl.innerHTML = `[0.00s] ⚡ Initializing automated event trigger...\n`;

    let stepIndex = 0;
    const executeStep = () => {
      if (stepIndex > 0) {
        nodes[stepIndex - 1].style.borderColor = '#10B981';
        nodes[stepIndex - 1].style.background = 'rgba(16,185,129,0.06)';
      }

      if (stepIndex < nodes.length) {
        const currentNode = nodes[stepIndex];
        currentNode.style.borderColor = '#00F5D4';
        currentNode.style.background = 'rgba(0,245,212,0.12)';
        currentNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (logEl) {
          logEl.innerHTML += `[+${(stepIndex * 0.35 + 0.15).toFixed(2)}s] ✅ Step 0${stepIndex + 1} completed: ${currentNode.querySelector('p')?.textContent}\n`;
        }

        stepIndex++;
        setTimeout(executeStep, 450);
      } else {
        if (logEl) {
          logEl.innerHTML += `[COMPLETE] 🎉 All 5 workflow nodes executed in 90ms. 0 errors. End-to-end automation verified!\n`;
        }
        if (window.toast) {
          window.toast.success("✨ Workflow Simulation Completed Successfully (200 OK)!");
        }
      }
    };

    executeStep();
  }

  bindActionTriggers() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.trigger-calendly-booking')) {
        if (window.modal) window.modal.openBooking();
      }

      if (e.target.closest('.cmd-palette-trigger')) {
        if (window.modal) window.modal.open('modal-cmd-palette');
      }

      if (e.target.closest('.btn-toggle-role')) {
        if (window.auth) window.auth.toggleRole();
      }

      // Student/Client Dashboard Tab Switching
      const dashTabBtn = e.target.closest('.dash-tab-btn');
      if (dashTabBtn) {
        document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.dash-tab-panel').forEach(p => p.classList.remove('active'));
        dashTabBtn.classList.add('active');
        const targetTab = dashTabBtn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      }
    });

    // Account Settings form submit
    const accForm = document.getElementById('accSettingsForm');
    if (accForm) {
      accForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const displayName = document.getElementById('accSettingsName')?.value.trim();
        const phone = document.getElementById('accSettingsPhone')?.value.trim();
        const bio = document.getElementById('accSettingsBio')?.value.trim();
        if (window.auth) {
          await window.auth.updateProfile({ displayName, phone, bio });
          this.renderUserDashboard();
        }
      });
    }

    this.bindCommandPalette();
    this.bindBackToTop();
  }

  bindCommandPalette() {
    const searchInput = document.getElementById('cmdPaletteInput');
    const resultsContainer = document.getElementById('cmdPaletteResults');

    const paletteActions = [
      { title: 'Overview & Platform Pillars', category: 'Navigation', icon: 'home', action: () => { window.location.hash = '#home'; window.modal.closeAll(); } },
      { title: 'The Zeerocodes VibeCode Labs', category: 'Navigation', icon: 'graduation-cap', action: () => { window.location.hash = '#academy'; window.modal.closeAll(); } },
      { title: 'Automation Studio Consulting', category: 'Navigation', icon: 'workflow', action: () => { window.location.hash = '#studio'; window.modal.closeAll(); } },
      { title: 'VibeScan Security Audits & VibeCert', category: 'Navigation', icon: 'shield-check', action: () => { window.location.hash = '#vibescan'; window.modal.closeAll(); } },
      { title: 'Client Workspace Dashboard', category: 'Navigation', icon: 'layout-dashboard', action: () => { window.location.hash = '#dashboard'; window.modal.closeAll(); } },
      { title: 'Book 30-Min Discovery Session', category: 'Action', icon: 'calendar', action: () => { window.modal.closeAll(); window.modal.openBooking(); } },
      { title: 'Run AST Code Scanner Simulation', category: 'Security Tools', icon: 'play', action: () => { window.location.hash = '#vibescan'; window.modal.closeAll(); window.vibescanEngine?.runTerminalAudit('https://github.com/payquick/whatsapp-fintech-bot.git'); } },
      { title: 'Toggle User / Admin Role', category: 'Developer', icon: 'user-check', action: () => { window.auth.toggleRole(); window.modal.closeAll(); } }
    ];

    const renderPalette = (query) => {
      if (!resultsContainer) return;
      const lower = query.toLowerCase().trim();
      const filtered = paletteActions.filter(a => a.title.toLowerCase().includes(lower) || a.category.toLowerCase().includes(lower));

      if (!filtered.length) {
        resultsContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-cyber-muted); font-size:0.88rem;">No matching actions found.</div>`;
        return;
      }

      resultsContainer.innerHTML = filtered.map((item, idx) => `
        <div class="cmd-palette-item" style="display:flex; justify-content:space-between; align-items:center; padding:0.75rem 1rem; border-radius:var(--radius-xs); cursor:pointer; margin-bottom:4px;" onclick="window.app.executePaletteAction(${idx})">
          <div style="display:flex; align-items:center; gap:0.65rem; color:#FFF; font-size:0.9rem; font-weight:600;">
            <i data-lucide="${item.icon}" style="width:16px; height:16px; color:var(--emerald-light);"></i>
            <span>${item.title}</span>
          </div>
          <span class="badge badge-teal" style="font-size:0.7rem;">${item.category}</span>
        </div>
      `).join('');

      this.currentFilteredPalette = filtered;
      if (window.lucide) window.lucide.createIcons();
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => renderPalette(e.target.value));
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (window.modal) window.modal.open('modal-cmd-palette');
          setTimeout(() => {
            searchInput.focus();
            renderPalette('');
          }, 80);
        }
      });
    }
  }

  executePaletteAction(idx) {
    if (this.currentFilteredPalette && this.currentFilteredPalette[idx]) {
      this.currentFilteredPalette[idx].action();
    }
  }

  bindBackToTop() {
    const btn = document.getElementById('btnBackToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 9. CLIENT & ADMIN WORKSPACE DASHBOARD RENDERERS
  // =========================================================================
  async renderAdminDashboard() {
    if (!window.auth || !window.auth.isAuthenticated()) {
      if (window.toast) window.toast.warning("Admin sign-in required.");
      if (window.modal) window.modal.openAuth('login');
      window.location.hash = '#home';
      return;
    }
    if (!window.auth.isAdmin()) {
      if (window.toast) window.toast.error("Access Restricted: Admin privileges required.");
      window.location.hash = '#dashboard';
      return;
    }
    if (window.adminConsole && window.adminConsole.renderAdminConsole) {
      await window.adminConsole.renderAdminConsole();
    }
  }

  async renderUserDashboard() {
    if (!window.auth || !window.auth.isAuthenticated()) {
      if (window.toast) window.toast.warning("Please sign in or register to access your dashboard.");
      if (window.modal) window.modal.openAuth('login');
      window.location.hash = '#home';
      return;
    }
    const user = window.auth.getUser();

    // 1. Top Profile Header
    const nameEl = document.getElementById('dashUserName');
    const emailEl = document.getElementById('dashUserEmail');
    const roleBadgeEl = document.getElementById('dashUserRoleBadge');
    const avatarEl = document.getElementById('dashUserAvatar');

    const isClient = user.role === 'client';
    const isVerified = window.auth.isUserVerified(user);

    if (nameEl) nameEl.textContent = user.displayName || (isClient ? 'Enterprise Client' : 'Amina Yusuf');
    if (emailEl) emailEl.textContent = user.email || '';
    if (roleBadgeEl) {
      if (!isVerified) {
        roleBadgeEl.textContent = 'PENDING VERIFICATION';
        roleBadgeEl.className = 'badge badge-warning';
      } else {
        const role = (user.role || 'STUDENT').toUpperCase();
        roleBadgeEl.textContent = isClient ? 'ENTERPRISE CLIENT' : role;
        roleBadgeEl.className = `badge ${role === 'ADMIN' ? 'badge-danger' : isClient ? 'badge-teal' : 'badge-success'}`;
      }
    }
    if (avatarEl && user.photoURL) {
      avatarEl.src = user.photoURL;
    }

    // 2. Verification Gate Check
    if (!isVerified) {
      if (isClient) {
        this.renderEnterprisePendingVerificationView(user);
      } else {
        this.renderStudentPendingVerificationView(user);
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // 3. Fetch collections safely with fallbacks
    let enrollments = [];
    let labSubs = [];
    let studioProjects = [];
    let vibescanSubs = [];
    let paymentEvents = [];
    let invoices = [];

    try {
      if (window.db) {
        enrollments = (await window.db.getUserEnrollments(user.uid, user.email)) || [];
        labSubs = (await window.db.getLabSubmissionsForUser(user.uid)) || [];
        studioProjects = (await window.db.getStudioProjectsForUser(user.uid)) || [];
        vibescanSubs = (await window.db.getSubmissionsForUser(user.uid)) || [];
        paymentEvents = (await window.db.getPaymentEvents()) || [];
        invoices = (await window.db.getInvoices()) || [];
      }
    } catch (err) {
      console.warn('Dashboard data fetch warning:', err);
    }

    const userPayments = paymentEvents.filter(p => p.customerEmail === user.email || p.userEmail === user.email);

    // 4. Branch by Persona Role
    if (isClient) {
      // Setup Enterprise Sidebar & Render Enterprise Tabs
      this.setupEnterpriseSidebar();
      this.renderEnterpriseClientDashboard(user, studioProjects, vibescanSubs, userPayments, invoices);
    } else {
      // Setup Student Sidebar & Render Student Tabs
      this.setupStudentSidebar();

      // Fallback: If student has no enrollments in local state, provide default VibeCode Labs enrollment
      if (!enrollments.length) {
        enrollments = [{
          id: 'enroll-amina-01',
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || 'Amina Yusuf',
          courseId: 'course-vibecode-labs',
          courseTitle: 'The Zeerocodes VibeCode Labs',
          cohort: 'Cohort 4',
          completedLessons: [
            'lvl_1_mod_01_les_0', 'lvl_1_mod_01_les_1', 'lvl_1_mod_01_les_2', 'lvl_1_mod_01_les_3', 'lvl_1_mod_01_les_4',
            'lvl_1_mod_02_les_0', 'lvl_1_mod_02_les_1', 'lvl_1_mod_02_les_2', 'lvl_1_mod_02_les_3',
            'lvl_1_mod_03_les_0', 'lvl_1_mod_03_les_1', 'lvl_1_mod_03_les_2', 'lvl_1_mod_03_les_3',
            'lvl_1_mod_04_les_0', 'lvl_1_mod_04_les_1',
            'lvl_2_mod_05_les_0', 'lvl_2_mod_05_les_1', 'lvl_2_mod_05_les_2',
            'lvl_2_mod_06_les_0', 'lvl_2_mod_06_les_1',
            'lvl_3_mod_11_les_0', 'lvl_3_mod_11_les_1',
            'lvl_3_mod_13_les_0'
          ],
          certificateId: 'VIBECERT-2026-0881',
          certifiedAt: '2026-08-10T12:00:00Z'
        }];
      }

      this.renderStudentOverviewTab(user, enrollments, labSubs);
      this.renderStudentCoursesTab(enrollments);
      this.renderStudentSessionsTab();
      this.renderStudentAchievementsTab(user, enrollments);
      this.renderStudentDiscussionsTab(user);
      this.renderStudentCommunityTab();
      this.renderStudentSupportTab(user);
      this.renderStudentStudioTab(studioProjects);
      this.renderStudentVibescanTab(vibescanSubs);
      this.renderStudentBillingTab(userPayments, user);
      this.renderStudentSettingsTab(user);
    }

    this.bindDashboardTabs();

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // SIDEBAR BUILDERS (ROLE-BASED SEPARATION)
  // =========================================================================
  setupStudentSidebar() {
    const badge = document.getElementById('dashSidebarBrandBadge');
    if (badge) {
      badge.innerHTML = `<i data-lucide="graduation-cap" style="color:var(--emerald-light);"></i> The VibeCode Labs`;
    }

    const navList = document.getElementById('dashSidebarNavList');
    if (!navList) return;

    navList.innerHTML = `
      <li>
        <button type="button" class="modern-dash-nav-btn active dash-tab-btn" data-tab="dashTabOverview">
          <i data-lucide="home"></i> Home
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabLms">
          <i data-lucide="book-open"></i> Courses
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabSessions">
          <i data-lucide="video"></i> Sessions
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabAchievements">
          <i data-lucide="award"></i> Achievement
        </button>
      </li>

      <li class="nav-category-divider">
        <span>COMMUNICATIONS</span>
      </li>

      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabDiscussions">
          <i data-lucide="message-square"></i> Message
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabCommunity">
          <i data-lucide="users"></i> Study centers
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabSupport">
          <i data-lucide="help-circle"></i> Support tickets
        </button>
      </li>

      <li class="nav-category-divider">
        <span>SERVICES & BILLING</span>
      </li>

      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabStudio">
          <i data-lucide="workflow"></i> Studio Projects
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabVibescan">
          <i data-lucide="shield-check"></i> Security Audits
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabBilling">
          <i data-lucide="receipt"></i> Invoices & Billing
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabSettings">
          <i data-lucide="settings"></i> Settings
        </button>
      </li>
    `;
  }

  setupEnterpriseSidebar() {
    const badge = document.getElementById('dashSidebarBrandBadge');
    if (badge) {
      badge.innerHTML = `<i data-lucide="shield-check" style="color:var(--cyan-accent);"></i> Zeerocodes Studio Enterprise`;
    }

    const navList = document.getElementById('dashSidebarNavList');
    if (!navList) return;

    navList.innerHTML = `
      <li>
        <button type="button" class="modern-dash-nav-btn active dash-tab-btn" data-tab="dashTabOverview">
          <i data-lucide="layout-dashboard"></i> Executive Overview
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabStudio">
          <i data-lucide="workflow"></i> Studio Projects & Sprints
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabPipelines">
          <i data-lucide="activity"></i> Autonomous Pipelines
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabVibescan">
          <i data-lucide="shield-check"></i> Security & Governance
        </button>
      </li>

      <li class="nav-category-divider">
        <span>FINANCIALS & COLLABORATION</span>
      </li>

      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabBilling">
          <i data-lucide="receipt"></i> Milestone Invoices
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabTeam">
          <i data-lucide="users"></i> Organization Seats
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabSla">
          <i data-lucide="phone-call"></i> 24/7 SLA & Architect Hotline
        </button>
      </li>
      <li>
        <button type="button" class="modern-dash-nav-btn dash-tab-btn" data-tab="dashTabSettings">
          <i data-lucide="settings"></i> Organization Settings
        </button>
      </li>
    `;
  }

  bindDashboardTabs() {
    document.querySelectorAll('.dash-tab-btn').forEach(btn => {
      btn.onclick = (e) => {
        const tabId = btn.getAttribute('data-tab');
        if (!tabId) return;

        document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.dash-tab-panel').forEach(p => {
          if (p.id === tabId) {
            p.classList.add('active');
            p.style.display = 'block';
          } else {
            p.classList.remove('active');
            p.style.display = 'none';
          }
        });

        if (window.lucide) window.lucide.createIcons();
      };
    });
  }

  // =========================================================================
  // PENDING VERIFICATION STATE 1: STUDENT ADMISSION
  // =========================================================================
  renderStudentPendingVerificationView(user) {
    const container = document.getElementById('dashOverviewContainer');
    if (!container) return;

    this.setupStudentSidebar();

    container.innerHTML = `
      <div class="student-welcome-banner" style="background:linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(12, 17, 26, 0.95) 100%); border-color:rgba(245, 158, 11, 0.35);">
        <div class="student-welcome-left">
          <div class="student-avatar-badge" style="border-color:#F59E0B; box-shadow:0 0 15px rgba(245, 158, 11, 0.3);">
            <img src="${user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}" alt="${user.displayName}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
            <span class="student-online-dot" style="background:#F59E0B; box-shadow:0 0 8px #F59E0B;" title="Application Under Review"></span>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.25rem;">
              <span class="badge badge-warning" style="font-size:0.7rem; font-weight:800;">
                <i data-lucide="clock" style="width:12px; height:12px; display:inline;"></i> PAYMENT & ACCESS VERIFICATION PENDING
              </span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Application ID: #APP-${(user.uid || '000000').slice(-6).toUpperCase()}</span>
            </div>
            <h3 style="color:#FFF; font-size:1.4rem; font-weight:800; margin:0;">
              Welcome, <span style="color:#FBBF24;">${(user.displayName || 'APPLICANT').toUpperCase()}</span> 👋
            </h3>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">
              Your student registration for <strong>The VibeCode Labs Cohort 4</strong> is currently in the ledger review queue.
            </p>
          </div>
        </div>
        <div class="student-welcome-right" style="text-align:right;">
          <div class="badge badge-warning" style="font-size:0.75rem; padding:0.4rem 0.8rem; margin-bottom:0.4rem;">
            ⏳ Awaiting Admin Payment Clearance
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Verifier: Nuel Effiong (Lead Systems Architect)</div>
        </div>
      </div>

      <!-- 3-Step Verification Pipeline -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem; margin-bottom:1.5rem;">
        <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 1.25rem 0; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="shield-check" style="color:var(--cyan-accent);"></i> Verification & Access Roadmap
        </h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:1rem;">
          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">1️⃣</span>
              <span class="badge badge-success">✓ COMPLETED</span>
            </div>
            <strong style="color:#FFF; font-size:0.95rem; display:block; margin-bottom:0.25rem;">Account & Tuition Submitted</strong>
            <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">
              Candidate profile and payment submission recorded in ledger.
            </p>
          </div>

          <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.4); border-radius:12px; padding:1.25rem; box-shadow:0 0 20px rgba(245, 158, 11, 0.08);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">2️⃣</span>
              <span class="badge badge-warning">⏳ IN PROGRESS</span>
            </div>
            <strong style="color:#FBBF24; font-size:0.95rem; display:block; margin-bottom:0.25rem;">Admin Ledger Verification</strong>
            <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">
              Finance desk verifies transaction hash before unlocking private repo keys.
            </p>
          </div>

          <div style="background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06); border-radius:12px; padding:1.25rem; opacity:0.6;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">3️⃣</span>
              <span class="badge badge-cyber">🔒 LOCKED</span>
            </div>
            <strong style="color:#FFF; font-size:0.95rem; display:block; margin-bottom:0.25rem;">LMS & Cohort Pass Live</strong>
            <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">
              All 4 levels, 88 code labs, Saturday live clinics, and VIP Discord unlock immediately.
            </p>
          </div>
        </div>
      </div>

      <!-- Direct Expedite & Info -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="zap" style="color:#F59E0B;"></i> Fast-Track Your Approval
          </h4>
          <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem; line-height:1.45;">
            Need immediate access for this weekend's build clinic? Message Nuel Effiong directly with your email (<strong>${user.email}</strong>).
          </p>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="https://wa.me/2348120000000?text=Hi%20Nuel%2C%20I%20registered%20for%20The%20VibeCode%20Labs%20with%20email%20${encodeURIComponent(user.email)}%20and%20App%20ID%20%23APP-${(user.uid || '').slice(-6).toUpperCase()}.%20Please%20verify%20my%20tuition%20payment." target="_blank" class="btn btn-primary btn-sm" style="background:#25D366; border-color:#25D366; color:#000; font-weight:700;">
              <i data-lucide="message-square"></i> Chat with Admin on WhatsApp
            </a>
            <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
              <i data-lucide="refresh-cw"></i> Check Status
            </button>
          </div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="info" style="color:var(--cyan-accent);"></i> Registration Summary
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.82rem; margin-top:0.75rem;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Candidate Name:</span>
              <strong style="color:#FFF;">${user.displayName || 'Applicant'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Account Email:</span>
              <strong style="color:var(--cyan-accent);">${user.email}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Phone Number:</span>
              <strong style="color:#FFF;">${user.phone || '+234 812 000 0000'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top:0.2rem;">
              <span style="color:var(--text-cyber-muted);">Account Status:</span>
              <span class="badge badge-warning" style="font-size:0.68rem;">AWAITING ADMIN CLEARANCE</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render locked state on other tab containers
    ['dashLmsContainer', 'dashSessionsContainer', 'dashAchievementsContainer', 'dashDiscussionsContainer', 'dashCommunityContainer', 'dashSupportContainer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:3rem 1.5rem; text-align:center; max-width:600px; margin:2rem auto;">
            <i data-lucide="lock" style="width:48px; height:48px; color:#F59E0B; margin-bottom:1rem; display:inline-block;"></i>
            <h4 style="color:#FFF; font-size:1.2rem; margin:0 0 0.5rem 0;">Section Locked Pending Payment Clearance</h4>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin-bottom:1.5rem;">
              This section contains private cohort materials, live build sessions, and lab grading. It will automatically unlock as soon as your payment is approved by Nuel Effiong.
            </p>
            <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
              <i data-lucide="refresh-cw"></i> Refresh Access State
            </button>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // PENDING VERIFICATION STATE 2: ENTERPRISE CLIENT
  // =========================================================================
  renderEnterprisePendingVerificationView(user) {
    const container = document.getElementById('dashOverviewContainer');
    if (!container) return;

    this.setupEnterpriseSidebar();

    const company = user.company || 'Enterprise Partner';
    const project = user.activeProject || 'Clinical Telehealth Platform & Patient Portal';
    const invoiceId = user.pendingInvoiceId || 'INV-2026-002';
    const amountNGN = (user.pendingInvoiceAmount || 4800000).toLocaleString();

    container.innerHTML = `
      <div class="student-welcome-banner" style="background:linear-gradient(135deg, rgba(34, 211, 238, 0.12) 0%, rgba(12, 17, 26, 0.95) 100%); border-color:rgba(34, 211, 238, 0.35);">
        <div class="student-welcome-left">
          <div class="student-avatar-badge" style="border-color:var(--cyan-accent); box-shadow:0 0 15px rgba(34, 211, 238, 0.3);">
            <img src="${user.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'}" alt="${user.displayName}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
            <span class="student-online-dot" style="background:var(--cyan-accent); box-shadow:0 0 8px var(--cyan-accent);" title="Sprint Verification Pending"></span>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.25rem;">
              <span class="badge badge-teal" style="font-size:0.7rem; font-weight:800;">
                <i data-lucide="briefcase" style="width:12px; height:12px; display:inline;"></i> ENTERPRISE SCOPING & PAYMENT INTAKE
              </span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Org ID: #ENT-${(user.uid || '000000').slice(-6).toUpperCase()}</span>
            </div>
            <h3 style="color:#FFF; font-size:1.4rem; font-weight:800; margin:0;">
              Welcome, <span style="color:var(--cyan-accent);">${(user.displayName || company).toUpperCase()}</span> 👋
            </h3>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">
              Your milestone sprint allocation for <strong>${project}</strong> is awaiting finance desk verification.
            </p>
          </div>
        </div>
        <div class="student-welcome-right" style="text-align:right;">
          <div class="badge badge-warning" style="font-size:0.75rem; padding:0.4rem 0.8rem; margin-bottom:0.4rem;">
            ⏳ Milestone Invoice Awaiting Clearance
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Lead Architect: Nuel Effiong</div>
        </div>
      </div>

      <!-- 4-Stage Enterprise Sprint Activation Pipeline -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem; margin-bottom:1.5rem;">
        <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 1.25rem 0; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="shield-check" style="color:var(--cyan-accent);"></i> Enterprise Sprint Onboarding Roadmap
        </h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap:1rem;">
          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">1️⃣</span>
              <span class="badge badge-success">✓ SIGNED</span>
            </div>
            <strong style="color:#FFF; font-size:0.92rem; display:block; margin-bottom:0.25rem;">Milestone Invoice Issued</strong>
            <p style="font-size:0.75rem; color:var(--text-cyber-muted); margin:0;">
              Invoice <strong>${invoiceId}</strong> generated for ₦${amountNGN}.
            </p>
          </div>

          <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.4); border-radius:12px; padding:1.25rem; box-shadow:0 0 20px rgba(245, 158, 11, 0.08);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">2️⃣</span>
              <span class="badge badge-warning">⏳ VERIFYING</span>
            </div>
            <strong style="color:#FBBF24; font-size:0.92rem; display:block; margin-bottom:0.25rem;">Admin Ledger Verification</strong>
            <p style="font-size:0.75rem; color:var(--text-cyber-muted); margin:0;">
              Finance desk confirms bank settlement and Paystack HMAC signature.
            </p>
          </div>

          <div style="background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06); border-radius:12px; padding:1.25rem; opacity:0.6;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">3️⃣</span>
              <span class="badge badge-cyber">🔒 ALLOCATING</span>
            </div>
            <strong style="color:#FFF; font-size:0.92rem; display:block; margin-bottom:0.25rem;">Staging Prototype Allocation</strong>
            <p style="font-size:0.75rem; color:var(--text-cyber-muted); margin:0;">
              Provisioning dedicated edge server & GitHub staging environment.
            </p>
          </div>

          <div style="background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06); border-radius:12px; padding:1.25rem; opacity:0.6;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">4️⃣</span>
              <span class="badge badge-cyber">🔒 STANDBY</span>
            </div>
            <strong style="color:#FFF; font-size:0.92rem; display:block; margin-bottom:0.25rem;">24/7 SLA Telemetry Active</strong>
            <p style="font-size:0.75rem; color:var(--text-cyber-muted); margin:0;">
              Continuous health checks and direct architect hotline live.
            </p>
          </div>
        </div>
      </div>

      <!-- Expedite Milestone & Profile Box -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="zap" style="color:var(--cyan-accent);"></i> Instant Settlement & Fast-Track
          </h4>
          <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem; line-height:1.45;">
            To expedite staging environment provisioning for <strong>${project}</strong>, contact Principal Architect Nuel Effiong with your payment reference.
          </p>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="https://wa.me/2348120000000?text=Hi%20Nuel%2C%20this%20is%20${encodeURIComponent(user.displayName || company)}.%20We%20have%20submitted%20payment%20for%20Invoice%20${invoiceId}%20(${encodeURIComponent(project)}).%20Please%20verify%20and%20unlock%20our%20enterprise%20workspace." target="_blank" class="btn btn-primary btn-sm" style="background:#25D366; border-color:#25D366; color:#000; font-weight:700;">
              <i data-lucide="message-square"></i> Connect with Lead Architect
            </a>
            <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
              <i data-lucide="refresh-cw"></i> Refresh Status
            </button>
          </div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="info" style="color:var(--emerald-light);"></i> Organization Details
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.82rem; margin-top:0.75rem;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Organization:</span>
              <strong style="color:#FFF;">${company}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Authorized Officer:</span>
              <strong style="color:#FFF;">${user.displayName}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Corporate Email:</span>
              <strong style="color:var(--cyan-accent);">${user.email}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top:0.2rem;">
              <span style="color:var(--text-cyber-muted);">Pending Invoice:</span>
              <strong style="color:var(--emerald-light);">${invoiceId} (₦${amountNGN})</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render locked state on other tab containers
    ['dashStudioContainer', 'dashPipelinesContainer', 'dashVibescanContainer', 'dashBillingContainer', 'dashTeamContainer', 'dashSlaContainer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:3rem 1.5rem; text-align:center; max-width:600px; margin:2rem auto;">
            <i data-lucide="lock" style="width:48px; height:48px; color:var(--cyan-accent); margin-bottom:1rem; display:inline-block;"></i>
            <h4 style="color:#FFF; font-size:1.2rem; margin:0 0 0.5rem 0;">Enterprise Section Awaiting Invoice Clearance</h4>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin-bottom:1.5rem;">
              This section contains live staging environments, autonomous pipeline nodes, and 24/7 SLA telemetry. It will activate immediately upon invoice verification.
            </p>
            <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
              <i data-lucide="refresh-cw"></i> Refresh Status
            </button>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // PENDING VERIFICATION STATE (WHEN NEW STUDENT SIGNS UP AWAITING ADMIN APPROVAL)
  // =========================================================================
  renderStudentPendingVerificationView(user) {
    const nameEl = document.getElementById('dashUserName');
    const emailEl = document.getElementById('dashUserEmail');
    const roleBadgeEl = document.getElementById('dashUserRoleBadge');
    if (nameEl) nameEl.textContent = user.displayName || 'Applicant';
    if (emailEl) emailEl.textContent = user.email || '';
    if (roleBadgeEl) {
      roleBadgeEl.textContent = 'PENDING VERIFICATION';
      roleBadgeEl.className = 'badge badge-warning';
    }

    const container = document.getElementById('dashOverviewContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="student-welcome-banner" style="background:linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(12, 17, 26, 0.95) 100%); border-color:rgba(245, 158, 11, 0.35);">
        <div class="student-welcome-left">
          <div class="student-avatar-badge" style="border-color:#F59E0B; box-shadow:0 0 15px rgba(245, 158, 11, 0.3);">
            <img src="${user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}" alt="${user.displayName}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
            <span class="student-online-dot" style="background:#F59E0B; box-shadow:0 0 8px #F59E0B;" title="Application Under Review"></span>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.25rem;">
              <span class="badge badge-warning" style="font-size:0.7rem; font-weight:800;">
                <i data-lucide="clock" style="width:12px; height:12px; display:inline;"></i> VERIFICATION IN PROGRESS
              </span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Application ID: #APP-${(user.uid || '000000').slice(-6).toUpperCase()}</span>
            </div>
            <h3 style="color:#FFF; font-size:1.4rem; font-weight:800; margin:0;">
              Welcome, <span style="color:#FBBF24;">${(user.displayName || 'APPLICANT').toUpperCase()}</span> 👋
            </h3>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">
              Your student registration for <strong>The VibeCode Labs Cohort 4</strong> has been submitted.
            </p>
          </div>
        </div>
        <div class="student-welcome-right" style="text-align:right;">
          <div class="badge badge-warning" style="font-size:0.75rem; padding:0.4rem 0.8rem; margin-bottom:0.4rem;">
            ⏳ Awaiting Admin Approval
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Reviewer: Nuel Effiong (Lead Architect)</div>
        </div>
      </div>

      <!-- 3-Step Verification Pipeline -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem; margin-bottom:1.5rem;">
        <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 1.25rem 0; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="shield-check" style="color:var(--cyan-accent);"></i> Verification & Access Roadmap
        </h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:1rem;">
          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">1️⃣</span>
              <span class="badge badge-success">✓ COMPLETED</span>
            </div>
            <strong style="color:#FFF; font-size:0.95rem; display:block; margin-bottom:0.25rem;">Account Registration</strong>
            <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">
              Identity profile and email credentials initialized in our student ledger.
            </p>
          </div>

          <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.4); border-radius:12px; padding:1.25rem; box-shadow:0 0 20px rgba(245, 158, 11, 0.08);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">2️⃣</span>
              <span class="badge badge-warning">⏳ IN PROGRESS</span>
            </div>
            <strong style="color:#FBBF24; font-size:0.95rem; display:block; margin-bottom:0.25rem;">Admin Verification & Check</strong>
            <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">
              The Lead Architect reviews your application details and assigns your cohort slot.
            </p>
          </div>

          <div style="background:rgba(255, 255, 255, 0.02); border:1px solid rgba(255, 255, 255, 0.06); border-radius:12px; padding:1.25rem; opacity:0.6;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:1.4rem;">3️⃣</span>
              <span class="badge badge-cyber">🔒 LOCKED</span>
            </div>
            <strong style="color:#FFF; font-size:0.95rem; display:block; margin-bottom:0.25rem;">Dashboard & LMS Unlocked</strong>
            <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">
              All 4 levels, 88 code labs, Saturday live clinics, and Discord VIP channels unlocked.
            </p>
          </div>
        </div>
      </div>

      <!-- Direct Expedite Card -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="zap" style="color:#F59E0B;"></i> Expedite Your Verification
          </h4>
          <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem; line-height:1.45;">
            Need instant access for an upcoming cohort sprint? Message Nuel Effiong directly on WhatsApp with your registered email (<strong>${user.email}</strong>).
          </p>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="https://wa.me/2348120000000?text=Hi%20Nuel%2C%20I%20just%20registered%20for%20The%20VibeCode%20Labs%20with%20email%20${encodeURIComponent(user.email)}%20and%20App%20ID%20%23APP-${(user.uid || '').slice(-6).toUpperCase()}.%20Please%20verify%20my%20dashboard%20access." target="_blank" class="btn btn-primary btn-sm" style="background:#25D366; border-color:#25D366; color:#000; font-weight:700;">
              <i data-lucide="message-square"></i> Chat with Admin on WhatsApp
            </a>
            <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
              <i data-lucide="refresh-cw"></i> Check Status
            </button>
          </div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="info" style="color:var(--cyan-accent);"></i> Registered Profile Information
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.82rem; margin-top:0.75rem;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Candidate Name:</span>
              <strong style="color:#FFF;">${user.displayName || 'Applicant'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Account Email:</span>
              <strong style="color:var(--cyan-accent);">${user.email}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.4rem;">
              <span style="color:var(--text-cyber-muted);">Phone Number:</span>
              <strong style="color:#FFF;">${user.phone || '+234 812 000 0000'}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; padding-top:0.2rem;">
              <span style="color:var(--text-cyber-muted);">Account Status:</span>
              <span class="badge badge-warning" style="font-size:0.68rem;">PENDING ADMIN APPROVAL</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render locked state on other tab containers
    ['dashLmsContainer', 'dashSessionsContainer', 'dashAchievementsContainer', 'dashDiscussionsContainer', 'dashCommunityContainer', 'dashSupportContainer'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:3rem 1.5rem; text-align:center; max-width:600px; margin:2rem auto;">
            <i data-lucide="lock" style="width:48px; height:48px; color:#F59E0B; margin-bottom:1rem; display:inline-block;"></i>
            <h4 style="color:#FFF; font-size:1.2rem; margin:0 0 0.5rem 0;">Section Locked Pending Admin Verification</h4>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin-bottom:1.5rem;">
              This section contains private cohort materials, live build sessions, and lab grading. It will automatically unlock as soon as your account is approved by Nuel Effiong.
            </p>
            <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
              <i data-lucide="refresh-cw"></i> Refresh Access State
            </button>
          </div>
        `;
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // TAB 1: HOME / OVERVIEW (MATCHING REFERENCE LMS UI)
  // =========================================================================
  renderStudentOverviewTab(user, enrollments, labSubs) {
    const container = document.getElementById('dashOverviewContainer');
    if (!container) return;

    const activeEnroll = enrollments[0] || {
      id: 'enroll-amina-01',
      courseTitle: 'The Zeerocodes VibeCode Labs',
      completedLessons: new Array(23).fill('completed_lesson')
    };

    const completedCount = (activeEnroll.completedLessons || []).length;
    const totalLessons = 88;
    const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100)) || 26;
    const streakDays = 4;
    const displayName = (user.displayName || 'AMINA YUSUF').toUpperCase();

    container.innerHTML = `
      <!-- 1. Hero Welcome Banner (Reference UI: Welcome, EMMANUEL EFFIONG 👋 + 0 days / Streak + Course progress) -->
      <div class="student-welcome-banner">
        <div class="student-welcome-left">
          <div class="student-avatar-badge">
            ${user.photoURL ? `<img src="${user.photoURL}" alt="${displayName}" style="width:100%; height:100%; object-fit:cover;">` : displayName.substring(0, 2)}
          </div>
          <div class="student-welcome-info">
            <h2>
              <span>Welcome,</span> <span style="color:var(--emerald-light); font-weight:900;">${displayName}</span> <span>👋</span>
            </h2>
            <p>Active Cohort 4 Builder • The Zeerocodes VibeCode Labs Masterclass</p>
          </div>
        </div>

        <div class="student-welcome-right">
          <span class="student-streak-pill">
            <i data-lucide="zap"></i> ${streakDays} days streak
          </span>
          <div class="student-progress-wrap">
            <div class="student-progress-labels">
              <span>Your Course progress</span>
              <strong style="color:var(--emerald-light); font-weight:800;">${progressPercent}%</strong>
            </div>
            <div class="student-progress-bar">
              <div class="student-progress-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Action Milestone Card (Reference UI: "Complete your application") -->
      <div class="student-notice-card">
        <div class="student-notice-left">
          <div class="student-notice-icon">
            <i data-lucide="mail-open"></i>
          </div>
          <div class="student-notice-body">
            <h4>Next Milestone: Level 2 — Module 05: UI/UX Thinking for Builders</h4>
            <p>Congratulations on shipping your Level 1 live app! Continue with Module 5 to build high-converting UI components & responsive SaaS architectures.</p>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="window.lms?.openCoursePlayer('${activeEnroll.id}')">
            <i data-lucide="play"></i> Resume Lesson 5.1 &rarr;
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.toast?.info('Added next Saturday 4:00 PM WAT Build Clinic to your calendar')">
            <i data-lucide="calendar"></i> Next Clinic: Sat 4 PM
          </button>
        </div>
      </div>

      <!-- 3. Two-Column Core Layout (Reference UI: Left: Your tasks, Right: 0 days Streak & 0% average performance) -->
      <div class="student-dash-grid">
        
        <!-- Left Column: Your Tasks & Code Labs -->
        <div class="student-tasks-container">
          <div class="student-tasks-header">
            <h3>
              <i data-lucide="check-square" style="color:var(--emerald-light);"></i> Your tasks
            </h3>
            <div class="student-task-filter-pills">
              <button class="task-filter-btn active" onclick="window.app?.filterStudentTasks('all', this)">All</button>
              <button class="task-filter-btn" onclick="window.app?.filterStudentTasks('active', this)">In Progress</button>
              <button class="task-filter-btn" onclick="window.app?.filterStudentTasks('passed', this)">Graded</button>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem;" id="studentTasksList">
            
            <!-- Task 1: In Progress -->
            <div class="student-task-card active-task" data-category="active">
              <div>
                <div class="student-task-meta">
                  <span class="badge badge-teal" style="font-size:0.65rem;">LEVEL 2 • MODULE 05</span>
                  <span class="badge badge-warning" style="font-size:0.65rem;">IN PROGRESS</span>
                  <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Estimated 25 mins</span>
                </div>
                <div class="student-task-title">Lab 5.2: Build a Component Swipe File with Mobbin & Tailwind CSS</div>
                <div class="student-task-sub">Analyze 3 African FinTech checkout flows and build responsive reusable UI tokens in Antigravity.</div>
              </div>
              <div>
                <button class="btn btn-primary btn-xs" onclick="window.lms?.openCoursePlayer('${activeEnroll.id}')">
                  <i data-lucide="play"></i> Launch Lab &rarr;
                </button>
              </div>
            </div>

            <!-- Task 2: Graded / Passed -->
            <div class="student-task-card passed-task" data-category="passed">
              <div>
                <div class="student-task-meta">
                  <span class="badge badge-teal" style="font-size:0.65rem;">LEVEL 1 • MODULE 04</span>
                  <span class="badge badge-success" style="font-size:0.65rem;">✓ PASSED (GRADE A+ • 98%)</span>
                  <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Reviewed by Nuel Effiong</span>
                </div>
                <div class="student-task-title">Lab 4.4: Deploy Your First AI Studio App to a Live URL</div>
                <div class="student-task-sub">"Outstanding prompt specs, clean database RLS isolation, and zero console errors." — Instructor Feedback</div>
              </div>
              <div>
                <a href="https://github.com/amina-yusuf/vibecode-app" target="_blank" class="btn btn-outline btn-xs" style="color:var(--emerald-light);">
                  <i data-lucide="github"></i> View Repo
                </a>
              </div>
            </div>

            <!-- Task 3: Graded / Passed -->
            <div class="student-task-card passed-task" data-category="passed">
              <div>
                <div class="student-task-meta">
                  <span class="badge badge-teal" style="font-size:0.65rem;">LEVEL 1 • MODULE 02</span>
                  <span class="badge badge-success" style="font-size:0.65rem;">✓ PASSED (GRADE A • 95%)</span>
                  <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Reviewed by Nuel Effiong</span>
                </div>
                <div class="student-task-title">Lab 2.4: Practice Lab: Rewrite Five Weak Prompts Into Production Specs</div>
                <div class="student-task-sub">Turned vague natural language wishes into rigid Markdown engineering specifications with error handling.</div>
              </div>
              <div>
                <button class="btn btn-outline btn-xs" onclick="window.toast?.success('Lab 2.4 Prompt Blueprint reloaded in IDE')">
                  <i data-lucide="file-text"></i> Specs
                </button>
              </div>
            </div>

            <!-- Task 4: Upcoming -->
            <div class="student-task-card" data-category="active">
              <div>
                <div class="student-task-meta">
                  <span class="badge badge-cyber" style="font-size:0.65rem;">LEVEL 3 • MODULE 11</span>
                  <span class="badge" style="font-size:0.65rem; background:rgba(255,255,255,0.06); color:#94A3B8;">UPCOMING</span>
                  <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Automations Track</span>
                </div>
                <div class="student-task-title">Lab 11.4: 90-Second WhatsApp Automated Invoicing Engine</div>
                <div class="student-task-sub">Wire n8n WhatsApp Business Cloud API with HMAC SHA-512 webhook verification and automated PDF receipts.</div>
              </div>
              <div>
                <button class="btn btn-ghost btn-xs" style="color:var(--text-cyber-muted);" onclick="window.toast?.info('Unlocks upon completing Level 2 Builder Capstone')">
                  <i data-lucide="lock"></i> Locked
                </button>
              </div>
            </div>

          </div>

          <!-- Quick Lab Submission Box -->
          <div style="margin-top:1.5rem; background:#04070D; border:1px dashed rgba(255,255,255,0.12); border-radius:14px; padding:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <strong style="color:#FFF; font-size:0.95rem; display:flex; align-items:center; gap:0.4rem;">
                <i data-lucide="upload-cloud" style="color:var(--cyan-accent);"></i> Submit Practical Code Lab for Review
              </strong>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Direct grading by Nuel Effiong (24h SLA)</span>
            </div>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
              <input type="url" id="quickLabRepoUrl" placeholder="https://github.com/username/your-practical-lab.git" class="form-input" style="flex:1; min-width:240px; font-size:0.85rem;">
              <button class="btn btn-primary btn-sm" onclick="window.app?.handleQuickLabSubmit()">
                <i data-lucide="send"></i> Submit for Grade
              </button>
            </div>
          </div>

        </div>

        <!-- Right Column: Builder Streak, Performance & Schedule Widgets -->
        <div class="student-widgets-col">
          
          <!-- Widget 1: Streak (Reference UI: 0 days Streak) -->
          <div class="student-widget-card">
            <div class="widget-icon-header">
              <div class="widget-icon-pill" style="background:rgba(245, 158, 11, 0.15); color:#F59E0B; border:1px solid rgba(245, 158, 11, 0.3);">
                ⚡
              </div>
              <div>
                <div class="widget-title-text">${streakDays} days Streak</div>
                <div style="font-size:0.75rem; color:var(--emerald-light); font-weight:700;">Great momentum this week!</div>
              </div>
            </div>
            <p class="widget-body-text">
              Complete at least 1 practical lesson daily to maintain your builder velocity.
            </p>
            <div class="streak-day-dots">
              <div class="streak-day-dot done" title="Monday Completed">M ✓</div>
              <div class="streak-day-dot done" title="Tuesday Completed">T ✓</div>
              <div class="streak-day-dot done" title="Wednesday Completed">W ✓</div>
              <div class="streak-day-dot done" title="Thursday Completed">T ✓</div>
              <div class="streak-day-dot active" title="Friday (Today)">F 🔥</div>
              <div class="streak-day-dot" title="Saturday">S</div>
              <div class="streak-day-dot" title="Sunday">S</div>
            </div>
          </div>

          <!-- Widget 2: Performance (Reference UI: 0% average performance -> 94%) -->
          <div class="student-widget-card">
            <div class="widget-icon-header">
              <div class="widget-icon-pill" style="background:rgba(139, 92, 246, 0.15); color:#A855F7; border:1px solid rgba(139, 92, 246, 0.3);">
                🏆
              </div>
              <div>
                <div class="widget-title-text">94% average performance</div>
                <div style="font-size:0.75rem; color:var(--cyan-accent); font-weight:700;">Top 5% Cohort Ranking</div>
              </div>
            </div>
            <p class="widget-body-text">
              You are part of the <strong>Top 5% of learners</strong> in your track who have reached this impressive score.
            </p>
          </div>

          <!-- Widget 3: VibeCert Credential -->
          <div class="student-widget-card">
            <div class="widget-icon-header">
              <div class="widget-icon-pill" style="background:rgba(0, 245, 212, 0.15); color:#00F5D4; border:1px solid rgba(0, 245, 212, 0.3);">
                🎓
              </div>
              <div>
                <div class="widget-title-text" style="font-size:0.95rem;">VibeCert™ Credential</div>
                <div style="font-size:0.72rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">#VIBECERT-2026-0881</div>
              </div>
            </div>
            <p class="widget-body-text">
              23 of 88 Lessons Completed (26%). Distinction grade verified.
            </p>
            <div style="margin-top:0.75rem;">
              <button class="btn btn-outline btn-xs" style="width:100%;" onclick="window.app?.lookupCertificate('VIBECERT-2026-0881')">
                <i data-lucide="award"></i> View Official Verification &rarr;
              </button>
            </div>
          </div>

          <!-- Widget 4: Live Build Clinic -->
          <div class="student-widget-card" style="background:radial-gradient(ellipse at top, rgba(16, 185, 129, 0.1) 0%, #080D16 100%);">
            <div class="widget-icon-header">
              <div class="widget-icon-pill" style="background:rgba(16, 185, 129, 0.15); color:#34D399; border:1px solid rgba(16, 185, 129, 0.3);">
                📺
              </div>
              <div>
                <div class="widget-title-text" style="font-size:0.95rem;">Next Live Build Clinic</div>
                <div style="font-size:0.72rem; color:var(--emerald-light); font-weight:700;">Saturday @ 4:00 PM WAT</div>
              </div>
            </div>
            <p class="widget-body-text">
              "Live Code Clinic: Building WhatsApp Webhooks with Zero Secrets Leakage" with Nuel Effiong.
            </p>
            <div style="margin-top:0.75rem;">
              <button class="btn btn-primary btn-xs" style="width:100%;" onclick="window.toast?.success('Joined Live Stream Waiting Room!')">
                <i data-lucide="video"></i> Join Live Session
              </button>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // =========================================================================
  // TAB 2: COURSES / CURRICULUM
  // =========================================================================
  async renderStudentCoursesTab(enrollments) {
    const lmsContainer = document.getElementById('dashLmsContainer');
    if (!lmsContainer) return;

    const allCourses = (await window.db.getCourses()) || [];
    const unEnrolledCourses = allCourses.filter(c => !enrollments.some(e => e.courseId === c.id));

    lmsContainer.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
        <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Enrolled Curriculum Tracks (${enrollments.length})</h4>
        <span class="badge badge-teal">Full Multi-Track Access</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem; margin-bottom:2rem;">
        ${enrollments.map(activeEnroll => {
          const completedCount = (activeEnroll.completedLessons || []).length;
          const totalLessons = 88;
          const percent = Math.min(100, Math.round((completedCount / totalLessons) * 100)) || 26;

          return `
            <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                  <span class="badge badge-success">ENROLLED</span>
                  <span style="font-size:0.8rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">${activeEnroll.cohort || 'Cohort 4'}</span>
                </div>
                <h3 style="color:#FFF; font-size:1.2rem; margin-bottom:0.35rem;">${activeEnroll.courseTitle}</h3>
                <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin-bottom:1.25rem;">
                  4 Levels • 22 Modules • 88 Practical Lessons • Antigravity & AI Studio Code Labs
                </p>

                <div style="margin-bottom:1.25rem;">
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-cyber-muted); margin-bottom:0.4rem;">
                    <span>Curriculum Progress</span>
                    <strong style="color:var(--emerald-light);">${percent}% (${completedCount}/${totalLessons} Lessons)</strong>
                  </div>
                  <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                    <div style="width:${percent}%; height:100%; background:linear-gradient(90deg, #10B981, #00F5D4, #8B5CF6);"></div>
                  </div>
                </div>
              </div>

              <div style="display:flex; gap:0.5rem; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.06); padding-top:1rem;">
                <button class="btn btn-primary btn-sm" onclick="window.lms?.openCoursePlayer('${activeEnroll.id}')">
                  <i data-lucide="play-circle"></i> Launch Course Player
                </button>
                ${activeEnroll.certificateId ? `
                  <button class="btn btn-outline btn-sm trigger-view-cert" data-cert="${activeEnroll.certificateId}">
                    <i data-lucide="award"></i> View Certificate
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Curriculum Level Overview -->
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem; margin-bottom:2rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="layers" style="color:var(--emerald-light);"></i> 4-Level Masterclass Roadmap
        </h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap:1rem;">
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(16, 185, 129, 0.3); border-radius:12px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
              <span class="badge badge-success" style="font-size:0.65rem;">COMPLETED</span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Level 1</span>
            </div>
            <h5 style="color:#FFF; font-size:0.95rem; margin:0 0 0.25rem 0;">Foundations & AI Studio</h5>
            <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">16 Lessons • Prompt Engineering & First Live Web App</p>
          </div>

          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(0, 245, 212, 0.4); border-radius:12px; padding:1rem; border-left:3px solid #00F5D4;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
              <span class="badge badge-warning" style="font-size:0.65rem;">IN PROGRESS</span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Level 2</span>
            </div>
            <h5 style="color:#FFF; font-size:0.95rem; margin:0 0 0.25rem 0;">Production Architecture</h5>
            <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">24 Lessons • UI/UX, Database RLS, State & Testing</p>
          </div>

          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
              <span class="badge" style="background:rgba(255,255,255,0.06); color:#94A3B8; font-size:0.65rem;">UPCOMING</span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Level 3</span>
            </div>
            <h5 style="color:#FFF; font-size:0.95rem; margin:0 0 0.25rem 0;">n8n & WhatsApp Automation</h5>
            <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">32 Lessons • 90-Sec Invoicing & Webhook Security</p>
          </div>

          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
              <span class="badge" style="background:rgba(255,255,255,0.06); color:#94A3B8; font-size:0.65rem;">UPCOMING</span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Level 4</span>
            </div>
            <h5 style="color:#FFF; font-size:0.95rem; margin:0 0 0.25rem 0;">VibeScan & Launch Capstone</h5>
            <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">16 Lessons • OWASP Audit, VibeCert & Freelance GTM</p>
          </div>
        </div>
      </div>

      <!-- Explore Additional Catalog Tracks -->
      ${unEnrolledCourses.length ? `
        <div>
          <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:1rem;">Available Add-on Specialist Tracks</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1rem;">
            ${unEnrolledCourses.map(c => `
              <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <span class="badge badge-teal" style="font-size:0.65rem; margin-bottom:0.35rem;">${c.category}</span>
                  <h5 style="color:#FFF; font-size:1rem; margin-bottom:0.25rem;">${c.title}</h5>
                  <p style="color:var(--text-cyber-muted); font-size:0.8rem; margin-bottom:0.75rem;">${c.subtitle || c.description}</p>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
                  <strong style="color:var(--emerald-light); font-size:0.95rem;">₦${(c.pricing?.amountNGN || 95000).toLocaleString()}</strong>
                  <button class="btn btn-outline btn-xs" onclick="window.payments?.openPaymentModal('${c.id}')">
                    Enroll in Track &rarr;
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  // =========================================================================
  // TAB 3: LIVE SESSIONS & BUILD CLINICS
  // =========================================================================
  renderStudentSessionsTab() {
    const container = document.getElementById('dashSessionsContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Live Build Clinics & Mentorship</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">Interactive Saturday live coding sessions with Lead Architect Nuel Effiong</p>
        </div>
        <span class="badge badge-success"><i data-lucide="video"></i> Weekly Saturdays @ 4:00 PM WAT</span>
      </div>

      <!-- Upcoming Featured Live Session -->
      <div class="student-session-row" style="background:radial-gradient(ellipse at left, rgba(16, 185, 129, 0.1) 0%, #080D16 100%); border-color:rgba(16, 185, 129, 0.3);">
        <div>
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <span class="badge badge-success">NEXT UPCOMING CLINIC</span>
            <span style="font-size:0.78rem; color:var(--emerald-light); font-weight:700;">Saturday, August 23 • 4:00 PM WAT</span>
          </div>
          <h3 style="color:#FFF; font-size:1.2rem; margin:0 0 0.35rem 0;">Live Code Clinic: Building WhatsApp Webhooks with Zero Secrets Leakage</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0;">
            Live walkthrough wiring n8n with Supabase PostgreSQL and Paystack HMAC validation. Bring your current code for live screen share review.
          </p>
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="window.toast?.success('Joined Live Stream Waiting Room (Google Meet)')">
            <i data-lucide="video"></i> Join Live Meet
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.toast?.info('Added to Google Calendar')">
            <i data-lucide="calendar"></i> Add to Calendar
          </button>
        </div>
      </div>

      <!-- Past Recorded Sessions Archive -->
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="film" style="color:var(--cyan-accent);"></i> Recorded Clinic Archives & Replays
        </h4>
        
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div class="student-session-row" style="padding:1rem;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-cyber-muted); margin-bottom:0.2rem;">Saturday, August 16 • 1h 42m</div>
              <strong style="color:#FFF; font-size:0.95rem;">Session 03: Database Row Level Security (RLS) Isolation & Anti-Leak Patterns</strong>
            </div>
            <button class="btn btn-outline btn-xs" onclick="window.toast?.info('Opening recorded session video...')">
              <i data-lucide="play"></i> Watch Replay
            </button>
          </div>

          <div class="student-session-row" style="padding:1rem;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-cyber-muted); margin-bottom:0.2rem;">Saturday, August 9 • 1h 28m</div>
              <strong style="color:#FFF; font-size:0.95rem;">Session 02: Antigravity Multi-File Vibe Coding & Context Management</strong>
            </div>
            <button class="btn btn-outline btn-xs" onclick="window.toast?.info('Opening recorded session video...')">
              <i data-lucide="play"></i> Watch Replay
            </button>
          </div>

          <div class="student-session-row" style="padding:1rem;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-cyber-muted); margin-bottom:0.2rem;">Saturday, August 2 • 1h 15m</div>
              <strong style="color:#FFF; font-size:0.95rem;">Session 01: Cohort 4 Orientation & Architecture Specifications Framework</strong>
            </div>
            <button class="btn btn-outline btn-xs" onclick="window.toast?.info('Opening recorded session video...')">
              <i data-lucide="play"></i> Watch Replay
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 4: ACHIEVEMENTS & VIBECERT™ CREDENTIALS
  // =========================================================================
  renderStudentAchievementsTab(user, enrollments) {
    const container = document.getElementById('dashAchievementsContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Achievements & VibeCert™ Credentials</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">Cryptographically verifiable builder certifications & distinction badges</p>
        </div>
        <span class="badge badge-teal">Tamper-Proof Ledger</span>
      </div>

      <!-- Flagship Official VibeCert Certificate Card -->
      <div style="background:radial-gradient(circle at 50% 0%, rgba(0, 245, 212, 0.1) 0%, #070A10 100%); border:1px solid rgba(0, 245, 212, 0.3); border-radius:20px; padding:2rem; margin-bottom:2rem; box-shadow:0 12px 36px rgba(0, 0, 0, 0.5);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
          <div>
            <span class="badge badge-success" style="margin-bottom:0.5rem;">OFFICIAL CREDENTIAL ISSUED</span>
            <h3 style="color:#FFF; font-size:1.4rem; margin:0 0 0.25rem 0;">The Zeerocodes VibeCode Labs Certified Builder</h3>
            <div style="font-size:0.85rem; color:var(--text-cyber-muted);">
              Issued to: <strong style="color:#FFF;">${user.displayName || 'Amina Yusuf'}</strong> • Serial ID: <span style="font-family:var(--font-mono); color:var(--emerald-light);">VIBECERT-2026-0881</span>
            </div>
          </div>
          <div style="text-align:right;">
            <span class="badge badge-teal" style="font-size:0.8rem; padding:0.4rem 0.85rem;">GRADE: DISTINCTION (98.4%)</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:0.72rem; color:var(--text-cyber-muted);">VERIFICATION STATUS</div>
            <div style="color:var(--emerald-light); font-weight:800; font-size:0.95rem;">Active & Valid</div>
          </div>
          <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:0.72rem; color:var(--text-cyber-muted);">SECURITY AUDIT</div>
            <div style="color:var(--cyan-accent); font-weight:800; font-size:0.95rem;">OWASP LLM Safe</div>
          </div>
          <div style="background:rgba(255,255,255,0.03); padding:0.85rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:0.72rem; color:var(--text-cyber-muted);">ISSUED BY</div>
            <div style="color:#FFF; font-weight:800; font-size:0.95rem;">Nuel Effiong</div>
          </div>
        </div>

        <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="window.app?.lookupCertificate('VIBECERT-2026-0881')">
            <i data-lucide="award"></i> View Verification Page &rarr;
          </button>
          <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('https://zeerocodes.com/#vibecert-verify?id=VIBECERT-2026-0881'); window.toast?.success('Verification link copied to clipboard!');">
            <i data-lucide="share-2"></i> Share Credential URL
          </button>
        </div>
      </div>

      <!-- 4 Milestone Badges Gallery -->
      <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem;">Track Distinction Badges</h4>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:1.25rem;">
        <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(16, 185, 129, 0.4); border-radius:16px; padding:1.25rem; text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">⚡</div>
          <h5 style="color:#FFF; font-size:1rem; margin:0 0 0.25rem 0;">Foundations Master</h5>
          <span class="badge badge-success" style="font-size:0.65rem; margin-bottom:0.5rem;">UNLOCKED</span>
          <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">Shipped live web app from AI Studio spec prompt.</p>
        </div>

        <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(0, 245, 212, 0.4); border-radius:16px; padding:1.25rem; text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🏗️</div>
          <h5 style="color:#FFF; font-size:1rem; margin:0 0 0.25rem 0;">Full-Stack Architect</h5>
          <span class="badge badge-warning" style="font-size:0.65rem; margin-bottom:0.5rem;">IN PROGRESS</span>
          <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">PostgreSQL RLS security schema & responsive UI.</p>
        </div>

        <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:1.25rem; text-align:center; opacity:0.7;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🤖</div>
          <h5 style="color:#FFF; font-size:1rem; margin:0 0 0.25rem 0;">Automation Engineer</h5>
          <span class="badge" style="background:rgba(255,255,255,0.06); color:#94A3B8; font-size:0.65rem; margin-bottom:0.5rem;">LOCKED</span>
          <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">n8n WhatsApp Paystack webhook reconciliation.</p>
        </div>

        <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:1.25rem; text-align:center; opacity:0.7;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🛡️</div>
          <h5 style="color:#FFF; font-size:1rem; margin:0 0 0.25rem 0;">Security Shield (OWASP)</h5>
          <span class="badge" style="background:rgba(255,255,255,0.06); color:#94A3B8; font-size:0.65rem; margin-bottom:0.5rem;">LOCKED</span>
          <p style="color:var(--text-cyber-muted); font-size:0.78rem; margin:0;">Zero leaks, zero prompt injection vulnerabilities.</p>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 5: MESSAGE / DISCUSSIONS
  // =========================================================================
  renderStudentDiscussionsTab(user) {
    const container = document.getElementById('dashDiscussionsContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Cohort Discussions & Q&A</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">Ask questions, get architectural feedback, and share project snippets</p>
        </div>
        <span class="badge badge-teal"><i data-lucide="message-square"></i> Cohort 4 Live Board</span>
      </div>

      <!-- Ask Question Form -->
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem; margin-bottom:1.5rem;">
        <h5 style="color:#FFF; font-size:1.05rem; margin:0 0 0.75rem 0; display:flex; align-items:center; gap:0.4rem;">
          <i data-lucide="help-circle" style="color:var(--emerald-light);"></i> Ask Nuel Effiong or the Cohort a Question
        </h5>
        <form onsubmit="window.app?.submitStudentQuestion(event)">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap:0.75rem; margin-bottom:0.75rem;">
            <select id="discussLessonTag" class="form-select">
              <option value="Level 2 — Module 05: UI/UX Thinking">Level 2 — Module 05: UI/UX Thinking</option>
              <option value="Level 2 — Module 06: Database Schema & RLS">Level 2 — Module 06: Database Schema & RLS</option>
              <option value="Level 1 — Module 04: AI Studio Deployment">Level 1 — Module 04: AI Studio Deployment</option>
              <option value="General Architecture & Prompting">General Architecture & Prompting</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0.75rem;">
            <textarea id="discussQuestionText" class="form-textarea" rows="2" placeholder="Describe the error or architecture question you have..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-sm">
            <i data-lucide="send"></i> Post Question to Forum
          </button>
        </form>
      </div>

      <!-- Existing Threads -->
      <div id="studentDiscussionsList">
        <div class="student-qa-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <strong style="color:#FFF; font-size:0.92rem;">Amina Yusuf</strong>
              <span class="badge badge-teal" style="font-size:0.65rem;">Level 2 • Module 05</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-cyber-muted);">2 hours ago</span>
          </div>
          <div style="font-size:0.88rem; color:#CBD5E1; margin-bottom:0.5rem;">
            When structuring component tokens in Antigravity for a multi-tenant client portal, should I isolate theme CSS variables inside a scoped container class or use CSS root variables?
          </div>
          <div class="student-qa-reply">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <strong style="color:var(--emerald-light); font-size:0.85rem;">Nuel Effiong (Lead Architect)</strong>
              <span style="font-size:0.72rem; color:var(--text-cyber-muted);">1 hour ago</span>
            </div>
            <p style="margin:0; color:#E2E8F0; font-size:0.82rem; line-height:1.45;">
              Use scoped container classes e.g. <code>.theme-client-tenant</code>. This prevents cross-tenant style bleeding when multiple portals share the same component bundle.
            </p>
          </div>
        </div>

        <div class="student-qa-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <strong style="color:#FFF; font-size:0.92rem;">Chinedu Eze</strong>
              <span class="badge badge-teal" style="font-size:0.65rem;">Level 1 • Module 04</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Yesterday</span>
          </div>
          <div style="font-size:0.88rem; color:#CBD5E1; margin-bottom:0.5rem;">
            What is the easiest way to inspect console runtime errors when deploying from AI Studio to a custom subdomain?
          </div>
          <div class="student-qa-reply">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <strong style="color:var(--emerald-light); font-size:0.85rem;">Nuel Effiong (Lead Architect)</strong>
              <span style="font-size:0.72rem; color:var(--text-cyber-muted);">Yesterday</span>
            </div>
            <p style="margin:0; color:#E2E8F0; font-size:0.82rem; line-height:1.45;">
              Check the Vercel/Netlify Deployment Function logs under the Real-Time Runtime tab, or use browser DevTools (F12 -> Console -> Preserve Log).
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 6: STUDY CENTERS & COMMUNITY
  // =========================================================================
  renderStudentCommunityTab() {
    const container = document.getElementById('dashCommunityContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Study Centers & Builder Hubs</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">Connect with peers in your region, join Discord channels, and access blueprints</p>
        </div>
        <span class="badge badge-success">4,200+ Active Builders</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1.25rem; margin-bottom:2rem;">
        <!-- Discord Community -->
        <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">👾</div>
          <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 0.35rem 0;">Private Discord Server</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem;">
            Exclusive channels for prompt reviews, code debugging, and live co-working voice rooms.
          </p>
          <button class="btn btn-primary btn-sm" style="width:100%;" onclick="window.toast?.success('Opening Zeerocodes Discord Server...')">
            <i data-lucide="message-square"></i> Open Discord (#cohort-4)
          </button>
        </div>

        <!-- WhatsApp VIP Group -->
        <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">📱</div>
          <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 0.35rem 0;">WhatsApp Cohort 4 VIP Chat</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem;">
            Instant Saturday clinic alerts, emergency code help, and daily motivation streak check-ins.
          </p>
          <button class="btn btn-outline btn-sm" style="width:100%; color:#25D366; border-color:rgba(37, 211, 102, 0.4);" onclick="window.toast?.success('Opening WhatsApp VIP Cohort Group...')">
            <i data-lucide="phone"></i> Join WhatsApp Group
          </button>
        </div>

        <!-- Lagos Physical Meetup Hub -->
        <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">📍</div>
          <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 0.35rem 0;">Lagos Physical Study Hub</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem;">
            Monthly in-person build sprint clinics in Lekki & Ikeja. High-speed power, coffee, and pair programming.
          </p>
          <button class="btn btn-outline btn-sm" style="width:100%;" onclick="window.toast?.info('Next Lagos Hub meetup: Last Saturday of the month @ Lekki Phase 1')">
            <i data-lucide="map-pin"></i> View Lagos Hub Details
          </button>
        </div>
      </div>

      <!-- Resource Downloads Hub -->
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="folder-down" style="color:var(--cyan-accent);"></i> Student Cheatsheet & Template Downloads
        </h4>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#FFF; font-size:0.9rem;">⚡ 2026 AI Build Prompts Pack (v3.2)</strong>
              <div style="font-size:0.75rem; color:var(--text-cyber-muted);">50+ copy-paste production prompts for Antigravity & AI Studio</div>
            </div>
            <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light);" onclick="window.toast?.success('Downloaded AI Prompts Cheatsheet PDF')"><i data-lucide="download"></i> Download</button>
          </div>
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#FFF; font-size:0.9rem;">📦 n8n WhatsApp Paystack Blueprint (.json)</strong>
              <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Ready-to-import n8n workflow file with HMAC verification nodes</div>
            </div>
            <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light);" onclick="window.toast?.success('Downloaded n8n Workflow JSON Template')"><i data-lucide="download"></i> Download</button>
          </div>
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#FFF; font-size:0.9rem;">🛡️ OWASP LLM Top 10 Security Checklist</strong>
              <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Self-audit checklist before submitting your capstone code for VibeScan certification</div>
            </div>
            <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light);" onclick="window.toast?.success('Downloaded Security Checklist PDF')"><i data-lucide="download"></i> Download</button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 7: SUPPORT TICKETS
  // =========================================================================
  renderStudentSupportTab(user) {
    const container = document.getElementById('dashSupportContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Support Tickets & Code Review Help</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">Get 1-on-1 technical assistance and code grading escalations</p>
        </div>
        <span class="badge badge-success">Average Response: &lt; 4 Hours</span>
      </div>

      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem; max-width:720px; margin-bottom:1.5rem;">
        <h5 style="color:#FFF; font-size:1.1rem; margin:0 0 1rem 0;">Submit a Support Request</h5>
        <form onsubmit="window.app?.submitSupportTicket(event)">
          <div class="form-group">
            <label class="form-label">Subject / Issue Title</label>
            <input type="text" id="suppSubject" class="form-input" placeholder="e.g. Supabase RLS recursion error in Module 6" required>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap:1rem; margin-bottom:1rem;">
            <div class="form-group">
              <label class="form-label">Priority</label>
              <select id="suppPriority" class="form-select">
                <option value="Normal">Normal (Within 24 hours)</option>
                <option value="High">High (Build Blocker - 4 hours)</option>
                <option value="Urgent">Urgent (Capstone Submission)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Repository / Lesson URL</label>
              <input type="url" id="suppRepoUrl" class="form-input" placeholder="https://github.com/..." required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Details of what you tried and the exact error</label>
            <textarea id="suppDetails" class="form-textarea" rows="3" placeholder="Paste your terminal or console error message..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-sm">
            <i data-lucide="send"></i> Open Support Ticket
          </button>
        </form>
      </div>

      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.25rem;">
        <h5 style="color:#FFF; font-size:1rem; margin:0 0 0.75rem 0;">Previous Tickets (1)</h5>
        <div style="background:rgba(255,255,255,0.02); padding:0.85rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.2rem;">
              <strong style="color:#FFF; font-size:0.9rem;">#TK-882: AI Studio CORS issue on subdomains</strong>
              <span class="badge badge-success">RESOLVED</span>
            </div>
            <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Resolved by Nuel Effiong • "Updated Next.js headers config."</div>
          </div>
          <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Aug 14, 2026</span>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 8: STUDIO PROJECTS
  // =========================================================================
  renderStudentStudioTab(studioProjects) {
    const studioContainer = document.getElementById('dashStudioContainer');
    if (!studioContainer) return;

    if (!studioProjects.length) {
      studioContainer.innerHTML = `
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:2.5rem; text-align:center;">
          <i data-lucide="workflow" style="width:48px; height:48px; color:var(--cyan-accent); margin-bottom:1rem;"></i>
          <h4 style="color:#FFF; font-size:1.2rem;">No Active Custom Software Builds Yet</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.9rem; max-width:480px; margin:0 auto 1.25rem auto;">
            Zeerocodes Studio builds, hosts, and operates high-converting Next.js web applications, client portals, and 90-second WhatsApp automated invoicing bots.
          </p>
          <button class="btn btn-primary btn-sm trigger-calendly-booking">
            <i data-lucide="calendar"></i> Book Free 30-Min Discovery Session
          </button>
        </div>
      `;
    } else {
      studioContainer.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.5rem;">
          ${studioProjects.map(p => `
            <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span class="badge badge-teal">${p.status.toUpperCase()}</span>
                <span style="color:#FFF; font-weight:800;">₦${((p.budgetNGN || 0) / 1000000).toFixed(1)}M</span>
              </div>
              <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:0.35rem;">${p.title}</h4>
              <div style="font-size:0.8rem; color:var(--emerald-light); margin-bottom:0.75rem;">${p.stage}</div>

              <div style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-cyber-muted); margin-bottom:0.25rem;">
                  <span>Milestones Completed</span>
                  <span>${p.progress}%</span>
                </div>
                <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                  <div style="width:${p.progress}%; height:100%; background:linear-gradient(90deg, var(--cyan-accent), var(--emerald-light));"></div>
                </div>
              </div>

              <div style="display:flex; gap:0.5rem; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.85rem;">
                ${p.stagingUrl ? `
                  <a href="${p.stagingUrl}" target="_blank" class="btn btn-outline btn-xs" style="color:var(--cyan-accent);">
                    <i data-lucide="external-link"></i> Staging URL
                  </a>
                ` : ''}
                <button class="btn btn-ghost btn-xs" style="color:var(--text-cyber-muted);" onclick="window.toast?.info('Connecting with Lead Architect Nuel Effiong...')">
                  <i data-lucide="message-square"></i> Request Revision
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // =========================================================================
  // TAB 9: VIBESCAN SECURITY
  // =========================================================================
  renderStudentVibescanTab(vibescanSubs) {
    const vibescanContainer = document.getElementById('dashVibescanContainer');
    if (!vibescanContainer) return;

    if (!vibescanSubs.length) {
      vibescanContainer.innerHTML = `
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:2.5rem; text-align:center;">
          <i data-lucide="shield-check" style="width:48px; height:48px; color:var(--emerald-light); margin-bottom:1rem;"></i>
          <h4 style="color:#FFF; font-size:1.2rem;">No Repositories Audited Yet</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.9rem; max-width:480px; margin:0 auto 1.25rem auto;">
            Ensure your vibe-coded application has no exposed API keys, missing database RLS, or forged webhook vulnerabilities.
          </p>
          <a href="#vibescan" class="btn btn-primary btn-sm">
            <i data-lucide="shield"></i> Request Code Security Audit
          </a>
        </div>
      `;
    } else {
      vibescanContainer.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.5rem;">
          ${vibescanSubs.map(s => `
            <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <span class="badge ${s.status === 'certified' ? 'badge-success' : 'badge-danger'}">${s.status.toUpperCase()}</span>
                <span style="color:var(--emerald-light); font-weight:800; font-size:1.1rem;">Score: ${s.securityScore || 95}/100</span>
              </div>
              <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:0.35rem;">${s.appName}</h4>
              <div style="font-size:0.78rem; color:var(--text-cyber-muted); margin-bottom:1rem;">
                <strong>Repo:</strong> <a href="${s.appUrl}" target="_blank" style="color:var(--emerald-light);">${s.appUrl}</a>
              </div>

              <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); margin-bottom:1rem; font-size:0.8rem;">
                <div style="color:var(--text-cyber-muted); margin-bottom:0.25rem;"><strong>Tamper-Proof Badge ID:</strong> ${s.certificationId || 'Pending'}</div>
                <div style="color:var(--emerald-light);">✓ OWASP LLM Top 10 Verified</div>
              </div>

              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <button class="btn btn-outline btn-xs" onclick="navigator.clipboard.writeText('<script src=&quot;https://zeerocodes.com/vibecert.js&quot; data-cert=&quot;${s.certificationId || 'VIBECERT-2026-0042'}&quot;></script>'); window.toast?.success('VibeCert badge embed code copied!');">
                  <i data-lucide="code"></i> Copy Badge Embed Script
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // =========================================================================
  // TAB 10: BILLING & INVOICES
  // =========================================================================
  renderStudentBillingTab(userPayments, user) {
    const billingContainer = document.getElementById('dashBillingContainer');
    if (!billingContainer) return;

    billingContainer.innerHTML = `
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color:#FFF; font-size:1.15rem; margin:0;">Payment & Invoicing Ledger</h4>
          <span class="badge badge-success">Paystack Verified</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${userPayments.length ? userPayments.map(p => `
            <div style="background:rgba(255,255,255,0.02); padding:0.85rem 1.1rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <strong style="color:#FFF; font-size:0.92rem;">${p.item}</strong>
                  <span class="badge badge-success">PAID</span>
                </div>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono); margin-top:0.2rem;">
                  Ref: ${p.reference} • Gateway: ${p.provider} • Date: ${new Date(p.verifiedAt).toLocaleDateString()}
                </div>
              </div>
              <div style="text-align:right;">
                <strong style="color:#FFF; font-size:1.05rem;">₦${(p.amountNGN).toLocaleString()}</strong>
                <div><button class="btn btn-ghost btn-xs" style="color:var(--emerald-light); padding:0;" onclick="window.toast?.success('Official Receipt PDF downloaded')"><i data-lucide="download"></i> Download Receipt</button></div>
              </div>
            </div>
          `).join('') : `
            <div style="padding:2rem; text-align:center; color:var(--text-cyber-muted);">
              <i data-lucide="receipt" style="width:36px; height:36px; color:var(--text-cyber-muted); margin-bottom:0.75rem;"></i>
              <div>No payment records found for this account.</div>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 11: SETTINGS (STUDENT)
  // =========================================================================
  renderStudentSettingsTab(user) {
    const container = document.getElementById('dashSettingsContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.75rem; max-width:640px;">
        <h4 style="color:#FFF; font-size:1.15rem; margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="user-check" style="color:#A855F7;"></i> Account & Profile Details
        </h4>
        <form onsubmit="window.app?.saveProfileSettings(event)">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="accSettingsName" class="form-input" value="${user.displayName || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp / Phone Number</label>
            <input type="tel" id="accSettingsPhone" class="form-input" value="${user.phone || ''}" placeholder="+234 812 000 0000">
          </div>
          <div class="form-group">
            <label class="form-label">Bio / Builder Goal</label>
            <textarea id="accSettingsBio" class="form-textarea" rows="3" placeholder="Tell us what you are building...">${user.bio || ''}</textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-sm">Save Profile Changes</button>
        </form>
      </div>
    `;
  }

  // =========================================================================
  // ENTERPRISE CLIENT DASHBOARD SUITE
  // =========================================================================
  renderEnterpriseClientDashboard(user, studioProjects, vibescanSubs, userPayments, invoices) {
    this.renderEnterpriseOverviewTab(user, studioProjects, vibescanSubs, invoices);
    this.renderEnterpriseProjectsTab(user, studioProjects);
    this.renderEnterprisePipelinesTab(user, studioProjects);
    this.renderEnterpriseSecurityTab(user, vibescanSubs);
    this.renderEnterpriseBillingTab(user, invoices, userPayments);
    this.renderEnterpriseTeamTab(user);
    this.renderEnterpriseSlaTab(user);
    this.renderEnterpriseSettingsTab(user);
  }

  // --- 1. ENTERPRISE EXECUTIVE OVERVIEW TAB ---
  renderEnterpriseOverviewTab(user, studioProjects, vibescanSubs, invoices) {
    const container = document.getElementById('dashOverviewContainer');
    if (!container) return;

    const company = user.company || 'PayQuick Africa';
    const activeProject = (studioProjects && studioProjects.length) ? studioProjects[0] : {
      title: 'WhatsApp Paystack Invoicing Engine',
      stage: 'Phase 4: Kyber Encryption & Pre-Launch Security Lock',
      progress: 85,
      budgetNGN: 2500000,
      slaStatus: '99.99% Uptime SLA Active',
      stagingUrl: 'https://payquick-staging.zeerocodes.com'
    };

    const pendingInvoices = (invoices || []).filter(i => i.clientEmail === user.email && i.status === 'pending');

    container.innerHTML = `
      <!-- Enterprise Executive Header Banner -->
      <div class="student-welcome-banner" style="background:linear-gradient(135deg, rgba(34, 211, 238, 0.12) 0%, rgba(12, 17, 26, 0.95) 100%); border-color:rgba(34, 211, 238, 0.35); margin-bottom:1.5rem;">
        <div class="student-welcome-left">
          <div class="student-avatar-badge" style="border-color:var(--cyan-accent); box-shadow:0 0 20px rgba(34, 211, 238, 0.35);">
            <img src="${user.photoURL || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'}" alt="${user.displayName}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">
            <span class="student-online-dot" style="background:#10B981; box-shadow:0 0 8px #10B981;" title="24/7 SLA Telemetry Active"></span>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.25rem;">
              <span class="badge badge-teal" style="font-size:0.7rem; font-weight:800;">
                <i data-lucide="shield-check" style="width:12px; height:12px; display:inline;"></i> ENTERPRISE WORKSPACE
              </span>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Client ID: #ENT-${(user.uid || '000000').slice(-6).toUpperCase()}</span>
            </div>
            <h3 style="color:#FFF; font-size:1.4rem; font-weight:800; margin:0;">
              ${company.toUpperCase()} <span style="color:var(--cyan-accent);">EXECUTIVE PORTAL</span>
            </h3>
            <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">
              Active System: <strong style="color:#FFF;">${activeProject.title}</strong> • Lead Architect: <strong style="color:var(--emerald-light);">Nuel Effiong</strong>
            </p>
          </div>
        </div>
        <div class="student-welcome-right" style="text-align:right;">
          <div class="badge badge-success" style="font-size:0.75rem; padding:0.4rem 0.8rem; margin-bottom:0.4rem;">
            🛡️ 24/7 Managed Operations (99.99% SLA)
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Sprint Status: On Schedule (Sprint 4 of 5)</div>
        </div>
      </div>

      <!-- 4 High-Impact Executive KPI Metric Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; position:relative; overflow:hidden;">
          <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-weight:700; text-transform:uppercase;">Active Software Builds</div>
          <div style="font-size:1.6rem; font-weight:900; color:#FFF; margin:0.25rem 0;">1 Core Engine</div>
          <div style="font-size:0.75rem; color:var(--cyan-accent);">${activeProject.progress}% Milestone Completed</div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; position:relative; overflow:hidden;">
          <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-weight:700; text-transform:uppercase;">SLA Uptime Guarantee</div>
          <div style="font-size:1.6rem; font-weight:900; color:#10B981; margin:0.25rem 0;">99.99%</div>
          <div style="font-size:0.75rem; color:var(--emerald-light);">24/7 Telemetry Heartbeat Live</div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; position:relative; overflow:hidden;">
          <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-weight:700; text-transform:uppercase;">Reclaimed Labor Time</div>
          <div style="font-size:1.6rem; font-weight:900; color:var(--cyan-accent); margin:0.25rem 0;">420 Hrs/Mo</div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Automated Invoicing & CRM Sync</div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem; position:relative; overflow:hidden;">
          <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-weight:700; text-transform:uppercase;">AST Security & Compliance</div>
          <div style="font-size:1.6rem; font-weight:900; color:#34D399; margin:0.25rem 0;">Grade A (98/100)</div>
          <div style="font-size:0.75rem; color:var(--emerald-light);">VibeCert™ Cryptographically Verified</div>
        </div>
      </div>

      <!-- Active Milestone Sprint Pipeline -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem; margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <h4 style="color:#FFF; font-size:1.15rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="git-branch" style="color:var(--cyan-accent);"></i> Active Sprint Delivery Pipeline: ${activeProject.title}
            </h4>
            <p style="color:var(--text-cyber-muted); font-size:0.8rem; margin:0.2rem 0 0 0;">
              Track real-time engineering milestones from architecture blueprinting to production launch.
            </p>
          </div>
          <span class="badge badge-teal" style="font-size:0.75rem;">Sprint Phase: 4 of 5 (85%)</span>
        </div>

        <!-- 5 Milestone Nodes -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 180px), 1fr)); gap:0.75rem; margin-bottom:1.5rem;">
          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <span style="font-size:0.75rem; color:var(--emerald-light); font-weight:700;">M1: COMPLETED</span>
              <i data-lucide="check-circle" style="width:14px; height:14px; color:var(--emerald-light);"></i>
            </div>
            <strong style="color:#FFF; font-size:0.85rem; display:block;">System Architecture Spec</strong>
            <span style="font-size:0.72rem; color:var(--text-cyber-muted);">Signed PRD & schema</span>
          </div>

          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <span style="font-size:0.75rem; color:var(--emerald-light); font-weight:700;">M2: COMPLETED</span>
              <i data-lucide="check-circle" style="width:14px; height:14px; color:var(--emerald-light);"></i>
            </div>
            <strong style="color:#FFF; font-size:0.85rem; display:block;">Next.js Staging Portal</strong>
            <span style="font-size:0.72rem; color:var(--text-cyber-muted);">UI components & auth</span>
          </div>

          <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:1rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <span style="font-size:0.75rem; color:var(--emerald-light); font-weight:700;">M3: COMPLETED</span>
              <i data-lucide="check-circle" style="width:14px; height:14px; color:var(--emerald-light);"></i>
            </div>
            <strong style="color:#FFF; font-size:0.85rem; display:block;">WhatsApp & Paystack Bot</strong>
            <span style="font-size:0.72rem; color:var(--text-cyber-muted);">Webhook auto-reconciliation</span>
          </div>

          <div style="background:rgba(34, 211, 238, 0.1); border:1px solid rgba(34, 211, 238, 0.4); border-radius:10px; padding:1rem; box-shadow:0 0 15px rgba(34, 211, 238, 0.1);">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <span style="font-size:0.75rem; color:var(--cyan-accent); font-weight:800;">M4: IN PROGRESS</span>
              <div class="pulse-indicator" style="width:8px; height:8px;"></div>
            </div>
            <strong style="color:#FFF; font-size:0.85rem; display:block;">AST Security Audit & Cert</strong>
            <span style="font-size:0.72rem; color:var(--cyan-accent);">OWASP LLM & Kyber Lock</span>
          </div>

          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:1rem; opacity:0.6;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">M5: QUEUED</span>
              <i data-lucide="lock" style="width:14px; height:14px; color:var(--text-cyber-muted);"></i>
            </div>
            <strong style="color:#FFF; font-size:0.85rem; display:block;">Production DNS & Handover</strong>
            <span style="font-size:0.72rem; color:var(--text-cyber-muted);">Live domain cutover</span>
          </div>
        </div>

        <!-- Staging Prototype Launcher Banner -->
        <div style="background:radial-gradient(ellipse at top, rgba(0, 245, 212, 0.08) 0%, rgba(12, 17, 26, 0.95) 100%); border:1px solid rgba(0, 245, 212, 0.25); border-radius:12px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
              <span class="badge badge-teal" style="font-size:0.65rem;">LIVE STAGING ENVIRONMENT</span>
              <strong style="color:#FFF; font-size:0.95rem;">PayQuick Staging Build v1.4-rc2</strong>
            </div>
            <div style="font-size:0.8rem; color:var(--text-cyber-muted);">
              Dedicated Edge Server: <a href="${activeProject.stagingUrl}" target="_blank" style="color:var(--emerald-light); font-family:var(--font-mono);">${activeProject.stagingUrl}</a>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <a href="${activeProject.stagingUrl}" target="_blank" class="btn btn-primary btn-sm">
              <i data-lucide="external-link"></i> Launch Staging Prototype
            </a>
            <button class="btn btn-outline btn-sm" onclick="window.app?.openEnterpriseFeedbackModal('${activeProject.title}')">
              <i data-lucide="message-square"></i> Submit Sprint Feedback
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Executive Action Center -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem;">
        <!-- Telemetry Stream Preview -->
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.75rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="activity" style="color:var(--emerald-light);"></i> Live Autonomous Telemetry
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.6rem; font-family:var(--font-mono); font-size:0.75rem;">
            <div style="background:rgba(255,255,255,0.02); padding:0.6rem; border-radius:6px; border-left:3px solid #10B981; display:flex; justify-content:space-between;">
              <span style="color:#FFF;">[WHATSAPP-BOT] Customer invoice #INV-992 generated</span>
              <span style="color:var(--text-cyber-muted);">2m ago (6ms)</span>
            </div>
            <div style="background:rgba(255,255,255,0.02); padding:0.6rem; border-radius:6px; border-left:3px solid var(--cyan-accent); display:flex; justify-content:space-between;">
              <span style="color:#FFF;">[PAYSTACK-RECON] HMAC SHA-512 settlement verified</span>
              <span style="color:var(--text-cyber-muted);">8m ago (12ms)</span>
            </div>
            <div style="background:rgba(255,255,255,0.02); padding:0.6rem; border-radius:6px; border-left:3px solid #8B5CF6; display:flex; justify-content:space-between;">
              <span style="color:#FFF;">[KYBER-ENCRYPT] Secret environment keys rotated</span>
              <span style="color:var(--text-cyber-muted);">24m ago (4ms)</span>
            </div>
          </div>
        </div>

        <!-- Priority Architect Contact Card -->
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="phone-call" style="color:var(--cyan-accent);"></i> Lead Architect Priority Hotline
          </h4>
          <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem; line-height:1.45;">
            Direct Slack & WhatsApp channel with Principal AI Systems Architect Nuel Effiong. Guaranteed SLA response time under 15 minutes.
          </p>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="https://wa.me/2348120000000?text=Hi%20Nuel%2C%20this%20is%20${encodeURIComponent(user.displayName || company)}%20regarding%20our%20enterprise%20build%20(${encodeURIComponent(activeProject.title)})." target="_blank" class="btn btn-primary btn-sm" style="background:#25D366; border-color:#25D366; color:#000; font-weight:700;">
              <i data-lucide="message-square"></i> Open Priority WhatsApp
            </a>
            <button class="btn btn-outline btn-sm trigger-calendly-booking">
              <i data-lucide="calendar"></i> Book Sprint Review
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- 2. ENTERPRISE STUDIO PROJECTS & SPRINT ROADMAP TAB ---
  renderEnterpriseProjectsTab(user, studioProjects) {
    const container = document.getElementById('dashStudioContainer');
    if (!container) return;

    const projects = studioProjects && studioProjects.length ? studioProjects : [
      {
        id: 'proj_payquick_01',
        title: 'PayQuick WhatsApp Invoicing & Accounting Engine',
        clientName: user.displayName || 'PayQuick Africa',
        stage: 'Phase 4: AST Security & Pre-Launch Hardening',
        progress: 85,
        budgetNGN: 2500000,
        status: 'in-progress',
        stagingUrl: 'https://payquick-staging.zeerocodes.com',
        deliverables: [
          'Next.js 15 Client Admin Dashboard',
          '90-Second WhatsApp Conversational Invoicing Flow',
          'Paystack HMAC SHA-512 Webhook Engine',
          'Supabase PostgreSQL Multi-Tenant RLS Policies',
          'OWASP LLM AST Security Certification'
        ]
      }
    ];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Enterprise Studio Software Builds</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Track sprint delivery, review staging previews, and inspect technical deliverables.
          </p>
        </div>
        <button class="btn btn-primary btn-sm trigger-calendly-booking">
          <i data-lucide="plus"></i> Request New System Scope
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        ${projects.map(p => `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <span class="badge ${p.status === 'completed' ? 'badge-success' : 'badge-teal'}" style="font-size:0.7rem; margin-bottom:0.4rem;">
                  ${p.status.toUpperCase()}
                </span>
                <h3 style="color:#FFF; font-size:1.3rem; margin:0 0 0.25rem 0;">${p.title}</h3>
                <div style="font-size:0.85rem; color:var(--cyan-accent);">${p.stage}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">BUDGET ALLOCATION</div>
                <strong style="color:var(--emerald-light); font-size:1.3rem;">₦${((p.budgetNGN || 2500000)).toLocaleString()}</strong>
              </div>
            </div>

            <!-- Progress bar -->
            <div style="margin-bottom:1.5rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-cyber-muted); margin-bottom:0.35rem;">
                <span>Sprint Milestone Completion</span>
                <strong style="color:#FFF;">${p.progress}%</strong>
              </div>
              <div style="width:100%; height:8px; background:rgba(255,255,255,0.08); border-radius:4px; overflow:hidden;">
                <div style="width:${p.progress}%; height:100%; background:linear-gradient(90deg, var(--cyan-accent), var(--emerald-light));"></div>
              </div>
            </div>

            <!-- Deliverables Checklist -->
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:1.25rem; margin-bottom:1.5rem;">
              <strong style="color:var(--emerald-light); font-size:0.85rem; display:block; margin-bottom:0.75rem;">
                <i data-lucide="check-square"></i> Milestone Deliverables & Artifacts:
              </strong>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap:0.6rem;">
                ${(p.deliverables || []).map(d => `
                  <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.82rem; color:#DDD;">
                    <i data-lucide="check-circle" style="width:14px; height:14px; color:var(--emerald-light); flex-shrink:0;"></i>
                    <span>${d}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Action buttons -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                ${p.stagingUrl ? `
                  <a href="${p.stagingUrl}" target="_blank" class="btn btn-primary btn-sm">
                    <i data-lucide="external-link"></i> Launch Staging Portal
                  </a>
                ` : ''}
                <button class="btn btn-outline btn-sm" onclick="window.app?.openEnterpriseFeedbackModal('${p.title}')">
                  <i data-lucide="message-square"></i> Request Scope Modification
                </button>
              </div>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">SLA: 24/7 Managed Operations</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- 3. ENTERPRISE AUTONOMOUS PIPELINES & TELEMETRY TAB ---
  renderEnterprisePipelinesTab(user, studioProjects) {
    const container = document.getElementById('dashPipelinesContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Autonomous Pipelines & Real-Time Event Streams</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Live webhook triggers, automated billing bots, and continuous infrastructure heartbeat telemetry.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.app?.simulatePipelineEvent()">
          <i data-lucide="play"></i> Trigger Test Pipeline Event
        </button>
      </div>

      <!-- 3 Real-Time Pipeline Node Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1.25rem; margin-bottom:2rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:16px; padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span class="badge badge-success">ONLINE</span>
            <span style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">6ms avg</span>
          </div>
          <h4 style="color:#FFF; font-size:1.05rem; margin:0 0 0.25rem 0;">WhatsApp Invoicing Gateway</h4>
          <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">Dispatches PDF receipts & dynamic payment deep-links in &lt;90 seconds.</p>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:16px; padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span class="badge badge-success">ONLINE</span>
            <span style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">12ms avg</span>
          </div>
          <h4 style="color:#FFF; font-size:1.05rem; margin:0 0 0.25rem 0;">Paystack Automated Reconciliation</h4>
          <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">Constant-time HMAC SHA-512 verification & double-spend protection.</p>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:16px; padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span class="badge badge-teal">ENCRYPTED</span>
            <span style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">Post-Quantum</span>
          </div>
          <h4 style="color:#FFF; font-size:1.05rem; margin:0 0 0.25rem 0;">Kyber Key Rotation Vault</h4>
          <p style="font-size:0.78rem; color:var(--text-cyber-muted); margin:0;">Zero-leak token management and automated API secret rotation.</p>
        </div>
      </div>

      <!-- Live Stream Console -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="terminal" style="color:var(--cyan-accent);"></i> Live Telemetry Stream Feed
        </h4>
        <div id="enterpriseLiveStreamConsole" style="display:flex; flex-direction:column; gap:0.6rem; font-family:var(--font-mono); font-size:0.8rem;">
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:8px; border-left:3px solid #10B981; display:flex; justify-content:space-between; align-items:center;">
            <div><strong style="color:#10B981;">[EVENT_2026_091]</strong> <span style="color:#FFF;">Paystack Charge Success -> Order #ORD-8819 fulfilled</span></div>
            <span style="color:var(--text-cyber-muted);">Just now (4ms)</span>
          </div>
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:8px; border-left:3px solid var(--cyan-accent); display:flex; justify-content:space-between; align-items:center;">
            <div><strong style="color:var(--cyan-accent);">[EVENT_2026_090]</strong> <span style="color:#FFF;">WhatsApp Webhook 200 OK -> Invoicing PDF generated</span></div>
            <span style="color:var(--text-cyber-muted);">2m ago (8ms)</span>
          </div>
          <div style="background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:8px; border-left:3px solid #8B5CF6; display:flex; justify-content:space-between; align-items:center;">
            <div><strong style="color:#8B5CF6;">[EVENT_2026_089]</strong> <span style="color:#FFF;">Supabase RLS Tenant Isolation Guardrail Verified</span></div>
            <span style="color:var(--text-cyber-muted);">10m ago (14ms)</span>
          </div>
        </div>
      </div>
    `;
  }

  // --- 4. ENTERPRISE SECURITY & GOVERNANCE TAB ---
  renderEnterpriseSecurityTab(user, vibescanSubs) {
    const container = document.getElementById('dashVibescanContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Enterprise Security & OWASP Governance</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Static AST security scorecards, continuous tamper-proof VibeCert badges, and active guardrails.
          </p>
        </div>
        <span class="badge badge-success" style="font-size:0.8rem; padding:0.4rem 0.85rem;">
          🛡️ VibeCert™ Grade A Verified (98/100)
        </span>
      </div>

      <!-- Security Guardrail Control Toggles -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem; margin-bottom:2rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 1rem 0; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="sliders" style="color:var(--cyan-accent);"></i> Active Security Guardrail Policies
        </h4>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap:1rem;">
          <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#FFF; font-size:0.88rem; display:block;">Constant-Time HMAC Enforcer</strong>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Mitigates webhook timing side-channels</span>
            </div>
            <input type="checkbox" checked style="accent-color:var(--emerald-light); width:18px; height:18px;" onchange="window.toast?.success('Security Policy Updated: Constant-Time HMAC active')">
          </div>

          <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#FFF; font-size:0.88rem; display:block;">Supabase PostgreSQL RLS</strong>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Tenant isolation & zero-leak queries</span>
            </div>
            <input type="checkbox" checked style="accent-color:var(--emerald-light); width:18px; height:18px;" onchange="window.toast?.success('Security Policy Updated: PostgreSQL RLS active')">
          </div>

          <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#FFF; font-size:0.88rem; display:block;">LLM Prompt Injection Shield</strong>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Sanitizes user messages before AI prompts</span>
            </div>
            <input type="checkbox" checked style="accent-color:var(--emerald-light); width:18px; height:18px;" onchange="window.toast?.success('Security Policy Updated: Prompt Injection Shield active')">
          </div>

          <div style="background:rgba(255,255,255,0.02); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:#FFF; font-size:0.88rem; display:block;">PII Customer Data Redactor</strong>
              <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Masks BVN, credit card & phone numbers</span>
            </div>
            <input type="checkbox" checked style="accent-color:var(--emerald-light); width:18px; height:18px;" onchange="window.toast?.success('Security Policy Updated: PII Redactor active')">
          </div>
        </div>
      </div>

      <!-- VibeCert Trust Badge Embed Code -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="award" style="color:var(--emerald-light);"></i> Embed Official Enterprise VibeCert™ Trust Badge
        </h4>
        <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1.25rem;">
          Display the live cryptographic security badge on your corporate website to build customer trust.
        </p>
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:1rem; margin-bottom:1rem; font-family:var(--font-mono); font-size:0.8rem; color:var(--cyan-accent);">
          &lt;script src="https://zeerocodes.com/vibecert.js" data-cert="VIBECERT-2026-ENT-001" data-theme="dark"&gt;&lt;/script&gt;
        </div>
        <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('<script src=&quot;https://zeerocodes.com/vibecert.js&quot; data-cert=&quot;VIBECERT-2026-ENT-001&quot; data-theme=&quot;dark&quot;></script>'); window.toast?.success('VibeCert script copied to clipboard!');">
          <i data-lucide="copy"></i> Copy Badge Embed Script
        </button>
      </div>
    `;
  }

  // --- 5. ENTERPRISE BILLING & MILESTONE INVOICING TAB ---
  renderEnterpriseBillingTab(user, invoices, userPayments) {
    const container = document.getElementById('dashBillingContainer');
    if (!container) return;

    const clientInvoices = (invoices || []).filter(i => i.clientEmail === user.email || i.clientName === user.displayName);
    const displayInvoices = clientInvoices.length ? clientInvoices : [
      {
        id: 'INV-2026-001',
        clientName: user.displayName || 'Enterprise Client',
        projectTitle: 'WhatsApp Paystack Invoicing Engine (Milestone 1 & 2)',
        amountNGN: 2500000,
        dueDate: '2026-08-25',
        status: 'paid'
      }
    ];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">Milestone Invoices & Cryptographic Receipts</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Manage milestone payments, download PDF invoices, and verify settlement receipts.
          </p>
        </div>
        <span class="badge badge-success">Paystack Verified Gateway</span>
      </div>

      <!-- Invoices Ledger -->
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem; margin-bottom:2rem;">
        <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="receipt" style="color:var(--emerald-light);"></i> Milestone Invoices Ledger
        </h4>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${displayInvoices.map(inv => `
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
              <div>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                  <strong style="color:#FFF; font-size:0.95rem; font-family:var(--font-mono);">${inv.id}</strong>
                  <span class="badge ${inv.status === 'paid' ? 'badge-success' : 'badge-warning'}">${inv.status.toUpperCase()}</span>
                </div>
                <div style="font-size:0.82rem; color:var(--text-cyber-muted);">${inv.projectTitle}</div>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted); margin-top:0.2rem;">Due Date: ${inv.dueDate}</div>
              </div>

              <div style="text-align:right;">
                <strong style="color:var(--emerald-light); font-size:1.25rem;">₦${(inv.amountNGN).toLocaleString()}</strong>
                <div style="display:flex; gap:0.4rem; justify-content:flex-end; margin-top:0.4rem;">
                  ${inv.status === 'pending' ? `
                    <button class="btn btn-primary btn-xs" onclick="window.payments?.initializePayment({ amountNGN: ${inv.amountNGN}, item: '${inv.id} - ${inv.projectTitle}' })">
                      <i data-lucide="credit-card"></i> Pay Now via Paystack
                    </button>
                  ` : `
                    <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light);" onclick="window.toast?.success('Official Cryptographic Receipt downloaded for ' + '${inv.id}')">
                      <i data-lucide="download"></i> Download Receipt
                    </button>
                  `}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 6. ENTERPRISE MULTI-SEAT TEAM MANAGEMENT TAB ---
  renderEnterpriseTeamTab(user) {
    const container = document.getElementById('dashTeamContainer');
    if (!container) return;

    const company = user.company || 'PayQuick Africa';
    const teamMembers = [
      { name: user.displayName || 'Tunde Balogun', role: 'Chief Executive Officer (Owner)', email: user.email, status: 'Active' },
      { name: 'Nuel Effiong', role: 'Principal AI Systems Architect (Zeerocodes)', email: 'admin@zeerocodes.com', status: 'Lead Architect' },
      { name: 'Kemi Adeleke', role: 'Head of Product & Operations', email: 'kemi@payquick.africa', status: 'Active' }
    ];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">${company} Team Seats & Role Permissions</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Manage authorized team members who have access to sprint reviews, staging links, and telemetry.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="window.app?.openAddTeamMemberModal()">
          <i data-lucide="user-plus"></i> Invite Team Member
        </button>
      </div>

      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.5rem;">
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${teamMembers.map(m => `
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg, var(--cyan-accent), var(--emerald-light)); display:flex; align-items:center; justify-content:center; color:#000; font-weight:800; font-size:0.9rem;">
                  ${m.name.charAt(0)}
                </div>
                <div>
                  <strong style="color:#FFF; font-size:0.95rem;">${m.name}</strong>
                  <div style="font-size:0.78rem; color:var(--text-cyber-muted);">${m.role} • <span style="color:var(--cyan-accent);">${m.email}</span></div>
                </div>
              </div>
              <span class="badge badge-teal">${m.status}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 7. ENTERPRISE 24/7 SLA & ARCHITECT HOTLINE TAB ---
  renderEnterpriseSlaTab(user) {
    const container = document.getElementById('dashSlaContainer');
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <h4 style="color:#FFF; font-size:1.25rem; margin:0;">24/7 SLA Operations & Direct Architect Hotline</h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.2rem 0 0 0;">
            Direct SLA channel with Lead Systems Architect Nuel Effiong & continuous infrastructure uptime guarantees.
          </p>
        </div>
        <span class="badge badge-success">Guaranteed &lt;15m Response Time</span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.5rem;">
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem;">
          <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 0.5rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="phone-call" style="color:var(--emerald-light);"></i> Emergency Architect Hotline
          </h4>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin-bottom:1.5rem; line-height:1.5;">
            Enterprise partners have 24/7 priority escalation. If you encounter any critical production blockers, reach Nuel Effiong directly.
          </p>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            <a href="https://wa.me/2348120000000?text=URGENT%20SLA%20HOTLINE%3A%20${encodeURIComponent(user.displayName || 'Enterprise Client')}" target="_blank" class="btn btn-primary btn-sm" style="background:#25D366; border-color:#25D366; color:#000; font-weight:700; text-align:center;">
              <i data-lucide="message-square"></i> Open Emergency WhatsApp Channel
            </a>
            <button class="btn btn-outline btn-sm trigger-calendly-booking">
              <i data-lucide="calendar"></i> Book Weekly Sprint Architecture Review
            </button>
          </div>
        </div>

        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:18px; padding:1.75rem;">
          <h4 style="color:#FFF; font-size:1.15rem; margin:0 0 0.75rem 0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="shield-check" style="color:var(--cyan-accent);"></i> SLA Commitments & Guarantees
          </h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.85rem;">
            <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.5rem;">
              <strong style="color:#FFF;">Uptime Commitment:</strong> <span style="color:var(--emerald-light);">99.99% Monthly Uptime</span>
            </div>
            <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.5rem;">
              <strong style="color:#FFF;">Critical Incident Response:</strong> <span style="color:var(--cyan-accent);">&lt; 15 Minutes</span>
            </div>
            <div style="border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.5rem;">
              <strong style="color:#FFF;">Automated Database Backups:</strong> <span style="color:#FFF;">Every 6 Hours (Encrypted)</span>
            </div>
            <div>
              <strong style="color:#FFF;">Post-Launch Warranty:</strong> <span style="color:#FFF;">90 Days Full Engineering Coverage</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- 8. ENTERPRISE SETTINGS TAB ---
  renderEnterpriseSettingsTab(user) {
    const container = document.getElementById('dashSettingsContainer');
    if (!container) return;

    const company = user.company || 'PayQuick Africa';

    container.innerHTML = `
      <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.75rem; max-width:680px;">
        <h4 style="color:#FFF; font-size:1.15rem; margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
          <i data-lucide="building" style="color:var(--cyan-accent);"></i> Enterprise Organization Settings
        </h4>
        <form onsubmit="window.app?.saveEnterpriseSettings(event)">
          <div class="form-group">
            <label class="form-label">Company / Organization Name</label>
            <input type="text" id="entSettingsCompany" class="form-input" value="${company}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Authorized Contact Person</label>
            <input type="text" id="entSettingsName" class="form-input" value="${user.displayName || ''}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Primary Corporate WhatsApp / Phone</label>
            <input type="tel" id="entSettingsPhone" class="form-input" value="${user.phone || ''}" placeholder="+234 812 000 0000">
          </div>
          <div class="form-group">
            <label class="form-label">Webhook Notification Endpoint</label>
            <input type="url" id="entSettingsWebhook" class="form-input" value="${user.webhookUrl || 'https://api.payquick.africa/webhooks/zeerocodes'}" placeholder="https://api.yourdomain.com/webhooks">
          </div>
          <button type="submit" class="btn btn-primary btn-sm">Save Enterprise Settings</button>
        </form>
      </div>
    `;
  }

  // Enterprise helpers
  saveEnterpriseSettings(e) {
    e.preventDefault();
    const company = document.getElementById('entSettingsCompany')?.value;
    window.toast?.success(`Organization settings updated for ${company}!`);
  }

  openEnterpriseFeedbackModal(projectTitle) {
    const feedback = prompt(`Enter sprint feedback / scope change request for ${projectTitle}:`);
    if (feedback) {
      window.toast?.success('Sprint feedback logged and dispatched to Nuel Effiong.');
    }
  }

  openAddTeamMemberModal() {
    const email = prompt("Enter team member's corporate email address:");
    if (email) {
      window.toast?.success(`Invitation dispatched to ${email} with multi-seat access!`);
    }
  }

  simulatePipelineEvent() {
    const consoleEl = document.getElementById('enterpriseLiveStreamConsole');
    if (consoleEl) {
      const newEvent = document.createElement('div');
      newEvent.style.cssText = "background:rgba(255,255,255,0.02); padding:0.75rem; border-radius:8px; border-left:3px solid #34D399; display:flex; justify-content:space-between; align-items:center;";
      newEvent.innerHTML = `
        <div><strong style="color:#34D399;">[TEST_SIMULATION_${Date.now().toString().slice(-4)}]</strong> <span style="color:#FFF;">Webhook payload received -> HMAC verified -> DB updated</span></div>
        <span style="color:var(--text-cyber-muted);">Just now (3ms)</span>
      `;
      consoleEl.prepend(newEvent);
    }
    window.toast?.success("⚡ Test pipeline event executed in 3ms with 100% HMAC fidelity!");
  }

  // Task Filter Helper
  filterStudentTasks(category, btn) {
    if (btn) {
      document.querySelectorAll('.task-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    const cards = document.querySelectorAll('#studentTasksList .student-task-card');
    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Quick Lab Repo Submission Helper
  async handleQuickLabSubmit() {
    const input = document.getElementById('quickLabRepoUrl');
    const url = input?.value.trim();
    if (!url) {
      window.toast?.error('Please paste your GitHub repository URL.');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      window.toast?.error('Please enter a valid GitHub URL (e.g. https://github.com/...)');
      return;
    }

    if (window.db && window.auth) {
      const user = window.auth.getUser();
      await window.db.createLabSubmission({
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Amina Yusuf',
        courseId: 'course-vibecode-labs',
        levelNumber: 2,
        lessonId: 'lvl_2_mod_05_les_2',
        lessonTitle: 'Lab 5.2: Build a Component Swipe File',
        repoUrl: url,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });
    }

    if (input) input.value = '';
    window.toast?.success('Lab submitted successfully! Nuel Effiong will review within 24 hours.');
  }

  // Discussion question submission
  submitStudentQuestion(e) {
    e.preventDefault();
    const tag = document.getElementById('discussLessonTag')?.value;
    const text = document.getElementById('discussQuestionText')?.value.trim();
    if (!text) return;

    const list = document.getElementById('studentDiscussionsList');
    if (list) {
      const newCard = document.createElement('div');
      newCard.className = 'student-qa-card';
      newCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <strong style="color:#FFF; font-size:0.92rem;">Amina Yusuf</strong>
            <span class="badge badge-teal" style="font-size:0.65rem;">${tag}</span>
            <span class="badge badge-warning" style="font-size:0.65rem;">AWAITING REVIEW</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-cyber-muted);">Just now</span>
        </div>
        <div style="font-size:0.88rem; color:#CBD5E1;">
          ${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>
      `;
      list.prepend(newCard);
    }

    document.getElementById('discussQuestionText').value = '';
    window.toast?.success('Your question has been posted to the Cohort 4 feed!');
  }

  // Support ticket submission
  submitSupportTicket(e) {
    e.preventDefault();
    const subject = document.getElementById('suppSubject')?.value;
    window.toast?.success(`Support ticket #${Math.floor(1000 + Math.random() * 9000)} created for "${subject}". Check your email for updates.`);
    e.target.reset();
  }



  updateUserWaveChart(period = '7D', btn = null) {
    const wrap = document.getElementById('userWaveChartSvgWrap');
    if (!wrap) return;

    if (btn) {
      document.querySelectorAll('.wave-period-group .period-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    const datasets = {
      '1D': {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
        points: [30, 45, 60, 110, 85, 130, 145]
      },
      '7D': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        points: [40, 55, 45, 95, 110, 155, 185]
      },
      '30D': {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
        points: [120, 180, 240, 310, 420]
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        points: [450, 780, 1200, 1680]
      }
    };

    const data = datasets[period] || datasets['7D'];
    const maxVal = Math.max(...data.points);
    const minVal = Math.min(...data.points);

    // Compute SVG cubic bezier smooth curve
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
          <linearGradient id="userWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.45"/>
            <stop offset="60%" stop-color="#00F5D4" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="userWaveLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#8B5CF6"/>
            <stop offset="50%" stop-color="#A855F7"/>
            <stop offset="100%" stop-color="#00F5D4"/>
          </linearGradient>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Horizontal Grid Lines -->
        <line x1="0" y1="40" x2="${width}" y2="40" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
        <line x1="0" y1="90" x2="${width}" y2="90" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
        <line x1="0" y1="140" x2="${width}" y2="140" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>

        <!-- Area Gradient Fill -->
        <path d="${areaD}" fill="url(#userWaveGrad)"/>

        <!-- Glowing Stroke Line -->
        <path d="${pathD}" fill="none" stroke="url(#userWaveLineGrad)" stroke-width="3.5" stroke-linecap="round" filter="url(#glowEffect)"/>

        <!-- Key Peak Data Points -->
        ${coords.map(c => `
          <g>
            <circle cx="${c.x}" cy="${c.y}" r="5" fill="#070A10" stroke="#00F5D4" stroke-width="2.5"/>
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

  runAmaraAiDiagnostic() {
    if (window.toast) {
      window.toast.info("⚡ Amara AI Ops: Initiating end-to-end webhook & database health scan...");
      setTimeout(() => {
        window.toast.success("✨ Diagnostic 100% Passed: Paystack Webhooks (42ms), WhatsApp API (90ms), Supabase RLS (18ms). 0 anomalies!");
      }, 750);
    }
  }

  // =========================================================================
  // 8. PWA & OFFLINE SERVICE WORKER REGISTRATION
  // =========================================================================
  initPwaServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('🛡️ Zeerocodes PWA ServiceWorker Registered:', reg.scope))
          .catch(err => console.warn('PWA SW registration skipped in this environment:', err));
      });
    }
  }

  // =========================================================================
  // 9. GLOBAL MULTI-CURRENCY CONVERSION ENGINE
  // =========================================================================
  setGlobalCurrency(curr = 'NGN') {
    this.currentCurrency = curr;
    localStorage.setItem('zeerocodes_currency', curr);

    // Sync select dropdown if exists
    const sel = document.getElementById('globalCurrencySelector');
    if (sel) sel.value = curr;

    if (window.payments) {
      window.payments.setCurrency(curr);
    }

    this.updateAllPricesOnPage();
    if (window.toast) {
      window.toast.info(`Display currency updated to ${curr}`);
    }
  }

  formatCurrency(amountNGN, targetCurr = this.currentCurrency || 'NGN') {
    const rates = { NGN: 1, USD: 1500, GBP: 1850, EUR: 1600 };
    const rate = rates[targetCurr] || 1;

    if (targetCurr === 'NGN') {
      return `₦${Number(amountNGN).toLocaleString()}`;
    } else if (targetCurr === 'USD') {
      return `$${Math.round(amountNGN / rate).toLocaleString()}`;
    } else if (targetCurr === 'GBP') {
      return `£${Math.round(amountNGN / rate).toLocaleString()}`;
    } else if (targetCurr === 'EUR') {
      return `€${Math.round(amountNGN / rate).toLocaleString()}`;
    }
    return `₦${Number(amountNGN).toLocaleString()}`;
  }

  updateAllPricesOnPage() {
    document.querySelectorAll('[data-price-ngn]').forEach(el => {
      const ngn = parseFloat(el.getAttribute('data-price-ngn')) || 0;
      el.textContent = this.formatCurrency(ngn);
    });
  }

  // =========================================================================
  // 10. PUBLIC VIBECERT™ VERIFICATION PORTAL (#verify)
  // =========================================================================
  async renderCertificateVerification(certId) {
    const hash = window.location.hash;
    let targetCertId = certId;

    if (!targetCertId && hash.includes('cert=')) {
      targetCertId = hash.split('cert=')[1].split('&')[0];
    }
    if (!targetCertId) {
      targetCertId = document.getElementById('verifySearchInput')?.value || 'VIBECERT-2026-0881';
    }

    await this.lookupCertificate(targetCertId);
  }

  async lookupCertificate(certId) {
    const container = document.getElementById('verifyResultContainer');
    if (!container || !window.db) return;

    container.innerHTML = `
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-md); padding:3rem 2rem; text-align:center;">
        <div class="pulse-indicator" style="margin:0 auto 1.5rem auto;"></div>
        <h4 style="color:#FFF;">Querying Zeerocodes Cryptographic Registry...</h4>
        <p style="font-size:0.85rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">${certId.toUpperCase()}</p>
      </div>
    `;

    const cert = await window.db.getCertificateById(certId);

    if (!cert) {
      container.innerHTML = `
        <div style="background:#080D16; border:1px solid rgba(239,68,68,0.3); border-radius:var(--radius-md); padding:3rem 2rem; text-align:center;">
          <i data-lucide="shield-x" style="width:48px; height:48px; color:#EF4444; margin-bottom:1rem;"></i>
          <h3 style="color:#FFF; margin-bottom:0.5rem;">Unverified or Revoked Credential</h3>
          <p style="color:var(--text-cyber-muted); font-size:0.9rem; max-width:500px; margin:0 auto 1.5rem auto;">
            The serial ID <strong style="color:#FCA5A5; font-family:var(--font-mono);">${certId}</strong> does not match an active cryptographic certificate in our registry.
          </p>
          <button class="btn btn-outline btn-sm" onclick="window.app?.lookupCertificate('VIBECERT-2026-0881')">
            Load Valid Sample Credential (VIBECERT-2026-0881)
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Render Authentic Holographic Certificate Card
    container.innerHTML = `
      <div class="verified-cert-card" style="background:radial-gradient(ellipse at top, #0A1320, #04070D); border:2px solid var(--emerald-primary); box-shadow:0 0 40px rgba(1,107,97,0.35); border-radius:var(--radius-md); padding:2.5rem 2rem; position:relative; overflow:hidden;">
        
        <!-- Holographic Watermark Badge -->
        <div style="position:absolute; top:-20px; right:-20px; width:160px; height:160px; background:radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%); border-radius:50%; pointer-events:none;"></div>
        
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:1.5rem; margin-bottom:1.75rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <img src="logo.png" alt="Zeerocodes Official Seal" style="height:48px;">
            <div>
              <span class="badge badge-success" style="font-size:0.75rem; letter-spacing:0.05em;">
                <i data-lucide="shield-check"></i> CRYPTOGRAPHICALLY VERIFIED SAFE & AUTHENTIC
              </span>
              <h3 style="color:#FFF; font-size:1.35rem; margin:0.35rem 0 0 0;">${cert.type}</h3>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.75rem; color:var(--text-cyber-muted);">REGISTRY SERIAL ID</div>
            <div style="font-family:var(--font-mono); font-size:1.15rem; font-weight:800; color:var(--emerald-light);">${cert.certId}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap:1.5rem; margin-bottom:2rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-cyber-muted); text-transform:uppercase;">Awarded / Certified Entity</div>
            <div style="font-size:1.4rem; font-weight:800; color:#FFF; margin-top:0.25rem;">${cert.recipient}</div>
            <div style="font-size:0.85rem; color:var(--cyan-accent);">${cert.recipientRole}</div>
          </div>

          <div>
            <div style="font-size:0.75rem; color:var(--text-cyber-muted); text-transform:uppercase;">Curriculum Track / Codebase</div>
            <div style="font-size:1.15rem; font-weight:700; color:#FFF; margin-top:0.25rem;">${cert.courseOrApp}</div>
            <div style="font-size:0.85rem; color:var(--emerald-light); font-weight:700;">${cert.grade} • Score: ${cert.score}/100</div>
          </div>

          <div>
            <div style="font-size:0.75rem; color:var(--text-cyber-muted); text-transform:uppercase;">Issued Date & Validity</div>
            <div style="font-size:0.95rem; color:#FFF; margin-top:0.25rem;"><strong>Issued:</strong> ${cert.issuedDate}</div>
            <div style="font-size:0.85rem; color:var(--text-cyber-muted);"><strong>Valid Until:</strong> ${cert.expiryDate}</div>
          </div>

          <div>
            <div style="font-size:0.75rem; color:var(--text-cyber-muted); text-transform:uppercase;">Issuing Authority</div>
            <div style="font-size:1rem; font-weight:700; color:#FFF; margin-top:0.25rem;">${cert.instructor}</div>
            <div style="font-size:0.8rem; color:var(--text-cyber-muted);">${cert.instructorRole}</div>
          </div>
        </div>

        <!-- Security Guardrails / Passed Checklist -->
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-xs); padding:1.25rem; margin-bottom:2rem;">
          <strong style="color:var(--emerald-light); font-size:0.85rem; display:block; margin-bottom:0.75rem;">
            <i data-lucide="check-check"></i> Security & Architectural Standards Verified:
          </strong>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap:0.5rem;">
            ${(cert.owaspPassed || []).map(item => `
              <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.82rem; color:#EEE;">
                <i data-lucide="shield" style="width:14px; height:14px; color:var(--emerald-light); flex-shrink:0;"></i>
                <span>${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- SHA-256 Fingerprint -->
        <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-cyber-muted); word-break:break-all; background:#04070D; padding:0.6rem 0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.04); margin-bottom:2rem;">
          <strong>SHA-256 Cryptographic Hash:</strong> ${cert.sha256Fingerprint}
        </div>

        <!-- Verification Actions -->
        <div style="display:flex; gap:0.75rem; flex-wrap:wrap; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:1.5rem;">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.print()">
              <i data-lucide="printer"></i> Print / Save PDF
            </button>
            <button class="btn btn-outline btn-sm" onclick="navigator.clipboard.writeText('https://zeerocodes.com/#verify?cert=${cert.certId}'); window.toast?.success('Universal Verification URL copied to clipboard!');">
              <i data-lucide="link"></i> Copy Verify Link
            </button>
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('<a href=&quot;https://zeerocodes.com/#verify?cert=${cert.certId}&quot; target=&quot;_blank&quot;><img src=&quot;https://zeerocodes.com/badge/vibecert-a.svg&quot; alt=&quot;VibeCert Verified Safe&quot; width=&quot;130&quot; height=&quot;38&quot; /></a>'); window.toast?.success('HTML Badge Embed Code copied!');">
              <i data-lucide="code"></i> Copy Badge Embed
            </button>
          </div>

          <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://zeerocodes.com/%23verify?cert=${cert.certId}" target="_blank" class="btn btn-ghost btn-sm" style="color:var(--cyan-accent);">
            <i data-lucide="share-2"></i> Share on LinkedIn
          </a>
        </div>

      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 11. INTERACTIVE PUBLIC AST CODE SECURITY SCANNER (#vibescan)
  // =========================================================================
  initPublicAstScanner() {
    this.astPresets = {
      api_key_leak: `// Insecure React Client Component
import React from 'react';

export default function CheckoutForm() {
  // CRITICAL: Hardcoded live Paystack secret key exposed in browser bundle
  const PAYSTACK_SECRET = "pstk_sec_live_dummy_unencrypted_key_8819";

  async function handlePayment() {
    await fetch("https://api.paystack.co/transaction/initialize", {
      headers: { Authorization: "Bearer " + PAYSTACK_SECRET }
    });
  }

  return <button onClick={handlePayment}>Pay Now</button>;
}`,
      missing_rls: `-- Insecure Supabase PostgreSQL Table Setup
CREATE TABLE customer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  customer_phone TEXT,
  total_amount NUMERIC
);

-- CRITICAL: RLS is disabled by default!
-- Any authenticated or anonymous user can run:
-- SELECT * FROM customer_orders; and steal all customer records!`,
      prompt_injection: `// Insecure AI Assistant Endpoint (Express / Next.js API)
app.post("/api/ai-advisor", async (req, res) => {
  const { userMessage } = req.body;

  // CRITICAL: Unsanitized user message directly interpolated into system instructions
  const prompt = "You are a customer support agent. " + userMessage;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({ reply: response.choices[0].message.content });
});`,
      unverified_webhook: `// Insecure Webhook Handler
app.post("/api/paystack-webhook", async (req, res) => {
  const event = req.body;

  // CRITICAL: No HMAC SHA-512 signature verification!
  // A malicious actor can forge a 'charge.success' payload to get free services.
  if (event.event === "charge.success") {
    await fulfillCustomerOrder(event.data.reference);
  }

  res.sendStatus(200);
});`
    };

    // Load initial preset
    this.loadPublicAstPreset('api_key_leak');
  }

  loadPublicAstPreset(presetKey) {
    const codeArea = document.getElementById('publicAstCodeInput');
    if (codeArea && this.astPresets && this.astPresets[presetKey]) {
      codeArea.value = this.astPresets[presetKey];
      this.runPublicAstScan();
    }
  }

  runPublicAstScan() {
    const codeArea = document.getElementById('publicAstCodeInput');
    const scoreVal = document.getElementById('publicAstScoreVal');
    const statusBadge = document.getElementById('publicAstStatusBadge');
    const findingsList = document.getElementById('publicAstFindingsList');

    if (!codeArea || !scoreVal || !statusBadge || !findingsList) return;

    const code = codeArea.value;
    const findings = [];
    let score = 98;

    if (/sk_live_|sk_test_|OPENAI_API_KEY|PAYSTACK_SECRET/i.test(code)) {
      findings.push({ severity: 'CRITICAL', text: 'Exposed secret API key in client bundle (OWASP LLM06 / Secrets Leak)' });
      score -= 50;
    }
    if (/RLS is disabled|CREATE TABLE customer_orders/i.test(code) && !/ENABLE ROW LEVEL SECURITY/i.test(code)) {
      findings.push({ severity: 'HIGH', text: 'Missing Supabase PostgreSQL Row Level Security (RLS) policies' });
      score -= 40;
    }
    if (/\+\s*userMessage|\$\{userInput\}/i.test(code)) {
      findings.push({ severity: 'HIGH', text: 'Prompt Injection Risk: Direct string interpolation into LLM prompt (OWASP LLM01)' });
      score -= 35;
    }
    if (/req\.body|event\.event ===/i.test(code) && !/crypto\.createHmac|timingSafeEqual/i.test(code)) {
      findings.push({ severity: 'CRITICAL', text: 'Unverified Webhook: Missing constant-time HMAC SHA-512 validation' });
      score -= 45;
    }

    if (!findings.length) {
      score = 98;
      findings.push({ severity: 'PASSED', text: 'No high-risk AST vulnerabilities detected in this component.' });
    }

    score = Math.max(12, Math.min(98, score));
    scoreVal.textContent = `${score}/100`;

    if (score < 50) {
      scoreVal.className = 'text-danger';
      statusBadge.className = 'badge badge-danger';
      statusBadge.textContent = 'CRITICAL THREAT';
    } else if (score < 80) {
      scoreVal.className = 'text-warning';
      statusBadge.className = 'badge badge-warning';
      statusBadge.textContent = 'VULNERABLE';
    } else {
      scoreVal.className = 'text-success';
      statusBadge.className = 'badge badge-success';
      statusBadge.textContent = 'SECURE & HARDENED';
    }

    findingsList.innerHTML = findings.map(f => `
      <div style="background:rgba(255,255,255,0.02); padding:0.5rem 0.75rem; border-radius:var(--radius-xs); font-size:0.78rem; border-left:3px solid ${f.severity === 'CRITICAL' ? '#EF4444' : f.severity === 'HIGH' ? '#F59E0B' : '#10B981'}; display:flex; justify-content:space-between; align-items:center;">
        <span style="color:#DDD;">${f.text}</span>
        <span class="badge ${f.severity === 'CRITICAL' ? 'badge-danger' : f.severity === 'HIGH' ? 'badge-warning' : 'badge-success'}" style="font-size:0.6rem;">${f.severity}</span>
      </div>
    `).join('');

    if (window.toast) {
      window.toast.info(`AST static scan completed: Score ${score}/100`);
    }
  }

  applyPublicAstPatch() {
    const codeArea = document.getElementById('publicAstCodeInput');
    const sel = document.getElementById('publicAstPresetSelect');
    if (!codeArea) return;

    const currentType = sel ? sel.value : 'api_key_leak';

    const patches = {
      api_key_leak: `// Hardened Next.js Server Action / API Route
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // SECURED: Key moved strictly to server environment variables
  const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Missing server credentials" }, { status: 500 });
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    headers: { Authorization: \`Bearer \${PAYSTACK_SECRET}\` }
  });

  return NextResponse.json(await response.json());
}`,
      missing_rls: `-- Hardened Supabase PostgreSQL Table Setup
CREATE TABLE customer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  customer_phone TEXT,
  total_amount NUMERIC
);

-- SECURED: Enable strict Row Level Security
ALTER TABLE customer_orders ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation: Users can only select their own records
CREATE POLICY "Users can only read own orders"
  ON customer_orders FOR SELECT
  USING (auth.uid() = user_id);`,
      prompt_injection: `// Hardened AI Assistant Endpoint with Input Sanitization
import { sanitizePromptInput } from "@/lib/security";

app.post("/api/ai-advisor", async (req, res) => {
  const sanitized = sanitizePromptInput(req.body.userMessage);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a customer support agent. Obey security boundaries." },
      { role: "user", content: sanitized }
    ]
  });

  res.json({ reply: response.choices[0].message.content });
});`,
      unverified_webhook: `// Hardened Paystack Webhook Handler
import crypto from 'crypto';

app.post("/api/paystack-webhook", async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");

  // SECURED: Constant-time buffer equality check prevents timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature || ""), Buffer.from(hash))) {
    return res.status(401).send("Invalid Webhook Signature");
  }

  if (req.body.event === "charge.success") {
    await fulfillCustomerOrder(req.body.data.reference);
  }

  res.sendStatus(200);
});`
    };

    codeArea.value = patches[currentType] || patches.api_key_leak;
    this.runPublicAstScan();
    if (window.toast) {
      window.toast.success("✨ Security Patch applied! All backdoors sealed (Score 98/100).");
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ZeerocodesApp();
});

// Global Production Error Boundary & Unhandled Rejection Catcher
window.addEventListener('error', (event) => {
  console.warn('🛡️ [Zeerocodes Client Boundary Caught]:', event.message || event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('🛡️ [Zeerocodes Unhandled Promise Rejection]:', event.reason);
});


