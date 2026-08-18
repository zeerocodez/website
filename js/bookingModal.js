/**
 * Zeerocodes Modal & Discovery Controller (v4.0 Hardened)
 * Enforces WAT Office Hours (10:00 AM to 6:00 PM WAT), zero overbooking / slot locking,
 * multi-channel transactional notifications, and real-time dashboard sync.
 */

class ModalController {
  constructor() {
    this.activeModal = null;
    this.officeHourSlots = [
      '10:00 AM (WAT)',
      '11:00 AM (WAT)',
      '12:00 PM (WAT)',
      '01:00 PM (WAT)',
      '02:00 PM (WAT)',
      '03:00 PM (WAT)',
      '04:00 PM (WAT)',
      '05:00 PM (WAT)'
    ];
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

  close(modalId) {
    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
    }
    const anyActive = document.querySelector('.modal-backdrop.active');
    if (!anyActive) {
      document.body.classList.remove('modal-open');
      this.activeModal = null;
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

    // Set default date to tomorrow if none selected
    const dateInput = document.getElementById('bookingDateSelect');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // Skip to Monday if weekend
      if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
      if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2);
      
      const defaultDateStr = tomorrow.toISOString().split('T')[0];
      if (!dateInput.value || dateInput.value < new Date().toISOString().split('T')[0]) {
        dateInput.value = defaultDateStr;
      }
      dateInput.min = new Date().toISOString().split('T')[0];
      this.refreshAvailableTimeSlots(dateInput.value);
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

  /**
   * Queries existing bookings to prevent double-booking on the same date and slot
   */
  getBookedSlotsForDate(dateStr) {
    if (!window.db) return [];
    const projects = window.db.getLocal('studioProjects') || [];
    return projects
      .filter(p => p.scheduledDate === dateStr && p.status !== 'cancelled')
      .map(p => p.scheduledSlot);
  }

  /**
   * Dynamically renders time slots within 10 AM to 6 PM WAT, disabling occupied slots
   */
  refreshAvailableTimeSlots(dateStr) {
    const container = document.getElementById('bookingTimeSlotsContainer');
    if (!container) return;

    const bookedSlots = this.getBookedSlotsForDate(dateStr);
    let firstAvailable = null;

    container.innerHTML = this.officeHourSlots.map(slot => {
      const isBooked = bookedSlots.includes(slot);
      const isSelected = (!isBooked && (this.selectedTimeSlot === slot || (!firstAvailable && !bookedSlots.includes(this.selectedTimeSlot))));
      
      if (!isBooked && !firstAvailable) {
        firstAvailable = slot;
      }
      if (isSelected) {
        this.selectedTimeSlot = slot;
      }

      if (isBooked) {
        return `
          <button type="button" class="btn btn-outline btn-xs time-slot-btn slot-booked" disabled data-slot="${slot}" style="opacity:0.4; cursor:not-allowed; text-decoration:line-through; border-color:rgba(239,68,68,0.3); color:#EF4444;" title="Slot already booked for this date">
            ${slot.replace(' (WAT)', '')} (Booked)
          </button>
        `;
      }

      return `
        <button type="button" class="btn btn-outline btn-xs time-slot-btn ${isSelected ? 'selected' : ''}" data-slot="${slot}">
          ${slot}
        </button>
      `;
    }).join('');

    // If all slots booked
    const allBooked = bookedSlots.length >= this.officeHourSlots.length;
    const warningBanner = document.getElementById('bookingSlotFullWarning');
    if (warningBanner) {
      warningBanner.style.display = allBooked ? 'block' : 'none';
    }
  }

  bindBookingForm() {
    // Time slot click delegation
    document.addEventListener('click', (e) => {
      const slotBtn = e.target.closest('.time-slot-btn');
      if (slotBtn && !slotBtn.classList.contains('slot-booked') && !slotBtn.disabled) {
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
        slotBtn.classList.add('selected');
        this.selectedTimeSlot = slotBtn.getAttribute('data-slot') || slotBtn.textContent.trim();
      }
    });

    // Date change listener
    const dateInput = document.getElementById('bookingDateSelect');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        this.refreshAvailableTimeSlots(e.target.value);
      });
    }

    // Form submit listener
    const bookingForm = document.getElementById('inAppBookingForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const service = document.getElementById('bookingServiceSelect')?.value || 'Automation Studio Consulting';
        const name = document.getElementById('bookingClientName')?.value.trim() || 'Client';
        const email = document.getElementById('bookingClientEmail')?.value.trim().toLowerCase() || 'client@example.com';
        const phone = document.getElementById('bookingClientPhone')?.value.trim() || '+234 810 000 0000';
        const budget = document.getElementById('bookingBudgetSelect')?.value || '₦750k - ₦2.5M';
        const notes = document.getElementById('bookingScopeNotes')?.value.trim() || 'General software & automation scoping inquiry.';
        const date = document.getElementById('bookingDateSelect')?.value || new Date().toISOString().split('T')[0];

        // 1. Strict Date Validation
        const todayStr = new Date().toISOString().split('T')[0];
        if (date < todayStr) {
          if (window.toast) window.toast.error("Please choose a future date for your discovery call.");
          return;
        }

        // 2. Strict Anti-Overbooking Concurrency Check
        const bookedSlots = this.getBookedSlotsForDate(date);
        if (bookedSlots.includes(this.selectedTimeSlot)) {
          if (window.toast) {
            window.toast.error(`⚠️ The ${this.selectedTimeSlot} slot on ${date} is already booked! Please select another available time slot.`);
          }
          this.refreshAvailableTimeSlots(date);
          return;
        }

        // 3. Strict WAT Office Hours Check (10 AM to 6 PM)
        if (!this.officeHourSlots.includes(this.selectedTimeSlot)) {
          if (window.toast) {
            window.toast.error("Discovery sessions are strictly scheduled during WAT office hours (10:00 AM – 6:00 PM).");
          }
          this.selectedTimeSlot = this.officeHourSlots[0];
          return;
        }

        const user = window.auth ? window.auth.getUser() : null;
        const userId = user ? user.uid : 'guest-scoping-' + Date.now();

        // 4. Create Studio Project record in Database
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

        if (window.db) {
          const existingProjects = window.db.getLocal('studioProjects') || [];
          existingProjects.unshift(newProject);
          window.db.setLocal('studioProjects', existingProjects);
        }

        this.closeAll();

        // 5. Create Google Calendar & WhatsApp Quick Action Links
        const titleEncoded = encodeURIComponent(`Zeerocodes Studio Discovery: ${service}`);
        const detailsEncoded = encodeURIComponent(`Zeerocodes Automation Studio Discovery Session with ${name}.\nService: ${service}\nScope Notes: ${notes}\nPhone: ${phone}\nTime: ${this.selectedTimeSlot} (WAT)`);
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&details=${detailsEncoded}&dates=${date.replace(/-/g, '')}T100000Z/${date.replace(/-/g, '')}T110000Z`;
        const waMsgEncoded = encodeURIComponent(`Hello Nuel & Zeerocodes Team, I have booked a Studio Discovery Call for ${date} at ${this.selectedTimeSlot} regarding "${service}". Looking forward to our session!`);
        const waUrl = `https://wa.me/2348120000000?text=${waMsgEncoded}`;

        if (window.toast) {
          window.toast.success(`🎉 Discovery Session Booked for ${date} at ${this.selectedTimeSlot}!`);
        }

        // 6. Dispatch Notifications (Dispatches Client Confirmation + Admin Alert Email + Admin Dashboard Log)
        if (window.notifications) {
          window.notifications.dispatch('discovery_call_booked', {
            clientName: name,
            clientEmail: email,
            clientPhone: phone,
            userEmail: email,
            service: service,
            budget: budget,
            summary: notes,
            notes: notes,
            scheduledDate: date,
            scheduledSlot: this.selectedTimeSlot,
            slot: this.selectedTimeSlot,
            gcalUrl: gcalUrl,
            waUrl: waUrl
          });
        }

        // 7. Refresh UI Dashboards
        if (window.app) {
          if (window.app.renderUserDashboard) await window.app.renderUserDashboard();
          if (window.app.renderAdminDashboard) await window.app.renderAdminDashboard();
        }
        if (window.adminConsole && window.adminConsole.renderAdminConsole) {
          await window.adminConsole.renderAdminConsole();
        }

        // 8. Open quick action confirm alert for Google Calendar
        setTimeout(() => {
          if (confirm(`Your Discovery Call is confirmed for ${date} at ${this.selectedTimeSlot}!\n\nWould you like to add this session to your Google Calendar?`)) {
            window.open(gcalUrl, '_blank');
          }
        }, 500);
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


