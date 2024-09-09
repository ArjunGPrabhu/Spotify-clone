console.log("Welcome to Spotify");

let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');

// Add elements for displaying time
let currentTimeDisplay = document.getElementById('currentTime');
let totalTimeDisplay = document.getElementById('totalTime');

let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    {songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Cielo -Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg"},
    {songName: "DEAF KEV -Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Different Heaven & EH!DE -MY Heart [NCS Release]-320k", filePath: "songs/4.mp3", coverPath: "covers/4.jpg"},
    {songName: "Asif Habibi", filePath: "songs/5.mp3", coverPath: "covers/10.jpg"},
    {songName: "galtana sheltili", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "inta malem", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
    {songName: "Khaled - Didi", filePath: "songs/8.mp3", coverPath: "covers/8.jpg"},
    {songName: "Salina Salina", filePath: "songs/9.mp3", coverPath: "covers/9.jpg"},
    
]

songItems.forEach((element, i)=>{
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
})

masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime <= 0){
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        gif.style.opacity = 0;
    }
})

audioElement.addEventListener('timeupdate', ()=>{
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;

    // Update the current time and total time
    updateTimings();
})

// Function to format time as mm:ss
const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Function to update the current and total time display
const updateTimings = () => {
    if (!isNaN(audioElement.duration)) {
        // Display the current time
        currentTimeDisplay.innerText = formatTime(audioElement.currentTime);

        // Display the remaining time or total duration
        totalTimeDisplay.innerText = formatTime(audioElement.duration - audioElement.currentTime);
    }
}

myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
    updateTimings(); // Update the timings when user seeks
})

const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    })
}

const playSong = (index) => {
    songIndex = index;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');
    updateTimings(); // Ensure timings are updated when the song starts
}

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, i) => {
    element.addEventListener('click', (e) => {
        if (songIndex === i && !audioElement.paused) {
            // If the same song is clicked and it's playing, pause it
            audioElement.pause();
            e.target.classList.remove('fa-circle-pause');
            e.target.classList.add('fa-circle-play');
            gif.style.opacity = 0;
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
        } else {
            // Play the clicked song
            makeAllPlays();
            e.target.classList.remove('fa-circle-play');
            e.target.classList.add('fa-circle-pause');
            playSong(i);
        }
    })
})

document.getElementById('next').addEventListener('click', () => {
    if (songIndex >= songs.length - 1) {
        songIndex = 0;
    } else {
        songIndex += 1;
    }
    playSong(songIndex);
})

document.getElementById('previous').addEventListener('click', () => {
    if (songIndex <= 0) {
        songIndex = 0;
    } else {
        songIndex -= 1;
    }
    playSong(songIndex);
})

// Play the next song when the current song ends
audioElement.addEventListener('ended', () => {
    if (songIndex >= songs.length - 1) {
        songIndex = 0; // Loop back to the first song
    } else {
        songIndex += 1;
    }
    playSong(songIndex);
})

// Ensure the total time is displayed when the song is loaded
audioElement.addEventListener('loadedmetadata', updateTimings);
