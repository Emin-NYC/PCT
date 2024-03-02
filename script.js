document.addEventListener('DOMContentLoaded', function() {
  populateRatePlanOptions();
  showCard('ratePlanCard');
});


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

var currentPlan = '';
var numberOfPaidVoiceLines = 0;
var numberOfFreeVoiceLines = 0;

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

function showCard(cardId) {
  var cards = document.getElementsByClassName('card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].style.display = 'none';
  }
  document.getElementById(cardId).style.display = 'block';
}

function handleRatePlanSelection() {
  currentPlan = document.getElementById('currentRatePlan').value;
  resetSummaryFields();
  updateSummary('Current Plan', currentPlan);
  showCard('paidVoiceLinesCard');
}

function handlePaidVoiceLinesSelection() {
  numberOfPaidVoiceLines = parseInt(document.getElementById('numberOfPaidVoiceLines').value) || 0;
  updateSummary('Paid Voice Lines', numberOfPaidVoiceLines);
  showCard('freeVoiceLinesCard');
}


function handleFreeVoiceLinesSelection() {
  numberOfFreeVoiceLines = parseInt(document.getElementById('numberOfFreeVoiceLines').value) || 0;
  updateSummary('Free Voice Lines', numberOfFreeVoiceLines);

  var calculatedCost = calculateTotalLinesCost();
  updateSummary('Total Voice Lines Cost', '$' + calculatedCost);

  showCard('miLinesCard');
}



function handleFeaturesSelection() {
  var featuresAmount = parseFloat(document.getElementById('totalFeaturesAmount').value || 0);
  updateSummary('Total Features', '$' + featuresAmount);
  showCard('eipCard');
}

function handleEIPSelection() {
  var totalEIP = 0;
  var numberOfDevices = parseInt(document.getElementById('numberOfFinancedDevices').value || 0);

  for (var i = 1; i <= numberOfDevices; i++) {
    var deviceAmount = parseFloat(document.getElementById('eipAmount' + i).value || 0);
    totalEIP += deviceAmount;
  }

  updateSummary('Total EIP', '$' + totalEIP);
  showCard('taxCard'); // Proceed to final summary card
}

function handleTaxSelection() {
  var taxAmount = parseFloat(document.getElementById('totalTaxAmount').value) || 0;

  updateSummary('Total Tax', '$' + taxAmount);
  showCard('finalCardSummary');
}



function generateMIInputs() {
  var numberOfLines = parseInt(document.getElementById('numberOfMILines').value) || 0;
  var miInputsContainer = document.getElementById('miInputs');
  miInputsContainer.innerHTML = '';

  miInputsContainer.innerHTML = '<h3>MI Lines: ' + numberOfLines + '</h3>';

  for (var i = 0; i < numberOfLines; i++) {
    var input = document.createElement('input');
    input.type = 'number';
    input.id = 'miAmount' + (i + 1);
    input.placeholder = 'Amount for MI line ' + (i + 1);
    miInputsContainer.appendChild(input);
  }
}

function handleMISelection() {
  var totalMIAmount = 0;
  var numberOfLines = parseInt(document.getElementById('numberOfMILines').value) || 0;
  for (var i = 1; i <= numberOfLines; i++) {
    totalMIAmount += parseFloat(document.getElementById('miAmount' + i).value) || 0;
  }
  updateSummary('Total MI', '$' + totalMIAmount);
  showCard('featuresCard');
}

// Modify calculateCurrentBill function to include MI total


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
    input.placeholder = 'Dollar amount for item ' + (i + 1);
    eipInputsContainer.appendChild(input);
  }
}




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



function updateTotalMRC(totalMRC) {
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  totalMrcContainer.innerHTML = '<strong>Total MRC: $' + totalMRC + '</strong>';
}




function resetSummaryFields() {
  document.getElementById('summaryContent').innerHTML = '';
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  totalMrcContainer.style.display = 'none';
  totalMrcContainer.innerHTML = '';
}



function showPrevious(previousCardId) {
  showCard(previousCardId);
}

function startOver() {
  currentPlan = '';
  numberOfPaidVoiceLines = 0;
  numberOfFreeVoiceLines = 0;

  document.getElementById('summaryContent').innerHTML = '';

  showCard('ratePlanCard');

  // Hide the totalMrcContainer
  var totalMrcContainer = document.getElementById('totalMrcContainer');
  totalMrcContainer.style.display = 'none';
  totalMrcContainer.innerHTML = '';
}
