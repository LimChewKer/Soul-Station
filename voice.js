// Function to convert text to speech
function speak(text) {
    if ('speechSynthesis' in window) {
        console.log('Attempting to speak:', text); // Debugging line
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = function() {
            console.log('Speech started');
        };
        utterance.onerror = function(event) {
            console.error('Speech synthesis error:', event);
        };
        speechSynthesis.speak(utterance);
    } else {
        console.error('Speech synthesis not supported.');
        alert('Sorry, your browser does not support text-to-speech.');
    }
}

// Function to create a tab with a microphone icon next to the selected text
function showSpeakTab(x, y) {
    // Remove any existing speak tab
    const existingTab = document.getElementById('speak-tab');
    if (existingTab) {
        existingTab.remove();
    }

    // Create a new tab element
    const tab = document.createElement('div');
    tab.id = 'speak-tab';
    tab.style.position = 'absolute';
    tab.style.left = `${x}px`;
    tab.style.top = `${y}px`;
    tab.style.padding = '5px';
    tab.style.backgroundColor = 'white';
    tab.style.border = '1px solid #ccc';
    tab.style.borderRadius = '5px';
    tab.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    tab.style.cursor = 'pointer';
    tab.style.display = 'flex';
    tab.style.alignItems = 'center';
    tab.style.zIndex = '1000';

    // Create an icon element inside the tab
    const icon = document.createElement('img');
    icon.src = 'play.png';  // Ensure this path is correct
    icon.style.width = '20px';
    icon.style.height = '20px';

    // Append the icon to the tab
    tab.appendChild(icon);

    // Handle the click event for the tab
    tab.onclick = function(event) {
        event.stopPropagation(); // Prevent other click events
        const selectedText = window.getSelection().toString().trim(); // Get the selected text
        if (selectedText) {
            speak(selectedText); // Speak the selected text
        } else {
            console.warn('No text selected when clicking speak tab.');
        }
    };

    // Append the tab to the document body
    document.body.appendChild(tab);
}

// Event listener for text selection
document.addEventListener('mouseup', function(e) {
    setTimeout(function() {
        const selectedText = window.getSelection().toString().trim(); // Get the selected text
        if (selectedText) {
            const range = window.getSelection().getRangeAt(0).getBoundingClientRect();
            const x = range.left + window.scrollX + 10;  // Slight offset to the right
            const y = range.top + window.scrollY + 10;  // Slight offset below
            showSpeakTab(x, y); // Show the tab near the selected text
        } else {
            // Remove the tab if no text is selected
            const existingTab = document.getElementById('speak-tab');
            if (existingTab) {
                existingTab.remove();
            }
        }
    }, 100); // Adding a small delay to ensure selection is complete
});
