// Ensure a slot machine is always created at startup
let balance = parseFloat(localStorage.getItem('balance')) || 0;
let spinCount = parseInt(localStorage.getItem('spinCount')) || 1;  // Default to 1 so there's always at least one machine
let autoSpinCost = parseInt(localStorage.getItem('autoSpinCost')) || 10;
let luckMultiplier = parseFloat(localStorage.getItem('luckMultiplier')) || 1.0;

const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');
const backgroundMusic = document.getElementById('backgroundMusic');

let autoSpinInterval = null;

const reelSymbols = [
  { symbol: '🍒', payout: 10 },
  { symbol: '🍇', payout: 20 },
  { symbol: '7️⃣', payout: 100 },
  { symbol: '🍋', payout: 5 },
  { symbol: '🔔', payout: 50 }
];

backgroundMusic.play(); // Play the background music

// Ensure a slot machine is always created at startup
function createInitialSlotMachine() {
  if (!localStorage.getItem('spinCount')) {
    createSlotMachine(1);
    saveGameState();  // Save the initial state
  }
}

// Function to get random outcomes
function getRandomOutcome() {
  const totalChance = reelSymbols.length;
  const randomIndex = Math.floor(Math.random() * totalChance);
  return reelSymbols[randomIndex];
}

// Generate random emojis
function generateRandomEmojis(spinNumber) {
  const reel1 = getRandomOutcome();
  const reel2 = getRandomOutcome();
  const reel3 = getRandomOutcome();

  const resultDisplay = document.getElementById(`result_${spinNumber}`);
  
  resultDisplay.textContent = `${reel1.symbol} | ${reel2.symbol} | ${reel3.symbol}`;

  if (reel1.symbol === reel2.symbol && reel2.symbol === reel3.symbol) {
    const winnings = reel1.payout * luckMultiplier;
    balance += winnings;
    messageDisplay.textContent = `Machine ${spinNumber}: Jackpot! You won $${winnings}!`;
  } else {
    messageDisplay.textContent = `Machine ${spinNumber}: Try again!`;
  }

  updateBalanceDisplay();
  saveGameState();
}

// Create a new slot machine
function createSlotMachine(spinNumber) {
  const slotMachine = document.createElement('div');
  slotMachine.className = 'slotMachine';

  const resultDisplay = document.createElement('p');
  resultDisplay.id = `result_${spinNumber}`;
  resultDisplay.textContent = `Result for Machine ${spinNumber}: -`;

  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Machine ${spinNumber}`;
  spinButton.id = `spinMachineButton_${spinNumber}`;

  spinButton.addEventListener('click', () => {
    generateRandomEmojis(spinNumber);
  });

  slotMachine.appendChild(resultDisplay);
  slotMachine.appendChild(spinButton);

  slotMachinesContainer.appendChild(slotMachine);
  addMachineToSelect(spinNumber);
}

// Add machine to dropdown
function addMachineToSelect(spinNumber) {
  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Machine ${spinNumber}`;
  machineSelect.appendChild(option);
}

// Event listener for buying new slot machine
buySlotButton.addEventListener('click', () => {
  if (balance >= 20) {
    balance -= 20;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You created Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
    saveGameState();
  } else {
    messageDisplay.textContent = "Not enough money to create a slot machine!";
  }
});

// Auto-spin logic
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinCost) {
    balance -= autoSpinCost;
    autoSpinCost += 10;
    messageDisplay.textContent = `Auto-spin purchased for $${autoSpinCost - 10}. New cost: $${autoSpinCost}`;
    updateBalanceDisplay();
    saveGameState();

    if (autoSpinInterval) clearInterval(autoSpinInterval);

    const selectedMachine = machineSelect.value;

    autoSpinInterval = setInterval(() => {
      generateRandomEmojis(selectedMachine);
    }, 1000); // Faster auto-spin interval
  } else {
    messageDisplay.textContent = "Not enough money for Auto-Spin!";
  }
});

// Luck upgrade logic
buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= 50) {
    balance -= 50;
    luckMultiplier += 0.1;
    messageDisplay.textContent = "Your luck has increased!";
    updateBalanceDisplay();
    saveGameState();
  } else {
    messageDisplay.textContent = "Not enough money to get luckier!";
  }
});

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Update button texts
function updateButtonTexts() {
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinCost})`;
}

// Save game state to localStorage
function saveGameState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('autoSpinCost', autoSpinCost);
  localStorage.setItem('luckMultiplier', luckMultiplier);
}

// Load game state from localStorage
function loadGameState() {
  for (let i = 1; i <= spinCount; i++) {
    createSlotMachine(i);
  }
}

// Ensure the game starts with a slot machine and saved state
createInitialSlotMachine();
loadGameState();
updateBalanceDisplay();
updateButtonTexts();
