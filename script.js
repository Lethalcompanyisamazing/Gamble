// Variables for base prices and starting luck
const baseSlotPrice = 20.00;
const baseAutoSpinPrice = 10.00;
const baseLuckUpgradePrice = 50.00;
let startingLuck = 1; // Starting luck value

// Variables for tracking current prices and upgrades
let slotPrice = baseSlotPrice;
let autoSpinPrice = baseAutoSpinPrice;
let luckUpgradePrice = baseLuckUpgradePrice;

// Function to update prices on buttons
function updatePrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${slotPrice.toFixed(2)})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinPrice.toFixed(2)})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${luckUpgradePrice.toFixed(2)})`;
}

// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
  localStorage.setItem('luck', luck);
  localStorage.setItem('slotPrice', slotPrice);
  localStorage.setItem('autoSpinPrice', autoSpinPrice);
  localStorage.setItem('luckUpgradePrice', luckUpgradePrice);
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
  luck = parseFloat(localStorage.getItem('luck')) || startingLuck;
  slotPrice = parseFloat(localStorage.getItem('slotPrice')) || baseSlotPrice;
  autoSpinPrice = parseFloat(localStorage.getItem('autoSpinPrice')) || baseAutoSpinPrice;
  luckUpgradePrice = parseFloat(localStorage.getItem('luckUpgradePrice')) || baseLuckUpgradePrice;
  updatePrices();
}

// Variables for game logic
let balance = 0;
let spinCount = 1;
let machines = [];
let luck = startingLuck;

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');
const wipeSaveButton = document.getElementById('wipeSaveButton');

// Outcomes and chances for winnings
const outcomes = [
  { emoji: '🍇', chance: 15, multiplier: 0.1, fixed: 10 }, // 15% of balance or $10 if balance is 0
  { emoji: '🍒', chance: 9, multiplier: 0.35, fixed: 50 }, // 35% of balance or $50 if balance is 0
  { emoji: '777', chance: 1, multiplier: 0.65, fixed: 100 } // 65% of balance or $100 if balance is 0
];

// Function to generate a random outcome
function getRandomOutcome() {
  const totalChance = outcomes.reduce((sum, outcome) => sum + outcome.chance, 100); // Adds a 75% chance to lose
  let random = Math.random() * totalChance;
  
  for (let outcome of outcomes) {
    if (random < outcome.chance) {
      return outcome;
    }
    random -= outcome.chance;
  }
  return { emoji: '', fixed: 0, multiplier: 0, loss: true };  // Lose condition
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
    if (result.loss) {
      resultDisplay.textContent = `You LOST!`;
    } else {
      let winnings = balance === 0 ? result.fixed : result.multiplier * balance;
      balance += winnings;
      resultDisplay.textContent = `${result.emoji} - You won $${winnings.toFixed(2)}!`;
    }
    updateBalanceDisplay();
    saveState();
  });

  slotMachineDiv.appendChild(spinButton);
  slotMachinesContainer.appendChild(slotMachineDiv);

  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Slot ${spinNumber}`;
  machineSelect.appendChild(option);

  machines.push({ spinNumber, winnings: 0 });
}

// Auto-spin logic
setInterval(() => {
  const selectedMachine = machineSelect.value;
  if (selectedMachine) {
    const machineDiv = document.querySelector(`.slotMachine:nth-child(${selectedMachine}) button`);
    if (machineDiv) {
      machineDiv.click();  // Simulates a spin click
    }
  }
}, 5000);  // Spins every 5 seconds

// Buy a slot machine
buySlotButton.addEventListener('click', () => {
  if (balance >= slotPrice) {
    balance -= slotPrice;
    spinCount += 1;
    slotPrice *= 1.25; // Increase price
    createSlotMachine(spinCount);
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy auto-spin upgrade
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinPrice) {
    balance -= autoSpinPrice;
    autoSpinPrice *= 1.25; // Increase price
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy luck upgrade
buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= luckUpgradePrice) {
    balance -= luckUpgradePrice;
    luckUpgradePrice *= 1.25; // Increase price
    messageDisplay.textContent = "Luck upgrade purchased!";
    luck += 0.05; // Increase luck slightly
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Wipe save data and reset to default
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear();  // Clears saved data
  balance = 0;
  spinCount = 1;
  luck = startingLuck;  // Reset luck
  machines = [];
  slotMachinesContainer.innerHTML = '';  // Clears display
  machineSelect.innerHTML = '';  // Resets dropdown
  messageDisplay.textContent = "Save wiped! You got a new starter slot machine!";

  slotPrice = baseSlotPrice;
  autoSpinPrice = baseAutoSpinPrice;
  luckUpgradePrice = baseLuckUpgradePrice;
  
  updatePrices();
  createSlotMachine(spinCount);  // Give a starter slot machine
  updateBalanceDisplay();
  saveState();
});

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Ensure a starter slot machine is created when the page loads
window.addEventListener('load', () => {
  loadState();  // Load saved state if available
  updateBalanceDisplay();
  if (machines.length === 0) {
    createSlotMachine(spinCount);  // Create initial slot machine if none exist
  } else {
    machines.forEach(machine => createSlotMachine(machine.spinNumber));  // Restore machines from saved state
  }
});
