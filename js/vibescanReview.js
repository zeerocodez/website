/**
 * Zeerocodes VibeScan Structured Review & Certification Generator
 * Handles the manual audit review process, OWASP checklist evaluation,
 * VibeCert™ badge generation, embed code generator, and remediation flows.
 */

class VibescanReviewManager {
  constructor() {
    this.currentSubmission = null;
  }

  /**
   * Opens the structured review modal for an admin
   */
  openStructuredReview(submissionId) {
    if (!window.auth || !window.auth.isAdmin()) {
      if (window.toast) window.toast.error("Admin role required.");
      return;
    }

    const submissions = window.db.getLocal('vibescanSubmissions') || [];
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    this.currentSubmission = sub;
    const modal = document.getElementById('modal-structured-audit-review');
    if (!modal) return;

    // Populate Intake Meta
    document.getElementById('structAppName').textContent = sub.appName;
    document.getElementById('structUserEmail').textContent = sub.userEmail;
    document.getElementById('structTechStack').textContent = sub.techStack;
    document.getElementById('structBuildMethod').textContent = sub.buildMethod;
    document.getElementById('structReferralSource').textContent = (sub.referralSource || 'direct').toUpperCase();
    
    const repoLink = document.getElementById('structRepoLink');
    if (repoLink) {
      repoLink.href = sub.appUrl;
      repoLink.textContent = sub.appUrl;
    }

    // Reset Form Fields
    document.getElementById('auditAuthSelect').value = 'pass';
    document.getElementById('auditAuthNotes').value = 'Firebase / Supabase RLS and token verification validated.';
    
    document.getElementById('auditDataSelect').value = 'pass';
    document.getElementById('auditDataNotes').value = 'No exposed PII in client payloads or public storage buckets.';
    
    document.getElementById('auditDepSelect').value = 'pass';
    document.getElementById('auditDepNotes').value = 'Zero vulnerable packages detected in production dependencies.';
    
    document.getElementById('auditApiSelect').value = 'pass';
    document.getElementById('auditApiNotes').value = 'Paystack & Flutterwave webhook signatures verified with HMAC.';
    
    document.getElementById('auditOutcomeSelect').value = 'certified';
    document.getElementById('auditSummaryNotes').value = 'Codebase adheres to OWASP LLM Top 10 recommendations for production African FinTech deployment.';

    window.modal.open('modal-structured-audit-review');
  }

