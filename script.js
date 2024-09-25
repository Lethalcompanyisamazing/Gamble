let balance = 0;
let spinCount = 1;

const balanceDisplay = document.getElementById('balance');
const slotMachinesContainer = document.getElementById('slotMachinesContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const buyAutoSpinButton = document.getElementById('buyAutoSpinButton');
const buyLuckUpgradeButton = document.getElementById('buyLuckUpgradeButton');
const machineSelect = document.getElementById('machineSelect');
const backgroundMusic = document.getElementById('backgroundMusic');

let autoSpinCost = 10;
let autoSpinInterval = null;
let luckMultiplier = 1.0;

const reelSymbols = [
  { symbol: '🍒', payout: 10 },
  { symbol: '🍇', payout: 20 },
  { symbol: '7️⃣', payout: 100 },
  { symbol: '🍋', payout: 5 },
  { symbol: '🔔', payout: 50 }
];

backgroundMusic.play(); // Play the background music

function getRandomOutcome() {
  const totalChance = reelSymbols.length;
  const randomIndex = Math.floor(Math.random() * totalChance);
  return reelSymbols[randomIndex];
}

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
}

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

function addMachineToSelect(spinNumber) {
  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Machine ${spinNumber}`;
  machineSelect.appendChild(option);
}

buySlotButton.addEventListener('click', () => {
  if (balance >= 20) {
    balance -= 20;
    spinCount += 1;
    createSlotMachine(spinCount);
    messageDisplay.textContent = `You created Slot Machine ${spinCount}!`;
    updateBalanceDisplay();
  } else {
    messageDisplay.textContent = "Not enough money to create a slot machine!";
  }
});

buyAutoSpinButton.addEventListener('click', () => {
  if (balance >= autoSpinCost) {
    balance -= autoSpinCost;
    autoSpinCost += 10;
    messageDisplay.textContent = `Auto-spin purchased for $${autoSpinCost - 10}. New cost: $${autoSpinCost}`;
    updateBalanceDisplay();
    updateButtonTexts();

    if (autoSpinInterval) clearInterval(autoSpinInterval);

    const selectedMachine = machineSelect.value;

    autoSpinInterval = setInterval(() => {
      generateRandomEmojis(selectedMachine);
    }, 1000); // Faster auto-spin interval
  } else {
    messageDisplay.textContent = "Not enough money for Auto-Spin!";
  }
});

buyLuckUpgradeButton.addEventListener('click', () => {
  if (balance >= 50) {
    balance -= 50;
    luckMultiplier += 0.1;
    messageDisplay.textContent = "Your luck has increased!";
    updateBalanceDisplay();
  } else {
    messageDisplay.textContent = "Not enough money to get luckier!";
  }
});

function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

function updateButtonTexts() {
  buyAutoSpinButton.textContent = `Buy Auto-Spin ($${autoSpinCost})`;
}

// Initialize the first slot machine and balance display
createSlotMachine(spinCount);
updateBalanceDisplay();
updateButtonTexts();
