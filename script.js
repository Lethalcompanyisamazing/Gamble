// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
  localStorage.setItem('slotPrice', slotPrice);
  localStorage.setItem('autoSpinPrice', autoSpinPrice);
  localStorage.setItem('luckUpgradePrice', luckUpgradePrice);
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
  slotPrice = parseInt(localStorage.getItem('slotPrice')) || 20;
  autoSpinPrice = parseInt(localStorage.getItem('autoSpinPrice')) || 10;
  luckUpgradePrice = parseInt(localStorage.getItem('luckUpgradePrice')) || 50;
}

// Variables
let balance = 0;
let spinCount = 1;
let machines = [];
let slotPrice = 20;      // Initial price for buying a slot machine
let autoSpinPrice = 10;  // Initial price for auto-spin upgrade
let luckUpgradePrice = 50; // Initial price for luck upgrade

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const wipeSaveButton = document.getElementById('wipeSaveButton');
const machineSelect = document.getElementById('machineSelect');

// Outcomes (emojis) and their percentage winnings
const outcomes = [
  { emoji: '🍇', percent: 15, chance: 20 }, // 20% chance to win 15% of balance
  { emoji: '🍒', percent: 30, chance: 9 },  // 9% chance to win 30% of balance
  { emoji: '777', percent: 55, chance: 1 }  // 1% chance to win 55% of balance
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

// Function to determine if the player loses on the slot machine
function chanceToLose() {
  return Math.random() < 0.7; // 70% chance to lose
}

// Create a slot machine
function createSlotMachine(spinNumber, autoSpin = false) {
  const slotMachineDiv = document.createElement('div');
  slotMachineDiv.classList.add('slotMachine');

  const resultDisplay = document.createElement('p');
  resultDisplay.textContent = `Slot ${spinNumber}: -`;
  slotMachineDiv.appendChild(resultDisplay);

  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Slot ${spinNumber}`;
  spinButton.addEventListener('click', () => spinSlotMachine(resultDisplay));

  if (autoSpin) {
    setInterval(() => spinSlotMachine(resultDisplay), 2000); // Auto-spin every 2 seconds
  }
  
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

function spinSlotMachine(resultDisplay) {
  if (chanceToLose()) {
    resultDisplay.textContent = `You LOST!`; // Show losing message
    saveState(); // Save the state even if the player loses
    return;
  }

  const result = getRandomOutcome();
  const winnings = (balance * (result.percent / 100)).toFixed(2); // Calculate percentage of current balance
  balance += parseFloat(winnings); // Add the calculated winnings to the balance
  resultDisplay.textContent = `${result.emoji} - You won $${winnings}!`;
  updateBalanceDisplay();
  saveState();
}

// Buy a new slot machine
buySlotButton.addEventListener('click', () => {
  if (balance >= slotPrice) {
    balance -= slotPrice;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    slotPrice += 10; // Increase price for the next slot machine
    updateBalanceDisplay();
    updateButtonPrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy an auto-spin upgrade
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinPrice) {
    balance -= autoSpinPrice;
    const selectedSlot = parseInt(machineSelect.value);
    const machine = machines.find(m => m.spinNumber === selectedSlot);
    createSlotMachine(selectedSlot, true); // Create auto-spin for selected slot machine
    messageDisplay.textContent = `Auto-spin upgrade purchased for Slot ${selectedSlot}!`;
    autoSpinPrice += 5; // Increase price for the next auto-spin upgrade
    updateBalanceDisplay();
    updateButtonPrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a luck upgrade
buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= luckUpgradePrice) {
    balance -= luckUpgradePrice;
    messageDisplay.textContent = "Luck upgrade purchased!";
    luckUpgradePrice += 20; // Increase price for the next luck upgrade
    updateBalanceDisplay();
    updateButtonPrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Wipe save state button
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear(); // Clear all local storage
  balance = 0;          // Reset balance
  spinCount = 1;        // Reset spin count
  machines = [];        // Clear machines array
  slotPrice = 20;       // Reset slot machine price
  autoSpinPrice = 10;   // Reset auto-spin price
  luckUpgradePrice = 50; // Reset luck upgrade price
  updateBalanceDisplay(); // Update the displayed balance

  // Clear the slot machines from the UI
  slotMachinesContainer.innerHTML = ''; 
  machineSelect.innerHTML = ''; // Clear the machine select dropdown

  // Create a beginner slot machine
  createSlotMachine(spinCount); // This gives the player a starter machine

  messageDisplay.textContent = "Game state wiped! You have a beginner slot machine."; // Display a message
  updateButtonPrices();
});

// Update the balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Update the prices on the buttons
function updateButtonPrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${slotPrice})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinPrice})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${luckUpgradePrice})`;
}

// Ensure the first slot machine is created when the page loads
window.addEventListener('load', () => {
  loadState();  // Load saved state if available
  updateBalanceDisplay();
  updateButtonPrices(); // Update button prices on load
  if (machines.length === 0) {
    createSlotMachine(spinCount);  // Create the initial slot machine if none exist
  } else {
    machines.forEach(machine => createSlotMachine(machine.spinNumber));  // Restore machines from saved state
  }
});
