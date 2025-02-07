let money = 100;
let machineCount = 1;
let machinePrice = 50;
const symbols = ["🍒", "🍉", "🍋", "7️⃣", "❌"];

document.getElementById("spin-btn").addEventListener("click", function() {
    let spinCost = 10 * machineCount;
    if (money < spinCost) {
        document.getElementById("message").textContent = "Not enough money!";
        return;
    }

    money -= spinCost;
    document.getElementById("money").textContent = money;

    let machines = document.querySelectorAll(".machine");
    let totalWinnings = 0;

    machines.forEach(machine => {
        let slot1, slot2, slot3;
        let matchChance = Math.random();

        if (matchChance < 0.6) { // 60% chance to get a match
            slot1 = slot2 = slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        } else { 
            slot1 = symbols[Math.floor(Math.random() * symbols.length)];
            slot2 = symbols[Math.floor(Math.random() * symbols.length)];
            slot3 = symbols[Math.floor(Math.random() * symbols.length)];
        }

        machine.children[0].textContent = slot1;
        machine.children[1].textContent = slot2;
        machine.children[2].textContent = slot3;

        let rewardMultiplier = 0;
        if (slot1 === slot2 && slot2 === slot3) {
            if (slot1 === "🍒") rewardMultiplier = 1.25;
            else if (slot1 === "🍉") rewardMultiplier = 1.50;
            else if (slot1 === "🍋") rewardMultiplier = 1.75;
            else if (slot1 === "7️⃣") rewardMultiplier = 2.50;
        }

        if (rewardMultiplier > 0) {
            let winnings = Math.floor(10 * rewardMultiplier);
            totalWinnings += winnings;
        }
    });

    if (totalWinnings > 0) {
        money += totalWinnings;
        document.getElementById("message").textContent = `You won $${totalWinnings}! 🎉`;
    } else {
        document.getElementById("message").textContent = "You lost! 😢";
    }

    document.getElementById("money").textContent = money;
});

document.getElementById("buy-machine-btn").addEventListener("click", function() {
    if (money < machinePrice) {
        document.getElementById("message").textContent = "Not enough money to buy a new slot machine!";
        return;
    }

    money -= machinePrice;
    machineCount++;
    machinePrice = Math.floor(machinePrice * 1.5);
    
    let newMachine = document.createElement("div");
    newMachine.classList.add("machine");
    newMachine.innerHTML = `<span class="slot">❓</span> <span class="slot">❓</span> <span class="slot">❓</span>`;
    document.getElementById("machines").appendChild(newMachine);

    document.getElementById("money").textContent = money;
    document.getElementById("buy-machine-btn").textContent = `Buy Slot Machine ($${machinePrice})`;
});
