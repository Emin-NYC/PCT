// Event Listener for DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  populateRatePlanOptions();
  applyFilter();
  initializeSummaries();
  document.getElementById('currentPlanButton').addEventListener('click', switchToCurrentPlan);
  document.getElementById('futurePlanButton').addEventListener('click', switchToFuturePlan);
  document.getElementById('resetButton').addEventListener('click', startOver);
});


// Plan details object
var planDetails = {
  "Magenta": {
    "baseCost": [70, 120], // Costs for 1 line and 2 lines
    "additionalLineCost": 20
  },
  "Magenta 55": {
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
  },
  "Magenta FR": {
    "baseCost": [55, 80],
    "additionalLineCost": 10
  },
  "Go5G FR": {
    "baseCost": [60, 90],
    "additionalLineCost": 15
  },
  "Magenta Military": {
    "baseCost": [55, 80],
    "additionalLineCost": 10
  },
  "Go5G Military": {
    "baseCost": [60, 90],
    "additionalLineCost": 15
  }
};



// Future Plan Details
var futurePlanDetails = {
  "Magenta 9+": {
    "baseCost": 270, // Flat cost Magenta 9 lines
    "costPerLine": 30 // AAL cost Magenta 9+ lines
  },
  "Magenta Max": {
    "baseCost": [85, 140],
    "additionalLineCost": 30
  },
  "Go5G Plus": {
    "baseCost": [90, 150],
    "additionalLineCost": 35
  },
  "Go5G Next": {
    "baseCost": [100, 170],
    "additionalLineCost": 45
  },

  "Magenta MAX 55": {
    "baseCost": [65, 90],
    "additionalLineCost": 45
  },
  "Go5G Plus 55": {
    "baseCost": [70, 100],
    "additionalLineCost": 50
  },
  "Go5G Next 55": {
    "baseCost": [80, 120],
    "additionalLineCost": 60
  },
  "Magenta MAX FR": {
    "baseCost": [70, 100],
    "additionalLineCost": 20
  },
  "Go5G Plus FR": {
    "baseCost": [75, 110],
    "additionalLineCost": 25
  },
  "Go5G Next FR": {
    "baseCost": [85, 130],
    "additionalLineCost": 35
  },
  "Magenta MAX Military": {
    "baseCost": [70, 100],
    "additionalLineCost": 20
  },
  "Go5G Plus Military": {
    "baseCost": [75, 110],
    "additionalLineCost": 25
  },
  "Go5G Next Military": {
    "baseCost": [85, 130],
    "additionalLineCost": 35
  }
};


// Global variables for plans and lines
var currentPlan = 'Magenta';
var futurePlan = 'Magenta Max';

var numberOfPaidVoiceLines = 0;
var numberOfFreeVoiceLines = 0;
var futureNumberOfPaidVoiceLines = 0;
var futureNumberOfFreeVoiceLines = 0;

// Global variables for current and future plans
var currentPlan = 'Magenta';
var futurePlan = 'Magenta Max';


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



// Function to toggle between current and future plans
function togglePlan() {
  if (document.getElementById('currentPlanButton').classList.contains('active')) {
    switchToFuturePlan();
  } else {
    switchToCurrentPlan();
  }
}


// Function to populate the rate plan dropdown (for both current and future plans)
function populateRatePlanOptions() {
  // Populate current plan dropdown
  var currentSelect = document.getElementById('currentRatePlan');
  currentSelect.innerHTML = '';
  for (var plan in planDetails) {
    var option = document.createElement('option');
    option.value = plan;
    option.text = plan;
    currentSelect.appendChild(option);
  }


  // Populate future plan dropdown
  var futureSelect = document.getElementById('futureRatePlan');
  futureSelect.innerHTML = '';
  for (var plan in futurePlanDetails) {
    var option = document.createElement('option');
    option.value = plan;
    option.text = plan;
    futureSelect.appendChild(option);
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



// Utility function to show a specific card
function showCard(cardId) {
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].style.display = 'none';
  }

  document.getElementById(cardId).style.display = 'block';
}



