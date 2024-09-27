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
let slotMachinePrices = { slot: 20, autoSpin: 10, luckUpgrade: 50 };

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');

// Outcomes (emojis) and chances
const outcomes = [
  { emoji: '🍇', percent: 0.15, chance: 20 },
  { emoji: '🍒', percent: 0.30, chance: 9 },
  { emoji: '777', percent: 0.55, chance: 1 }
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
  return null; // Lose case
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
    spinSlot(spinNumber, resultDisplay);
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

// Spin a slot machine
function spinSlot(spinNumber, resultDisplay) {
  const result = getRandomOutcome();
  if (result) {
    const winnings = balance * result.percent;
    balance += winnings;
    resultDisplay.textContent = `${result.emoji} - You won $${winnings.toFixed(2)}!`;
  } else {
    resultDisplay.textContent = `You LOST!`;
  }
  updateBalanceDisplay();
  saveState();
}

// Buy a new slot machine
buySlotButton.addEventListener('click', () => {
  if (balance >= slotMachinePrices.slot) {
    balance -= slotMachinePrices.slot;
    slotMachinePrices.slot += 10; // Increase price
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updatePrices();
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy an auto-spin upgrade
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= slotMachinePrices.autoSpin) {
    balance -= slotMachinePrices.autoSpin;
    slotMachinePrices.autoSpin += 5; // Increase price
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
    autoSpinSelectedMachine();
    updatePrices();
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a luck upgrade
buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= slotMachinePrices.luckUpgrade) {
    balance -= slotMachinePrices.luckUpgrade;
    slotMachinePrices.luckUpgrade += 15; // Increase price
    messageDisplay.textContent = "Luck upgrade purchased!";
    updatePrices();
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a luck upgrade!";
  }
});

// Update displayed balance
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Update prices on buttons
function updatePrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${slotMachinePrices.slot})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${slotMachinePrices.autoSpin})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${slotMachinePrices.luckUpgrade})`;
}

// Auto-spin function for the selected machine
function autoSpinSelectedMachine() {
  const selectedMachine = machineSelect.value;
  if (selectedMachine) {
    setInterval(() => {
      const machine = machines.find(m => m.spinNumber == selectedMachine);
      if (machine) {
        const resultDisplay = slotMachinesContainer.children[selectedMachine - 1].querySelector('p');
        spinSlot(selectedMachine, resultDisplay);
      }
    }, 5000); // Spin every 5 seconds
  }
}

// Initialize the game
function initialize() {
  loadState();
  updateBalanceDisplay();
  updatePrices();

  // Rebuild existing slot machines from saved state
  machines.forEach(machine => {
    createSlotMachine(machine.spinNumber);
  });
}

// Start the game
initialize();
