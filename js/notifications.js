/**
 * Zeerocodes Unified Notification Engine
 * Handles Transactional Email delivery and modular WhatsApp Cloud API placeholders.
 * 
 * Trigger Points:
 * 1. enrollment_confirmed
 * 2. vibescan_received
 * 3. vibescan_report_ready
 * 4. studio_booking_received
 * 5. studio_delivery_completed
 */

const WHATSAPP_CONFIG = {
  apiUrl: "https://graph.facebook.com/v18.0",
  senderPhone: "+2348120000000"
};

class NotificationService {
  constructor() {
    this.history = [];
  }

  /**
   * Main unified dispatcher for transactional notifications
   */
  async dispatch(eventType, payload) {
    console.log(`📨 [Notification Engine] Dispatching event: ${eventType}`, payload);

    // 1. Transactional Email Dispatcher (Client & Admin)
    await this.sendTransactionalEmail(eventType, payload);

    // 2. Log Admin Real-time Dashboard Notification
    await this.logAdminDashboardNotification(eventType, payload);

    // 3. WhatsApp Cloud API Modular Hook (Same trigger points)
    await this.sendWhatsAppNotification(payload.phoneNumber || payload.clientPhone || '+2348120000000', eventType, payload);
  }

  /**
   * Logs an in-app real-time notification for the Admin Command Hub
   */
  async logAdminDashboardNotification(eventType, data) {
    if (!window.db) return;

    let alertTitle = 'New Activity';
    let alertMsg = 'Platform activity recorded.';
    let alertCategory = 'system';

    switch (eventType) {
      case 'discovery_call_booked':
      case 'studio_booking_received':
        alertTitle = `🚨 Discovery Call: ${data.clientName || data.name || 'Client'}`;
        alertMsg = `${data.service || 'Studio Scope'} on ${data.scheduledDate || 'upcoming date'} at ${data.scheduledSlot || data.slot || '10:00 AM (WAT)'}`;
        alertCategory = 'discovery';
        break;
      case 'enrollment_confirmed':
      case 'student_admitted':
        alertTitle = `🎓 New Student: ${data.studentName || data.userEmail}`;
        alertMsg = `Enrolled in ${data.courseTitle || 'The Zeerocodes VibeCode Labs'} (₦${(data.amountNGN || 95000).toLocaleString()})`;
        alertCategory = 'academy';
        break;
      case 'contact_inquiry_submitted':
      case 'request_submitted':
        alertTitle = `📬 New Scope Request: ${data.name || data.clientName}`;
        alertMsg = `Topic: ${data.topic} — "${(data.message || '').substring(0, 60)}..."`;
        alertCategory = 'inquiry';
        break;
      case 'vibescan_received':
        alertTitle = `🛡️ New Audit: ${data.appName || 'Repository'}`;
        alertMsg = `Security scan requested by ${data.userEmail}`;
        alertCategory = 'vibescan';
        break;
    }

    const newNotification = {
      id: 'notif_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
      title: alertTitle,
      message: alertMsg,
      category: alertCategory,
      data: data,
      unread: true,
      createdAt: new Date().toISOString()
    };

    const existingNotifs = window.db.getLocal('adminNotifications') || [];
    existingNotifs.unshift(newNotification);
    window.db.setLocal('adminNotifications', existingNotifs);

    // If admin is active or window has admin badge, update counter
    const badge = document.getElementById('adminNotifUnreadBadge');
    if (badge) {
      const unreadCount = existingNotifs.filter(n => n.unread).length;
      badge.textContent = unreadCount > 0 ? unreadCount : '';
      badge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }
  }

  /**
   * Transactional Email Engine (HTML Template Dispatcher)
   */
  async sendTransactionalEmail(eventType, data) {
    const adminEmails = ['admin@zeerocodes.com', 'ukemeobonguduak@gmail.com'];
    const emailTo = data.userEmail || data.clientEmail || data.customerEmail || data.email || data.to || 'client@zeerocodes.com';

    if (!window.emailEngine) return;

    switch (eventType) {
      case 'discovery_call_booked':
      case 'studio_booking_received':
        // 1. Client Confirmation Email
        await window.emailEngine.dispatchEmail('discovery_confirmed', emailTo, data);
        // 2. Admin Alert Email
        for (const adminEmail of adminEmails) {
          await window.emailEngine.dispatchEmail('admin_new_discovery_booking', adminEmail, data);
        }
        break;

      case 'enrollment_confirmed':
      case 'student_admitted':
        // 1. Student Welcome Pass
        await window.emailEngine.dispatchEmail('welcome_student', emailTo, data);
        // 2. Payment Receipt
        await window.emailEngine.dispatchEmail('payment_receipt', emailTo, data);
        // 3. Admin Alert Email
        for (const adminEmail of adminEmails) {
          await window.emailEngine.dispatchEmail('admin_new_course_enrollment', adminEmail, data);
        }
        break;

      case 'contact_inquiry_submitted':
      case 'request_submitted':
        // 1. Client Inquiry Receipt
        await window.emailEngine.dispatchEmail('inquiry_received', emailTo, data);
        // 2. Admin Alert Email
        for (const adminEmail of adminEmails) {
          await window.emailEngine.dispatchEmail('admin_new_client_inquiry', adminEmail, data);
        }
        break;

      case 'payment_received':
      case 'invoice_paid':
        await window.emailEngine.dispatchEmail('payment_receipt', emailTo, data);
        break;
      case 'lab_reviewed':
      case 'lab_graded':
        await window.emailEngine.dispatchEmail('lab_graded', emailTo, data);
        break;
      case 'certificate_issued':
      case 'vibecert_issued':
        await window.emailEngine.dispatchEmail('certificate_issued', emailTo, data);
        break;
      case 'studio_delivery_completed':
      case 'studio_milestone':
        await window.emailEngine.dispatchEmail('studio_milestone', emailTo, data);
        break;
      case 'vibescan_received':
      case 'vibescan_report_ready':
      case 'vibescan_cert':
        await window.emailEngine.dispatchEmail('vibescan_cert', emailTo, data);
        break;
      case 'weekly_reminder':
      case 'cohort_reminder':
        await window.emailEngine.dispatchEmail('cohort_reminder', emailTo, data);
        break;
      default:
        console.log(`📧 [Transactional Email] Default event processed: ${eventType}`);
    }
  }

  /**
   * =========================================================================
   * MODULAR WHATSAPP CLOUD API HOOK (Ready for direct token insertion)
   * =========================================================================
   */
  async sendWhatsAppNotification(recipientPhone, templateName, params) {
    // Structured WhatsApp Payload Schema
    const whatsappPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientPhone,
      type: "template",
      template: {
        name: `zeerocodes_${templateName}`,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: Object.keys(params).map(key => ({
              type: "text",
              text: String(params[key])
            }))
          }
        ]
      }
    };

    console.log(`📱 [WhatsApp Cloud API Hook] Prepared payload for ${recipientPhone}:`, whatsappPayload);

    // If real token is configured in production, send via HTTP POST:
    if (WHATSAPP_CONFIG.bearerToken && !WHATSAPP_CONFIG.bearerToken.includes("YOUR_")) {
      try {
        /*
        await fetch(WHATSAPP_CONFIG.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${WHATSAPP_CONFIG.bearerToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(whatsappPayload)
        });
        */
      } catch (err) {
        console.warn("WhatsApp dispatch error", err);
      }
    }
  }
}

window.notifications = new NotificationService();
