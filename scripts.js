let songs = [];



async function loadSongsData(){
  
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Failed to load songs");
    songs = await response.json();
    renderPlaylist();
    renderInitialPlayer();
  } catch (error) {
    console.error("Error loading songs:", error);
  }
}
function renderInitialPlayer(){
document.querySelector('.img-container img').src=songs[0].image;
document.querySelector('.song-name').textContent=songs[0].title;
document.querySelector('.artist-name').textContent=songs[0].artist;
document.querySelector('.main').style.setProperty('--bg-image', `url(${songs[0].image})`);
  document.querySelector('.background-blur').style.backgroundImage = `url(${songs[0].image})`;

durationEl.textContent=songs[0].duration;
currentTimeEl.textContent = '0:00';
audio.src=songs[0].audio;
highlightSelectedSong(0);

}



function renderPlaylist(){

let playlistHTMl='<p class="right-panel-title">My Playlist</p>';
songs.forEach((song,index)=>{

    playlistHTMl+=
    `
                <div class="playlist-song" data-index="${index}">
                    <div class="playlist-song-img">
                        <img src="${song.image}" class="playlist-img">
                    </div>
                    <div class="playlist-song-details">
                        <p class="playlist-song-name">${song.title}</p>
                        <p class="playlist-artist-name">${song.artist}</p>
                    </div>
                    </div>
    `
    ;
})

playlist.innerHTML=playlistHTMl;

const playlistSongs = document.querySelectorAll('.playlist-song');

playlistSongs.forEach(songEl => {
  songEl.addEventListener('click', () => {
    const index = songEl.getAttribute('data-index');
    loadSong(index);
    highlightSelectedSong(index);
  });
});
}

function highlightSelectedSong(index) {
  const playlistSongs = document.querySelectorAll('.playlist-song');

  playlistSongs.forEach(song => {
    song.classList.remove('selected-song');
    song.querySelector('.playlist-song-name').classList.remove('selected-song-name');
  });

  const selectedEl = playlistSongs[index];
  if (selectedEl) {
    selectedEl.classList.add('selected-song');
    selectedEl.querySelector('.playlist-song-name').classList.add('selected-song-name');
  }
}

//DOM
const playlist = document.querySelector('.right-panel')
const pausePlayBtn = document.querySelector('.pause-play');
const playIcon = pausePlayBtn.querySelector('i')
const controllers = document.querySelectorAll('.control');
const shuffle = document.querySelector('.shuffle');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const repeat = document.querySelector('.repeat');
const progressBar = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.song-timers .left');
const durationEl = document.querySelector('.song-timers .right');
const audio = document.querySelector('.audio-player');
const volumeSlider = document.querySelector('.volume-slider');
const volumeIcon = document.querySelector('.volume-icon');

volumeSlider.value=50;
audio.volume=0.5;

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let lastSoundVolume=audio.volume;




function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Fix: Set up progress bar when audio metadata loads
audio.addEventListener('loadedmetadata', () => {

  progressBar.min = 0;
  progressBar.max = audio.duration;
  progressBar.value = 0;
  durationEl.textContent = formatTime(audio.duration);

});

//update progress bar
audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  if (duration) {
    progressBar.value = currentTime;
    currentTimeEl.textContent = formatTime(currentTime);
  }
});
//dragging the progress bar
progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

//volume sound
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100;
  (audio.volume===0)?lastSoundVolume=lastSoundVolume : lastSoundVolume=audio.volume;
});

//add-pause
pausePlayBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
  } else {
    audio.pause();
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
  }
});


//initial


  //change songs
function loadSong(index) {
  currentIndex = parseInt(index);
  const song = songs[currentIndex];
  document.querySelector('.main').style.setProperty('--bg-image', `url(${song.image})`);
  document.querySelector('.background-blur').style.backgroundImage = `url(${song.image})`;


  audio.src = song.audio;
  audio.play();

  document.querySelector('.img-container img').src = song.image;
  document.querySelector('.song-name').textContent = song.title;
  document.querySelector('.artist-name').textContent = song.artist;
  

  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';

  const playIcon = document.querySelector('.pause-play i');
  playIcon.classList.remove('fa-play');
  playIcon.classList.add('fa-pause');


}


// mute
function mute(){
  if(audio.muted){
        audio.muted = false;
        audio.volume = lastSoundVolume;
        volumeSlider.value=lastSoundVolume *100;
       volumeIcon.classList.remove('fa-volume-xmark');
    volumeIcon.classList.add('fa-volume-up');


  }else{
    lastSoundVolume=audio.volume;
    audio.muted = true;
    volumeSlider.value=0;
     volumeIcon.classList.remove('fa-volume-up');
    volumeIcon.classList.add('fa-volume-xmark');
  }
}

volumeIcon.addEventListener('click',()=>{
  mute();
})


//next
   function playNext(){
    if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
    } else {
    currentIndex = (currentIndex + 1) % songs.length;
    }
        loadSong(currentIndex);
        highlightSelectedSong(currentIndex)
   }  


next.addEventListener('click',()=>{
    playNext();
})

//prev
function playPrev(){
     currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  highlightSelectedSong(currentIndex)

}
prev.addEventListener('click', ()=>{
    playPrev();
})

//shuffle
shuffle.addEventListener('click',()=>{
    isShuffle=!isShuffle;
    if(isShuffle){
        shuffle.classList.add('selected');
    }
    else{
        shuffle.classList.remove('selected');
    }
});
//repeat
repeat.addEventListener('click',()=>{
    isRepeat=!isRepeat;
     if(isRepeat){
        repeat.classList.add('selected');
    }
    else{
        repeat.classList.remove('selected');
    }
});

audio.addEventListener('ended', () => {
  if (isRepeat) {
    loadSong(currentIndex);
  } else if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
        loadSong(currentIndex);
        highlightSelectedSong(currentIndex)
  }else{
        playNext();

  }
});

//keybinds
document.addEventListener('keydown', (e) => {
  // Space = Play/Pause
  if (e.code === 'Space') {
    e.preventDefault(); // Prevent scrolling
    pausePlayBtn.click();
  }
  else if (e.code === 'ArrowRight' && !e.ctrlKey) {
    playNext();
  }

  // ArrowLeft = Previous Song
  else if (e.code === 'ArrowLeft' && !e.ctrlKey) {
    playPrev();
  }

  // ArrowUp = Volume Up
  else if (e.code === 'ArrowUp') {
    e.preventDefault();
    const newVolume = Math.min(audio.volume + 0.1, 1);
    audio.volume = newVolume;
    volumeSlider.value = newVolume * 100;
  }

  // ArrowDown = Volume Down
  else if (e.code === 'ArrowDown') {
    e.preventDefault();
    const newVolume = Math.max(audio.volume - 0.1, 0);
    audio.volume = newVolume;
    volumeSlider.value = newVolume * 100;
  }
});


loadSongsData();
