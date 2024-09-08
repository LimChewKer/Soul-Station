// Create or get the audio element
let audio = document.getElementById('background-audio');
if (!audio) {
    audio = new Audio('download.mp3');
    audio.id = 'background-audio';
    audio.loop = true;
    document.body.appendChild(audio);
}

// Function to update play button text
function updatePlayButtonText() {
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.textContent = audio.paused ? 'Play' : 'Pause';
    }
}

// Function to play audio
function playAudio() {
    audio.play().then(() => {
        sessionStorage.setItem('isPlaying', 'true');
        updatePlayButtonText();
    }).catch(error => {
        console.error('Audio play failed:', error);
        sessionStorage.setItem('isPlaying', 'false');
        updatePlayButtonText();
    });
}

// Function to pause audio
function pauseAudio() {
    audio.pause();
    sessionStorage.setItem('isPlaying', 'false');
    updatePlayButtonText();
}

// Function to toggle play/pause
function toggleAudio() {
    if (audio.paused) {
        playAudio();
    } else {
        pauseAudio();
    }
}

// Set up initial state and auto-play
function initAudio() {
    const isPlaying = sessionStorage.getItem('isPlaying') !== 'false';
    const currentTime = parseFloat(sessionStorage.getItem('currentTime')) || 0;

    audio.currentTime = currentTime;

    if (isPlaying) {
        playAudio();
    } else {
        updatePlayButtonText();
    }
}

// Save current time periodically
setInterval(() => {
    if (!audio.paused) {
        sessionStorage.setItem('currentTime', audio.currentTime.toString());
    }
}, 1000);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        initAudio();
    }
});

// Set up play button and initialize audio
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play-button');
    if (playButton) {
        playButton.addEventListener('click', toggleAudio);
    }
    initAudio();
});

// Attempt to play audio when the window loads
window.addEventListener('load', initAudio);

// Handle page unload
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('currentTime', audio.currentTime.toString());
    sessionStorage.setItem('isPlaying', audio.paused ? 'false' : 'true');
});