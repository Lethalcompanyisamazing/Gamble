// Starting money for the player
let money = localStorage.getItem('money') ? parseInt(localStorage.getItem('money')) : 100; // Player starts with $100

// Blackjack Variables
let playerCards = [];
let dealerCards = [];
let playerTotal = 0;
let dealerTotal = 0;

// Display money on both pages
document.getElementById("money-display").innerText = `Money: $${money}`;

// Blackjack: Place bet button functionality
document.getElementById("place-bet").addEventListener("click", function() {
  let bet = parseInt(document.getElementById("bet-amount").value);

  if (isNaN(bet) || bet <= 0) {
    alert("Please enter a valid bet amount.");
    return;
  }

  if (bet > money) {
    alert("You don't have enough money to place this bet.");
    return;
  }

  // Update money and hide bet button
  money -= bet;
  localStorage.setItem('money', money); // Save money to localStorage
  document.getElementById("money-display").innerText = `Money: $${money}`;
  document.getElementById("place-bet").style.display = "none";
  document.getElementById("hit").style.display = "inline";
  document.getElementById("stand").style.display = "inline";

  // Start the Blackjack game
  startBlackjackGame(bet);
});

// Blackjack: Initialize game logic
function startBlackjackGame(bet) {
  playerCards = [getRandomCard(), getRandomCard()];
  dealerCards = [getRandomCard(), getRandomCard()];

  playerTotal = calculateTotal(playerCards);
  dealerTotal = calculateTotal(dealerCards);

  // Display player's starting cards
  document.getElementById("player-cards").innerText = `Your Cards: ${playerCards.join(' ')}`;
  document.getElementById("player-total").innerText = `Your Total: ${playerTotal}`;
  document.getElementById("dealer-cards").innerText = `Dealer's Cards: ${dealerCards[0]} ?`;

  displayCards();
}

// Blackjack: Get a random card
function getRandomCard() {
  const cards = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂶', '🂧', '🂨', '🂩', '🂪'];
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

// Blackjack: Calculate total value
function calculateTotal(cards) {
  let total = 0;
  let aceCount = 0;

  for (let card of cards) {
    if (card === '🂡' || card === '🂢' || card === '🂣' || card === '🂤') {
      total += 1;
      aceCount++;
    } else if (card === '🂥' || card === '🂶' || card === '🂧' || card === '🂨' || card === '🂩' || card === '🂪') {
      total += 10;
    }
  }

  while (total <= 11 && aceCount > 0) {
    total += 10;
    aceCount--;
  }

  return total;
}

// Blackjack: Show cards and totals
function displayCards() {
  document.getElementById("player-cards").innerText = `Your Cards: ${playerCards.join(' ')}`;
  document.getElementById("dealer-cards").innerText = `Dealer's Cards: ${dealerCards[0]} ?`;
}

// Blackjack: Hit button functionality
document.getElementById("hit").addEventListener("click", function() {
  playerCards.push(getRandomCard());
  playerTotal = calculateTotal(playerCards);
  document.getElementById("player-cards").innerText = `Your Cards: ${playerCards.join(' ')}`;
  document.getElementById("player-total").innerText = `Your Total: ${playerTotal}`;

  if (playerTotal > 21) {
    alert("You busted!");
    endBlackjackGame(false);
  }
});

// Blackjack: Stand button functionality
document.getElementById("stand").addEventListener("click", function() {
  dealerPlay();
  determineWinner();
});

// Blackjack: Dealer plays after player stands
function dealerPlay() {
  while (dealerTotal < 17) {
    dealerCards.push(getRandomCard());
    dealerTotal = calculateTotal(dealerCards);
  }
  document.getElementById("dealer-cards").innerText = `Dealer's Cards: ${dealerCards.join(' ')}`;
}

// Blackjack: Determine the winner
function determineWinner() {
  if (playerTotal > 21) {
    alert("You busted! Dealer wins!");
    endBlackjackGame(false);
  } else if (dealerTotal > 21) {
    alert("Dealer busted! You win!");
    endBlackjackGame(true);
  } else if (playerTotal > dealerTotal) {
    alert("You win!");
    endBlackjackGame(true);
  } else if (playerTotal < dealerTotal) {
    alert("Dealer wins!");
    endBlackjackGame(false);
  } else {
    alert("It's a tie!");
    endBlackjackGame(true);  // Tie scenario, money is returned
  }
}

// Blackjack: End the game and reset for next round
function endBlackjackGame(won) {
  if (won) {
    money += parseInt(document.getElementById("bet-amount").value) * 2;
    localStorage.setItem('money', money); // Save money to localStorage
  }
  document.getElementById("money-display").innerText = `Money: $${money}`;
  resetBlackjackGame();
}

// Blackjack: Reset the game
function resetBlackjackGame() {
  document.getElementById("place-bet").style.display = "inline";
  document.getElementById("hit").style.display = "none";
  document.getElementById("stand").style.display = "none";
  playerCards = [];
  dealerCards = [];
  playerTotal = 0;
  dealerTotal = 0;
  document.getElementById("player-cards").innerText = "Your Cards: ";
  document.getElementById("dealer-cards").innerText = "Dealer's Cards: ";
  document.getElementById("player-total").innerText = "Your Total: ";
}
