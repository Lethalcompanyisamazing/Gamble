let balance = 100;
let playerHand = [];
let aiHand = [];
let currentBet = 0;
const suits = ["♠", "♥", "♦", "♣"];

function updateBalance() {
  document.getElementById("balance").textContent = balance;
}

function resetGame() {
  playerHand = [];
  aiHand = [];
  currentBet = 0;
  document.getElementById("resultDisplay").textContent = "";
  document.getElementById("aiHand").textContent = "AI Hand: ?";
  document.getElementById("betDisplay").textContent = "Current Bet: $0";
  updateHands();
}

function getRandomCard() {
  const value = Math.floor(Math.random() * 10) + 1;
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return { value, suit };
}

function updateHands() {
  document.getElementById("playerHand").textContent = `Player Hand: ${playerHand.map(card => `${card.value}${card.suit}`).join(", ")}`;
  if (aiHand.length > 0) {
    document.getElementById("aiHand").textContent = `AI Hand: ${aiHand[0].value}${aiHand[0].suit}, ?`;
  }
}

function placeBet() {
  const betAmount = prompt("Enter your bet amount:");
  if (betAmount && betAmount > 0 && betAmount <= balance) {
    currentBet = parseInt(betAmount, 10);
    balance -= currentBet;
    updateBalance();
    document.getElementById("betDisplay").textContent = `Current Bet: $${currentBet}`;
    blackjack();
  } else {
    alert("Invalid bet amount!");
  }
}

function blackjack() {
  playerHand = [getRandomCard(), getRandomCard()];
  aiHand = [getRandomCard(), getRandomCard()];
  updateHands();
}

document.getElementById("betButton").addEventListener("click", placeBet);

document.getElementById("hitButton").addEventListener("click", () => {
  playerHand.push(getRandomCard());
  updateHands();
});

document.getElementById("stayButton").addEventListener("click", () => {
  const playerTotal = playerHand.reduce((acc, card) => acc + card.value, 0);
  const aiTotal = aiHand.reduce((acc, card) => acc + card.value, 0);

  document.getElementById("aiHand").textContent = `AI Hand: ${aiHand.map(card => `${card.value}${card.suit}`).join(", ")} (Total: ${aiTotal})`;

  if (playerTotal > 21) {
    document.getElementById("resultDisplay").textContent = "You Busted! AI wins.";
  } else if (aiTotal > 21 || playerTotal > aiTotal) {
    balance += currentBet * 2;
    document.getElementById("resultDisplay").textContent = "You Win!";
  } else {
    document.getElementById("resultDisplay").textContent = "AI Wins!";
  }
  updateBalance();
  resetGame();
});

resetGame();
