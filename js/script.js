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
  // Handle large numbers safely
  try {
    const fixed = Number(number).toFixed(decimals);
    const parts = fixed.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  } catch (error) {
    console.error('Error formatting number:', error);
    return '0.00';
  }
}

/**
 * Parse a number string by removing commas
 * @param {string} str - The string to parse
 * @returns {number} The parsed number
 */
function parseNumberWithCommas(str) {
  if (!str) return 0;
  // Remove all commas and convert to number
  const cleanNum = str.toString().replace(/,/g, '');
  const num = Number(cleanNum);
  return isNaN(num) ? 0 : num;
}

/**
 * Calculate fee and RMB amount based on IQD input
 * @param {string} iqdAmount - Amount in Iraqi Dinar
 * @returns {Object} Object containing fee and RMB amounts
 */
function calculateValues(iqdAmount) {
  // Ensure input is a valid number by removing commas
  const amount = parseNumberWithCommas(iqdAmount);
  
  if (amount <= 0) {
    return { fee: '0.00', rmb: '0.00' };
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
  try {
    // Get the current cursor position before formatting
    const cursorPosition = iqdInput.selectionStart;
    const originalLength = iqdInput.value.length;
    
    // Only process if there's a value
    if (iqdInput.value) {
      // Remove non-numeric characters except commas
      let value = iqdInput.value.replace(/[^\d,]/g, '');
      // Then remove all commas to get a clean number
      const number = parseNumberWithCommas(value);
      
      // Format with commas but no decimal places
      if (!isNaN(number)) {
        const formatted = formatNumberWithCommas(number, 0).replace(/\.00$/, '');
        iqdInput.value = formatted;
        
        // Adjust cursor position after formatting
        const newPosition = cursorPosition + (iqdInput.value.length - originalLength);
        iqdInput.setSelectionRange(newPosition, newPosition);
      }
    }
  } catch (error) {
    console.error('Error in formatInputWithCommas:', error);
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

// Format the input with commas when the user types
iqdInput.addEventListener('input', function(e) {
  // Allow only digits and commas
  const value = this.value;
  
  // If the input is cleared, reset results
  if (value === '') {
    resetResults();
    return;
  }
  
  // If the value contains invalid characters, clean it
  if (/[^\d,]/g.test(value)) {
    this.value = value.replace(/[^\d,]/g, '');
  }
});

// Format with commas when the user finishes typing
iqdInput.addEventListener('blur', formatInputWithCommas);

// Handle form reset
form.addEventListener('reset', resetResults);

// Handle form submission (prevent default behavior)
form.addEventListener('submit', function(event) {
  event.preventDefault();
  updateResults();
});