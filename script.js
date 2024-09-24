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
const spinMachineButton = document.getElementById('spinMachineButton');

let autoSpinCost = 10;
let autoSpinInterval = null;
let luckMultiplier = 1.0;

// Slot symbols and payouts
const reelSymbols = [
  { symbol: '🍒', payout: 10 },
  { symbol: '🍇', payout: 20 },
  { symbol: '7️⃣', payout: 100 },
  { symbol: '🍋', payout: 5 },
  { symbol: '🔔', payout: 50 }
];

// Play background music
backgroundMusic.play();

// Function to pick a random outcome based on luck
function getRandomOutcome() {
  const totalChance = reelSymbols.length;
  const randomIndex = Math.floor(Math.random() * totalChance);
  return reelSymbols[randomIndex];
}

// Function to spin a reel and stop at a random symbol
function spinReel(reelElement) {
  return new Promise((resolve) => {
    let spins = 20; // Number of spins before stopping
    let spinInterval = setInterval(() => {
      let randomSymbol = getRandomOutcome();
      reelElement.textContent = randomSymbol.symbol;
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      resolve(reelElement.textContent); // Return the final symbol
    }, spins * 100); // Stop after a certain number of spins
  });
}

// Spin the machine when the spin button is clicked
spinMachineButton.addEventListener('click', async () => {
  const reel1 = document.getElementById('reel1');
  const reel2 = document.getElementById('reel2');
  const reel3 = document.getElementById('reel3');

  // Spin each reel and await their results
  const result1 = await spinReel(reel1);
  const result2 = await spinReel(reel2);
  const result3 = await spinReel(reel3);

  // Check if the user won (all symbols match)
  if (result1 === result2 && result2 === result3) {
    const winningSymbol = reelSymbols.find(s => s.symbol === result1);
    const winnings = winningSymbol.payout * luckMultiplier;
    balance += winnings;
    alert(`Jackpot! You hit ${winningSymbol.symbol} and won $${winnings}!`);
  } else {
    alert("Try again!");
  }
  
  updateBalanceDisplay();
});

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
updateBalanceDisplay();
updateButtonTexts();
