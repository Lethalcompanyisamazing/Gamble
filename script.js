let balance = 100;
const betAmount = 10;
let playerHand = [];
let aiHand = [];
const balanceDisplay = document.getElementById("balance");
const playerHandEl = document.getElementById("playerHand");
const aiHandEl = document.getElementById("aiHand");
const aiTotalEl = document.getElementById("aiTotal");
const resultMessageEl = document.getElementById("resultMessage");

balanceDisplay.textContent = balance.toFixed(2);

function generateCard() {
  return Math.floor(Math.random() * 11) + 1;
}

function calculateHandValue(hand) {
  return hand.reduce((total, card) => total + card, 0);
}

function updateBlackjackDisplay() {
  playerHandEl.textContent = playerHand.join(", ");
  aiHandEl.textContent = aiHand[0] + ", ?";
  aiTotalEl.textContent = "?";
}

function endGame(message, playerWins) {
  const aiTotal = calculateHandValue(aiHand);
  aiHandEl.textContent = aiHand.join(", ");
  aiTotalEl.textContent = aiTotal;
  resultMessageEl.textContent = message;

  balance += playerWins ? betAmount * 2 : -betAmount;
  balanceDisplay.textContent = balance.toFixed(2);

  setTimeout(resetHands, 3000);
}

function hit() {
  playerHand.push(generateCard());
  if (calculateHandValue(playerHand) > 21) {
    endGame("You Lose!", false);
  } else {
    updateBlackjackDisplay();
  }
}

function stay() {
  while (calculateHandValue(aiHand) < 17) {
    aiHand.push(generateCard());
  }
  const playerTotal = calculateHandValue(playerHand);
  const aiTotal = calculateHandValue(aiHand);

  if (aiTotal > 21 || playerTotal > aiTotal) {
    endGame("You Win!", true);
  } else {
    endGame("You Lose!", false);
  }
}

function resetHands() {
  playerHand = [generateCard(), generateCard()];
  aiHand = [generateCard(), generateCard()];
  updateBlackjackDisplay();
  resultMessageEl.textContent = "";
}
