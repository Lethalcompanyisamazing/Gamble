let money = 100; // Starting money for the player
let playerCards = [];
let communityCards = [];
let playerBet = 0;
let aiCards = [];
let aiMoney = 100; // AI's starting money

document.getElementById("money-display").innerText = `Money: $${money}`;

document.getElementById("place-bet").addEventListener("click", function () {
  let bet = parseInt(document.getElementById("bet-amount").value);

  if (isNaN(bet) || bet <= 0) {
    alert("Please enter a valid bet amount.");
    return;
  }

  if (bet > money) {
    alert("You don't have enough money to place this bet.");
    return;
  }

  money -= bet;
  playerBet = bet;
  aiMoney -= bet; // AI places the same bet

  document.getElementById("money-display").innerText = `Money: $${money}`;

  // Deal the cards after the bet
  playerCards = [getRandomCard(), getRandomCard()];
  aiCards = [getRandomCard(), getRandomCard()];
  communityCards = [getRandomCard(), getRandomCard(), getRandomCard()]; // Three community cards

  displayCards();

  // Hide the place bet button and show the action buttons
  document.getElementById("place-bet").style.display = "none";
  document.getElementById("deal-cards").style.display = "inline";
  document.getElementById("check").style.display = "inline";
  document.getElementById("raise").style.display = "inline";
  document.getElementById("fold").style.display = "inline";
});

document.getElementById("deal-cards").addEventListener("click", function () {
  communityCards.push(getRandomCard()); // Turn
  communityCards.push(getRandomCard()); // River
  displayCards();
  determineWinner();
});

document.getElementById("check").addEventListener("click", function () {
  alert("You checked your hand.");
  resetGame();
});

document.getElementById("raise").addEventListener("click", function () {
  alert("You raised your bet.");
  resetGame();
});

document.getElementById("fold").addEventListener("click", function () {
  alert("You folded.");
  resetGame();
});

function getRandomCard() {
  const ranks = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂶', '🂧', '🂨', '🂩', '🂪'];
  const suits = ['♠', '♣', '♥', '♦']; // Added hearts (♥) and diamonds (♦) for red cards
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return rank + suit;
}

function displayCards() {
  document.getElementById("player-cards").innerText = `Your Cards: ${playerCards.join(' ')}`;
  document.getElementById("community-cards").innerText = `Community Cards: ${communityCards.join(' ')}`;
  document.getElementById("ai-cards").innerText = `AI's Cards: ${aiCards.join(' ')}`;
}

function resetGame() {
  document.getElementById("place-bet").style.display = "inline";
  document.getElementById("deal-cards").style.display = "none";
  document.getElementById("check").style.display = "none";
  document.getElementById("raise").style.display = "none";
  document.getElementById("fold").style.display = "none";

  playerCards = [];
  aiCards = [];
  communityCards = [];
  document.getElementById("player-cards").innerText = "Your Cards: ";
  document.getElementById("community-cards").innerText = "Community Cards: ";
  document.getElementById("ai-cards").innerText = "AI's Cards: ";
}

function determineWinner() {
  const playerHand = evaluateHand(playerCards.concat(communityCards));
  const aiHand = evaluateHand(aiCards.concat(communityCards));

  if (playerHand.rank > aiHand.rank) {
    alert("You win!");
  } else if (playerHand.rank < aiHand.rank) {
    alert("AI wins!");
  } else {
    // If hands are the same rank, compare highest card
    const playerHighCard = getHighCard(playerCards.concat(communityCards));
    const aiHighCard = getHighCard(aiCards.concat(communityCards));

    if (playerHighCard > aiHighCard) {
      alert("You win with the highest card!");
    } else if (playerHighCard < aiHighCard) {
      alert("AI wins with the highest card!");
    } else {
      alert("It's a tie!");
    }
  }
}

function evaluateHand(cards) {
  // Simple hand evaluation logic (this could be expanded to handle all poker hands)
  let rank = 0;
  // Placeholder: here we just rank hands by the number of cards matching (you should implement full hand evaluation)
  let ranks = cards.map(card => card[0]);
  let uniqueRanks = new Set(ranks);
  if (uniqueRanks.size === 1) {
    rank = 10; // Example: All same rank = high pair
  }
  return { rank };
}

function getHighCard(cards) {
  // Return the value of the highest card (for simplicity, just numeric or rank-based comparison)
  const ranks = ['🂡', '🂢', '🂣', '🂤', '🂥', '🂶', '🂧', '🂨', '🂩', '🂪'];
  let maxCardValue = 0;
  cards.forEach(card => {
    let cardValue = ranks.indexOf(card[0]);
    if (cardValue > maxCardValue) maxCardValue = cardValue;
  });
  return maxCardValue;
}
