# PsyQuest PWA (WAMP + MySQL Edition)

PsyQuest is a Progressive Web App for psychological group therapy sessions (4-12 participants, 14+).
The current default setup is **self-hosted on WAMP + MySQL** (no Firebase required).

## Core Features

- QR-based join with one session link (no account required)
- Anonymous avatars (e.g. `Brave Lion`)
- Cooperative + friendly competitive therapeutic rounds
- Realtime sync via self-hosted PHP API + MySQL polling
- Therapist moderation chat, sticker-only mode, notes, debrief timer
- PWA support (install/offline shell)

## Project Structure

```text
.
├── api
│   ├── config.php
│   └── index.php
├── db
│   └── psyquest_wamp_schema.sql
├── app.js
├── backend-config.js
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── styles.css
└── assets
    └── icons
```

## WAMP Setup (Windows VPS / local WAMP)

### 1) Put project into WAMP web root

Example:

`C:\wamp64\www\psyquest\`

Then app URL will be:

`http://localhost/psyquest/`

### 2) Create database in MySQL

Use phpMyAdmin (or MySQL CLI):

- Create database `psyquest` with charset `utf8mb4`, collation `utf8mb4_unicode_ci`
- Optionally import `db/psyquest_wamp_schema.sql`

> Note: `api/index.php` also auto-creates required tables if DB exists and DB user has CREATE permissions.

### 3) Configure DB credentials

Edit `api/config.php`:

```php
return [
  "host" => "127.0.0.1",
  "port" => 3306,
  "database" => "psyquest",
  "username" => "root",
  "password" => "",
  "charset" => "utf8mb4",
];
```

### 4) Verify backend health

Open:

`http://localhost/psyquest/api/index.php?action=health`

You should get JSON like:

```json
{"ok":true,"data":{"status":"ok","driver":"wamp-mysql","serverTime":...}}
```

### 5) Open app

- Therapist: `http://localhost/psyquest/`
- Player join example: `http://localhost/psyquest/?session=ABC123`

If everything is correct, top badge shows **WAMP MySQL** (not Demo).

## Realtime mode config

`backend-config.js` controls runtime backend:

```js
window.PSYQUEST_BACKEND_CONFIG = {
  mode: "wamp",               // wamp | firebase | demo | auto
  apiBaseUrl: "./api/index.php",
  pollIntervalMs: 1500
};
```

## Troubleshooting (still shows Demo mode)

1. Check health endpoint:
   - `/api/index.php?action=health`
2. Check DB credentials in `api/config.php`
3. Make sure Apache + MySQL are running in WAMP
4. Hard reload browser (service-worker cache)
5. Ensure URL path matches project folder (`/psyquest/` etc.)

## Optional: Firebase/Netlify compatibility

Legacy Firebase/Netlify files are still present for optional cloud deployment, but WAMP is now the default runtime.

## Suggested Clinical Session Flow (45-60 min)

- 15 min game round
- 30 min reflection/debrief
- 15 min second round and closure

## Safety Note

PsyQuest is a therapeutic support tool, not an emergency-care system.
Do not use as sole intervention in acute crisis contexts.