function navigateToNextCard(currentCardId, isFuture = false) {
  var nextCardId = determineNextCard(currentCardId, isFuture);
  if (nextCardId) {
    if (currentCardId !== (isFuture ? 'futureRatePlanCard' : 'ratePlanCard')) {
      navigationStack.push(currentCardId); // Push the current card onto the stack
    }
    showCard(nextCardId);
  } else {
    console.error("No next card found for the current workflow");
  }
}


function determineNextCard(currentCardId, isFuture = false) {
  if (isFuture) {
    // Logic for determining the next card in the future plan workflow
    switch (currentCardId) {
      case 'futureRatePlanCard':
        return 'futurePaidVoiceLinesCard';
      case 'futurePaidVoiceLinesCard':
        return 'futureFreeVoiceLinesCard';
      case 'futureFreeVoiceLinesCard':
        return filterSettings.miLines ? 'futureMILinesCard' :
          filterSettings.features ? 'futureFeaturesCard' :
          filterSettings.eip ? 'futureEIPCard' :
          filterSettings.tax ? 'futureTaxCard' :
          'futureFinalCardSummary';
      case 'futureMILinesCard':
        return filterSettings.features ? 'futureFeaturesCard' :
          filterSettings.eip ? 'futureEIPCard' :
          filterSettings.tax ? 'futureTaxCard' :
          'futureFinalCardSummary';
      case 'futureFeaturesCard':
        return filterSettings.eip ? 'futureEIPCard' :
          filterSettings.tax ? 'futureTaxCard' :
          'futureFinalCardSummary';
      case 'futureEIPCard':
        return filterSettings.tax ? 'futureTaxCard' :
          'futureFinalCardSummary';
      case 'futureTaxCard':
        return 'futureFinalCardSummary';
      default:
        return 'futureRatePlanCard'; // Default to the first card in the future workflow
    }
  } else {
    // Logic for determining the next card in the current plan workflow
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
        return 'ratePlanCard'; // Default to the first card in the current workflow
    }
  }
}




// Handler functions for each card's button click

function handleRatePlanSelection() {
  currentPlan = document.getElementById('currentRatePlan').value;
  updateSummary('Current Plan', currentPlan);
  navigateToNextCard('ratePlanCard');
  displaySummaries();
}

// Handler for Paid Voice Lines Selection
function handlePaidVoiceLinesSelection() {
  numberOfPaidVoiceLines = parseInt(document.getElementById('numberOfPaidVoiceLines').value) || 0;
  updateSummary('Current Paid Voice', numberOfPaidVoiceLines);
  navigateToNextCard('paidVoiceLinesCard');
  displaySummaries(); // Update summaries immediately
}


function handleFreeVoiceLinesSelection() {
  numberOfFreeVoiceLines = parseInt(document.getElementById('numberOfFreeVoiceLines').value) || 0;
  updateSummary('Current Free Voice', numberOfFreeVoiceLines);
  navigateToNextCard('freeVoiceLinesCard');
  displaySummaries(); // Update summaries immediately
}


// Function to handle future rate plan selection
function handleFutureRatePlanSelection() {
  futurePlan = document.getElementById('futureRatePlan').value;
  updateSummary('Future Plan', futurePlan, true);
  navigateToNextCard('futureRatePlanCard', true);
  displaySummaries();
}

// Handler for Future Paid Voice Lines Selection
function handleFuturePaidVoiceLinesSelection() {
  futureNumberOfPaidVoiceLines = parseInt(document.getElementById('futureNumberOfPaidVoiceLines').value) || 0;
  updateSummary('Future Paid Voice', futureNumberOfPaidVoiceLines, true);
  navigateToNextCard('futurePaidVoiceLinesCard', true);
  displaySummaries();
}

