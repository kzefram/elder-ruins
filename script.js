let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monterHealth;
let inventory = ["dagger"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  {
    name: "dagger",
    power: 5,
  },
  {
    name: "short-sword",
    power: 30,
  },
  {
    name: "long-bow",
    power: 50,
  },
  {
    name: "long-sword",
    power: 100,
  },
];

const monsters = [
  {
    name: "slime cube",
    level: 2,
    health: 15,
  },
  {
    name: "beast hybrids",
    level: 8,
    health: 60,
  },
  {
    name: "king of dragons",
    level: 20,
    health: 300,
  },
];

const locations = [
  {
    name: "capital city",
    "button text": [
      "Go to pile of supplies",
      "Go to a path",
      "Fight king of dragons dragon",
    ],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the capital city and see lots of rubble. You see the pile of supplies and a path that leads to the ruins of the castle.",
  },
  {
    name: "pile of supplies",
    "button text": [
      "Buy 10 health (10 gold coins)",
      "Buy weapon (30 gold coins)",
      "Go to capital city",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You walk up to the pile of supplies. You see a rat. Oh! I may need more health and a better weapon.",
  },
  {
    name: "a path",
    "button text": [
      "Fight slime cube",
      "Fight beast hybrid",
      "Go to capital city",
    ],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You walk down a path a ways and then you see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Block", "Flee"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster. What do you do?",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to capital city",
      "Go to capital city",
      "Go to capital city",
    ],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster yells "Arg!" as it dies. You gain experience points and find gold coins!',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠️",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! 🎉",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to capital city?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game! Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold coins to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold coins to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold coins";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon, silly!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";

  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
  } else {
    text.innerText += " You miss.";
  }

  monsterHealth -=
    weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        fighting === 2 ? winGame() : defeatMonster();
    }

    if (Math.random() <= 0.1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText =
    "You dodge the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";

  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }

  if (numbers.indexOf(guess) !== -1) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}