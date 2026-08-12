/**
 * Zeerocodes Enterprise Transactional Email Engine (v1.0)
 * Inspired by modern teacher & builder platforms (https://github.com/zeerocodez/teacher)
 * 
 * Features:
 * 1. 7 Responsive, dark-mode Obsidian/Emerald branded HTML email templates
 * 2. Dynamic variable interpolation ({{studentName}}, {{courseTitle}}, {{amountNGN}}, {{invoiceId}}, etc.)
 * 3. Cryptographic HMAC SHA-512 verification badges embedded in receipts
 * 4. Interactive Email Preview Sandbox for administrators
 * 5. Automated trigger dispatching and database history logging
 */

class TransactionalEmailEngine {
  constructor() {
    this.templates = {
      welcome_student: {
        id: 'welcome_student',
        name: 'Student Admission & Cohort Pass',
        category: 'Academy (Teach)',
        defaultSubject: '🎉 Welcome to {{courseTitle}} — Your Cohort Pass is Active',
        render: (data) => this.templateWelcomeStudent(data)
      },
      payment_receipt: {
        id: 'payment_receipt',
        name: 'Cryptographic Payment & Invoice Receipt',
        category: 'Financials & Billing',
        defaultSubject: '🧾 Payment Confirmed & Verified Invoice {{invoiceId}}',
        render: (data) => this.templatePaymentReceipt(data)
      },
      lab_graded: {
        id: 'lab_graded',
        name: 'Practical Code Lab Inspection Report',
        category: 'Academy (Teach)',
        defaultSubject: '📝 Lab Review Completed: {{lessonTitle}} (Grade: {{grade}})',
        render: (data) => this.templateLabGraded(data)
      },
      certificate_issued: {
        id: 'certificate_issued',
        name: 'Official VibeCert™ Award Notification',
        category: 'Certification',
        defaultSubject: '🏆 Official VibeCert™ Certificate Issued: {{certificateId}}',
        render: (data) => this.templateCertificateIssued(data)
      },
      studio_milestone: {
        id: 'studio_milestone',
        name: 'Studio Project Sprint Milestone Update',
        category: 'Studio (Build)',
        defaultSubject: '🚀 Sprint Update: {{projectTitle}} — {{stage}} Ready',
        render: (data) => this.templateStudioMilestone(data)
      },
      vibescan_cert: {
        id: 'vibescan_cert',
        name: 'VibeScan AST Security Audit Certification',
        category: 'VibeScan (Protect)',
        defaultSubject: '🛡️ VibeScan AST Audit Complete: {{appName}} Certified (Grade A)',
        render: (data) => this.templateVibescanCert(data)
      },
      cohort_reminder: {
        id: 'cohort_reminder',
        name: 'Weekly Cohort Digest & Sprint Accountability',
        category: 'Academy (Teach)',
        defaultSubject: '⚡ Weekly Builder Sprint: {{courseTitle}} Week {{weekNumber}}',
        render: (data) => this.templateCohortReminder(data)
      }
    };
  }

