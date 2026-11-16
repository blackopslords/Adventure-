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

### Permanent Update Steps for Public Visitors:
1. Create `public/images/` and `public/music/` folders in your repository.
2. Put your Discord screenshots (e.g. `kaisar.png`) in `public/images/` and `.mp3` files (e.g. `kaisar.mp3`) in `public/music/`.
3. Update `src/data/teamProfiles.ts`:

```ts
{
  id: 'kaisar-founder',
  name: 'Kaisar Sakib',
  discordHandle: '@kaisar.dev',
  roleTitle: 'Server Founder & Owner',
  posterUrl: './images/kaisar.png',
  backdropUrl: './images/kaisar-bg.jpg',
  customAudioUrl: './music/kaisar.mp3',
  customTrackName: 'Kaisar Theme',
  customText: 'Your custom profile message here...',
  // ...
}
```

4. Commit and push to GitHub — GitHub Pages automatically updates the live site for everyone!
