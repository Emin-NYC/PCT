// Event Listener for DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  populateRatePlanOptions();
  applyFilter();
});


// Plan details object
var planDetails = {
  "Magenta": {
    "baseCost": [70, 120], // Costs for 1 line and 2 lines
    "additionalLineCost": 20
  },
  "Magenta55": {
    "baseCost": [50, 70],
    "additionalLineCost": 35
  },
  "Go5G": {
    "baseCost": [75, 130],
    "additionalLineCost": 25
  },
  "Go5G 55": {
    "baseCost": [55, 80],
    "additionalLineCost": 40
  }
  // More plans can be added here in the same structure
};


// Global variables for current plan and line counts
var currentPlan = '';
var numberOfPaidVoiceLines = 0;
var numberOfFreeVoiceLines = 0;


// Global object to store filter settings
var filterSettings = {
  paidLines: true,
  freeLines: true,
  miLines: false,
  features: false,
  eip: false,
  tax: false,
};



// Navigation stack for maintaining history
var navigationStack = [];



// Function to populate rate plan dropdown
function populateRatePlanOptions() {
  var select = document.getElementById('currentRatePlan');
  for (var plan in planDetails) {
    var option = document.createElement('option');
    option.value = plan;
    option.text = plan;
    select.appendChild(option);
  }
}





// Function to apply filter settings
function applyFilter() {
  // Update settings based on checkboxes (Paid and Free Voice Lines are always true)
  filterSettings.paidLines = true;
  filterSettings.freeLines = true;
  filterSettings.miLines = document.getElementById('filterMILines').checked;
  filterSettings.features = document.getElementById('filterFeatures').checked;
  filterSettings.eip = document.getElementById('filterEIP').checked;
  filterSettings.tax = document.getElementById('filterTax').checked;

  document.getElementById('filterModal').style.display = 'none';

  startOver(); // Restart the flow
}





// Function to show the filter modal
function showFilterModal() {
  document.getElementById('filterModal').style.display = 'block';
}



// Function to show a specific card
function showCard(cardId) {
  var cards = document.getElementsByClassName('card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].style.display = 'none';
  }

  document.getElementById(cardId).style.display = 'block';
}



// Function to navigate to the next card
function navigateToNextCard(currentCardId) {
  var nextCardId = determineNextCard(currentCardId);

  // Push the next card onto the stack before showing it
  if (nextCardId !== 'ratePlanCard') {
    navigationStack.push(nextCardId);
  }

  showCard(nextCardId);
}



// Function to determine the next card based on current card and filter settings
function determineNextCard(currentCardId) {
  switch (currentCardId) {
    case 'ratePlanCard':
      return filterSettings.paidLines ? 'paidVoiceLinesCard' :
        filterSettings.freeLines ? 'freeVoiceLinesCard' :
        filterSettings.miLines ? 'miLinesCard' :
        filterSettings.features ? 'featuresCard' :
        filterSettings.eip ? 'eipCard' :
        filterSettings.tax ? 'taxCard' :
        'finalCardSummary';

    case 'paidVoiceLinesCard':
      return filterSettings.freeLines ? 'freeVoiceLinesCard' :
        filterSettings.miLines ? 'miLinesCard' :
        filterSettings.features ? 'featuresCard' :
        filterSettings.eip ? 'eipCard' :
        filterSettings.tax ? 'taxCard' :
        'finalCardSummary';

    case 'freeVoiceLinesCard':
      return filterSettings.miLines ? 'miLinesCard' :
        filterSettings.features ? 'featuresCard' :
        filterSettings.eip ? 'eipCard' :
        filterSettings.tax ? 'taxCard' :
        'finalCardSummary';

    case 'miLinesCard':
      return filterSettings.features ? 'featuresCard' :
        filterSettings.eip ? 'eipCard' :
        filterSettings.tax ? 'taxCard' :
        'finalCardSummary';

    case 'featuresCard':
      return filterSettings.eip ? 'eipCard' :
        filterSettings.tax ? 'taxCard' :
        'finalCardSummary';

    case 'eipCard':
      return filterSettings.tax ? 'taxCard' :
        'finalCardSummary';

    case 'taxCard':
      return 'finalCardSummary';

    default:
      return 'ratePlanCard';
  }
}


