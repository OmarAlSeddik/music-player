const image = document.getElementById("cover");
const title = document.getElementById("music-title");
const artist = document.getElementById("music-artist");
const currentTimeElement = document.getElementById("current-time");
const durationElement = document.getElementById("duration");
const progress = document.getElementById("progress");
const playerProgress = document.getElementById("player-progress");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const playButton = document.getElementById("play");
const background = document.getElementById("bg-img");
const playerSound = document.getElementById("player-sound");
const sound = document.getElementById("sound");
const raiseVolume = document.getElementById("raise-volume");
const lowerVolume = document.getElementById("lower-volume");
const shuffle = document.getElementById("shuffle");
const repeat = document.getElementById("repeat");

const music = new Audio();
music.volume = 0.6;
let isShuffle = false;
let isRepeat = false;
let isPlaying = false;

const tracksDefault = [
  {
    path: "/assets/drive-breakbeat.mp3",
    displayName: "Drive Breakbeat",
    cover: "/assets/drive-breakbeat.webp",
    artist: "Rockot",
  },
  {
    path: "/assets/for-future-bass.mp3",
    displayName: "For Future Bass",
    cover: "/assets/for-future-bass.webp",
    artist: "The Mountain",
  },
  {
    path: "/assets/inside-you.mp3",
    displayName: "Inside You",
    cover: "/assets/inside-you.webp",
    artist: "LemonMusicStudio",
  },
  {
    path: "/assets/modern-vlog.mp3",
    displayName: "Modern Vlog",
    cover: "/assets/modern-vlog.webp",
    artist: "PenguinMusic",
  },
  {
    path: "/assets/science-documentary.mp3",
    displayName: "Science Documentary",
    cover: "/assets/science-documentary.webp",
    artist: "Lexin Music",
  },
  {
    path: "/assets/smoke.mp3",
    displayName: "Smoke",
    cover: "/assets/smoke.webp",
    artist: "SoulProdMusic",
  },
  {
    path: "/assets/the-best-jazz-club-in-new-orleans.mp3",
    displayName: "The Best Jazz Club in New Orleans",
    cover: "/assets/the-best-jazz-club-in-new-orleans.webp",
    artist: "PaoloArgento",
  },
  {
    path: "/assets/titanium.mp3",
    displayName: "Titanium",
    cover: "/assets/titanium.webp",
    artist: "AlishaMusic",
  },
  {
    path: "/assets/tokyo-cafe.mp3",
    displayName: "Tokyo Cafe",
    cover: "/assets/tokyo-cafe.webp",
    artist: "TVARI",
  },
  {
    path: "/assets/waterfall.mp3",
    displayName: "Waterfall",
    cover: "/assets/waterfall.webp",
    artist: "RomanSenykMusic",
  },
];

let tracks = [...tracksDefault];
class Node {
  constructor(path, displayName, cover, artist) {
    this.path = path;
    this.displayName = displayName;
    this.cover = cover;
    this.artist = artist;
    this.next = null;
    this.prev = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  enqueue(path, displayName, cover, artist) {
    const newNode = new Node(path, displayName, cover, artist);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  empty() {
    this.head = null;
    this.tail = null;
  }
}

const trackList = new Queue();

const updateTrackList = () => {
  trackList.empty();
  tracks.forEach((track) =>
    trackList.enqueue(track.path, track.displayName, track.cover, track.artist)
  );
};

updateTrackList();
let currentTrack = trackList.head;

const togglePlay = () => {
  if (isPlaying) pauseMusic();
  else playMusic();
};

const playMusic = () => {
  isPlaying = true;
  playButton.classList.replace("fa-circle-play", "fa-circle-pause");
  playButton.setAttribute("title", "Pause");
  music.play();
};

const pauseMusic = () => {
  isPlaying = false;
  playButton.classList.replace("fa-circle-pause", "fa-circle-play");
  playButton.setAttribute("title", "Play");
  music.pause();
};

const loadMusic = () => {
  music.src = currentTrack.path;
  title.textContent = currentTrack.displayName;
  artist.textContent = currentTrack.artist;
  image.src = currentTrack.cover;
  background.src = currentTrack.cover;
};

const changeTrack = (direction) => {
  if (direction === 1) {
    if (currentTrack.next) currentTrack = currentTrack.next;
    else currentTrack = trackList.head;
  } else if (direction === -1) {
    if (currentTrack.prev) currentTrack = currentTrack.prev;
    else currentTrack = trackList.tail;
  }
  loadMusic();
  playMusic();
};

const updateProgressBar = () => {
  const { duration, currentTime } = music;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  const formatTime = (time) => String(Math.floor(time)).padStart(2, "0");
  durationElement.textContent = `${formatTime(duration / 60)}:${formatTime(
    duration % 60
  )}`;
  currentTimeElement.textContent = `${formatTime(
    currentTime / 60
  )}:${formatTime(currentTime % 60)}`;
};

const setProgressBar = (e) => {
  const width = playerProgress.clientWidth;
  const clickX = e.offsetX;
  music.currentTime = (clickX / width) * music.duration;
};

const setSound = (e) => {
  const width = playerSound.clientWidth;
  const clickX = e.offsetX;
  music.volume = clickX / width;
};

const updateVolumeBar = () => {
  const volume = music.volume;
  const volumePercent = volume * 100;
  sound.style.width = `${volumePercent}%`;
};

const changeVolume = (value) => {
  music.volume = Math.min(1, Math.max(0, music.volume + value));
  updateVolumeBar();
};

const shuffleMusic = () => {
  isShuffle = !isShuffle;
  shuffle.classList.toggle("active", isShuffle);

  if (isShuffle) tracks.sort(() => Math.random() - 0.5);
  else tracks = [...tracksDefault];

  updateTrackList();
  currentTrack = trackList.head;
  loadMusic();
  playMusic();
};

const repeatMusic = () => {
  isRepeat = !isRepeat;
  repeat.classList.toggle("active", isRepeat);
};

playButton.addEventListener("click", togglePlay);
prevButton.addEventListener("click", () => changeTrack(-1));
nextButton.addEventListener("click", () => changeTrack(1));
music.addEventListener("ended", () =>
  isRepeat ? changeTrack(0) : changeTrack(1)
);
music.addEventListener("timeupdate", updateProgressBar);
music.addEventListener("volumechange", updateVolumeBar);
playerProgress.addEventListener("click", setProgressBar);
playerSound.addEventListener("click", setSound);
raiseVolume.addEventListener("click", () => changeVolume(0.1));
lowerVolume.addEventListener("click", () => changeVolume(-0.1));
shuffle.addEventListener("click", shuffleMusic);
repeat.addEventListener("click", repeatMusic);

loadMusic();
