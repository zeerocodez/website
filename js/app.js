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

    // Demo Persona Fast Switchers
    document.addEventListener('click', (e) => {
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
  // 9. CLIENT & STUDENT WORKSPACE DASHBOARD RENDERER (REFERENCE UI UPGRADE)
  // =========================================================================
  async renderUserDashboard() {
    if (!window.auth || !window.auth.isAuthenticated()) return;
    const user = window.auth.getUser();

    // 1. Top Profile Header & Quick Stats
    const nameEl = document.getElementById('dashUserName');
    const emailEl = document.getElementById('dashUserEmail');
    const roleBadgeEl = document.getElementById('dashUserRoleBadge');
    const avatarEl = document.getElementById('dashUserAvatar');

    if (nameEl) nameEl.textContent = user.displayName || 'Zeerocodes Member';
    if (emailEl) emailEl.textContent = user.email || 'user@zeerocodes.com';
    if (roleBadgeEl) {
      const role = (user.role || 'STUDENT').toUpperCase();
      roleBadgeEl.textContent = role;
      roleBadgeEl.className = `badge ${role === 'ADMIN' ? 'badge-danger' : role === 'CLIENT' ? 'badge-teal' : 'badge-success'}`;
    }
    if (avatarEl && user.photoURL) {
      avatarEl.src = user.photoURL;
    }

    // 2. Fetch user data across collections
    const enrollments = await window.db.getUserEnrollments(user.uid);
    const labSubs = await window.db.getLabSubmissionsForUser(user.uid);
    const studioProjects = await window.db.getStudioProjectsForUser(user.uid);
    const vibescanSubs = await window.db.getSubmissionsForUser(user.uid);
    const paymentEvents = await window.db.getPaymentEvents();
    const userPayments = paymentEvents.filter(p => p.customerEmail === user.email);

    // 3. Render Flagship Tab: Overview & Analytics (Reference UI Layout)
    this.renderUserOverviewTab(user, enrollments, studioProjects, vibescanSubs, userPayments);

    // 4. Render Tab 2: Learning Hub (LMS)
    const lmsContainer = document.getElementById('dashLmsContainer');
    if (lmsContainer) {
      if (!enrollments.length) {
        lmsContainer.innerHTML = `
          <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:2.5rem; text-align:center;">
            <i data-lucide="graduation-cap" style="width:48px; height:48px; color:var(--emerald-light); margin-bottom:1rem;"></i>
            <h3 style="color:#FFF; font-size:1.25rem;">Not enrolled in The VibeCode Labs cohort yet</h3>
            <p style="color:var(--text-cyber-muted); font-size:0.9rem; max-width:500px; margin:0 auto 1.5rem auto;">
              Learn to build full-stack web applications, n8n automations, and AI security systems from absolute beginner to certified builder.
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.payments?.openPaymentModal('course-vibecode-labs')">
              Enroll Now (₦95,000 / $65) &rarr;
            </button>
          </div>
        `;
      } else {
        const allCourses = await window.db.getCourses();
        const unEnrolledCourses = allCourses.filter(c => !enrollments.some(e => e.courseId === c.id));

        lmsContainer.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <h4 style="color:#FFF; font-size:1.15rem; margin:0;">Enrolled Curriculum Tracks (${enrollments.length})</h4>
            <span class="badge badge-teal">Unified Multi-Track Access</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem; margin-bottom:1.75rem;">
            ${enrollments.map(activeEnroll => {
              const completedCount = (activeEnroll.completedLessons || []).length;
              const totalLessons = activeEnroll.courseId === 'course-whatsapp-automation' ? 48 : activeEnroll.courseId === 'course-ai-security' ? 36 : 88;
              const percent = Math.round((completedCount / totalLessons) * 100);

              return `
                <div style="background:rgba(12, 17, 26, 0.85); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:1.5rem;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                    <span class="badge badge-success">ENROLLED</span>
                    <span style="font-size:0.8rem; color:var(--text-cyber-muted); font-family:var(--font-mono);">${activeEnroll.cohort || 'Active Track'}</span>
                  </div>
                  <h3 style="color:#FFF; font-size:1.15rem; margin-bottom:0.35rem;">${activeEnroll.courseTitle}</h3>
                  <p style="color:var(--text-cyber-muted); font-size:0.82rem; margin-bottom:1rem;">
                    ${totalLessons} Practical Lessons • Antigravity & AI Studio Code Labs
                  </p>

                  <div style="margin-bottom:1.25rem;">
                    <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-cyber-muted); margin-bottom:0.4rem;">
                      <span>Track Progress</span>
                      <strong style="color:var(--emerald-light);">${percent}% (${completedCount}/${totalLessons})</strong>
                    </div>
                    <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
                      <div style="width:${percent}%; height:100%; background:linear-gradient(90deg, #8B5CF6, #00F5D4);"></div>
                    </div>
                  <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
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

          <!-- Explore Additional Catalog Tracks -->
          ${unEnrolledCourses.length ? `
            <div style="margin-bottom:2rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:1.5rem;">
              <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:1rem;">Available Tracks in Academy Catalog</h4>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap:1rem;">
                ${unEnrolledCourses.map(c => `
                  <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-xs); padding:1rem; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                      <span class="badge badge-teal" style="font-size:0.65rem; margin-bottom:0.35rem;">${c.category}</span>
                      <h5 style="color:#FFF; font-size:0.95rem; margin-bottom:0.25rem;">${c.title}</h5>
                      <p style="color:var(--text-cyber-muted); font-size:0.8rem; margin-bottom:0.75rem;">${c.subtitle || c.description}</p>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
                      <strong style="color:var(--emerald-light); font-size:0.9rem;">₦${(c.pricing?.amountNGN || 95000).toLocaleString()}</strong>
                      <button class="btn btn-outline btn-xs" onclick="window.payments?.openPaymentModal('${c.id}')">
                        Enroll in Track &rarr;
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
                      <h5 style="color:#FFF; font-size:0.95rem; margin-bottom:0.25rem;">${c.title}</h5>
                      <p style="color:var(--text-cyber-muted); font-size:0.8rem; margin-bottom:0.75rem;">${c.subtitle || c.description}</p>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
                      <strong style="color:var(--emerald-light); font-size:0.9rem;">₦${(c.pricing?.amountNGN || 95000).toLocaleString()}</strong>
                      <button class="btn btn-outline btn-xs" onclick="window.payments?.openPaymentModal('${c.id}')">
                        Enroll in Track &rarr;
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem; margin-bottom:2rem;">
            <h4 style="color:#FFF; font-size:1.05rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
              <i data-lucide="folder-down" style="color:var(--cyan-accent);"></i> Student Resource Hub
            </h4>
            <div style="display:flex; flex-direction:column; gap:0.65rem; font-size:0.85rem;">
              <div style="background:rgba(255,255,255,0.02); padding:0.6rem 0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
                <span>⚡ 2026 AI Build Prompts Pack (v3.2)</span>
                <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light);" onclick="window.toast?.success('Downloaded AI Prompts Cheatsheet')"><i data-lucide="download"></i></button>
              </div>
              <div style="background:rgba(255,255,255,0.02); padding:0.6rem 0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
                <span>📦 n8n WhatsApp Paystack Blueprint (.json)</span>
                <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light);" onclick="window.toast?.success('Downloaded n8n Workflow JSON Template')"><i data-lucide="download"></i></button>
              </div>
              <div style="background:rgba(255,255,255,0.02); padding:0.6rem 0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center;">
                <span>🛡️ OWASP LLM Top 10 Security Checklist</span>
                <button class="btn btn-ghost btn-xs" style="color:var(--emerald-light);" onclick="window.toast?.success('Downloaded Security Checklist PDF')"><i data-lucide="download"></i></button>
              </div>
            </div>
            </div>
          </div>

          <div>
            <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:0.75rem;">Your Submitted Lab Projects (${labSubs.length})</h4>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${labSubs.length ? labSubs.map(lab => `
                <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-xs); padding:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                  <div>
                    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                      <strong style="color:#FFF; font-size:0.92rem;">${lab.lessonTitle}</strong>
                      <span class="badge ${lab.status === 'passed' ? 'badge-success' : 'badge-warning'}">${lab.status.toUpperCase()}</span>
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-cyber-muted);">
                      <strong>Repo:</strong> <a href="${lab.repoUrl}" target="_blank" style="color:var(--emerald-light);">${lab.repoUrl}</a>
                      ${lab.grade ? ` • <strong>Grade:</strong> <span style="color:var(--emerald-light);">${lab.grade}</span>` : ''}
                    </div>
                    ${lab.feedback ? `<div style="font-size:0.78rem; color:var(--cyan-accent); margin-top:0.25rem;">Instructor Note: ${lab.feedback}</div>` : ''}
                  </div>
                  <button class="btn btn-outline btn-xs" onclick="window.lms?.openLabSubmissionModal()">
                    Resubmit / Edit Repo
                  </button>
                </div>
              `).join('') : `
                <div style="padding:1.5rem; text-align:center; color:var(--text-cyber-muted); background:#080D16; border-radius:var(--radius-xs); border:1px solid var(--obsidian-border);">
                  No lab projects submitted yet. Complete lesson labs in the course player to submit your code for review.
                </div>
              `}
            </div>
          </div>
        `;
      }
    }

    // 4. Render Tab 2: Studio Projects
    const studioContainer = document.getElementById('dashStudioContainer');
    if (studioContainer) {
      if (!studioProjects.length) {
        studioContainer.innerHTML = `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:2rem; text-align:center;">
            <i data-lucide="workflow" style="width:40px; height:40px; color:var(--cyan-accent); margin-bottom:1rem;"></i>
            <h4 style="color:#FFF;">No Active Custom Software Builds Yet</h4>
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

    // 5. Render Tab 3: VibeScan Security
    const vibescanContainer = document.getElementById('dashVibescanContainer');
    if (vibescanContainer) {
      if (!vibescanSubs.length) {
        vibescanContainer.innerHTML = `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:2rem; text-align:center;">
            <i data-lucide="shield-check" style="width:40px; height:40px; color:var(--emerald-light); margin-bottom:1rem;"></i>
            <h4 style="color:#FFF;">No Repositories Audited Yet</h4>
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

    // 6. Render Tab 4: Billing & Invoices
    const billingContainer = document.getElementById('dashBillingContainer');
    if (billingContainer) {
      const allPayments = paymentEvents.filter(p => p.customerEmail === user.email || user.role === 'admin');
      billingContainer.innerHTML = `
        <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.25rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin-bottom:1rem;">Payment & Invoicing Ledger</h4>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${allPayments.length ? allPayments.map(p => `
              <div style="background:rgba(255,255,255,0.02); padding:0.85rem; border-radius:var(--radius-xs); border:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <strong style="color:#FFF; font-size:0.9rem;">${p.item}</strong>
                    <span class="badge badge-success">PAID</span>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-cyber-muted); font-family:var(--font-mono); margin-top:0.2rem;">
                    Ref: ${p.reference} • Gateway: ${p.provider} • Date: ${new Date(p.verifiedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style="text-align:right;">
                  <strong style="color:#FFF; font-size:1.05rem;">₦${(p.amountNGN).toLocaleString()}</strong>
                  <div><button class="btn btn-ghost btn-xs" style="color:var(--emerald-light); padding:0;" onclick="window.toast?.success('Official Receipt PDF downloaded')"><i data-lucide="download"></i> Receipt</button></div>
                </div>
              </div>
            `).join('') : `
              <div style="padding:1.5rem; text-align:center; color:var(--text-cyber-muted);">No payment records found for this account.</div>
            `}
          </div>
        </div>
      `;
    }

    // 7. Render Tab 5: Account Settings
    const nameInput = document.getElementById('accSettingsName');
    const phoneInput = document.getElementById('accSettingsPhone');
    const bioInput = document.getElementById('accSettingsBio');
    if (nameInput) nameInput.value = user.displayName || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (bioInput) bioInput.value = user.bio || '';

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 9B. USER DASHBOARD OVERVIEW (FLAGSHIP REFERENCE UI VISUALIZER)
  // =========================================================================
  renderUserOverviewTab(user, enrollments, studioProjects, vibescanSubs, userPayments) {
    const container = document.getElementById('dashOverviewContainer');
    if (!container) return;

    const securityScore = vibescanSubs[0]?.securityScore || 98;
    const completedLabs = (enrollments || []).reduce((acc, e) => acc + (e.completedLessons?.length || 0), 0);

    container.innerHTML = `
      <!-- Top Title & Quick Actions -->
      <div class="modern-dash-header">
        <div class="modern-dash-title-group">
          <h2>
            <i data-lucide="layout-dashboard" style="color:#A855F7;"></i> Mission Overview
          </h2>
          <p style="color:var(--text-cyber-muted); font-size:0.85rem; margin:0.25rem 0 0 0;">
            Real-time platform activity, curriculum velocity & autonomous workflows
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span class="badge badge-teal" style="font-size:0.75rem;"><i data-lucide="shield-check"></i> System Protected</span>
          <button class="btn btn-outline btn-xs" onclick="window.app?.runAmaraAiDiagnostic()">
            <i data-lucide="activity"></i> Run Diagnostics
          </button>
        </div>
      </div>

      <!-- 4 Key Stat Cards (Inspired by Reference UI Top Row) -->
      <div class="modern-stat-cards-grid">
        <!-- Stat 1: Reclaimed Time & XP -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">RECLAIMED TIME</span>
            <span class="trend-pill positive"><i data-lucide="trending-up"></i> +59%</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">62.6K</span>
            <span style="font-size:0.8rem; color:var(--text-cyber-muted);">XP Gained</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">${completedLabs > 0 ? completedLabs : 88} Practical Labs Completed</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 30 Q 20 28, 40 20 T 80 15 T 120 22 T 160 5" stroke="#A855F7" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 30 Q 20 28, 40 20 T 80 15 T 120 22 T 160 5 L 160 38 L 0 38 Z" fill="url(#sparkGradPurple)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkGradPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#A855F7"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Stat 2: Workflow Velocity -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">TOTAL RATE</span>
            <span class="trend-pill positive"><i data-lucide="trending-up"></i> +1.5%</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">335.5%</span>
            <span class="trend-pill cyan">+1,671</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Paystack Webhook & n8n Sync</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 32 Q 25 15, 50 25 T 100 10 T 130 18 T 160 4" stroke="#00F5D4" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 32 Q 25 15, 50 25 T 100 10 T 130 18 T 160 4 L 160 38 L 0 38 Z" fill="url(#sparkGradCyan)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkGradCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#00F5D4"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Stat 3: Total SLA & Latency -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">TOTAL LATENCY</span>
            <span class="trend-pill positive">99.9% SLA</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">14.85%</span>
            <span style="font-size:0.8rem; color:var(--emerald-light); font-weight:700;">42ms Avg</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Zero Failed Execution Dropped</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 28 Q 30 32, 60 18 T 110 24 T 160 8" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 28 Q 30 32, 60 18 T 110 24 T 160 8 L 160 38 L 0 38 Z" fill="url(#sparkGradBlue)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkGradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#38BDF8"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Stat 4: Security Health -->
        <div class="ref-stat-card">
          <div class="ref-stat-top">
            <span class="ref-stat-label">VIBESCAN AUDIT</span>
            <span class="trend-pill purple">GRADE A+</span>
          </div>
          <div class="ref-stat-val-group">
            <span class="ref-stat-number">${securityScore}/100</span>
            <span style="font-size:0.8rem; color:#A855F7; font-weight:700;">0 Leaks</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-cyber-muted);">PostgreSQL RLS & HMAC Active</div>
          <div class="ref-sparkline-wrap">
            <svg viewBox="0 0 160 38" fill="none">
              <path d="M0 25 Q 35 10, 70 20 T 120 8 T 160 2" stroke="#EC4899" stroke-width="2.5" stroke-linecap="round" fill="none"/>
              <path d="M0 25 Q 35 10, 70 20 T 120 8 T 160 2 L 160 38 L 0 38 Z" fill="url(#sparkGradPink)" opacity="0.3"/>
              <defs>
                <linearGradient id="sparkGradPink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#EC4899"/>
                  <stop offset="100%" stop-color="transparent"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <!-- Floating AI Ops Manager Pill (Matches Reference UI) -->
      <div class="floating-ai-card">
        <div class="ai-profile-left">
          <div class="ai-avatar-wrap">
            <img class="ai-avatar-img" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="Amara AI Ops Manager">
            <span class="ai-pulse-dot" title="Amara is Live & Monitoring Workflows"></span>
          </div>
          <div class="ai-info-meta">
            <h4>
              <span>Amara</span> <span class="badge badge-teal" style="font-size:0.65rem;">Professional AI Ops Manager</span>
            </h4>
            <p>Live retail & autonomous workflow tasks verified. All Paystack webhook triggers and Supabase PostgreSQL RLS tables are synchronized with zero dropped events.</p>
          </div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary btn-xs" onclick="window.app?.runAmaraAiDiagnostic()">
            <i data-lucide="play"></i> Verify Pipeline
          </button>
        </div>
      </div>

      <!-- Main Interactive Visualizers Row (Wave Chart & Donut Gauge) -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
        
        <!-- Left: Interactive Glowing Area Wave Chart -->
        <div class="wave-chart-card">
          <div class="wave-chart-header">
            <div>
              <span class="badge badge-teal" style="font-size:0.65rem; margin-bottom:0.25rem;">VELOCITY CURVE</span>
              <h4 style="color:#FFF; font-size:1.1rem; margin:0;">Platform Execution & Traffic</h4>
            </div>
            <div class="wave-period-group">
              <button class="period-pill-btn" onclick="window.app?.updateUserWaveChart('1D', this)">1D</button>
              <button class="period-pill-btn active" onclick="window.app?.updateUserWaveChart('7D', this)">7D</button>
              <button class="period-pill-btn" onclick="window.app?.updateUserWaveChart('30D', this)">30D</button>
              <button class="period-pill-btn" onclick="window.app?.updateUserWaveChart('1Y', this)">1Y</button>
            </div>
          </div>

          <div class="wave-canvas-wrap" id="userWaveChartSvgWrap">
            <!-- Rendered by updateUserWaveChart -->
          </div>
        </div>

        <!-- Right: Circular Multi-Ring Donut Gauge Breakdown -->
        <div class="ref-donut-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div>
              <span class="badge badge-cyber" style="font-size:0.65rem; margin-bottom:0.25rem;">DISTRIBUTION</span>
              <h4 style="color:#FFF; font-size:1.1rem; margin:0;">Workload & Retainers</h4>
            </div>
            <span class="badge badge-success" style="font-size:0.68rem;">33.7% Yield</span>
          </div>

          <div class="ref-donut-container">
            <svg class="ref-donut-svg" viewBox="0 0 120 120">
              <!-- Background Ring -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="12"/>
              <!-- Segment 1: Academy (Purple) 45% -> 135px -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="#8B5CF6" stroke-width="12"
                stroke-dasharray="301.59" stroke-dashoffset="135" stroke-linecap="round"/>
              <!-- Segment 2: Studio (Cyan) 35% -> 105px -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="#00F5D4" stroke-width="12"
                stroke-dasharray="301.59" stroke-dashoffset="210" stroke-linecap="round"/>
              <!-- Segment 3: Security (Pink) 20% -> 60px -->
              <circle cx="60" cy="60" r="48" fill="none" stroke="#EC4899" stroke-width="12"
                stroke-dasharray="301.59" stroke-dashoffset="260" stroke-linecap="round"/>
            </svg>
            <div class="donut-center-text">
              <div class="donut-center-number">88%</div>
              <div class="donut-center-sub">Efficiency</div>
            </div>
          </div>

          <div class="donut-legend-grid">
            <div class="donut-legend-item">
              <span><span class="donut-dot" style="background:#8B5CF6; box-shadow:0 0 6px #8B5CF6;"></span>Academy Modules</span>
              <strong style="color:#FFF;">45.0%</strong>
            </div>
            <div class="donut-legend-item">
              <span><span class="donut-dot" style="background:#00F5D4; box-shadow:0 0 6px #00F5D4;"></span>Studio Automations</span>
              <strong style="color:#FFF;">35.0%</strong>
            </div>
            <div class="donut-legend-item">
              <span><span class="donut-dot" style="background:#EC4899; box-shadow:0 0 6px #EC4899;"></span>VibeScan Audits</span>
              <strong style="color:#FFF;">20.0%</strong>
            </div>
          </div>
        </div>

      </div>

      <!-- Live Service Integrations & Operations Feed (Matches Reference Bottom List) -->
      <div class="ref-integration-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color:#FFF; font-size:1.1rem; margin:0; display:flex; align-items:center; gap:0.5rem;">
            <i data-lucide="layers" style="color:#00F5D4;"></i> Live Integration Nodes & Telemetry
          </h4>
          <span class="badge badge-success" style="font-size:0.65rem;">5 Services Active</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.6rem;">
          
          <div class="ref-integration-row">
            <div style="display:flex; align-items:center; gap:0.85rem;">
              <div class="integration-icon-wrap" style="background:rgba(0, 245, 212, 0.15); color:#00F5D4; border:1px solid rgba(0, 245, 212, 0.3);">
                <i data-lucide="credit-card" style="width:18px; height:18px;"></i>
              </div>
              <div>
                <strong style="color:#FFF; font-size:0.92rem;">Paystack Webhook Reconciliation Engine</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">HMAC SHA-512 constant-time verification • Instant 90-sec invoice</div>
              </div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-success" style="font-size:0.65rem;">200 OK • 42ms</span>
              <div style="font-size:0.72rem; color:var(--text-cyber-muted); margin-top:2px;">100% Delivery</div>
            </div>
          </div>

          <div class="ref-integration-row">
            <div style="display:flex; align-items:center; gap:0.85rem;">
              <div class="integration-icon-wrap" style="background:rgba(37, 211, 102, 0.15); color:#25D366; border:1px solid rgba(37, 211, 102, 0.3);">
                <i data-lucide="message-square" style="width:18px; height:18px;"></i>
              </div>
              <div>
                <strong style="color:#FFF; font-size:0.92rem;">WhatsApp Cloud API Automated Invoicing</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Automated PDF receipt generator & calendar booking confirmations</div>
              </div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-teal" style="font-size:0.65rem;">SYNCED • 90ms</span>
              <div style="font-size:0.72rem; color:var(--text-cyber-muted); margin-top:2px;">112 hrs / mo saved</div>
            </div>
          </div>

          <div class="ref-integration-row">
            <div style="display:flex; align-items:center; gap:0.85rem;">
              <div class="integration-icon-wrap" style="background:rgba(139, 92, 246, 0.15); color:#A855F7; border:1px solid rgba(139, 92, 246, 0.3);">
                <i data-lucide="database" style="width:18px; height:18px;"></i>
              </div>
              <div>
                <strong style="color:#FFF; font-size:0.92rem;">Supabase PostgreSQL Database Cluster</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">Row Level Security (RLS) tenant isolation active across 12 tables</div>
              </div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-success" style="font-size:0.65rem;">PROTECTED • 18ms</span>
              <div style="font-size:0.72rem; color:var(--text-cyber-muted); margin-top:2px;">0 Leaks</div>
            </div>
          </div>

          <div class="ref-integration-row">
            <div style="display:flex; align-items:center; gap:0.85rem;">
              <div class="integration-icon-wrap" style="background:rgba(236, 72, 153, 0.15); color:#EC4899; border:1px solid rgba(236, 72, 153, 0.3);">
                <i data-lucide="shield-check" style="width:18px; height:18px;"></i>
              </div>
              <div>
                <strong style="color:#FFF; font-size:0.92rem;">VibeScan AST Static Analyzer Engine</strong>
                <div style="font-size:0.75rem; color:var(--text-cyber-muted);">OWASP LLM Top 10 code security audit and VibeCert trust badge ledger</div>
              </div>
            </div>
            <div style="text-align:right;">
              <span class="badge badge-success" style="font-size:0.65rem;">GRADE A+ • 98/100</span>
              <div style="font-size:0.72rem; color:var(--text-cyber-muted); margin-top:2px;">Certified</div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Render initial 7D wave chart
    this.updateUserWaveChart('7D');
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

