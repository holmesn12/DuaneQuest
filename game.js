// DOM elements
const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');
const statsElement = document.getElementById('stats');
const enemyInfoElement = document.getElementById('enemy-info');
const enemyNameElement = document.getElementById('enemy-name');
const enemyHealthElement = document.getElementById('enemy-health');
const forestSound = document.getElementById('forest-sound');
const suburbSound = document.getElementById('suburb-sound');
const startSound = document.getElementById('start-sound');

document.addEventListener('DOMContentLoaded', (event) => {
    const clickSound = document.getElementById('click-sound');

    // Function to play the click sound
    function playClickSound() {
        clickSound.currentTime = 0; // Reset the sound to the beginning
        clickSound.play();
    }

    // Add event listeners to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            playClickSound();
            // Ensure the first user interaction allows audio playback
            if (!startSound.playing) {
                startSound.play().catch(error => console.error('Error playing start sound:', error));
            }
        });
    });
});

// Function to handle biome changes and play corresponding sound
let currentBiome = ''; // Track the current biome

function handleBiomeChange(biome) {
    console.log('Changing biome to:', biome);

    // Stop all biome sounds if the biome is different
    if (biome === 'same') {
        biomie = currentBiome;
    }
    if (biome !== currentBiome) {
        forestSound.pause();
        forestSound.currentTime = 0;
        suburbSound.pause();
        suburbSound.currentTime = 0;
        startSound.pause();
        startSound.currentTime = 0;
    }

    // Play the corresponding biome sound only if it's different
    if (biome === 'forest' && currentBiome !== 'forest') {
        console.log('Playing forest sound');
        forestSound.play().catch(error => console.error('Error playing forest sound:', error));
    } else if (biome === 'start' && currentBiome !== 'start') {
        console.log('Playing start sound');
        startSound.play().catch(error => console.error('Error playing start sound:', error));
    } else if (biome === 'suburb' && currentBiome !== 'suburb') {
        console.log('Playing suburb sound');
        suburbSound.play().catch(error => console.error('Error playing suburb sound:', error));
    }

    // Update the current biome
    currentBiome = biome;
}
// Example function to change the text node and handle biome changes
function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    textElement.innerText = textNode.text;
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }

    textNode.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectOption(option));
        optionButtonsElement.appendChild(button);
    });

    // Handle biome change
    handleBiomeChange(textNode.biome);
}

// Initial game state
let state = {
    hp: 1,
    xp: 0,
    mana: 1,
    str: 1,
    cha: 1,
    dex: 1,
    int: 1,
    level: 1,
    requiredXp: 10,
    inventory: [],
    statPoints: 0, // Add statPoints to track available points
    nextTextNodeId: null, // Add this property to store the next text node ID
    name: '' // Add this property to store the player's name
}
const MAX_STAT_VALUE = 100; // Define a maximum value for stats

