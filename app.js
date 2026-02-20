(function psyQuestApp() {
  "use strict";

  const MAX_PLAYERS = 12;
  const MIN_RECOMMENDED_PLAYERS = 4;
  const DEBRIEF_DURATION_MS = 3 * 60 * 1000;

  const THEMES = [
    { value: "anxiety", label: "Angst / Anxiety" },
    { value: "depression", label: "Depression" },
    { value: "social-phobia", label: "Soziale Phobie" },
    { value: "stress", label: "Stressmanagement" },
    { value: "cbt-dbt", label: "CBT / DBT Skills" }
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
    "Welcher Skill war fuer dich am hilfreichsten?",
    "Was moechtest du im Alltag als naechsten Mini-Schritt ausprobieren?",
    "Wann hat dich die Gruppe besonders unterstuetzt?",
    "Welche Selbstbotschaft ersetzt heute den Inner Critic?"
  ];

  const MEME_LINES = [
    "Inner Critic geblockt. Teamkindness aktiviert.",
    "Anxiety Monster hat auf lautlos gestellt.",
    "Coping Combo x5: Reframe + Atem + Support.",
    "Boss says: 'Ok wow, das war empathisch.'",
    "Patch notes: Scham -20%, Mut +35%, Teamplay +40%."
  ];

  const STATUS_LABELS = {
    lobby: "Lobby",
    in_game: "In Runde",
    victory: "Sieg",
    debrief: "Debrief",
    completed: "Abgeschlossen"
  };

  /**
   * Sample quest ideas (10) for therapeutic expansion:
   * 1) Worried Woods (deep anxiety exploration, grounding checkpoints)
   * 2) Defeat Darkness Dragon (depression activation quests)
   * 3) Social Shield Arena (social phobia exposure ladder)
   * 4) Thought Storm Harbor (CBT thought records under pressure)
   * 5) Emotion Atlas Expedition (DBT emotion labeling and validation)
   * 6) Stress Volcano Control Room (distress tolerance chain skills)
   * 7) Sleep Guardian Temple (sleep hygiene and rumination interruption)
   * 8) Future Self Citadel (values-based action and perspective shifts)
   * 9) Compassion Forge (self-compassion scripts against self-criticism)
   * 10) Resilience Relay (team coping strategy drills and reflection loops)
   */
  const QUEST_LIBRARY = [
    {
      id: "escape-anxiety-labyrinth",
      theme: "anxiety",
      title: "Flucht aus dem Angst-Labyrinth",
      bossName: "Anxiety Monster",
      summary: "Kooperatives Escape Room mit Achtsamkeit, Reframing und Stressmanagement."
    },
    {
      id: "inner-critic-boss",
      theme: "cbt-dbt",
      title: "Kampf gegen den Inner Critic",
      bossName: "Inner Critic",
      summary: "Boss Fight mit Empathy Duel, Skill Race und Future-Self-Perspektive."
    },
    {
      id: "darkness-dragon",
      theme: "depression",
      title: "Defeat Darkness Dragon",
      bossName: "Darkness Dragon",
      summary: "Behavioral Activation und kleine machbare Schritte gegen Rueckzug."
    },
    {
      id: "social-bridge",
      theme: "social-phobia",
      title: "Bridge of Brave Steps",
      bossName: "Echo Judge",
      summary: "Anonyme Teamquests fuer sichere soziale Exposition."
    },
    {
      id: "stress-reactor",
      theme: "stress",
      title: "Stress Reactor Shutdown",
      bossName: "Overload Titan",
      summary: "Distress Tolerance und Priorisierung unter Zeitdruck."
    },
    {
      id: "emotion-compass",
      theme: "cbt-dbt",
      title: "Emotion Compass Expedition",
      bossName: "Mood Mirage",
      summary: "Emotion Labeling, Validation und Wise-Mind Entscheidungen."
    }
  ];

  const ESCAPE_CHALLENGES = [
    {
      id: "escape-emotion-match",
      type: "escape",
      title: "Raum 1: Emotion-Match-Up",
      description:
        "Ordnet Symptome und Emotionen den hilfreichsten Coping-Skills zu. Jede hilfreiche Zuordnung oeffnet ein Segment der Tuer.",
      options: [
        "Herzrasen -> 4-7-8 Atmung",
        "Katastrophengedanke -> Gedanken pruefen",
        "Innere Unruhe -> Grounding 5-4-3-2-1",
        "Rueckzug -> Mikro-Aktivierung"
      ]
    },
    {
      id: "escape-strength-discovery",
      type: "escape",
      title: "Raum 2: Staerke-Entdeckung",
      description:
        "Das Anxiety Monster flackert. Nennt persönliche Staerken oder Ressourcen. Jede Ressource wird zu einem Schluessel.",
      options: [
        "Ich halte schwierige Momente aus.",
        "Ich frage um Hilfe, wenn es wichtig ist.",
        "Ich kann kleine Schritte planen.",
        "Ich bleibe auch bei Unsicherheit freundlich zu mir."
      ]
    },
    {
      id: "escape-coping-maze",
      type: "escape",
      title: "Raum 3: Coping-Maze",
      description:
        "Weggabelung: Vermeiden oder hilfreiches Handeln? Das Team waehlt gemeinsam Wege mit langfristiger Entlastung.",
      options: [
        "Vermeidung -> Kurzfristig ruhig, langfristig enger",
        "Schrittweise Konfrontation -> Kurzfristig schwer, langfristig frei",
        "Selbstkritik -> Energie sinkt",
        "Selbstmitgefuehl -> Energie steigt"
      ]
    },
    {
      id: "escape-group-jigsaw",
      type: "escape",
      title: "Raum 4: Gruppen-Jigsaw",
      description:
        "Jede Person steuert einen Teil zur Teambotschaft bei. Das finale Bild lautet: 'Angst ist ein Signal, kein Urteil.'",
      options: [
        "Ich bin nicht allein.",
        "Gefuehle sind Wellen, keine Befehle.",
        "Atmen ist ein Skill, kein Trick.",
        "Mut ist ein kleiner naechster Schritt."
      ]
    },
    {
      id: "escape-mindful-gate",
      type: "escape",
      title: "Raum 5: Mindful Gate",
      description:
        "30 Sekunden Achtsamkeitsfokus: 1 Gedanke, 1 Gefuehl, 1 Koerperempfindung benennen. Das stabilisiert das Team.",
      options: [
        "Gedanke: 'Ich schaffe das nicht' -> Reframe",
        "Gefuehl: Unsicherheit -> Validieren",
        "Koerper: Druck in Brust -> Atmung",
        "Impuls: Vermeiden -> Kleinen Schritt waehlen"
      ]
    }
  ];

  const BOSS_CHALLENGES = [
    {
      id: "boss-empathy-duel",
      type: "boss",
      title: "Boss Angriff 1: Empathy Duel",
      description:
        "Der Boss sagt: 'Du bist wertlos'. Formuliere eine empathische Antwort aus Sicht deines starken Ichs.",
      options: [
        "Ein Gedanke ist nicht die Wahrheit.",
        "Ich darf unsicher sein und trotzdem handeln.",
        "Ich spreche mit mir wie mit einem Freund.",
        "Ich bin in Entwicklung, nicht in Bewertung."
      ]
    },
    {
      id: "boss-skill-race",
      type: "boss",
      title: "Boss Angriff 2: Skill Race",
      description:
        "Szenario: Akute Pruefungsangst. Waehle schnell einen hilfreichen Skill und erweitere ihn mit einem Mini-Plan.",
      options: [
        "Atemfokus fuer 60 Sekunden",
        "Gedankenprotokoll kurz",
        "Eiswasser / Temperatur-Skill",
        "Support-Nachricht an Buddy"
      ]
    },
    {
      id: "boss-perspective-battle",
      type: "boss",
      title: "Boss Angriff 3: Perspective Battle",
      description:
        "Beschreibe dieselbe Situation aus Perspektive deines Future Strong Self in 1-2 Saetzen.",
      options: [
        "In 6 Monaten sehe ich: ich war mutiger als gedacht.",
        "Heute klein, morgen stabil.",
        "Ich trainiere, nicht versage.",
        "Ich waehle Richtung statt Perfektion."
      ]
    },
    {
      id: "boss-affirmation-hunt",
      type: "boss",
      title: "Finale: Affirmation Hunt",
      description:
        "Sammelt Team-Affirmationen als Ultimate Weapon. Jede konstruktive Aussage reduziert Boss-HP stark.",
      options: [
        "Ich bin nicht mein Angstgedanke.",
        "Ich kann Hilfe nutzen, ohne schwach zu sein.",
        "Ich darf langsam sein und trotzdem vorankommen.",
        "Ich habe bereits schwierige Tage ueberstanden."
      ]
    }
  ];

  const COMPETITIVE_CHALLENGES = [
    {
      id: "competitive-empathy",
      type: "competitive",
      title: "Friendly Mode: Empathy Duel",
      description:
        "Zwei Perspektiven werden verglichen. Gruppe votet anonym die hilfreichste Antwort (fokus auf Unterstuetzung).",
      options: [
        "Antwort A: Validieren + Mini-Schritt",
        "Antwort B: Reframe + Selbstmitgefuehl",
        "Antwort C: Problemloesen + Pause",
        "Antwort D: Wertekompass + Handlung"
      ]
    },
    {
      id: "competitive-skill-race",
      type: "competitive",
      title: "Friendly Mode: Skill Race",
      description:
        "Wer zuerst einen sinnvollen Coping-Plan nennt, bekommt Bonuspunkte. Danach kurze gemeinsame Reflexion.",
      options: [
        "Atmen + Grounding",
        "Gedankenstopp + Alternativgedanke",
        "Kurz bewegen + trinken",
        "Buddy-Check-in"
      ]
    },
    {
      id: "competitive-perspective",
      type: "competitive",
      title: "Friendly Mode: Perspective Battle",
      description:
        "Formuliere die Situation aus Future-Strong-Self-Sicht. Punkte fuer Kreativitaet, Hoffnung und Realismus.",
      options: [
        "Heute lerne ich Tempo statt Druck.",
        "Ich handle trotz Unsicherheit.",
        "Ich wuerdige Fortschritt statt Perfektion.",
        "Ich kann Hilfe annehmen und wachsen."
      ]
    }
  ];

  const AVATAR_ADJECTIVES = [
    "Brave",
    "Calm",
    "Wise",
    "Curious",
    "Steady",
    "Bright",
    "Gentle",
    "Focused",
    "Hopeful",
    "Kind"
  ];

  const AVATAR_ANIMALS = [
    "Lion",
    "Fox",
    "Panda",
    "Otter",
    "Falcon",
    "Dolphin",
    "Wolf",
    "Koala",
    "Eagle",
    "Bear"
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
    debriefIntervalId: null,
    deferredInstallPrompt: null,
    autoDebriefRound: null
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
      "playerJoinCard",
      "playerGameCard",
      "playerDebriefCard",
      "playerSessionIdDisplay",
      "avatarPreview",
      "rerollAvatarBtn",
      "playerConsentCheckbox",
      "joinSessionBtn",
      "debriefCountdown",
      "debriefQuestions",
      "playerAvatarBadge",
      "playerStatusBadge",
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
      { id: "reframe", label: "Reframe Gedanke" },
      { id: "mindful-breath", label: "Achtsam atmen" },
      { id: "support", label: "Team-Support geben" },
      { id: "next-step", label: "Naechsten Schritt planen" }
    ];
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-outline-success btn-sm";
      button.textContent = action.label;
      button.addEventListener("click", () => {
        const text = `${action.label}: Ich waehle diesen Skill jetzt.`;
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

    ui.challengeOptions.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-option]");
      if (!button) {
        return;
      }
      ui.playerResponseInput.value = button.dataset.option || "";
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
  }

  async function initBackend() {
    const rawConfig = window.PSYQUEST_FIREBASE_CONFIG || {};
    const config = normalizeFirebaseConfig(rawConfig);
    const configValidation = validateFirebaseConfig(config);
    const hasFirebaseSdk = Boolean(window.firebase);

    if (configValidation.valid && hasFirebaseSdk) {
      try {
        state.backend = new FirebaseBackend(config);
        state.user = await state.backend.initAuth();
        state.backendMode = "firebase";
        setConnectionBadge("Firebase Live", "success");
        return;
      } catch (error) {
        console.error(error);
        showAlert(
          "Firebase konnte nicht initialisiert werden. Die App startet im lokalen Demo-Modus.",
          "warning"
        );
      }
    }

    state.backend = new DemoBackend();
    state.user = await state.backend.initAuth();
    state.backendMode = "demo";
    setConnectionBadge("Demo Local", "secondary");

    const reasons = [];
    const meta = window.PSYQUEST_FIREBASE_CONFIG_META || {};
    if (!configValidation.valid) {
      reasons.push(`fehlende/ungueltige Keys: ${configValidation.missing.join(", ")}`);
    }
    if (!hasFirebaseSdk) {
      reasons.push("Firebase SDK nicht geladen (Netzwerk/Adblock pruefen)");
    }
    if (Array.isArray(meta.missingFirebaseKeys) && meta.missingFirebaseKeys.length > 0) {
      reasons.push(`Build-Meta fehlt: ${meta.missingFirebaseKeys.join(", ")}`);
    }
    if (meta.jsonEnvParseError) {
      reasons.push("FIREBASE_CONFIG_JSON konnte nicht geparst werden");
    }

    const detail =
      reasons.length > 0
        ? ` ${reasons.join(" | ")}`
        : " firebase-config.js enthaelt noch Platzhalter oder ist nicht erreichbar.";
    showAlert(
      `Demo-Modus aktiv.${detail} Pruefe /firebase-config.js in der deployten URL.`,
      "warning"
    );
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

    if (state.role === "player" && state.sessionId) {
      await subscribeToSession(state.sessionId);
      ui.playerSessionIdDisplay.textContent = state.sessionId;
    }
  }

  async function createTherapistSession() {
    if (!state.backend || !state.user) {
      showAlert("Backend noch nicht bereit.", "warning");
      return;
    }

    const quest = QUEST_LIBRARY.find((entry) => entry.id === ui.questSelect.value) || QUEST_LIBRARY[0];
    const alias = sanitizeAlias(ui.therapistAliasInput.value) || "Guide Owl";
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
      debriefEndsAt: null,
      currentChallenge: null,
      shortLink: joinLink,
      scheduleMinutes: { game: 15, reflection: 30, nextGame: 15 }
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
      showAlert(`Session ${sessionId} erstellt. QR kann jetzt gescannt werden.`, "success");
      if ((state.players || []).length < MIN_RECOMMENDED_PLAYERS) {
        showAlert(
          "Hinweis: Optimal sind 4-12 Teilnehmende. Unter 4 funktioniert es als Mini-Format.",
          "info"
        );
      }
    } catch (error) {
      console.error(error);
      showAlert("Session konnte nicht erstellt werden.", "danger");
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
          showAlert("Session wurde nicht gefunden oder ist beendet.", "warning");
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
    setProgressBar(ui.teamProgressBar, progress, "bg-success");
    setProgressBar(ui.playerTeamProgressBar, progress, "bg-success");
    setProgressBar(ui.bossHpBar, bossHp, "bg-danger");
    setProgressBar(ui.playerBossHpBar, bossHp, "bg-danger");
    ui.roundDisplay.textContent = String(round);
    ui.teamLevelDisplay.textContent = String(teamLevel);
    ui.totalPointsDisplay.textContent = String(totalPoints);
    ui.playerTeamLevelValue.textContent = String(teamLevel);

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

    renderChallenge(session.currentChallenge);
    renderMemeOrCertificate();
    renderDebriefState();

    if (
      state.role === "therapist" &&
      session.status === "victory" &&
      !session.debriefEndsAt &&
      state.autoDebriefRound !== session.round
    ) {
      state.autoDebriefRound = session.round;
      openDebriefRound();
    }
  }

  function renderChallenge(challenge) {
    if (!challenge) {
      ui.challengeTitle.textContent = "Warte auf Start...";
      ui.challengeDescription.textContent =
        "Sobald die Therapeutin/der Therapeut die Runde startet, erscheint hier der Auftrag.";
      ui.challengeOptions.innerHTML = "";
      return;
    }

    ui.challengeTitle.textContent = challenge.title || "Neue Runde";
    ui.challengeDescription.textContent = challenge.description || "";
    ui.challengeOptions.innerHTML = "";
    (challenge.options || []).forEach((optionText) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "challenge-chip";
      button.dataset.option = optionText;
      button.textContent = optionText;
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
        <strong>Round Meme:</strong> ${escapeHtml(memeLine)}
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
  }

  function renderOwnBadges(badges) {
    ui.playerBadgesList.innerHTML = "";
    if (!badges || badges.length === 0) {
      ui.playerBadgesList.innerHTML = '<span class="quiet-note">Noch keine Badges gesammelt.</span>';
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
      badges.push(`Thought Reframer Level ${level}`);
    }
    if (contributions >= 3) {
      badges.push("Empathy Hero");
    }
    if (contributions >= 6) {
      badges.push("Team Anchor");
    }
    if (score >= 130) {
      badges.push("Demon Hunter");
    }
    return badges;
  }

  function renderChatFeeds() {
    const feeds = [ui.therapistChatFeed, ui.playerChatFeed];
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

  function renderDebriefState() {
    const session = state.session;
    if (!session) {
      return;
    }
    const isDebrief = session.status === "debrief";
    ui.playerDebriefCard.classList.toggle("d-none", !isDebrief);
    if (!isDebrief) {
      stopDebriefTicker();
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

    startDebriefTicker(session.debriefEndsAt);
  }

  function startDebriefTicker(endTimestamp) {
    stopDebriefTicker();
    if (!endTimestamp) {
      ui.debriefCountdown.textContent = "03:00";
      return;
    }
    const tick = () => {
      const remainingMs = Math.max(0, Number(endTimestamp) - Date.now());
      ui.debriefCountdown.textContent = formatDuration(remainingMs);
      if (remainingMs <= 0) {
        stopDebriefTicker();
      }
    };
    tick();
    state.debriefIntervalId = window.setInterval(tick, 1000);
  }

  function stopDebriefTicker() {
    if (state.debriefIntervalId) {
      clearInterval(state.debriefIntervalId);
      state.debriefIntervalId = null;
    }
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
      meme: "",
      debriefEndsAt: null
    };
    await updateSessionWithFeedback(patch, "Escape Room Runde gestartet.");
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
      meme: "",
      debriefEndsAt: null
    };
    await updateSessionWithFeedback(patch, "Boss Fight gestartet.");
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
      meme: "",
      debriefEndsAt: null
    };
    await updateSessionWithFeedback(patch, "Friendly Competitive Runde gestartet.");
  }

  async function openDebriefRound() {
    if (!requireTherapistSession()) {
      return;
    }
    const questions = pickReflectionQuestions();
    const patch = {
      status: "debrief",
      debriefEndsAt: Date.now() + DEBRIEF_DURATION_MS,
      debriefQuestions: questions
    };
    await updateSessionWithFeedback(patch, "Debrief gestartet.");
  }

  async function completeSession() {
    if (!requireTherapistSession()) {
      return;
    }
    const patch = {
      status: "completed",
      completedAt: Date.now()
    };
    await updateSessionWithFeedback(patch, "Session abgeschlossen.");
  }

  async function updateSessionWithFeedback(patch, successText) {
    try {
      await state.backend.updateSession(state.sessionId, patch);
      showAlert(successText, "success");
    } catch (error) {
      console.error(error);
      showAlert("Session konnte nicht aktualisiert werden.", "danger");
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
      showAlert("Keine Session-ID gefunden.", "warning");
      return;
    }
    if (!state.session) {
      showAlert("Session wird geladen. Bitte kurz warten.", "info");
      return;
    }
    if (state.session.status === "completed") {
      showAlert("Diese Session ist bereits abgeschlossen.", "warning");
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
      showAlert("Session ist voll (maximal 12 Teilnehmende).", "warning");
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
        message: "ist der Session beigetreten.",
        createdAt: Date.now()
      });
    } catch (error) {
      console.error(error);
      showAlert("Beitritt fehlgeschlagen.", "danger");
    }
  }

  async function submitContribution({ actionType, presetMessage }) {
    if (!state.joined) {
      showAlert("Bitte zuerst Session beitreten.", "warning");
      return;
    }
    if (!state.session || state.session.status !== "in_game") {
      showAlert("Es laeuft aktuell keine aktive Runde.", "info");
      return;
    }

    const message = (presetMessage || ui.playerResponseInput.value || "").trim();
    if (!message) {
      showAlert("Bitte zuerst eine hilfreiche Antwort eingeben.", "warning");
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
      showAlert("Bitte zuerst eine Session starten/beitreten.", "warning");
      return;
    }

    const isPlayer = role === "player";
    if (isPlayer && !state.joined) {
      showAlert("Bitte zuerst Session beitreten.", "warning");
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
      showAlert("Diese Session nutzt Sticker-only Chat.", "info");
      return;
    }

    const avatarName = isPlayer
      ? state.localAvatar
      : sanitizeAlias(ui.therapistAliasInput.value) || "Guide Owl";

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
      showAlert("Bitte zuerst eine Session erstellen.", "warning");
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
    close.setAttribute("aria-label", "Close");

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

  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
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

  document.addEventListener("DOMContentLoaded", () => {
    boot().catch((error) => {
      console.error(error);
    });
  });
})();
