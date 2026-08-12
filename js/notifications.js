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
    const emailTo = data.userEmail || data.customerEmail || data.to || 'student@zeerocodes.com';
    let templateId = 'welcome_student';

    switch (eventType) {
      case 'enrollment_confirmed':
      case 'student_admitted':
        templateId = 'welcome_student';
        break;
      case 'payment_received':
      case 'invoice_issued':
      case 'invoice_paid':
        templateId = 'payment_receipt';
        break;
      case 'lab_reviewed':
      case 'lab_graded':
        templateId = 'lab_graded';
        break;
      case 'certificate_issued':
      case 'vibecert_issued':
        templateId = 'certificate_issued';
        break;
      case 'studio_booking_received':
      case 'studio_delivery_completed':
      case 'studio_milestone':
        templateId = 'studio_milestone';
        break;
      case 'vibescan_received':
      case 'vibescan_report_ready':
      case 'vibescan_cert':
        templateId = 'vibescan_cert';
        break;
      case 'weekly_reminder':
      case 'cohort_reminder':
        templateId = 'cohort_reminder';
        break;
    }

    if (window.emailEngine) {
      await window.emailEngine.dispatchEmail(templateId, emailTo, data);
    } else {
      console.log(`📧 [Transactional Email] Sent template "${templateId}" to ${emailTo}`);
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
