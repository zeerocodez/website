/* ==========================================================================
   ZEEROCODES AUTOMATION - MAIN APPLICATION ORCHESTRATOR & SPA ROUTER
   Handles Page Navigation, Industry Filtering, Framework Stepper & Assessment
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log("⚡ Zeerocodes Automation Platform Initializing (v2 PRD)...");

  // 1. Initialize Visualizers & Components
  if (typeof window.initEncryptionVisualizer === 'function') {
    window.visualizer = window.initEncryptionVisualizer();
  }
  if (typeof window.initEnterpriseDashboard === 'function') {
    window.dashboard = window.initEnterpriseDashboard();
  }
  if (typeof window.initRoiCalculator === 'function') {
    window.roiCalculator = window.initRoiCalculator();
  }
  if (typeof window.initBookingModal === 'function') {
    window.bookingModal = window.initBookingModal();
  }

  // 2. SPA Router Handling
  function handleRouting() {
    const hash = window.location.hash || '#home';
    const cleanHash = hash.split('?')[0];

    const views = document.querySelectorAll('.page-view');
    let matched = false;

    views.forEach(view => {
      const viewId = '#' + view.id.replace('view-', '');
      if (viewId === cleanHash) {
        view.classList.add('active');
        matched = true;
      } else {
        view.classList.remove('active');
      }
    });

    if (!matched && document.getElementById('view-home')) {
      document.getElementById('view-home').classList.add('active');
    }

    // Nav active link styling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === cleanHash);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Re-initialize Lucide icons
    if (window.lucide) lucide.createIcons();
  }

  window.addEventListener('hashchange', handleRouting);
  handleRouting(); // initial call

  // Navbar background scroll listener
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(8, 11, 16, 0.95)';
      navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
      navbar.style.background = 'var(--bg-glass)';
      navbar.style.boxShadow = 'none';
    }
  });

  // 3. Industry Switcher Filter
  const indTabs = document.querySelectorAll('.industry-tab-btn');
  const indCards = document.querySelectorAll('.industry-card');
  indTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      indTabs.forEach(t => t.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      const ind = target.getAttribute('data-industry');

      indCards.forEach(card => {
        if (ind === 'all' || card.getAttribute('data-ind') === ind) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Intelligence Framework Interactive Stepper
  const steps = document.querySelectorAll('.stepper-step');
  const stepInfoTitle = document.getElementById('frameworkStepTitle');
  const stepInfoBody = document.getElementById('frameworkStepBody');

  const frameworkStepData = {
    discover: {
      title: "01. Discover & Process Mapping",
      body: "We begin by analyzing your operational workflows, identifying manual bottlenecks, evaluating existing software systems, and assessing security & data governance requirements."
    },
    design: {
      title: "02. Solution Design & Architecture",
      body: "We craft a clear implementation blueprint outlining API integrations, automated pipeline architecture, zero-trust AI guardrails, and quantifiable ROI targets."
    },
    automate: {
      title: "03. Workflow Automation",
      body: "We build secure, robust automation connectors between CRM, ERP, financial, and administrative applications to eliminate repetitive manual overhead."
    },
    intelligence: {
      title: "04. Artificial Intelligence",
      body: "We embed practical AI models and internal document RAG agents with human-in-the-loop oversight to accelerate decision-making."
    },
    connect: {
      title: "05. System Integration",
      body: "We unify your digital ecosystem so information flows securely and automatically between platforms without manual intervention."
    },
    secure: {
      title: "06. AI Security & Governance",
      body: "We enforce zero-trust wrappers, PII anonymization, anti-hallucination checks, and immutable SOC2/ISO27001 audit logging."
    },
    optimise: {
      title: "07. Continuous Optimisation",
      body: "We continuously monitor telemetry, token efficiency, and pipeline speed to refine workflows and maximize long-term business performance."
    }
  };

  steps.forEach(step => {
    step.addEventListener('click', (e) => {
      steps.forEach(s => s.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      const key = target.getAttribute('data-step');
      if (frameworkStepData[key] && stepInfoTitle && stepInfoBody) {
        stepInfoTitle.innerText = frameworkStepData[key].title;
        stepInfoBody.innerText = frameworkStepData[key].body;
      }
    });
  });

  // 5. Contact Form Handler
  const contactForm = document.getElementById('enterpriseContactForm');
  const contactSuccess = document.getElementById('contactSuccessAlert');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      if (contactSuccess) contactSuccess.style.display = 'block';
    });
  }

  // 6. AI Readiness Assessment Quiz Modal Handler
  const startAssessmentBtn = document.getElementById('btnStartAssessment');
  const assessmentModal = document.getElementById('assessmentModalOverlay');
  const closeAssessmentBtn = document.getElementById('closeAssessmentModal');

  if (startAssessmentBtn && assessmentModal) {
    startAssessmentBtn.addEventListener('click', () => {
      assessmentModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeAssessmentBtn && assessmentModal) {
    closeAssessmentBtn.addEventListener('click', () => {
      assessmentModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  console.log("✅ Zeerocodes Router & Components Active.");
});
