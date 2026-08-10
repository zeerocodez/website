/* ==========================================================================
   ZEEROCODES AUTOMATION - INTERACTIVE AI ROI & READINESS CALCULATOR
   Mathematical Cost Savings, Reclaimed Hours, & Risk Index Engine
   ========================================================================== */

class RoiCalculator {
  constructor() {
    this.teamSizeInput = document.getElementById('calcTeamSize');
    this.manualHoursInput = document.getElementById('calcManualHours');
    this.hourlyRateInput = document.getElementById('calcHourlyRate');

    this.valTeamSize = document.getElementById('valTeamSize');
    this.valManualHours = document.getElementById('valManualHours');
    this.valHourlyRate = document.getElementById('valHourlyRate');

    this.resTotalSaved = document.getElementById('resTotalSaved') || document.getElementById('resAnnualSavings');
    this.resHoursSaved = document.getElementById('resHoursSaved') || document.getElementById('resHoursReclaimed');

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
      this.hourlyRateInput
    ];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.calculate());
        input.addEventListener('change', () => this.calculate());
      }
    });
  }

  calculate() {
    if (!this.teamSizeInput) return;

    const teamSize = parseInt(this.teamSizeInput.value) || 25;
    const manualHoursPerWeek = parseInt(this.manualHoursInput ? this.manualHoursInput.value : 12) || 12;
    const hourlyRate = parseInt(this.hourlyRateInput ? this.hourlyRateInput.value : 3500) || 3500;

    // Update UI value badges
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

    // Render results
    if (this.resTotalSaved) {
      this.resTotalSaved.innerText = `₦${grossAnnualSavingsNGN.toLocaleString('en-US')}`;
    }

    if (this.resHoursSaved) {
      this.resHoursSaved.innerText = `${monthlyHoursReclaimed.toLocaleString('en-US')} monthly hours`;
    }

    this.latestSnapshot = {
      teamSize,
      manualHoursPerWeek,
      hourlyRate,
      grossAnnualSavingsNGN,
      hoursReclaimedAnnual,
      monthlyHoursReclaimed
    };
  }

  bookWithScope() {
    if (!this.latestSnapshot) this.calculate();
    const s = this.latestSnapshot;
    if (window.modal) {
      window.modal.openBooking(`Automation Studio (${s.teamSize} Staff)`);
      const notesEl = document.getElementById('bookingScopeNotes');
      if (notesEl) {
        notesEl.value = `Pre-scoped with ROI Calculator: Team Size: ${s.teamSize}, Reclaiming ${s.monthlyHoursReclaimed.toLocaleString()} hrs/mo, Target Savings: ₦${s.grossAnnualSavingsNGN.toLocaleString()}.`;
      }
    }
  }
}

// Global initialization
window.initRoiCalculator = function() {
  window.roiCalculator = new RoiCalculator();
  return window.roiCalculator;
};
