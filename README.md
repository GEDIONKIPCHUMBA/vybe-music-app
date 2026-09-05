# VYBE – Your sound. Your world.

A modern music streaming UI with **real audio playback**. Desktop home + mobile full-screen player.

## Features

- **Real audio playback** – HTML5 Audio streaming free SoundHelix demo tracks
- **Desktop Home**
  - Sidebar navigation (Home, Search, Library, Likes, Playlists)
  - Personalized greeting
  - New release hero banner
  - Quick picks, Made For You mixes, Browse by Genre
  - Sticky now-playing bar with live progress & controls
- **Mobile Player**
  - Full-screen immersive view
  - Large album art
  - Transport controls, like, lyrics & queue shortcuts
  - Live progress scrubbing
- **Player features**
  - Play / pause, next / previous
  - Click progress bar to seek
  - Shuffle & Repeat (off → all → one)
  - Track switching from cards, mixes & genres
  - Keyboard: `Space` (play/pause), `←` / `→` (prev/next)
  - Media Session API (OS lock-screen controls)
  - Responsive layout

## Tech Stack

- Pure **HTML / CSS / JavaScript** — no frameworks
- HTML5 Audio for real streaming playback
- Free demo tracks from [SoundHelix](https://www.soundhelix.com)
- Inter font · CSS Grid + Flexbox · dark purple/pink theme

## Live Demo

Open `index.html` in any modern browser, or:

```bash
npx serve .
# or
python -m http.server 8000
```

Click **Play** (or any track card) — audio starts streaming immediately.

## Project Structure

```
vybe-music-app/
├── index.html      # Markup for desktop + mobile views
├── styles.css      # All styles & responsive breakpoints
├── script.js       # Real player logic (Audio API)
└── README.md
```

## Credits

UI design concept by Gedion · Audio demos by SoundHelix (algorithmic free music).

---

**VYBE** · Your sound. Your world.
