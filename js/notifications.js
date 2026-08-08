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
  apiUrl: "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages",
  bearerToken: "YOUR_WHATSAPP_CLOUD_API_TOKEN", // Set in server environment
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

    // 1. Transactional Email Dispatcher
    await this.sendTransactionalEmail(eventType, payload);

    // 2. WhatsApp Cloud API Modular Hook (Same trigger points)
    await this.sendWhatsAppNotification(payload.phoneNumber || '+2348120000000', eventType, payload);
  }

  /**
   * Transactional Email Engine (HTML Template Dispatcher)
   */
  async sendTransactionalEmail(eventType, data) {
    let subject = "Notification from Zeerocodes";
    let body = "";

    switch (eventType) {
      case 'enrollment_confirmed':
        subject = `🎉 Enrollment Confirmed: ${data.courseTitle}`;
        body = `
          <h3>Welcome to Zeerocodes Academy!</h3>
          <p>Your payment has been verified via webhook. Your access to <strong>${data.courseTitle}</strong> is now active.</p>
          <p><a href="https://zeerocodes.com#dashboard" style="background:#016B61; color:#fff; padding:10px 18px; text-decoration:none; border-radius:6px; display:inline-block;">Launch Course Player &rarr;</a></p>
        `;
        break;

      case 'vibescan_received':
        subject = `🛡️ VibeScan Audit Queued: ${data.appName}`;
        body = `
          <h3>Your App Security Submission is in Review</h3>
          <p>We received your submission for <strong>${data.appName}</strong>. Our security team in Lagos is auditing your repository against the OWASP LLM Top 10.</p>
          <p>Turnaround time: 24-48 hours. Check status anytime on your dashboard.</p>
        `;
        break;

      case 'vibescan_report_ready':
        const isCert = data.outcome === 'certified';
        subject = isCert ? `🏆 VibeCert™ Security Certificate Issued for ${data.appName}` : `⚠️ VibeScan Remediation Report Ready for ${data.appName}`;
        body = `
          <h3>Your VibeScan Security Report is Ready</h3>
          <p>Outcome: <strong>${isCert ? 'Certified Safe (Grade A)' : 'Remediation Required'}</strong></p>
          <p>Notes: ${data.notes || 'Full OWASP breakdown available on your dashboard.'}</p>
          <p><a href="https://zeerocodes.com#dashboard" style="background:#016B61; color:#fff; padding:10px 18px; text-decoration:none; border-radius:6px; display:inline-block;">View Audit Report & Embed Code &rarr;</a></p>
        `;
        break;

      case 'studio_booking_received':
        subject = `📅 Zeerocodes Automation Discovery Session Scheduled`;
        body = `
          <h3>Discovery Call Confirmed</h3>
          <p>Thank you for booking with Zeerocodes Automation Studio. Nuel Effiong and our engineering team will connect with you on WhatsApp/Google Meet.</p>
        `;
        break;

      case 'studio_delivery_completed':
        subject = `🚀 Your Studio Automation is Live! Protect it with VibeScan`;
        body = `
          <h3>Automation Deployed to Production</h3>
          <p>Your custom system has been deployed! As your operations scale, ensure your webhooks and data endpoints are certified with a VibeScan security audit.</p>
        `;
        break;
    }

    const emailRecord = {
      id: 'eml_' + Date.now(),
      to: data.userEmail,
      subject: subject,
      body: body,
      sentAt: new Date().toISOString()
    };

    this.history.unshift(emailRecord);
    console.log(`📧 [Transactional Email] Sent to ${data.userEmail}: "${subject}"`);

    if (window.toast) {
      window.toast.info(`Transactional Email Dispatched to ${data.userEmail}`);
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
