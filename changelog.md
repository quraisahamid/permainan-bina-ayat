# Changelog - Permainan Bina Ayat Bahasa Melayu

Documenting all design, functional, and structural updates made for the primary school remedial (*Pemulihan*) sentence-building game.

---

## 📌 Project Overview
* **Target Audience:** Primary school pupils with reading, writing, and pronunciation difficulties.
* **Grammar Pattern:** `Siapa (Subjek)` + `Kata Kerja` + `Apa (Objek)` + `Perluasan`
* **Total Content:** 16 distinct exercises across 4 worksheets (*Lembaran 1 - 4*).

---

## 🚀 Summary of Changes Made

### 1. Game Structure & Navigation
- **Sequential One-by-One Progression:** Game splits worksheets into 1 image and 1 sentence task per screen.
- **Manual Navigation:** Added a **`Ayat Seterusnya ➡️` (Next)** button so pupils or teachers can control the pace instead of auto-advancing.
- **Backtracking Control:** Added a **`⬅️ Sebelum` (Previous)** button allowing teachers to return to prior questions for review.
- **Button Locking Logic:** The "Next" button remains disabled (`disabled = true`) until the pupil successfully orders the sentence correctly.
- **Gated Tooltip Warning:** Added a CSS/JS hover tooltip over the disabled "Next" button displaying:
  > *"Sila lengkapkan ayat dahulu sebelum ke ayat seterusnya"*

---

### 2. UI & Visual Enhancements
- **Header Elements:** Added a bold primary title (**`Permainan Bina Ayat`**) and clear instructional prompt (**`Sila baca dan lengkapkan ayat berdasarkan gambar.`**).
- **Auto-Fitting Image Containers:** Updated the picture card CSS (`object-fit: contain`) to auto-scale images up to `240px` height without cropping or stretching.
- **Image Extension Format:** Updated all image source paths from `.jpg` to `.png` (`images/lembaranX_Y.png`).
- **Color-Coded Scaffolding:** Applied dynamic background colors matching the original physical worksheets:
  - 🔵 **Siapa:** Light Blue (`#bfdbfe`)
  - 🩷 **Kata Kerja:** Soft Pink (`#fbcfe8`)
  - 🟢 **Apa:** Mint Green (`#bbf7d0`)
  - 🟡 **Perluasan:** Soft Yellow (`#fef08a`)

---

### 3. Audio & Pronunciation System
- **Offline Audio Support:** Configured JavaScript to trigger local MP3 files directly from an `audio/` subfolder for 100% offline reliability.
- **Per-Sentence Audio Trigger:** Embedded direct MP3 file triggers for each sentence (`audio/ayatX_Y.mp3`).
- **Audio Feedback:** Integrated audio triggers for answer verification (`audio/correct.mp3` and `audio/try_again.mp3`).

---

## 📂 Final Recommended Directory Structure

```text
project-folder/
│
├── index.html
├── CHANGELOG.md
│
├── images/
│   ├── lembaran1_1.png
│   ├── lembaran1_2.png
│   ├── lembaran1_3.png
│   ├── lembaran1_4.png
│   ├── lembaran2_1.png
│   ├── ...
│   └── lembaran4_4.png
│
└── audio/
    ├── ayat1_1.mp3
    ├── ayat1_2.mp3
    ├── ...
    ├── ayat4_4.mp3
    ├── correct.mp3
    └── try_again.mp3





Color-Coded Word Blocks: Assign specific colors to parts of speech (e.g., Blue for Subjects/Nouns like Saya/Kucing, Green for Verbs/Actions like makan/berlari, and Yellow for Objects/Complements like nasi/di padang). This helps pupils visually map out the sentence structure $(Subject + Verb + Object)$.Audio Assistance (Text-to-Speech): Allow pupils to tap any word block to hear it pronounced clearly before placing it into the sentence slot.Immediate & Gentle Feedback: Avoid harsh error sounds. If a word is placed in the wrong spot, have it gently bounce back with a soft, encouraging cue so pupils feel safe to try again.Visual Reinforcement: Display a clear, simple illustration or picture cue of the action alongside the sentence so pupils can connect the written words to real meaning.Bite-Sized Progress: Use 3-word or 4-word sentences initially, celebrating every complete sentence with fun, low-stress rewards (like earning stars or unlocking a cute animation).