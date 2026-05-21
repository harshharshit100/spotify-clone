const songs = [
    {
        id: 1,
        title: "Summer Vibes",
        artist: "Beach Boys Band",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverImg: "./assets/card1img.jpeg",
        duration: "4:47"
    },
    {
        id: 2,
        title: "Midnight Dreams",
        artist: "The Night Owls",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverImg: "./assets/card2img.jpeg",
        duration: "4:37"
    },
    {
        id: 3,
        title: "Electric Soul",
        artist: "Synth Masters",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverImg: "./assets/card3img.jpeg",
        duration: "4:53"
    },
    {
        id: 4,
        title: "Urban Rhythm",
        artist: "City Beats Collective",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverImg: "./assets/card4img.jpeg",
        duration: "5:02"
    },
    {
        id: 5,
        title: "Acoustic Journey",
        artist: "Folk Wanderers",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverImg: "./assets/card5img.jpeg",
        duration: "4:45"
    },
    {
        id: 6,
        title: "Neon Lights",
        artist: "Retro Wave",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        coverImg: "./assets/card6img.jpeg",
        duration: "4:28"
    },
    {
        id: 7,
        title: "Ocean Breeze",
        artist: "Calm Waters",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        coverImg: "./assets/card1img.jpeg",
        duration: "4:55"
    },
    {
        id: 8,
        title: "Jazz Cafe",
        artist: "Smooth Jazz Trio",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        coverImg: "./assets/card2img.jpeg",
        duration: "4:32"
    }
];

// ==========================================
// 2. GLOBAL STATE VARIABLES
// ==========================================

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: repeat all, 2: repeat one
let audio = new Audio();
let originalSongOrder = [...songs];
let currentPlaylist = [...songs];

// ==========================================
// 3. DOM ELEMENTS SELECTION
// ==========================================

// Player control icons
const playerIcons = document.querySelectorAll('.player-icon');
const prevBtn = playerIcons[0];
const playPauseBtn = playerIcons[2]; // Middle button (main play/pause)
const nextBtn = playerIcons[3];
const shuffleBtn = playerIcons[1]; // Second icon for shuffle
const repeatBtn = playerIcons[4]; // Last icon for repeat

// Progress bar elements
const progressBar = document.querySelector('.progress-bar');
const currentTimeDisplay = document.querySelector('.cur-time');
const totalTimeDisplay = document.querySelector('.tot-time');

// Album display in player
const albumDisplay = document.querySelector('.album');

// All music cards
const musicCards = document.querySelectorAll('.card');

// ==========================================
// 4. INITIALIZATION
// ==========================================

function init() {
    // Populate music cards with song data
    populateMusicCards();
    
    // Load first song by default
    loadSong(currentSongIndex);
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize shuffle and repeat button states
    updateShuffleButton();
    updateRepeatButton();
}

// ==========================================
// 5. POPULATE MUSIC CARDS
// ==========================================

function populateMusicCards() {
    musicCards.forEach((card, index) => {
        if (songs[index]) {
            const img = card.querySelector('.card-img');
            const title = card.querySelector('.card-title');
            const info = card.querySelector('.card-info');
            
            img.src = songs[index].coverImg;
            img.alt = `${songs[index].title} album cover`;
            title.textContent = songs[index].title;
            info.textContent = songs[index].artist;
            
            // Add data attribute for easy reference
            card.dataset.songId = songs[index].id;
            card.dataset.songIndex = index;
        }
    });
}

// ==========================================
// 6. LOAD SONG
// ==========================================

function loadSong(index) {
    const song = currentPlaylist[index];
    
    // Update audio source
    audio.src = song.audioSrc;
    
    // Update album display in player
    updateAlbumDisplay(song);
    
    // Update total time
    totalTimeDisplay.textContent = song.duration;
    
    // Reset progress bar
    progressBar.value = 0;
    currentTimeDisplay.textContent = '00:00';
    
    // Highlight current song card
    highlightCurrentCard();
}

// ==========================================
// 7. UPDATE ALBUM DISPLAY
// ==========================================

function updateAlbumDisplay(song) {
    albumDisplay.innerHTML = `
        <img src=\"${song.coverImg}\" alt=\"${song.title}\" style=\"height: 60px; width: 60px; border-radius: 5px; margin-right: 10px;\">
        <div style=\"display: flex; flex-direction: column; justify-content: center;\">
            <p style=\"margin: 0; font-size: 0.9rem; font-weight: 600;\">${song.title}</p>
            <p style=\"margin: 0; font-size: 0.75rem; opacity: 0.7;\">${song.artist}</p>
        </div>
    `;
    albumDisplay.style.display = 'flex';
    albumDisplay.style.alignItems = 'center';
    albumDisplay.style.paddingLeft = '1rem';
}

// ==========================================
// 8. PLAY SONG
// ==========================================

function playSong() {
    isPlaying = true;
    audio.play();
    updatePlayPauseIcon();
}

// ==========================================
// 9. PAUSE SONG
// ==========================================

function pauseSong() {
    isPlaying = false;
    audio.pause();
    updatePlayPauseIcon();
}

// ==========================================
// 10. TOGGLE PLAY/PAUSE
// ==========================================

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// ==========================================
// 11. UPDATE PLAY/PAUSE ICON
// ==========================================

function updatePlayPauseIcon() {
    if (isPlaying) {
        playPauseBtn.src = './assets/player_icon3.png'; // You may want to use a pause icon
        playPauseBtn.alt = 'Pause';
    } else {
        playPauseBtn.src = './assets/player_icon3.png';
        playPauseBtn.alt = 'Play';
    }
}