// Handler for Future Free Voice Lines Selection
function handleFutureFreeVoiceLinesSelection() {
  futureNumberOfFreeVoiceLines = parseInt(document.getElementById('futureNumberOfFreeVoiceLines').value) || 0;
  updateSummary('Future Free Voice', futureNumberOfFreeVoiceLines, true);
  navigateToNextCard('futureFreeVoiceLinesCard', true);
  displaySummaries();
}




function handleMISelection() {
  var totalMIAmount = 0;
  var numberOfLines = parseInt(document.getElementById('numberOfMILines').value) || 0;
  for (var i = 1; i <= numberOfLines; i++) {
    totalMIAmount += parseFloat(document.getElementById('miAmount' + i).value) || 0;
  }
  updateSummary('Current Total MI', '$' + totalMIAmount);
  navigateToNextCard('miLinesCard');
  displaySummaries();
}



function handleFeaturesSelection() {
  var featuresAmount = parseFloat(document.getElementById('totalFeaturesAmount').value || 0);
  updateSummary('Current Total Features', '$' + featuresAmount);
  navigateToNextCard('featuresCard');
  displaySummaries();
}



function handleEIPSelection() {
  var totalEIP = 0;
  var numberOfDevices = parseInt(document.getElementById('numberOfFinancedDevices').value) || 0;
  for (var i = 1; i <= numberOfDevices; i++) {
    totalEIP += parseFloat(document.getElementById('eipAmount' + i).value) || 0;
  }
  updateSummary('Current Total EIP', '$' + totalEIP);
  navigateToNextCard('eipCard');
  displaySummaries();
}



function handleTaxSelection() {
  var taxAmount = parseFloat(document.getElementById('totalTaxAmount').value) || 0;

  updateSummary('Current Total Tax', '$' + taxAmount);
  navigateToNextCard('taxCard');
  displaySummaries();
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
    input.placeholder = 'Price of Item ' + (i + 1);
    eipInputsContainer.appendChild(input);
  }
}


// Logic for calculating total lines cost
function calculateTotalLinesCost(isFuture = false) {
  var planDetailsToUse = isFuture ? futurePlanDetails : planDetails;
  if (!currentPlan || numberOfPaidVoiceLines === 0) return 0;

  var plan = planDetailsToUse[currentPlan];
  var totalCost;

  if (isFuture && currentPlan === "Magenta 9+" && numberOfPaidVoiceLines > 9) {
    totalCost = plan.baseCost + (numberOfPaidVoiceLines - 9) * plan.costPerLine;
  } else {
    if (numberOfPaidVoiceLines === 1) {
      totalCost = plan.baseCost[0];
    } else if (numberOfPaidVoiceLines === 2) {
      totalCost = plan.baseCost[1];
    } else {
      // For more than two lines
      totalCost = plan.baseCost[1] + (numberOfPaidVoiceLines - 2) * plan.additionalLineCost;
    }
  }

  return totalCost;
}





// Logic for calculating current bill
function calculateCurrentBill() {
  var planDetailsToUse = planDetails;
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

  // Ensure free lines don't reduce the total cost in current plan calculation
  totalMRC = Math.max(totalMRC, 0);

  // Update the totalMrcContainer directly
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  totalMrcContainer.style.display = 'block';
  totalMrcContainer.innerHTML = '<strong>Total Current MRC: $' + totalMRC + '</strong>';
}







