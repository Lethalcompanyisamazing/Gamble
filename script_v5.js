
let balance = 0;
let spinCount = 1;
let luckMultiplier = 1;

const balanceDisplay = document.getElementById('balance');
const spinButtonContainer = document.getElementById('spinButtonContainer');
const resultContainer = document.getElementById('resultContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const luckUpgradeButton = document.getElementById('luckUpgradeButton');

// Emojis for the slot reels
const emojiReel = ['🍇', '🍒', '7️⃣'];

// Slot machine outcomes now match emoji results directly
const emojiOutcomes = {
  'Grape': { emoji: '🍇', percent: 10, fixed: 10 },
  'Cherry': { emoji: '🍒', percent: 20, fixed: 50 },
  '777': { emoji: '7️⃣', percent: 50, fixed: 100 }
};

// Slot machine outcomes with updated win percentages
const baseOutcomes = [
  { name: 'Lose', percent: 0, fixed: 0, chance: 70 }, // 70% chance of losing
  { name: 'Grape', percent: 10, fixed: 10, chance: 20 }, // 20% chance of winning Grape
  { name: 'Cherry', percent: 20, fixed: 50, chance: 9 }, // 9% chance of winning Cherry
  { name: '777', percent: 50, fixed: 100, chance: 1 } // 1% chance of winning 777
];

// Function to pick a random outcome based on chance and luck multiplier
function getRandomOutcome() {
  const totalChance = baseOutcomes.reduce((sum, outcome) => sum + outcome.chance, 0) * luckMultiplier;
  let random = Math.random() * totalChance;
  
  for (let outcome of baseOutcomes) {
    if (random < outcome.chance * luckMultiplier) {
      return outcome;
    }
    random -= outcome.chance * luckMultiplier;
  }
}

// Function to generate random emojis for the slot reel
function getRandomEmoji() {
  return emojiReel[Math.floor(Math.random() * emojiReel.length)];
}

// Create a spin button and result display for each slot machine, including emoji reels
function createSpinButton(spinNumber) {
  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Machine ${spinNumber}`;
  spinButton.style.margin = '10px';  // Add spacing between buttons
  
  const emojiDisplay = document.createElement('p');
  emojiDisplay.id = `emoji${spinNumber}`;
  emojiDisplay.textContent = `${getRandomEmoji()} ${getRandomEmoji()} ${getRandomEmoji()}`;

  const resultDisplay = document.createElement('p');
  resultDisplay.id = `result${spinNumber}`;
  resultDisplay.textContent = `Result for Machine ${spinNumber}: -`;

  spinButton.addEventListener('click', () => {
    const result = getRandomOutcome();
    let winnings = 0;
    
    // Display corresponding emoji for win or random emojis for loss
    if (result.name === 'Lose') {
      emojiDisplay.textContent = `${getRandomEmoji()} ${getRandomEmoji()} ${getRandomEmoji()}`;
      resultDisplay.textContent = `Machine ${spinNumber}: You lost! Try again.`;
    } else {
      const matchingEmoji = emojiOutcomes[result.name].emoji;
      emojiDisplay.textContent = `${matchingEmoji} ${matchingEmoji} ${matchingEmoji}`;

      winnings = balance === 0 ? result.fixed : (balance * result.percent) / 100;
      balance += winnings;
      resultDisplay.textContent = `Machine ${spinNumber}: ${result.name} - You won $${winnings.toFixed(2)}!`;
    }

    updateBalanceDisplay();
  });

  spinButtonContainer.appendChild(spinButton);
  resultContainer.appendChild(emojiDisplay);
  resultContainer.appendChild(resultDisplay);
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

// Buy a luck upgrade (costs $50)
luckUpgradeButton.addEventListener('click', () => {
  if (balance >= 50) {
    balance -= 50;
    luckMultiplier *= 1.2; // Increase luck multiplier by 20%
    messageDisplay.textContent = "Luck increased!";
    updateBalanceDisplay();
  } else {
    messageDisplay.textContent = "Not enough money to upgrade your luck!";
  }
});

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Initialize the first spin button and balance display
createSpinButton(spinCount);
updateBalanceDisplay();
