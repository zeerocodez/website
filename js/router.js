/**
 * Zeerocodes Unified SPA Router & Role Guard
 * Routes between public marketing pages, sub-sections, and authenticated dashboards.
 * Intercepts and guarantees execution for ALL in-app anchor links.
 */

class Router {
  constructor() {
    this.routes = {
      '#home': {
        viewId: 'view-home',
        title: 'Zeerocodes | Custom Software, Business Automations & AI Security in Lagos',
        desc: 'Zeerocodes builds custom web apps, automates WhatsApp & Paystack business workflows, and trains beginners to become certified builders.',
        keywords: 'custom software agency Lagos, AI automation Nigeria, WhatsApp Paystack automation, The VibeCode Labs, VibeScan AI security',
        public: true
      },
      '#studio': {
        viewId: 'view-studio',
        title: 'Zeerocodes Studio | Custom Web Apps & Autonomous Workflow Automations',
        desc: 'We build production Next.js apps, customer portals, and 90-second WhatsApp billing engines for African businesses. Delivered in 14-28 days.',
        keywords: 'custom software agency, hire developer Lagos, WhatsApp automation bot, Paystack webhook integration, SaaS MVP builder',
        public: true
      },
      '#academy': {
        viewId: 'view-academy',
        title: 'The Zeerocodes VibeCode Labs | 4-Level AI Software Builder Masterclass',
        desc: 'Go from absolute beginner to certified builder shipping production software and earning client revenue. 8-week cohort led by Nuel Effiong.',
        keywords: 'learn AI coding Nigeria, The VibeCode Labs, prompt engineering course Lagos, beginner to certified software builder',
        public: true
      },
      '#vibescan': {
        viewId: 'view-vibescan',
        title: 'VibeScan AI Cybersecurity | Sleep Peacefully Knowing Your AI App Is Secure',
        desc: 'We perform AI cybersecurity audits for vibe-coded applications. Close API key leaks, missing Supabase RLS, and webhook exploits in 48 hours.',
        keywords: 'vibe coding security audit, OWASP LLM top 10 scanner, Supabase RLS fix, secure Paystack webhook, VibeCert badge',
        public: true
      },
      '#blog': {
        viewId: 'view-blog',
        title: 'Zeerocodes Engineering Blog | Real Case Studies in Automation & AI Security',
        desc: 'Read in-depth case studies, architectural blueprints, and security breakdowns from the software and automation trenches in Lagos, Nigeria.',
        keywords: 'AI automation case studies, WhatsApp Paystack webhook n8n, Supabase RLS guide, AI software development blog',
        public: true
      },
      '#pricing-vibescan': {
        viewId: 'view-vibescan',
        scrollToId: 'pricing-vibescan',
        title: 'VibeScan Audit Pricing & Packages | Zeerocodes',
        desc: 'Transparent pricing for VibeScan AI code audits: Starter Scan, Comprehensive Audit, and Enterprise Retainer with VibeCert™ badge.',
        public: true
      },
      '#roiCalculatorSection': {
        viewId: 'view-studio',
        scrollToId: 'roiCalculatorSection',
        title: 'Automation ROI & Hours Reclaimed Calculator | Zeerocodes Studio',
        desc: 'Calculate how many hours and millions in manual payroll your business can reclaim with autonomous event-driven automations.',
        public: true
      },
      '#knowledge-hub': {
        viewId: 'view-home',
        scrollToId: 'knowledge-hub',
        title: 'Security & Automation Knowledge Base | Zeerocodes',
        desc: 'Deep-dive developer guides on constant-time HMAC, Supabase PostgreSQL RLS, and prompt injection defense.',
        public: true
      },
      '#about': {
        viewId: 'view-about',
        title: 'About Zeerocodes & Nuel Effiong | Principal AI Systems Architect',
        desc: 'Learn the story behind Zeerocodes: bridging high-speed AI engineering with enterprise security for African founders and builders.',
        keywords: 'Nuel Effiong, Zeerocodes founder, AI architect Lagos, Africa tech builder',
        public: true
      },
      '#contact': {
        viewId: 'view-contact',
        title: 'Start a Project | Contact Zeerocodes Studio & Builder Cohort',
        desc: 'Schedule a free 30-minute discovery call with Nuel Effiong or send us your software scope. We respond within 24 hours.',
        keywords: 'contact software agency Lagos, hire automation engineer Nigeria, book discovery session',
        public: true
      },
      '#dashboard': {
        viewId: 'view-dashboard',
        title: 'Client & Builder Portal | Zeerocodes',
        desc: 'View active Studio deliverables, enrolled course lessons, and security audit reports.',
        authRequired: true
      },
      '#admin': {
        viewId: 'view-admin',
        title: 'Enterprise Admin Command Hub | Zeerocodes',
        desc: 'Manage Studio client projects, audit code repositories, track student cohorts, and monitor webhook health.',
        adminRequired: true
      }
    };

    this.init();
  }

