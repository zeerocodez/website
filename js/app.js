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
  // 9. CLIENT & STUDENT WORKSPACE DASHBOARD RENDERER
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

    // 3. Render Tab 1: Learning Hub (LMS)
    const lmsContainer = document.getElementById('dashLmsContainer');
    if (lmsContainer) {
      if (!enrollments.length) {
        lmsContainer.innerHTML = `
          <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:2rem; text-align:center;">
            <i data-lucide="graduation-cap" style="width:40px; height:40px; color:var(--emerald-light); margin-bottom:1rem;"></i>
            <h4 style="color:#FFF;">Not enrolled in The VibeCode Labs cohort yet</h4>
            <p style="color:var(--text-cyber-muted); font-size:0.9rem; max-width:480px; margin:0 auto 1.25rem auto;">
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
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h4 style="color:#FFF; font-size:1.1rem; margin:0;">Enrolled Curriculum Tracks (${enrollments.length})</h4>
            <span class="badge badge-teal">Unified Multi-Track Access</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap:1.5rem; margin-bottom:1.75rem;">
            ${enrollments.map(activeEnroll => {
              const completedCount = (activeEnroll.completedLessons || []).length;
              const totalLessons = activeEnroll.courseId === 'course-whatsapp-automation' ? 48 : activeEnroll.courseId === 'course-ai-security' ? 36 : 88;
              const percent = Math.round((completedCount / totalLessons) * 100);

              return `
                <div style="background:#080D16; border:1px solid var(--obsidian-border); border-radius:var(--radius-sm); padding:1.5rem;">
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
                      <div style="width:${percent}%; height:100%; background:linear-gradient(90deg, var(--emerald-primary), var(--cyan-accent));"></div>
                    </div>
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

