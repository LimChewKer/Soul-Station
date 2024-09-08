let player = {
    stress: 100,
    energy: 50,
    coins: 0,
    model: null,
    speed: 0.1,
    jumpStamina: 0,
    maxJumpStamina: 500,
    isJumping: false,
    jumpHeight: 0
};

let scene, camera, renderer, controls;
let meditationGarden, zenPuzzle, relaxationShop;
let buildings = [];
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let rotateLeft = false, rotateRight = false, rotateUp = false, rotateDown = false;
let jumpKeyPressed = false;

let usedMeditationQuestions = [];
let usedPuzzles = [];

let affirmationDog; // Add this line near the top with other global variables
let lastAffirmationTime = 0;
const affirmationCooldown = 5000; // 5 seconds cooldown

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-area').appendChild(renderer.domElement);

    // Create a realistic grass field
    const groundSize = 50;
    const groundSegments = 100;
    const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, groundSegments, groundSegments);
    
    // Load grass texture
    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(5, 5);

    // Load normal map for added depth
    const grassNormalMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/terrain/grasslight-big-nm.jpg');
    grassNormalMap.wrapS = THREE.RepeatWrapping;
    grassNormalMap.wrapT = THREE.RepeatWrapping;
    grassNormalMap.repeat.set(5, 5);

    const groundMaterial = new THREE.MeshStandardMaterial({ 
        map: grassTexture,
        normalMap: grassNormalMap,
        roughness: 0.8,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add subtle height variation to the ground
    const vertices = ground.geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = Math.random() * 0.3;
    }
    ground.geometry.attributes.position.needsUpdate = true;
    ground.geometry.computeVertexNormals();

    // Create chests with labels
    meditationGarden = createChest(-15, 0, -15, 'Random Quiz 1');
    zenPuzzle = createChest(0, 0, -15, 'Random Quiz 2');
    relaxationShop = createChest(15, 0, -15, 'Item Shop');

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Optional: Add a subtle haze effect
    scene.fog = new THREE.Fog(0xcccccc, 10, 50);

    createDogCharacter();
    createAffirmationDog(); // Add this line
    setupControls();
    animate();
}

function createChest(x, y, z, name) {
    const chestGroup = new THREE.Group();

    // Create the main body of the chest
    const bodyGeometry = new THREE.BoxGeometry(3, 2, 2);
    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/wood.jpg');
    const bodyMaterial = new THREE.MeshPhongMaterial({ map: woodTexture });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    chestGroup.add(bodyMesh);

    // Create the lid of the chest
    const lidGeometry = new THREE.BoxGeometry(3, 0.5, 2);
    const lidMesh = new THREE.Mesh(lidGeometry, bodyMaterial);
    lidMesh.position.y = 1.25;
    chestGroup.add(lidMesh);

    // Add some decorative elements (e.g., golden bands)
    const bandGeometry = new THREE.BoxGeometry(3.1, 0.2, 2.1);
    const goldMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
    const bottomBand = new THREE.Mesh(bandGeometry, goldMaterial);
    bottomBand.position.y = -0.9;
    chestGroup.add(bottomBand);

    const topBand = new THREE.Mesh(bandGeometry, goldMaterial);
    topBand.position.y = 0.9;
    chestGroup.add(topBand);

    // Add a lock
    const lockGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.3);
    const lockMesh = new THREE.Mesh(lockGeometry, goldMaterial);
    lockMesh.position.set(0, 0.5, 1);
    chestGroup.add(lockMesh);

    // Add text above the chest
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const textGeometry = new THREE.TextGeometry(name, {
            font: font,
            size: 0.5,
            height: 0.1,
        });
        const textMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        
        // Center the text
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        textMesh.position.set(-textWidth / 2, 2.5, 0);
        
        chestGroup.add(textMesh);
    });

    chestGroup.position.set(x, y + 1, z);
    chestGroup.castShadow = true;
    chestGroup.receiveShadow = true;
    chestGroup.name = name;
    scene.add(chestGroup);
    buildings.push(chestGroup);

    return chestGroup;
}