  /**
   * Submits the completed structured audit report
   */
  async submitAuditReport(formData) {
    if (!this.currentSubmission) return;

    const sub = this.currentSubmission;
    const isCertified = formData.overallOutcome === 'certified';
    const newStatus = isCertified ? 'certified' : 'not_certified';

    // 1. Create structured Audit Report Record in auditReports collection
    const reportRecord = {
      id: 'rpt-' + Date.now(),
      submissionId: sub.id,
      userId: sub.userId,
      userEmail: sub.userEmail,
      appName: sub.appName,
      authHandling: {
        status: formData.authHandlingStatus,
        notes: formData.authHandlingNotes
      },
      dataExposure: {
        status: formData.dataExposureStatus,
        notes: formData.dataExposureNotes
      },
      dependencyRisk: {
        status: formData.dependencyRiskStatus,
        notes: formData.dependencyRiskNotes
      },
      apiSecurity: {
        status: formData.apiSecurityStatus,
        notes: formData.apiSecurityNotes
      },
      overallOutcome: formData.overallOutcome,
      summaryNotes: formData.summaryNotes,
      auditedAt: new Date().toISOString(),
      auditor: window.auth.getUser()?.email || 'admin@zeerocodes.com'
    };

    // Save to auditReports in db
    if (window.db) {
      const reports = window.db.getLocal('auditReports') || [];
      reports.unshift(reportRecord);
      window.db.setLocal('auditReports', reports);
    }

    let certRecord = null;
    if (isCertified) {
      // 2. Generate Certification Record
      const certId = 'VIBECERT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      certRecord = await window.db.issueCertification({
        certId: certId,
        submissionId: sub.id,
        appName: sub.appName,
        recipient: sub.userName || sub.userEmail,
        grade: 'Grade A (Verified Safe)',
        summaryNotes: formData.summaryNotes,
        embedCodeHtml: `<a href="https://zeerocodes.com/verify/${certId}" target="_blank"><img src="https://zeerocodes.com/badge/vibecert-a.svg" alt="VibeCert Verified Safe by Zeerocodes" width="130" height="38" /></a>`,
        embedCodeMarkdown: `[![VibeCert Verified Safe](https://zeerocodes.com/badge/vibecert-a.svg)](https://zeerocodes.com/verify/${certId})`
      });
    }

    // 3. Update Submission Status
    await window.db.updateSubmissionStatus(sub.id, newStatus, certRecord);

    // 4. Trigger Transactional Email & WhatsApp hook
    if (window.notifications) {
      window.notifications.dispatch('vibescan_report_ready', {
        userEmail: sub.userEmail,
        appName: sub.appName,
        outcome: formData.overallOutcome,
        certId: certRecord?.certId || null,
        notes: formData.summaryNotes
      });
    }

    window.modal.closeAll();
    if (window.toast) {
      window.toast.success(isCertified ? `VibeCert™ issued for ${sub.appName}!` : `Report submitted. User notified of remediation needs.`);
    }

    // Refresh Admin Queue
    if (window.app) {
      await window.app.renderAdminDashboard();
    }
  }

  /**
   * Opens the user's audit findings viewer on their dashboard
   */
  openUserReportViewer(submissionId) {
    const submissions = window.db.getLocal('vibescanSubmissions') || [];
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;

    const reports = window.db.getLocal('auditReports') || [];
    const report = reports.find(r => r.submissionId === submissionId);

    const modal = document.getElementById('modal-user-audit-report');
    if (!modal) return;

    document.getElementById('userRptAppName').textContent = sub.appName;
    document.getElementById('userRptStatusBadge').innerHTML = sub.status === 'certified' 
      ? `<span class="badge badge-success">CERTIFIED SAFE</span>`
      : `<span class="badge badge-error">REMEDIATION NEEDED</span>`;

    const findingsContainer = document.getElementById('userRptFindingsTable');
    if (findingsContainer && report) {
      findingsContainer.innerHTML = `
        <div class="report-finding-item">
          <div class="finding-header">
            <strong>1. Authentication & Row-Level Hardening</strong>
            <span class="badge badge-${report.authHandling.status === 'pass' ? 'success' : 'error'}">${report.authHandling.status.toUpperCase()}</span>
          </div>
          <p class="finding-desc">${report.authHandling.notes}</p>
        </div>

        <div class="report-finding-item">
          <div class="finding-header">
            <strong>2. Sensitive Data & PII Exposure</strong>
            <span class="badge badge-${report.dataExposure.status === 'pass' ? 'success' : 'error'}">${report.dataExposure.status.toUpperCase()}</span>
          </div>
          <p class="finding-desc">${report.dataExposure.notes}</p>
        </div>

        <div class="report-finding-item">
          <div class="finding-header">
            <strong>3. Injected Dependencies & Package Risk</strong>
            <span class="badge badge-${report.dependencyRisk.status === 'pass' ? 'success' : 'error'}">${report.dependencyRisk.status.toUpperCase()}</span>
          </div>
          <p class="finding-desc">${report.dependencyRisk.notes}</p>
        </div>

        <div class="report-finding-item">
          <div class="finding-header">
            <strong>4. Webhook Signatures & API Security</strong>
            <span class="badge badge-${report.apiSecurity.status === 'pass' ? 'success' : 'error'}">${report.apiSecurity.status.toUpperCase()}</span>
          </div>
          <p class="finding-desc">${report.apiSecurity.notes}</p>
        </div>
      `;
    }

    const embedBox = document.getElementById('userRptEmbedContainer');
    const resubmitBox = document.getElementById('userRptResubmitContainer');

    if (sub.status === 'certified') {
      if (embedBox) embedBox.classList.remove('d-none');
      if (resubmitBox) resubmitBox.classList.add('d-none');

      const certs = window.db.getLocal('certifications') || [];
      const cert = certs.find(c => c.submissionId === sub.id) || certs[0];
      if (cert) {
        document.getElementById('userEmbedHtml').value = cert.embedCodeHtml || `<a href="https://zeerocodes.com/verify/${cert.certId}"><img src="https://zeerocodes.com/badge/vibecert-a.svg" alt="VibeCert Verified Safe" /></a>`;
        document.getElementById('userEmbedMarkdown').value = cert.embedCodeMarkdown || `[![VibeCert Verified Safe](https://zeerocodes.com/badge/vibecert-a.svg)](https://zeerocodes.com/verify/${cert.certId})`;
      }
    } else {
      if (embedBox) embedBox.classList.add('d-none');
      if (resubmitBox) resubmitBox.classList.remove('d-none');
    }

    window.modal.open('modal-user-audit-report');
    if (window.lucide) window.lucide.createIcons();
  }
}

window.vibescanReview = new VibescanReviewManager();
