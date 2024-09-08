function search() {
    console.log("Search function called");
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    console.log("Search input:", searchInput);

    const pages = {
        'Main Page': 'main.html',
            'Article': 'article.html',
            'Emergency Support': 'help.html',
            'Music Mood Playlist': 'mood.html',
            'Relaxation Challenges': 'challenge.html',
            'Mental Health Check': 'test.html',
            'Breathing Exercises': 'breath.html',
            'Support Line': 'help.html',
            'Mini Games': 'game.html',
            'Garden': 'garden.html'
    };

    for (const [keyword, url] of Object.entries(pages)) {
        console.log("Checking keyword:", keyword);
        if (keyword.toLowerCase().includes(searchInput) || searchInput.includes(keyword.toLowerCase())) {
            console.log("Match found, redirecting to:", url);
            window.location.href = url;
            return;
        }
    }

    console.log("No match found");
    alert('Page not found. Please try another search term.');
}

// Add new function to create and show dropdown
function showDropdown() {
    const searchInput = document.getElementById('searchInput');
    let dropdown = document.getElementById('searchDropdown');
    
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'searchDropdown';
        dropdown.className = 'search-dropdown';
        
        const pages = {
            'Main Page': 'main.html',
            'Article': 'article.html',
            'Emergency Support': 'help.html',
            'Music Mood Playlist': 'mood.html',
            'Relaxation Challenges': 'challenge.html',
            'Mental Health Check': 'test.html',
            'Breathing Exercises': 'breath.html',
            'Support Line': 'help.html',
            'Mini Games': 'game.html',
            'Garden': 'garden.html'
        };
        
        for (const [pageName, url] of Object.entries(pages)) {
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.textContent = pageName;
            option.onclick = () => {
                window.location.href = url;
            };
            dropdown.appendChild(option);
        }
        
        searchInput.parentNode.insertBefore(dropdown, searchInput.nextSibling);
    }
    
    dropdown.style.display = 'block';
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('click', showDropdown);
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#searchInput') && !event.target.closest('#searchDropdown')) {
            const dropdown = document.getElementById('searchDropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
    });
});

console.log("search.js loaded");