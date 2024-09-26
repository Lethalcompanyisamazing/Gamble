// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
}

// Variables
let balance = 0;
let spinCount = 1;
let machines = [];

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const wipeSaveButton = document.getElementById('wipeSaveButton');
const machineSelect = document.getElementById('machineSelect');

// Outcomes (emojis) and chances
const outcomes = [
  { emoji: '🍇', fixed: 10, chance: 20 }, // 20% chance
  { emoji: '🍒', fixed: 50, chance: 9 },  // 9% chance
  { emoji: '777', fixed: 100, chance: 1 } // 1% chance
];

// Function to pick a random outcome based on chance
function getRandomOutcome() {
  const totalChance = outcomes.reduce((sum, outcome) => sum + outcome.chance, 0);
  let random = Math.random() * totalChance;
  
  for (let outcome of outcomes) {
    if (random < outcome.chance) {
      return outcome;
    }
    random -= outcome.chance;
  }
}

// Create a slot machine
function createSlotMachine(spinNumber) {
  const slotMachineDiv = document.createElement('div');
  slotMachineDiv.classList.add('slotMachine');

  const resultDisplay = document.createElement('p');
  resultDisplay.textContent = `Slot ${spinNumber}: -`;
  slotMachineDiv.appendChild(resultDisplay);

  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Slot ${spinNumber}`;
  spinButton.addEventListener('click', () => {
    const result = getRandomOutcome();
    const winnings = result.fixed;
    balance += winnings;
    resultDisplay.textContent = `${result.emoji} - You won $${winnings}!`;
    updateBalanceDisplay();
    saveState();
  });
  
  slotMachineDiv.appendChild(spinButton);
  slotMachinesContainer.appendChild(slotMachineDiv);

  // Add the slot machine to the select dropdown for auto-spin
  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Slot ${spinNumber}`;
  machineSelect.appendChild(option);

  // Save machine info
  machines.push({ spinNumber, winnings: 0 });
}

// Buy a new slot machine (costs $20)
buySlotButton.addEventListener('click', () => {
  if (balance >= 20) {
    balance -= 20;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy an auto-spin upgrade (costs $10)
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= 10) {
    balance -= 10;
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a luck upgrade (costs $50)
buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= 50) {
    balance -= 50;
    messageDisplay.textContent = "Luck upgrade purchased!";
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Wipe save state button
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear(); // Clear all local storage
  balance = 0;          // Reset balance
  spinCount = 1;       // Reset spin count
  machines = [];       // Clear machines array
  updateBalanceDisplay(); // Update the displayed balance

  // Clear the slot machines from the UI
  slotMachinesContainer.innerHTML = ''; 
  machineSelect.innerHTML = ''; // Clear the machine select dropdown

  // Create a beginner slot machine
  createSlotMachine(spinCount);
  
  messageDisplay.textContent = "Game state wiped! You have a beginner slot machine."; // Display a message
});

// Update the balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Ensure the first slot machine is created when the page loads
window.addEventListener('load', () => {
  loadState();  // Load saved state if available
  updateBalanceDisplay();
  if (machines.length === 0) {
    createSlotMachine(spinCount);  // Create the initial slot machine if none exist
  } else {
    machines.forEach(machine => createSlotMachine(machine.spinNumber));  // Restore machines from saved state
  }
});
