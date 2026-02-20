/* ============================================
   Firebase Configuration & Mock Mode
   ============================================
   Set USE_FIREBASE = true and fill in your config
   to use real Firebase. Otherwise, a local mock
   allows full testing without any backend.
   ============================================ */

const USE_FIREBASE = false;

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
let rtdb = null;
let auth = null;

if (USE_FIREBASE && typeof firebase !== 'undefined') {
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.firestore();
  rtdb = firebase.database();
  auth = firebase.auth();
  auth.signInAnonymously().catch(e => console.warn('Anonymous auth failed:', e));
}

/* ============================================
   Local Mock Database for testing without Firebase
   ============================================ */
const MockDB = {
  _store: {},
  _listeners: {},
  _nextId: 1,

  _getCollection(path) {
    if (!this._store[path]) this._store[path] = {};
    return this._store[path];
  },

  async get(collection, docId) {
    const col = this._getCollection(collection);
    return col[docId] || null;
  },

  async set(collection, docId, data) {
    const col = this._getCollection(collection);
    col[docId] = { ...data, _id: docId };
    this._notifyListeners(collection, docId);
    return docId;
  },

  async update(collection, docId, data) {
    const col = this._getCollection(collection);
    if (col[docId]) {
      col[docId] = { ...col[docId], ...data };
    } else {
      col[docId] = { ...data, _id: docId };
    }
    this._notifyListeners(collection, docId);
    return docId;
  },

  async add(collection, data) {
    const id = 'doc_' + this._nextId++;
    return this.set(collection, id, data);
  },

  async delete(collection, docId) {
    const col = this._getCollection(collection);
    delete col[docId];
    this._notifyListeners(collection, docId);
  },

  async query(collection) {
    const col = this._getCollection(collection);
    return Object.values(col);
  },

  onSnapshot(collection, docId, callback) {
    const key = `${collection}/${docId}`;
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(callback);
    const data = this._getCollection(collection)[docId];
    if (data) callback(data);
    return () => {
      this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
    };
  },

  onCollectionSnapshot(collection, callback) {
    const key = `collection:${collection}`;
    if (!this._listeners[key]) this._listeners[key] = [];
    this._listeners[key].push(callback);
    callback(Object.values(this._getCollection(collection)));
    return () => {
      this._listeners[key] = this._listeners[key].filter(cb => cb !== callback);
    };
  },

  _notifyListeners(collection, docId) {
    const docKey = `${collection}/${docId}`;
    const colKey = `collection:${collection}`;
    const data = this._getCollection(collection)[docId];

    if (this._listeners[docKey]) {
      this._listeners[docKey].forEach(cb => cb(data));
    }
    if (this._listeners[colKey]) {
      const all = Object.values(this._getCollection(collection));
      this._listeners[colKey].forEach(cb => cb(all));
    }
  }
};

/* ============================================
   Unified Database API
   Works with both Firebase and MockDB
   ============================================ */
const Database = {
  async getSession(sessionId) {
    if (USE_FIREBASE && db) {
      const doc = await db.collection('sessions').doc(sessionId).get();
      return doc.exists ? doc.data() : null;
    }
    return MockDB.get('sessions', sessionId);
  },

  async createSession(sessionId, data) {
    if (USE_FIREBASE && db) {
      await db.collection('sessions').doc(sessionId).set(data);
      return sessionId;
    }
    return MockDB.set('sessions', sessionId, data);
  },

  async updateSession(sessionId, data) {
    if (USE_FIREBASE && db) {
      await db.collection('sessions').doc(sessionId).update(data);
      return;
    }
    return MockDB.update('sessions', sessionId, data);
  },

  async addPlayer(sessionId, playerData) {
    const playerId = 'p_' + Math.random().toString(36).substr(2, 6);
    const path = `sessions/${sessionId}/players`;
    if (USE_FIREBASE && db) {
      await db.collection('sessions').doc(sessionId)
        .collection('players').doc(playerId).set(playerData);
      return playerId;
    }
    await MockDB.set(path, playerId, playerData);
    return playerId;
  },

  async getPlayers(sessionId) {
    const path = `sessions/${sessionId}/players`;
    if (USE_FIREBASE && db) {
      const snap = await db.collection('sessions').doc(sessionId)
        .collection('players').get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const players = await MockDB.query(path);
    return players.map(p => ({ id: p._id, ...p }));
  },

  onSessionUpdate(sessionId, callback) {
    if (USE_FIREBASE && rtdb) {
      const ref = rtdb.ref(`live/${sessionId}`);
      ref.on('value', snap => callback(snap.val()));
      return () => ref.off();
    }
    return MockDB.onSnapshot('sessions', sessionId, callback);
  },

  onPlayersUpdate(sessionId, callback) {
    const path = `sessions/${sessionId}/players`;
    if (USE_FIREBASE && db) {
      return db.collection('sessions').doc(sessionId)
        .collection('players').onSnapshot(snap => {
          const players = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          callback(players);
        });
    }
    return MockDB.onCollectionSnapshot(path, (players) => {
      callback(players.map(p => ({ id: p._id, ...p })));
    });
  },

  async submitAction(sessionId, actionData) {
    const path = `sessions/${sessionId}/actions`;
    const actionId = 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    if (USE_FIREBASE && db) {
      await db.collection('sessions').doc(sessionId)
        .collection('actions').doc(actionId).set(actionData);
      return actionId;
    }
    await MockDB.set(path, actionId, actionData);
    return actionId;
  },

  onActionsUpdate(sessionId, callback) {
    const path = `sessions/${sessionId}/actions`;
    if (USE_FIREBASE && db) {
      return db.collection('sessions').doc(sessionId)
        .collection('actions').onSnapshot(snap => {
          callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
    }
    return MockDB.onCollectionSnapshot(path, (actions) => {
      callback(actions.map(a => ({ id: a._id, ...a })));
    });
  },

  async saveLiveState(sessionId, state) {
    if (USE_FIREBASE && rtdb) {
      await rtdb.ref(`live/${sessionId}`).set(state);
      return;
    }
    await MockDB.set('live', sessionId, state);
  },

  onLiveState(sessionId, callback) {
    if (USE_FIREBASE && rtdb) {
      const ref = rtdb.ref(`live/${sessionId}`);
      ref.on('value', snap => callback(snap.val()));
      return () => ref.off();
    }
    return MockDB.onSnapshot('live', sessionId, callback);
  },

  async deleteSession(sessionId) {
    if (USE_FIREBASE && db) {
      const playersSnap = await db.collection('sessions').doc(sessionId)
        .collection('players').get();
      const batch = db.batch();
      playersSnap.docs.forEach(d => batch.delete(d.ref));
      batch.delete(db.collection('sessions').doc(sessionId));
      await batch.commit();
      if (rtdb) await rtdb.ref(`live/${sessionId}`).remove();
      return;
    }
    await MockDB.delete('sessions', sessionId);
    await MockDB.delete('live', sessionId);
  }
};
