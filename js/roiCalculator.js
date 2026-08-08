/* ==========================================================================
   ZEEROCODES AUTOMATION - INTERACTIVE AI ROI & READINESS CALCULATOR
   Mathematical Cost Savings, Reclaimed Hours, & Risk Index Engine
   ========================================================================== */

class RoiCalculator {
  constructor() {
    this.teamSizeInput = document.getElementById('calcTeamSize');
    this.manualHoursInput = document.getElementById('calcManualHours');
    this.hourlyRateInput = document.getElementById('calcHourlyRate');
    this.industrySelect = document.getElementById('calcIndustry');
    this.complianceSelect = document.getElementById('calcCompliance');

    this.valTeamSize = document.getElementById('valTeamSize');
    this.valManualHours = document.getElementById('valManualHours');
    this.valHourlyRate = document.getElementById('valHourlyRate');

    this.resAnnualSavings = document.getElementById('resAnnualSavings');
    this.resHoursReclaimed = document.getElementById('resHoursReclaimed');
    this.resRiskIndex = document.getElementById('resRiskIndex');
    this.resPaybackMonths = document.getElementById('resPaybackMonths');
    this.resRoadmapRecommendation = document.getElementById('resRoadmapRecommendation');

    this.init();
  }

  init() {
    if (!this.teamSizeInput) return;

    this.bindEvents();
    this.calculate();
  }

  bindEvents() {
    const inputs = [
      this.teamSizeInput,
      this.manualHoursInput,
      this.hourlyRateInput,
      this.industrySelect,
      this.complianceSelect
    ];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.calculate());
        input.addEventListener('change', () => this.calculate());
      }
    });
  }

  calculate() {
    const teamSize = parseInt(this.teamSizeInput.value) || 25;
    const manualHoursPerWeek = parseInt(this.manualHoursInput.value) || 12;
    const hourlyRate = parseInt(this.hourlyRateInput.value) || 65;
    const industry = this.industrySelect.value || 'finance';
    const compliance = this.complianceSelect.value || 'soc2';

    // Update UI value badges
    if (this.valTeamSize) this.valTeamSize.innerText = `${teamSize} Employees`;
    if (this.valManualHours) this.valManualHours.innerText = `${manualHoursPerWeek} hrs/wk`;
    if (this.valHourlyRate) this.valHourlyRate.innerText = `$${hourlyRate}/hr`;

    // 1. Annual Hours Spent on Repetitive Manual Work
    const weeksPerYear = 48; // assuming 48 working weeks
    const totalManualHoursAnnual = teamSize * manualHoursPerWeek * weeksPerYear;
    
    // 2. Automation Efficiency Factor (Zeerocodes targets 65% - 85% elimination of manual overhead)
    const automationEfficiencyFactor = 0.75;
    const hoursReclaimedAnnual = Math.round(totalManualHoursAnnual * automationEfficiencyFactor);

    // 3. Gross Annual Financial Savings
    const grossAnnualSavings = hoursReclaimedAnnual * hourlyRate;

    // 4. Risk Mitigation Score (0 - 100%)
    let baseRiskScore = 88;
    if (compliance === 'hipaa' || compliance === 'pci') baseRiskScore = 96;
    if (industry === 'healthcare' || industry === 'finance') baseRiskScore = 98;

    // 5. Projected Payback Period (Months)
    let paybackMonths = (1.8 + (teamSize < 20 ? 0.8 : 0.2)).toFixed(1);

    // Render results
    if (this.resAnnualSavings) {
      this.resAnnualSavings.innerText = `$${grossAnnualSavings.toLocaleString('en-US')}`;
    }

    if (this.resHoursReclaimed) {
      this.resHoursReclaimed.innerText = `${hoursReclaimedAnnual.toLocaleString('en-US')} hrs/yr`;
    }

    if (this.resRiskIndex) {
      this.resRiskIndex.innerText = `${baseRiskScore}% Risk Reduction`;
    }

    if (this.resPaybackMonths) {
      this.resPaybackMonths.innerText = `${paybackMonths} Months`;
    }

    // Dynamic Roadmap Recommendation
    if (this.resRoadmapRecommendation) {
      let recText = "";
      if (teamSize > 100) {
        recText = `Recommended Architecture: Enterprise n8n & Redis Queue cluster with OWASP LLM / ${compliance.toUpperCase()} Guardrails and WhatsApp CRM orchestration.`;
      } else if (teamSize > 30) {
        recText = `Recommended Architecture: Automated WhatsApp & Paystack Reconciliation Engine with OCR ingestion for rapid 35+ hrs/wk reclamation.`;
      } else {
        recText = `Recommended Architecture: High-Velocity AI Automation Suite with Webhook signature verification and automated dispatch bots.`;
      }
      this.resRoadmapRecommendation.innerText = recText;
    }

    // Save latest calculation snapshot
    this.latestSnapshot = {
      teamSize,
      manualHoursPerWeek,
      hourlyRate,
      grossAnnualSavings,
      grossAnnualSavingsNGN: grossAnnualSavings * 1450,
      hoursReclaimedAnnual,
      baseRiskScore,
      paybackMonths,
      industry,
      compliance
    };
  }

  exportProposal() {
    if (!this.latestSnapshot) this.calculate();
    const s = this.latestSnapshot;
    const text = `=====================================================
ZEEROCODES AUTOMATION STUDIO - AI ROI & SCOPING SUMMARY
=====================================================
Client Scope: ${s.teamSize} Team Members • ${s.industry.toUpperCase()} Industry
Manual Overhead: ${s.manualHoursPerWeek} hrs/week per employee
Reclaimed Productive Hours: ${s.hoursReclaimedAnnual.toLocaleString()} hrs/year
Projected Annual Savings: $${s.grossAnnualSavings.toLocaleString()} (approx. ₦${s.grossAnnualSavingsNGN.toLocaleString()})
Risk Mitigation Index: ${s.baseRiskScore}% (${s.compliance.toUpperCase()} Compliant)
Projected Payback Period: ${s.paybackMonths} Months
Authority: Zeerocodes Automation Limited (Nuel Effiong)
=====================================================`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.toast) {
        window.toast.success("📋 Scoping Proposal summary copied to clipboard!");
      }
    }).catch(() => {
      if (window.toast) window.toast.info("Scope calculated!");
    });
  }

  bookWithScope() {
    if (!this.latestSnapshot) this.calculate();
    const s = this.latestSnapshot;
    if (window.modal) {
      window.modal.openBooking(`Automation Studio (${s.industry.toUpperCase()} - ${s.teamSize} Staff)`);
      const notesEl = document.getElementById('bookingScopeNotes');
      if (notesEl) {
        notesEl.value = `Pre-scoped with ROI Calculator: Team Size: ${s.teamSize}, Reclaiming ${s.hoursReclaimedAnnual.toLocaleString()} hrs/yr, Target Savings: $${s.grossAnnualSavings.toLocaleString()} / ₦${s.grossAnnualSavingsNGN.toLocaleString()}.`;
      }
    }
  }
}

// Global initialization
window.initRoiCalculator = function() {
  window.roiCalculator = new RoiCalculator();
  return window.roiCalculator;
};