// Handler functions for each card's button click

function handleRatePlanSelection() {
  currentPlan = document.getElementById('currentRatePlan').value;
  resetSummaryFields();
  updateSummary('Current Plan', currentPlan);
  navigateToNextCard('ratePlanCard');
}



function handlePaidVoiceLinesSelection() {
  numberOfPaidVoiceLines = parseInt(document.getElementById('numberOfPaidVoiceLines').value) || 0;
  updateSummary('Paid Voice', numberOfPaidVoiceLines);
  navigateToNextCard('paidVoiceLinesCard');
}



function handleFreeVoiceLinesSelection() {
  numberOfFreeVoiceLines = parseInt(document.getElementById('numberOfFreeVoiceLines').value) || 0;
  updateSummary('Free Voice', numberOfFreeVoiceLines);

  var calculatedCost = calculateTotalLinesCost();
  updateSummary('Total Voice', '$' + calculatedCost);

  navigateToNextCard('freeVoiceLinesCard');
}



function handleMISelection() {
  var totalMIAmount = 0;
  var numberOfLines = parseInt(document.getElementById('numberOfMILines').value) || 0;
  for (var i = 1; i <= numberOfLines; i++) {
    totalMIAmount += parseFloat(document.getElementById('miAmount' + i).value) || 0;
  }
  updateSummary('Total MI', '$' + totalMIAmount);
  navigateToNextCard('miLinesCard');
}



function handleFeaturesSelection() {
  var featuresAmount = parseFloat(document.getElementById('totalFeaturesAmount').value || 0);
  updateSummary('Total Features', '$' + featuresAmount);
  navigateToNextCard('featuresCard');
}



function handleEIPSelection() {
  var totalEIP = 0;
  var numberOfDevices = parseInt(document.getElementById('numberOfFinancedDevices').value) || 0;
  for (var i = 1; i <= numberOfDevices; i++) {
    totalEIP += parseFloat(document.getElementById('eipAmount' + i).value) || 0;
  }
  updateSummary('Total EIP', '$' + totalEIP);
  navigateToNextCard('eipCard');
}



function handleTaxSelection() {
  var taxAmount = parseFloat(document.getElementById('totalTaxAmount').value) || 0;

  updateSummary('Total Tax', '$' + taxAmount);
  navigateToNextCard('taxCard');
}


// Additional helper functions


// Logic for generating MI inputs
function generateMIInputs() {
  var numberOfLines = parseInt(document.getElementById('numberOfMILines').value) || 0;
  var miInputsContainer = document.getElementById('miInputs');
  miInputsContainer.innerHTML = '';

  miInputsContainer.innerHTML = '<h3>MI Lines: ' + numberOfLines + '</h3>';

  for (var i = 0; i < numberOfLines; i++) {
    var input = document.createElement('input');
    input.type = 'number';
    input.id = 'miAmount' + (i + 1);
    input.placeholder = 'Price of MI line ' + (i + 1);
    miInputsContainer.appendChild(input);
  }
}


// Logic for generating EIP inputs
function generateEIPInputs() {
  var numberOfDevices = parseInt(document.getElementById('numberOfFinancedDevices').value) || 0;

  numberOfDevices = numberOfDevices > 20 ? 20 : numberOfDevices; // Limit to 20

  var devicesFinancedDisplay = document.getElementById('devicesFinancedDisplay');

  var eipInputsContainer = document.getElementById('eipInputs');

  devicesFinancedDisplay.innerHTML = '<h2>EIP Financed: ' + numberOfDevices + '</h2>';

  eipInputsContainer.innerHTML = ''; // Clear existing inputs

  for (var i = 0; i < numberOfDevices; i++) {
    var input = document.createElement('input');
    input.type = 'number';
    input.id = 'eipAmount' + (i + 1);
    input.placeholder = 'Price of item ' + (i + 1);
    eipInputsContainer.appendChild(input);
  }
}


