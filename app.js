(function psyQuestApp() {
  "use strict";

  const MAX_PLAYERS = 12;
  const MIN_RECOMMENDED_PLAYERS = 4;

  const THEMES = [
    { value: "anxiety", label: "Angst und Sorgen" },
    { value: "depression", label: "Niedergeschlagenheit" },
    { value: "social-phobia", label: "Unsicherheit in Gruppen" },
    { value: "stress", label: "Umgang mit Stress" },
    { value: "cbt-dbt", label: "Hilfreiche Denkweisen" }
  ];

  const STICKERS = [
    { emoji: "\uD83D\uDCAA", label: "Du schaffst das" },
    { emoji: "\uD83E\uDDD8", label: "Durchatmen" },
    { emoji: "\uD83C\uDF1F", label: "Starker Moment" },
    { emoji: "\uD83E\uDD1D", label: "Ich bin bei dir" },
    { emoji: "\uD83D\uDEE1\uFE0F", label: "Inneres Schild" },
    { emoji: "\uD83D\uDD25", label: "Weiter so" }
  ];

  const REFLECTION_QUESTIONS = [
    "Was hat dich heute stark gemacht?",
    "Welche Uebung war fuer dich am hilfreichsten?",
    "Was moechtest du als naechstes im Alltag ausprobieren?",
    "Wann hat dich die Gruppe besonders unterstuetzt?",
    "Welchen ermutigenden Satz nimmst du heute mit?"
  ];

  const MEME_LINES = [
    "Der innere Kritiker wurde zum Schweigen gebracht. Teamwork aktiviert!",
    "Angst-Gegner auf stumm geschaltet.",
    "Super Kombination: Umdenken + Atmen + Unterstuetzung.",
    "Der Gegner sagt: 'Okay, das war wirklich einfuehlsam.'",
    "Ergebnis: Scham -20%, Mut +35%, Zusammenhalt +40%."
  ];

  const STATUS_LABELS = {
    lobby: "Warteraum",
    in_game: "Runde laeuft",
    victory: "Geschafft!",
    debrief: "Besprechung",
    completed: "Beendet"
  };

  const QUEST_LIBRARY = [
    {
      id: "escape-anxiety-labyrinth",
      theme: "anxiety",
      title: "Weg durch das Angst-Labyrinth",
      bossName: "Angst-Gegner",
      bossEmoji: "\uD83D\uDC7E",
      summary: "Gemeinsam Auswege finden mit Achtsamkeit und hilfreichen Gedanken."
    },
    {
      id: "inner-critic-boss",
      theme: "cbt-dbt",
      title: "Kampf gegen den inneren Kritiker",
      bossName: "Innerer Kritiker",
      bossEmoji: "\uD83D\uDC79",
      summary: "Einfuehlsame Antworten finden und hilfreiche Gedanken ueben."
    },
    {
      id: "darkness-dragon",
      theme: "depression",
      title: "Den Schatten-Drachen besiegen",
      bossName: "Schatten-Drache",
      bossEmoji: "\uD83D\uDC32",
      summary: "Kleine machbare Schritte gegen Rueckzug und Antriebslosigkeit."
    },
    {
      id: "social-bridge",
      theme: "social-phobia",
      title: "Die Bruecke der mutigen Schritte",
      bossName: "Echo-Richter",
      bossEmoji: "\uD83D\uDC7B",
      summary: "Gemeinsam sichere Uebungen fuer mehr Selbstvertrauen in Gruppen."
    },
    {
      id: "stress-reactor",
      theme: "stress",
      title: "Stress-Alarm abschalten",
      bossName: "Ueberlastungs-Riese",
      bossEmoji: "\uD83E\uDDA0",
      summary: "Uebungen fuer mehr Gelassenheit und bessere Prioritaeten."
    },
    {
      id: "emotion-compass",
      theme: "cbt-dbt",
      title: "Gefuehls-Kompass Expedition",
      bossName: "Stimmungs-Phantom",
      bossEmoji: "\uD83C\uDF2A\uFE0F",
      summary: "Gefuehle erkennen, benennen und kluge Entscheidungen treffen."
    }
  ];

  const ESCAPE_CHALLENGES = [
    {
      id: "escape-emotion-match",
      type: "escape",
      title: "Raum 1: Gefuehle zuordnen",
      description:
        "Ordne die koerperlichen Zeichen den passenden Hilfen zu. Jede richtige Zuordnung oeffnet ein Stueck der Tuer.",
      options: [
        "Herzklopfen \u2192 Langsam ein- und ausatmen",
        "Schlimme Gedanken \u2192 Gedanken hinterfragen",
        "Innere Unruhe \u2192 5 Dinge sehen, 4 hoeren, 3 fuehlen",
        "Rueckzug \u2192 Einen kleinen Schritt machen"
      ]
    },
    {
      id: "escape-strength-discovery",
      type: "escape",
      title: "Raum 2: Staerken entdecken",
      description:
        "Der Gegner wackelt! Nenne deine persoenlichen Staerken. Jede Staerke wird zu einem Schluessel.",
      options: [
        "Ich halte auch schwierige Momente aus.",
        "Ich frage um Hilfe, wenn ich sie brauche.",
        "Ich kann kleine Schritte planen.",
        "Ich bin freundlich zu mir, auch bei Unsicherheit."
      ]
    },
    {
      id: "escape-coping-maze",
      type: "escape",
      title: "Raum 3: Den richtigen Weg waehlen",
      description:
        "An der Weggabelung: Vermeiden oder handeln? Das Team waehlt gemeinsam den Weg, der langfristig hilft.",
      options: [
        "Vermeidung: kurzfristig ruhig, langfristig enger",
        "Schritt fuer Schritt: kurzfristig schwer, langfristig frei",
        "Selbstkritik: Energie sinkt",
        "Selbstmitgefuehl: Energie steigt"
      ]
    },
    {
      id: "escape-group-jigsaw",
      type: "escape",
      title: "Raum 4: Gemeinsame Botschaft",
      description:
        "Jede Person traegt einen Teil bei. Das gemeinsame Bild lautet: 'Angst ist ein Hinweis, kein Urteil.'",
      options: [
        "Ich bin nicht allein.",
        "Gefuehle sind wie Wellen - sie kommen und gehen.",
        "Atmen ist eine echte Hilfe.",
        "Mut bedeutet: den naechsten kleinen Schritt machen."
      ]
    },
    {
      id: "escape-mindful-gate",
      type: "escape",
      title: "Raum 5: Achtsamkeits-Tor",
      description:
        "Kurz innehalten: Benenne einen Gedanken, ein Gefuehl und eine Koerperempfindung. Das gibt dem Team Kraft.",
      options: [
        "Gedanke: 'Ich schaffe das nicht' \u2192 Umdenken",
        "Gefuehl: Unsicherheit \u2192 Anerkennen",
        "Koerper: Druck in der Brust \u2192 Bewusst atmen",
        "Impuls: Vermeiden \u2192 Kleinen Schritt waehlen"
      ]
    }
  ];

  const BOSS_CHALLENGES = [
    {
      id: "boss-empathy-duel",
      type: "boss",
      title: "Angriff 1: Einfuehlsame Antwort",
      description:
        "Der Gegner sagt: 'Du bist nicht gut genug.' Finde eine einfuehlsame Antwort aus Sicht deines starken Ichs.",
      options: [
        "Ein Gedanke ist nicht die Wahrheit.",
        "Ich darf unsicher sein und trotzdem handeln.",
        "Ich spreche mit mir wie mit einem guten Freund.",
        "Ich bin in Entwicklung, nicht in Bewertung."
      ]
    },
    {
      id: "boss-skill-race",
      type: "boss",
      title: "Angriff 2: Schnelle Hilfe finden",
      description:
        "Stell dir vor: Du bist sehr aufgeregt vor einer Pruefung. Waehle eine Hilfe und mach einen kurzen Plan.",
      options: [
        "60 Sekunden bewusst atmen",
        "Gedanken kurz aufschreiben",
        "Kaltes Wasser ueber die Haende",
        "Einer vertrauten Person schreiben"
      ]
    },
    {
      id: "boss-perspective-battle",
      type: "boss",
      title: "Angriff 3: Blick aus der Zukunft",
      description:
        "Beschreibe die gleiche Situation aus der Sicht deines zukuenftigen, starken Ichs.",
      options: [
        "In 6 Monaten sehe ich: Ich war mutiger als gedacht.",
        "Heute klein, morgen stabil.",
        "Ich uebe, ich versage nicht.",
        "Ich waehle eine Richtung statt Perfektion."
      ]
    },
    {
      id: "boss-affirmation-hunt",
      type: "boss",
      title: "Finale: Ermutigende Saetze sammeln",
      description:
        "Sammelt gemeinsam ermutigende Saetze. Jeder hilfreiche Satz schwaecht den Gegner stark!",
      options: [
        "Ich bin nicht mein Angstgedanke.",
        "Ich kann Hilfe annehmen, ohne schwach zu sein.",
        "Ich darf langsam sein und trotzdem vorankommen.",
        "Ich habe schon schwierige Tage ueberstanden."
      ]
    }
  ];

  const COMPETITIVE_CHALLENGES = [
    {
      id: "competitive-empathy",
      type: "competitive",
      title: "Wer hat die hilfreichste Antwort?",
      description:
        "Verschiedene Antworten werden verglichen. Die Gruppe waehlt anonym die hilfreichste.",
      options: [
        "Gefuehl anerkennen + kleinen Schritt machen",
        "Umdenken + freundlich zu sich sein",
        "Problem loesen + Pause einlegen",
        "Eigene Werte beachten + handeln"
      ]
    },
    {
      id: "competitive-skill-race",
      type: "competitive",
      title: "Wer findet schnell eine gute Hilfe?",
      description:
        "Wer zuerst einen sinnvollen Plan nennt, bekommt Bonuspunkte. Danach kurze Besprechung.",
      options: [
        "Atmen und erden",
        "Gedankenstopp + neuer Gedanke",
        "Kurz bewegen + Wasser trinken",
        "Vertrauensperson kontaktieren"
      ]
    },
    {
      id: "competitive-perspective",
      type: "competitive",
      title: "Blick aus der Zukunft",
      description:
        "Beschreibe die Situation aus Sicht deines zukuenftigen starken Ichs. Punkte fuer Hoffnung und Ehrlichkeit.",
      options: [
        "Heute lerne ich Geduld statt Druck.",
        "Ich handle trotz Unsicherheit.",
        "Ich schaetze Fortschritt statt Perfektion.",
        "Ich kann Hilfe annehmen und wachsen."
      ]
    }
  ];

  const AVATAR_ADJECTIVES = [
    "Mutig",
    "Ruhig",
    "Klug",
    "Neugierig",
    "Bestaendig",
    "Strahlend",
    "Sanft",
    "Wachsam",
    "Hoffnungsvoll",
    "Freundlich"
  ];

  const AVATAR_ANIMALS = [
    "Loewe",
    "Fuchs",
    "Panda",
    "Otter",
    "Falke",
    "Delfin",
    "Wolf",
    "Koala",
    "Adler",
    "Baer"
  ];

  const BOSS_EMOJIS = {
    "Angst-Gegner": "\uD83D\uDC7E",
    "Innerer Kritiker": "\uD83D\uDC79",
    "Schatten-Drache": "\uD83D\uDC32",
    "Echo-Richter": "\uD83D\uDC7B",
    "Ueberlastungs-Riese": "\uD83E\uDDA0",
    "Stimmungs-Phantom": "\uD83C\uDF2A\uFE0F"
  };

  const PLAYER_EMOJIS = ["\uD83D\uDEE1\uFE0F", "\u2B50", "\uD83D\uDD25", "\uD83C\uDF1F", "\uD83D\uDCAA", "\uD83C\uDF3F"];

  const ui = {};
  const state = {
    backend: null,
    backendMode: "demo",
    role: "therapist",
    user: null,
    sessionId: null,
    session: null,
    players: [],
    chatMessages: [],
    notes: [],
    localAvatar: "",
    joined: false,
    unsubscribers: [],
    deferredInstallPrompt: null,
    autoDebriefRound: null,
    selectedAnswer: null,
    playerContributions: []
  };

  /* ================================================================
     BACKEND CLASSES
     ================================================================ */

  class DemoBackend {
    constructor() {
      this.storageKey = "psyquest_demo_store_v1";
      this.uidKey = "psyquest_demo_uid";
      this.watchers = {
        session: new Map(),
        players: new Map(),
        chat: new Map(),
        notes: new Map()
      };
      this.channel =
        "BroadcastChannel" in window ? new BroadcastChannel("psyquest-demo-channel") : null;

      window.addEventListener("storage", (event) => {
        if (event.key === this.storageKey) {
          this.emitAll();
        }
      });

      if (this.channel) {
        this.channel.onmessage = (event) => {
          const sessionId = event?.data?.sessionId;
          if (sessionId) {
            this.emitSession(sessionId);
            return;
          }
          this.emitAll();
        };
      }
    }

    async initAuth() {
      let uid = localStorage.getItem(this.uidKey);
      if (!uid) {
        uid = `demo-${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(this.uidKey, uid);
      }
      return { uid, isAnonymous: true };
    }

    blankStore() {
      return { sessions: {} };
    }

    readStore() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) {
          return this.blankStore();
        }
        const parsed = JSON.parse(raw);
        if (!parsed.sessions) {
          return this.blankStore();
        }
        return parsed;
      } catch (_error) {
        return this.blankStore();
      }
    }

    writeStore(store, sessionId) {
      localStorage.setItem(this.storageKey, JSON.stringify(store));
      if (this.channel) {
        this.channel.postMessage({ sessionId: sessionId || null });
      }
      if (sessionId) {
        this.emitSession(sessionId);
      } else {
        this.emitAll();
      }
    }

    ensurePack(store, sessionId) {
      if (!store.sessions[sessionId]) {
        store.sessions[sessionId] = {
          session: null,
          players: {},
          chat: [],
          actions: [],
          notes: []
        };
      }
      return store.sessions[sessionId];
    }

    pick(kind, sessionId) {
      const store = this.readStore();
      const pack = this.ensurePack(store, sessionId);
      if (kind === "session") {
        return pack.session;
      }
      if (kind === "players") {
        return Object.values(pack.players).sort((a, b) => (b.score || 0) - (a.score || 0));
      }
      if (kind === "chat") {
        return [...pack.chat].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      }
      if (kind === "notes") {
        return [...pack.notes].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
      return null;
    }

    watch(kind, sessionId, callback) {
      if (!this.watchers[kind].has(sessionId)) {
        this.watchers[kind].set(sessionId, new Set());
      }
      this.watchers[kind].get(sessionId).add(callback);
      callback(this.pick(kind, sessionId));
      return () => {
        const callbacks = this.watchers[kind].get(sessionId);
        if (!callbacks) {
          return;
        }
        callbacks.delete(callback);
      };
    }

    emit(kind, sessionId) {
      const callbacks = this.watchers[kind].get(sessionId);
      if (!callbacks || callbacks.size === 0) {
        return;
      }
      const value = this.pick(kind, sessionId);
      callbacks.forEach((callback) => callback(value));
    }

    emitSession(sessionId) {
      this.emit("session", sessionId);
      this.emit("players", sessionId);
      this.emit("chat", sessionId);
      this.emit("notes", sessionId);
    }

    emitAll() {
      const sessionIds = new Set();
      Object.values(this.watchers).forEach((bySession) => {
        bySession.forEach((_callbacks, id) => sessionIds.add(id));
      });
      sessionIds.forEach((sessionId) => this.emitSession(sessionId));
    }

    async getSession(sessionId) {
      return this.pick("session", sessionId);
    }

    async createSession(sessionId, payload) {
      const store = this.readStore();
      const pack = this.ensurePack(store, sessionId);
      pack.session = { ...payload };
      this.writeStore(store, sessionId);
    }

    async updateSession(sessionId, patch) {
      const store = this.readStore();
      const pack = this.ensurePack(store, sessionId);
      pack.session = {
        ...(pack.session || {}),
        ...patch
      };
      this.writeStore(store, sessionId);
    }

    async upsertPlayer(sessionId, uid, playerPatch) {
      const store = this.readStore();
      const pack = this.ensurePack(store, sessionId);
      pack.players[uid] = {
        ...(pack.players[uid] || {}),
        ...playerPatch
      };
      this.writeStore(store, sessionId);
    }

    async addChatMessage(sessionId, message) {
      const store = this.readStore();
      const pack = this.ensurePack(store, sessionId);
      pack.chat.push({
        id: `chat-${Math.random().toString(36).slice(2, 10)}`,
        ...message
      });
      this.writeStore(store, sessionId);
    }

    async addNote(sessionId, note) {
      const store = this.readStore();
      const pack = this.ensurePack(store, sessionId);
      pack.notes.push({
        id: `note-${Math.random().toString(36).slice(2, 10)}`,
        ...note
      });
      this.writeStore(store, sessionId);
    }

    async applyContribution(sessionId, uid, avatarName, contribution) {
      const store = this.readStore();
      const pack = this.ensurePack(store, sessionId);
      const session = pack.session || {};
      const player = pack.players[uid] || {
        uid,
        avatarName,
        role: "player",
        score: 0,
        contributions: 0
      };

      const currentProgress = Number.isFinite(session.progress) ? session.progress : 0;
      const currentBossHp = Number.isFinite(session.bossHp) ? session.bossHp : 100;
      const currentTotalPoints = Number.isFinite(session.totalPoints) ? session.totalPoints : 0;

      const nextProgress = clamp(currentProgress + contribution.progressGain, 0, 100);
      const nextBossHp = clamp(currentBossHp - contribution.damage, 0, 100);
      const nextTotalPoints = currentTotalPoints + contribution.points;
      const nextTeamLevel = Math.max(1, Math.min(20, Math.floor(nextTotalPoints / 120) + 1));

      pack.session = {
        ...session,
        progress: nextProgress,
        bossHp: nextBossHp,
        totalPoints: nextTotalPoints,
        teamLevel: nextTeamLevel,
        lastContributionAt: Date.now()
      };

      if (nextProgress >= 100 || nextBossHp <= 0) {
        pack.session.status = "victory";
        if (!pack.session.meme) {
          pack.session.meme = contribution.victoryMeme || pickRandom(MEME_LINES);
        }
      }

      pack.players[uid] = {
        ...player,
        avatarName,
        score: (player.score || 0) + contribution.points,
        contributions: (player.contributions || 0) + 1,
        lastAnswer: contribution.message || "",
        updatedAt: Date.now()
      };

      pack.actions.push({
        id: `act-${Math.random().toString(36).slice(2, 10)}`,
        uid,
        avatarName,
        ...contribution,
        createdAt: Date.now()
      });

      this.writeStore(store, sessionId);
    }

    watchSession(sessionId, callback) {
      return this.watch("session", sessionId, callback);
    }

    watchPlayers(sessionId, callback) {
      return this.watch("players", sessionId, callback);
    }

    watchChat(sessionId, callback) {
      return this.watch("chat", sessionId, callback);
    }

    watchNotes(sessionId, callback) {
      return this.watch("notes", sessionId, callback);
    }
  }

  class WampBackend {
    constructor(options) {
      const config = options || {};
      this.apiBaseUrl = String(config.apiBaseUrl || "./api/index.php");
      this.pollIntervalMs = Math.max(700, Number(config.pollIntervalMs) || 1500);
      this.uidKey = "psyquest_wamp_uid";
      this.watchPacks = new Map();
    }

    async initAuth() {
      let uid = localStorage.getItem(this.uidKey);
      if (!uid) {
        uid = `wamp-${Math.random().toString(36).slice(2, 11)}`;
        localStorage.setItem(this.uidKey, uid);
      }
      return { uid, isAnonymous: true };
    }

    async healthCheck() {
      await this.get("health");
    }

    async getSession(sessionId) {
      const data = await this.get("session_get", { sessionId });
      return data.session || null;
    }

    async createSession(sessionId, payload) {
      await this.post("session_create", { sessionId, payload });
    }

    async updateSession(sessionId, patch) {
      await this.post("session_update", { sessionId, patch });
    }

    async upsertPlayer(sessionId, uid, playerPatch) {
      await this.post("player_upsert", { sessionId, uid, playerPatch });
    }

    async addChatMessage(sessionId, message) {
      await this.post("chat_add", { sessionId, message });
    }

    async addNote(sessionId, note) {
      await this.post("note_add", { sessionId, note });
    }

    async applyContribution(sessionId, uid, avatarName, contribution) {
      await this.post("contribution_apply", { sessionId, uid, avatarName, contribution });
    }

    watchSession(sessionId, callback) {
      return this.watchKind("session", sessionId, callback);
    }

    watchPlayers(sessionId, callback) {
      return this.watchKind("players", sessionId, callback);
    }

    watchChat(sessionId, callback) {
      return this.watchKind("chat", sessionId, callback);
    }

    watchNotes(sessionId, callback) {
      return this.watchKind("notes", sessionId, callback);
    }

    watchKind(kind, sessionId, callback) {
      const pack = this.ensurePack(sessionId);
      pack.callbacks[kind].add(callback);

      if (pack.initialized) {
        callback(cloneJsonData(pack.cache[kind]));
      }

      this.startPolling(sessionId);

      return () => {
        pack.callbacks[kind].delete(callback);
        this.stopPollingIfIdle(sessionId);
      };
    }

    ensurePack(sessionId) {
      if (!this.watchPacks.has(sessionId)) {
        this.watchPacks.set(sessionId, {
          callbacks: {
            session: new Set(),
            players: new Set(),
            chat: new Set(),
            notes: new Set()
          },
          cache: {
            session: null,
            players: [],
            chat: [],
            notes: []
          },
          hashes: {
            session: "",
            players: "",
            chat: "",
            notes: ""
          },
          initialized: false,
          inFlight: false,
          timerId: null
        });
      }
      return this.watchPacks.get(sessionId);
    }

    hasCallbacks(pack) {
      return (
        pack.callbacks.session.size > 0 ||
        pack.callbacks.players.size > 0 ||
        pack.callbacks.chat.size > 0 ||
        pack.callbacks.notes.size > 0
      );
    }

    startPolling(sessionId) {
      const pack = this.ensurePack(sessionId);
      if (pack.timerId) {
        return;
      }

      const poll = async () => {
        if (pack.inFlight) {
          return;
        }
        pack.inFlight = true;
        try {
          await this.pollBundle(sessionId);
        } catch (error) {
          console.warn("Abfrage fehlgeschlagen:", error);
        } finally {
          pack.inFlight = false;
        }
      };

      poll();
      pack.timerId = window.setInterval(poll, this.pollIntervalMs);
    }

    stopPollingIfIdle(sessionId) {
      const pack = this.watchPacks.get(sessionId);
      if (!pack) {
        return;
      }
      if (this.hasCallbacks(pack)) {
        return;
      }
      if (pack.timerId) {
        clearInterval(pack.timerId);
      }
      this.watchPacks.delete(sessionId);
    }

    async pollBundle(sessionId) {
      const pack = this.ensurePack(sessionId);
      const data = await this.get("bundle_get", { sessionId });
      const next = {
        session: data.session || null,
        players: Array.isArray(data.players) ? data.players : [],
        chat: Array.isArray(data.chat) ? data.chat : [],
        notes: Array.isArray(data.notes) ? data.notes : []
      };

      ["session", "players", "chat", "notes"].forEach((kind) => {
        const hash = stableHash(next[kind]);
        if (!pack.initialized || hash !== pack.hashes[kind]) {
          pack.hashes[kind] = hash;
          pack.cache[kind] = next[kind];
          pack.callbacks[kind].forEach((callback) => callback(cloneJsonData(next[kind])));
        }
      });

      pack.initialized = true;
    }

    async get(action, params) {
      return this.request("GET", action, params, null);
    }

    async post(action, body) {
      return this.request("POST", action, null, body);
    }

    async request(method, action, params, body) {
      const url = buildApiUrl(this.apiBaseUrl, action, params);
      const options = {
        method,
        headers: {
          Accept: "application/json"
        }
      };

      if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const rawText = await response.text();
      let payload = {};
      try {
        payload = rawText ? JSON.parse(rawText) : {};
      } catch (_error) {
        throw new Error(`Ungueltige Antwort vom Server bei ${action}.`);
      }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `Fehler bei ${action}.`);
      }

      return payload.data || {};
    }
  }

  class FirebaseBackend {
    constructor(config) {
      this.config = config;
      this.app = null;
      this.auth = null;
      this.db = null;
      this.rtdb = null;
      this.fv = null;
    }

    async initAuth() {
      if (!window.firebase) {
        throw new Error("Firebase wurde nicht geladen.");
      }
      if (!firebase.apps.length) {
        firebase.initializeApp(this.config);
      }
      this.app = firebase.app();
      this.auth = firebase.auth();
      this.db = firebase.firestore();
      this.rtdb = firebase.database();
      this.fv = firebase.firestore.FieldValue;

      if (!this.auth.currentUser) {
        await this.auth.signInAnonymously();
      }

      if (!this.auth.currentUser) {
        await new Promise((resolve) => {
          const off = this.auth.onAuthStateChanged((user) => {
            if (user) {
              off();
              resolve(user);
            }
          });
        });
      }

      return this.auth.currentUser;
    }

    async getSession(sessionId) {
      const snapshot = await this.db.collection("sessions").doc(sessionId).get();
      if (!snapshot.exists) {
        return null;
      }
      return { id: snapshot.id, ...snapshot.data() };
    }

    async createSession(sessionId, payload) {
      await this.db.collection("sessions").doc(sessionId).set(payload, { merge: true });
      await this.rtdb.ref(`live/${sessionId}`).update({
        heartbeat: Date.now()
      });
    }

    async updateSession(sessionId, patch) {
      await this.db.collection("sessions").doc(sessionId).set(patch, { merge: true });
    }

    async upsertPlayer(sessionId, uid, playerPatch) {
      await this.db
        .collection("sessions")
        .doc(sessionId)
        .collection("players")
        .doc(uid)
        .set(playerPatch, { merge: true });
    }

    async addChatMessage(sessionId, message) {
      await this.rtdb.ref(`live/${sessionId}/chat`).push({
        ...message,
        createdAt: message.createdAt || Date.now()
      });
    }

    async addNote(sessionId, note) {
      await this.db.collection("sessions").doc(sessionId).collection("notes").add({
        ...note,
        createdAt: note.createdAt || Date.now(),
        createdAtServer: this.fv.serverTimestamp()
      });
    }

    async applyContribution(sessionId, uid, avatarName, contribution) {
      const sessionRef = this.db.collection("sessions").doc(sessionId);
      const playerRef = sessionRef.collection("players").doc(uid);

      await this.db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(sessionRef);
        if (!snapshot.exists) {
          throw new Error("Spiel nicht gefunden.");
        }
        const session = snapshot.data() || {};
        const currentProgress = Number.isFinite(session.progress) ? session.progress : 0;
        const currentBossHp = Number.isFinite(session.bossHp) ? session.bossHp : 100;
        const currentTotalPoints = Number.isFinite(session.totalPoints) ? session.totalPoints : 0;

        const nextProgress = clamp(currentProgress + contribution.progressGain, 0, 100);
        const nextBossHp = clamp(currentBossHp - contribution.damage, 0, 100);
        const nextTotalPoints = currentTotalPoints + contribution.points;
        const nextTeamLevel = Math.max(1, Math.min(20, Math.floor(nextTotalPoints / 120) + 1));

        const patch = {
          progress: nextProgress,
          bossHp: nextBossHp,
          totalPoints: nextTotalPoints,
          teamLevel: nextTeamLevel,
          lastContributionAt: Date.now()
        };

        if (nextProgress >= 100 || nextBossHp <= 0) {
          patch.status = "victory";
          if (!session.meme) {
            patch.meme = contribution.victoryMeme || pickRandom(MEME_LINES);
          }
        }

        transaction.set(sessionRef, patch, { merge: true });
      });

      await playerRef.set(
        {
          uid,
          avatarName,
          role: "player",
          score: this.fv.increment(contribution.points),
          contributions: this.fv.increment(1),
          lastAnswer: contribution.message || "",
          updatedAt: Date.now()
        },
        { merge: true }
      );

      await this.rtdb.ref(`live/${sessionId}/actions`).push({
        uid,
        avatarName,
        challengeType: contribution.challengeType,
        message: contribution.message,
        points: contribution.points,
        progressGain: contribution.progressGain,
        damage: contribution.damage,
        createdAt: Date.now()
      });
    }

    watchSession(sessionId, callback) {
      return this.db
        .collection("sessions")
        .doc(sessionId)
        .onSnapshot((snapshot) => callback(snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null));
    }

    watchPlayers(sessionId, callback) {
      return this.db
        .collection("sessions")
        .doc(sessionId)
        .collection("players")
        .onSnapshot((snapshot) => {
          const players = snapshot.docs
            .map((doc) => ({ uid: doc.id, ...doc.data() }))
            .sort((a, b) => (b.score || 0) - (a.score || 0));
          callback(players);
        });
    }

    watchChat(sessionId, callback) {
      const ref = this.rtdb.ref(`live/${sessionId}/chat`);
      const listener = ref.on("value", (snapshot) => {
        const raw = snapshot.val() || {};
        const entries = Object.entries(raw)
          .map(([id, value]) => ({ id, ...value }))
          .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        callback(entries);
      });
      return () => ref.off("value", listener);
    }

    watchNotes(sessionId, callback) {
      return this.db
        .collection("sessions")
        .doc(sessionId)
        .collection("notes")
        .limit(40)
        .onSnapshot((snapshot) => {
          const notes = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          callback(notes);
        });
    }
  }

  /* ================================================================
     DOM & SETUP
     ================================================================ */

  function initDomRefs() {
    [
      "connectionBadge",
      "installBtn",
      "globalAlertArea",
      "appNavbar",
      "introSection",
      "therapistView",
      "playerView",
      "sessionSetupForm",
      "therapistAliasInput",
      "therapyThemeSelect",
      "questSelect",
      "modeSelect",
      "stickerOnlyMode",
      "consentRequired",
      "createSessionBtn",
      "sessionStatusBadge",
      "sessionIdDisplay",
      "qrCodeContainer",
      "joinLinkInput",
      "copyJoinLinkBtn",
      "teamProgressBar",
      "bossHpBar",
      "roundDisplay",
      "teamLevelDisplay",
      "totalPointsDisplay",
      "memeCertificateArea",
      "startEscapeBtn",
      "startBossBtn",
      "startCompetitiveBtn",
      "openDebriefBtn",
      "completeSessionBtn",
      "therapistPlayersBody",
      "therapistChatFeed",
      "therapistChatInput",
      "therapistSendChatBtn",
      "therapistStickers",
      "therapistNoteInput",
      "saveNoteBtn",
      "therapistNotesList",
      "modOverviewCard",
      "modQuestionText",
      "modAnswersList",
      "modPlayerAnswers",
      "playerJoinCard",
      "playerGameCard",
      "playerDebriefCard",
      "playerSessionIdDisplay",
      "avatarPreview",
      "rerollAvatarBtn",
      "playerConsentCheckbox",
      "joinSessionBtn",
      "debriefQuestions",
      "battleBossName",
      "battleBossHpFill",
      "battleBossHpText",
      "bossSprite",
      "battlePlayerName",
      "battleProgressFill",
      "battleProgressText",
      "playerSprite",
      "challengeTitle",
      "challengeDescription",
      "challengeOptions",
      "playerResponseInput",
      "submitContributionBtn",
      "playerScoreValue",
      "playerTeamLevelValue",
      "playerRoundValue",
      "playerBadgesList",
      "playerChatFeed",
      "playerChatInput",
      "playerSendChatBtn",
      "playerStickers",
      "stickerOnlyHint"
    ].forEach((id) => {
      ui[id] = document.getElementById(id);
    });
  }

  function setupInitialState() {
    const query = new URLSearchParams(window.location.search);
    const sessionParam = normalizeSessionId(query.get("session"));
    state.sessionId = sessionParam || null;
    state.role = state.sessionId ? "player" : "therapist";
    state.localAvatar = generateAvatarName();

    ui.avatarPreview.textContent = state.localAvatar;
    ui.playerSessionIdDisplay.textContent = state.sessionId || "-";
    ui.playerConsentCheckbox.checked = false;
    ui.playerDebriefCard.classList.add("d-none");
    ui.playerGameCard.classList.add("d-none");
  }

  function toggleRoleView() {
    const therapist = state.role === "therapist";
    ui.therapistView.classList.toggle("d-none", !therapist);
    ui.playerView.classList.toggle("d-none", therapist);
    ui.appNavbar.classList.toggle("d-none", !therapist);
    ui.introSection.classList.toggle("d-none", !therapist);
  }

  function populateThemeSelect() {
    ui.therapyThemeSelect.innerHTML = "";
    THEMES.forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme.value;
      option.textContent = theme.label;
      ui.therapyThemeSelect.append(option);
    });
    ui.therapyThemeSelect.value = "anxiety";
    populateQuestSelect();
  }

  function populateQuestSelect() {
    const selectedTheme = ui.therapyThemeSelect.value;
    const quests = QUEST_LIBRARY.filter((quest) => quest.theme === selectedTheme);
    ui.questSelect.innerHTML = "";
    quests.forEach((quest) => {
      const option = document.createElement("option");
      option.value = quest.id;
      option.textContent = `${quest.title} - ${quest.summary}`;
      ui.questSelect.append(option);
    });

    if (quests.length === 0) {
      QUEST_LIBRARY.forEach((quest) => {
        const option = document.createElement("option");
        option.value = quest.id;
        option.textContent = `${quest.title} - ${quest.summary}`;
        ui.questSelect.append(option);
      });
    }
  }

  function renderStickerButtons() {
    ui.therapistStickers.innerHTML = "";
    ui.playerStickers.innerHTML = "";
    STICKERS.forEach((sticker) => {
      const therapistButton = document.createElement("button");
      therapistButton.type = "button";
      therapistButton.className = "btn btn-outline-secondary btn-sm sticker-btn";
      therapistButton.textContent = `${sticker.emoji} ${sticker.label}`;
      therapistButton.addEventListener("click", () => {
        sendChatMessage("therapist", "", sticker);
      });
      ui.therapistStickers.append(therapistButton);

      const playerButton = document.createElement("button");
      playerButton.type = "button";
      playerButton.className = "btn btn-outline-secondary btn-sm sticker-btn";
      playerButton.textContent = `${sticker.emoji} ${sticker.label}`;
      playerButton.addEventListener("click", () => {
        sendChatMessage("player", "", sticker);
      });
      ui.playerStickers.append(playerButton);
    });
  }

  function attachEventListeners() {
    ui.therapyThemeSelect.addEventListener("change", populateQuestSelect);

    ui.sessionSetupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await createTherapistSession();
    });

    ui.copyJoinLinkBtn.addEventListener("click", copyJoinLink);
    ui.startEscapeBtn.addEventListener("click", startEscapeRound);
    ui.startBossBtn.addEventListener("click", startBossRound);
    ui.startCompetitiveBtn.addEventListener("click", startCompetitiveRound);
    ui.openDebriefBtn.addEventListener("click", openDebriefRound);
    ui.completeSessionBtn.addEventListener("click", completeSession);

    ui.therapistSendChatBtn.addEventListener("click", () => sendChatMessage("therapist"));
    ui.playerSendChatBtn.addEventListener("click", () => sendChatMessage("player"));
    ui.playerChatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendChatMessage("player");
      }
    });
    ui.therapistChatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendChatMessage("therapist");
      }
    });

    ui.saveNoteBtn.addEventListener("click", saveTherapistNote);
    ui.rerollAvatarBtn.addEventListener("click", () => {
      state.localAvatar = generateAvatarName();
      ui.avatarPreview.textContent = state.localAvatar;
    });
    ui.joinSessionBtn.addEventListener("click", joinAsPlayer);

    ui.submitContributionBtn.addEventListener("click", () => submitContribution({ actionType: "manual" }));

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      state.deferredInstallPrompt = event;
      ui.installBtn.disabled = false;
    });

    window.addEventListener("appinstalled", () => {
      ui.installBtn.disabled = true;
      showAlert("PsyQuest wurde installiert.", "success");
    });

    ui.installBtn.addEventListener("click", async () => {
      if (!state.deferredInstallPrompt) {
        return;
      }
      state.deferredInstallPrompt.prompt();
      await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
      ui.installBtn.disabled = true;
    });
  }

  /* ================================================================
     BACKEND INIT & BOOT
     ================================================================ */

  async function initBackend() {
    const backendConfig = normalizeBackendConfig(window.PSYQUEST_BACKEND_CONFIG || {});
    const reasons = [];

    if (backendConfig.mode === "wamp" || backendConfig.mode === "auto") {
      try {
        const wampBackend = new WampBackend(backendConfig);
        const user = await wampBackend.initAuth();
        await wampBackend.healthCheck();
        state.backend = wampBackend;
        state.user = user;
        state.backendMode = "wamp";
        setConnectionBadge("Verbunden", "success");
        return;
      } catch (error) {
        console.error(error);
        reasons.push(`Server nicht erreichbar: ${error.message || String(error)}`);
      }
    }

    if (backendConfig.mode === "firebase" || backendConfig.mode === "auto") {
      const rawConfig = window.PSYQUEST_FIREBASE_CONFIG || {};
      const config = normalizeFirebaseConfig(rawConfig);
      const configValidation = validateFirebaseConfig(config);
      const hasFirebaseSdk = Boolean(window.firebase);

      if (configValidation.valid && hasFirebaseSdk) {
        try {
          state.backend = new FirebaseBackend(config);
          state.user = await state.backend.initAuth();
          state.backendMode = "firebase";
          setConnectionBadge("Verbunden", "success");
          return;
        } catch (error) {
          console.error(error);
          reasons.push(`Verbindung fehlgeschlagen: ${error.message || String(error)}`);
        }
      } else {
        if (!configValidation.valid) {
          reasons.push(`Einstellungen unvollstaendig: ${configValidation.missing.join(", ")}`);
        }
        if (!hasFirebaseSdk) {
          reasons.push("Verbindungsbibliothek nicht geladen");
        }
      }
    }

    state.backend = new DemoBackend();
    state.user = await state.backend.initAuth();
    state.backendMode = "demo";
    setConnectionBadge("Testmodus", "secondary");

    const detail =
      reasons.length > 0
        ? reasons.join(" | ")
        : "Kein Server verfuegbar.";
    showAlert(`Testmodus aktiv. ${detail}`, "warning");
  }

  async function boot() {
    initDomRefs();
    setupInitialState();
    toggleRoleView();
    populateThemeSelect();
    renderStickerButtons();
    attachEventListeners();
    registerServiceWorker();
    setTherapistControlsDisabled(true);

    await initBackend();

    if (state.role === "player" && state.sessionId) {
      await subscribeToSession(state.sessionId);
      ui.playerSessionIdDisplay.textContent = state.sessionId;
    }
  }

  /* ================================================================
     SESSION MANAGEMENT
     ================================================================ */

  async function createTherapistSession() {
    if (!state.backend || !state.user) {
      showAlert("Verbindung wird aufgebaut. Bitte kurz warten.", "warning");
      return;
    }

    const quest = QUEST_LIBRARY.find((entry) => entry.id === ui.questSelect.value) || QUEST_LIBRARY[0];
    const alias = sanitizeAlias(ui.therapistAliasInput.value) || "Gruppenleitung";
    const sessionId = await createUniqueSessionId();
    const joinLink = `${window.location.origin}${window.location.pathname}?session=${sessionId}`;
    const now = Date.now();

    const payload = {
      sessionId,
      createdAt: now,
      createdBy: state.user.uid,
      therapistAlias: alias,
      status: "lobby",
      theme: ui.therapyThemeSelect.value,
      questId: quest.id,
      questTitle: quest.title,
      bossName: quest.bossName,
      bossEmoji: quest.bossEmoji || "\uD83D\uDC7E",
      mode: ui.modeSelect.value,
      stickerOnly: ui.stickerOnlyMode.checked,
      consentRequired: ui.consentRequired.checked,
      progress: 0,
      bossHp: 100,
      round: 0,
      totalPoints: 0,
      teamLevel: 1,
      meme: "",
      currentChallenge: null,
      shortLink: joinLink
    };

    try {
      await state.backend.createSession(sessionId, payload);
      await state.backend.upsertPlayer(sessionId, state.user.uid, {
        uid: state.user.uid,
        avatarName: alias,
        role: "therapist",
        score: 0,
        contributions: 0,
        joinedAt: now
      });

      state.sessionId = sessionId;
      ui.sessionIdDisplay.textContent = sessionId;
      ui.joinLinkInput.value = joinLink;
      drawQrCode(joinLink);
      setTherapistControlsDisabled(false);
      await subscribeToSession(sessionId);
      showAlert(`Spiel ${sessionId} erstellt. QR-Code kann jetzt gescannt werden.`, "success");
      if ((state.players || []).length < MIN_RECOMMENDED_PLAYERS) {
        showAlert(
          "Tipp: Am besten mit 4-12 Teilnehmenden. Mit weniger geht es auch als kleine Runde.",
          "info"
        );
      }
    } catch (error) {
      console.error(error);
      showAlert("Spiel konnte nicht erstellt werden.", "danger");
    }
  }

  async function createUniqueSessionId() {
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const candidate = generateSessionId();
      const existing = await state.backend.getSession(candidate);
      if (!existing) {
        return candidate;
      }
    }
    return generateSessionId();
  }

  async function subscribeToSession(sessionId) {
    clearSubscriptions();
    state.unsubscribers.push(
      state.backend.watchSession(sessionId, (session) => {
        state.session = session;
        if (!session) {
          showAlert("Spiel wurde nicht gefunden oder ist beendet.", "warning");
          return;
        }
        renderSession();
      })
    );

    state.unsubscribers.push(
      state.backend.watchPlayers(sessionId, (players) => {
        state.players = players || [];
        renderPlayers();
        renderModeratorPlayerAnswers();
      })
    );

    state.unsubscribers.push(
      state.backend.watchChat(sessionId, (messages) => {
        state.chatMessages = messages || [];
        renderChatFeeds();
      })
    );

    state.unsubscribers.push(
      state.backend.watchNotes(sessionId, (notes) => {
        state.notes = notes || [];
        renderNotes();
      })
    );
  }

  function clearSubscriptions() {
    state.unsubscribers.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn(error);
      }
    });
    state.unsubscribers = [];
  }

  /* ================================================================
     RENDER – SESSION
     ================================================================ */

  function renderSession() {
    const session = state.session;
    if (!session) {
      return;
    }

    const statusText = STATUS_LABELS[session.status] || session.status || "Warteraum";
    const progress = clamp(Number(session.progress) || 0, 0, 100);
    const bossHp = clamp(Number(session.bossHp) || 0, 0, 100);
    const round = Number(session.round) || 0;
    const teamLevel = Number(session.teamLevel) || 1;
    const totalPoints = Number(session.totalPoints) || 0;

    if (state.role === "therapist") {
      ui.sessionStatusBadge.textContent = statusText;
      setProgressBar(ui.teamProgressBar, progress, "bg-success");
      setProgressBar(ui.bossHpBar, bossHp, "bg-danger");
      ui.roundDisplay.textContent = String(round);
      ui.teamLevelDisplay.textContent = String(teamLevel);
      ui.totalPointsDisplay.textContent = String(totalPoints);
      ui.sessionIdDisplay.textContent = session.sessionId || state.sessionId || "-";
      ui.joinLinkInput.value = session.shortLink || ui.joinLinkInput.value;
      if (!ui.qrCodeContainer.querySelector("img") && session.shortLink) {
        drawQrCode(session.shortLink);
      }
      renderModeratorOverview(session);
    }

    if (state.role === "player") {
      renderBattleScene(session, progress, bossHp);
      ui.playerTeamLevelValue.textContent = String(teamLevel);
      ui.playerRoundValue.textContent = String(round);
    }

    ui.stickerOnlyHint.classList.toggle("d-none", !session.stickerOnly);
    const playerTextDisabled = Boolean(session.stickerOnly);
    ui.playerChatInput.disabled = playerTextDisabled;
    ui.playerSendChatBtn.disabled = playerTextDisabled;

    renderChallenge(session.currentChallenge);
    renderMemeOrCertificate();
    renderDebriefState();

    if (
      state.role === "therapist" &&
      session.status === "victory" &&
      state.autoDebriefRound !== session.round
    ) {
      state.autoDebriefRound = session.round;
      openDebriefRound();
    }
  }

  function renderBattleScene(session, progress, bossHp) {
    const bossName = session.bossName || "Gegner";
    const bossEmoji = session.bossEmoji || BOSS_EMOJIS[bossName] || "\uD83D\uDC7E";

    ui.battleBossName.textContent = bossName;
    ui.battleBossHpFill.style.width = `${bossHp}%`;
    ui.battleBossHpText.textContent = `${bossHp}%`;
    ui.bossSprite.innerHTML = bossEmoji;

    ui.battlePlayerName.textContent = state.localAvatar || "Spieler";
    ui.battleProgressFill.style.width = `${progress}%`;
    ui.battleProgressText.textContent = `${progress}%`;
    ui.playerSprite.innerHTML = pickRandom(PLAYER_EMOJIS);
  }

  function renderChallenge(challenge) {
    if (!challenge) {
      ui.challengeTitle.textContent = "Warte auf die naechste Runde...";
      ui.challengeDescription.textContent =
        "Sobald die Runde startet, erscheint hier deine Aufgabe.";
      ui.challengeOptions.innerHTML = "";
      state.selectedAnswer = null;
      return;
    }

    ui.challengeTitle.textContent = challenge.title || "Neue Runde";
    ui.challengeDescription.textContent = challenge.description || "";
    ui.challengeOptions.innerHTML = "";
    state.selectedAnswer = null;

    (challenge.options || []).forEach((optionText) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-btn";
      button.textContent = optionText;
      button.addEventListener("click", () => {
        handleAnswerSelect(button, optionText);
      });
      ui.challengeOptions.append(button);
    });
  }

  function handleAnswerSelect(button, optionText) {
    const allButtons = ui.challengeOptions.querySelectorAll(".answer-btn");
    allButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), 200);
    state.selectedAnswer = optionText;
    ui.playerResponseInput.value = optionText;
  }

  function renderMemeOrCertificate() {
    const session = state.session;
    if (!session) {
      ui.memeCertificateArea.innerHTML = "";
      return;
    }

    if (session.status !== "victory" && session.status !== "completed" && session.status !== "debrief") {
      ui.memeCertificateArea.innerHTML = "";
      return;
    }

    const memeLine = session.meme || pickRandom(MEME_LINES);
    const html = `
      <div class="meme-card mb-2">
        <strong>Runden-Ergebnis:</strong> ${escapeHtml(memeLine)}
      </div>
      <div class="certificate-card">
        <strong>Auszeichnung:</strong> Das Team hat Runde ${escapeHtml(
          String(session.round || 0)
        )} auf Stufe ${escapeHtml(String(session.teamLevel || 1))} geschafft!
      </div>
    `;
    ui.memeCertificateArea.innerHTML = html;
  }

  /* ================================================================
     RENDER – MODERATOR OVERVIEW
     ================================================================ */

  function renderModeratorOverview(session) {
    const challenge = session.currentChallenge;

    if (!challenge) {
      ui.modQuestionText.textContent = "Noch keine Runde gestartet.";
      ui.modAnswersList.innerHTML = "";
      ui.modPlayerAnswers.innerHTML = '<p class="small text-body-secondary">Noch keine Antworten.</p>';
      return;
    }

    ui.modQuestionText.textContent = `${challenge.title}: ${challenge.description || ""}`;

    ui.modAnswersList.innerHTML = "";
    (challenge.options || []).forEach((optionText) => {
      const li = document.createElement("li");
      li.textContent = optionText;
      ui.modAnswersList.append(li);
    });

    renderModeratorPlayerAnswers();
  }

  function renderModeratorPlayerAnswers() {
    if (state.role !== "therapist" || !ui.modPlayerAnswers) {
      return;
    }

    const players = (state.players || []).filter((p) => p.role !== "therapist");

    if (players.length === 0) {
      ui.modPlayerAnswers.innerHTML = '<p class="small text-body-secondary">Noch keine Teilnehmenden.</p>';
      return;
    }

    const hasAnswers = players.some((p) => p.lastAnswer);
    if (!hasAnswers) {
      ui.modPlayerAnswers.innerHTML = '<p class="small text-body-secondary">Noch keine Antworten eingegangen.</p>';
      return;
    }

    ui.modPlayerAnswers.innerHTML = "";
    players.forEach((player) => {
      if (!player.lastAnswer) {
        return;
      }
      const row = document.createElement("div");
      row.className = "mod-player-answer-row";
      row.innerHTML = `
        <span class="avatar-name">${escapeHtml(player.avatarName || "Avatar")}</span>
        <span class="answer-text" title="${escapeHtml(player.lastAnswer)}">${escapeHtml(player.lastAnswer)}</span>
      `;
      ui.modPlayerAnswers.append(row);
    });
  }

  /* ================================================================
     RENDER – PLAYERS
     ================================================================ */

  function renderPlayers() {
    const players = state.players || [];
    const rows = players.filter((player) => player.role !== "therapist");

    if (state.role === "therapist") {
      if (rows.length === 0) {
        ui.therapistPlayersBody.innerHTML =
          '<tr><td colspan="5" class="text-center text-body-secondary">Noch niemand beigetreten.</td></tr>';
      } else {
        ui.therapistPlayersBody.innerHTML = "";
        rows.forEach((player, index) => {
          const badges = deriveBadges(player);
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="fw-semibold">${index + 1}</td>
            <td>${escapeHtml(player.avatarName || "Avatar")}</td>
            <td>${escapeHtml(String(player.score || 0))}</td>
            <td>${escapeHtml(String(player.contributions || 0))}</td>
            <td>${escapeHtml(badges[0] || "-")}</td>
          `;
          ui.therapistPlayersBody.append(row);
        });
      }
    }

    const ownPlayer = players.find((player) => player.uid === state.user?.uid);
    if (ownPlayer) {
      ui.playerScoreValue.textContent = String(ownPlayer.score || 0);
      renderOwnBadges(deriveBadges(ownPlayer));
    } else {
      ui.playerScoreValue.textContent = "0";
      renderOwnBadges([]);
    }
  }

  function renderOwnBadges(badges) {
    ui.playerBadgesList.innerHTML = "";
    if (!badges || badges.length === 0) {
      return;
    }
    badges.forEach((badgeText) => {
      const span = document.createElement("span");
      span.className = "badge-bubble";
      span.textContent = badgeText;
      ui.playerBadgesList.append(span);
    });
  }

  function deriveBadges(player) {
    const score = player.score || 0;
    const contributions = player.contributions || 0;
    const badges = [];
    if (score > 0) {
      const level = Math.min(5, Math.max(1, Math.floor(score / 40) + 1));
      badges.push(`Umdenker Stufe ${level}`);
    }
    if (contributions >= 3) {
      badges.push("Einfuehlungs-Held");
    }
    if (contributions >= 6) {
      badges.push("Team-Anker");
    }
    if (score >= 130) {
      badges.push("Mutmacher");
    }
    return badges;
  }

  /* ================================================================
     RENDER – CHAT & NOTES
     ================================================================ */

  function renderChatFeeds() {
    const feeds = [ui.therapistChatFeed, ui.playerChatFeed].filter(Boolean);
    feeds.forEach((feed) => {
      feed.innerHTML = "";
      if ((state.chatMessages || []).length === 0) {
        const p = document.createElement("p");
        p.className = "text-body-secondary small mb-0";
        p.textContent = "Noch keine Nachrichten.";
        feed.append(p);
        return;
      }
      state.chatMessages.forEach((entry) => {
        const wrapper = document.createElement("div");
        wrapper.className = "chat-entry";

        const meta = document.createElement("div");
        meta.className = "meta";
        const time = formatClock(entry.createdAt || Date.now());
        meta.textContent = `${entry.avatarName || "Avatar"} - ${time}`;

        const text = document.createElement("div");
        text.className = "text";
        if (entry.sticker) {
          text.textContent = `${entry.sticker.emoji} ${entry.sticker.label}`;
        } else {
          text.textContent = entry.message || "";
        }

        wrapper.append(meta, text);
        feed.append(wrapper);
      });
      feed.scrollTop = feed.scrollHeight;
    });
  }

  function renderNotes() {
    ui.therapistNotesList.innerHTML = "";
    if (!state.notes || state.notes.length === 0) {
      return;
    }

    state.notes.forEach((note) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${formatClock(note.createdAt || Date.now())} - ${note.text || ""}`;
      ui.therapistNotesList.append(li);
    });
  }

  /* ================================================================
     RENDER – DEBRIEF
     ================================================================ */

  function renderDebriefState() {
    const session = state.session;
    if (!session) {
      return;
    }
    const isDebrief = session.status === "debrief";
    ui.playerDebriefCard.classList.toggle("d-none", !isDebrief);
    if (!isDebrief) {
      return;
    }

    ui.debriefQuestions.innerHTML = "";
    const questions = Array.isArray(session.debriefQuestions) && session.debriefQuestions.length > 0
      ? session.debriefQuestions
      : REFLECTION_QUESTIONS.slice(0, 3);
    questions.forEach((question) => {
      const div = document.createElement("div");
      div.className = "debrief-question";
      div.textContent = question;
      ui.debriefQuestions.append(div);
    });
  }

  /* ================================================================
     GAME ACTIONS
     ================================================================ */

  async function startEscapeRound() {
    if (!requireTherapistSession()) {
      return;
    }
    const session = state.session || {};
    const round = (session.round || 0) + 1;
    const challenge = pickByRound(ESCAPE_CHALLENGES, round);
    const patch = {
      status: "in_game",
      mode: "cooperative",
      round,
      currentChallenge: challenge,
      meme: ""
    };
    await updateSessionWithFeedback(patch, "Teamaufgabe gestartet.");
  }

  async function startBossRound() {
    if (!requireTherapistSession()) {
      return;
    }
    const session = state.session || {};
    const round = (session.round || 0) + 1;
    const challenge = pickByRound(BOSS_CHALLENGES, round);
    const patch = {
      status: "in_game",
      mode: "cooperative",
      round,
      bossHp: 100,
      currentChallenge: challenge,
      meme: ""
    };
    await updateSessionWithFeedback(patch, "Kampfrunde gestartet.");
  }

  async function startCompetitiveRound() {
    if (!requireTherapistSession()) {
      return;
    }
    const session = state.session || {};
    const round = (session.round || 0) + 1;
    const challenge = pickByRound(COMPETITIVE_CHALLENGES, round);
    const patch = {
      status: "in_game",
      mode: "competitive",
      round,
      currentChallenge: challenge,
      meme: ""
    };
    await updateSessionWithFeedback(patch, "Wettbewerb gestartet.");
  }

  async function openDebriefRound() {
    if (!requireTherapistSession()) {
      return;
    }
    const questions = pickReflectionQuestions();
    const patch = {
      status: "debrief",
      debriefQuestions: questions
    };
    await updateSessionWithFeedback(patch, "Besprechung gestartet.");
  }

  async function completeSession() {
    if (!requireTherapistSession()) {
      return;
    }
    const patch = {
      status: "completed",
      completedAt: Date.now()
    };
    await updateSessionWithFeedback(patch, "Spiel beendet.");
  }

  async function updateSessionWithFeedback(patch, successText) {
    try {
      await state.backend.updateSession(state.sessionId, patch);
      showAlert(successText, "success");
    } catch (error) {
      console.error(error);
      showAlert("Aenderung konnte nicht gespeichert werden.", "danger");
    }
  }

  async function saveTherapistNote() {
    if (!requireTherapistSession()) {
      return;
    }
    const text = ui.therapistNoteInput.value.trim();
    if (!text) {
      return;
    }
    try {
      await state.backend.addNote(state.sessionId, {
        text,
        createdAt: Date.now(),
        authorUid: state.user.uid
      });
      ui.therapistNoteInput.value = "";
      showAlert("Notiz gespeichert.", "success");
    } catch (error) {
      console.error(error);
      showAlert("Notiz konnte nicht gespeichert werden.", "danger");
    }
  }

  async function joinAsPlayer() {
    if (!state.sessionId) {
      showAlert("Kein Spiel-Code gefunden.", "warning");
      return;
    }
    if (!state.session) {
      showAlert("Spiel wird geladen. Bitte kurz warten.", "info");
      return;
    }
    if (state.session.status === "completed") {
      showAlert("Dieses Spiel ist bereits beendet.", "warning");
      return;
    }

    const consentRequired = Boolean(state.session.consentRequired);
    if (consentRequired && !ui.playerConsentCheckbox.checked) {
      showAlert("Bitte erst die Einwilligung bestaetigen.", "warning");
      return;
    }

    const alreadyJoined = state.players.some((player) => player.uid === state.user.uid);
    const activePlayers = state.players.filter((player) => player.role !== "therapist").length;
    if (!alreadyJoined && activePlayers >= MAX_PLAYERS) {
      showAlert("Das Spiel ist voll (maximal 12 Teilnehmende).", "warning");
      return;
    }

    try {
      await state.backend.upsertPlayer(state.sessionId, state.user.uid, {
        uid: state.user.uid,
        avatarName: state.localAvatar,
        role: "player",
        score: 0,
        contributions: 0,
        lastAnswer: "",
        joinedAt: Date.now(),
        stickerOnly: Boolean(state.session.stickerOnly)
      });

      state.joined = true;
      ui.playerJoinCard.classList.add("d-none");
      ui.playerGameCard.classList.remove("d-none");
      showAlert(`Willkommen, ${state.localAvatar}!`, "success");

      await state.backend.addChatMessage(state.sessionId, {
        uid: state.user.uid,
        avatarName: state.localAvatar,
        role: "player",
        message: "ist dem Spiel beigetreten.",
        createdAt: Date.now()
      });
    } catch (error) {
      console.error(error);
      showAlert("Beitritt fehlgeschlagen. Bitte nochmal versuchen.", "danger");
    }
  }

  async function submitContribution({ actionType }) {
    if (!state.joined) {
      showAlert("Bitte erst dem Spiel beitreten.", "warning");
      return;
    }
    if (!state.session || state.session.status !== "in_game") {
      showAlert("Es laeuft gerade keine Runde.", "info");
      return;
    }

    const message = (state.selectedAnswer || ui.playerResponseInput.value || "").trim();
    if (!message) {
      showAlert("Bitte waehle eine Antwort aus.", "warning");
      return;
    }

    const challengeType = state.session.currentChallenge?.type || state.session.mode || "cooperative";
    const impact = computeImpact(challengeType, message, actionType || "manual");
    const contribution = {
      challengeType,
      message,
      points: impact.points,
      progressGain: impact.progressGain,
      damage: impact.damage,
      actionType: actionType || "manual",
      victoryMeme: pickRandom(MEME_LINES)
    };

    try {
      await state.backend.applyContribution(state.sessionId, state.user.uid, state.localAvatar, contribution);
      await state.backend.addChatMessage(state.sessionId, {
        uid: state.user.uid,
        avatarName: state.localAvatar,
        role: "player",
        message,
        createdAt: Date.now()
      });
      ui.playerResponseInput.value = "";
      state.selectedAnswer = null;
      const allButtons = ui.challengeOptions.querySelectorAll(".answer-btn");
      allButtons.forEach((btn) => btn.classList.remove("selected"));
      showAlert("Antwort gesendet!", "success");
    } catch (error) {
      console.error(error);
      showAlert("Antwort konnte nicht gesendet werden.", "danger");
    }
  }

  function computeImpact(challengeType, message, actionType) {
    let points = 8;
    let progressGain = 6;
    let damage = 4;

    if (challengeType === "escape") {
      progressGain += 5;
      points += 2;
    }
    if (challengeType === "boss") {
      damage += 8;
      points += 4;
    }
    if (challengeType === "competitive") {
      points += 7;
      progressGain += 3;
      damage += 2;
    }

    if (message.length >= 60) {
      points += 2;
      progressGain += 1;
    }
    if (actionType === "mindful-breath" || actionType === "reframe") {
      progressGain += 2;
    }
    if (actionType === "next-step") {
      points += 1;
    }

    return {
      points: clamp(points, 4, 20),
      progressGain: clamp(progressGain, 2, 20),
      damage: clamp(damage, 1, 20)
    };
  }

  async function sendChatMessage(role, forcedMessage, forcedSticker) {
    if (!state.sessionId) {
      showAlert("Bitte erst ein Spiel starten oder beitreten.", "warning");
      return;
    }

    const isPlayer = role === "player";
    if (isPlayer && !state.joined) {
      showAlert("Bitte erst dem Spiel beitreten.", "warning");
      return;
    }

    const messageInput = isPlayer ? ui.playerChatInput : ui.therapistChatInput;
    const sessionStickerOnly = Boolean(state.session?.stickerOnly);
    const message = (forcedMessage || messageInput.value || "").trim();
    const sticker = forcedSticker || null;

    if (!sticker && !message) {
      return;
    }
    if (isPlayer && sessionStickerOnly && !sticker) {
      showAlert("In diesem Spiel wird nur mit Stickern geschrieben.", "info");
      return;
    }

    const avatarName = isPlayer
      ? state.localAvatar
      : sanitizeAlias(ui.therapistAliasInput.value) || "Gruppenleitung";

    try {
      await state.backend.addChatMessage(state.sessionId, {
        uid: state.user.uid,
        avatarName,
        role,
        message,
        sticker,
        createdAt: Date.now()
      });
      messageInput.value = "";
    } catch (error) {
      console.error(error);
      showAlert("Nachricht konnte nicht gesendet werden.", "danger");
    }
  }

  /* ================================================================
     UI HELPERS
     ================================================================ */

  function setConnectionBadge(text, color) {
    ui.connectionBadge.textContent = text;
    ui.connectionBadge.className = `badge text-bg-${color}`;
  }

  function setTherapistControlsDisabled(disabled) {
    [
      ui.startEscapeBtn,
      ui.startBossBtn,
      ui.startCompetitiveBtn,
      ui.openDebriefBtn,
      ui.completeSessionBtn,
      ui.copyJoinLinkBtn,
      ui.therapistSendChatBtn,
      ui.saveNoteBtn
    ].forEach((element) => {
      if (element) {
        element.disabled = disabled;
      }
    });
  }

  function requireTherapistSession() {
    if (state.role !== "therapist") {
      return false;
    }
    if (!state.sessionId || !state.session) {
      showAlert("Bitte erst ein Spiel erstellen.", "warning");
      return false;
    }
    return true;
  }

  function drawQrCode(value) {
    ui.qrCodeContainer.innerHTML = "";
    if (!window.QRCode) {
      ui.qrCodeContainer.textContent = "QR-Code konnte nicht geladen werden.";
      return;
    }
    new QRCode(ui.qrCodeContainer, {
      text: value,
      width: 210,
      height: 210,
      colorDark: "#2c3e50",
      colorLight: "#ffffff"
    });
  }

  async function copyJoinLink() {
    const value = ui.joinLinkInput.value;
    if (!value) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      showAlert("Link kopiert.", "success");
    } catch (error) {
      console.error(error);
      showAlert("Link konnte nicht kopiert werden.", "warning");
    }
  }

  function showAlert(message, variant) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${variant} alert-dismissible fade show`;
    alert.role = "alert";
    alert.textContent = message;

    const close = document.createElement("button");
    close.type = "button";
    close.className = "btn-close";
    close.setAttribute("data-bs-dismiss", "alert");
    close.setAttribute("aria-label", "Schliessen");

    alert.append(close);
    ui.globalAlertArea.append(alert);
    window.setTimeout(() => {
      alert.remove();
    }, 4200);
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((error) => console.warn("Service Worker Fehler:", error));
  }

  /* ================================================================
     UTILITIES
     ================================================================ */

  function normalizeBackendConfig(config) {
    const fallback = {
      mode: "wamp",
      apiBaseUrl: "./api/index.php",
      pollIntervalMs: 1500
    };
    if (!config || typeof config !== "object") {
      return fallback;
    }

    const normalized = { ...fallback };
    if (typeof config.mode === "string") {
      const mode = config.mode.trim().toLowerCase();
      if (["wamp", "firebase", "demo", "auto"].includes(mode)) {
        normalized.mode = mode;
      }
    }
    if (typeof config.apiBaseUrl === "string" && config.apiBaseUrl.trim()) {
      normalized.apiBaseUrl = config.apiBaseUrl.trim();
    }
    if (Number.isFinite(Number(config.pollIntervalMs))) {
      normalized.pollIntervalMs = Math.max(700, Number(config.pollIntervalMs));
    }
    return normalized;
  }

  function normalizeFirebaseConfig(config) {
    if (!config || typeof config !== "object") {
      return {};
    }
    const normalized = { ...config };
    if (typeof normalized.authDomain === "string") {
      normalized.authDomain = normalized.authDomain
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/\/+$/, "");
    }
    if (typeof normalized.databaseURL === "string") {
      const trimmed = normalized.databaseURL.trim().replace(/\/+$/, "");
      if (trimmed && !trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        normalized.databaseURL = `https://${trimmed}`;
      } else {
        normalized.databaseURL = trimmed;
      }
    }
    ["apiKey", "projectId", "appId", "storageBucket", "messagingSenderId"].forEach((key) => {
      if (typeof normalized[key] === "string") {
        normalized[key] = normalized[key].trim();
      }
    });
    return normalized;
  }

  function validateFirebaseConfig(config) {
    const required = ["apiKey", "authDomain", "projectId", "appId", "databaseURL"];
    const missing = [];

    required.forEach((key) => {
      const value = config?.[key];
      if (!value || typeof value !== "string" || value.startsWith("YOUR_")) {
        missing.push(key);
      }
    });

    if (config?.authDomain && /^https?:\/\//.test(config.authDomain)) {
      missing.push("authDomain(format)");
    }
    if (config?.databaseURL && !/^https?:\/\//.test(config.databaseURL)) {
      missing.push("databaseURL(format)");
    }

    return {
      valid: missing.length === 0,
      missing
    };
  }

  function generateSessionId() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function normalizeSessionId(value) {
    return String(value || "")
      .replace(/[^A-Za-z0-9]/g, "")
      .slice(0, 8)
      .toUpperCase();
  }

  function sanitizeAlias(value) {
    return String(value || "")
      .replace(/[^A-Za-z0-9\u00C0-\u024F _-]/g, "")
      .trim()
      .slice(0, 40);
  }

  function generateAvatarName() {
    return `${pickRandom(AVATAR_ADJECTIVES)} ${pickRandom(AVATAR_ANIMALS)}`;
  }

  function pickByRound(list, round) {
    return { ...list[(Math.max(1, round) - 1) % list.length] };
  }

  function pickReflectionQuestions() {
    const shuffled = [...REFLECTION_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatClock(timestamp) {
    const date = new Date(Number(timestamp) || Date.now());
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function setProgressBar(element, value, extraClass) {
    const clampedValue = clamp(value, 0, 100);
    element.style.width = `${clampedValue}%`;
    element.textContent = `${clampedValue}%`;
    element.className = `progress-bar ${extraClass}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function stableHash(value) {
    try {
      return JSON.stringify(value);
    } catch (_error) {
      return String(value);
    }
  }

  function cloneJsonData(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

  function buildApiUrl(baseUrl, action, params) {
    const url = new URL(baseUrl, window.location.href);
    url.searchParams.set("action", action);
    if (params && typeof params === "object") {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  document.addEventListener("DOMContentLoaded", () => {
    boot().catch((error) => {
      console.error(error);
    });
  });
})();
