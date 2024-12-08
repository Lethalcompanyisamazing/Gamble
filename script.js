// Initialize money (load from localStorage or start at 100)
let money = parseInt(localStorage.getItem('money')) || 100;
const moneyDisplay = document.getElementById('money-display');
const betButton = document.getElementById('bet-button');
const hitButton = document.getElementById('hit-button');
const checkButton = document.getElementById('check-button');
const playerHandElement = document.getElementById('player-hand');
const dealerHandElement = document.getElementById('dealer-hand');
const gameLog = document.getElementById('game-log');

// Deck of card emojis and values
const deck = [
  { emoji: '🂡', value: 11 }, { emoji: '🂢', value: 2 },
  { emoji: '🂣', value: 3 }, { emoji: '🂤', value: 4 },
  { emoji: '🂥', value: 5 }, { emoji: '🂶', value: 6 },
  { emoji: '🂧', value: 7 }, { emoji: '🂨', value: 8 },
  { emoji: '🂩', value: 9 }, { emoji: '🂪', value: 10 }
];

// Shuffle deck
function shuffle(deck) {
  return deck.sort(() => Math.random() - 0.5);
}

let playerHand = [];
let dealerHand = [];
let currentBet = 0;

// Update money display
function updateMoneyDisplay() {
  moneyDisplay.textContent = `Money: $${money}`;
}

// Save money to localStorage
function saveMoney() {
  localStorage.setItem('money', money);
}

// Calculate hand value
function calculateHand(hand) {
  let total = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter(card => card.value === 11).length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

// Render hands
function renderHands() {
  playerHandElement.textContent = playerHand.map(card => card.emoji).join(' ');
  dealerHandElement.textContent = dealerHand.length === 1
    ? '🂠'
    : dealerHand.map(card => card.emoji).join(' ');
}

// Start a new round
function startRound() {
  const shuffledDeck = shuffle([...deck]);
  playerHand = [shuffledDeck.pop(), shuffledDeck.pop()];
  dealerHand = [shuffledDeck.pop()];

  renderHands();
  gameLog.textContent = 'Your turn! Choose to Hit or Check.';
  hitButton.disabled = false;
  checkButton.disabled = false;
}

// End the game
function endGame() {
  const playerTotal = calculateHand(playerHand);
  const dealerTotal = calculateHand(dealerHand);

  gameLog.textContent = `You: ${playerTotal}, Dealer: ${dealerTotal}.`;

  if (playerTotal > 21) {
    gameLog.textContent += " You busted! Dealer wins.";
    money -= currentBet;
  } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
    gameLog.textContent += " You win! Your bet is doubled.";
    money += currentBet;
  } else if (playerTotal === dealerTotal) {
    gameLog.textContent += " It's a tie. You keep your bet.";
  } else {
    gameLog.textContent += " Dealer wins!";
    money -= currentBet;
  }

  saveMoney();
  updateMoneyDisplay();

  // Reset game
  hitButton.disabled = true;
  checkButton.disabled = true;
  betButton.disabled = false;
}

// Dealer's turn logic
function dealerTurn() {
  while (calculateHand(dealerHand) < 17) {
    dealerHand.push(deck[Math.floor(Math.random() * deck.length)]);
    renderHands();
  }
  setTimeout(endGame, 1000);
}

// Handle betting
betButton.addEventListener('click', () => {
  const betAmount = parseInt(prompt("Enter your bet amount:"));

  if (isNaN(betAmount) || betAmount <= 0) {
    alert("Please enter a valid bet amount.");
    return;
  }

  if (betAmount > money) {
    alert("You don't have enough money to make this bet!");
    return;
  }

  currentBet = betAmount;
  betButton.disabled = true;
  startRound();
});

// Handle Hit button
hitButton.addEventListener('click', () => {
  playerHand.push(deck[Math.floor(Math.random() * deck.length)]);
  renderHands();

  if (calculateHand(playerHand) > 21) {
    gameLog.textContent = "You busted! Dealer wins.";
    endGame();
  }
});

// Handle Check button
checkButton.addEventListener('click', () => {
  hitButton.disabled = true;
  checkButton.disabled = true;
  dealerTurn();
});

// Initial display
updateMoneyDisplay();
