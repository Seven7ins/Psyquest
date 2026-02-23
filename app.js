(function psyQuestApp() {
  "use strict";

  const MAX_PLAYERS = 12;
  const MIN_RECOMMENDED_PLAYERS = 4;

  const THEMES = [
    { value: "anxiety", label: "Angst" },
    { value: "depression", label: "Niedergeschlagenheit" },
    { value: "social-phobia", label: "Soziale Unsicherheit" },
    { value: "stress", label: "Stress" },
    { value: "cbt-dbt", label: "Gedanken und Gefuehle ordnen" }
  ];

  const STICKERS = [
    { emoji: "💪", label: "Du schaffst das" },
    { emoji: "🧘", label: "Atem holen" },
    { emoji: "🌟", label: "Starker Moment" },
    { emoji: "🤝", label: "Ich bin bei dir" },
    { emoji: "🛡️", label: "Inneres Schild" },
    { emoji: "🔥", label: "Weiter so" }
  ];

  const REFLECTION_QUESTIONS = [
    "Was hat dich heute stark gemacht?",
    "Welche Uebung hat dir heute am meisten geholfen?",
    "Was moechtest du im Alltag als naechsten Mini-Schritt ausprobieren?",
    "Wann hat dich die Gruppe besonders unterstuetzt?",
    "Welcher gute Satz hilft dir gegen harte Selbstkritik?"
  ];

  const MEME_LINES = [
    "Team bleibt ruhig. Team bleibt klar.",
    "Der Boss wird leiser. Ihr werdet staerker.",
    "Ein guter Gedanke nach dem anderen.",
    "Mut waechst mit jedem kleinen Schritt.",
    "Heute zaehlt Fortschritt, nicht Perfektion."
  ];

  const STATUS_LABELS = {
    lobby: "Lobby",
    in_game: "In Runde",
    victory: "Sieg",
    debrief: "Nachbesprechung",
    completed: "Abgeschlossen"
  };
  const QUEST_LIBRARY = [
    {
      id: "escape-anxiety-labyrinth",
      theme: "anxiety",
      title: "Flucht aus dem Angst-Labyrinth",
      bossName: "Nebel-Boss",
      summary: "Gemeinsam ruhig werden und sichere Schritte waehlen."
    },
    {
      id: "inner-critic-boss",
      theme: "cbt-dbt",
      title: "Kampf gegen die innere Kritik",
      bossName: "Kritik-Boss",
      summary: "Mit klaren, freundlichen Antworten gegen schwere Gedanken."
    },
    {
      id: "darkness-dragon",
      theme: "depression",
      title: "Licht gegen den Schatten-Drachen",
      bossName: "Schatten-Drache",
      summary: "Mit kleinen machbaren Schritten wieder in Bewegung kommen."
    },
    {
      id: "social-bridge",
      theme: "social-phobia",
      title: "Bruecke der mutigen Schritte",
      bossName: "Urteil-Echo",
      summary: "Sicher ueben, wie man trotz Unsicherheit in Kontakt bleibt."
    },
    {
      id: "stress-reactor",
      theme: "stress",
      title: "Stress-Reaktor beruhigen",
      bossName: "Druck-Titan",
      summary: "Ruhe finden und das Wichtigste zuerst tun."
    },
    {
      id: "emotion-compass",
      theme: "cbt-dbt",
      title: "Kompass fuer Gefuehle",
      bossName: "Nebel-Spiegel",
      summary: "Gefuehle benennen und passende Schritte waehlen."
    }
  ];

  const ESCAPE_CHALLENGES = [
    {
      id: "escape-emotion-match",
      type: "escape",
      title: "Raum 1: Ruhe finden",
      description:
        "Du merkst Herzklopfen. Welche Antwort hilft sofort und bleibt freundlich?",
      options: [
        "Langsam einatmen und laenger ausatmen.",
        "Sofort alles abbrechen und weggehen.",
        "Mich hart beschimpfen.",
        "Nichts tun und hoffen, dass es weggeht."
      ],
      correctOption: "Langsam einatmen und laenger ausatmen."
    },
    {
      id: "escape-strength-discovery",
      type: "escape",
      title: "Raum 2: Gedanken pruefen",
      description:
        "Der Gedanke lautet: 'Ich kann das nie'. Welche Antwort ist am hilfreichsten?",
      options: [
        "Ich frage mich: Welche Fakten sprechen dafuer und welche dagegen?",
        "Ich glaube dem Gedanken sofort und gebe auf.",
        "Ich schaeme mich und sage niemandem etwas.",
        "Ich warte, bis andere das Problem loesen."
      ],
      correctOption: "Ich frage mich: Welche Fakten sprechen dafuer und welche dagegen?"
    },
    {
      id: "escape-coping-maze",
      type: "escape",
      title: "Raum 3: Hilfe annehmen",
      description:
        "Du fuehlst dich ueberfordert. Welche Reaktion hilft auf Dauer am besten?",
      options: [
        "Eine vertraute Person um ein kurzes Nachfragen bitten.",
        "Alles alleine tragen und mich zurueckziehen.",
        "Mich ablenken und gar nicht mehr hinschauen.",
        "Anderen die Schuld geben."
      ],
      correctOption: "Eine vertraute Person um ein kurzes Nachfragen bitten."
    },
    {
      id: "escape-group-jigsaw",
      type: "escape",
      title: "Raum 4: Kleiner Schritt",
      description:
        "Welche Antwort macht den naechsten Schritt klar und machbar?",
      options: [
        "Ich plane heute einen kleinen Schritt, den ich wirklich schaffe.",
        "Ich mache alles perfekt oder gar nichts.",
        "Ich verschiebe alles auf irgendwann.",
        "Ich warte, bis ich keine Angst mehr habe."
      ],
      correctOption: "Ich plane heute einen kleinen Schritt, den ich wirklich schaffe."
    },
    {
      id: "escape-mindful-gate",
      type: "escape",
      title: "Raum 5: Freundlich mit mir",
      description:
        "Welche Selbstbotschaft gibt Kraft, ohne Druck zu machen?",
      options: [
        "Ich darf langsam sein und trotzdem weitergehen.",
        "Ich bin nur gut, wenn ich perfekt bin.",
        "Ich muss das sofort loesen.",
        "Ich darf keine Hilfe brauchen."
      ],
      correctOption: "Ich darf langsam sein und trotzdem weitergehen."
    }
  ];

  const BOSS_CHALLENGES = [
    {
      id: "boss-empathy-duel",
      type: "boss",
      title: "Boss-Angriff 1: Klare Antwort",
      description:
        "Der Boss sagt: 'Du schaffst das nie'. Welche Antwort ist hilfreich?",
      options: [
        "Ein Gedanke ist nicht automatisch die Wahrheit.",
        "Der Boss hat recht. Ich gebe auf.",
        "Ich mache mich klein und bleibe still.",
        "Ich bestrafe mich fuer jeden Fehler."
      ],
      correctOption: "Ein Gedanke ist nicht automatisch die Wahrheit."
    },
    {
      id: "boss-skill-race",
      type: "boss",
      title: "Boss-Angriff 2: Koerper beruhigen",
      description:
        "Du bist stark angespannt. Welche Antwort hilft dem Koerper zuerst?",
      options: [
        "Ruhig atmen: laenger aus als ein.",
        "Noch schneller sprechen und handeln.",
        "Koffein trinken und weiter pushen.",
        "Alles runterschlucken und laecheln."
      ],
      correctOption: "Ruhig atmen: laenger aus als ein."
    },
    {
      id: "boss-perspective-battle",
      type: "boss",
      title: "Boss-Angriff 3: Blick nach vorn",
      description:
        "Welche Haltung hilft dir, auch mit Unsicherheit weiterzugehen?",
      options: [
        "Ich waehle einen kleinen Schritt statt Perfektion.",
        "Ich darf erst starten, wenn ich sicher bin.",
        "Ich gehe nur weiter, wenn andere es sagen.",
        "Ich warte, bis das Problem verschwindet."
      ],
      correctOption: "Ich waehle einen kleinen Schritt statt Perfektion."
    },
    {
      id: "boss-affirmation-hunt",
      type: "boss",
      title: "Finale: Team-Satz",
      description:
        "Welcher Team-Satz macht Mut und bleibt realistisch?",
      options: [
        "Wir gehen Schritt fuer Schritt und bleiben verbunden.",
        "Nur wer nie Angst hat, ist stark.",
        "Wir muessen alles sofort loesen.",
        "Hilfe annehmen ist ein Zeichen von Schwaeche."
      ],
      correctOption: "Wir gehen Schritt fuer Schritt und bleiben verbunden."
    }
  ];

  const COMPETITIVE_CHALLENGES = [
    {
      id: "competitive-empathy",
      type: "competitive",
      title: "Teamduell: Hilfreiche Antwort",
      description:
        "Ihr tretet gegeneinander an. Welche Antwort unterstuetzt am besten?",
      options: [
        "Ich sehe dich. Wir gehen einen kleinen Schritt zusammen.",
        "Reiss dich einfach zusammen.",
        "Dafuer bist du selbst schuld.",
        "Ignoriere es. Dann wird es von allein besser."
      ],
      correctOption: "Ich sehe dich. Wir gehen einen kleinen Schritt zusammen."
    },
    {
      id: "competitive-skill-race",
      type: "competitive",
      title: "Teamduell: Schnell helfen",
      description:
        "Was ist in der akuten Anspannung der beste erste Schritt?",
      options: [
        "Atmen und den Boden unter den Fuessen spueren.",
        "Noch mehr Druck aufbauen.",
        "Mich selbst beleidigen.",
        "Alles vermeiden und nichts sagen."
      ],
      correctOption: "Atmen und den Boden unter den Fuessen spueren."
    },
    {
      id: "competitive-perspective",
      type: "competitive",
      title: "Teamduell: Blick wechseln",
      description:
        "Welche Sicht hilft langfristig weiter?",
      options: [
        "Ich darf lernen. Jeder kleine Schritt zaehlt.",
        "Ich bin nur etwas wert, wenn alles perfekt ist.",
        "Ich habe keine Chance, also lasse ich es.",
        "Ich warte auf den perfekten Zeitpunkt."
      ],
      correctOption: "Ich darf lernen. Jeder kleine Schritt zaehlt."
    }
  ];

  const AVATAR_ADJECTIVES = [
    "Mutige",
    "Ruhige",
    "Kluge",
    "Freundliche",
    "Starke",
    "Wache",
    "Sanfte",
    "Klare",
    "Hoffnungsvolle",
    "Geduldige"
  ];

  const AVATAR_ANIMALS = [
    "Loewin",
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
    selectedOption: "",
    moderatorWindowRef: null
  };

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
      } catch (error) {
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
          console.warn("WAMP poll failed:", error);
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
        throw new Error(`Ungueltige API-Antwort bei ${action}.`);
      }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `API-Fehler bei ${action}.`);
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
        throw new Error("Firebase SDK not loaded.");
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
          throw new Error("Session not found.");
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

  function initDomRefs() {
    [
      "connectionBadge",
      "installBtn",
      "globalAlertArea",
      "appNavbar",
      "introSection",
      "therapistView",
      "playerView",
      "moderatorView",
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
      "openModeratorWindowBtn",
      "therapistPlayersBody",
      "therapistChatFeed",
      "therapistChatInput",
      "therapistSendChatBtn",
      "therapistStickers",
      "therapistNoteInput",
      "saveNoteBtn",
      "therapistNotesList",
      "playerJoinCard",
      "playerGameCard",
      "playerDebriefCard",
      "avatarPreview",
      "rerollAvatarBtn",
      "playerConsentCheckbox",
      "joinSessionBtn",
      "debriefQuestions",
      "playerAvatarBadge",
      "playerStatusBadge",
      "playerBattleMode",
      "playerOpponentName",
      "challengeTitle",
      "challengeDescription",
      "challengeOptions",
      "playerResponseInput",
      "submitContributionBtn",
      "playerActionButtons",
      "playerTeamProgressBar",
      "playerBossHpBar",
      "playerScoreValue",
      "playerTeamLevelValue",
      "playerBadgesList",
      "playerChatFeed",
      "playerChatInput",
      "playerSendChatBtn",
      "playerStickers",
      "stickerOnlyHint",
      "moderatorSessionCode",
      "moderatorStatusBadge",
      "moderatorRoundDisplay",
      "moderatorBossName",
      "moderatorTeamProgressBar",
      "moderatorBossHpBar",
      "moderatorQuestionTitle",
      "moderatorQuestionText",
      "moderatorCorrectAnswer",
      "moderatorAnswersBody",
      "moderatorRankingBody",
      "moderatorFullscreenBtn"
    ].forEach((id) => {
      ui[id] = document.getElementById(id);
    });
  }

  function setupInitialState() {
    const query = new URLSearchParams(window.location.search);
    const sessionParam = normalizeSessionId(query.get("session"));
    const moderatorMode = query.get("moderator") === "1";
    state.sessionId = sessionParam || null;
    state.role = moderatorMode ? "moderator" : state.sessionId ? "player" : "therapist";
    state.localAvatar = generateAvatarName();

    ui.avatarPreview.textContent = state.localAvatar;
    ui.playerConsentCheckbox.checked = false;
    ui.playerDebriefCard.classList.add("d-none");
    ui.playerGameCard.classList.add("d-none");
  }

  function toggleRoleView() {
    const therapist = state.role === "therapist";
    const player = state.role === "player";
    const moderator = state.role === "moderator";
    ui.therapistView.classList.toggle("d-none", !therapist);
    ui.playerView.classList.toggle("d-none", !player);
    ui.moderatorView.classList.toggle("d-none", !moderator);
    ui.appNavbar.classList.toggle("d-none", player);
    ui.introSection.classList.toggle("d-none", !therapist);
    document.body.classList.toggle("moderator-screen", moderator);
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

  function renderQuickActionButtons() {
    ui.playerActionButtons.innerHTML = "";
    const actions = [
      { id: "reframe", label: "Hilfreichen Gedanken waehlen" },
      { id: "mindful-breath", label: "Achtsam atmen" },
      { id: "support", label: "Unterstuetzung geben" },
      { id: "next-step", label: "Naechsten Schritt planen" }
    ];
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-outline-success btn-sm";
      button.textContent = action.label;
      button.addEventListener("click", () => {
        const text = `${action.label}: Das setze ich jetzt um.`;
        submitContribution({ actionType: action.id, presetMessage: text });
      });
      ui.playerActionButtons.append(button);
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
    ui.openModeratorWindowBtn.addEventListener("click", openModeratorWindow);

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
    ui.playerResponseInput.addEventListener("input", () => {
      const value = ui.playerResponseInput.value.trim();
      if (!state.selectedOption || value === state.selectedOption) {
        return;
      }
      state.selectedOption = "";
      ui.challengeOptions.querySelectorAll("button[data-option]").forEach((entry) => {
        entry.classList.remove("is-selected");
      });
    });

    ui.submitContributionBtn.addEventListener("click", () => submitContribution({ actionType: "manual" }));

    ui.challengeOptions.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-option]");
      if (!button) {
        return;
      }
      const selectedText = button.dataset.option || "";
      state.selectedOption = selectedText;
      ui.playerResponseInput.value = selectedText;
      ui.challengeOptions.querySelectorAll("button[data-option]").forEach((entry) => {
        entry.classList.toggle("is-selected", entry === button);
      });
    });

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

    ui.moderatorFullscreenBtn.addEventListener("click", toggleModeratorFullscreen);
  }

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
        setConnectionBadge("Online", "success");
        return;
      } catch (error) {
        console.error(error);
        reasons.push(`WAMP API nicht erreichbar: ${error.message || String(error)}`);
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
          setConnectionBadge("Online", "success");
          return;
        } catch (error) {
          console.error(error);
          reasons.push(`Firebase init fehlgeschlagen: ${error.message || String(error)}`);
        }
      } else {
        if (!configValidation.valid) {
          reasons.push(`Firebase Config unvollstaendig: ${configValidation.missing.join(", ")}`);
        }
        if (!hasFirebaseSdk) {
          reasons.push("Firebase SDK nicht geladen");
        }
      }
    }

    state.backend = new DemoBackend();
    state.user = await state.backend.initAuth();
    state.backendMode = "demo";
    setConnectionBadge("Demo", "secondary");

    const detail =
      reasons.length > 0
        ? reasons.join(" | ")
        : "Kein Backend verfuegbar. Fuer WAMP pruefe /api/index.php?action=health.";
    showAlert(`Demo-Modus aktiv. ${detail}`, "warning");
  }

  async function boot() {
    initDomRefs();
    setupInitialState();
    toggleRoleView();
    populateThemeSelect();
    renderStickerButtons();
    renderQuickActionButtons();
    attachEventListeners();
    registerServiceWorker();
    setTherapistControlsDisabled(true);

    await initBackend();

    if ((state.role === "player" || state.role === "moderator") && state.sessionId) {
      await subscribeToSession(state.sessionId);
    }

    if (state.role === "moderator" && !state.sessionId) {
      showAlert("Bitte Moderator-Fenster mit gueltiger Sitzung oeffnen.", "warning");
    }
  }

  async function createTherapistSession() {
    if (!state.backend || !state.user) {
      showAlert("Backend noch nicht bereit.", "warning");
      return;
    }

    const quest = QUEST_LIBRARY.find((entry) => entry.id === ui.questSelect.value) || QUEST_LIBRARY[0];
    const alias = sanitizeAlias(ui.therapistAliasInput.value) || "Leitfaden Eule";
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
      shortLink: joinLink,
      scheduleMinutes: null
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
      showAlert(`Sitzung ${sessionId} erstellt. QR kann jetzt gescannt werden.`, "success");
      if ((state.players || []).length < MIN_RECOMMENDED_PLAYERS) {
        showAlert(
          "Hinweis: Optimal sind 4-12 Teilnehmende. Mit weniger Personen geht auch eine kleine Runde.",
          "info"
        );
      }
    } catch (error) {
      console.error(error);
      showAlert("Sitzung konnte nicht erstellt werden.", "danger");
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
          showAlert("Sitzung wurde nicht gefunden oder ist beendet.", "warning");
          return;
        }
        renderSession();
      })
    );

    state.unsubscribers.push(
      state.backend.watchPlayers(sessionId, (players) => {
        state.players = players || [];
        renderPlayers();
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

  function renderSession() {
    const session = state.session;
    if (!session) {
      return;
    }

    const statusText = STATUS_LABELS[session.status] || session.status || "Lobby";
    const progress = clamp(Number(session.progress) || 0, 0, 100);
    const bossHp = clamp(Number(session.bossHp) || 0, 0, 100);
    const round = Number(session.round) || 0;
    const teamLevel = Number(session.teamLevel) || 1;
    const totalPoints = Number(session.totalPoints) || 0;

    ui.sessionStatusBadge.textContent = statusText;
    ui.playerStatusBadge.textContent = statusText;
    ui.moderatorStatusBadge.textContent = statusText;
    setProgressBar(ui.teamProgressBar, progress, "bg-success");
    setProgressBar(ui.playerTeamProgressBar, progress, "bg-success");
    setProgressBar(ui.moderatorTeamProgressBar, progress, "bg-success");
    setProgressBar(ui.bossHpBar, bossHp, "bg-danger");
    setProgressBar(ui.playerBossHpBar, bossHp, "bg-danger");
    setProgressBar(ui.moderatorBossHpBar, bossHp, "bg-danger");
    ui.roundDisplay.textContent = String(round);
    ui.teamLevelDisplay.textContent = String(teamLevel);
    ui.totalPointsDisplay.textContent = String(totalPoints);
    ui.playerTeamLevelValue.textContent = String(teamLevel);
    ui.moderatorRoundDisplay.textContent = String(round);
    ui.playerBattleMode.textContent =
      session.mode === "competitive" ? "Du spielst gegen die Gruppe." : "Du spielst mit der Gruppe.";
    ui.playerOpponentName.textContent =
      session.mode === "competitive" ? "Gegner-Team" : session.bossName || "Boss";
    ui.moderatorBossName.textContent =
      session.mode === "competitive" ? "Gegner-Team" : session.bossName || "Boss";

    ui.stickerOnlyHint.classList.toggle("d-none", !session.stickerOnly);
    const playerTextDisabled = Boolean(session.stickerOnly);
    ui.playerChatInput.disabled = playerTextDisabled;
    ui.playerSendChatBtn.disabled = playerTextDisabled;

    if (state.role === "therapist") {
      ui.sessionIdDisplay.textContent = session.sessionId || state.sessionId || "-";
      ui.joinLinkInput.value = session.shortLink || ui.joinLinkInput.value;
      if (!ui.qrCodeContainer.querySelector("img") && session.shortLink) {
        drawQrCode(session.shortLink);
      }
    }

    ui.moderatorSessionCode.textContent = session.sessionId || state.sessionId || "-";
    renderChallenge(session.currentChallenge);
    renderMemeOrCertificate();
    renderDebriefState();
    renderModeratorBoard();
  }

  function renderChallenge(challenge) {
    if (!challenge) {
      ui.challengeTitle.textContent = "Warte auf Start...";
      ui.challengeDescription.textContent =
        "Sobald die Moderation die Runde startet, erscheint hier die Frage.";
      ui.challengeOptions.innerHTML = "";
      state.selectedOption = "";
      return;
    }

    const availableOptions = Array.isArray(challenge.options) ? challenge.options : [];
    if (!availableOptions.includes(state.selectedOption)) {
      state.selectedOption = "";
    }

    ui.challengeTitle.textContent = challenge.title || "Neue Runde";
    ui.challengeDescription.textContent = challenge.description || "";
    ui.challengeOptions.innerHTML = "";
    availableOptions.forEach((optionText) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option-btn";
      button.dataset.option = optionText;
      button.textContent = optionText;
      button.classList.toggle("is-selected", optionText === state.selectedOption);
      ui.challengeOptions.append(button);
    });
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
        <strong>Team-Moment:</strong> ${escapeHtml(memeLine)}
      </div>
      <div class="certificate-card">
        <strong>Zertifikat:</strong> Team "PsyQuest" hat Runde ${escapeHtml(
          String(session.round || 0)
        )} auf Level ${escapeHtml(String(session.teamLevel || 1))} abgeschlossen.
      </div>
    `;
    ui.memeCertificateArea.innerHTML = html;
  }

  function renderPlayers() {
    const players = state.players || [];
    const rows = players.filter((player) => player.role !== "therapist");

    if (rows.length === 0) {
      ui.therapistPlayersBody.innerHTML =
        '<tr><td colspan="4" class="text-center text-body-secondary">Noch niemand beigetreten.</td></tr>';
    } else {
      ui.therapistPlayersBody.innerHTML = "";
      rows.forEach((player) => {
        const badges = deriveBadges(player);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${escapeHtml(player.avatarName || "Avatar")}</td>
          <td>${escapeHtml(String(player.score || 0))}</td>
          <td>${escapeHtml(String(player.contributions || 0))}</td>
          <td>${escapeHtml(badges[0] || "-")}</td>
        `;
        ui.therapistPlayersBody.append(row);
      });
    }

    const ownPlayer = players.find((player) => player.uid === state.user?.uid);
    if (ownPlayer) {
      ui.playerAvatarBadge.textContent = ownPlayer.avatarName || state.localAvatar;
      ui.playerScoreValue.textContent = String(ownPlayer.score || 0);
      renderOwnBadges(deriveBadges(ownPlayer));
    } else {
      ui.playerAvatarBadge.textContent = state.localAvatar || "Avatar";
      ui.playerScoreValue.textContent = "0";
      renderOwnBadges([]);
    }

    renderModeratorBoard();
  }

  function renderOwnBadges(badges) {
    ui.playerBadgesList.innerHTML = "";
    if (!badges || badges.length === 0) {
      ui.playerBadgesList.innerHTML = '<span class="quiet-note">Noch keine Auszeichnung.</span>';
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
      badges.push(`Klarer-Blick Stufe ${level}`);
    }
    if (contributions >= 3) {
      badges.push("Mitgefuehl im Team");
    }
    if (contributions >= 6) {
      badges.push("Sicherer Team-Anker");
    }
    if (score >= 130) {
      badges.push("Boss-Besieger");
    }
    return badges;
  }

  function renderChatFeeds() {
    const visibleMessages = (state.chatMessages || []).filter((entry) => entry.messageType !== "answer");
    const feeds = [ui.therapistChatFeed, ui.playerChatFeed];
    feeds.forEach((feed) => {
      feed.innerHTML = "";
      if (visibleMessages.length === 0) {
        const p = document.createElement("p");
        p.className = "text-body-secondary small mb-0";
        p.textContent = "Noch keine Nachrichten.";
        feed.append(p);
        return;
      }
      visibleMessages.forEach((entry) => {
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
    renderModeratorBoard();
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
      const li = document.createElement("li");
      li.textContent = question;
      ui.debriefQuestions.append(li);
    });
  }

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
    state.selectedOption = "";
    await updateSessionWithFeedback(patch, "Kooperative Runde gestartet.");
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
    state.selectedOption = "";
    await updateSessionWithFeedback(patch, "Boss-Runde gestartet.");
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
    state.selectedOption = "";
    await updateSessionWithFeedback(patch, "Wettbewerbsrunde gestartet.");
  }

  async function openDebriefRound() {
    if (!requireTherapistSession()) {
      return;
    }
    const questions = pickReflectionQuestions();
    const patch = {
      status: "debrief",
      currentChallenge: null,
      debriefQuestions: questions
    };
    await updateSessionWithFeedback(patch, "Nachbesprechung gestartet.");
  }

  async function completeSession() {
    if (!requireTherapistSession()) {
      return;
    }
    const patch = {
      status: "completed",
      currentChallenge: null,
      completedAt: Date.now()
    };
    await updateSessionWithFeedback(patch, "Sitzung abgeschlossen.");
  }

  function openModeratorWindow() {
    if (!state.sessionId) {
      showAlert("Bitte zuerst eine Sitzung starten.", "warning");
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("session", state.sessionId);
    url.searchParams.set("moderator", "1");
    state.moderatorWindowRef = window.open(
      url.toString(),
      "psyquest-moderator-screen",
      "popup=yes,width=1280,height=920"
    );
    if (!state.moderatorWindowRef) {
      showAlert("Das Moderator-Fenster wurde blockiert. Bitte Fensterfreigabe erlauben.", "warning");
      return;
    }
    state.moderatorWindowRef.focus();
    showAlert("Moderator-Fenster geoeffnet.", "success");
  }

  async function toggleModeratorFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn(error);
      showAlert("Vollbild konnte nicht gestartet werden.", "warning");
    }
  }

  function renderModeratorBoard() {
    if (!ui.moderatorView || !ui.moderatorAnswersBody || !ui.moderatorRankingBody) {
      return;
    }

    const session = state.session;
    if (!session) {
      ui.moderatorQuestionTitle.textContent = "Noch keine aktive Runde";
      ui.moderatorQuestionText.textContent = "Bitte Sitzung starten oder oeffnen.";
      ui.moderatorCorrectAnswer.textContent = "-";
      ui.moderatorAnswersBody.innerHTML =
        '<tr><td colspan="3" class="text-center text-body-secondary">Noch keine Antworten.</td></tr>';
      ui.moderatorRankingBody.innerHTML =
        '<tr><td colspan="4" class="text-center text-body-secondary">Noch keine Spielenden.</td></tr>';
      return;
    }

    const challenge = session.currentChallenge || null;
    ui.moderatorQuestionTitle.textContent = challenge?.title || "Noch keine aktive Frage";
    ui.moderatorQuestionText.textContent =
      challenge?.description || "Sobald eine Runde startet, erscheint hier die Frage.";
    ui.moderatorCorrectAnswer.textContent = challenge?.correctOption || "-";

    const answers = collectCurrentRoundAnswers();
    ui.moderatorAnswersBody.innerHTML = "";
    if (answers.length === 0) {
      ui.moderatorAnswersBody.innerHTML =
        '<tr><td colspan="3" class="text-center text-body-secondary">Noch keine Antworten.</td></tr>';
    } else {
      answers.forEach((entry) => {
        const row = document.createElement("tr");
        const resultText = entry.isCorrect ? "Treffer" : "Alternative";
        row.innerHTML = `
          <td>${escapeHtml(entry.avatarName || "Spieler")}</td>
          <td>${escapeHtml(entry.selectedOption || entry.message || "-")}</td>
          <td>${escapeHtml(resultText)}</td>
        `;
        ui.moderatorAnswersBody.append(row);
      });
    }

    const ranking = [...(state.players || [])]
      .filter((player) => player.role !== "therapist")
      .sort((a, b) => (b.score || 0) - (a.score || 0));
    ui.moderatorRankingBody.innerHTML = "";
    if (ranking.length === 0) {
      ui.moderatorRankingBody.innerHTML =
        '<tr><td colspan="4" class="text-center text-body-secondary">Noch keine Spielenden.</td></tr>';
      return;
    }
    ranking.forEach((player, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${escapeHtml(String(index + 1))}</td>
        <td>${escapeHtml(player.avatarName || "Spieler")}</td>
        <td>${escapeHtml(String(player.score || 0))}</td>
        <td>${escapeHtml(String(player.contributions || 0))}</td>
      `;
      ui.moderatorRankingBody.append(row);
    });
  }

  function collectCurrentRoundAnswers() {
    const session = state.session;
    const round = Number(session?.round) || 0;
    const challengeId = session?.currentChallenge?.id || "";
    const sortedAnswerEntries = [...(state.chatMessages || [])]
      .filter((entry) => entry.messageType === "answer")
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    const latestByPlayer = new Map();

    sortedAnswerEntries.forEach((entry) => {
      if (round && Number(entry.round) !== round) {
        return;
      }
      if (challengeId && entry.challengeId && entry.challengeId !== challengeId) {
        return;
      }
      const key = entry.uid || `${entry.avatarName || "Spieler"}-${entry.createdAt || 0}`;
      latestByPlayer.set(key, entry);
    });

    return [...latestByPlayer.values()].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }

  async function updateSessionWithFeedback(patch, successText) {
    try {
      await state.backend.updateSession(state.sessionId, patch);
      showAlert(successText, "success");
    } catch (error) {
      console.error(error);
      showAlert("Sitzung konnte nicht aktualisiert werden.", "danger");
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
      showAlert("Notiz gespeichert (anonym).", "success");
    } catch (error) {
      console.error(error);
      showAlert("Notiz konnte nicht gespeichert werden.", "danger");
    }
  }

  async function joinAsPlayer() {
    if (!state.sessionId) {
      showAlert("Keine Sitzungs-ID gefunden.", "warning");
      return;
    }
    if (!state.session) {
      showAlert("Sitzung wird geladen. Bitte kurz warten.", "info");
      return;
    }
    if (state.session.status === "completed") {
      showAlert("Diese Sitzung ist bereits abgeschlossen.", "warning");
      return;
    }

    const consentRequired = Boolean(state.session.consentRequired);
    if (consentRequired && !ui.playerConsentCheckbox.checked) {
      showAlert("Bitte Einwilligung bestaetigen, um beizutreten.", "warning");
      return;
    }

    const alreadyJoined = state.players.some((player) => player.uid === state.user.uid);
    const activePlayers = state.players.filter((player) => player.role !== "therapist").length;
    if (!alreadyJoined && activePlayers >= MAX_PLAYERS) {
      showAlert("Sitzung ist voll (maximal 12 Teilnehmende).", "warning");
      return;
    }

    try {
      await state.backend.upsertPlayer(state.sessionId, state.user.uid, {
        uid: state.user.uid,
        avatarName: state.localAvatar,
        role: "player",
        score: 0,
        contributions: 0,
        joinedAt: Date.now(),
        stickerOnly: Boolean(state.session.stickerOnly)
      });

      state.joined = true;
      ui.playerJoinCard.classList.add("d-none");
      ui.playerGameCard.classList.remove("d-none");
      ui.playerAvatarBadge.textContent = state.localAvatar;
      showAlert(`Willkommen, ${state.localAvatar}.`, "success");

      await state.backend.addChatMessage(state.sessionId, {
        uid: state.user.uid,
        avatarName: state.localAvatar,
        role: "player",
        message: "ist der Sitzung beigetreten.",
        createdAt: Date.now()
      });
    } catch (error) {
      console.error(error);
      showAlert("Beitritt fehlgeschlagen.", "danger");
    }
  }

  async function submitContribution({ actionType, presetMessage }) {
    if (!state.joined) {
      showAlert("Bitte zuerst der Sitzung beitreten.", "warning");
      return;
    }
    if (!state.session || state.session.status !== "in_game") {
      showAlert("Es laeuft aktuell keine aktive Runde.", "info");
      return;
    }

    const challenge = state.session.currentChallenge || null;
    const typedMessage = (presetMessage || ui.playerResponseInput.value || "").trim();
    const selectedOption =
      presetMessage
        ? ""
        : state.selectedOption ||
          (challenge?.options || []).find((entry) => entry === typedMessage) ||
          "";
    const answerText = selectedOption || typedMessage;
    if (!answerText) {
      showAlert("Bitte waehle zuerst eine Antwort.", "warning");
      return;
    }

    const challengeType = state.session.currentChallenge?.type || state.session.mode || "cooperative";
    const impact = computeImpact(challengeType, answerText, actionType || "manual");
    const correctOption = challenge?.correctOption || "";
    const isCorrect = correctOption
      ? normalizeAnswerText(answerText) === normalizeAnswerText(correctOption)
      : false;
    const contribution = {
      challengeType,
      message: answerText,
      points: impact.points,
      progressGain: impact.progressGain,
      damage: impact.damage,
      actionType: actionType || "manual",
      victoryMeme: pickRandom(MEME_LINES),
      selectedOption: answerText,
      round: Number(state.session.round) || 0,
      challengeId: challenge?.id || "",
      isCorrect
    };

    try {
      await state.backend.applyContribution(state.sessionId, state.user.uid, state.localAvatar, contribution);
      await state.backend.addChatMessage(state.sessionId, {
        uid: state.user.uid,
        avatarName: state.localAvatar,
        role: "player",
        message: answerText,
        messageType: "answer",
        selectedOption: answerText,
        round: Number(state.session.round) || 0,
        challengeId: challenge?.id || "",
        isCorrect,
        correctOption,
        createdAt: Date.now()
      });
      ui.playerResponseInput.value = "";
      state.selectedOption = "";
      ui.challengeOptions.querySelectorAll("button[data-option]").forEach((entry) => {
        entry.classList.remove("is-selected");
      });
      showAlert("Antwort gesendet.", isCorrect ? "success" : "info");
    } catch (error) {
      console.error(error);
      showAlert("Beitrag konnte nicht gesendet werden.", "danger");
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
      showAlert("Bitte zuerst eine Sitzung starten oder beitreten.", "warning");
      return;
    }

    const isPlayer = role === "player";
    if (isPlayer && !state.joined) {
      showAlert("Bitte zuerst der Sitzung beitreten.", "warning");
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
      showAlert("In dieser Sitzung sind im Chat nur Sticker erlaubt.", "info");
      return;
    }

    const avatarName = isPlayer
      ? state.localAvatar
      : sanitizeAlias(ui.therapistAliasInput.value) || "Leitfaden Eule";

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
      ui.openModeratorWindowBtn,
      ui.copyJoinLinkBtn,
      ui.therapistSendChatBtn,
      ui.saveNoteBtn
    ].forEach((element) => {
      element.disabled = disabled;
    });
  }

  function requireTherapistSession() {
    if (state.role !== "therapist") {
      return false;
    }
    if (!state.sessionId || !state.session) {
      showAlert("Bitte zuerst eine Sitzung erstellen.", "warning");
      return false;
    }
    return true;
  }

  function drawQrCode(value) {
    ui.qrCodeContainer.innerHTML = "";
    if (!window.QRCode) {
      ui.qrCodeContainer.textContent = "QRCode.js nicht geladen.";
      return;
    }
    // eslint-disable-next-line no-new
    new QRCode(ui.qrCodeContainer, {
      text: value,
      width: 210,
      height: 210,
      colorDark: "#111827",
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
      showAlert("Kurzlink kopiert.", "success");
    } catch (error) {
      console.error(error);
      showAlert("Konnte Link nicht in Zwischenablage kopieren.", "warning");
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
      .catch((error) => console.warn("Service worker registration failed:", error));
  }

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
      .replace(/[^A-Za-z0-9 _-]/g, "")
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

  function normalizeAnswerText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function setProgressBar(element, value, extraClass) {
    if (!element) {
      return;
    }
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
