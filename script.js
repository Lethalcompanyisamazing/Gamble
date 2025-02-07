let money = 100;
let machinePrice = 50;
let autoSpinnerPrice = 30;
let autoSpinnerCount = 0;
let autoSpinnerIntervals = [];
const symbols = ["🍒", "🍉", "🍋", "7️⃣", "❌"];

document.getElementById("money").textContent = money;

// Function to create a new slot machine
function createSlotMachine() {
    let machine = document.createElement("div");
    machine.classList.add("machine");

    let slotsDiv = document.createElement("div");
    slotsDiv.classList.add("slots");

    let slot1 = document.createElement("span");
    let slot2 = document.createElement("span");
    let slot3 = document.createElement("span");
    slot1.classList.add("slot");
    slot2.classList.add("slot");
    slot3.classList.add("slot");
    slot1.textContent = "❓";
    slot2.textContent = "❓";
    slot3.textContent = "❓";

    slotsDiv.appendChild(slot1);
    slotsDiv.appendChild(slot2);
    slotsDiv.appendChild(slot3);
    machine.appendChild(slotsDiv);

    let spinButton = document.createElement("button");
    spinButton.textContent = "Spin ($10)";
    spinButton.classList.add("spin-btn");
    machine.appendChild(spinButton);

    document.getElementById("machines").appendChild(machine);

    // Attach event listener to the new spin button
    spinButton.addEventListener("click", function () {
        spinMachine(slot1, slot2, slot3);
    });
}

// Function to handle spinning logic
function spinMachine(slot1, slot2, slot3) {
    if (money < 10) {
        document.getElementById("message").textContent = "Not enough money!";
        return;
    }

    money -= 10;
    document.getElementById("money").textContent = money;

    let matchChance = Math.random();

    let symbol;
    if (matchChance < 0.6) { // 60% chance of a match
        symbol = symbols[Math.floor(Math.random() * symbols.length)];
        slot1.textContent = symbol;
        slot2.textContent = symbol;
        slot3.textContent = symbol;
    } else {
        slot1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        slot2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        slot3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }

    let rewardMultiplier = 0;
    if (slot1.textContent === slot2.textContent && slot2.textContent === slot3.textContent) {
        if (slot1.textContent === "🍒") rewardMultiplier = 1.25;
        else if (slot1.textContent === "🍉") rewardMultiplier = 1.50;
        else if (slot1.textContent === "🍋") rewardMultiplier = 1.75;
        else if (slot1.textContent === "7️⃣") rewardMultiplier = 2.50;
    }

    if (rewardMultiplier > 0) {
        let winnings = Math.floor(10 * rewardMultiplier);
        money += winnings;
        document.getElementById("message").textContent = `You won $${winnings}! 🎉`;
    } else {
        document.getElementById("message").textContent = "You lost! 😢";
    }

    document.getElementById("money").textContent = money;
}

// Event listener for buying new slot machines
document.getElementById("buy-machine-btn").addEventListener("click", function () {
    if (money < machinePrice) {
        document.getElementById("message").textContent = "Not enough money to buy a new slot machine!";
        return;
    }

    money -= machinePrice;
    machinePrice = Math.floor(machinePrice * 1.5);

    createSlotMachine();

    document.getElementById("money").textContent = money;
    document.getElementById("buy-machine-btn").textContent = `Buy Slot Machine ($${machinePrice})`;
});

// Event listener for buying auto spinner
document.getElementById("buy-auto-spinner-btn").addEventListener("click", function () {
    if (money < autoSpinnerPrice) {
        document.getElementById("message").textContent = "Not enough money to buy an auto spinner!";
        return;
    }

    money -= autoSpinnerPrice;
    autoSpinnerPrice = Math.floor(autoSpinnerPrice * 1.5);
    autoSpinnerCount++;

    document.getElementById("money").textContent = money;
    document.getElementById("buy-auto-spinner-btn").textContent = `Buy Auto Spinner ($${autoSpinnerPrice})`;

    let interval = setInterval(() => {
        let machines = document.querySelectorAll(".machine");
        machines.forEach(machine => {
            let slots = machine.querySelector(".slots").children;
            spinMachine(slots[0], slots[1], slots[2]);
        });
    }, 2000);

    autoSpinnerIntervals.push(interval);
});

// Initialize the game with one machine
createSlotMachine();