// Logic for calculating total lines cost
function calculateTotalLinesCost() {
  if (!currentPlan || numberOfPaidVoiceLines === 0) return 0;

  var plan = planDetails[currentPlan];
  var totalCost;

  if (numberOfPaidVoiceLines === 1) {
    totalCost = plan.baseCost[0];
  } else if (numberOfPaidVoiceLines === 2) {
    totalCost = plan.baseCost[1];
  } else {
    // For more than two lines
    totalCost = plan.baseCost[1] + (numberOfPaidVoiceLines - 2) * plan.additionalLineCost;
  }

  return totalCost;
}





// Logic for calculating current bill
function calculateCurrentBill() {
  var featuresAmount = parseFloat(document.getElementById('totalFeaturesAmount').value) || 0;
  var eipTotal = 0;
  var numberOfDevices = parseInt(document.getElementById('numberOfFinancedDevices').value) || 0;
  for (var i = 1; i <= numberOfDevices; i++) {
    eipTotal += parseFloat(document.getElementById('eipAmount' + i).value) || 0;
  }

  var miTotal = 0;
  var numberOfMILines = parseInt(document.getElementById('numberOfMILines').value) || 0;
  for (var j = 1; j <= numberOfMILines; j++) {
    miTotal += parseFloat(document.getElementById('miAmount' + j).value) || 0;
  }


  var taxAmount = parseFloat(document.getElementById('totalTaxAmount').value) || 0;
  var totalCost = calculateTotalLinesCost();

  var totalMRC = totalCost + featuresAmount + eipTotal + miTotal + taxAmount;

  totalMRC = isNaN(totalMRC) ? 0 : totalMRC; // Check for NaN and defualt to 0

  // Update the totalMrcContainer directly
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  totalMrcContainer.style.display = 'block';
  totalMrcContainer.innerHTML = '<strong>Total MRC: $' + totalMRC + '</strong>';
}







// Logic for updating the summary
function updateSummary(category, value) {
  var summaryContent = document.getElementById('summaryContent');
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  var existingEntry = summaryContent.querySelector('[data-category="' + category + '"]');
  var entryHtml;

  if (category === 'Total MRC') {
    // Directly update the Total MRC container
    totalMrcContainer.innerHTML = '<strong>' + category + ': ' + value + '</strong>';
  } else {
    // For other categories
    entryHtml = '<span data-category="' + category + '">' + category + ': ' + value + '</span>';
    if (existingEntry) {
      existingEntry.outerHTML = entryHtml; // Update existing entry
    } else {
      summaryContent.innerHTML += entryHtml + '<br>'; // Add new entry with a line break
    }
  }
}


function updateTotalVoiceLines() {
  var totalVoiceLines = numberOfPaidVoiceLines + numberOfFreeVoiceLines;
  updateSummary('Total Voice Lines', totalVoiceLines);
}





function resetSummaryFields() {
  document.getElementById('summaryContent').innerHTML = '';
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  totalMrcContainer.style.display = 'none';
  totalMrcContainer.innerHTML = '';
}





function showPrevious() {
  if (navigationStack.length > 0) {
    navigationStack.pop(); // Remove the current card from the stack
  }

  // Determine the previous card to show
  var previousCardId = navigationStack.length > 0 ?
    navigationStack[navigationStack.length - 1] :
    'ratePlanCard';

  showCard(previousCardId); // Show the previous card
}





// Start over
function startOver() {
  currentPlan = '';
  numberOfPaidVoiceLines = 0;
  numberOfFreeVoiceLines = 0;
  resetSummaryFields();
  navigationStack = [];
  showCard('ratePlanCard');
}