// Logic for updating the summary
function updateSummary(category, value, isFuture = false) {
  var summaryContentId = isFuture ? 'futureSummaryContent' : 'summaryContent';
  var totalMrcContainerId = isFuture ? 'futureTotalMrcContainer' : 'totalMrcContainer';
  var summaryContent = document.getElementById(summaryContentId);
  var totalMrcContainer = document.getElementById(totalMrcContainerId);

  var existingEntry = summaryContent.querySelector('[data-category="' + category + '"]');
  var entryHtml;

  if (category === 'Total MRC') {
    totalMrcContainer.innerHTML = '<strong>' + category + ': ' + value + '</strong>';
    totalMrcContainer.style.display = 'block';
  } else {
    entryHtml = '<span data-category="' + category + '">' + category + ': ' + value + '</span>';
    if (existingEntry) {
      existingEntry.outerHTML = entryHtml;
    } else {
      summaryContent.innerHTML += entryHtml + '<br>';
    }
  }
}


function updateTotalVoiceLines() {
  var totalVoiceLines = numberOfPaidVoiceLines + numberOfFreeVoiceLines;
  updateSummary('Total Voice Lines', totalVoiceLines);
}


function updateTotalVoiceCost() {
  var calculatedCost = calculateTotalLinesCost();
  updateSummary('Current Total Voice', '$' + calculatedCost);
}


// Function to reset summary fields
function resetSummaryFields() {
  document.getElementById('summaryContent').innerHTML = '';
  document.getElementById('futureSummaryContent').innerHTML = '';
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  var futureTotalMrcContainer = document.getElementById('futureTotalMrcContainer');
  totalMrcContainer.style.display = 'none';
  futureTotalMrcContainer.style.display = 'none';
  totalMrcContainer.innerHTML = '';
  futureTotalMrcContainer.innerHTML = '';
}




// Function for going to the previous card
function showPrevious() {
  if (navigationStack.length > 0) {
    var previousCardId = navigationStack.pop(); // Get the last card from the stack
    showCard(previousCardId); // Show the previous card
  } else {
    // If the stack is empty, default to the first card of the respective workflow
    var isFuture = document.getElementById('futurePlanButton').classList.contains('active');
    showCard(isFuture ? 'futureRatePlanCard' : 'ratePlanCard');
  }
  // Display summaries
  document.getElementById('currentPlanSummary').style.display = 'block';
  document.getElementById('futurePlanSummary').style.display = 'block';
}


// Function for going to previous card in the future workflow
function showPreviousFuture() {
  if (navigationStack.length > 0) {
    var previousCardId = navigationStack.pop(); // Remove last card from stack
    showCard(previousCardId);
  } else {
    showCard('futureRatePlanCard'); // Default back to the start of future plan workflow
  }
}


// Function to start future plan comparison
function startFutureComparison() {
  // Reset current summary fields and navigation stack
  resetSummaryFields();
  navigationStack = [];

  // Populate future rate plan dropdown and show the first future card
  populateFutureRatePlanOptions();
  showCard('futureRatePlanCard');
}

function populateFutureRatePlanOptions() {
  var select = document.getElementById('futureRatePlan');
  select.innerHTML = ''; // Clear existing options
  for (var plan in futurePlanDetails) {
    var option = document.createElement('option');
    option.value = plan;
    option.text = plan;
    select.appendChild(option);
  }
}




// Function to handle future rate plan selection
function handleFutureRatePlanSelection() {
  futurePlan = document.getElementById('futureRatePlan').value;
  updateSummary('Future Plan', futurePlan, true);
  navigateToNextCard('futureRatePlanCard', true);
  displaySummaries();
}




// Handler for Future Paid Voice Lines Selection
function handleFuturePaidVoiceLinesSelection() {
  futureNumberOfPaidVoiceLines = parseInt(document.getElementById('futureNumberOfPaidVoiceLines').value) || 0;
  updateSummary('Future Paid Voice', futureNumberOfPaidVoiceLines, true);
  navigateToNextCard('futurePaidVoiceLinesCard', true);
  displaySummaries();
}

// Handler for Future Free Voice Lines Selection
function handleFutureFreeVoiceLinesSelection() {
  futureNumberOfFreeVoiceLines = parseInt(document.getElementById('futureNumberOfFreeVoiceLines').value) || 0;
  updateSummary('Future Free Voice', futureNumberOfFreeVoiceLines, true);
  navigateToNextCard('futureFreeVoiceLinesCard', true);
  displaySummaries();
}





