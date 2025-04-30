/**
 * IQD to RMB Calculator
 * - Calculates 0.3% fee from IQD amount
 * - Converts IQD to RMB using the current exchange rate
 */

// Constants
const FEE_RATE = 0.003; // 0.3%
const IQD_TO_RMB_RATE = 0.00548847420417124; // Exchange rate: 1 IQD = 0.00548847420417124 RMB

// Note: The exchange rate is a placeholder. In a real application, you would fetch this from an API or database.
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
 * Format a number with comma separators for thousands
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number with commas
 */
function formatNumberWithCommas(number, decimals = 2) {
  const fixed = parseFloat(number).toFixed(decimals);
  return fixed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Calculate fee and RMB amount based on IQD input
 * @param {number} iqdAmount - Amount in Iraqi Dinar
 * @returns {Object} Object containing fee and RMB amounts
 */
function calculateValues(iqdAmount) {
  // Ensure input is a valid number
  const amount = parseFloat(iqdAmount.replace(/,/g, ''));
  
  if (isNaN(amount) || amount < 0) {
    return { fee: 0, rmb: 0 };
  }
  
  // Calculate fee (0.3%)
  const fee = amount * FEE_RATE;
  
  // Calculate RMB amount
  const rmbAmount = amount * IQD_TO_RMB_RATE;
  
  return {
    fee: formatNumberWithCommas(fee),
    rmb: formatNumberWithCommas(rmbAmount)
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
 * Format input value with commas as the user types
 */
function formatInputWithCommas() {
  const value = iqdInput.value.replace(/,/g, '');
  if (value !== '') {
    const number = parseFloat(value);
    if (!isNaN(number)) {
      // Only format if it's a valid number
      // Use 0 decimals for the input field
      iqdInput.value = formatNumberWithCommas(number, 0).replace('.00', '');
    }
  }
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

// Format the input with commas when the user stops typing
iqdInput.addEventListener('blur', formatInputWithCommas);

// Remove commas when the input field is focused for easier editing
iqdInput.addEventListener('focus', function() {
  this.value = this.value.replace(/,/g, '');
});

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