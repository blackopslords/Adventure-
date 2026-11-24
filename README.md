# PanelHub — Discord Server Panel Team Showcase

A responsive, animated Discord server panel team showcase website featuring a **3D Mirror Shape Profile Slider**, full-bleed dynamic backdrops, per-profile custom text, screenshot support, and per-member theme music playback.

---

## 1. Run Locally from GitHub

```bash
git clone <your-github-repo-url>
cd <your-repo-folder>
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 2. Deploy Directly on GitHub Pages

This project includes `.github/workflows/deploy.yml` and relative asset paths (`base: './'` in `vite.config.ts`) so it works out of the box on GitHub Pages:

1. Push this code to your GitHub repository (`main` branch).
2. In your GitHub repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. GitHub will automatically build (`npm run build`) and publish your live website URL.

---

## 3. Owner Edit Mode & Protecting Edits from Random Visitors

By default, **all edit buttons and text forms are hidden from public visitors**. Visitors can only browse the 3D Mirror Slider, view profiles, and play music.

- **To unlock Owner Edit Mode**: Scroll to the bottom footer and click **Owner Access** (or press `Ctrl + Shift + E`).
- **Default Owner Passcode**: `kaisar2026`
- **Change your passcode before publishing**: Edit `src/config/adminConfig.ts` (or set `VITE_ADMIN_PASSCODE` in GitHub Actions secrets/env).

> **Important Note for GitHub Pages (Static Hosting)**:
> Edits made via **Edit Text & Media** in your browser preview are saved locally in your browser (`localStorage`). To make your updated pictures, text, and `.mp3` music visible to **all public visitors**, add them to your GitHub repository:

### Zero-Code Music & Photo Drop-In Folders (Recommended):
You do **not** need to edit any code to change songs or pictures:

1. **Change Background Music (`.mp3`, `.wav`, `.ogg`, `.m4a`):**
   - Upload or drag-and-drop files into **`src/music/`**
   - Name them `01.mp3`, `02.mp3`, `03.mp3`, `04.mp3`, `05.mp3` (or `01-songname.mp3`, `02-songname.mp3`) — they automatically attach to Profile `01` through `05`!
2. **Change Profile Card Photos (`.png`, `.jpg`, `.webp`):**
   - Upload or drag-and-drop images into **`src/posters/`** named `01.png`, `02.png`, etc.
3. **Change Hero Background Photos:**
   - Upload or drag-and-drop wide images into **`src/backdrops/`** named `01.jpg`, `02.jpg`, etc.
4. **Change Hero Background Videos (Muted, Low-Opacity Loop):**
   - Upload or drag-and-drop `.mp4`, `.webm`, or `.mov` videos into **`src/videos/`**
   - Name them `01.mp4`, `02.mp4`, `03.mp4`, `04.mp4`, `05.mp4` (or `01-name.mp4` / member first name) — they play muted at subtle opacity behind that profile's Hero slide without interfering with theme music!
5. **Upload Discord Funny Clips (YouTube Serial Gallery with Fire Frames):**
   - Upload or drag-and-drop `.mp4`, `.webm`, `.mov`, or `.m4v` files into **`src/funny-videos/`**
   - Name them `01.mp4`, `02.mp4`, `03.mp4` (or `01-funny-moment.mp4`) — they appear above the footer in serial order with sound enabled and animated fire lighting outline frames.
6. **Upload Public Files for Download Extensions (`.exe`, `.jpg`, `.mp4`, `.mp3`, `.zip`, etc.):**
   - Upload or push ANY file inside **`src/extensions/`** on GitHub.
   - All files in `src/extensions/` appear **only** on the **Download Extensions** page for public visitors to download directly with their exact original filename.
7. **Change Names, Handles, Roles, or Bio Text:**
   - Edit `src/data/teamProfiles.ts`.

Commit or upload directly on GitHub — GitHub Actions automatically builds and updates the live website for all visitors!

