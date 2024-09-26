# Updated JavaScript to save game state using localStorage

js_content_v7 = """
let balance = 0;
let spinCount = 1;
let luckMultiplier = 1;

// Load saved game state from localStorage
function loadGameState() {
  const savedBalance = localStorage.getItem('balance');
  const savedSpinCount = localStorage.getItem('spinCount');
  const savedLuckMultiplier = localStorage.getItem('luckMultiplier');
  
  if (savedBalance !== null) balance = parseFloat(savedBalance);
  if (savedSpinCount !== null) spinCount = parseInt(savedSpinCount, 10);
  if (savedLuckMultiplier !== null) luckMultiplier = parseFloat(savedLuckMultiplier);

  updateBalanceDisplay();
}

// Save game state to localStorage
function saveGameState() {
  localStorage.setItem('balance', balance.toFixed(2));
  localStorage.setItem('spinCount', spinCount);
  localStorage.setItem('luckMultiplier', luckMultiplier.toFixed(2));
}

// Update balance display
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
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
    saveGameState(); // Save game state after each spin
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
    saveGameState(); // Save game state after buying slot machine
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
    saveGameState(); // Save game state after upgrading luck
  } else {
    messageDisplay.textContent = "Not enough money to upgrade your luck!";
  }
});

// Initialize the game by loading saved state and setting up the initial UI
window.addEventListener('load', () => {
  loadGameState();
  createSpinButton(spinCount);
});

// Save game state when the page is about to be closed
window.addEventListener('beforeunload', () => {
  saveGameState();
});

"""

# Saving the updated files with localStorage functionality
with open('/mnt/data/script_v7.js', 'w') as js_file:
    js_file.write(js_content_v7)

"/mnt/data/script_v7.js"