// Function to handle MI selection in the future plan
function handleFutureMISelection() {
  var totalMIAmount = 0;
  var numberOfLines = parseInt(document.getElementById('futureNumberOfMILines').value) || 0;
  for (var i = 1; i <= numberOfLines; i++) {
    totalMIAmount += parseFloat(document.getElementById('futureMIAmount' + i).value) || 0;
  }
  updateSummary('Future Total MI', '$' + totalMIAmount, true); // true for future plan
  navigateToNextCard('futureMILinesCard', true); // true for future plan
  displaySummaries();
}



// Function to handle Features selection in the future plan
function handleFutureFeaturesSelection() {
  var featuresAmount = parseFloat(document.getElementById('futureTotalFeaturesAmount').value || 0);
  updateSummary('Future Total Features', '$' + featuresAmount, true); // true for future plan
  navigateToNextCard('futureFeaturesCard', true); // true for future plan
  displaySummaries();
}


// Function to handle EIP selection in the future plan
function handleFutureEIPSelection() {
  var totalEIP = 0;
  var numberOfDevices = parseInt(document.getElementById('futureNumberOfFinancedDevices').value) || 0;
  for (var i = 1; i <= numberOfDevices; i++) {
    totalEIP += parseFloat(document.getElementById('futureEIPAmount' + i).value) || 0;
  }
  updateSummary('Future Total EIP', '$' + totalEIP, true); // true for future plan
  navigateToNextCard('futureEIPCard', true); // true for future plan
  displaySummaries();
}



// Function to handle Tax selection in the future plan
function handleFutureTaxSelection() {
  var taxAmount = parseFloat(document.getElementById('futureTotalTaxAmount').value) || 0;
  updateSummary('Future Total Tax', '$' + taxAmount, true); // true for future plan
  navigateToNextCard('futureTaxCard', true); // true for future plan
  displaySummaries();
}





// Function to calculate the future bill
function calculateFutureBill() {
  futurePlan = document.getElementById('futureRatePlan').value;
  var plan = futurePlanDetails[futurePlan];
  var totalCost = 0;

  // Calculate the cost for voice lines in the future plan
  if (futurePlan === "Magenta 9+") {
    var totalLines = futureNumberOfPaidVoiceLines + futureNumberOfFreeVoiceLines;
    totalCost = plan.baseCost - (futureNumberOfFreeVoiceLines * 30);
    if (totalLines > 9) {
      totalCost += (totalLines - 9) * plan.costPerLine;
    }
    // Add the cost of additional paid voice lines
    totalCost += futureNumberOfPaidVoiceLines * 30;
  } else if (futureNumberOfPaidVoiceLines === 1) {
    totalCost = plan.baseCost[0];
  } else if (futureNumberOfPaidVoiceLines > 1) {
    totalCost = plan.baseCost[1] + (futureNumberOfPaidVoiceLines - 2) * plan.additionalLineCost;
  }

  // Calculate and add other costs (features, EIP, MI, and tax)
  var featuresAmount = parseFloat(document.getElementById('futureTotalFeaturesAmount').value || 0);
  var eipTotal = 0;
  var numberOfDevices = parseInt(document.getElementById('futureNumberOfFinancedDevices').value) || 0;
  for (var i = 1; i <= numberOfDevices; i++) {
    eipTotal += parseFloat(document.getElementById('futureEIPAmount' + i).value) || 0;
  }
  var miTotal = 0;
  var numberOfMILines = parseInt(document.getElementById('futureNumberOfMILines').value) || 0;
  for (var j = 1; j <= numberOfMILines; j++) {
    miTotal += parseFloat(document.getElementById('futureMIAmount' + j).value) || 0;
  }
  var taxAmount = parseFloat(document.getElementById('futureTotalTaxAmount').value) || 0;

  var totalMRC = totalCost + featuresAmount + eipTotal + miTotal + taxAmount;

  // Update the future total voice cost in the summary
  updateSummary('Future Total Voice', '$' + totalCost, true);

  // Update the future MRC in the summary
  var futureTotalMrcContainer = document.getElementById('futureTotalMrcContainer');
  futureTotalMrcContainer.innerHTML = '<strong>Total Future MRC: $' + totalMRC + '</strong>';
  futureTotalMrcContainer.style.display = 'block';
}











