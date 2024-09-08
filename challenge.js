let endTime;
let challengeDuration;
let timerInterval;

function startChallenge(challengeId, duration) {
    // Hide the result box if it's visible
    document.getElementById('challenge-result').style.display = 'none';

    challengeDuration = duration;
    endTime = new Date().getTime() + challengeDuration * 1000; // Set end time based on current time + duration
    document.getElementById('timer-container').style.display = 'block';
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const remainingTime = Math.max(0, endTime - currentTime); // Ensure remaining time doesn't go negative

    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (remainingTime === 0) {
        clearInterval(timerInterval);
        showResult('Congratulations! You completed the challenge.');
    }
}

function endChallenge() {
    clearInterval(timerInterval);

    const currentTime = new Date().getTime();
    const remainingTime = Math.max(0, endTime - currentTime); // Ensure remaining time doesn't go negative

    if (remainingTime === 0) {
        showResult('Congratulations! You completed the challenge.');
    } else {
        showResult('You failed! Try again.');
    }
}

function showResult(message) {
    document.getElementById('timer-container').style.display = 'none';
    document.getElementById('challenge-result').style.display = 'block';
    document.getElementById('challenge-message').textContent = message;
}

function closeResult() {
    document.getElementById('challenge-result').style.display = 'none';
    document.getElementById('timer').textContent = '00:00';
}
