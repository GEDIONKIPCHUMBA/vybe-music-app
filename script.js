// VYBE Music App – Fully Functional Player
// Audio samples: free algorithmic tracks from SoundHelix (https://www.soundhelix.com)

const tracks = [
  {
    title: "Echoes in Purple",
    artist: "Luna Rift",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Midnight Bloom",
    artist: "Lunar Echo",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Neon Coast",
    artist: "Kiera B.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    title: "Late Night Loops",
    artist: "Solace",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    title: "Starlit Drive",
    artist: "Luna Rift",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    title: "Velvet Echo",
    artist: "Mira Q",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    title: "Pulse 03",
    artist: "Obi.",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    title: "Midnight Frequencies",
    artist: "VYBE Originals",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
];

let currentIndex = 0;
let isPlaying = false;
let liked = false;
let isShuffle = false;
let isRepeat = false; // false | 'one' | 'all'

const audio = new Audio();
audio.preload = "metadata";
audio.crossOrigin = "anonymous";

// Elements
const playBtn = document.getElementById("play-btn");
const mPlayBtn = document.getElementById("m-play");
const npTitle = document.getElementById("np-title");
const npArtist = document.getElementById("np-artist");
const mobileTitle = document.getElementById("mobile-title");
const mobileArtist = document.getElementById("mobile-artist");
const progressFill = document.getElementById("progress-fill");
const mobileProgressFill = document.getElementById("mobile-progress-fill");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const mobileCurrent = document.getElementById("mobile-current");
const mobileTotal = document.getElementById("mobile-total");
const desktopView = document.getElementById("desktop-view");
const mobileView = document.getElementById("mobile-view");
const openMobile = document.getElementById("open-mobile");
const closeMobile = document.getElementById("close-mobile");
const likeBtn = document.getElementById("like-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const mShuffle = document.getElementById("m-shuffle");
const mRepeat = document.getElementById("m-repeat");

function formatTime(seconds) {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function updateTrackUI() {
  const t = tracks[currentIndex];
  npTitle.textContent = t.title;
  npArtist.textContent = t.artist;
  mobileTitle.textContent = t.title;
  mobileArtist.textContent = t.artist;
  document.title = `${t.title} · ${t.artist} | VYBE`;
}

function updateProgressUI() {
  const current = audio.currentTime || 0;
  const duration = audio.duration || 0;
  const pct = duration > 0 ? (current / duration) * 100 : 0;

  progressFill.style.width = `${pct}%`;
  mobileProgressFill.style.width = `${pct}%`;
  currentTimeEl.textContent = formatTime(current);
  mobileCurrent.textContent = formatTime(current);
  totalTimeEl.textContent = formatTime(duration);
  mobileTotal.textContent = formatTime(duration);
}

function setPlaying(playing) {
  isPlaying = playing;
  const pauseIcons = document.querySelectorAll(".icon-pause");
  const playIcons = document.querySelectorAll(".icon-play");
  pauseIcons.forEach((el) => el.classList.toggle("hidden", !playing));
  playIcons.forEach((el) => el.classList.toggle("hidden", playing));
}

function loadTrack(index, autoplay = true) {
  currentIndex = index;
  const track = tracks[currentIndex];
  audio.src = track.src;
  audio.load();
  updateTrackUI();
  updateProgressUI();

  if (autoplay) {
    audio
      .play()
      .then(() => setPlaying(true))
      .catch((err) => {
        console.warn("Playback blocked (user gesture required):", err.message);
        setPlaying(false);
      });
  } else {
    setPlaying(false);
  }
}

function playPause() {
  if (!audio.src) {
    loadTrack(currentIndex, true);
    return;
  }
  if (audio.paused) {
    audio
      .play()
      .then(() => setPlaying(true))
      .catch((err) => console.warn(err));
  } else {
    audio.pause();
    setPlaying(false);
  }
}

function nextTrack() {
  let next;
  if (isShuffle) {
    do {
      next = Math.floor(Math.random() * tracks.length);
    } while (next === currentIndex && tracks.length > 1);
  } else {
    next = (currentIndex + 1) % tracks.length;
  }
  loadTrack(next, true);
}

function prevTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prev = (currentIndex - 1 + tracks.length) % tracks.length;
  loadTrack(prev, true);
}

function seek(e, bar) {
  if (!audio.duration) return;
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
  updateProgressUI();
}

// Audio events
audio.addEventListener("timeupdate", updateProgressUI);
audio.addEventListener("loadedmetadata", updateProgressUI);
audio.addEventListener("ended", () => {
  if (isRepeat === "one") {
    audio.currentTime = 0;
    audio.play();
  } else if (isRepeat === "all" || isShuffle) {
    nextTrack();
  } else if (currentIndex < tracks.length - 1) {
    nextTrack();
  } else {
    setPlaying(false);
  }
});
audio.addEventListener("play", () => setPlaying(true));
audio.addEventListener("pause", () => setPlaying(false));
audio.addEventListener("error", (e) => {
  console.error("Audio error:", e);
  totalTimeEl.textContent = "—";
  mobileTotal.textContent = "—";
});

// Controls
playBtn?.addEventListener("click", playPause);
mPlayBtn?.addEventListener("click", playPause);
document.getElementById("next-btn")?.addEventListener("click", nextTrack);
document.getElementById("prev-btn")?.addEventListener("click", prevTrack);
document.getElementById("m-next")?.addEventListener("click", nextTrack);
document.getElementById("m-prev")?.addEventListener("click", prevTrack);

document.getElementById("play-hero")?.addEventListener("click", () => {
  const idx = tracks.findIndex((t) => t.title === "Midnight Frequencies");
  loadTrack(idx >= 0 ? idx : 0, true);
});

// Progress bars
const progressBar = document.getElementById("progress-bar");
const mobileProgressBar = document.getElementById("mobile-progress-bar");
progressBar?.addEventListener("click", (e) => seek(e, progressBar));
mobileProgressBar?.addEventListener("click", (e) => seek(e, mobileProgressBar));

// Shuffle / Repeat
function toggleShuffle() {
  isShuffle = !isShuffle;
  [shuffleBtn, mShuffle].forEach((btn) => {
    if (btn) btn.style.color = isShuffle ? "#a855f7" : "";
  });
}
function toggleRepeat() {
  if (!isRepeat) isRepeat = "all";
  else if (isRepeat === "all") isRepeat = "one";
  else isRepeat = false;
  [repeatBtn, mRepeat].forEach((btn) => {
    if (btn) {
      btn.style.color = isRepeat ? "#a855f7" : "";
      btn.title = isRepeat === "one" ? "Repeat One" : isRepeat === "all" ? "Repeat All" : "Repeat";
    }
  });
}
shuffleBtn?.addEventListener("click", toggleShuffle);
mShuffle?.addEventListener("click", toggleShuffle);
repeatBtn?.addEventListener("click", toggleRepeat);
mRepeat?.addEventListener("click", toggleRepeat);

// Mobile toggle
openMobile?.addEventListener("click", () => {
  desktopView.classList.add("hidden");
  mobileView.classList.remove("hidden");
});
closeMobile?.addEventListener("click", () => {
  mobileView.classList.add("hidden");
  desktopView.classList.remove("hidden");
});

// Like
likeBtn?.addEventListener("click", () => {
  liked = !liked;
  likeBtn.classList.toggle("liked", liked);
});

// Cards → play track
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.dataset.title;
    const idx = tracks.findIndex((t) => t.title === title);
    if (idx >= 0) loadTrack(idx, true);
  });
});

