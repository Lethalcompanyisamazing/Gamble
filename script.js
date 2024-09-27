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
let autoSpinPrices = { slot: 20, auto: 10, luck: 50 };

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');
const wipeSaveButton = document.getElementById('wipeSaveButton');

// Outcomes and chances
const outcomes = [
  { emoji: '🍇', fixed: 10, percentage: 10, chance: 20 },  // 10% or $10
  { emoji: '🍒', fixed: 50, percentage: 35, chance: 9 },   // 35% or $50
  { emoji: '777', fixed: 100, percentage: 65, chance: 1 }, // 65% or $100
  { emoji: '❌', fixed: 0, percentage: 0, chance: 70 }     // Loss
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
  return outcomes[0]; // Default case
}

// Handle the spin logic
function handleSpin(resultDisplay, slotNumber) {
  const result = getRandomOutcome();
  let winnings = 0;

  if (result.emoji === '❌') {
    resultDisplay.textContent = `Slot ${slotNumber}: You LOST!`;
  } else {
    if (balance === 0) {
      winnings = result.fixed; // Fixed amount if balance is zero
    } else {
      winnings = balance * (result.percentage / 100); // Percent of balance
    }
    balance += winnings;
    resultDisplay.textContent = `${result.emoji} - You won $${winnings.toFixed(2)}!`;
  }

  updateBalanceDisplay();
  saveState();
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
    handleSpin(resultDisplay, spinNumber);
  });
  
  slotMachineDiv.appendChild(spinButton);
  slotMachinesContainer.appendChild(slotMachineDiv);

  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Slot ${spinNumber}`;
  machineSelect.appendChild(option);

  machines.push({ spinNumber, winnings: 0 });
}

// Buy new slot machine
buySlotButton.addEventListener('click', () => {
  if (balance >= autoSpinPrices.slot) {
    balance -= autoSpinPrices.slot;
    spinCount += 1;
    autoSpinPrices.slot += 5; // Increase price
    createSlotMachine(spinCount);
    updatePrices();
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Wipe save and reset everything
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear();
  balance = 0;
  spinCount = 1;
  machines = [];
  slotMachinesContainer.innerHTML = '';
  machineSelect.innerHTML = '';
  messageDisplay.textContent = "Save wiped! You need to buy a new slot machine!";
  updateBalanceDisplay();
  updatePrices();
});

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Update prices displayed on buttons
function updatePrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${autoSpinPrices.slot})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinPrices.auto})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${autoSpinPrices.luck})`;
}

// Ensure the first slot machine is created when the page loads if not wiped
window.addEventListener('load', () => {
  loadState();
  updateBalanceDisplay();
  updatePrices();

  if (machines.length === 0 && balance > 0) {
    createSlotMachine(spinCount);
  }
});
