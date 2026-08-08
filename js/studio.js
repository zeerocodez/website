/**
 * Zeerocodes Automation Studio & Consulting Module
 * Manages discovery call bookings, project milestone lifecycle,
 * and the Studio -> VibeScan flywheel cross-sell on project delivery.
 */

const CALENDLY_PLACEHOLDER_URL = 'https://calendly.com/zeerocodes/discovery-call';

class StudioManager {
  constructor() {
    this.init();
  }

  init() {
    // Bind direct external calendar booking triggers
    document.querySelectorAll('.trigger-calendly-booking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(CALENDLY_PLACEHOLDER_URL, '_blank', 'noopener,noreferrer');
      });
    });
  }

  /**
   * Admin Marks a Studio Project as 'project delivered'
   * Automatically sets up the Studio -> VibeScan flywheel cross-sell
   */
  async markProjectDelivered(projectId) {
    if (!window.auth || !window.auth.isAdmin()) return;

    const projects = window.db.getLocal('studioProjects') || [];
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx >= 0) {
      projects[idx].status = 'project_delivered';
      projects[idx].milestone = 'Delivered & Deployed to Production';
      projects[idx].progressPercent = 100;
      projects[idx].deliveredAt = new Date().toISOString();
      window.db.setLocal('studioProjects', projects);

      if (window.toast) {
        window.toast.success(`Project ${projects[idx].title} marked as delivered! Cross-sell prompt activated for client.`);
      }

      // Notify Client via Email & WhatsApp hook
      if (window.notifications) {
        window.notifications.dispatch('studio_delivery_completed', {
          userEmail: projects[idx].userEmail,
          projectTitle: projects[idx].title
        });
      }

      if (window.app) {
        await window.app.renderAdminDashboard();
      }
    }
  }

  /**
   * Triggered on user dashboard when they have a delivered studio project
   */
  openDeliveredStudioCrossSell(projectId) {
    // Directs client into VibeScan submission with referralSource: 'studio'
    window.modal.openVibescanIntake('studio');
  }
}

window.studio = new StudioManager();