// ==========================================
// 12. NEXT SONG
// ==========================================

function nextSong() {
    if (repeatMode === 2) {
        // Repeat one: restart current song
        audio.currentTime = 0;
        playSong();
    } else {
        // Move to next song
        currentSongIndex++;
        if (currentSongIndex >= currentPlaylist.length) {
            currentSongIndex = 0; // Loop back to first song
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
}

// ==========================================
// 13. PREVIOUS SONG
// ==========================================

function previousSong() {
    if (audio.currentTime > 3) {
        // If more than 3 seconds into song, restart it
        audio.currentTime = 0;
    } else {
        // Go to previous song
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = currentPlaylist.length - 1; // Loop to last song
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
}

// ==========================================
// 14. SHUFFLE TOGGLE
// ==========================================

function toggleShuffle() {
    isShuffle = !isShuffle;
    
    if (isShuffle) {
        // Save current song
        const currentSong = currentPlaylist[currentSongIndex];
        
        // Shuffle the playlist
        currentPlaylist = shuffleArray([...originalSongOrder]);
        
        // Find the current song in shuffled playlist
        currentSongIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    } else {
        // Restore original order
        const currentSong = currentPlaylist[currentSongIndex];
        currentPlaylist = [...originalSongOrder];
        
        // Find the current song in original playlist
        currentSongIndex = currentPlaylist.findIndex(song => song.id === currentSong.id);
    }
    
    updateShuffleButton();
}

// ==========================================
// 15. SHUFFLE ARRAY HELPER
// ==========================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==========================================
// 16. UPDATE SHUFFLE BUTTON
// ==========================================

function updateShuffleButton() {
    if (isShuffle) {
        shuffleBtn.style.opacity = '1';
        shuffleBtn.style.filter = 'brightness(1.5)';
    } else {
        shuffleBtn.style.opacity = '0.7';
        shuffleBtn.style.filter = 'none';
    }
}

// ==========================================
// 17. REPEAT TOGGLE
// ==========================================

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3; // Cycle through 0, 1, 2
    updateRepeatButton();
}

// ==========================================
// 18. UPDATE REPEAT BUTTON
// ==========================================

function updateRepeatButton() {
    if (repeatMode === 0) {
        // Repeat off
        repeatBtn.style.opacity = '0.7';
        repeatBtn.style.filter = 'none';
    } else if (repeatMode === 1) {
        // Repeat all
        repeatBtn.style.opacity = '1';
        repeatBtn.style.filter = 'brightness(1.5)';
    } else {
        // Repeat one
        repeatBtn.style.opacity = '1';
        repeatBtn.style.filter = 'brightness(2)';
    }
}

// ==========================================
// 19. UPDATE PROGRESS BAR
// ==========================================

function updateProgress() {
    const { duration, currentTime } = audio;
    
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        
        // Update current time display
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
}

// ==========================================
// 20. SET PROGRESS (SEEK)
// ==========================================

function setProgress(e) {
    const width = progressBar.max;
    const clickX = e.target.value;
    const duration = audio.duration;
    
    audio.currentTime = (clickX / width) * duration;
}

// ==========================================
// 21. FORMAT TIME HELPER
// ==========================================

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==========================================
// 22. HIGHLIGHT CURRENT CARD
// ==========================================

function highlightCurrentCard() {
    // Remove highlight from all cards
    musicCards.forEach(card => {
        card.style.backgroundColor = '#232323';
        card.style.transform = 'scale(1)';
    });
    
    // Find and highlight current card
    const currentSong = currentPlaylist[currentSongIndex];
    const currentCard = Array.from(musicCards).find(card => {
        return parseInt(card.dataset.songId) === currentSong.id;
    });
    
    if (currentCard) {
        currentCard.style.backgroundColor = '#2a2a2a';
        currentCard.style.transform = 'scale(1.02)';
        currentCard.style.transition = 'all 0.3s ease';
    }
}

// ==========================================
// 23. HANDLE SONG END
// ==========================================

function handleSongEnd() {
    if (repeatMode === 2) {
        // Repeat one: restart current song
        audio.currentTime = 0;
        playSong();
    } else if (repeatMode === 1) {
        // Repeat all: go to next song
        nextSong();
    } else {
        // No repeat: go to next song (loop to first if at end)
        if (currentSongIndex < currentPlaylist.length - 1) {
            nextSong();
        } else {
            // Last song ended, stop playing
            currentSongIndex = 0;
            loadSong(currentSongIndex);
            pauseSong();
        }
    }
}

// ==========================================
// 24. SETUP EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Next/Previous buttons
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', previousSong);
    
    // Shuffle button
    shuffleBtn.addEventListener('click', toggleShuffle);
    
    // Repeat button
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBar.addEventListener('input', setProgress);
    
    // Audio time update
    audio.addEventListener('timeupdate', updateProgress);
    
    // Audio ended
    audio.addEventListener('ended', handleSongEnd);
    
    // Audio loaded metadata (to get actual duration)
    audio.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audio.duration);
    });
    
    // Music card click events
    musicCards.forEach(card => {
        card.addEventListener('click', () => {
            const songId = parseInt(card.dataset.songId);
            const songIndex = currentPlaylist.findIndex(song => song.id === songId);
            
            if (songIndex !== -1) {
                currentSongIndex = songIndex;
                loadSong(currentSongIndex);
                playSong();
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            nextSong();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            previousSong();
        }
    });
}

// ==========================================
// 25. START APPLICATION
// ==========================================

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