function createDogCharacter() {
    const dogGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xFFB0CB });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.5;
    dogGroup.add(bodyMesh);

    // Head
    const headGeometry = new THREE.BoxGeometry(1, 1, 1);
    const headMesh = new THREE.Mesh(headGeometry, bodyMaterial);
    headMesh.position.set(0, 1.25, 0.75);
    dogGroup.add(headMesh);

    // Snout
    const snoutGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const snoutMesh = new THREE.Mesh(snoutGeometry, bodyMaterial);
    snoutMesh.position.set(0, 1.05, 1.2);
    dogGroup.add(snoutMesh);

    // Ears
    const earGeometry = new THREE.ConeGeometry(0.2, 0.5, 4);
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(0.3, 1.8, 0.75);
    leftEar.rotation.z = -Math.PI / 4;
    dogGroup.add(leftEar);
    const rightEar = leftEar.clone();
    rightEar.position.x = -0.3;
    rightEar.rotation.z = Math.PI / 4;
    dogGroup.add(rightEar);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.6);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const legPositions = [
        [-0.5, 0.3, 0.7],  // Front left
        [0.5, 0.3, 0.7],   // Front right
        [-0.5, 0.3, -0.7], // Back left
        [0.5, 0.3, -0.7]   // Back right
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        dogGroup.add(leg);
    });

    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.1, 0.05, 0.8, 8);
    const tailMesh = new THREE.Mesh(tailGeometry, bodyMaterial);
    tailMesh.position.set(0, 0.8, -1.2);
    tailMesh.rotation.x = Math.PI / 4;
    dogGroup.add(tailMesh);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.25, 1.4, 1.2);
    dogGroup.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.x = -0.25;
    dogGroup.add(rightEye);

    // Nose
    const noseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const noseMesh = new THREE.Mesh(noseGeometry, noseMaterial);
    noseMesh.position.set(0, 1.1, 1.5);
    dogGroup.add(noseMesh);

    dogGroup.castShadow = true;
    dogGroup.receiveShadow = true;
    scene.add(dogGroup);

    player.model = dogGroup;
    player.model.position.set(0, 0, 0);
}

function createAffirmationDog() {
    const dogGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x4B0082 }); // Indigo color
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 0.5;
    dogGroup.add(bodyMesh);

    // Head
    const headGeometry = new THREE.BoxGeometry(1, 1, 1);
    const headMesh = new THREE.Mesh(headGeometry, bodyMaterial);
    headMesh.position.set(0, 1.25, 0.75);
    dogGroup.add(headMesh);

    // Snout
    const snoutGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const snoutMesh = new THREE.Mesh(snoutGeometry, bodyMaterial);
    snoutMesh.position.set(0, 1.05, 1.2);
    dogGroup.add(snoutMesh);

    // Ears
    const earGeometry = new THREE.ConeGeometry(0.2, 0.5, 4);
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(0.3, 1.8, 0.75);
    leftEar.rotation.z = -Math.PI / 4;
    dogGroup.add(leftEar);
    const rightEar = leftEar.clone();
    rightEar.position.x = -0.3;
    rightEar.rotation.z = Math.PI / 4;
    dogGroup.add(rightEar);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.6);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x3A006F }); // Darker indigo
    const legPositions = [
        [-0.5, 0.3, 0.7],  // Front left
        [0.5, 0.3, 0.7],   // Front right
        [-0.5, 0.3, -0.7], // Back left
        [0.5, 0.3, -0.7]   // Back right
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        dogGroup.add(leg);
    });

    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.1, 0.05, 0.8, 8);
    const tailMesh = new THREE.Mesh(tailGeometry, bodyMaterial);
    tailMesh.position.set(0, 0.8, -1.2);
    tailMesh.rotation.x = Math.PI / 4;
    dogGroup.add(tailMesh);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.25, 1.4, 1.2);
    dogGroup.add(leftEye);
    const rightEye = leftEye.clone();
    rightEye.position.x = -0.25;
    dogGroup.add(rightEye);

    // Nose
    const noseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const noseMesh = new THREE.Mesh(noseGeometry, noseMaterial);
    noseMesh.position.set(0, 1.1, 1.5);
    dogGroup.add(noseMesh);

    dogGroup.castShadow = true;
    dogGroup.receiveShadow = true;
    dogGroup.position.set(10, 0, 10); // Position the affirmation dog
    scene.add(dogGroup);

    affirmationDog = dogGroup;
}

function setupControls() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
        case 'ArrowLeft': rotateLeft = true; break;
        case 'ArrowRight': rotateRight = true; break;
        case 'ArrowUp': rotateUp = true; break;
        case 'ArrowDown': rotateDown = true; break;
        case 'Space': 
            if (!jumpKeyPressed && !player.isJumping) {
                jumpKeyPressed = true;
                chargeJump();
            }
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
        case 'ArrowLeft': rotateLeft = false; break;
        case 'ArrowRight': rotateRight = false; break;
        case 'ArrowUp': rotateUp = false; break;
        case 'ArrowDown': rotateDown = false; break;
        case 'Space': 
            if (jumpKeyPressed) {
                jumpKeyPressed = false;
                jump();
            }
            break;
    }
}

function chargeJump() {
    if (jumpKeyPressed && player.jumpStamina < player.maxJumpStamina) {
        player.jumpStamina += 2;
        setTimeout(chargeJump, 6); // Roughly 60 times per second
    }
}

