        const garden = document.getElementById('garden');
        const affirmationInput = document.getElementById('affirmation-input');
        const submitBtn = document.getElementById('submit-btn');
        const moodSelect = document.getElementById('mood-select');
        const plantCountElement = document.getElementById('plant-count');
        const currentSeasonElement = document.getElementById('current-season');
        const soundscapeToggle = document.getElementById('soundscape-toggle');

        let plantCount = 0;
        let currentSeason = 'Spring';
        let soundscapeEnabled = false;

        const plants = {
            happy: ['🪻', '🌼', '🌺'],
            calm: ['🌿', '🍃', '🌱'],
            energetic: ['🌴', '🌳', '🌲'],
            reflective: ['🍁', '🍂', '🌹']
        };

        const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
        const seasonBackgrounds = {
            Spring: 'spring-background',
            Summer: 'summer-background',
            Autumn: 'autumn-background',
            Winter: 'winter-background'
        };

        const soundscape = new Howl({
            src: ['garden.mp3'],
            loop: true,
            volume: 1
        });

        let currentPotIndex = 0;

        function createPlant(affirmation, mood, size = '20px', shouldGrow = true) {
            const plant = document.createElement('div');
            plant.className = 'plant';
            plant.textContent = plants[mood][Math.floor(Math.random() * plants[mood].length)];
            plant.style.fontSize = size;
            plant.dataset.affirmation = affirmation;
            plant.dataset.mood = mood;

            plant.addEventListener('click', () => {
                showAffirmation(plant);
            });

            const pot = document.createElement('div');
            pot.className = 'flower-pot';
            pot.appendChild(plant);
            garden.appendChild(pot);

            plantCount++;
            updateGardenStats();

            if (shouldGrow) {
                growPlant(plant);
                saveAffirmation(affirmation, mood);
            }
            saveGardenState();
        }

        function growPlant(plant) {
            let size = parseInt(plant.style.fontSize);
            let growth = 0;
            const maxGrowth = 100;
            const growthInterval = setInterval(() => {
                growth += Math.random() * 5;
                size = 20 + (growth / maxGrowth) * 60;
                plant.style.fontSize = `${size}px`;
                if (growth >= maxGrowth) {
                    clearInterval(growthInterval);
                    plant.classList.add('fully-grown');
                }
                saveGardenState();
            }, 1000);
        }

        function showAffirmation(plant) {
            const affirmation = plant.dataset.affirmation;
            const mood = plant.dataset.mood;
            alert(`Affirmation: "${affirmation}"\nMood: ${mood}`);
        }

        function updateGardenStats() {
            plantCountElement.textContent = plantCount;
            currentSeasonElement.textContent = currentSeason;
        }

        function changeSeasons() {
            let seasonIndex = 0;
            function nextSeason() {
                seasonIndex = (seasonIndex + 1) % seasons.length;
                currentSeason = seasons[seasonIndex];
                garden.className = seasonBackgrounds[currentSeason];
                updateGardenStats();
            }
            setInterval(nextSeason, 60000); // Change every minute for demo purposes
        }

        submitBtn.addEventListener('click', () => {
            const affirmation = affirmationInput.value.trim();
            const mood = moodSelect.value;
            if (affirmation) {
                createPlant(affirmation, mood);
                affirmationInput.value = '';
            }
        });

        soundscapeToggle.addEventListener('click', () => {
            soundscapeEnabled = !soundscapeEnabled;
            if (soundscapeEnabled) {
                
                soundscape.play();
                soundscapeToggle.textContent = '🔊';
            } else {
                soundscape.pause();
                soundscapeToggle.textContent = '🔇';
            }
        });

        function addButterflies() {
        const maxButterflies = 7;
        const butterflies = [];

        function createButterfly() {
            if (butterflies.length >= maxButterflies) return;

            const butterfly = document.createElement('div');
            butterfly.textContent = '🦋';
            butterfly.style.position = 'absolute';
            butterfly.style.fontSize = '20px';

            // Randomly choose a starting position
            let posX = Math.random() * window.innerWidth;
            let posY = Math.random() * window.innerHeight;

            butterfly.style.left = `${posX}px`;
            butterfly.style.top = `${posY}px`;
            garden.appendChild(butterfly);
            butterflies.push(butterfly);

            let directionX = Math.random() > 0.5 ? 1 : -1;
            let directionY = Math.random() > 0.5 ? 1 : -1;

            const flight = setInterval(() => {
                posX += directionX * 2;
                posY += directionY * 2;

                // Bounce off the edges
                if (posX <= 0 || posX >= window.innerWidth - 20) {
                    directionX *= -1;
                }
                if (posY <= 0 || posY >= window.innerHeight - 20) {
                    directionY *= -1;
                }

                butterfly.style.left = `${posX}px`;
                butterfly.style.top = `${posY}px`;

                // Randomly change direction
                if (Math.random() < 0.02) {
                    directionX = Math.random() > 0.5 ? 1 : -1;
                    directionY = Math.random() > 0.5 ? 1 : -1;
                }
            }, 50);

            // Remove butterfly after a certain time
            setTimeout(() => {
                clearInterval(flight);
                garden.removeChild(butterfly);
                butterflies.splice(butterflies.indexOf(butterfly), 1);
            }, 30000); // Remove after 30 seconds
        }

        setInterval(createButterfly, 3000);
    }

        // Remove the addMilestones function entirely

        function saveAffirmation(affirmation, mood) {
            fetch('/save-affirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ affirmation, mood }),
            });
        }

        function loadGardenState() {
            const savedState = localStorage.getItem('gardenState');
            if (savedState) {
                const plants = JSON.parse(savedState);
                garden.innerHTML = ''; // Clear existing plants
                plantCount = 0; // Reset plant count
                plants.forEach(plant => {
                    createPlant(plant.affirmation, plant.mood, plant.size, false);
                });
            }
        }

        // Remove the initializeGarden function and its call

        // Call this function when the page loads
        // initializeGarden();

        loadGardenState();

        // Initialize the garden
        changeSeasons();
        addButterflies();
        loadGardenState(); // This single call is sufficient

        function saveGardenState() {
            const plants = Array.from(garden.querySelectorAll('.plant')).map(plant => ({
                affirmation: plant.dataset.affirmation,
                mood: plant.dataset.mood,
                size: plant.style.fontSize
            }));
            localStorage.setItem('gardenState', JSON.stringify(plants));
        }

        function loadAffirmations() {
            loadGardenState();
        }