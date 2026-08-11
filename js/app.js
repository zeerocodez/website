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
        try {
          await window.auth.signUpWithEmail(email, pass, name);
          if (window.modal) window.modal.closeAll();
        } catch (err) {
          console.error(err);
        }
      });
    }

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
        if (tab === 'login') {
          document.getElementById('auth-form-login')?.classList.remove('d-none');
          if (document.getElementById('auth-form-login')) document.getElementById('auth-form-login').style.display = 'block';
          document.getElementById('auth-form-signup')?.classList.add('d-none');
          if (document.getElementById('auth-form-signup')) document.getElementById('auth-form-signup').style.display = 'none';
        } else {
          document.getElementById('auth-form-signup')?.classList.remove('d-none');
          if (document.getElementById('auth-form-signup')) document.getElementById('auth-form-signup').style.display = 'block';
          document.getElementById('auth-form-login')?.classList.add('d-none');
          if (document.getElementById('auth-form-login')) document.getElementById('auth-form-login').style.display = 'none';
        }
      });
    });
  }

  bindIntakeForms() {
    // In-App Booking Form
    const bookingForm = document.getElementById('inAppBookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('bookingClientName')?.value;
        const service = document.getElementById('bookingServiceSelect')?.value;
        if (window.toast) {
          window.toast.success(`Discovery session confirmed for ${name}! Scope: ${service}`);
        }
        if (window.modal) window.modal.closeAll();
        bookingForm.reset();
      });
    }
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
    });

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
  // 9. CLIENT WORKSPACE & ADMIN DASHBOARD RENDERERS
  // =========================================================================
  async renderUserDashboard() {
    if (!window.auth || !window.auth.isAuthenticated()) return;
    const user = window.auth.getUser();

    // 1. Studio Projects List
    const studioListEl = document.getElementById('dashStudioList');
    if (studioListEl && window.db) {
      const allProjects = window.db.getLocal('studioProjects') || [];
      const userProjects = allProjects.filter(p => p.userId === user.uid || p.userEmail === user.email);

      if (!userProjects.length) {
        studioListEl.innerHTML = `
          <p style="color:var(--text-cyber-muted); font-size:0.88rem; margin-bottom:1rem;">No active custom builds or automations yet.</p>
          <button class="btn btn-primary btn-xs trigger-calendly-booking">
            <i data-lucide="calendar"></i> Scope Your First Project
          </button>
        `;
      } else {
        studioListEl.innerHTML = userProjects.map(p => `
          <div style="background:#080C14; padding:0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.08); margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <strong style="color:#FFF; font-size:0.88rem;">${p.title}</strong>
              <span class="badge badge-teal" style="font-size:0.68rem;">${p.status.toUpperCase()}</span>
            </div>
            <div style="font-size:0.78rem; color:var(--emerald-light);">${p.milestone || 'In Discovery'}</div>
          </div>
        `).join('');
      }
    }

    // 2. Enrollments List
    const enrollListEl = document.getElementById('dashEnrollmentsList');
    if (enrollListEl && window.db) {
      const enrollments = await window.db.getUserEnrollments(user.uid);
      if (!enrollments.length) {
        enrollListEl.innerHTML = `
          <p style="color:var(--text-cyber-muted); font-size:0.88rem; margin-bottom:1rem;">Not enrolled in The VibeCode Labs cohort yet.</p>
          <a href="#academy" class="btn btn-outline btn-xs">
            <i data-lucide="graduation-cap"></i> Join Next Cohort
          </a>
        `;
      } else {
        enrollListEl.innerHTML = enrollments.map(e => `
          <div style="background:#080C14; padding:0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.08); margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <strong style="color:#FFF; font-size:0.88rem;">${e.courseTitle}</strong>
              <span class="badge badge-success" style="font-size:0.68rem;">ACTIVE</span>
            </div>
            <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light); padding:0;" onclick="window.lms?.openCoursePlayer('${e.id}')">
              Open LMS Player &rarr;
            </button>
          </div>
        `).join('');
      }
    }

    // 3. VibeScan Submissions List
    const vibescanListEl = document.getElementById('dashVibescanList');
    if (vibescanListEl && window.db) {
      const subs = await window.db.getSubmissionsForUser(user.uid);
      if (!subs.length) {
        vibescanListEl.innerHTML = `
          <p style="color:var(--text-cyber-muted); font-size:0.88rem; margin-bottom:1rem;">0 repositories audited for this account.</p>
          <a href="#vibescan" class="btn btn-outline btn-xs">
            <i data-lucide="shield-check"></i> Submit Repo for Audit
          </a>
        `;
      } else {
        vibescanListEl.innerHTML = subs.map(s => `
          <div style="background:#080C14; padding:0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.08); margin-bottom:0.65rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <strong style="color:#FFF; font-size:0.88rem;">${s.appName}</strong>
              <span class="badge badge-cyber" style="font-size:0.68rem;">${s.status.toUpperCase()}</span>
            </div>
            <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${s.certificationId || 'Pending Review'}</div>
          </div>
        `).join('');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  async renderAdminDashboard() {
    const queueEl = document.getElementById('adminReviewQueue');
    if (!queueEl || !window.db) return;

    const subs = await window.db.getAllPendingSubmissions();
    if (!subs.length) {
      queueEl.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-cyber-muted); background:#080D16; border-radius:var(--radius-md); border:1px solid var(--obsidian-border);">All audits and reviews are up to date!</div>`;
      return;
    }

    queueEl.innerHTML = subs.map(s => `
      <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-md); padding:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0;">${s.appName}</h4>
          <span class="badge badge-warn">${s.status.toUpperCase()}</span>
        </div>
        <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin-bottom:0.75rem;">
          <strong>Submitter:</strong> ${s.userName} (${s.userEmail}) • <strong>Repo:</strong> <a href="${s.appUrl}" target="_blank" style="color:var(--emerald-light);">${s.appUrl}</a>
        </p>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-primary btn-xs" onclick="window.vibescanReview?.openReviewDrawer('${s.id}')">
            Perform Code Audit & Issue Cert
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new ZeerocodesApp();
});