// Function to generate MI inputs for future plans
function generateFutureMIInputs() {
  var numberOfLines = parseInt(document.getElementById('futureNumberOfMILines').value) || 0;
  var miInputsContainer = document.getElementById('futureMIInputs');
  miInputsContainer.innerHTML = '';

  for (var i = 0; i < numberOfLines; i++) {
    var input = document.createElement('input');
    input.type = 'number';
    input.id = 'futureMIAmount' + (i + 1);
    input.placeholder = 'Price of MI Line ' + (i + 1);
    miInputsContainer.appendChild(input);
  }
}








// Function to generate EIP inputs for future plans
function generateFutureEIPInputs() {
  var numberOfDevices = parseInt(document.getElementById('futureNumberOfFinancedDevices').value) || 0;
  numberOfDevices = numberOfDevices > 20 ? 20 : numberOfDevices;
  var eipInputsContainer = document.getElementById('futureEIPInputs');
  eipInputsContainer.innerHTML = '';

  for (var i = 0; i < numberOfDevices; i++) {
    var input = document.createElement('input');
    input.type = 'number';
    input.id = 'futureEIPAmount' + (i + 1);
    input.placeholder = 'Price of Future Item ' + (i + 1);
    eipInputsContainer.appendChild(input);
  }
}







// Function to switch to the current plan workflow
function switchToCurrentPlan() {
  // Hide all future plan cards
  var futureCards = document.querySelectorAll('.future-card');
  futureCards.forEach(card => card.style.display = 'none');

  // Show the first card of the current plan workflow
  showCard('ratePlanCard');

  // Update button states
  document.getElementById('currentPlanButton').classList.add('active');
  document.getElementById('futurePlanButton').classList.remove('active');

  // Reset navigation stack for the current plan
  navigationStack = [];

  // Always display both summaries
  document.getElementById('currentPlanSummary').style.display = 'block';
  document.getElementById('futurePlanSummary').style.display = 'block';

  displaySummaries();
}






// Function to switch to the future plan workflow
function switchToFuturePlan() {
  // Hide all current plan cards
  var currentCards = document.querySelectorAll('.card:not(.future-card)');
  currentCards.forEach(card => card.style.display = 'none');

  // Show the first card of the future plan workflow
  showCard('futureRatePlanCard');

  // Update button states
  document.getElementById('currentPlanButton').classList.remove('active');
  document.getElementById('futurePlanButton').classList.add('active');

  // Reset navigation stack for the future plan
  navigationStack = [];

  // Always display both summaries
  document.getElementById('currentPlanSummary').style.display = 'block';
  document.getElementById('futurePlanSummary').style.display = 'block';

  displaySummaries();
}






// Function to start over - reset the application to its initial state
function startOver() {
  // Reset current plan values
  currentPlan = 'Magenta';
  numberOfPaidVoiceLines = 0;
  numberOfFreeVoiceLines = 0;

  // Reset future plan values
  futurePlan = 'Magenta Max';
  futureNumberOfPaidVoiceLines = 0;
  futureNumberOfFreeVoiceLines = 0;

  // Reset the dropdown selections
  document.getElementById('currentRatePlan').value = 'Magenta';
  document.getElementById('futureRatePlan').value = 'Magenta Max';

  // Clear and hide summary fields
  resetSummaryFields();

  // Clear navigation stack and switch to current plan view
  navigationStack = [];
  switchToCurrentPlan();

  // Update and display summaries with default values
  displaySummaries();

  // Manually update the total voice costs for both current and future plans
  updateTotalVoiceCost();
  updateTotalVoiceCost(true); // true for future plan

  // Update the future total voice cost after reset
  updateFutureTotalVoiceCost(); // Added this line to ensure the "Future Total Voice" summary appears after reset
}







