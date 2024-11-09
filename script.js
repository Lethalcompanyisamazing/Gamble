// Variables
let balance = 100;
let betAmount = 10; // Default bet amount for Blackjack
let currentGame = "slotMachine";
let slotMachinePrices = { slotMachine: 20, autoSpin: 10, luckUpgrade: 50 };

// Blackjack Functions
function resetHands() {
  playerHand = [generateCard(), generateCard()];
  aiHand = [generateCard(), "Hidden"];
  updateBlackjackDisplay();
}

function updateBlackjackDisplay() {
  playerHandEl.textContent = playerHand.join(", ");
  aiHandEl.textContent = aiHand[0] + ", " + (aiHand[1] === "Hidden" ? "?" : aiHand[1]);
  playerTotalEl.textContent = calculateHandValue(playerHand);
  aiTotalEl.textContent = aiHand.includes("Hidden") ? "?" : calculateHandValue(aiHand);
}

function endGame(message, playerWins) {
  aiHand[1] = generateCard(); // Reveal AI's hidden card
  updateBlackjackDisplay();
  
  if (playerWins) {
    balance += betAmount * 2;
    alert(message + " You win double your bet!");
  } else {
    balance -= betAmount;
    alert(message + " You lost your bet.");
  }

  balanceDisplay.textContent = balance.toFixed(2);
  resetHands();
}

// Event Listeners and Initialization
switchGameButton.addEventListener("click", switchGame);
document.getElementById("hitButton").addEventListener("click", hit);
document.getElementById("stayButton").addEventListener("click", stay);

// Initialize balance and display
balanceDisplay.textContent = balance.toFixed(2);
resetHands();