  init() {
    // 1. Listen for standard hash changes
    window.addEventListener('hashchange', () => this.handleRouting());

    // 2. Listen for auth changes
    window.addEventListener('zeerocodes:auth-changed', () => this.handleRouting());

    // 3. Global click delegation for ALL in-app anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Allow external links (http, https, mailto, tel, javascript) to open directly
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return;
      }

      // Handle in-app hash links
      if (href.startsWith('#')) {
        e.preventDefault();
        this.navigate(href);
      }
    });

    // 4. Initial routing on page load
    setTimeout(() => this.handleRouting(), 50);
  }

  handleRouting() {
    const rawHash = window.location.hash || '#home';
    const cleanHash = rawHash.split('?')[0];
    const route = this.routes[cleanHash] || this.routes['#home'];

    // 1. Auth Guard for regular user dashboard
    if (route.authRequired && (!window.auth || !window.auth.isAuthenticated())) {
      if (window.toast) {
        window.toast.warning("Please sign in or create an account to access your unified dashboard.");
      }
      if (window.modal) {
        window.modal.openAuth('login');
      }
      window.location.hash = '#home';
      return;
    }

    // 2. Role Guard for Admin Dashboard
    if (route.adminRequired) {
      if (!window.auth || !window.auth.isAuthenticated()) {
        if (window.toast) window.toast.warning("Admin sign-in required.");
        if (window.modal) window.modal.openAuth('login');
        window.location.hash = '#home';
        return;
      }
      if (!window.auth.isAdmin()) {
        if (window.toast) {
          window.toast.error("Access Restricted: Your account role is 'user'. Admin role required for review queue.");
        }
        window.location.hash = '#dashboard';
        return;
      }
    }

    // 3. Switch active page view
    const allViews = document.querySelectorAll('.page-view');
    let matchedView = null;

    allViews.forEach(view => {
      if (view.id === route.viewId) {
        view.classList.add('active');
        view.style.display = 'block';
        matchedView = view;
      } else {
        view.classList.remove('active');
        view.style.display = 'none';
      }
    });

    if (!matchedView && document.getElementById('view-home')) {
      const homeView = document.getElementById('view-home');
      homeView.classList.add('active');
      homeView.style.display = 'block';
    }

    // 4. Update dynamic SEO Title & Meta Tags
    if (route.title) {
      document.title = route.title;
    }
    if (route.desc) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', route.desc);

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', route.title);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', route.desc);

      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', `https://zeerocodes.com/${cleanHash}`);
    }

    // 5. Update Navigation link states
    document.querySelectorAll('.nav-link, .mobile-dock-link, .mobile-drawer-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === cleanHash || (cleanHash === '#pricing-vibescan' && href === '#vibescan')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 6. Sub-section scrolling or scroll to top
    if (route.scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(route.scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 7. Refresh dynamic contents based on route
    if (cleanHash === '#blog' && window.blog) {
      window.blog.renderBlogView();
    } else if (cleanHash === '#dashboard' && window.app) {
      window.app.renderUserDashboard();
    } else if (cleanHash === '#admin' && window.adminConsole) {
      window.adminConsole.renderAdminConsole();
    }

    // 8. Re-render Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Close mobile nav drawer & overlay if open
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
  }

  navigate(hash) {
    if (window.location.hash === hash) {
      this.handleRouting();
    } else {
      window.location.hash = hash;
    }
  }
}

window.router = new Router();

