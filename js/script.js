/**
 * IQD to RMB Calculator
 * - Calculates 0.3% fee from IQD amount
 * - Converts IQD to RMB using the current exchange rate
 */

// Constants
const FEE_RATE = 0.003; // 0.3%
const IQD_TO_RMB_RATE = 0.00548847420417124; // Exchange rate: 1 IQD = 0.00548847420417124 RMB

// DOM Elements
const form = document.getElementById('calculator-form');
const iqdInput = document.getElementById('iqdAmount');
const calculateBtn = document.getElementById('calculateBtn');
const feeResult = document.getElementById('feeResult');
const rmbResult = document.getElementById('rmbResult');
const currentYearEl = document.getElementById('current-year');

// Set current year in footer
currentYearEl.textContent = new Date().getFullYear();

/**
 * Calculate fee and RMB amount based on IQD input
 * @param {number} iqdAmount - Amount in Iraqi Dinar
 * @returns {Object} Object containing fee and RMB amounts
 */
function calculateValues(iqdAmount) {
  // Ensure input is a valid number
  const amount = parseFloat(iqdAmount);
  
  if (isNaN(amount) || amount < 0) {
    return { fee: 0, rmb: 0 };
  }
  
  // Calculate fee (0.3%)
  const fee = amount * FEE_RATE;
  
  // Calculate RMB amount
  const rmbAmount = amount * IQD_TO_RMB_RATE;
  
  return {
    fee: fee.toFixed(2),
    rmb: rmbAmount.toFixed(2)
  };
}

/**
 * Update results in the UI
 */
function updateResults() {
  const iqdAmount = iqdInput.value;
  const { fee, rmb } = calculateValues(iqdAmount);
  
  // Display results with formatting
  feeResult.value = fee ? `${fee} IQD` : '';
  rmbResult.value = rmb ? `¥${rmb}` : '';
}

/**
 * Reset the results fields
 */
function resetResults() {
  feeResult.value = '';
  rmbResult.value = '';
}

// Event Listeners
calculateBtn.addEventListener('click', updateResults);

// Add input event to update in real-time as well
iqdInput.addEventListener('input', function() {
  if (this.value === '') {
    resetResults();
  }
});

// Handle form reset
form.addEventListener('reset', resetResults);

// Handle form submission (prevent default behavior)
form.addEventListener('submit', function(event) {
  event.preventDefault();
  updateResults();
});