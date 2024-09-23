let balance = 0;
let spinCount = 1;
let autoSpinCost = 10; // Initial cost for auto-spin upgrade
let autoSpinEnabled = false; // Track if auto-spin is enabled

const balanceDisplay = document.getElementById('balance');
const spinButtonContainer = document.getElementById('spinButtonContainer');
const resultContainer = document.getElementById('resultContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const machineSelect = document.getElementById('machineSelect'); // Machine selection dropdown

// Slot machine outcomes with updated win percentages
const outcomes = [
  { name: 'Lose', percent: 0, fixed: 0, chance: 70 },
  { name: 'Grape', percent: 10, fixed: 10, chance: 20 },
  { name: 'Cherry', percent: 20, fixed: 50, chance: 9 },
  { name: '777', percent: 50, fixed: 100, chance: 1 }
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

// Create a spin button and result display for each slot machine
function createSpinButton(spinNumber) {
  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Machine ${spinNumber}`;
  spinButton.style.margin = '10px';
  
  const resultDisplay = document.createElement('p');
  resultDisplay.id = `result${spinNumber}`;
  resultDisplay.textContent = `Result for Machine ${spinNumber}: -`;
  
  spinButton.addEventListener('click', () => {
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
  });
  
  spinButtonContainer.appendChild(spinButton);
  resultContainer.appendChild(resultDisplay);
  
  // Add machine to the dropdown
  const option = document.createElement('option');
  option.value = spinNumber; // The value corresponds to the machine number
  option.textContent = `Machine ${spinNumber}`; // Text displayed in the dropdown
  machineSelect.appendChild(option);
}

// Update the text of the auto-spin button with the current price
function updateAutoSpinButton() {
  buyAutoSpinButton.textContent = `Buy Auto-Spin for $${autoSpinCost}`;
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

// Buy auto-spin upgrade
buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinCost) {
    balance -= autoSpinCost;
    autoSpinEnabled = true;
    autoSpinCost += 5; // Increase cost for next auto-spin upgrade
    messageDisplay.textContent = `Auto-spin enabled for Machine ${machineSelect.value}! Next upgrade costs $${autoSpinCost}.`;
    updateBalanceDisplay();
    startAutoSpin(); // Start auto-spin for the selected machine
    updateAutoSpinButton(); // Update the auto-spin button text
  } else {
    messageDisplay.textContent = "Not enough money to buy auto-spin!";
  }
});

// Start auto-spin feature for selected machine
function startAutoSpin() {
  const selectedMachine = machineSelect.value; // Get the selected machine
  const resultDisplay = document.getElementById(`result${selectedMachine}`); // Get the result display for the selected machine
  
  const autoSpinInterval = setInterval(() => {
    if (autoSpinEnabled) {
      const result = getRandomOutcome();
      let winnings = 0;

      if (result.name === 'Lose') {
        resultDisplay.textContent = `Machine ${selectedMachine}: You lost on auto-spin!`;
      } else {
        if (balance === 0) {
          winnings = result.fixed;
        } else {
          winnings = (balance * result.percent) / 100;
        }
        balance += winnings;
        resultDisplay.textContent = `Auto-spin: Machine ${selectedMachine}: ${result.name} - You won $${winnings.toFixed(2)}!`;
      }
      updateBalanceDisplay();
    }
  }, 3000); // Spins every 3 seconds (adjust as needed)
}

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Initialize the first spin button and balance display
createSpinButton(spinCount);
updateBalanceDisplay();
updateAutoSpinButton(); // Call this to set the initial button text
