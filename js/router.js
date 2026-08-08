/**
 * Zeerocodes Unified SPA Router & Role Guard
 * Routes between public marketing pages, sub-sections, and authenticated dashboards.
 * Intercepts and guarantees execution for ALL in-app anchor links.
 */

class Router {
  constructor() {
    this.routes = {
      '#home': { viewId: 'view-home', title: 'Zeerocodes | Teach • Build • Protect', public: true },
      '#academy': { viewId: 'view-academy', title: 'Zeerocodes Academy | Practical AI & Automation Courses for Africa', public: true },
      '#studio': { viewId: 'view-studio', title: 'Zeerocodes Studio | Enterprise Workflow Automation Consulting', public: true },
      '#vibescan': { viewId: 'view-vibescan', title: 'VibeScan by Zeerocodes | AI App Security Audits & Certification', public: true },
      '#pricing-vibescan': { viewId: 'view-vibescan', scrollToId: 'pricing-vibescan', title: 'VibeScan Audit Pricing | Zeerocodes', public: true },
      '#roiCalculatorSection': { viewId: 'view-studio', scrollToId: 'roiCalculatorSection', title: 'Automation ROI Calculator | Zeerocodes Studio', public: true },
      '#about': { viewId: 'view-about', title: 'About Zeerocodes & Nuel Effiong | Africa AI Security Authority', public: true },
      '#contact': { viewId: 'view-contact', title: 'Contact Zeerocodes | Lagos AI Consulting & Inquiries', public: true },
      '#dashboard': { viewId: 'view-dashboard', title: 'My Unified Account | Zeerocodes Dashboard', authRequired: true },
      '#admin': { viewId: 'view-admin', title: 'Admin Review Queue & Operations | Zeerocodes', adminRequired: true }
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

    // 4. Update browser document title
    if (route.title) {
      document.title = route.title;
    }

    // 5. Update Navigation link states
    document.querySelectorAll('.nav-link, .mobile-dock-link').forEach(link => {
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

    // 7. Refresh dynamic contents if navigating to dashboard or admin
    if (cleanHash === '#dashboard' && window.app) {
      window.app.renderUserDashboard();
    } else if (cleanHash === '#admin' && window.app) {
      window.app.renderAdminDashboard();
    }

    // 8. Re-render Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Close mobile nav drawer & overlay if open
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
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

