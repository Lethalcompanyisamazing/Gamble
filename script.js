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
const machineSelect = document.getElementById('machineSelect');
const wipeSaveButton = document.getElementById('wipeSaveButton');

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

// Calculate winnings based on balance
function calculateWinnings(outcome) {
  if (balance === 0) {
    switch (outcome.emoji) {
      case '🍇':
        return 10;  // Set base for grapes
      case '🍒':
        return 50;  // Set base for cherries
      case '777':
        return 100;  // Set base for 777
      default:
        return 0;
    }
  } else {
    // Return percentage-based winnings if balance is above zero
    switch (outcome.emoji) {
      case '🍇':
        return balance * 0.10;  // 10% for grapes
      case '🍒':
        return balance * 0.35;  // 35% for cherries
      case '777':
        return balance * 0.65;  // 65% for 777
      default:
        return 0;
    }
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
    const winnings = calculateWinnings(result);
    balance += winnings;
    resultDisplay.textContent = winnings > 0 ? `${result.emoji} - You won $${winnings.toFixed(2)}!` : `You LOST!`;
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
  const slotCost = getPrice('slot');
  if (balance >= slotCost) {
    balance -= slotCost;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy an auto-spin upgrade (costs $10)
buyAutoSpinButton.addEventListener('click', () => {
  const autoSpinCost = getPrice('autoSpin');
  if (balance >= autoSpinCost) {
    balance -= autoSpinCost;
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a luck upgrade (costs $50)
buyLuckUpgradeButton.addEventListener('click', () => {
  const luckUpgradeCost = getPrice('luckUpgrade');
  if (balance >= luckUpgradeCost) {
    balance -= luckUpgradeCost;
    messageDisplay.textContent = "Luck upgrade purchased!";
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Update the balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Update prices on the buttons
function updatePrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${getPrice('slot').toFixed(2)})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${getPrice('autoSpin').toFixed(2)})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${getPrice('luckUpgrade').toFixed(2)})`;
}

// Get price based on the current count of machines or upgrades
function getPrice(type) {
  let basePrice;
  switch (type) {
    case 'slot':
      basePrice = 20;
      return basePrice + machines.length * 10; // Slot price increases by $10 per machine
    case 'autoSpin':
      basePrice = 10;
      return basePrice + machines.length * 5; // Auto-spin price increases by $5 per machine
    case 'luckUpgrade':
      basePrice = 50;
      return basePrice + machines.length * 15; // Luck upgrade price increases by $15 per machine
    default:
      return 0;
  }
}

// Wipe save and reset everything, no machine on reload
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear();  // Clears all saved data
  balance = 0;
  spinCount = 1;
  machines = [];
  slotMachinesContainer.innerHTML = '';  // Clears the display
  machineSelect.innerHTML = '';  // Resets dropdown
  messageDisplay.textContent = "Save wiped! You need to buy a new slot machine!";
  updateBalanceDisplay();
  updatePrices();
});

// Ensure the first slot machine is created when the page loads
window.addEventListener('load', () => {
  loadState();  // Load saved state if available
  updateBalanceDisplay();
  updatePrices();
  if (machines.length > 0) {
    machines.forEach(machine => createSlotMachine(machine.spinNumber));  // Restore machines from saved state
  }
});
