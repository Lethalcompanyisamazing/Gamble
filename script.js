// Variables
let balance = 0;
let spinCount = 1;
let machines = [];
let luck = 1;
let slotMachinePrice = 20.00;
let autoSpinPrice = 10.00;
let luckUpgradePrice = 50.00;

// HTML Elements
const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const wipeSaveButton = document.getElementById('wipeSaveButton');
const machineSelect = document.getElementById('machineSelect');

// Function to navigate to a new game
function goToNewGame() {
  window.location.href = 'new-game-page.html'; // Update the URL for the new game
}

// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
  localStorage.setItem('luck', luck);
  localStorage.setItem('slotMachinePrice', slotMachinePrice);
  localStorage.setItem('autoSpinPrice', autoSpinPrice);
  localStorage.setItem('luckUpgradePrice', luckUpgradePrice);
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
  luck = parseInt(localStorage.getItem('luck')) || 1;
  slotMachinePrice = parseFloat(localStorage.getItem('slotMachinePrice')) || 20.00;
  autoSpinPrice = parseFloat(localStorage.getItem('autoSpinPrice')) || 10.00;
  luckUpgradePrice = parseFloat(localStorage.getItem('luckUpgradePrice')) || 50.00;
  updateButtonPrices();
}

// Update button prices
function updateButtonPrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${slotMachinePrice.toFixed(2)})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinPrice.toFixed(2)})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${luckUpgradePrice.toFixed(2)})`;
}

// Wipe save function
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear();
  balance = 0;
  spinCount = 1;
  luck = 1;
  slotMachinePrice = 20.00;
  autoSpinPrice = 10.00;
  luckUpgradePrice = 50.00;
  slotMachinesContainer.innerHTML = '';
  machines = [];
  createSlotMachine(spinCount); // Give a starter machine after wiping
  updateBalanceDisplay();
  updateButtonPrices();
  messageDisplay.textContent = "Save wiped! Starter machine added.";
  saveState();
});

// Outcomes (emojis) and chances
const outcomes = [
  { emoji: '🍇', fixed: 10, chance: 20, percent: 0.1 },  // 10% of balance
  { emoji: '🍒', fixed: 50, chance: 9, percent: 0.35 },  // 35% of balance
  { emoji: '777', fixed: 100, chance: 1, percent: 0.65 } // 65% of balance
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
  return null;
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
    if (balance > 0) {
      const winnings = balance * result.percent;
      balance += winnings;
    } else {
      balance += result.fixed;
    }
    resultDisplay.textContent = `${result.emoji} - You won $${balance.toFixed(2)}!`;
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

// Buy a new slot machine
buySlotButton.addEventListener('click', () => {
  if (balance >= slotMachinePrice) {
    balance -= slotMachinePrice;
    slotMachinePrice *= 1.2; // Increase price
    spinCount += 1;
    createSlotMachine(spinCount);
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
    autoSpinPrice *= 1.3; // Increase price
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
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
    luckUpgradePrice *= 1.5; // Increase price
    luck += 1;
    messageDisplay.textContent = "Luck upgrade purchased!";
    updateBalanceDisplay();
    updateButtonPrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Update the balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Ensure the first slot machine is created when the page loads
window.addEventListener('load', () => {
  loadState();
  updateBalanceDisplay();
  if (machines.length === 0) {
    createSlotMachine(spinCount);  // Create the initial slot machine if none exist
  } else {
    machines.forEach(machine => createSlotMachine(machine.spinNumber));  // Restore machines from saved state
  }
});
