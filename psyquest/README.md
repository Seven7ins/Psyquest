# PsyQuest – Therapeutic Group Game PWA

A multiplayer Progressive Web App for psychological group therapy sessions. Patients join via QR code – no accounts, no installation. Designed for groups of 4–12 people (adults or teens 14+).

## Features

- **No Installation Required**: PWA runs in any modern browser
- **QR Code Join**: Therapist generates QR code, patients scan to join instantly
- **Anonymous Avatars**: Fun animal names (e.g., "Mutiger Löwe") – no personal data
- **DSGVO-Compliant**: Anonymous data storage, encrypted transmission, auto-delete
- **5 Game Modes**:
  - 🏰 **Escape Room** – Cooperative escape from the "Angst-Labyrinth"
  - ⚔️ **Boss Fight** – Team battle against inner demons
  - 💬 **Empathy Duel** – Who shows the most compassion?
  - 🏃 **Skill Race** – Fastest coping strategy selection
  - 🔮 **Perspective Battle** – View from your "future strong self"
- **Disorder-Specific Quests**: Depression, Anxiety, Social Phobia, Stress, DBT/CBT
- **Sticker Chat**: Anonymous communication option for social phobia
- **Gamification**: Badges, levels, progress bars, victory screens
- **Reflection Phase**: Built-in debrief with timed reflection questions

## Tech Stack

- **Frontend**: HTML5, CSS3 (Tailwind CDN), Vanilla JavaScript
- **Real-time**: Firebase (Firestore + Realtime Database + Anonymous Auth)
- **QR Code**: QRCode.js
- **PWA**: Service Worker for offline support
- **Hosting**: Firebase Hosting or Vercel

## Quick Start (Local Testing)

The app works out of the box in **mock mode** (no Firebase needed):

```bash
# Option 1: Python
cd psyquest
python3 -m http.server 8080

# Option 2: Node.js
npx serve psyquest

# Option 3: Any static file server
# Open index.html in your browser
```

Then open `http://localhost:8080` in your browser.

### Testing Flow

1. Open the app in one browser tab → Click "Therapeut – Session starten"
2. Configure session settings and select a game mode
3. Click "Session erstellen" → Note the session code
4. Open another browser tab → Click "Spieler – Session beitreten"
5. Enter the session code → Accept privacy consent
6. Return to therapist tab → Click "Spiel starten"

## Firebase Setup (Production)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g., "psyquest-app")
3. Enable **Anonymous Authentication**:
   - Authentication → Sign-in method → Anonymous → Enable
4. Create **Firestore Database**:
   - Firestore Database → Create database → Start in test mode
5. Create **Realtime Database**:
   - Realtime Database → Create database → Start in test mode

### 2. Get API Keys

1. Project Settings → General → Your apps → Add web app
2. Copy the `firebaseConfig` object

### 3. Configure the App

Edit `js/firebase-config.js`:

```javascript
const USE_FIREBASE = true;

const FIREBASE_CONFIG = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 4. Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read, write: if true;
      match /players/{playerId} {
        allow read, write: if true;
      }
      match /actions/{actionId} {
        allow read, write: if true;
      }
    }
  }
}
```

### 5. Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project, set public directory to "psyquest"
firebase deploy
```

### Deploy to Vercel

```bash
npm install -g vercel
cd psyquest
vercel
```

## Project Structure

```
psyquest/
├── index.html           # Main entry – all views in one SPA
├── styles.css           # Responsive styles (Tailwind + custom)
├── manifest.json        # PWA manifest
├── sw.js                # Service worker for offline support
├── js/
│   ├── firebase-config.js  # Firebase config + MockDB for local testing
│   ├── data.js             # All game content, quests, avatars, badges
│   ├── app.js              # Main app controller, session management
│   ├── games.js            # Escape Room & Boss Fight engines
│   └── competitive.js      # Empathy Duel, Skill Race, Perspective Battle
├── icons/
│   ├── icon-192.png     # PWA icon 192x192
│   ├── icon-512.png     # PWA icon 512x512
│   └── icon-192.svg     # SVG source
└── README.md            # This file
```

## Game Modes – Detailed

### Cooperative Mode (70% focus)

#### Escape Room: "Flucht aus dem Angst-Labyrinth"
- 4 rooms with therapeutic puzzles
- **Emotion-Match-Up**: Match anxiety symptoms to coping strategies (DBT emotion regulation)
- **Strength Discovery**: Name personal strengths to defeat the Inner Critic
- **Coping Maze**: Choose effective vs. ineffective coping paths
- **Group Affirmation**: Collect encouraging messages as light against darkness

#### Boss Fight: "Kampf gegen innere Dämonen"
- 4–5 rounds against bosses like "Anxiety Monster", "Inner Critic", "Stress Volcano"
- Each round: boss attacks with a scenario, group responds with coping strategies
- HP bar decreases with each helpful response
- Combo streaks for consecutive effective responses

### Competitive Mode (friendly, reflective)

#### Empathy Duel
- Scenarios presented, players write empathic responses
- Anonymous group voting on most helpful/empathic response
- Points for creativity and genuine empathy

#### Skill Race
- Multiple-choice coping scenarios with point values
- Option to enter custom strategies for bonus points
- Speed matters but quality matters more

#### Perspective Battle
- Describe situations from "future strong self" perspective
- Judged on creativity, hope, and self-compassion
- Group voting on most inspiring perspective

## 10 Sample Quest Ideas

1. **Flucht aus dem Angst-Labyrinth** – Navigate anxiety with coping tools (included)
2. **Dunkelheits-Drache besiegen** – Fight depression with light and hope (included)
3. **Soziale Brücke bauen** – Overcome social fear step by step (included)
4. **Stress-Vulkan beruhigen** – Cool down the stress volcano (included)
5. **Emotions-Labor** – DBT emotion labeling experiments
6. **Gedanken-Tribunal** – Put cognitive distortions on trial (CBT)
7. **Werte-Kompass** – Discover personal values (ACT-based)
8. **Achtsamkeits-Oase** – Mindfulness challenges in a virtual oasis
9. **Selbstmitgefühl-Schatz** – Find the treasure of self-compassion
10. **Zukunfts-Zeitreise** – Time travel to a hopeful future self

## Therapeutic Foundation

- **CBT** (Cognitive Behavioral Therapy): Thought reframing, cognitive restructuring
- **DBT** (Dialectical Behavior Therapy): Emotion regulation, distress tolerance (TIPP skill), mindfulness
- **ACT** (Acceptance and Commitment Therapy): Values exploration, cognitive defusion
- **Positive Psychology**: Strengths-based approach, gratitude, hope
- **Group Therapy**: Cohesion building, normalization, peer support

## Session Structure (recommended)

| Phase | Duration | Activity |
|-------|----------|----------|
| Warm-up | 5 min | Join session, avatar assignment |
| Game 1 | 15 min | Escape Room or Boss Fight |
| Reflection 1 | 10 min | Guided debrief questions |
| Game 2 | 15 min | Competitive mode |
| Reflection 2 | 10 min | Deep reflection, therapist moderation |
| Closing | 5 min | Badges, certificates, takeaways |

## Privacy & DSGVO Compliance

- No personal data collected
- Anonymous avatars assigned automatically
- All data encrypted in transit (HTTPS/WSS)
- Session data auto-deletes on session end
- Optional therapist notes stored locally
- No tracking cookies or analytics
- Consent dialog before participation

## License

MIT License – Free for therapeutic and educational use.
