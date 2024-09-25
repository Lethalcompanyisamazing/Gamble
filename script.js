
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
  '🍇': { name: 'Grape', percent: 10, fixed: 10 },
  '🍒': { name: 'Cherry', percent: 20, fixed: 50 },
  '7️⃣': { name: '777', percent: 50, fixed: 100 }
};

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
    // Generate new emojis
    const emoji1 = getRandomEmoji();
    const emoji2 = getRandomEmoji();
    const emoji3 = getRandomEmoji();
    emojiDisplay.textContent = `${emoji1} ${emoji2} ${emoji3}`;

    let winnings = 0;

    // Check if emojis match for payout based on emoji result
    if (emoji1 === emoji2 && emoji2 === emoji3) {
      const matchingOutcome = emojiOutcomes[emoji1]; // Get the matching outcome based on emoji
      winnings = balance === 0 ? matchingOutcome.fixed : balance * (matchingOutcome.percent / 100);
      balance += winnings;
      resultDisplay.textContent = `Machine ${spinNumber}: ${matchingOutcome.name} Emoji Win! You won $${winnings.toFixed(2)}!`;
    } else {
      resultDisplay.textContent = `Machine ${spinNumber}: No match! Try again.`;
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
