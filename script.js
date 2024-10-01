// Save and load state using localStorage
function saveState() {
  localStorage.setItem('balance', balance);
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('machines', JSON.stringify(machines));
  localStorage.setItem('luck', luck);
}

function loadState() {
  balance = parseFloat(localStorage.getItem('balance')) || 0;
  spinCount = parseInt(localStorage.getItem('spinCount')) || 1;
  machines = JSON.parse(localStorage.getItem('machines')) || [];
  luck = parseInt(localStorage.getItem('luck')) || startingLuck;
}

// Variables
let balance = 0;
let spinCount = 1;
let machines = [];
let startingLuck = 100; // Default starting luck
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

// Outcomes and chances (includes chance logic)
const outcomes = [
  { emoji: '🍇', fixed: 10, chance: 20 }, // 20% chance to win
  { emoji: '🍒', fixed: 50, chance: 9 },  // 9% chance to win
  { emoji: '777', fixed: 100, chance: 1 }, // 1% chance to win
  { emoji: 'LOSE', fixed: 0, chance: 70 }  // 70% chance to lose
];

// Function to pick a random outcome based on luck
function getRandomOutcome() {
  const totalChance = outcomes.reduce((sum, outcome) => sum + outcome.chance, 0) + luck; // Adjusted by luck
  let random = Math.random() * totalChance;

  for (let outcome of outcomes) {
    if (random < outcome.chance) {
      return outcome;
    }
    random -= outcome.chance;
  }
}

// Calculate winnings based on balance
function calculateWinnings(outcome) {
  if (outcome.emoji === 'LOSE') {
    return 0; // No winnings for losing
  }
  if (balance === 0) {
    switch (outcome.emoji) {
      case '🍇':
        return 10;
      case '🍒':
        return 50;
      case '777':
        return 100;
      default:
        return 0;
    }
  } else {
    switch (outcome.emoji) {
      case '🍇':
        return balance * 0.10;
      case '🍒':
        return balance * 0.35;
      case '777':
        return balance * 0.65;
      default:
        return 0;
    }
  }
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
    const winnings = calculateWinnings(result);
    if (winnings === 0) {
      resultDisplay.textContent = "You LOST!";
    } else {
      balance += winnings;
      resultDisplay.textContent = `${result.emoji} - You won $${winnings.toFixed(2)}!`;
    }
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

  machines.push({ spinNumber, winnings: 0 });
}

// Buy a new slot machine (costs $20)
buySlotButton.addEventListener('click', () => {
  const slotCost = getPrice('slot');
  if (balance >= slotCost) {
    balance -= slotCost;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You bought Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy a slot machine!";
  }
});

// Auto-Spin functionality, auto-spins every 5 seconds
let autoSpinInterval = null;
buyAutoSpinButton.addEventListener('click', () => {
  const autoSpinCost = getPrice('autoSpin');
  const selectedMachineIndex = parseInt(machineSelect.value) - 1;

  if (balance >= autoSpinCost) {
    balance -= autoSpinCost;
    messageDisplay.textContent = "Auto-spin upgrade purchased!";
    updateBalanceDisplay();
    updatePrices();
    saveState();

    // Clear previous auto-spin if it exists
    if (autoSpinInterval) {
      clearInterval(autoSpinInterval);
    }

    // Auto-spin for the selected slot machine every 5 seconds
    if (selectedMachineIndex >= 0) {
      autoSpinInterval = setInterval(() => {
        const spinButton = document.querySelectorAll('.slotMachine button')[selectedMachineIndex];
        if (spinButton) {
          spinButton.click(); // Automatically click the spin button for the selected machine
        }
      }, 5000);
    }
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Buy a luck upgrade (costs $50)
buyLuckUpgradeButton.addEventListener('click', () => {
  const luckUpgradeCost = getPrice('luckUpgrade');
  if (balance >= luckUpgradeCost) {
    balance -= luckUpgradeCost;
    luck += 10; // Increases luck with each upgrade
    messageDisplay.textContent = "Luck upgrade purchased!";
    updateBalanceDisplay();
    updatePrices();
    saveState();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Update the balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Update prices on the buttons
function updatePrices() {
  buySlotButton.textContent = `Buy Slot Machine ($${getPrice('slot').toFixed(2)})`;
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${getPrice('autoSpin').toFixed(2)})`;
  buyLuckUpgradeButton.textContent = `Buy Luck Upgrade ($${getPrice('luckUpgrade').toFixed(2)})`;
}

// Get price based on the current count of machines or upgrades
function getPrice(type) {
  let basePrice;
  switch (type) {
    case 'slot':
      basePrice = 20;
      return basePrice + machines.length * 10;
    case 'autoSpin':
      basePrice = 10;
      return basePrice + machines.length * 5;
    case 'luckUpgrade':
      basePrice = 50;
      return basePrice + machines.length * 15;
    default:
      return 0;
  }
}

// Wipe save and reset everything, give a starter slot machine and reset luck
wipeSaveButton.addEventListener('click', () => {
  localStorage.clear();  // Clears all saved data
  balance = 0;
  spinCount = 1;
  luck = startingLuck;  // Reset luck
  machines = [];
  slotMachinesContainer.innerHTML = '';  // Clears the display
  machineSelect.innerHTML = '';  // Resets dropdown
  messageDisplay.textContent = "Save wiped! You got a new starter slot machine!";
  updateBalanceDisplay();
  updatePrices();
  
  // Give a starter slot machine after wiping save
  createSlotMachine(spinCount);
  saveState();
});

// Ensure the first slot machine is created when the page loads
window.addEventListener('load', () => {
  loadState();
  updateBalanceDisplay();
  updatePrices();
  if (machines.length > 0) {
    machines.forEach(machine => createSlotMachine(machine.spinNumber));  // Restore machines from saved state
  }
});
