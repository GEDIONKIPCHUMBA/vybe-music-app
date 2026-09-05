// VYBE Music App – Interactive UI

const tracks = [
  { title: "Echoes in Purple", artist: "Luna Rift", duration: 215 },
  { title: "Midnight Bloom", artist: "Lunar Echo", duration: 222 },
  { title: "Neon Coast", artist: "Kiera B.", duration: 198 },
  { title: "Late Night Loops", artist: "Solace", duration: 240 },
  { title: "Starlit Drive", artist: "Luna Rift", duration: 187 },
  { title: "Velvet Echo", artist: "Mira Q", duration: 205 },
  { title: "Pulse 03", artist: "Obi.", duration: 176 },
  { title: "Midnight Frequencies", artist: "VYBE Originals", duration: 210 },
];

let currentIndex = 0;
let isPlaying = true;
let progress = 0.48; // starting progress
let progressInterval = null;
let liked = false;

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

function formatTime(seconds) {
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
  totalTimeEl.textContent = formatTime(t.duration);
  mobileTotal.textContent = formatTime(t.duration);
  updateProgressUI();
}

function updateProgressUI() {
  const t = tracks[currentIndex];
  const current = Math.floor(progress * t.duration);
  progressFill.style.width = `${progress * 100}%`;
  mobileProgressFill.style.width = `${progress * 100}%`;
  currentTimeEl.textContent = formatTime(current);
  mobileCurrent.textContent = formatTime(current);
}

function setPlaying(playing) {
  isPlaying = playing;
  const pauseIcons = document.querySelectorAll(".icon-pause");
  const playIcons = document.querySelectorAll(".icon-play");
  pauseIcons.forEach((el) => el.classList.toggle("hidden", !playing));
  playIcons.forEach((el) => el.classList.toggle("hidden", playing));
  if (playing) startProgress();
  else stopProgress();
}

function startProgress() {
  stopProgress();
  progressInterval = setInterval(() => {
    progress += 0.002;
    if (progress >= 1) {
      progress = 0;
      nextTrack();
    }
    updateProgressUI();
  }, 200);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % tracks.length;
  progress = 0;
  updateTrackUI();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  progress = 0;
  updateTrackUI();
}

// Event listeners
playBtn?.addEventListener("click", () => setPlaying(!isPlaying));
mPlayBtn?.addEventListener("click", () => setPlaying(!isPlaying));

document.getElementById("next-btn")?.addEventListener("click", nextTrack);
document.getElementById("prev-btn")?.addEventListener("click", prevTrack);
document.getElementById("m-next")?.addEventListener("click", nextTrack);
document.getElementById("m-prev")?.addEventListener("click", prevTrack);

document.getElementById("play-hero")?.addEventListener("click", () => {
  currentIndex = tracks.findIndex((t) => t.title === "Midnight Frequencies");
  if (currentIndex < 0) currentIndex = 0;
  progress = 0;
  updateTrackUI();
  setPlaying(true);
});

// Progress bar click
function setupProgressBar(bar, fill) {
  bar?.addEventListener("click", (e) => {
    const rect = bar.getBoundingClientRect();
    progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    updateProgressUI();
  });
}
setupProgressBar(document.getElementById("progress-bar"), progressFill);
setupProgressBar(document.getElementById("mobile-progress-bar"), mobileProgressFill);

// Mobile player toggle
openMobile?.addEventListener("click", () => {
  desktopView.classList.add("hidden");
  mobileView.classList.remove("hidden");
});

closeMobile?.addEventListener("click", () => {
  mobileView.classList.add("hidden");
  desktopView.classList.remove("hidden");
});

// Like button
likeBtn?.addEventListener("click", () => {
  liked = !liked;
  likeBtn.classList.toggle("liked", liked);
});

// Card click → play that track
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.dataset.title;
    const idx = tracks.findIndex((t) => t.title === title);
    if (idx >= 0) {
      currentIndex = idx;
      progress = 0;
      updateTrackUI();
      setPlaying(true);
    }
  });
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target.tagName !== "INPUT") {
    e.preventDefault();
    setPlaying(!isPlaying);
  } else if (e.code === "ArrowRight") nextTrack();
  else if (e.code === "ArrowLeft") prevTrack();
});

// Init
updateTrackUI();
setPlaying(true);

// Greeting based on time
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  const h1 = document.querySelector(".greeting h1");
  if (h1) h1.textContent = `${greeting}, Gedion`;
}
updateGreeting();
