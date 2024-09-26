// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
  localStorage.setItem('autoSpinPrice', autoSpinPrice);
  localStorage.setItem('speedUpgradePrice', speedUpgradePrice);
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
  autoSpinPrice = parseInt(localStorage.getItem('autoSpinPrice')) || 10;
  speedUpgradePrice = parseInt(localStorage.getItem('speedUpgradePrice')) || 15;
}

// Variables
let balance = 0;
let spinCount = 1;
let machines = [];
let autoSpinPrice = 10;
let speedUpgradePrice = 15;

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buySpeedUpgradeButton = document.getElementById('buySpeedUpgradeButton');
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

// Function to update the machine spin interval speed
function updateMachineSpeed(machine, speedMultiplier) {
  clearInterval(machine.autoSpinInterval); // Clear previous interval

  machine.autoSpinInterval = setInterval(() => {
    const result = getRandomOutcome();
    const winnings = result.fixed;
    machine.balance += winnings;
    machine.resultDisplay.textContent = `${result.emoji} - You won $${winnings}!`;
    balance += winnings;
    updateBalanceDisplay();
    saveState();
  }, machine.autoSpinSpeed / speedMultiplier);
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

  // Save machine info
  machines.push({ 
    spinNumber, 
    resultDisplay, 
    balance: 0, 
    autoSpinSpeed: 2000,  // Default speed for auto-spin
    autoSpinInterval: null
  });

  // Add the slot machine to the select dropdown for auto-spin
  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Slot ${spinNumber}`;
  machineSelect.appendChild(option);
}

// Buy a new slot machine (costs $20)
buySlotButton.addEventListener('click', () => {
  const price = 20;
  if (balance >= price) {
    balance -= price;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy an auto-spin upgrade (price increases with each purchase)
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinPrice) {
    balance -= autoSpinPrice;
    const selectedMachine = machines[machineSelect.value - 1];
    if (selectedMachine) {
      clearInterval(selectedMachine.autoSpinInterval); // Stop previous auto-spin if any
      selectedMachine.autoSpinInterval = setInterval(() => {
        const result = getRandomOutcome();
        const winnings = result.fixed;
        selectedMachine.balance += winnings;
        selectedMachine.resultDisplay.textContent = `${result.emoji} - You won $${winnings}!`;
        balance += winnings;
        updateBalanceDisplay();
        saveState();
      }, selectedMachine.autoSpinSpeed);
      messageDisplay.textContent = "Auto-spin activated!";
    }
    autoSpinPrice += 5; // Increase the price for the next purchase
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a speed upgrade for auto-spin (price increases with each purchase)
buySpeedUpgradeButton.addEventListener('click', () => {
  if (balance >= speedUpgradePrice) {
    balance -= speedUpgradePrice;
    const selectedMachine = machines[machineSelect.value - 1];
    if (selectedMachine && selectedMachine.autoSpinInterval) {
      updateMachineSpeed(selectedMachine, 2); // Double the speed of auto-spin
      messageDisplay.textContent = "Auto-spin speed increased!";
    }
    speedUpgradePrice += 10; // Increase the price for the next purchase
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy speed upgrade!";
  }
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
