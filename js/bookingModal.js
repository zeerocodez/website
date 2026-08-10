/**
 * Zeerocodes Modal & Discovery Controller (v3.0)
 * Manages Auth, In-App Studio Scoping & Scheduling, VibeScan Intake,
 * Public Verification, Firebase Settings, and Command Palette.
 */

class ModalController {
  constructor() {
    this.activeModal = null;
    this.selectedTimeSlot = '10:00 AM (WAT)';
    this.init();
  }

  init() {
    // Backdrop click listener
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeAll();
      }
      if (e.target.closest('.modal-close-btn')) {
        this.closeAll();
      }
      // Auth tab switching
      const authTab = e.target.closest('.auth-tab-btn');
      if (authTab) {
        const tab = authTab.getAttribute('data-tab') || 'login';
        this.switchAuthTab(tab);
      }
    });

    // Escape key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAll();
    });

    // Bind In-App Booking Form
    this.bindBookingForm();
  }

  switchAuthTab(tab) {
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    forms.forEach(form => {
      if (form.id === `auth-form-${tab}`) {
        form.classList.remove('d-none');
        form.style.display = 'block';
      } else {
        form.classList.add('d-none');
        form.style.display = 'none';
      }
    });
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    this.closeAll();
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    this.activeModal = modal;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  closeAll() {
    document.querySelectorAll('.modal-backdrop').forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
    document.body.classList.remove('modal-open');
    this.activeModal = null;
  }

  openAuth(tab = 'login') {
    this.open('modal-auth');
    this.switchAuthTab(tab);
  }

  /**
   * Opens the in-app Interactive Workflow Scoping & Discovery Call Scheduler
   */
  openBooking(service = 'Automation Studio') {
    this.open('modal-booking');
    const serviceInput = document.getElementById('bookingServiceSelect');
    if (serviceInput) {
      serviceInput.value = service;
    }

    // Auto-fill user email if authenticated
    const emailInput = document.getElementById('bookingClientEmail');
    const nameInput = document.getElementById('bookingClientName');
    if (window.auth && window.auth.isAuthenticated()) {
      const u = window.auth.getUser();
      if (emailInput && u.email) emailInput.value = u.email;
      if (nameInput && u.displayName) nameInput.value = u.displayName;
    }
  }

  bindBookingForm() {
    // Time slot buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('time-slot-btn')) {
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedTimeSlot = e.target.getAttribute('data-slot') || e.target.textContent;
      }
    });

    // Form submit listener
    const bookingForm = document.getElementById('inAppBookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const service = document.getElementById('bookingServiceSelect')?.value || 'Automation Studio Consulting';
        const name = document.getElementById('bookingClientName')?.value || 'Client';
        const email = document.getElementById('bookingClientEmail')?.value || 'client@example.com';
        const phone = document.getElementById('bookingClientPhone')?.value || '+234 810 000 0000';
        const budget = document.getElementById('bookingBudgetSelect')?.value || '₦500k - ₦1.5M';
        const notes = document.getElementById('bookingScopeNotes')?.value || 'General inquiry';
        const date = document.getElementById('bookingDateSelect')?.value || new Date().toISOString().split('T')[0];

        const user = window.auth ? window.auth.getUser() : null;
        const userId = user ? user.uid : 'guest-scoping-' + Date.now();

        // Create Studio Project record in Database
        if (window.db) {
          const newProject = {
            id: `proj-${Date.now().toString(36)}`,
            userId: userId,
            userEmail: email,
            clientName: name,
            clientPhone: phone,
            title: `${service} (${name})`,
            service: service,
            budget: budget,
            summary: notes,
            scheduledDate: date,
            scheduledSlot: this.selectedTimeSlot,
            status: 'discovery_booked',
            milestone: `Discovery Call: ${date} at ${this.selectedTimeSlot}`,
            progressPercent: 20,
            createdAt: new Date().toISOString()
          };

          const existingProjects = window.db.getLocal('studioProjects') || [];
          existingProjects.unshift(newProject);
          window.db.setLocal('studioProjects', existingProjects);
        }

        this.closeAll();

        // Create Google Calendar & WhatsApp Quick Action Links
        const titleEncoded = encodeURIComponent(`Zeerocodes Studio Discovery: ${service}`);
        const detailsEncoded = encodeURIComponent(`Zeerocodes Automation Studio Discovery Session with ${name}.\nService: ${service}\nScope Notes: ${notes}\nPhone: ${phone}`);
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&details=${detailsEncoded}&dates=${date.replace(/-/g, '')}T100000Z/${date.replace(/-/g, '')}T110000Z`;
        const waMsgEncoded = encodeURIComponent(`Hello Nuel & Zeerocodes Team, I have booked a Studio Discovery Call for ${date} at ${this.selectedTimeSlot} regarding ${service}. Looking forward to our session!`);
        const waUrl = `https://wa.me/2348120000000?text=${waMsgEncoded}`;

        if (window.toast) {
          window.toast.success(`🎉 Discovery Session Booked for ${date} at ${this.selectedTimeSlot}!`);
        }

        // Open quick action confirm alert
        setTimeout(() => {
          if (confirm(`Your Discovery Call is confirmed for ${date} at ${this.selectedTimeSlot}!\n\nWould you like to add this session to your Google Calendar?`)) {
            window.open(gcalUrl, '_blank');
          }
        }, 600);

        // Notify
        if (window.notifications) {
          window.notifications.dispatch('discovery_call_booked', {
            email,
            service,
            slot: this.selectedTimeSlot,
            gcalUrl,
            waUrl
          });
        }

        // Refresh UI
        if (window.app) {
          await window.app.renderUserDashboard();
          await window.app.renderAdminDashboard();
        }
      });
    }
  }

  openVibescanIntake(refSource = 'direct') {
    if (!window.auth || !window.auth.isAuthenticated()) {
      if (window.toast) window.toast.info("Please sign in or create an account to submit your app for audit.");
      this.openAuth('signup');
      return;
    }
    this.open('modal-vibescan-intake');
    const refInput = document.getElementById('vibescanReferralSource');
    if (refInput) {
      refInput.value = refSource;
    }
    const emailInput = document.getElementById('vibescanEmail');
    if (emailInput && window.auth.getUser()) {
      emailInput.value = window.auth.getUser().email;
    }
  }

  openFirebaseConfig() {
    this.open('modal-firebase-config');
    const cfg = window.zeerocodesFirebase ? window.zeerocodesFirebase.getConfig() : {};
    const apiKeyInput = document.getElementById('fbCfgApiKey');
    const authDomainInput = document.getElementById('fbCfgAuthDomain');
    const projectIdInput = document.getElementById('fbCfgProjectId');
    const appIdInput = document.getElementById('fbCfgAppId');

    if (apiKeyInput) apiKeyInput.value = cfg.apiKey || '';
    if (authDomainInput) authDomainInput.value = cfg.authDomain || '';
    if (projectIdInput) projectIdInput.value = cfg.projectId || '';
    if (appIdInput) appIdInput.value = cfg.appId || '';
  }
}

window.modal = new ModalController();

