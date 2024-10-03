// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
  localStorage.setItem('prices', JSON.stringify({ slotPrice, autoSpinPrice, luckUpgradePrice }));
  localStorage.setItem('luck', luck);
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
  const prices = JSON.parse(localStorage.getItem('prices')) || { slotPrice: 20, autoSpinPrice: 10, luckUpgradePrice: 50 };
  slotPrice = prices.slotPrice;
  autoSpinPrice = prices.autoSpinPrice;
  luckUpgradePrice = prices.luckUpgradePrice;
  luck = parseFloat(localStorage.getItem('luck')) || 0;
}

// Variables
let balance = 0;
let spinCount = 1;
let machines = [];
let luck = 0;
let slotPrice = 20.00;
let autoSpinPrice = 10.00;
let luckUpgradePrice = 50.00;

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');

// Background Music Elements
const music = document.getElementById('backgroundMusic');
document.getElementById('playMusic').addEventListener('click', () => music.play());
document.getElementById('pauseMusic').addEventListener('click', () => music.pause());

// Function to pick a random outcome based on chance
function getRandomOutcome() {
  const random = Math.random();
  if (random < 0.6) { // 60% chance to lose
    return { emoji: '❌', winnings: 0 };
  } else if (random < 0.85) { // 25% chance to win grape
    return { emoji: '🍇', winnings: balance === 0 ? 10 : balance * 0.10 };
  } else if (random < 0.98) { // 13% chance to win cherry
    return { emoji: '🍒', winnings: balance === 0 ? 50 : balance * 0.35 };
  } else { // 2% chance to win 777
    return { emoji: '777', winnings: balance === 0 ? 10 : balance * 0.65 };
  }
}

// Function to create a slot machine
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
    balance += result.winnings;
    resultDisplay.textContent = `${result.emoji} - ${result.winnings > 0 ? `You won $${result.winnings.toFixed(2)}!` : 'You LOST!'}`;
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

  machines.push({ spinNumber });
  saveState();
}

// Update the balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
  buySlotButton.textContent = `Buy Slot Machine ($${slotPrice.toFixed(2)})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinPrice.toFixed(2)})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${luckUpgradePrice.toFixed(2)})`;
}

// Buy a new slot machine (costs $20+)
buySlotButton.addEventListener('click', () => {
  if (balance >= slotPrice) {
    balance -= slotPrice;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    slotPrice += 5; // Increase price for each machine
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy an auto-spin upgrade (costs $10+)
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinPrice) {
    balance -= autoSpinPrice;
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
    autoSpinPrice += 2.5; // Increase price for auto-spin upgrade
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a luck upgrade (costs $50+)
buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= luckUpgradePrice) {
    balance -= luckUpgradePrice;
    luck += 0.05; // Increase luck
    luckUpgradePrice += 10; // Increase price for luck upgrade
    messageDisplay.textContent = "Luck upgrade purchased!";
    updateBalanceDisplay();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Wipe save state
function wipeSave() {
  localStorage.clear();
  balance = 0;
  spinCount = 1;
  machines = [];
  slotPrice = 20.00;
  autoSpinPrice = 10.00;
  luckUpgradePrice = 50.00;
  luck = 0;
  slotMachinesContainer.innerHTML = '';
  machineSelect.innerHTML = '';
  messageDisplay.textContent = "Save wiped. Starting fresh!";
  createSlotMachine(spinCount); // Give a starter slot machine
  updateBalanceDisplay();
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
