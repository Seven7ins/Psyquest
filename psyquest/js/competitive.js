/* ============================================
   PsyQuest – Competitive Game Modes
   Empathy Duel, Skill Race, Perspective Battle
   ============================================ */

const Competitive = (() => {
  let gameState = {
    appState: null,
    isTherapist: false,
    mode: null,
    currentRound: 0,
    totalRounds: 5,
    scores: {},
    responses: [],
    votes: {},
    hasVoted: false,
    hasResponded: false,
    roundTimer: null,
    totalContributions: 0
  };

  function init(appState, isTherapist) {
    gameState.appState = appState;
    gameState.isTherapist = isTherapist;
    gameState.mode = appState.gameMode;
    gameState.currentRound = 0;
    gameState.scores = {};
    gameState.responses = [];
    gameState.votes = {};
    gameState.hasVoted = false;
    gameState.hasResponded = false;
    gameState.totalContributions = 0;

    appState.players.forEach(p => {
      gameState.scores[p.id] = 0;
    });

    const modeConfig = {
      'empathy-duel': { icon: '💬', title: 'Empathie-Duell', rounds: COMPETITIVE_SCENARIOS['empathy-duel'].length },
      'skill-race': { icon: '🏃', title: 'Skill Race', rounds: COMPETITIVE_SCENARIOS['skill-race'].length },
      'perspective-battle': { icon: '🔮', title: 'Perspektiv-Battle', rounds: COMPETITIVE_SCENARIOS['perspective-battle'].length }
    };

    const config = modeConfig[gameState.mode] || modeConfig['empathy-duel'];
    gameState.totalRounds = config.rounds;

    document.getElementById('comp-mode-icon').textContent = config.icon;
    document.getElementById('comp-mode-title').textContent = config.title;

    renderScoreboard();
    renderRound();
    listenForActions();
  }

  function renderScoreboard() {
    const container = document.getElementById('comp-scores');
    container.innerHTML = '';

    const players = gameState.appState.players;
    players.forEach(p => {
      const score = gameState.scores[p.id] || 0;
      const div = document.createElement('div');
      div.className = 'player-avatar';
      div.innerHTML = `
        <span class="emoji">${p.emoji}</span>
        <span class="name">${p.name}</span>
        <span class="text-yellow-400 font-bold text-sm">${score} Pkt</span>
      `;
      container.appendChild(div);
    });
  }

  function renderRound() {
    document.getElementById('comp-round-display').textContent =
      `Runde ${gameState.currentRound + 1} von ${gameState.totalRounds}`;

    gameState.responses = [];
    gameState.votes = {};
    gameState.hasVoted = false;
    gameState.hasResponded = false;

    document.getElementById('comp-voting-area').classList.add('hidden');
    document.getElementById('comp-results-area').classList.add('hidden');

    switch (gameState.mode) {
      case 'empathy-duel':
        renderEmpathyDuel();
        break;
      case 'skill-race':
        renderSkillRace();
        break;
      case 'perspective-battle':
        renderPerspectiveBattle();
        break;
    }

    startRoundTimer();
  }

  function startRoundTimer() {
    let seconds = 120;
    const timerEl = document.getElementById('comp-timer');

    if (gameState.roundTimer) clearInterval(gameState.roundTimer);

    gameState.roundTimer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(gameState.roundTimer);
        endRound();
        return;
      }
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      timerEl.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }, 1000);
  }

  /* ============================================
     EMPATHY DUEL
     Two players/teams describe an empathic response.
     Group votes on most helpful/empathic.
     ============================================ */
  function renderEmpathyDuel() {
    const scenarios = COMPETITIVE_SCENARIOS['empathy-duel'];
    const scenario = scenarios[gameState.currentRound % scenarios.length];

    document.getElementById('comp-scenario-text').textContent = scenario.scenario;

    const area = document.getElementById('comp-action-area');
    area.innerHTML = `
      <h4 class="text-sm font-semibold text-yellow-400 mb-3">
        Wie würdest du empathisch reagieren?
      </h4>
      <p class="text-xs text-gray-500 mb-3">Kontext: ${scenario.context}</p>
      <div class="flex gap-2">
        <textarea id="empathy-response" class="input-field flex-1" rows="3"
                  placeholder="Deine empathische Antwort..." maxlength="500"></textarea>
      </div>
      <button onclick="Competitive.submitEmpathyResponse()" class="btn-primary w-full mt-3" id="btn-empathy-submit">
        💜 Antwort einreichen
      </button>
      <p class="text-xs text-gray-500 mt-2 italic">
        Tipp: Zeige Verständnis, bestätige Gefühle, und biete Unterstützung an.
      </p>
    `;
  }

  function submitEmpathyResponse() {
    const textarea = document.getElementById('empathy-response');
    if (!textarea || !textarea.value.trim()) return;
    if (gameState.hasResponded) return;

    const text = textarea.value.trim();
    gameState.hasResponded = true;

    const avatar = gameState.appState.playerAvatar || { emoji: '🎭', name: 'Anonym' };
    gameState.responses.push({
      playerId: gameState.appState.playerId,
      playerName: avatar.name,
      playerEmoji: avatar.emoji,
      text
    });

    document.getElementById('btn-empathy-submit').disabled = true;
    document.getElementById('btn-empathy-submit').textContent = '✅ Eingereicht!';
    textarea.disabled = true;

    submitCompAction('empathy-response', { text });
    gameState.totalContributions++;

    App.showToast('Antwort eingereicht! Warte auf die Gruppe...', 'success');

    setTimeout(() => showVotingPhase(), 5000);
  }

  function showVotingPhase() {
    document.getElementById('comp-action-area').innerHTML = `
      <div class="text-center py-4">
        <p class="text-purple-400 font-semibold">✨ Abstimmungsphase!</p>
        <p class="text-gray-400 text-sm">Wähle die empathischste Antwort</p>
      </div>
    `;

    const votingArea = document.getElementById('comp-voting-area');
    votingArea.classList.remove('hidden');
    const voteOptions = document.getElementById('comp-vote-options');
    voteOptions.innerHTML = '';

    if (gameState.responses.length === 0) {
      const avatar = gameState.appState.playerAvatar || { emoji: '🎭', name: 'Du' };
      gameState.responses.push({
        playerId: 'self',
        playerName: avatar.name,
        playerEmoji: avatar.emoji,
        text: 'Antwort wird geladen...'
      });
    }

    gameState.responses.forEach((resp, i) => {
      if (resp.playerId === gameState.appState.playerId) return;

      const card = document.createElement('button');
      card.className = 'vote-card';
      card.onclick = () => castVote(i);
      card.innerHTML = `
        <div class="flex items-start gap-2">
          <span class="text-xl">${resp.playerEmoji}</span>
          <div>
            <p class="text-xs text-gray-500">${resp.playerName}</p>
            <p class="text-gray-200 text-sm mt-1">${App.escapeHTML(resp.text)}</p>
          </div>
        </div>
      `;
      voteOptions.appendChild(card);
    });

    if (voteOptions.children.length === 0) {
      voteOptions.innerHTML = `
        <p class="text-gray-500 text-center py-4">
          Warte auf Antworten der anderen Spieler...
        </p>
        <button onclick="Competitive.skipToResults()" class="btn-secondary w-full mt-2">
          Ergebnisse anzeigen
        </button>
      `;
    }
  }

  function castVote(responseIndex) {
    if (gameState.hasVoted) return;
    gameState.hasVoted = true;

    document.querySelectorAll('.vote-card').forEach(c => c.classList.remove('voted'));
    document.querySelectorAll('.vote-card')[responseIndex]?.classList.add('voted');

    const voted = gameState.responses[responseIndex];
    if (voted) {
      gameState.scores[voted.playerId] = (gameState.scores[voted.playerId] || 0) + 3;
    }

    submitCompAction('vote', { votedFor: responseIndex });
    App.showToast('Stimme abgegeben!', 'success');

    setTimeout(() => showRoundResults(), 3000);
  }

  /* ============================================
     SKILL RACE
     Quickest correct coping strategy selection.
     ============================================ */
  function renderSkillRace() {
    const scenarios = COMPETITIVE_SCENARIOS['skill-race'];
    const scenario = scenarios[gameState.currentRound % scenarios.length];

    document.getElementById('comp-scenario-text').textContent = scenario.scenario;

    const area = document.getElementById('comp-action-area');
    area.innerHTML = `
      <h4 class="text-sm font-semibold text-yellow-400 mb-3">
        Wähle die beste Coping-Strategie (schnell!):
      </h4>
      <div class="space-y-2 mb-4">
        ${scenario.options.map((opt, i) => `
          <button class="puzzle-option" onclick="Competitive.selectSkill(${i})" data-skill="${i}">
            ${opt.text}
            <span class="text-xs text-gray-500 ml-2">(${opt.points} Pkt)</span>
          </button>
        `).join('')}
      </div>
      <div class="border-t border-gray-700 pt-3">
        <p class="text-xs text-gray-500 mb-2">${scenario.openPrompt}</p>
        <div class="flex gap-2">
          <input type="text" id="skill-open-input" class="input-field flex-1" 
                 placeholder="Eigene Strategie..." maxlength="200">
          <button onclick="Competitive.submitOpenSkill()" class="btn-secondary px-4">+3 Pkt</button>
        </div>
      </div>
    `;
  }

  function selectSkill(index) {
    if (gameState.hasResponded) return;
    gameState.hasResponded = true;

    const scenarios = COMPETITIVE_SCENARIOS['skill-race'];
    const scenario = scenarios[gameState.currentRound % scenarios.length];
    const option = scenario.options[index];

    document.querySelectorAll('.puzzle-option').forEach(b => b.disabled = true);
    const btn = document.querySelector(`[data-skill="${index}"]`);

    if (option.points > 0) {
      btn.classList.add('correct');
      gameState.scores[gameState.appState.playerId] =
        (gameState.scores[gameState.appState.playerId] || 0) + option.points;
      App.showToast(`+${option.points} Punkte!`, 'success');
    } else {
      btn.classList.add('incorrect');
      App.showToast('Nicht die beste Wahl – reflektiert gemeinsam!', 'info');
    }

    submitCompAction('skill-choice', { optionIndex: index, points: option.points });
    gameState.totalContributions++;
    renderScoreboard();

    setTimeout(() => showRoundResults(), 3000);
  }

  function submitOpenSkill() {
    const input = document.getElementById('skill-open-input');
    if (!input || !input.value.trim() || gameState.hasResponded) return;

    const text = input.value.trim();
    gameState.hasResponded = true;
    input.disabled = true;

    gameState.scores[gameState.appState.playerId] =
      (gameState.scores[gameState.appState.playerId] || 0) + 3;

    App.showToast(`+3 Punkte für kreative Strategie!`, 'success');

    submitCompAction('skill-open', { text, points: 3 });
    gameState.totalContributions++;
    renderScoreboard();

    setTimeout(() => showRoundResults(), 3000);
  }

  /* ============================================
     PERSPECTIVE BATTLE
     Describe situation from "future strong self".
     Points for creativity and positivity.
     ============================================ */
  function renderPerspectiveBattle() {
    const scenarios = COMPETITIVE_SCENARIOS['perspective-battle'];
    const scenario = scenarios[gameState.currentRound % scenarios.length];

    document.getElementById('comp-scenario-text').textContent = scenario.scenario;

    const area = document.getElementById('comp-action-area');
    area.innerHTML = `
      <h4 class="text-sm font-semibold text-purple-400 mb-3">${scenario.prompt}</h4>
      <p class="text-xs text-gray-500 mb-3">Bewertet wird: ${scenario.criteria}</p>
      <textarea id="perspective-response" class="input-field w-full" rows="4"
                placeholder="Aus der Perspektive deines starken Ichs..." maxlength="600"></textarea>
      <button onclick="Competitive.submitPerspective()" class="btn-primary w-full mt-3" id="btn-perspective-submit">
        🔮 Perspektive teilen
      </button>
      <p class="text-xs text-gray-500 mt-2 italic">
        Tipp: Sei kreativ! Stell dir vor, wie dein weisestes, stärkstes Ich spricht.
      </p>
    `;
  }

  function submitPerspective() {
    const textarea = document.getElementById('perspective-response');
    if (!textarea || !textarea.value.trim()) return;
    if (gameState.hasResponded) return;

    const text = textarea.value.trim();
    gameState.hasResponded = true;

    const avatar = gameState.appState.playerAvatar || { emoji: '🎭', name: 'Anonym' };
    gameState.responses.push({
      playerId: gameState.appState.playerId,
      playerName: avatar.name,
      playerEmoji: avatar.emoji,
      text
    });

    document.getElementById('btn-perspective-submit').disabled = true;
    document.getElementById('btn-perspective-submit').textContent = '✅ Geteilt!';
    textarea.disabled = true;

    gameState.scores[gameState.appState.playerId] =
      (gameState.scores[gameState.appState.playerId] || 0) + 2;

    submitCompAction('perspective', { text });
    gameState.totalContributions++;

    App.showToast('+2 Punkte für Teilnahme! Warte auf Abstimmung...', 'success');

    setTimeout(() => showVotingPhase(), 5000);
  }

  /* ============================================
     SHARED FUNCTIONS
     ============================================ */

  function showRoundResults() {
    const resultsArea = document.getElementById('comp-results-area');
    resultsArea.classList.remove('hidden');
    resultsArea.innerHTML = '';

    const sortedPlayers = [...gameState.appState.players]
      .sort((a, b) => (gameState.scores[b.id] || 0) - (gameState.scores[a.id] || 0));

    resultsArea.innerHTML = `
      <h4 class="text-sm font-semibold text-yellow-400 mb-3">Zwischenstand</h4>
      <div class="space-y-2">
        ${sortedPlayers.map((p, i) => {
          const score = gameState.scores[p.id] || 0;
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '▪️';
          return `
            <div class="flex items-center justify-between p-2 rounded-lg bg-gray-800 bg-opacity-50">
              <div class="flex items-center gap-2">
                <span>${medal}</span>
                <span>${p.emoji}</span>
                <span class="text-sm">${p.name}</span>
              </div>
              <span class="font-bold text-yellow-400">${score} Pkt</span>
            </div>
          `;
        }).join('')}
      </div>
      <button onclick="Competitive.nextRound()" class="btn-primary w-full mt-4">
        ${gameState.currentRound + 1 >= gameState.totalRounds ? '🏆 Endergebnis' : '➡️ Nächste Runde'}
      </button>
    `;

    renderScoreboard();
  }

  function skipToResults() {
    showRoundResults();
  }

  function nextRound() {
    if (gameState.roundTimer) clearInterval(gameState.roundTimer);

    gameState.currentRound++;
    if (gameState.currentRound >= gameState.totalRounds) {
      endCompetition();
    } else {
      renderRound();
    }
  }

  function endRound() {
    if (!gameState.hasResponded) {
      App.showToast('Zeit abgelaufen!', 'info');
    }
    showRoundResults();
  }

  function endCompetition() {
    if (gameState.roundTimer) clearInterval(gameState.roundTimer);

    const sortedPlayers = [...gameState.appState.players]
      .sort((a, b) => (gameState.scores[b.id] || 0) - (gameState.scores[a.id] || 0));

    const winner = sortedPlayers[0];

    if (gameState.isTherapist || gameState.appState.role === 'therapist') {
      App.triggerVictory({
        contributions: gameState.totalContributions,
        puzzlesSolved: gameState.totalRounds,
        timeElapsed: document.getElementById('comp-timer')?.textContent || '--:--'
      });
    } else {
      App.showToast(`🏆 ${winner?.name || 'Team'} gewinnt!`, 'success');
      showRoundResults();
    }
  }

  async function submitCompAction(type, data) {
    const state = gameState.appState;
    if (!state.sessionId) return;

    await Database.submitAction(state.sessionId, {
      type: 'competitive',
      subType: type,
      mode: gameState.mode,
      playerId: state.playerId,
      playerName: state.playerAvatar ? state.playerAvatar.name : 'Anonym',
      playerEmoji: state.playerAvatar ? state.playerAvatar.emoji : '🎭',
      round: gameState.currentRound,
      data,
      timestamp: Date.now()
    });
  }

  function listenForActions() {
    const state = gameState.appState;
    if (!state.sessionId) return;

    Database.onActionsUpdate(state.sessionId, (actions) => {
      const compActions = actions
        .filter(a => a.type === 'competitive' && a.playerId !== state.playerId && a.round === gameState.currentRound)
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      compActions.forEach(action => {
        if (!action._shown) {
          action._shown = true;

          if (action.subType === 'empathy-response' || action.subType === 'perspective') {
            const exists = gameState.responses.find(r => r.playerId === action.playerId);
            if (!exists) {
              gameState.responses.push({
                playerId: action.playerId,
                playerName: action.playerName,
                playerEmoji: action.playerEmoji,
                text: action.data.text
              });
            }
          }

          if (action.subType === 'skill-choice') {
            gameState.scores[action.playerId] =
              (gameState.scores[action.playerId] || 0) + (action.data.points || 0);
            renderScoreboard();
          }

          if (action.subType === 'vote') {
            const voted = gameState.responses[action.data.votedFor];
            if (voted) {
              gameState.scores[voted.playerId] =
                (gameState.scores[voted.playerId] || 0) + 3;
              renderScoreboard();
            }
          }
        }
      });
    });
  }

  return {
    init,
    submitEmpathyResponse,
    selectSkill,
    submitOpenSkill,
    submitPerspective,
    nextRound,
    skipToResults,
    getState: () => gameState
  };
})();
