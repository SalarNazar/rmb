/**
 * IQD to RMB Calculator
 * - Calculates fee from IQD amount
 * - Converts IQD to RMB using the current exchange rate
 */

// Constants
let FEE_RATE = 0.003; // Default 0.3%
const IQD_TO_RMB_RATE = 0.00548847420417124; // Exchange rate: 1 IQD = 0.00548847420417124 RMB

// DOM Elements
const form = document.getElementById('calculator-form');
const iqdInput = document.getElementById('iqdAmount');
const calculateBtn = document.getElementById('calculateBtn');
const feeResult = document.getElementById('feeResult');
const rmbResult = document.getElementById('rmbResult');
const currentYearEl = document.getElementById('current-year');
const currentFeeRateEl = document.getElementById('currentFeeRate');
const editFeeBtn = document.getElementById('editFeeBtn');
const feeRateEditForm = document.getElementById('feeRateEditForm');
const feeRateInput = document.getElementById('feeRateInput');
const saveFeeBtn = document.getElementById('saveFeeBtn');
const cancelFeeBtn = document.getElementById('cancelFeeBtn');

// Set current year in footer
currentYearEl.textContent = new Date().getFullYear();

// Update fee rate display
function updateFeeRateDisplay() {
  // Update the displayed fee rate percentage
  currentFeeRateEl.textContent = (FEE_RATE * 100).toFixed(1);
  
  // Update the fee result label if it exists
  const feeResultLabel = document.querySelector('label[for="feeResult"]');
  if (feeResultLabel) {
    feeResultLabel.textContent = `${(FEE_RATE * 100).toFixed(1)}% عمولة المصرف:`;
  }
}

// Initialize the fee rate display
updateFeeRateDisplay();

/**
 * Format a number with comma separators for thousands
 * @param {number} number - The number to format
 * @returns {string} Formatted number with commas
 */
function formatNumberWithCommas(number) {
  // Handle large numbers safely
  try {
    // Round to whole number and format with commas
    const rounded = Math.round(Number(number));
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (error) {
    console.error('Error formatting number:', error);
    return '0';
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
    return { fee: '0', rmb: '0' };
  }
  
  // Calculate fee using current fee rate
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

/**
 * Show fee rate edit form
 */
function showFeeRateEditForm() {
  feeRateInput.value = (FEE_RATE * 100).toFixed(1);
  feeRateEditForm.classList.remove('hidden');
}

/**
 * Hide fee rate edit form
 */
function hideFeeRateEditForm() {
  feeRateEditForm.classList.add('hidden');
}

/**
 * Save new fee rate
 */
function saveNewFeeRate() {
  const newFeeRatePercentage = parseFloat(feeRateInput.value);
  
  if (isNaN(newFeeRatePercentage) || newFeeRatePercentage < 0 || newFeeRatePercentage > 100) {
    alert('الرجاء إدخال نسبة مئوية صالحة بين 0 و 100.');
    return;
  }
  
  // Convert percentage to decimal
  FEE_RATE = newFeeRatePercentage / 100;
  
  // Update fee rate display
  updateFeeRateDisplay();
  
  // Update results if there's an amount entered
  if (iqdInput.value) {
    updateResults();
  }
  
  // Hide edit form
  hideFeeRateEditForm();
  
  // Save to local storage for persistence
  try {
    localStorage.setItem('feeRate', FEE_RATE.toString());
  } catch (error) {
    console.error('Error saving fee rate to local storage:', error);
  }
}

// Load saved fee rate from local storage
function loadSavedFeeRate() {
  try {
    const savedFeeRate = localStorage.getItem('feeRate');
    if (savedFeeRate !== null) {
      FEE_RATE = parseFloat(savedFeeRate);
      updateFeeRateDisplay();
    }
  } catch (error) {
    console.error('Error loading saved fee rate:', error);
  }
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

// Fee rate edit event listeners
editFeeBtn.addEventListener('click', showFeeRateEditForm);
saveFeeBtn.addEventListener('click', saveNewFeeRate);
cancelFeeBtn.addEventListener('click', hideFeeRateEditForm);

// Load saved fee rate when the page loads
document.addEventListener('DOMContentLoaded', loadSavedFeeRate);

// Handle form submission (prevent default behavior)
form.addEventListener('submit', function(event) {
  event.preventDefault();
  updateResults();
});