let balance = 0;
let spinCount = 1;

const balanceDisplay = document.getElementById('balance');
const spinButtonContainer = document.getElementById('spinButtonContainer');
const resultContainer = document.getElementById('resultContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');
const backgroundMusic = document.getElementById('backgroundMusic');

let autoSpinCost = 10;
let autoSpinInterval = null;
let luckMultiplier = 1.0;

// Slot machine outcomes with updated win percentages
let outcomes = [
  { name: 'Lose', percent: 0, fixed: 0, chance: 85 }, // High chance of losing initially
  { name: 'Grape', percent: 10, fixed: 10, chance: 10 },
  { name: 'Cherry', percent: 20, fixed: 50, chance: 4 },
  { name: '777', percent: 50, fixed: 100, chance: 1 }
];

// Play background music when the page loads
backgroundMusic.play();

// Function to pick a random outcome based on luck
function getRandomOutcome() {
  const totalChance = outcomes.reduce((sum, outcome) => sum + outcome.chance * luckMultiplier, 0);
  let random = Math.random() * totalChance;

  for (let outcome of outcomes) {
    if (random < outcome.chance * luckMultiplier) {
      return outcome;
    }
    random -= outcome.chance * luckMultiplier;
  }
}

// Function to create a spin button and result display for each slot machine
function createSpinButton(spinNumber) {
  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Machine ${spinNumber}`;
  spinButton.style.margin = '10px';

  const resultDisplay = document.createElement('p');
  resultDisplay.id = `result${spinNumber}`;
  resultDisplay.textContent = `Result for Machine ${spinNumber}: -`;

  spinButton.addEventListener('click', () => spinMachine(spinNumber, resultDisplay));

  // Add new machine option to the select dropdown
  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Machine ${spinNumber}`;
  machineSelect.appendChild(option);

  spinButtonContainer.appendChild(spinButton);
  resultContainer.appendChild(resultDisplay);
}

// Function to spin the machine
function spinMachine(spinNumber, resultDisplay) {
  const result = getRandomOutcome();
  let winnings = 0;

  if (result.name === 'Lose') {
    resultDisplay.textContent = `Machine ${spinNumber}: You lost! Try again.`;
  } else {
    if (balance === 0) {
      winnings = result.fixed;
    } else {
      winnings = (balance * result.percent) / 100;
    }
    balance += winnings;
    resultDisplay.textContent = `Machine ${spinNumber}: ${result.name} - You won $${winnings.toFixed(2)}!`;
  }
  updateBalanceDisplay();
}

// Buy a new slot machine (costs $20)
buySlotButton.addEventListener('click', () => {
  if (balance >= 20) {
    balance -= 20;
    spinCount += 1;
    createSpinButton(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Buy auto-spin upgrade (cost increases each time)
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinCost) {
    balance -= autoSpinCost;
    autoSpinCost += 10; // Increase cost for next purchase
    messageDisplay.textContent = `Auto-spin purchased for $${autoSpinCost - 10}. New cost: $${autoSpinCost}`;
    updateBalanceDisplay();
    updateButtonTexts();

    // Clear previous interval if exists
    if (autoSpinInterval) clearInterval(autoSpinInterval);

    // Set auto-spin for selected machine
    const selectedMachine = machineSelect.value;
    const resultDisplay = document.getElementById(`result${selectedMachine}`);
    
    autoSpinInterval = setInterval(() => spinMachine(selectedMachine, resultDisplay), 2000);
  } else {
    messageDisplay.textContent = "Not enough money for Auto-Spin!";
  }
});

// Buy luck upgrade to improve chances (cost $50)
buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= 50) {
    balance -= 50;
    luckMultiplier += 0.1; // Each upgrade increases luck by 10%
    messageDisplay.textContent = "Your luck has increased!";
    updateBalanceDisplay();
  } else {
    messageDisplay.textContent = "Not enough money to get luckier!";
  }
});

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Update button texts with dynamic prices
function updateButtonTexts() {
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinCost})`;
}

// Initialize the first spin button and balance display
createSpinButton(spinCount);
updateBalanceDisplay();
updateButtonTexts();
