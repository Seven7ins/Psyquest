# PsyQuest PWA

PsyQuest is a Progressive Web App for psychological group therapy sessions (4-12 participants, 14+).
It is designed as a low-pressure multiplayer game: no accounts, no app-store installation, QR join,
anonymous avatars, and cooperative therapeutic gameplay based on CBT/DBT.

## Features

- **Single QR join flow**: therapist creates one session, participants join instantly by scanning.
- **Anonymous identity**: auto-generated avatar names (e.g. `Brave Lion`).
- **Realtime multiplayer**:
  - Firestore for sessions, players, therapist notes.
  - Realtime Database for chat and live actions.
  - Firebase Anonymous Auth for session participation.
- **Game modes**
  - Cooperative focus (escape room + boss fight).
  - Friendly competitive modes (Empathy Duel, Skill Race, Perspective Battle).
- **Therapeutic session flow**
  - Team progress + boss HP bars.
  - Badges/levels and end-of-round meme + certificate card.
  - Automatic 3-minute debrief prompts after rounds.
- **Anonymity mode** for social phobia: sticker-only chat.
- **PWA support**: service worker + manifest for install/offline shell.
- **Data privacy orientation (DSGVO-style)**: anonymized participant data, explicit consent toggle, anonymous therapist notes.

## Project Structure

```text
.
├── app.js
├── firebase-config.js
├── firebase.json
├── index.html
├── manifest.webmanifest
├── netlify.toml
├── service-worker.js
├── styles.css
└── assets
    └── icons
        ├── icon-192.svg
        └── icon-512.svg
```

## Local Run (Quick Start)

You can run this without Firebase credentials in **Demo Local mode**:

1. Serve static files:
   - Python: `python3 -m http.server 8080`
2. Open:
   - Therapist view: `http://localhost:8080/index.html`
   - Player view example: `http://localhost:8080/index.html?session=ABC123`
3. Open multiple tabs/devices to simulate participants.

When no valid Firebase config is set, the app automatically switches to Demo mode (localStorage + BroadcastChannel).

## Firebase Setup (Production Multiplayer)

### 1) Create Firebase project

In Firebase Console:
- Create project.
- Enable **Authentication -> Anonymous**.
- Create **Cloud Firestore** database.
- Create **Realtime Database**.
- Add a Web App to get config.

### 2) Configure `firebase-config.js`

Replace placeholders:

```js
window.PSYQUEST_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  databaseURL: "https://<project>-default-rtdb.firebaseio.com"
};
```

### 3) Firestore / RTDB security baseline (recommended)

- Keep anonymous access restricted to session-scoped data.
- Add TTL/retention policy for old sessions if needed.
- Avoid storing identifying personal data.

## Netlify Deploy (Recommended)

This repo is now configured for Netlify via `netlify.toml`:
- SPA fallback redirect (`/* -> /index.html`) so session links like `?session=ABC123` work.
- PWA headers for `service-worker.js` and `manifest.webmanifest`.

Deploy steps:

1. Push this repo to GitHub.
2. In Netlify: **Add new site -> Import an existing project**.
3. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: `.`
4. Deploy site.
5. Open your site URL:
   - Therapist: `https://your-site.netlify.app/`
   - Player join: `https://your-site.netlify.app/?session=ABC123`

## Netlify + Firebase Notes

- Keep Firebase credentials in `firebase-config.js` (client-safe public web config).
- For stricter ops, you can generate this file during CI from Netlify env vars.
- Make sure Firebase Authentication (anonymous), Firestore and RTDB rules allow your intended session flow.

## Vercel Deploy

1. Import the repository in Vercel.
2. Framework preset: `Other`.
3. Build command: none.
4. Output directory: root.
5. Deploy.

Because this is a static PWA, it runs directly from static hosting.

## Firebase Hosting Deploy (Optional)

If you prefer Firebase Hosting, `firebase.json` is included and ready.

## Suggested Clinical Use Flow (45-60 min)

- 15 min game round (escape room or boss fight)
- 30 min moderated reflection/debrief
- 15 min second round and closure

## Safety / Scope Note

PsyQuest is a therapeutic support tool, not an emergency-care system.  
Do not use as sole intervention in acute crisis contexts.