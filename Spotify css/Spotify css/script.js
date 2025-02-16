// Get references to player elements
let masterPlay = document.getElementById('masterPlay');
let progressBar = document.getElementById('progressBar');
let songInfo = document.getElementById('masterSongName');
let gif = document.getElementById('gif');
let audioElement = new Audio();
let volumeSlider = document.getElementById('volumeSlider');
let volumeIcon = document.getElementById('volumeIcon');
let currentTimeDisplay = document.getElementById('currentTime');
let totalTimeDisplay = document.getElementById('totalTime');
let songCards = document.querySelectorAll('.card');
let nextBtn = document.getElementById('next');
let prevBtn = document.getElementById('previous');
let playlistContainer = document.getElementById('playlist');

let songs = [
    { songName: "Song 1", filePath: "songs/song1.mp3", cover: "Newfolder/card1img.jpeg" },
    { songName: "Song 2", filePath: "songs/song2.mp3", cover: "Newfolder/card2img.jpeg" },
    { songName: "Song 3", filePath: "songs/song3.mp3", cover: "Newfolder/card3img.jpeg" },
    { songName: "Song 4", filePath: "songs/song4.mp3", cover: "Newfolder/card4img.jpeg" },
    { songName: "Song 5", filePath: "songs/song5.mp3", cover: "Newfolder/card5img.jpeg" }
];

let songIndex = 0;
let playlist = [];

// Load the first song
function loadSong(index) {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    songInfo.innerHTML = `${songs[songIndex].songName} <img id="songGif" src="Newfolder/playing.gif" style="width:20px; height:20px; margin-left:5px;">`;
    progressBar.value = 0;
    updateUI(true);
    audioElement.play();
    masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
}

// Update UI for currently playing song
function updateUI(isPlaying) {
    document.querySelectorAll('.playing-icon').forEach(icon => icon.remove());
    let currentCard = songCards[songIndex];
    let playIcon = document.createElement('img');
    playIcon.classList.add('playing-icon');
    playIcon.src = "Newfolder/playing.gif";
    playIcon.style.position = 'absolute';
    playIcon.style.top = '5px';
    playIcon.style.right = '5px';
    playIcon.style.width = '30px';
    playIcon.style.height = '30px';
    currentCard.style.position = 'relative';
    currentCard.appendChild(playIcon);
    gif.style.opacity = isPlaying ? 1 : 0;
}

// Play/Pause functionality
masterPlay.addEventListener('click', () => {
    let songGif = document.getElementById('songGif');
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.replace('fa-play-circle', 'fa-pause-circle');
        if (songGif) songGif.style.display = "inline-block";
        updateUI(true);
    } else {
        audioElement.pause();
        masterPlay.classList.replace('fa-pause-circle', 'fa-play-circle');
        if (songGif) songGif.style.display = "none";
        updateUI(false);
        document.querySelectorAll('.playing-icon').forEach(icon => icon.remove());
    }
});

// Click event for song cards
songCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        loadSong(index);
    });
});

// Update progress bar and timestamps
audioElement.addEventListener('timeupdate', () => {
    let currentMinutes = Math.floor(audioElement.currentTime / 60);
    let currentSeconds = Math.floor(audioElement.currentTime % 60);
    currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
    currentTimeDisplay.innerText = `${currentMinutes}:${currentSeconds}`;
    if (audioElement.duration) {
        let totalMinutes = Math.floor(audioElement.duration / 60);
        let totalSeconds = Math.floor(audioElement.duration % 60);
        totalSeconds = totalSeconds < 10 ? "0" + totalSeconds : totalSeconds;
        totalTimeDisplay.innerText = `${totalMinutes}:${totalSeconds}`;
    }
    progressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
});

// Seek function
progressBar.addEventListener('input', () => {
    audioElement.currentTime = (progressBar.value * audioElement.duration) / 100;
});

// Next and Previous Buttons
nextBtn.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
});
prevBtn.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
});

audioElement.addEventListener('ended', () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
});

// Volume control
audioElement.volume = volumeSlider.value;
volumeSlider.addEventListener('input', () => {
    audioElement.volume = volumeSlider.value;
    if (volumeSlider.value == 0) {
        volumeIcon.className = "fas fa-volume-mute";
    } else if (volumeSlider.value < 0.5) {
        volumeIcon.className = "fas fa-volume-down";
    } else {
        volumeIcon.className = "fas fa-volume-up";
    }
});
volumeIcon.addEventListener('click', () => {
    if (audioElement.volume > 0) {
        audioElement.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.className = "fas fa-volume-mute";
    } else {
        audioElement.volume = 1;
        volumeSlider.value = 1;
        volumeIcon.className = "fas fa-volume-up";
    }
});

// Playlist Functions
function updatePlaylistUI() {
    playlistContainer.innerHTML = "";
    playlist.forEach((song, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${song.songName} <button onclick="playPlaylistSong(${index})">▶</button> <button onclick="removeFromPlaylist(${index})">❌</button>`;
        playlistContainer.appendChild(li);
    });
}
function addToPlaylist(songIndex) {
    playlist.push(songs[songIndex]);
    updatePlaylistUI();
}
function removeFromPlaylist(index) {
    playlist.splice(index, 1);
    updatePlaylistUI();
}
function playPlaylistSong(index) {
    let songIndex = songs.findIndex(s => s.songName === playlist[index].songName);
    if (songIndex !== -1) {
        loadSong(songIndex);
    }
}
songCards.forEach((card, index) => {
    let addButton = document.createElement("button");
    addButton.innerText = "➕ Add to Playlist";
    addButton.classList.add("add-to-playlist-btn"); // Add a class for styling
    addButton.onclick = () => addToPlaylist(index);
    card.appendChild(addButton);
});


loadSong(songIndex);