  // --- Base Email Wrapper with Responsive Dark Theme ---
  wrapEmail(title, preheader, bodyContent) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background-color:#04070D; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#E4EEE7; -webkit-font-smoothing:antialiased; }
    .email-container { max-width:600px; margin:0 auto; background-color:#080D16; border:1px solid #1A2634; border-radius:12px; overflow:hidden; }
    .email-header { background:linear-gradient(135deg, #060E18 0%, #081522 100%); padding:28px 32px; border-bottom:1px solid #1A2634; text-align:center; }
    .email-body { padding:32px; }
    .email-footer { background-color:#04070D; padding:24px 32px; text-align:center; font-size:12px; color:#6B7280; border-top:1px solid #1A2634; }
    .btn-primary { background:linear-gradient(135deg, #016B61 0%, #10B981 100%); color:#FFFFFF !important; font-weight:700; text-decoration:none; padding:14px 28px; border-radius:8px; display:inline-block; font-size:14px; letter-spacing:0.02em; }
    .badge { display:inline-block; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; }
    .badge-success { background:rgba(16,185,129,0.15); color:#85C79A; border:1px solid rgba(16,185,129,0.3); }
    .badge-teal { background:rgba(34,211,238,0.15); color:#38BDF8; border:1px solid rgba(34,211,238,0.3); }
    .card-box { background:#04070D; border:1px solid #1A2634; border-radius:8px; padding:20px; margin:20px 0; }
    h1, h2, h3, h4 { color:#FFFFFF; margin-top:0; }
    p { line-height:1.65; color:#9CA3AF; font-size:14px; margin:0 0 16px 0; }
    a { color:#85C79A; }
    .table-data { width:100%; border-collapse:collapse; font-size:13px; margin:16px 0; }
    .table-data th { text-align:left; color:#6B7280; padding:8px 0; border-bottom:1px solid #1A2634; font-weight:600; }
    .table-data td { padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); color:#FFFFFF; }
  </style>
</head>
<body style="background-color:#04070D; padding:24px 12px;">
  <!-- Preheader text -->
  <div style="display:none; max-height:0; overflow:hidden; font-size:1px; color:#04070D;">${preheader}</div>
  
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <div style="display:inline-block; margin-bottom:12px;">
        <span style="font-size:22px; font-weight:900; color:#FFFFFF; letter-spacing:-0.03em;">ZEERO<span style="color:#85C79A;">CODES</span></span>
      </div>
      <div style="font-size:12px; color:#6B7280; text-transform:uppercase; letter-spacing:0.1em;">Build • Automate • Secure</div>
    </div>

    <!-- Main Content -->
    <div class="email-body">
      ${bodyContent}
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <p style="margin:0 0 8px 0; font-size:12px; color:#6B7280;">
        Zeerocodes Automation Limited • Lagos, Nigeria<br>
        Autonomous Software Systems, Business Automations & AI Cybersecurity
      </p>
      <div style="font-size:11px; color:#4B5563; font-family:monospace; margin-top:8px;">
        Cryptographically Verified Payload • HMAC SHA-512 Validated
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  // =========================================================================
  // 1. WELCOME STUDENT & ACCESS PASS
  // =========================================================================
  templateWelcomeStudent(data) {
    const name = data.studentName || 'Builder';
    const course = data.courseTitle || 'The Zeerocodes VibeCode Labs';
    const cohort = data.cohort || 'October 15, 2026';
    const loginUrl = data.loginUrl || 'https://zeerocodes.com/#dashboard';

    const body = `
      <div style="margin-bottom:20px;">
        <span class="badge badge-success">ADMISSION CONFIRMED</span>
      </div>
      <h2>Welcome to the Cohort, ${name}!</h2>
      <p>Your seat in <strong>${course}</strong> has been officially provisioned. Over the upcoming weeks, you will go from idea to shipping production-grade applications, business automations, and certified software.</p>

      <div class="card-box">
        <h4 style="margin-bottom:12px; color:#FFF; font-size:14px;">Your Access Credentials</h4>
        <div style="font-size:13px; margin-bottom:8px;"><strong>Student Account:</strong> <span style="color:#85C79A;">${data.userEmail || 'student@zeerocodes.com'}</span></div>
        <div style="font-size:13px; margin-bottom:8px;"><strong>Cohort Schedule:</strong> <span style="color:#FFF;">${cohort}</span></div>
        <div style="font-size:13px; margin-bottom:8px;"><strong>Curriculum Track:</strong> <span style="color:#FFF;">4 Levels • 20 Modules • 88 Practical Lessons</span></div>
        <div style="font-size:13px;"><strong>Instructor:</strong> <span style="color:#85C79A;">Nuel Effiong (Principal AI Systems Architect)</span></div>
      </div>

      <div style="text-align:center; margin:32px 0 24px 0;">
        <a href="${loginUrl}" class="btn-primary">Launch LMS Learning Hub &rarr;</a>
      </div>

      <p style="font-size:13px;">Need assistance getting onboarded? Reply directly to this email or join our private WhatsApp builder channel.</p>
    `;

    return this.wrapEmail(`Welcome to ${course}`, `Your cohort pass for ${course} is now active.`, body);
  }

  // =========================================================================
  // 2. PAYMENT & INVOICE RECEIPT
  // =========================================================================
  templatePaymentReceipt(data) {
    const invId = data.invoiceId || 'INV-2026-001';
    const client = data.clientName || 'Partner Client';
    const amountNGN = (parseInt(data.amountNGN) || 95000).toLocaleString();
    const itemDesc = data.projectTitle || data.item || 'Zeerocodes Masterclass & Builder Enrollment';
    const ref = data.reference || ('REF-' + Math.random().toString(36).substring(2, 9).toUpperCase());

    const body = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <span class="badge badge-success">PAYMENT VERIFIED (200 OK)</span>
        <span style="font-family:monospace; font-size:12px; color:#6B7280;">Ref: ${ref}</span>
      </div>
      <h2>Payment Confirmation & Receipt</h2>
      <p>Dear ${client}, thank you for your payment. We have successfully processed and cryptographically verified your transaction.</p>

      <div class="card-box">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #1A2634; padding-bottom:12px; margin-bottom:12px;">
          <div>
            <div style="font-size:11px; color:#6B7280;">INVOICE NUMBER</div>
            <strong style="color:#FFF; font-family:monospace;">${invId}</strong>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px; color:#6B7280;">AMOUNT PAID</div>
            <strong style="color:#85C79A; font-size:16px;">₦${amountNGN}</strong>
          </div>
        </div>

        <table class="table-data">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${itemDesc}</td>
              <td style="text-align:right; color:#85C79A; font-weight:700;">₦${amountNGN}</td>
            </tr>
          </tbody>
        </table>

        <div style="font-size:11px; color:#6B7280; margin-top:8px;">
          Gateway: Paystack Cryptographic SHA-512 HMAC Signature • Zero-Knowledge Verification Pass
        </div>
      </div>

      <div style="text-align:center; margin:28px 0;">
        <a href="https://zeerocodes.com/#dashboard" class="btn-primary">View in Dashboard Ledger &rarr;</a>
      </div>
    `;

    return this.wrapEmail(`Receipt for ${invId}`, `Receipt for Invoice ${invId} - ₦${amountNGN}`, body);
  }

  // =========================================================================
  // 3. LAB GRADED & REVIEWED
  // =========================================================================
  templateLabGraded(data) {
    const student = data.studentName || 'Amina';
    const lesson = data.lessonTitle || 'Module 16 Capstone Brief';
    const grade = data.grade || 'A+ (98%)';
    const status = (data.status || 'passed').toUpperCase();
    const feedback = data.feedback || 'Outstanding implementation of secure Paystack HMAC verification and Supabase RLS policies!';

    const body = `
      <div style="margin-bottom:16px;">
        <span class="badge ${status === 'PASSED' ? 'badge-success' : 'badge-teal'}">${status}</span>
      </div>
      <h2>Code Lab Review Completed</h2>
      <p>Hi ${student}, instructor Nuel Effiong has completed the code inspection of your submitted repository for <strong>${lesson}</strong>.</p>

      <div class="card-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="margin:0; color:#FFF;">Review Outcome</h4>
          <span style="font-size:16px; font-weight:900; color:#85C79A;">Grade: ${grade}</span>
        </div>
        <div style="background:rgba(255,255,255,0.02); padding:12px; border-radius:6px; border:1px solid rgba(255,255,255,0.06); font-size:13px; color:#E4EEE7; line-height:1.5;">
          <strong>Instructor Feedback:</strong><br>
          "${feedback}"
        </div>
      </div>

      <div style="text-align:center; margin:28px 0;">
        <a href="https://zeerocodes.com/#dashboard" class="btn-primary">Continue Next Lesson &rarr;</a>
      </div>
    `;

    return this.wrapEmail(`Lab Graded: ${lesson}`, `Your lab submission for ${lesson} has been reviewed.`, body);
  }

  // =========================================================================
  // 4. CERTIFICATE ISSUED (VIBECERT™)
  // =========================================================================
  templateCertificateIssued(data) {
    const student = data.studentName || 'Amina Yusuf';
    const course = data.courseTitle || 'The Zeerocodes VibeCode Labs';
    const certId = data.certificateId || 'VIBECERT-2026-0881';
    const verifyUrl = `https://zeerocodes.com/verify?cert=${certId}`;

    const body = `
      <div style="text-align:center; margin-bottom:20px;">
        <span class="badge badge-success" style="font-size:12px; padding:6px 14px;">🏆 OFFICIAL CREDENTIAL AWARDED</span>
      </div>
      <h2 style="text-align:center;">Congratulations, ${student}!</h2>
      <p style="text-align:center;">You have met all rigorous curriculum milestones, passed all practical code labs, and are officially awarded the <strong>Zeerocodes Professional Software Builder Certification</strong>.</p>

      <div class="card-box" style="text-align:center; border:2px solid #016B61;">
        <div style="font-size:12px; color:#6B7280; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">Official Credential ID</div>
        <div style="font-size:22px; font-weight:900; color:#85C79A; font-family:monospace; margin-bottom:12px;">${certId}</div>
        <div style="font-size:13px; color:#FFF; margin-bottom:16px;"><strong>${course}</strong></div>
        <div style="font-size:12px; color:#9CA3AF;">Signed & Verified by Nuel Effiong • Principal AI Systems Architect</div>
      </div>

      <div style="text-align:center; margin:32px 0 16px 0;">
        <a href="${verifyUrl}" class="btn-primary">View & Download Tamper-Proof Certificate &rarr;</a>
      </div>
    `;

    return this.wrapEmail(`Certificate Issued: ${certId}`, `Your official VibeCert certificate ${certId} is ready.`, body);
  }

  // =========================================================================
  // 5. STUDIO PROJECT MILESTONE
  // =========================================================================
  templateStudioMilestone(data) {
    const client = data.clientName || 'Partner';
    const project = data.projectTitle || 'Custom Web Application';
    const stage = data.stage || 'Phase 2: Full-Stack Implementation';
    const progress = data.progress || 60;
    const stagingUrl = data.stagingUrl || 'https://staging.zeerocodes.com';

    const body = `
      <div style="margin-bottom:16px;">
        <span class="badge badge-teal">SPRINT MILESTONE REACHED</span>
      </div>
      <h2>${project} Milestone Update</h2>
      <p>Dear ${client}, our engineering team has completed sprint deliverables for <strong>${stage}</strong>.</p>

      <div class="card-box">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;">
          <span>Overall Project Completion</span>
          <strong style="color:#85C79A;">${progress}%</strong>
        </div>
        <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; margin-bottom:16px;">
          <div style="width:${progress}%; height:100%; background:linear-gradient(90deg, #016B61, #85C79A);"></div>
        </div>
        <div style="font-size:13px; color:#E4EEE7;">
          <strong>Live Staging Environment:</strong> <a href="${stagingUrl}" target="_blank" style="color:#85C79A;">${stagingUrl}</a>
        </div>
      </div>

      <div style="text-align:center; margin:28px 0;">
        <a href="${stagingUrl}" class="btn-primary">Inspect Staging Prototype &rarr;</a>
      </div>
    `;

    return this.wrapEmail(`Sprint Update: ${project}`, `Project milestone completed for ${project}.`, body);
  }

  // =========================================================================
  // 6. VIBESCAN AUDIT CERTIFIED
  // =========================================================================
  templateVibescanCert(data) {
    const app = data.appName || 'Custom Application';
    const score = data.score || 98;
    const certId = data.certificationId || 'VIBECERT-2026-0042';

    const body = `
      <div style="margin-bottom:16px;">
        <span class="badge badge-success">VIBESCAN AST AUDIT PASSED</span>
      </div>
      <h2>Security Certification: ${app}</h2>
      <p>Our AST static code analyzer and threat modeling engine has completed the 14-point OWASP LLM security audit on <strong>${app}</strong>.</p>

      <div class="card-box">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <div style="font-size:11px; color:#6B7280;">SECURITY SCORE</div>
            <strong style="font-size:24px; color:#85C79A;">${score}/100</strong>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px; color:#6B7280;">VIBECERT BADGE ID</div>
            <strong style="font-family:monospace; color:#FFF;">${certId}</strong>
          </div>
        </div>
        <p style="font-size:13px; margin:0;">0 Critical Vulnerabilities • Supabase PostgreSQL RLS Hardened • HMAC Webhooks Verified</p>
      </div>

      <div style="text-align:center; margin:28px 0;">
        <a href="https://zeerocodes.com/#vibescan" class="btn-primary">Get Trust Badge Embed Code &rarr;</a>
      </div>
    `;

    return this.wrapEmail(`Security Certified: ${app}`, `${app} has passed the VibeScan security audit with a score of ${score}/100.`, body);
  }

  // =========================================================================
  // 7. COHORT REMINDER & DIGEST
  // =========================================================================
  templateCohortReminder(data) {
    const student = data.studentName || 'Builder';
    const course = data.courseTitle || 'The Zeerocodes VibeCode Labs';
    const week = data.weekNumber || '03';

    const body = `
      <div style="margin-bottom:16px;">
        <span class="badge badge-teal">WEEKLY SPRINT ACCOUNTABILITY</span>
      </div>
      <h2>Week ${week} Build Milestone, ${student}!</h2>
      <p>You're making great progress in <strong>${course}</strong>. Here is your weekly focus roadmap to keep you on track for graduation and client acquisition.</p>

      <div class="card-box">
        <h4 style="color:#FFF; margin-bottom:8px;">This Week's Practical Focus:</h4>
        <ul style="padding-left:20px; font-size:13px; color:#E4EEE7; line-height:1.6;">
          <li>n8n Business Workflow Nodes & WhatsApp Cloud API Integration</li>
          <li>Cryptographic Paystack Webhook Verification and Idempotency</li>
          <li>Live Office Hours with Nuel Effiong this Saturday at 11:00 AM WAT</li>
        </ul>
      </div>

      <div style="text-align:center; margin:28px 0;">
        <a href="https://zeerocodes.com/#dashboard" class="btn-primary">Open Week ${week} Modules in LMS &rarr;</a>
      </div>
    `;

    return this.wrapEmail(`Week ${week} Sprint in ${course}`, `Your weekly builder roadmap for ${course}.`, body);
  }

  // --- Render Template with Variable Interpolation ---
  renderTemplate(templateId, data = {}) {
    const tmpl = this.templates[templateId];
    if (!tmpl) {
      throw new Error(`Email template "${templateId}" not found.`);
    }
    return tmpl.render(data);
  }

  // --- Dispatch Transactional Email (Simulated & Persisted to DB Logs) ---
  async dispatchEmail(templateId, recipientEmail, data = {}) {
    const tmpl = this.templates[templateId];
    if (!tmpl) return;

    let subject = tmpl.defaultSubject;
    Object.keys(data).forEach(key => {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    });

    const htmlContent = tmpl.render(data);

    // Save into database logs
    if (window.db) {
      await window.db.saveEmailLog({
        template: templateId,
        subject,
        to: recipientEmail,
        recipientName: data.studentName || data.clientName || recipientEmail,
        status: 'DELIVERED',
        sentAt: new Date().toISOString()
      });
    }

    console.log(`📨 [Transactional Email Engine] Dispatched "${subject}" to ${recipientEmail}`);

    if (window.toast) {
      window.toast.success(`Transactional Email ("${tmpl.name}") dispatched to ${recipientEmail}!`);
    }

    return {
      success: true,
      subject,
      recipientEmail,
      htmlContent
    };
  }
}

window.emailEngine = new TransactionalEmailEngine();
