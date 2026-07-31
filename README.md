# KERF beta landing (GitHub Pages)

Public page for testers: **one stable URL**, latest Windows installer via **GitHub Releases** (no Dropbox links).

## Folder

```
docs/
  index.html
  styles.css
  app.js
  releases.json      ← edit this when you ship
  assets/kerf-mark.png
  README.md
```

## One-time setup

1. Create a **private or public** GitHub repo (e.g. `kerf-beta`). Private is fine for Pages on paid plans; for a free public tester portal use a **public** repo that only holds the landing + release binaries (never put `KEYS.md` here).
2. Push this `docs/` folder (or the whole kerf project).
3. GitHub → **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` (or `master`)
   - Folder: **/docs**
4. Edit `releases.json`:
   - `github.owner` = your username or org
   - `github.repo` = repo name
5. Site URL will look like:  
   `https://YOUR_USERNAME.github.io/kerf-beta/`

## Each new build (e.g. beta.5)

1. Build: `npm run dist:beta`
2. GitHub → **Releases → Draft a new release**
   - Tag: `v2.0.0-beta.5`
   - Title: `KERF 2.0.0-beta.5`
   - Attach: `KERF-Workshop-Quoter-2.0.0-beta.5-Setup.exe`
3. Update `docs/releases.json`:
   - Move current `latest` into `history` (short notes)
   - Set new `latest` (version, tag, file, notes, sizeMb)
   - Leave `url` empty — the page builds the download URL from owner/repo/tag/file  
     Or set `url` to the exact asset link from the Release page.
4. Commit + push `docs/releases.json` (and any page changes).
5. DM testers only: *“Update available on the usual page”* + the Pages URL.

## What never goes on this site

- Tester keys (`KEYS.md`, owner key)
- Private DM templates with keys
- Your local `db.json`

## Local preview

Open `docs/index.html` in a browser, or from the repo root:

```powershell
npx --yes serve docs
```

Then visit the local URL shown in the terminal.