function displaySummaries() {
  // Update and display the current plan summary
  updateSummary('Current Plan', currentPlan);
  updateSummary('Current Paid Voice', numberOfPaidVoiceLines);
  updateSummary('Current Free Voice', numberOfFreeVoiceLines);
  updateTotalVoiceCost(); // This function should calculate and update the total voice cost for the current plan

  // Update and display the future plan summary
  updateSummary('Future Plan', futurePlan, true);
  updateSummary('Future Paid Voice', futureNumberOfPaidVoiceLines, true); // Use futureNumberOfPaidVoiceLines
  updateSummary('Future Free Voice', futureNumberOfFreeVoiceLines, true); // Use futureNumberOfFreeVoiceLines
  updateTotalVoiceCost(true); // This function should calculate and update the total voice cost for the future plan

  // Make sure both summaries are visible
  document.getElementById('currentPlanSummary').style.display = 'block';
  document.getElementById('futurePlanSummary').style.display = 'block';
}






// Function to update the states of plan buttons
function updatePlanButtonStates() {
  document.getElementById('currentPlanButton').classList.add('active');
  document.getElementById('futurePlanButton').classList.remove('active');
  document.getElementById('futurePlanButton').classList.remove('future-active');
}





// Function to initialize summaries on startup
function initializeSummaries() {
  // Set summaries for current plan
  updateSummary('Current Plan', 'Magenta');
  updateSummary('Current Paid Voice', 0);
  updateSummary('Current Free Voice', 0);
  updateSummary('Current Total Voice', '$0');

  // Set summaries for future plan
  updateSummary('Future Plan', 'Magenta Max', true);
  updateSummary('Future Paid Voice', 0, true);
  updateSummary('Future Free Voice', 0, true);
  updateSummary('Future Total Voice', '$0', true);

  // Set default selection in dropdowns
  document.getElementById('currentRatePlan').value = 'Magenta';
  document.getElementById('futureRatePlan').value = 'Magenta Max';
}





// Function to calculate and display Total MRC
function calculateAndDisplayTotalMRC(isFuture = false) {
  var totalMRC = calculateTotalLinesCost(isFuture);
  var totalMrcContainerId = isFuture ? 'futureTotalMrcContainer' : 'totalMrcContainer';
  var totalMrcContainer = document.getElementById(totalMrcContainerId);
  totalMrcContainer.innerHTML = '<strong>Total ' + (isFuture ? 'Future' : 'Current') + ' MRC: $' + totalMRC + '</strong>';
  totalMrcContainer.style.display = 'block';
}



// Function to update the future MRC (Monthly Recurring Charge)
function updateFutureMRC() {
  // Base cost of the future plan
  let baseCost = futurePlanCosts[futurePlan];

  // Discount for each free line
  let freeLineDiscount = 30; // Assuming each free line has a $30 discount

  // Number of free lines in the future plan
  let numberOfFreeLines = futureNumberOfFreeVoiceLines;

  // Calculate the total discount for free lines
  let totalDiscount = numberOfFreeLines * freeLineDiscount;

  // Calculate the total future MRC after discounts
  let totalMRC = baseCost - totalDiscount;

  // Update the total future MRC display
  document.getElementById('futureMRC').innerText = formatCurrency(totalMRC);
}



function updateFutureTotalVoiceCost() {
  var calculatedCost = calculateTotalLinesCost(true); // true for future plan
  updateSummary('Future Total Voice', '$' + calculatedCost, true);
}