// Text Nodes
// Text nodes definition
const textNodes = [
    {
        id: 1,
        text: 'Are you ready to embark on a journey?',
        biome: '1',
        triggerEncounter: false,
        options: [
            {
                text: 'Yes...',
                nextText: 2,
            }
            ]
        },
{
    id: 2,
    text: 'DuaneQuest: A Text Adventure',
    biome: 'start',
    triggerEncounter: false,
    options: [
            {
                text: 'Begin',
                setState: (currentState) => ({
                    hp: 10,
                    xp: 0,
                    mana: 0,
                    str: 1,
                    cha: 1,
                    dex: 1,
                    int: 1,
                    level: 1,
                    requiredXp: 10
                }),
                modifiers: {xp:1},
                nextText: 3
            },
            {text: 'Credits',
            nextText:999
            }
        ]
    },
{
    id: 3,
    text: "You wake up in a clearing. \n You aren\'t aware of who you are at first, but in time your memories clear.",
    biome: 'forest',
    triggerEncounter: false,
    options: [
        {
                text: "It's coming back to me...",
                nextText: 4
            },
            {
                text: "Check your pockets.",
                addItem: 'Outdated Magazine',
                nextText: 6
            }
        ]
    },
    {
        id: 6,
        text: "You find a folded magazine in your back pocket, it's years old. \n You can't remember where you got it from.",
        biome: 'forest',
        triggerEncounter: false,
        options: [
            {
                    text: "The same word repeats in my mind... Wait, could it be?",
                    nextText: 4
                },
                {
                    text: "Inspect the Magazine further.",
                    diceroll: {stat: 'cha', difficulty: 10},
                    successModifiers: { xp: 10}, // Gain XP and lose health on success
                    failModifiers: { hp: -2 }, // Lose health and mana on failure    
                    nextText: 800,
                    failText: 850
                }
            ]
        },
{
    id: 4,
    text: "Obviously! Your name, your real one! \n it's the very first thing that pops in your mind, why don't you tell me what it is.",
    biome: 'forest',
    triggerEncounter: false,
    input: true,
},
    {
        id: 5,
        text: "Fine then {name}, where do you want to go?",
        biome: 'forest',
        triggerEncounter: false,
        options: [
            {
                    text: "Look around the area.",
                    nextText: 7
                },
                {
                    text: "I'm going to kill God.",
                    requiredState: (currentState) => currentState.name === "Chale",
                    nextText: 997
                },
                {
                    text: "Climb the tree.",
                    diceRoll: { stat: 'dex', difficulty: 5 },
                    nextText: 8,
                    failText: 9
                }
        ]
    },
    {
        id: 7,
        text: "You stroll for a bit, and you hear growls in the distance. \n You're far from alone in these parts.",
        biome: 'forest',
        triggerEncounter: true,
        options: [
            {
                    text: "Investigate the sound.",
                    nextText: 10
                },
                {
                    text: "Go back.",
                    nextText: 5,
                }
        ]
    },
    {
        id: 8,
        text: "The wind fluffs your perfect hair. From up here you can see your suburb. \n You aren't far from home at all. \n But it seems like there are plenty of monsters in the way.",
        biome: 'forest',
        triggerEncounter: true,
        options: [
            {
                    text: "Fight the nearest monster.",
                    nextText: 10
                },
                {
                    text: "Try make a clean break for home.",
                    diceRoll: { stat: 'dex', difficulty: 5 },
                    nextText: 11,
                    failText: 10}
        ]
    },
    {
        id: 10,
        text: "It's hardly a monster, but a lone wolf cub. \n It's growling at you, but it's not attacking. \n It's probably lost.",
        biome: 'forest',
        triggerEncounter: true,
        options: [
            {
                    text: "Fight it.",
                    action: 'fightWolfCub',
                    nextText: 12
                },
                {
                    text: "Try get away.",
                    diceRoll: { stat: 'dex', difficulty: 12 },
                    nextText: 11,
                    failText: 12
        
    }]},
    {
        id: 12,
        text: "You try to get the best of the wolf cub. \n It notices. \n It's not thrilled.",
        biome: 'forest',
        triggerEncounter: true,
        options: [
            {
                    text: "You have defeated the wolf cub. It's a clear shot home",
                    nextText: 11
                },
    ]},
    {
        id: 11,
        text: "You make it home. Nobody seems to notice that you slept in the woods \n You're safe, but you're not in the clear. \n On the fridge is a calendar, and today's date says: 'BARBIE DANCE CLUB SHOOT'.",
        biome: 'suburb',
        triggerEncounter: false,
        options: [
            {
                    text: "Barbie Dance Club Shoot? That's today?",
                    nextText: 13
                },
    ]},
    {  //not sure if i'm even using this anymore.... 
        id: 99,
        text: 'You leveled up! Congrats. Pick a stat to increase.',
        options: [
            {
                text: 'Strength',
                setState: (currentState) => ({ str: currentState.str + 1 }),
                nextText: null // This will be dynamically set
            },
            {
                text: 'Charisma',
                setState: (currentState) => ({ cha: currentState.cha + 1 }),
                nextText: null // This will be dynamically set
            },
            {
                text: 'Dexterity',
                setState: (currentState) => ({ dex: currentState.dex + 1 }),
                nextText: null // This will be dynamically set
            },
            {
                text: 'Intellect',
                setState: (currentState) => ({ int: currentState.int + 1 }),
                nextText: null // This will be dynamically set
            }
        ]
    },
    {
        id: 800,
        text: "Rifling through the pages, you see meticulous annotation on every article of clothing. \n On pieces that must be en mode, there is the most lavish praise. \n On pieces that are not, blistering critique. \n On the front, a phrase has been written on the young blonde cover-model's face. You feel a sense of dread.",
        biome: 'forest',
        triggerEncounter: false,
        options: [
            {
                    text: "What exactly is 'turbo-gay' anyway?",
                    diceRoll: { stat: 'cha', difficulty: 9 },
                    successModifiers: { xp: 10}, // Gain XP and lose health on success
                    failModifiers: { hp: -2 }, // Lose health and mana on failure    
                    nextText: 801,
                    failText: 851               
                },
                {
                    text: "I feel a sense of recognition to the cover.",
                    nextText: 802
                }
            ]
        },
        {
            id: 801,
            text: "Another reminder that it's hard being a boy who's into fashion in middle school. \n Pay the bullies no mind, and you'll go far. \n \n At least, according to Mom.",
            biome: 'forest',
            triggerEncounter: false,
            options: [
                {
                        text: "Mom, she gave me my name!",
                        nextText: 4               
                    },
                    {
                        text: "I need to understand 'turbo-gay' better.",
                        addItem: ['Turbo-Gay Face Cut-Out'],
                        removeItem: 'Outdated Magazine',
                        nextText: 803
                    }
                ]
            },
            {
                id: 802,
                text: "Because that is you. \n Or at least you a good 8 years ago as a pre-teen. \n You've been trying to break through for a while. \n Become a household name.",
                triggerEncounter: false,
                options: [
                    {
                            text: "Oh my god, my name! I know it now.",
                            nextText: 4               
                        },
                        {
                            text: "Cut out the vandalized version of my younger face.",
                            addItem: ['Turbo-Gay Face Cut-Out'],
                            removeItem: 'Outdated Magazine',
                            nextText: 803
                        }
                    ]
                }, 
                {
                    id: 803,
                    text: "In trying to understand your bullies, you now have a mask of your own younger face. \n With the word 'turbo-gay' written on the forehead. \n Can't wait to see what Sun-Tzu shit you get up to here..",
                    triggerEncounter: false,
                    options: [
                        {
                                text: "I feel like this isn't how the game should start. Do you want something from me?",
                                nextText: 4               
                            }
                        ]
                    },
        {
            id: 851,
            text: "It's what you are. Or at least the boys who wrote this thought so. \n The ungrafitti'd cover reads: 'Duane: Is He The New?'",
            biome: 'forest',
            triggerEncounter: false,
            options: [
                {
                        text: "Duane? That must be me.",
                        nextText: 4,
                    },
                    {
                        text: "I have no identity with that name, I must be someone else.",
                        nextText: 4
                    },
                    {
                        text: "That's not me. I'm ripping up this magazine and yelling my *true* name.",
                        diceRoll: { stat: 'str', difficulty: 15 },
                        successItems: ['Magazine Half of Justice', 'Magazine Half of Vengeance'], // Replace with actual item names
                        failItems: ['Turbo-Gay Face Cut-Out'], // Replace with actual item names
                        removeItem: 'Outdated Magazine',
                        nextText: 4,
                        failText: 4
                    }
                ]
            },   
    {
        id: 998,
    text: "Finally, it's about time the chosen one arrived.",
    options: [
        {
            text: "You're god-damned right.",
            setState: (currentState) => ({ cha: currentState.cha + 20, str: currentState.str + 20, dex: currentState.dex + 20, int: currentState.int + 20, level: currentState.level + 80 }),
            nextText: 5 // Ensure this is set to the correct next text node ID
        },
        {
            text: "Uhhh actually, it's Duane.",
            setState: (currentState) => ({
                name: 'Duane'
            }),
            nextText: 5
        }
    ]
},
{
    id: 999,
    text: 'Developed by NLH for Duanefest 2025. \n No generative AI was used in the making of this game. \n GitHub Co-Pilot was used to proofread coding errors.',
    options: [
        {
            text: 'Menu',
            nextText: 2 
        }
    ]
}];