function jump() {
    if (!player.isJumping) {
        player.isJumping = true;
        player.jumpHeight = player.jumpStamina / 120 * 3 + 2; // Max jump height of 3 units
        player.jumpStamina = 0;
        performJump();
    }
}

function performJump() {
    if (player.jumpHeight > 0) {
        player.model.position.y += 0.1;
        player.jumpHeight -= 0.1;
        setTimeout(performJump, 3.54);
    } else {
        land();
    }
}

function land() {
    if (player.model.position.y > 0) {
        player.model.position.y -= 0.1;
        setTimeout(land, 3.5);
    } else {
        player.model.position.y = 0;
        player.isJumping = false;
    }
}

function movePlayer() {
    const direction = new THREE.Vector3();
    
    if (moveForward) direction.z -= 1;
    if (moveBackward) direction.z += 1;
    if (moveLeft) direction.x -= 1;
    if (moveRight) direction.x += 1;

    direction.normalize();
    const newPosition = player.model.position.clone().addScaledVector(direction, player.speed);

    // Check collision with affirmation dog
    if (newPosition.distanceTo(affirmationDog.position) < 2) {
        const currentTime = Date.now();
        if (currentTime - lastAffirmationTime > affirmationCooldown) {
            provideAffirmation();
            lastAffirmationTime = currentTime;
            resetPlayerPosition(); // Add this line
            return; // Add this line to prevent further movement
        }
    }

    // Limit player movement within the ground boundaries
    const groundSize = 50;
    const halfGroundSize = groundSize / 2;
    newPosition.x = Math.max(-halfGroundSize, Math.min(halfGroundSize, newPosition.x));
    newPosition.z = Math.max(-halfGroundSize, Math.min(halfGroundSize, newPosition.z));

    player.model.position.copy(newPosition);

    if (rotateLeft) player.model.rotation.y += 0.05;
    if (rotateRight) player.model.rotation.y -= 0.05;

    camera.position.x = player.model.position.x;
    camera.position.y = player.model.position.y + 5;
    camera.position.z = player.model.position.z + 10;
    camera.lookAt(player.model.position);

    checkBuildingInteractions();
}

function checkBuildingInteractions() {
    buildings.forEach(building => {
        if (player.model.position.distanceTo(building.position) < 4) {
            switch (building.name) {
                case 'Random Quiz 1': 
                    meditateInGarden();
                    break;
                case 'Random Quiz 2': 
                    solvePuzzle();
                    break;
                case 'Item Shop': 
                    visitShop();
                    break;
            }
            resetPlayerPosition();
        }
    });
}

function resetPlayerPosition() {
    player.model.position.set(0, 0, 0);
    player.model.rotation.set(0, 0, 0);
    resetMovementKeys(); // Add this line
}

// Add this new function
function resetMovementKeys() {
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    rotateLeft = false;
    rotateRight = false;
    rotateUp = false;
    rotateDown = false;
    jumpKeyPressed = false;
}

function animate() {
    requestAnimationFrame(animate);
    movePlayer();
    
    // Update jump stamina UI
    updateJumpStaminaUI();
    
    renderer.render(scene, camera);
}

function updateJumpStaminaUI() {
    // Assuming you have a div with id 'jump-stamina' in your HTML
    const jumpStaminaElement = document.getElementById('jump-stamina');
    if (jumpStaminaElement) {
        jumpStaminaElement.style.width = `${player.jumpStamina}%`;
    }
}

function updateStats() {
    document.getElementById('stress').textContent = player.stress;
    document.getElementById('energy').textContent = player.energy;
    document.getElementById('coins').textContent = player.coins;

    // Check if stress is 0
    if (player.stress === 0) {
        congratulateAndRedirect();
    }
}

function congratulateAndRedirect() {
    const message = "Congratulations! You've managed to reduce your stress to 0. Would you like to return to the main menu?";
    if (confirm(message)) {
        try {
            window.location.href = 'main.html';
        } catch (error) {
            console.error("Error redirecting to main.html:", error);
            alert("There was an error returning to the main menu. Please try refreshing the page.");
        }
    }
}

