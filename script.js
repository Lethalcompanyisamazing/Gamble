// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
  localStorage.setItem('upgradePrices', JSON.stringify(upgradePrices)); // Save the upgrade prices
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
  upgradePrices = JSON.parse(localStorage.getItem('upgradePrices')) || { slotMachine: 20, autoSpin: 10, luckUpgrade: 50 }; // Load upgrade prices
}

// Variables
let balance = 0;
let spinCount = 1;
let machines = [];
let upgradePrices = { slotMachine: 20, autoSpin: 10, luckUpgrade: 50 }; // Initial prices for upgrades

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');
const wipeSaveButton = document.getElementById('wipeSaveButton'); // Wipe save button

// Outcomes (emojis) and chances
const outcomes = [
  { emoji: '🍇', percentage: 0.15, chance: 20 }, // 20% chance
  { emoji: '🍒', percentage: 0.30, chance: 9 },  // 9% chance
  { emoji: '777', percentage: 0.55, chance: 1 }  // 1% chance
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
  return null;  // Return null for losing
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
    spinSlotMachine(resultDisplay);
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

// Function to spin a slot machine
function spinSlotMachine(resultDisplay) {
  const result = getRandomOutcome();
  if (result) {
    const winnings = balance * result.percentage;
    balance += winnings;
    resultDisplay.textContent = `${result.emoji} - You won $${winnings.toFixed(2)}!`;
  } else {
    resultDisplay.textContent = `You LOST!`;
  }
  updateBalanceDisplay();
  saveState();
}

// Auto-spin logic
function autoSpin(slotNumber) {
  setInterval(() => {
    const slotMachine = machines.find(machine => machine.spinNumber === slotNumber);
    if (slotMachine) {
      spinSlotMachine(slotMachine.resultDisplay);  // Spin the chosen machine
    }
  }, 5000);
}

// Buy a new slot machine (initial cost $20)
buySlotButton.addEventListener('click', () => {
  const slotPrice = upgradePrices.slotMachine;
  if (balance >= slotPrice) {
    balance -= slotPrice;
    spinCount += 1;
    createSlotMachine(spinCount);
    upgradePrices.slotMachine += 10;  // Increase the price
    updateButtonPrices();  // Update button prices
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy an auto-spin upgrade (initial cost $10)
buyAutoSpinButton.addEventListener('click', () => {
  const autoSpinPrice = upgradePrices.autoSpin;
  if (balance >= autoSpinPrice) {
    balance -= autoSpinPrice;
    const selectedSlotNumber = parseInt(machineSelect.value);
    autoSpin(selectedSlotNumber);
    upgradePrices.autoSpin += 5;  // Increase the price
    updateButtonPrices();  // Update button prices
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a luck upgrade (initial cost $50)
buyLuckUpgradeButton.addEventListener('click', () => {
  const luckUpgradePrice = upgradePrices.luckUpgrade;
  if (balance >= luckUpgradePrice) {
    balance -= luckUpgradePrice;
    upgradePrices.luckUpgrade += 25;  // Increase the price
    updateButtonPrices();  // Update button prices
    messageDisplay.textContent = "Luck upgrade purchased!";
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Update the button prices
function updateButtonPrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${upgradePrices.slotMachine})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${upgradePrices.autoSpin})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${upgradePrices.luckUpgrade})`;
}

// Wipe save data
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear();  // Wipe save data
  balance = 0;
  spinCount = 1;
  machines = [];
  slotMachinesContainer.innerHTML = '';  // Clear all slot machines from UI
  createSlotMachine(1);  // Create starter slot machine
  updateBalanceDisplay();
  saveState();
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
    createSlotMachine(1);  // Create a starter slot machine
    spinCount = 1;  // Reset spinCount after wipe
  } else {
    machines.forEach(machine => createSlotMachine(machine.spinNumber));  // Restore machines from saved state
  }
});