// Library of equipment
let equipment = [
    {
        name: 'Helmet of Intellect',
        type: 'Head',
        bonuses: { int: 5 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Chestplate of Fortitude',
        type: 'Chest',
        bonuses: { hp: 20 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Leggings of Agility',
        type: 'Legs',
        bonuses: { dex: 5 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Boots of Speed',
        type: 'Feet',
        bonuses: { dex: 3 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Gloves of Strength',
        type: 'Hands',
        bonuses: { str: 5 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Outdated Magazine',
        type: 'Left Hand',
        bonuses: { cha: 2 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Magazine Half of Justice',
        type: 'Left Hand',
        bonuses: { int: 2 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Magazine Half of Vengeance',
        type: 'Right Hand',
        bonuses: { dex: 2 },
        equipped: false,
        quantity: 0
    },
    {
        name: 'Turbo-Gay Face Cut-Out',
        type: 'Head',
        bonuses: { str: -1, cha:5 },
        equipped: false,
        quantity: 0
    },
    // Add more equipment as needed
]


// Function to start the game
function startGame() {
    state = {
        hp: 1,
        xp: 0,
        mana: 1,
        str: 1,
        cha: 1,
        dex: 1,
        int: 1,
        level: 1,
        requiredXp: 10,
        inventory: [],
        statPoints: 0,
        name: '' // Add this property to store the player's name
    };
    showTextNode(1); // Call showTextNode with the initial text node ID
}

function showFloatingText(message) {
    const floatingTextElement = document.createElement('div');
    floatingTextElement.innerText = message;
    floatingTextElement.classList.add('floating-text');
    document.body.appendChild(floatingTextElement);

    // Position the floating text above the textbox
    const textBox = document.getElementById('text');
    const textBoxRect = textBox.getBoundingClientRect();
    floatingTextElement.style.left = `${textBoxRect.left + (textBoxRect.width / 2) - (floatingTextElement.offsetWidth / 2)}px`;
    floatingTextElement.style.top = `${textBoxRect.top - 126}px`; // Adjusted to appear higher

    // Animate the floating text
    setTimeout(() => {
        floatingTextElement.style.opacity = '0';
        floatingTextElement.style.transform = 'translateY(-20px)';
    }, 100);

    // Remove the floating text after the animation
    setTimeout(() => {
        document.body.removeChild(floatingTextElement);
    }, 2000);
}
// Function to display a text node
function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    if (!textNode) {
        console.error(`Text node with id ${textNodeIndex} not found`);
        return;
    }

    // Replace placeholder with player's name
    if (textNode.text.includes("{name}")) {
        textNode.text = textNode.text.replace("{name}", state.name);
    }

    textElement.innerText = textNode.text;
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }

    // Show input container only for TextNodeID 4
    const inputContainer = document.getElementById('input-container');
    if (textNodeIndex === 4) {
        inputContainer.classList.remove('hidden');
        document.getElementById('submit-button').onclick = () => {
            const playerInput = document.getElementById('player-input').value;
            handlePlayerInput(playerInput, textNodeIndex, textNode.nextText);
        };
    } else {
        inputContainer.classList.add('hidden');
        textNode.options.forEach(option => {
            if (showOption(option)) {
                const button = document.createElement('button');
                button.innerText = option.text;
                button.classList.add('btn');
                button.addEventListener('click', () => selectOption(option));
                optionButtonsElement.appendChild(button);
            }
        });
    }

    // Play audio if the text node has an audio property
    if (textNode.audio) {
        const audioElement = document.getElementById('background-audio');
        audioElement.src = textNode.audio;
        audioElement.play();
    }

    // Toggle stats visibility based on textNodeIndex
    if (textNodeIndex > 2) {
        statsElement.style.display = 'block';
    } else {
        statsElement.style.display = 'none';
    }

    // Show equipment menu button only on screen 3 or later
    const equipmentButton = document.getElementById('equipment-button');
    if (textNodeIndex >= 3) {
        equipmentButton.style.display = 'block';
    } else {
        equipmentButton.style.display = 'none';
    }
    checkLevelUp(); // Check for level up when showing a new text node
    updateStats(); // Ensure stats are updated when showing a new text node
}
//role dice
function rollDice(stat, difficulty) {
    const roll = Math.floor(Math.random() * 20) + 1; // Roll a 20-sided die
    return (roll + stat) >= difficulty;
}
//chance of success
function calculateSuccessProbability(stat, difficulty) {
    const successRolls = Math.max(0, 20 - difficulty + stat + 1);
    return Math.min(100, (successRolls / 20) * 100).toFixed(2);
}
// Function to handle player input
function handlePlayerInput(input, textNodeIndex, nextTextNodeId) {
    console.log('Player input:', input)
    if (textNodeIndex === 4) {
        if (input.toLowerCase() === "chale") {
            state.name = "Chale"
            const chalenextNodeId = 998 // Define a unique ID for the new text node
            const chaleTextNode = {
                id: chalenextNodeId,
                text: "Finally, it's about time the chosen one arrived.",
                options: [
                    {
                        text: "You're god-damned right.",
                        setState:(currentState) => ({ cha: currentState.cha + 20},{ str: currentState.str + 20},{ dex: currentState.dex + 20},{ int: currentState.int + 20}),
                        nextText: 5 // Adjust this to the appropriate next text node ID
                    },
                    {
                        text: "Uhhh actually, it's Duane.",
                        setState: (currentState) => ({ name: 'Duane'}),
                        nextText: 5
                    }
                ]
            }
            textNodes.push(chaleTextNode) // Add the new text node to the textNodes array
            showTextNode(chalenextNodeId) // Call showTextNode with the correct ID
        } else {
            state.name = "Duane"
            const duaneTextNode = {
                id: nextTextNodeId,
                biome: 'same',
                text: "That's right, your name is DUANE.",
                options: [
                    {
                        text: 'Wait what?',
                        nextText: 5 // Adjust this to the appropriate next text node ID
                    },
                    {
                        text: "*Nod wisely*",
                        setState: (currentState) => ({ int: currentState.int + 1 }),
                        nextText: 5
                    }
                ]
            }
            textNodes.push(duaneTextNode)
            showTextNode(nextTextNodeId)
        }
    } else {
        console.log('Input ignored for text node:', textNodeIndex)
    }
}

function selectOption(option) {
    let nextTextNodeId = option.nextText;
    console.log('Selected option:', option.text, 'Next Text Node ID:', nextTextNodeId);
    if (nextTextNodeId == null) {
        nextTextNodeId = state.previousTextNodeId; // Use the stored previousTextNodeId
    }
    if (nextTextNodeId == null || nextTextNodeId <= 0) {
        console.error('Invalid nextTextNodeId:', nextTextNodeId);
        return startGame(); // Restart the game if nextTextNodeId is less than or equal to 0
    }
    // Handle dice roll if specified in the option
    if (option.diceRoll) {
        const { stat, difficulty } = option.diceRoll;
        const rollSucceeded = rollDice(state[stat], difficulty);
        if (!rollSucceeded) {
            nextTextNodeId = option.failText || nextTextNodeId;
        }
        // Handle adding items based on dice roll result
        if (rollSucceeded && option.successItems) {
            option.successItems.forEach(item => addItemToInventory(item));
        } else if (!rollSucceeded && option.failItems) {
            option.failItems.forEach(item => addItemToInventory(item));
        }
        // Handle XP, health, and mana modifications based on roll result
        if (rollSucceeded && option.successModifiers) {
            applyModifiers(option.successModifiers);
        } else if (!rollSucceeded && option.failModifiers) {
            applyModifiers(option.failModifiers);
        }
    }
    // Handle state changes if specified in the option
    if (option.setState) {
        state = Object.assign(state, option.setState(state));
    }
    // Handle adding items to inventory if specified in the option
    if (option.addItem) {
        addItemToInventory(option.addItem);
    }
    // Handle removing items from inventory if specified in the option
    if (option.removeItem) {
        removeItemFromInventory(option.removeItem);
    }
    // Handle static XP, health, and mana modifications
    if (option.modifiers) {
        applyModifiers(option.modifiers);
    }
    // Skip combat-related logic
    showTextNode(nextTextNodeId);

    // Clear nextTextNodeId and duaneTextNode after specific options are selected
    if (option.text === 'Wait what?' || option.text === '*Nod wisely*') {
        nextTextNodeId = null;
        const duaneTextNodeIndex = textNodes.findIndex(node => node.text === "That's right, your name is DUANE.");
        if (duaneTextNodeIndex !== -1) {
            textNodes.splice(duaneTextNodeIndex, 1);
        }
    }
    //handle Biome change
    if (nextTextNodeId && textNodes[nextTextNodeId - 1]) { 
        handleBiomeChange(textNodes[nextTextNodeId - 1].biome); 
    }
}

// Function to apply modifiers to the state
function applyModifiers(modifiers) {
    if (modifiers.xp) {
        state.xp += modifiers.xp;
        showFloatingText(`${modifiers.xp} XP gained`);
    }
    if (modifiers.hp) {
        state.hp += modifiers.hp;
        if (state.hp < 0) {
            state.hp = 0;
        }
        showFloatingText(`${modifiers.hp} HP ${modifiers.hp > 0 ? 'gained' : 'lost'}`);
    }
    if (modifiers.mana) {
        state.mana += modifiers.mana;
        if (state.mana < 0) {
            state.mana = 0;
        }
        showFloatingText(`${modifiers.mana} Mana ${modifiers.mana > 0 ? 'gained' : 'lost'}`);
    }
    updateStats(); // Update the displayed stats
}
// Show Options
function showOption(option) {
    if (option.requiredState && !option.requiredState(state)) {
        return false;
    }
    if (option.diceRoll) {
        const { stat, difficulty } = option.diceRoll;
        const successProbability = calculateSuccessProbability(state[stat], difficulty);
        option.text += ` (${successProbability}% chance of success)`;
    }
    return true;
}
// Function to update the displayed stats
function showStatMenu() {
    const statsMenu = document.getElementById('stats-menu');
    statsMenu.classList.remove('hidden'); // Show the stat menu
    statsMenu.innerHTML = `
     
        <div>Strength: ${state.str} <button onclick="increaseStat('str')">+</button></div>
        <div>Charisma: ${state.cha} <button onclick="increaseStat('cha')">+</button></div>
        <div>Dexterity: ${state.dex} <button onclick="increaseStat('dex')">+</button></div>
        <div>Intellect: ${state.int} <button onclick="increaseStat('int')">+</button></div>
        <div>Level: ${state.level}</div>
        <div>Required XP for next level: ${state.requiredXp}</div>
    `;
}

function hideStatMenu() {
    const statsMenu = document.getElementById('stats-menu');
    statsMenu.classList.add('hidden'); // Hide the stat menu
}

function increaseStat(stat) {
    if (state.statPoints > 0 && state[stat] < MAX_STAT_VALUE) {
        state[stat] += 1;
        state.statPoints -= 1;
        updateStats();
    }
}


function updateStats() {
    // Reset bonuses
    let bonuses = {
        hp: 0,
        mana: 0,
        str: 0,
        cha: 0,
        dex: 0,
        int: 0
    };

    // Calculate total bonuses from equipped items
    state.inventory.forEach(item => {
        if (item.equipped && item.bonuses) {
            for (let stat in item.bonuses) {
                bonuses[stat] += item.bonuses[stat];
            }
        }
    });

    // Update the displayed stats with base stats plus bonuses
    document.getElementById('hp').innerText = state.hp + bonuses.hp;
    document.getElementById('xp').innerText = state.xp;
    document.getElementById('mana').innerText = state.mana + bonuses.mana;
    document.getElementById('str').innerText = state.str + bonuses.str;
    document.getElementById('cha').innerText = state.cha + bonuses.cha;
    document.getElementById('dex').innerText = state.dex + bonuses.dex;
    document.getElementById('int').innerText = state.int + bonuses.int;
    document.getElementById('level').innerText = state.level;
    document.getElementById('requiredXp').innerText = state.requiredXp;
    document.getElementById('stat-points').innerText = state.statPoints;

    // Toggle visibility of stat increase buttons based on available stat points
    const increaseButtons = document.querySelectorAll('.increase-btn');
    increaseButtons.forEach(button => {
        button.style.display = state.statPoints > 0 ? 'inline-block' : 'none';
    });
}
// equipment menus
function openEquipmentMenu() {
    const equipmentMenu = document.getElementById('equipment-menu');
    const equipmentList = document.getElementById('equipment-list');
    equipmentList.innerHTML = ''; // Clear the list

    state.inventory.forEach(item => {
        if (item.quantity > 0) { // Only show items with quantity greater than 0
            const listItem = document.createElement('li');
            listItem.innerText = `${item.name} (${item.equipped ? 'Equipped' : 'Unequipped'}) - Quantity: ${item.quantity}`;
            const equipButton = document.createElement('button');
            equipButton.innerText = item.equipped ? 'Unequip' : 'Equip';
            equipButton.onclick = () => {
                if (item.equipped) {
                    unequipItem(item.name);
                } else {
                    equipItem(item.name);
                }
                openEquipmentMenu(); // Refresh the menu
            };
            listItem.appendChild(equipButton);
            equipmentList.appendChild(listItem);
        }
    });

    equipmentMenu.style.display = 'block';
}

function closeEquipmentMenu() {
    const equipmentMenu = document.getElementById('equipment-menu');
    equipmentMenu.style.display = 'none';
}

//equip and unequip
function equipItem(itemName) {
    console.log(`Attempting to equip item: ${itemName}`);
    const item = state.inventory.find(i => i.name === itemName);
    if (item) {
        item.equipped = true;
        console.log(`Equipped item: ${itemName}`);
        applyEquipmentBonuses();
        updateStats(); // Update the displayed stats
        openEquipmentMenu(); // Refresh the menu
    } else {
        console.log(`Item not found in inventory: ${itemName}`);
    }
}

function unequipItem(itemName) {
    console.log(`Attempting to unequip item: ${itemName}`);
    const item = state.inventory.find(i => i.name === itemName);
    if (item) {
        item.equipped = false;
        console.log(`Unequipped item: ${itemName}`);
        applyEquipmentBonuses();
        updateStats(); // Update the displayed stats
        openEquipmentMenu(); // Refresh the menu
    } else {
        console.log(`Item not found in inventory: ${itemName}`);
    }
}
function applyEquipmentBonuses() {
    // Reset bonuses
    let bonuses = {
        hp: 0,
        mana: 0,
        str: 0,
        cha: 0,
        dex: 0,
        int: 0
    };

    // Calculate total bonuses from equipped items
    state.inventory.forEach(item => {
        if (item.equipped && item.bonuses) {
            for (let stat in item.bonuses) {
                if (bonuses.hasOwnProperty(stat)) {
                    bonuses[stat] += item.bonuses[stat];
                }
            }
        }
    });

    // Apply bonuses to player's stats
    for (let stat in bonuses) {
        if (state.hasOwnProperty(stat)) {
            state[stat] += bonuses[stat];
            if (state[stat] > MAX_STAT_VALUE) {
                state[stat] = MAX_STAT_VALUE; // Cap the stat at MAX_STAT_VALUE
            }
        }
    }
}
// Inventory
function addItemToInventory(itemName) {
    const item = equipment.find(i => i.name === itemName);
    if (item) {
        const inventoryItem = state.inventory.find(i => i.name === itemName);
        if (inventoryItem) {
            inventoryItem.quantity += 1;
        } else {
            state.inventory.push({ ...item, quantity: 1 });
        }
        showFloatingText(`${itemName} acquired`);
    }
}

function removeItemFromInventory(itemName) {
    const inventoryItem = state.inventory.find(i => i.name === itemName);
    if (inventoryItem && inventoryItem.quantity > 0) {
        inventoryItem.quantity -= 1;
        if (inventoryItem.quantity === 0) {
            state.inventory = state.inventory.filter(i => i.name !== itemName);
        }
        showFloatingText(`${itemName} lost`);
    }
}

// Function to check for level up
function checkLevelUp() {
    while (state.xp >= state.requiredXp) {
        state.level += 1;
        state.xp -= state.requiredXp;
        state.statPoints += 1; // Earn one stat point per level gained

        // Show "Level Up" floating text
        showFloatingText('Level Up', window.innerWidth / 2, window.innerHeight / 2);

        // Update stats and UI
        updateStats();
    }
}

function calculateNextLevelXp(level) {
    // Define your logic to calculate the required XP for the next level
    return level * 100; // Example logic
}
function gainExperience(amount) {
    state.xp += amount;
    checkLevelUp();
    updateStats();
}

startGame() // Start the game

