document.getElementById('moodForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const mood = document.getElementById('mood').value;
    const apiKey = '345202cf38e1e29edbeeb83ea87828e3'; // Replace with your Last.fm API key

    fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            const tracks = data.tracks.track;
            const playlistDiv = document.getElementById('playlist');
            playlistDiv.innerHTML = '';

            if (tracks.length > 0) {
                tracks.forEach(track => {
                    const trackItem = document.createElement('div');
                    trackItem.className = 'track-item';
                    trackItem.innerHTML = `
                        <a href="${track.url}" target="_blank" style="color: #34495e;">
                            <strong>${track.name}</strong>
                        </a> by ${track.artist.name}
                    `;
                    playlistDiv.appendChild(trackItem);
                });
            } else {
                playlistDiv.innerHTML = 'No tracks found for this mood.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});