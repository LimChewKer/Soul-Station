const circle = document.getElementById('circle');
        const message = document.getElementById('message');
        const instructions = document.getElementById('instructions');
        let isExpanding = true;
        let totalTime;
        let remainingTime;
        let breatheInterval;
        let timerInterval;

        function breathe() {
            if (isExpanding) {
                circle.style.transform = 'translate(-50%, -50%) scale(1.5)';
                message.textContent = 'Breathe in...';
            } else {
                circle.style.transform = 'translate(-50%, -50%) scale(1)';
                message.textContent = 'Breathe out...';
            }

            isExpanding = !isExpanding;

            if (remainingTime <= 0) {
                clearInterval(breatheInterval);
                clearInterval(timerInterval);
                message.textContent = 'Great job! You\'ve completed your breathing exercise.';
                instructions.textContent = 'Select a duration and click Start to begin again';
                circle.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }

        function updateTimer() {
            remainingTime--;
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            document.getElementById('timer').textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
            }
        }

        function startExercise() {
            const duration = parseInt(document.getElementById('duration').value);
            totalTime = duration * 60; // Convert minutes to seconds
            remainingTime = totalTime;
            
            clearInterval(breatheInterval);
            clearInterval(timerInterval);
            
            breatheInterval = setInterval(breathe, 4000);
            timerInterval = setInterval(updateTimer, 1000);
            
            breathe();
            updateTimer();
            instructions.textContent = 'Follow the circle: Breathe in as it expands, breathe out as it shrinks';
        }