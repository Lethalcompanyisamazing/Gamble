
let balance = 0;
let spinCount = 1;
let luckFactor = 1;

const balanceDisplay = document.getElementById('balance');
const spinButtonContainer = document.getElementById('spinButtonContainer');
const resultContainer = document.getElementById('resultContainer');
const emojiContainer = document.getElementById('emojiContainer');
const messageDisplay = document.getElementById('messageDisplay');
const buySlotButton = document.getElementById('buySlotButton');
const luckUpgradeButton = document.getElementById('luckUpgradeButton');

// Slot machine outcomes with win percentages adjusted by luck factor
let baseOutcomes = [
  { name: 'Lose', percent: 0, fixed: 0, chance: 70 }, // 70% chance of losing
  { name: 'Grape', percent: 10, fixed: 10, chance: 20 }, // 20% chance of winning Grape (now 10%)
  { name: 'Cherry', percent: 20, fixed: 50, chance: 9 }, // 9% chance of winning Cherry (now 20%)
  { name: '777', percent: 50, fixed: 100, chance: 1 } // 1% chance of winning 777 (now 50%)
];

// Emoji options: grape 🍇, cherry 🍒, and 7️⃣
const emojiOptions = ['🍇', '🍒', '7️⃣'];

// Function to pick a random outcome based on chance and luck factor
function getRandomOutcome() {
  const totalChance = baseOutcomes.reduce((sum, outcome) => sum + (outcome.chance * luckFactor), 0);
  let random = Math.random() * totalChance;
  
  for (let outcome of baseOutcomes) {
    if (random < outcome.chance * luckFactor) {
      return outcome;
    }
    random -= outcome.chance * luckFactor;
  }
}

// Generate random emojis for the reels
function generateRandomEmojis() {
  const emoji1 = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
  const emoji2 = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
  const emoji3 = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
  
  return [emoji1, emoji2, emoji3];
}

// Create a spin button and result display for each slot machine
function createSpinButton(spinNumber) {
  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Machine ${spinNumber}`;
  spinButton.style.margin = '10px';  // Add spacing between buttons
  
  const resultDisplay = document.createElement('p');
  resultDisplay.id = `result${spinNumber}`;
  resultDisplay.textContent = `Result for Machine ${spinNumber}: -`;
  
  const emojiDisplay = document.createElement('p');
  emojiDisplay.id = `emojiResult${spinNumber}`;
  emojiDisplay.textContent = '🍇 🍒 7️⃣';  // Default display of the three emojis
  
  spinButton.addEventListener('click', () => {
    const result = getRandomOutcome();
    let winnings = 0;
    const emojis = generateRandomEmojis();
    emojiDisplay.textContent = `${emojis[0]} ${emojis[1]} ${emojis[2]}`;

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

    // Check if all three emojis are the same
    if (emojis[0] === emojis[1] && emojis[1] === emojis[2]) {
      balance += 50; // Example bonus for matching emojis
      resultDisplay.textContent += " Jackpot! Matched emojis!";
    }

    updateBalanceDisplay();
  });
  
  spinButtonContainer.appendChild(spinButton);
  emojiContainer.appendChild(emojiDisplay);
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

// Buy luck upgrade (costs $30) which increases luck
luckUpgradeButton.addEventListener('click', () => {
  if (balance >= 30) {
    balance -= 30;
    luckFactor += 0.1; // Increase luck factor by 10%
    messageDisplay.textContent = `Luck increased! Your chances are now better.`;
    updateBalanceDisplay();
  } else {
    messageDisplay.textContent = "Not enough money to buy luck upgrade!";
  }
});

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

// Initialize the first spin button and balance display
createSpinButton(spinCount);
updateBalanceDisplay();