function meditateInGarden() {
    const questions = [
        { q: "What is the practice of focusing one's mind for a period of time?", a: "meditation" },
        { q: "What is the Japanese word for 'mindfulness'?", a: "shoshin" },
        { q: "What is the term for a state of active, open attention on the present?", a: "mindfulness" },
        { q: "What technique involves focusing on your breath to calm the mind?", a: "breathing" },
        { q: "What is the name of the seated posture often used in meditation?", a: "lotus" }
    ];

    // Reset used questions if all have been asked
    if (usedMeditationQuestions.length === questions.length) {
        usedMeditationQuestions = [];
    }

    // Filter out used questions
    const availableQuestions = questions.filter(q => !usedMeditationQuestions.includes(q));
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    const question = availableQuestions[questionIndex];

    // Add the question to used questions
    usedMeditationQuestions.push(question);

    const answer = prompt(question.q);
    if (answer && answer.toLowerCase() === question.a) {
        player.stress = Math.max(0, player.stress - Math.floor(Math.random() * 11) - 10);
        player.energy = Math.min(100, player.energy + Math.floor(Math.random() * 11) + 10);
        player.coins += Math.floor(Math.random() * 10) + 5;
        alert("Correct! You feel deeply relaxed after meditating.");
    } else {
        player.stress = Math.max(0, player.stress - 5);
        player.energy = Math.max(0, player.energy - 10);
        player.coins += 1;
        alert("That's not quite right. You lose some energy, but the attempt at meditation was still somewhat helpful.");
    }
    updateStats();
    checkGameOver();
}

function solvePuzzle() {
    const puzzles = [
        { q: "Unscramble: AXREL", a: "relax" },
        { q: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?", a: "fire" },
        { q: "What goes up but never comes down?", a: "age" },
        { q: "I'm tall when I'm young, and short when I'm old. What am I?", a: "candle" },
        { q: "What has keys, but no locks; space, but no room; you can enter, but not go in?", a: "keyboard" }
    ];

    // Reset used puzzles if all have been asked
    if (usedPuzzles.length === puzzles.length) {
        usedPuzzles = [];
    }

    // Filter out used puzzles
    const availablePuzzles = puzzles.filter(p => !usedPuzzles.includes(p));
    const puzzleIndex = Math.floor(Math.random() * availablePuzzles.length);
    const puzzle = availablePuzzles[puzzleIndex];

    // Add the puzzle to used puzzles
    usedPuzzles.push(puzzle);

    const answer = prompt(puzzle.q);
    if (answer && answer.toLowerCase() === puzzle.a) {
        player.stress = Math.max(0, player.stress - 20);
        player.coins += 15;
        alert("Excellent! You solved the puzzle and feel a sense of accomplishment.");
    } else {
        player.stress = Math.max(0, player.stress - 5);
        player.energy = Math.max(0, player.energy - 10);
        player.coins += 2;
        alert("That's not correct. You lose some energy, but don't worry. Every attempt helps you learn and grow.");
    }
    updateStats();
    checkGameOver();
}

function visitShop() {
    const items = [
        { name: "Stress Ball", cost: 5, effect: 15 },
        { name: "Calming Tea", cost: 10, effect: 25 },
        { name: "Meditation Cushion", cost: 15, effect: 35 },
        { name: "Aromatherapy Diffuser", cost: 20, effect: 40 },
        { name: "Noise-Cancelling Headphones", cost: 25, effect: 50 }
    ];

    const itemList = items.map((item, index) => `${index + 1}. ${item.name} (Cost: ${item.cost} coins, Effect: -${item.effect} stress)`).join("\n");
    const choice = prompt(`Welcome to the Relaxation Shop! Choose an item to buy:\n${itemList}\n\nEnter the number of your choice:`);

    if (choice && !isNaN(choice) && choice > 0 && choice <= items.length) {
        const item = items[choice - 1];
        if (player.coins >= item.cost) {
            player.coins -= item.cost;
            player.stress = Math.max(0, player.stress - item.effect);
            updateStats();
            alert(`You bought the ${item.name}! Your stress decreases by ${item.effect} points.`);
        } else {
            alert("Not enough coins. Try earning more by meditating or solving puzzles!");
        }
    } else {
        alert("Invalid choice. No purchase made.");
    }
}

function checkGameOver() {
    if (player.energy <= 0) {
        alert("Game Over! You've run out of energy. The game will reset.");
        resetGame();
    }
}

function resetGame() {
    player.stress = 100;
    player.energy = 50;
    player.coins = 0;
    player.model.position.set(0, 0, 0);
    player.model.rotation.set(0, 0, 0);
    updateStats();
}

function provideAffirmation() {
    const affirmations = [
        "You are capable of amazing things!",
        "Your potential is limitless!",
        "You make a difference in the world!",
        "Your presence lights up the room!",
        "You are strong and resilient!",
        "Your kindness matters!",
        "You are worthy of love and respect!",
        "Your efforts are paying off!",
        "You inspire others with your actions!",
        "Your smile brightens someone's day!"
    ];

    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    alert("Affirmation Dog says: " + randomAffirmation);
    
    // Reduce stress and increase energy slightly
    player.stress = Math.max(0, player.stress - 5);
    player.energy = Math.min(100, player.energy + 5);
    updateStats();
}

window.addEventListener('load', init);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

updateStats();