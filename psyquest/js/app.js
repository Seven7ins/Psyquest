/* ============================================
   PsyQuest – Main Application Controller
   Handles session management, QR codes,
   navigation, real-time sync, and orchestration.
   ============================================ */

const App = (() => {
  let state = {
    role: null,            // 'therapist' or 'player'
    sessionId: null,
    sessionCode: null,
    playerId: null,
    playerAvatar: null,
    gameMode: null,
    selectedQuest: null,
    disorderFocus: 'mixed',
    ageGroup: 'adults',
    anonymityMode: false,
    players: [],
    gameState: null,
    debriefIndex: 0,
    timerInterval: null,
    unsubscribers: []
  };

  function generateSessionCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function getAssignedAvatar(index) {
    return AVATARS[index % AVATARS.length];
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
      screen.style.animation = 'none';
      screen.offsetHeight;
      screen.style.animation = 'fadeIn 0.3s ease';
    }
  }

  function selectGameMode(mode) {
    state.gameMode = mode;
    document.querySelectorAll('.game-mode-card').forEach(c => c.classList.remove('selected'));
    const card = document.querySelector(`[data-mode="${mode}"]`);
    if (card) card.classList.add('selected');

    const questSection = document.getElementById('quest-selection');
    const questList = document.getElementById('quest-list');

    if (QUESTS[mode]) {
      const disorder = document.getElementById('disorder-focus').value;
      const quests = QUESTS[mode].filter(q =>
        q.disorder.includes(disorder) || q.disorder.includes('mixed')
      );

      questList.innerHTML = '';
      quests.forEach((quest, i) => {
        const div = document.createElement('div');
        div.className = 'quest-card' + (i === 0 ? ' selected' : '');
        div.onclick = () => {
          document.querySelectorAll('.quest-card').forEach(c => c.classList.remove('selected'));
          div.classList.add('selected');
          state.selectedQuest = quest;
        };
        div.innerHTML = `
          <div class="quest-icon">${quest.icon}</div>
          <div class="quest-info">
            <h4>${quest.name}</h4>
            <p>${quest.description}</p>
          </div>
        `;
        questList.appendChild(div);
        if (i === 0) state.selectedQuest = quest;
      });

      questSection.style.display = 'block';
    } else {
      questSection.style.display = 'none';
      state.selectedQuest = null;
    }
  }

  async function createSession() {
    state.role = 'therapist';
    state.sessionCode = generateSessionCode();
    state.sessionId = state.sessionCode.toLowerCase();
    state.disorderFocus = document.getElementById('disorder-focus').value;
    state.ageGroup = document.getElementById('age-group').value;
    state.anonymityMode = document.getElementById('anonymity-mode').checked;

    if (!state.gameMode) {
      showToast('Bitte wähle einen Spielmodus!', 'error');
      return;
    }

    const groupName = document.getElementById('group-name').value || 'PsyQuest Session';

    const sessionData = {
      code: state.sessionCode,
      groupName,
      gameMode: state.gameMode,
      questId: state.selectedQuest ? state.selectedQuest.id : null,
      disorderFocus: state.disorderFocus,
      ageGroup: state.ageGroup,
      anonymityMode: state.anonymityMode,
      status: 'lobby',
      createdAt: Date.now(),
      playerCount: 0
    };

    await Database.createSession(state.sessionId, sessionData);
    await Database.saveLiveState(state.sessionId, {
      status: 'lobby',
      gameMode: state.gameMode,
      questId: sessionData.questId,
      currentPhase: null,
      currentRoom: 0,
      currentRound: 0,
      progress: 0,
      bossHP: 100,
      actions: [],
      therapistMessage: null,
      timestamp: Date.now()
    });

    showScreen('screen-therapist-dashboard');
    setupTherapistDashboard();
    showToast('Session erstellt!', 'success');
  }

  function setupTherapistDashboard() {
    document.getElementById('session-code-display').textContent = state.sessionCode;
    const modeNames = {
      'escape-room': '🏰 Escape Room',
      'boss-fight': '⚔️ Boss Fight',
      'empathy-duel': '💬 Empathie-Duell',
      'skill-race': '🏃 Skill Race',
      'perspective-battle': '🔮 Perspektiv-Battle'
    };
    document.getElementById('selected-mode-display').textContent =
      `Modus: ${modeNames[state.gameMode] || state.gameMode}`;

    generateQRCode();
    listenForPlayers();
  }

  function generateQRCode() {
    const container = document.getElementById('qr-code-container');
    container.innerHTML = '';

    const joinUrl = `${window.location.origin}${window.location.pathname}?join=${state.sessionCode}`;
    document.getElementById('session-link').textContent = joinUrl;

    if (typeof QRCode !== 'undefined') {
      QRCode.toCanvas(document.createElement('canvas'), joinUrl, {
        width: 250,
        margin: 2,
        color: { dark: '#1e1040', light: '#ffffff' }
      }, (err, canvas) => {
        if (!err) {
          canvas.style.borderRadius = '12px';
          container.appendChild(canvas);
        } else {
          container.innerHTML = `<p class="text-gray-400">QR: ${joinUrl}</p>`;
        }
      });
    } else {
      container.innerHTML = `
        <div class="text-gray-400 p-4">
          <p class="text-sm mb-2">QR-Code Bibliothek nicht geladen</p>
          <p class="font-mono text-lg">${joinUrl}</p>
        </div>`;
    }
  }

  function listenForPlayers() {
    const unsub = Database.onPlayersUpdate(state.sessionId, (players) => {
      state.players = players;
      renderPlayerList(players);
      updateStartButton(players.length);
    });
    state.unsubscribers.push(unsub);
  }

  function renderPlayerList(players) {
    const list = document.getElementById('player-list');
    const count = document.getElementById('player-count');
    const progress = document.getElementById('player-progress');

    count.textContent = players.length;
    progress.style.width = `${Math.min(100, (players.length / 4) * 100)}%`;

    list.innerHTML = '';
    players.forEach(p => {
      const div = document.createElement('div');
      div.className = 'player-list-item';
      div.innerHTML = `
        <div class="dot"></div>
        <span class="text-xl">${p.emoji}</span>
        <span class="text-sm font-medium">${p.name}</span>
      `;
      list.appendChild(div);
    });
  }

  function updateStartButton(count) {
    const btn = document.getElementById('btn-start-game');
    if (count >= 2) {
      btn.disabled = false;
      btn.textContent = `▶ Spiel starten (${count} Spieler)`;
    } else {
      btn.disabled = true;
      btn.textContent = `▶ Warte auf Spieler (${count}/4)`;
    }
  }

  async function joinSession() {
    const codeInput = document.getElementById('join-code');
    const code = codeInput.value.trim().toUpperCase();
    const errorEl = document.getElementById('join-error');

    if (!code || code.length < 4) {
      errorEl.textContent = 'Bitte gib einen gültigen Session-Code ein.';
      errorEl.classList.remove('hidden');
      return;
    }

    const sessionId = code.toLowerCase();
    const session = await Database.getSession(sessionId);

    if (!session) {
      errorEl.textContent = 'Session nicht gefunden. Prüfe den Code.';
      errorEl.classList.remove('hidden');
      return;
    }

    errorEl.classList.add('hidden');

    document.getElementById('consent-modal').classList.remove('hidden');
    state._pendingJoin = { sessionId, code, session };
  }

  async function acceptConsent() {
    document.getElementById('consent-modal').classList.add('hidden');

    const { sessionId, session } = state._pendingJoin;
    state.role = 'player';
    state.sessionId = sessionId;
    state.sessionCode = session.code;
    state.gameMode = session.gameMode;
    state.anonymityMode = session.anonymityMode || false;
    state.disorderFocus = session.disorderFocus || 'mixed';

    const players = await Database.getPlayers(sessionId);
    const avatarIndex = players.length;
    const avatar = getAssignedAvatar(avatarIndex);

    state.playerAvatar = avatar;
    const playerId = await Database.addPlayer(sessionId, {
      name: avatar.name,
      emoji: avatar.emoji,
      joinedAt: Date.now(),
      score: 0,
      badges: []
    });
    state.playerId = playerId;

    document.getElementById('my-avatar-display').textContent = avatar.emoji;
    document.getElementById('my-avatar-name').textContent = avatar.name;

    showScreen('screen-player-lobby');
    listenForLobbyUpdates();
    showToast(`Willkommen, ${avatar.name}!`, 'success');
  }

  function declineConsent() {
    document.getElementById('consent-modal').classList.add('hidden');
    showToast('Teilnahme abgelehnt.', 'info');
  }

  function listenForLobbyUpdates() {
    const unsub1 = Database.onPlayersUpdate(state.sessionId, (players) => {
      state.players = players;
      renderLobbyPlayers(players);
    });
    state.unsubscribers.push(unsub1);

    const unsub2 = Database.onLiveState(state.sessionId, (liveState) => {
      if (!liveState) return;
      if (liveState.status === 'playing' && state.role === 'player') {
        startPlayerGame(liveState);
      }
      if (liveState.status === 'debrief' && state.role === 'player') {
        showScreen('screen-debrief');
        renderDebrief();
      }
      if (liveState.status === 'victory') {
        showVictoryScreen(liveState);
      }
      if (liveState.therapistMessage) {
        showTherapistMessage(liveState.therapistMessage);
      }
    });
    state.unsubscribers.push(unsub2);
  }

  function renderLobbyPlayers(players) {
    const container = document.getElementById('lobby-players');
    container.innerHTML = '';
    players.forEach(p => {
      const div = document.createElement('div');
      div.className = 'player-avatar slide-up';
      div.innerHTML = `
        <span class="emoji">${p.emoji}</span>
        <span class="name">${p.name}</span>
      `;
      container.appendChild(div);
    });
  }

  async function startGame() {
    if (state.role !== 'therapist') return;

    await Database.saveLiveState(state.sessionId, {
      status: 'playing',
      gameMode: state.gameMode,
      questId: state.selectedQuest ? state.selectedQuest.id : null,
      currentPhase: 'active',
      currentRoom: 0,
      currentRound: 0,
      progress: 0,
      bossHP: state.selectedQuest ? (state.selectedQuest.bossHP || 100) : 100,
      actions: [],
      therapistMessage: null,
      timestamp: Date.now()
    });

    startTherapistGameView();
    showToast('Spiel gestartet!', 'success');
  }

  function startTherapistGameView() {
    const mode = state.gameMode;
    if (mode === 'escape-room') {
      showScreen('screen-escape-room');
      EscapeRoom.init(state, true);
    } else if (mode === 'boss-fight') {
      showScreen('screen-boss-fight');
      BossFight.init(state, true);
    } else {
      showScreen('screen-competitive');
      Competitive.init(state, true);
    }
    startGameTimer();
  }

  function startPlayerGame(liveState) {
    const mode = liveState.gameMode;
    state.gameMode = mode;

    if (liveState.questId) {
      const questList = QUESTS[mode];
      if (questList) {
        state.selectedQuest = questList.find(q => q.id === liveState.questId) || questList[0];
      }
    }

    if (mode === 'escape-room') {
      showScreen('screen-escape-room');
      EscapeRoom.init(state, false);
    } else if (mode === 'boss-fight') {
      showScreen('screen-boss-fight');
      BossFight.init(state, false);
    } else {
      showScreen('screen-competitive');
      Competitive.init(state, false);
    }
    startGameTimer();
  }

  function startGameTimer() {
    let seconds = 15 * 60;
    const timerIds = ['escape-timer', 'boss-timer', 'comp-timer'];

    if (state.timerInterval) clearInterval(state.timerInterval);

    state.timerInterval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(state.timerInterval);
        if (state.role === 'therapist') triggerVictory();
        return;
      }
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      const display = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      timerIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = display;
      });
    }, 1000);
  }

  async function triggerVictory(customData) {
    if (state.timerInterval) clearInterval(state.timerInterval);

    const victoryData = {
      status: 'victory',
      gameMode: state.gameMode,
      stats: customData || {
        contributions: state.players.length * 3,
        puzzlesSolved: 4,
        timeElapsed: '15:00'
      },
      badges: ['team-player', 'first-step'],
      timestamp: Date.now()
    };

    if (state.gameMode === 'escape-room') {
      victoryData.badges.push('labyrinth-conqueror');
    } else if (state.gameMode === 'boss-fight') {
      victoryData.badges.push('demon-slayer');
    }

    await Database.saveLiveState(state.sessionId, victoryData);
    showVictoryScreen(victoryData);
  }

  function showVictoryScreen(data) {
    showScreen('screen-victory');
    spawnConfetti();

    const stats = data.stats || {};
    document.getElementById('victory-stat-1').textContent = stats.contributions || 0;
    document.getElementById('victory-stat-2').textContent = stats.puzzlesSolved || 0;
    document.getElementById('victory-stat-3').textContent = stats.timeElapsed || '--:--';

    const modeMessages = {
      'escape-room': { icon: '🏰', title: 'Entkommen!', subtitle: 'Ihr habt das Angst-Labyrinth besiegt!' },
      'boss-fight': { icon: '⚔️', title: 'Besiegt!', subtitle: 'Der innere Dämon ist besiegt!' },
      'empathy-duel': { icon: '💜', title: 'Empathie-Meister!', subtitle: 'Ihr habt echtes Mitgefühl gezeigt!' },
      'skill-race': { icon: '🏆', title: 'Skill-Profis!', subtitle: 'Eure Coping-Skills sind beeindruckend!' },
      'perspective-battle': { icon: '🔮', title: 'Perspektiv-Künstler!', subtitle: 'Ihr habt neue Blickwinkel gefunden!' }
    };

    const msg = modeMessages[state.gameMode] || modeMessages['escape-room'];
    document.getElementById('victory-icon').textContent = msg.icon;
    document.getElementById('victory-title').textContent = msg.title;
    document.getElementById('victory-subtitle').textContent = msg.subtitle;

    const badgeContainer = document.getElementById('victory-badges');
    badgeContainer.innerHTML = '';
    (data.badges || []).forEach(badgeId => {
      const badge = BADGES[badgeId];
      if (badge) {
        const div = document.createElement('div');
        div.className = 'badge-item';
        div.innerHTML = `
          <span class="badge-icon">${badge.icon}</span>
          <span class="badge-name">${badge.name}</span>
        `;
        badgeContainer.appendChild(div);
      }
    });

    if (state.players.length > 0) {
      const mvp = state.players[Math.floor(Math.random() * state.players.length)];
      document.getElementById('victory-mvp').innerHTML = `
        <span class="text-3xl">${mvp.emoji}</span>
        <p class="font-semibold mt-1">${mvp.name}</p>
        <p class="text-sm text-gray-400">Hat heute besonders inspiriert!</p>
      `;
    }
  }

  function spawnConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';
    const colors = ['#a78bfa', '#f87171', '#facc15', '#4ade80', '#60a5fa', '#f472b6'];
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.width = (5 + Math.random() * 10) + 'px';
      piece.style.height = (5 + Math.random() * 10) + 'px';
      container.appendChild(piece);
    }
  }

  function startDebrief() {
    if (state.role === 'therapist') {
      Database.saveLiveState(state.sessionId, {
        status: 'debrief',
        gameMode: state.gameMode,
        debriefIndex: 0,
        timestamp: Date.now()
      });
    }
    showScreen('screen-debrief');
    renderDebrief();
    startDebriefTimer();
  }

  function renderDebrief() {
    const container = document.getElementById('debrief-questions');
    container.innerHTML = '';

    const disorder = state.disorderFocus || 'mixed';
    const questions = [
      ...(DEBRIEF_QUESTIONS[disorder] || []),
      ...DEBRIEF_QUESTIONS.general
    ].slice(0, 5);

    const question = questions[state.debriefIndex % questions.length];
    const div = document.createElement('div');
    div.className = 'debrief-question';
    div.innerHTML = `
      <p class="question-text">${question}</p>
      ${state.anonymityMode ? '' : `
        <textarea placeholder="Deine Antwort (anonym)..." id="debrief-answer-input"></textarea>
        <button class="submit-answer" onclick="App.submitDebriefAnswer()">Antwort teilen</button>
      `}
    `;
    container.appendChild(div);

    if (state.anonymityMode) {
      document.getElementById('sticker-area').classList.remove('hidden');
    }

    if (state.role === 'therapist') {
      document.getElementById('debrief-therapist-controls').classList.remove('hidden');
    }
  }

  function startDebriefTimer() {
    let seconds = 3 * 60;
    const timerEl = document.getElementById('debrief-timer');

    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(state.timerInterval);
        timerEl.textContent = '00:00';
        return;
      }
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }, 1000);
  }

  async function submitDebriefAnswer() {
    const input = document.getElementById('debrief-answer-input');
    if (!input || !input.value.trim()) return;

    const answer = input.value.trim();
    input.value = '';

    await Database.submitAction(state.sessionId, {
      type: 'debrief-answer',
      playerId: state.playerId,
      playerName: state.playerAvatar ? state.playerAvatar.name : 'Anonym',
      playerEmoji: state.playerAvatar ? state.playerAvatar.emoji : '🎭',
      answer,
      timestamp: Date.now()
    });

    const answersContainer = document.getElementById('debrief-answers');
    const div = document.createElement('div');
    div.className = 'contribution-item';
    div.innerHTML = `
      <span class="contrib-avatar">${state.playerAvatar ? state.playerAvatar.emoji : '🎭'}</span>
      <span class="text-gray-300">${escapeHTML(answer)}</span>
    `;
    answersContainer.appendChild(div);
    answersContainer.scrollTop = answersContainer.scrollHeight;

    showToast('Antwort geteilt!', 'success');
  }

  function nextDebriefQuestion() {
    state.debriefIndex++;
    renderDebrief();
    document.getElementById('debrief-answers').innerHTML = '';
  }

  async function sendSticker(emoji) {
    await Database.submitAction(state.sessionId, {
      type: 'sticker',
      playerId: state.playerId,
      emoji,
      timestamp: Date.now()
    });

    const feed = document.getElementById('sticker-feed');
    const span = document.createElement('span');
    span.className = 'sticker-float';
    span.textContent = emoji;
    feed.appendChild(span);
    setTimeout(() => span.remove(), 2000);
  }

  async function sendTherapistMessage() {
    const input = document.getElementById('therapist-message');
    const message = input.value.trim();
    if (!message) return;
    input.value = '';

    await Database.saveLiveState(state.sessionId, {
      therapistMessage: { text: message, timestamp: Date.now() }
    });

    const chat = document.getElementById('therapist-chat');
    chat.innerHTML += `<p class="text-purple-300">🩺 ${escapeHTML(message)}</p>`;
    chat.scrollTop = chat.scrollHeight;
  }

  function showTherapistMessage(msg) {
    if (!msg || !msg.text) return;
    const bannerIds = ['escape-therapist-msg', 'boss-therapist-msg', 'comp-therapist-msg'];
    const textIds = ['escape-therapist-msg-text', 'boss-therapist-msg-text', 'comp-therapist-msg-text'];

    bannerIds.forEach((id, i) => {
      const el = document.getElementById(id);
      const textEl = document.getElementById(textIds[i]);
      if (el && textEl) {
        el.classList.remove('hidden');
        textEl.textContent = msg.text;
      }
    });
  }

  async function saveTherapistNote() {
    const note = document.getElementById('therapist-note').value.trim();
    if (!note) return;

    await Database.submitAction(state.sessionId, {
      type: 'therapist-note',
      note,
      timestamp: Date.now()
    });

    document.getElementById('therapist-note').value = '';
    showToast('Notiz gespeichert', 'success');
  }

  async function endSession() {
    if (confirm('Session wirklich beenden? Alle Daten werden gelöscht.')) {
      if (state.timerInterval) clearInterval(state.timerInterval);
      state.unsubscribers.forEach(unsub => { if (typeof unsub === 'function') unsub(); });
      await Database.deleteSession(state.sessionId);
      state = { role: null, sessionId: null, players: [], unsubscribers: [] };
      showScreen('screen-landing');
      showToast('Session beendet', 'info');
    }
  }

  function endDebrief() {
    if (state.role === 'therapist') {
      showScreen('screen-therapist-dashboard');
    } else {
      showScreen('screen-landing');
    }
    if (state.timerInterval) clearInterval(state.timerInterval);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function checkURLJoin() {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      document.getElementById('join-code').value = joinCode;
      showScreen('screen-player-join');
    }
  }

  function getState() {
    return state;
  }

  document.addEventListener('DOMContentLoaded', checkURLJoin);

  return {
    showScreen,
    selectGameMode,
    createSession,
    joinSession,
    acceptConsent,
    declineConsent,
    startGame,
    triggerVictory,
    startDebrief,
    submitDebriefAnswer,
    nextDebriefQuestion,
    sendSticker,
    sendTherapistMessage,
    saveTherapistNote,
    endSession,
    endDebrief,
    showToast,
    getState,
    escapeHTML
  };
})();
