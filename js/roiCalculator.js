/* ==========================================================================
   ZEEROCODES AUTOMATION - INTERACTIVE AI ROI & READINESS CALCULATOR
   Mathematical Cost Savings, Reclaimed Hours, & Risk Index Engine (v2.0)
   ========================================================================== */

class RoiCalculator {
  constructor() {
    this.latestSnapshot = null;
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.calculate();
  }

  cacheElements() {
    this.teamSizeInput = document.getElementById('calcTeamSize');
    this.manualHoursInput = document.getElementById('calcManualHours');
    this.hourlyRateInput = document.getElementById('calcHourlyRate');

    this.valTeamSize = document.getElementById('valTeamSize');
    this.valManualHours = document.getElementById('valManualHours');
    this.valHourlyRate = document.getElementById('valHourlyRate');

    this.resTotalSaved = document.getElementById('resTotalSaved') || document.getElementById('resAnnualSavings');
    this.resHoursSaved = document.getElementById('resHoursSaved') || document.getElementById('resHoursReclaimed');
    this.resPayback = document.getElementById('resPaybackPeriod');
    this.resMonthlySaved = document.getElementById('resMonthlySaved');
  }

  bindEvents() {
    const inputs = [
      this.teamSizeInput,
      this.manualHoursInput,
      this.hourlyRateInput
    ];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.calculate());
        input.addEventListener('change', () => this.calculate());
      }
    });

    // Delegate "Book Call With ROI" buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.trigger-book-roi-scope') || e.target.closest('.btn-book-roi-scope')) {
        e.preventDefault();
        this.bookWithScope();
      }
    });
  }

  calculate() {
    if (!this.teamSizeInput) {
      this.cacheElements();
      if (!this.teamSizeInput) return;
    }

    const teamSize = parseInt(this.teamSizeInput.value) || 25;
    const manualHoursPerWeek = parseInt(this.manualHoursInput ? this.manualHoursInput.value : 12) || 12;
    const hourlyRate = parseInt(this.hourlyRateInput ? this.hourlyRateInput.value : 3500) || 3500;

    // Update UI value labels
    if (this.valTeamSize) this.valTeamSize.innerText = `${teamSize} Employees`;
    if (this.valManualHours) this.valManualHours.innerText = `${manualHoursPerWeek} hrs/wk`;
    if (this.valHourlyRate) this.valHourlyRate.innerText = `₦${hourlyRate.toLocaleString()} / hr`;

    // 1. Annual Hours Spent on Repetitive Manual Work
    const weeksPerYear = 48; // 48 active work weeks
    const totalManualHoursAnnual = teamSize * manualHoursPerWeek * weeksPerYear;
    
    // 2. Automation Efficiency Factor (75% elimination of repetitive manual overhead)
    const automationEfficiencyFactor = 0.75;
    const hoursReclaimedAnnual = Math.round(totalManualHoursAnnual * automationEfficiencyFactor);
    const monthlyHoursReclaimed = Math.round(hoursReclaimedAnnual / 12);

    // 3. Gross Annual Financial Savings (in Naira)
    const grossAnnualSavingsNGN = hoursReclaimedAnnual * hourlyRate;
    const monthlySavingsNGN = Math.round(grossAnnualSavingsNGN / 12);
    const estimatedBuildCostNGN = 1200000; // Average studio automation build package
    const paybackDays = Math.max(7, Math.round((estimatedBuildCostNGN / monthlySavingsNGN) * 30));

    // Render results
    if (this.resTotalSaved) {
      this.resTotalSaved.innerText = `₦${grossAnnualSavingsNGN.toLocaleString('en-US')}`;
    }

    if (this.resHoursSaved) {
      this.resHoursSaved.innerText = `${monthlyHoursReclaimed.toLocaleString('en-US')} monthly hours`;
    }

    if (this.resMonthlySaved) {
      this.resMonthlySaved.innerText = `₦${monthlySavingsNGN.toLocaleString('en-US')} / mo`;
    }

    if (this.resPayback) {
      this.resPayback.innerText = `${paybackDays} Days (Full ROI)`;
    }

    this.latestSnapshot = {
      teamSize,
      manualHoursPerWeek,
      hourlyRate,
      grossAnnualSavingsNGN,
      monthlySavingsNGN,
      hoursReclaimedAnnual,
      monthlyHoursReclaimed,
      paybackDays
    };
  }

  bookWithScope() {
    if (!this.latestSnapshot) this.calculate();
    const s = this.latestSnapshot || { teamSize: 25, monthlyHoursReclaimed: 1200, grossAnnualSavingsNGN: 50400000 };
    if (window.modal) {
      window.modal.openBooking(`Automation Studio (${s.teamSize} Staff Operations)`);
      const notesEl = document.getElementById('bookingScopeNotes');
      const budgetEl = document.getElementById('bookingBudgetSelect');
      if (notesEl) {
        notesEl.value = `Pre-scoped with ROI Calculator:\n• Team Size: ${s.teamSize} employees handling manual tasks\n• Reclaiming: ${s.monthlyHoursReclaimed.toLocaleString()} productive hours/month\n• Projected Annual Payroll Savings: ₦${s.grossAnnualSavingsNGN.toLocaleString()}.\nLooking for custom workflow deployment.`;
      }
      if (budgetEl) {
        budgetEl.value = '₦750k - ₦2.5M ($500 - $1.8k)';
      }
    }
  }
}

// Global initialization
window.roiCalculator = new RoiCalculator();
window.initRoiCalculator = function() {
  if (!window.roiCalculator) window.roiCalculator = new RoiCalculator();
  window.roiCalculator.init();
  return window.roiCalculator;
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.roiCalculator) window.roiCalculator.init();
});