// Mix cards – play first track of a “mix”
document.querySelectorAll(".mix-card").forEach((card, i) => {
  card.addEventListener("click", () => {
    loadTrack(Math.min(i, tracks.length - 1), true);
  });
});

// Genre cards – just play something
document.querySelectorAll(".genre-card").forEach((card, i) => {
  card.addEventListener("click", () => {
    loadTrack(i % tracks.length, true);
  });
});

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") {
    e.preventDefault();
    playPause();
  } else if (e.code === "ArrowRight") nextTrack();
  else if (e.code === "ArrowLeft") prevTrack();
});

// Volume (simple – desktop extra buttons)
const volumeBtns = document.querySelectorAll('.player-extra .ctrl-btn[title="Volume"], .bottom-btn');
// Keep default volume

// Init – load first track (don’t autoplay until user interaction)
loadTrack(0, false);
updateGreeting();

function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  const h1 = document.querySelector(".greeting h1");
  if (h1) h1.textContent = `${greeting}, Gedion`;
}

// Media Session API (lock screen / OS controls)
if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("play", () => playPause());
  navigator.mediaSession.setActionHandler("pause", () => playPause());
  navigator.mediaSession.setActionHandler("previoustrack", () => prevTrack());
  navigator.mediaSession.setActionHandler("nexttrack", () => nextTrack());

  audio.addEventListener("play", () => {
    const t = tracks[currentIndex];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title,
      artist: t.artist,
      album: "VYBE",
    });
  });
}
