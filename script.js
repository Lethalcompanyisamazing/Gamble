// Function to pick a random outcome based on chance
function getRandomOutcome() {
  const totalChance = outcomes.reduce((sum, outcome) => sum + outcome.chance, 0);
  let random = Math.random() * totalChance;

  for (let outcome of outcomes) {
    if (random < outcome.chance) {
      return outcome;
    }
    random -= outcome.chance;
  }

  // If no outcome is selected, return a "loss" with no winnings
  return { emoji: '❌', fixed: 0, chance: 0 };  // Loss outcome
}

// Handle the spin logic
function handleSpin(resultDisplay, slotNumber) {
  const result = getRandomOutcome();
  let winnings = result.fixed;

  if (result.emoji === '❌') {
    resultDisplay.textContent = `Slot ${slotNumber}: You LOST!`;
  } else {
    if (balance > 0) {
      winnings = balance * (result.fixed / 100); // Percentage of current balance
    }

    if (balance === 0) {
      winnings = result.fixed; // Fallback to fixed amount if balance is zero
    }

    balance += winnings;
    resultDisplay.textContent = `${result.emoji} - You won $${winnings.toFixed(2)}!`;
  }

  updateBalanceDisplay();
  saveState();
}

// Create a slot machine
function createSlotMachine(spinNumber) {
  const slotMachineDiv = document.createElement('div');
  slotMachineDiv.classList.add('slotMachine');

  const resultDisplay = document.createElement('p');
  resultDisplay.textContent = `Slot ${spinNumber}: -`;
  slotMachineDiv.appendChild(resultDisplay);

  const spinButton = document.createElement('button');
  spinButton.textContent = `Spin Slot ${spinNumber}`;
  spinButton.addEventListener('click', () => {
    handleSpin(resultDisplay, spinNumber);
  });
  
  slotMachineDiv.appendChild(spinButton);
  slotMachinesContainer.appendChild(slotMachineDiv);

  // Add the slot machine to the select dropdown for auto-spin
  const option = document.createElement('option');
  option.value = spinNumber;
  option.textContent = `Slot ${spinNumber}`;
  machineSelect.appendChild(option);

  // Save machine info
  machines.push({ spinNumber, winnings: 0 });
}
