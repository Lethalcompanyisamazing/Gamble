let balance = 0;
let spinCount = 1; // Start with 1 slot machine

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

// Play background music
backgroundMusic.play();

function getRandomOutcome() {
  const totalChance = reelSymbols.length;
  const randomIndex = Math.floor(Math.random() * totalChance);
  return reelSymbols[randomIndex];
}

function spinReel(reelElement) {
  return new Promise((resolve) => {
    let spins = 7; // Number of spins
    let spinInterval = setInterval(() => {
      let randomSymbol = getRandomOutcome();
      reelElement.textContent = randomSymbol.symbol;
    }, 40); // Fast spin interval

    setTimeout(() => {
      clearInterval(spinInterval);
      resolve(reelElement.textContent);
    }, spins * 40); // Spins complete more quickly
  });
}

function createSlotMachine(spinNumber) {
  const slotMachine = document.createElement('div');
  slotMachine.className = 'slotMachine';

  const resultDisplay = document.createElement('p');
  resultDisplay.id = `result_${spinNumber}`;
  resultDisplay.textContent = `Result for Machine ${spinNumber}: -`;

  const reel1 = document.createElement('div');
  reel1.className = 'reel';
  reel1.id = `reel1_${spinNumber}`;
  reel1.textContent = '🍒';

  const reel2 = document.createElement('div');
  reel2.className = 'reel';
  reel2.id = `reel2_${spinNumber}`;
  reel2.textContent = '🍇';

  const reel3 = document.createElement('div');
  reel3.className = 'reel';
  reel3.id = `reel3_${spinNumber}`;
  reel3.textContent = '7️⃣';

  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Machine ${spinNumber}`;
  spinButton.id = `spinMachineButton_${spinNumber}`;

  spinButton.addEventListener('click', async () => {
    const result1 = await spinReel(reel1);
    const result2 = await spinReel(reel2);
    const result3 = await spinReel(reel3);

    if (result1 === result2 && result2 === result3) {
      const winningSymbol = reelSymbols.find(s => s.symbol === result1);
      const winnings = winningSymbol.payout * luckMultiplier;
      balance += winnings;
      resultDisplay.textContent = `Jackpot! You won $${winnings}!`;
    } else {
      resultDisplay.textContent = "Try again!";
    }

    updateBalanceDisplay();
  });

  slotMachine.appendChild(resultDisplay); // Display results above spin button
  slotMachine.appendChild(reel1);
  slotMachine.appendChild(reel2);
  slotMachine.appendChild(reel3);
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
      const spinButton = document.getElementById(`spinMachineButton_${selectedMachine}`);
      spinButton.click(); // Trigger the spin for the selected machine
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
createSlotMachine(spinCount); // Automatically create the first slot machine
updateBalanceDisplay();
updateButtonTexts();
