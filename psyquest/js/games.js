/* ============================================
   PsyQuest – Cooperative Game Engines
   Escape Room & Boss Fight
   ============================================ */

/* ============================================
   ESCAPE ROOM: "Flucht aus dem Angst-Labyrinth"
   ============================================
   4-6 rooms, each with a therapeutic puzzle.
   Types: matching, group-input, choice-path,
   group-collect, reframe
   ============================================ */
const EscapeRoom = (() => {
  let gameState = {
    appState: null,
    isTherapist: false,
    quest: null,
    currentRoom: 0,
    progress: 0,
    contributions: [],
    selectedPairs: {},
    matchingState: { selected: null, matched: [] },
    totalContributions: 0
  };

  function init(appState, isTherapist) {
    gameState.appState = appState;
    gameState.isTherapist = isTherapist;
    gameState.currentRoom = 0;
    gameState.progress = 0;
    gameState.contributions = [];
    gameState.totalContributions = 0;

    const quest = appState.selectedQuest || QUESTS['escape-room'][0];
    gameState.quest = quest;

    renderRoom();
    listenForActions();
  }

  function renderRoom() {
    const quest = gameState.quest;
    const room = quest.rooms[gameState.currentRoom];
    if (!room) {
      completeEscapeRoom();
      return;
    }

    const totalRooms = quest.rooms.length;
    document.getElementById('escape-room-name').textContent =
      `Raum ${gameState.currentRoom + 1} von ${totalRooms}`;

    document.getElementById('room-monster').textContent = room.monster;
    document.getElementById('room-title').textContent = `${room.monsterName} blockiert den Weg!`;
    document.getElementById('room-description').textContent = room.description;

    updateProgress();
    renderPuzzle(room);
  }

  function renderPuzzle(room) {
    const area = document.getElementById('escape-puzzle-area');
    area.innerHTML = '';

    switch (room.type) {
      case 'matching':
        renderMatchingPuzzle(area, room);
        break;
      case 'group-input':
        renderGroupInputPuzzle(area, room);
        break;
      case 'choice-path':
        renderChoicePathPuzzle(area, room);
        break;
      case 'group-collect':
        renderGroupCollectPuzzle(area, room);
        break;
      case 'reframe':
        renderReframePuzzle(area, room);
        break;
      default:
        area.innerHTML = '<p class="text-gray-400">Unbekannter Rätseltyp</p>';
    }
  }

  /* --- Matching Puzzle --- */
  function renderMatchingPuzzle(container, room) {
    gameState.matchingState = { selected: null, matched: [], pairs: room.pairs };

    const shuffledSymptoms = [...room.pairs].sort(() => Math.random() - 0.5);
    const shuffledStrategies = [...room.pairs].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <h4 class="text-sm font-semibold text-purple-400 mb-3">Ordne Symptome den Strategien zu:</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500 mb-2">Symptome</p>
          <div class="space-y-2" id="matching-symptoms">
            ${shuffledSymptoms.map((p, i) => `
              <button class="match-card w-full text-left" data-type="symptom" data-idx="${room.pairs.indexOf(p)}"
                onclick="EscapeRoom.selectMatch('symptom', ${room.pairs.indexOf(p)}, this)">
                ${p.symptom}
              </button>
            `).join('')}
          </div>
        </div>
        <div>
          <p class="text-xs text-gray-500 mb-2">Strategien</p>
          <div class="space-y-2" id="matching-strategies">
            ${shuffledStrategies.map((p, i) => `
              <button class="match-card w-full text-left" data-type="strategy" data-idx="${room.pairs.indexOf(p)}"
                onclick="EscapeRoom.selectMatch('strategy', ${room.pairs.indexOf(p)}, this)">
                ${p.strategy}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-3 italic">💡 ${room.hint}</p>
    `;
  }

  function selectMatch(type, idx, element) {
    const ms = gameState.matchingState;
    if (ms.matched.includes(idx)) return;

    if (!ms.selected) {
      ms.selected = { type, idx };
      element.classList.add('highlight');
    } else {
      if (ms.selected.type === type) {
        document.querySelectorAll('.match-card.highlight').forEach(c => c.classList.remove('highlight'));
        ms.selected = { type, idx };
        element.classList.add('highlight');
        return;
      }

      const pair1 = ms.selected.idx;
      const pair2 = idx;

      if (pair1 === pair2) {
        ms.matched.push(pair1);
        document.querySelectorAll(`.match-card[data-idx="${pair1}"]`).forEach(c => {
          c.classList.remove('highlight');
          c.classList.add('matched');
        });
        addContribution(`✅ Richtig zugeordnet!`);
        submitGameAction('match', { pairIndex: pair1 });

        if (ms.matched.length === ms.pairs.length) {
          setTimeout(() => advanceRoom(), 1500);
        }
      } else {
        document.querySelectorAll('.match-card.highlight').forEach(c => c.classList.remove('highlight'));
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 800);
        addContribution('❌ Nicht ganz – probiert es nochmal!');
      }

      ms.selected = null;
    }
  }

  /* --- Group Input Puzzle --- */
  function renderGroupInputPuzzle(container, room) {
    gameState._inputCount = 0;
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-purple-400 mb-2">${room.prompt}</h4>
      <p class="text-xs text-gray-500 mb-3">Beispiele: ${room.examples.join(' · ')}</p>
      <div class="flex gap-2">
        <input type="text" id="group-input-field" class="input-field flex-1" 
               placeholder="Deine Antwort..." maxlength="200">
        <button onclick="EscapeRoom.submitGroupInput()" class="btn-primary px-4">Senden</button>
      </div>
      <div class="mt-3">
        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Fortschritt</span>
          <span id="group-input-count">0 / ${room.minAnswers} benötigt</span>
        </div>
        <div class="progress-bar-container">
          <div id="group-input-progress" class="progress-bar-fill" style="width: 0%"></div>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-3 italic">💡 ${room.hint}</p>
    `;

    document.getElementById('group-input-field').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') EscapeRoom.submitGroupInput();
    });
  }

  function submitGroupInput() {
    const input = document.getElementById('group-input-field');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    gameState._inputCount++;

    const room = gameState.quest.rooms[gameState.currentRoom];
    const count = document.getElementById('group-input-count');
    const bar = document.getElementById('group-input-progress');
    const pct = Math.min(100, (gameState._inputCount / room.minAnswers) * 100);
    count.textContent = `${gameState._inputCount} / ${room.minAnswers} benötigt`;
    bar.style.width = pct + '%';

    const avatar = gameState.appState.playerAvatar || { emoji: '🎭', name: 'Anonym' };
    addContribution(`${avatar.emoji} ${App.escapeHTML(text)}`);
    submitGameAction('group-input', { text });

    if (gameState._inputCount >= room.minAnswers) {
      setTimeout(() => advanceRoom(), 2000);
    }
  }

  /* --- Choice Path Puzzle --- */
  function renderChoicePathPuzzle(container, room) {
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-purple-400 mb-2">Szenario:</h4>
      <p class="text-gray-300 mb-4">${room.scenario}</p>
      <div class="space-y-2" id="choice-options">
        ${room.paths.map((path, i) => `
          <button class="puzzle-option" onclick="EscapeRoom.selectPath(${i})" data-path="${i}">
            ${path.text}
          </button>
        `).join('')}
      </div>
      <p class="text-xs text-gray-500 mt-3 italic">💡 ${room.hint}</p>
    `;
  }

  function selectPath(index) {
    const room = gameState.quest.rooms[gameState.currentRoom];
    const path = room.paths[index];

    document.querySelectorAll('.puzzle-option').forEach(b => {
      b.classList.remove('selected');
      b.disabled = true;
    });

    const btn = document.querySelector(`[data-path="${index}"]`);
    btn.classList.add(path.effective ? 'correct' : 'incorrect');

    addContribution(`${path.effective ? '✅' : '⚠️'} ${path.feedback}`);
    submitGameAction('choice', { pathIndex: index, effective: path.effective, damage: path.damage });

    if (path.effective) {
      gameState.progress += (path.damage / 100) * (100 / gameState.quest.rooms.length);
      updateProgress();
    }

    setTimeout(() => {
      renderChoicePathPuzzle(document.getElementById('escape-puzzle-area'), room);
    }, 3000);

    const totalEffective = room.paths.filter(p => p.effective).length;
    if (path.effective) {
      gameState._pathsChosen = (gameState._pathsChosen || 0) + 1;
      if (gameState._pathsChosen >= 2) {
        setTimeout(() => advanceRoom(), 3500);
      }
    }
  }

  /* --- Group Collect Puzzle --- */
  function renderGroupCollectPuzzle(container, room) {
    gameState._collectCount = 0;
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-purple-400 mb-2">${room.prompt}</h4>
      <p class="text-xs text-gray-500 mb-3">Beispiele: ${room.examples.join(' · ')}</p>
      <div class="flex gap-2">
        <input type="text" id="collect-input" class="input-field flex-1" 
               placeholder="Dein Beitrag..." maxlength="200">
        <button onclick="EscapeRoom.submitCollect()" class="btn-primary px-4">+</button>
      </div>
      <div class="mt-3">
        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Gesammelt</span>
          <span id="collect-count">0 / ${room.targetCount}</span>
        </div>
        <div class="progress-bar-container">
          <div id="collect-progress" class="progress-bar-fill" style="width: 0%"></div>
        </div>
      </div>
      <div id="collect-items" class="flex flex-wrap gap-2 mt-3"></div>
      <p class="text-xs text-gray-500 mt-3 italic">💡 ${room.hint}</p>
    `;

    document.getElementById('collect-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') EscapeRoom.submitCollect();
    });
  }

  function submitCollect() {
    const input = document.getElementById('collect-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    gameState._collectCount++;

    const room = gameState.quest.rooms[gameState.currentRoom];
    document.getElementById('collect-count').textContent =
      `${gameState._collectCount} / ${room.targetCount}`;
    document.getElementById('collect-progress').style.width =
      Math.min(100, (gameState._collectCount / room.targetCount) * 100) + '%';

    const items = document.getElementById('collect-items');
    const chip = document.createElement('span');
    chip.className = 'match-card matched slide-up';
    chip.textContent = `✨ ${text}`;
    items.appendChild(chip);

    addContribution(`✨ ${App.escapeHTML(text)}`);
    submitGameAction('collect', { text });

    if (gameState._collectCount >= room.targetCount) {
      setTimeout(() => advanceRoom(), 2000);
    }
  }

  /* --- Reframe Puzzle --- */
  function renderReframePuzzle(container, room) {
    gameState._reframeIndex = 0;
    gameState._reframeCount = 0;
    renderSingleReframe(container, room);
  }

  function renderSingleReframe(container, room) {
    const thought = room.thoughts[gameState._reframeIndex];
    if (!thought) {
      advanceRoom();
      return;
    }

    container.innerHTML = `
      <h4 class="text-sm font-semibold text-red-400 mb-2">Der ${room.monsterName || 'Inner Critic'} sagt:</h4>
      <div class="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-3 mb-4">
        <p class="text-red-300 italic">"${thought.negative}"</p>
      </div>
      <div class="mb-3">
        <p class="text-xs text-gray-500 mb-1">Hinweise:</p>
        ${thought.hints.map(h => `<p class="text-xs text-yellow-400">💡 ${h}</p>`).join('')}
      </div>
      <h4 class="text-sm font-semibold text-green-400 mb-2">Formuliere um – freundlich und realistisch:</h4>
      <div class="flex gap-2">
        <input type="text" id="reframe-input" class="input-field flex-1" 
               placeholder="Hilfreicher Gedanke..." maxlength="300">
        <button onclick="EscapeRoom.submitReframe()" class="btn-primary px-4">💪</button>
      </div>
      <div class="mt-2 text-xs text-gray-500">
        <p>Beispiele: ${thought.examples.join(' · ')}</p>
      </div>
      <p class="text-xs text-gray-500 mt-3 italic">💡 ${room.hint}</p>
    `;

    document.getElementById('reframe-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') EscapeRoom.submitReframe();
    });
  }

  function submitReframe() {
    const input = document.getElementById('reframe-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    gameState._reframeCount++;

    addContribution(`🧠 Umformuliert: "${App.escapeHTML(text)}"`);
    submitGameAction('reframe', { text });

    const room = gameState.quest.rooms[gameState.currentRoom];
    if (gameState._reframeCount >= 2) {
      gameState._reframeIndex++;
      if (gameState._reframeIndex < room.thoughts.length) {
        gameState._reframeCount = 0;
        setTimeout(() => {
          renderSingleReframe(document.getElementById('escape-puzzle-area'), room);
        }, 1500);
      } else {
        setTimeout(() => advanceRoom(), 2000);
      }
    }
  }

  /* --- Room Advancement --- */
  function advanceRoom() {
    gameState.currentRoom++;
    gameState._pathsChosen = 0;
    gameState._inputCount = 0;
    gameState._collectCount = 0;
    gameState._reframeIndex = 0;
    gameState._reframeCount = 0;

    const totalRooms = gameState.quest.rooms.length;
    gameState.progress = Math.min(100, (gameState.currentRoom / totalRooms) * 100);
    updateProgress();

    if (gameState.currentRoom >= totalRooms) {
      completeEscapeRoom();
    } else {
      App.showToast(`Raum ${gameState.currentRoom} geschafft! Weiter geht's!`, 'success');
      renderRoom();
    }
  }

  function updateProgress() {
    const bar = document.getElementById('escape-progress-bar');
    const text = document.getElementById('escape-progress-text');
    if (bar) bar.style.width = Math.round(gameState.progress) + '%';
    if (text) text.textContent = Math.round(gameState.progress) + '%';
  }

  function completeEscapeRoom() {
    gameState.progress = 100;
    updateProgress();
    App.showToast('🏰 Escape Room geschafft!', 'success');

    if (gameState.isTherapist || gameState.appState.role === 'therapist') {
      App.triggerVictory({
        contributions: gameState.totalContributions,
        puzzlesSolved: gameState.quest.rooms.length,
        timeElapsed: document.getElementById('escape-timer')?.textContent || '--:--'
      });
    }
  }

  function addContribution(text) {
    gameState.totalContributions++;
    const container = document.getElementById('escape-contributions');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'contribution-item slide-up';
    div.innerHTML = `<span class="text-gray-300 text-sm">${text}</span>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  async function submitGameAction(type, data) {
    const state = gameState.appState;
    if (!state.sessionId) return;

    await Database.submitAction(state.sessionId, {
      type: 'escape-room',
      subType: type,
      playerId: state.playerId,
      playerName: state.playerAvatar ? state.playerAvatar.name : 'Anonym',
      playerEmoji: state.playerAvatar ? state.playerAvatar.emoji : '🎭',
      room: gameState.currentRoom,
      data,
      timestamp: Date.now()
    });
  }

  function listenForActions() {
    const state = gameState.appState;
    if (!state.sessionId) return;

    Database.onActionsUpdate(state.sessionId, (actions) => {
      const escapeActions = actions
        .filter(a => a.type === 'escape-room' && a.playerId !== state.playerId)
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      const latestActions = escapeActions.slice(-3);
      latestActions.forEach(action => {
        if (!action._shown) {
          action._shown = true;
          const emoji = action.playerEmoji || '🎭';
          const name = action.playerName || 'Anonym';
          if (action.subType === 'reframe') {
            addContribution(`${emoji} ${name}: "${App.escapeHTML(action.data.text)}"`);
          } else if (action.subType === 'collect' || action.subType === 'group-input') {
            addContribution(`${emoji} ${name}: ${App.escapeHTML(action.data.text)}`);
          }
        }
      });
    });
  }

  return {
    init,
    selectMatch,
    submitGroupInput,
    selectPath,
    submitCollect,
    submitReframe,
    getState: () => gameState
  };
})();


/* ============================================
   BOSS FIGHT: "Kampf gegen innere Dämonen"
   ============================================
   Boss with HP bar, 3-5 rounds of attacks.
   Types: multi-choice, reframe, group-input,
   affirmation-collect, group-collect
   ============================================ */
const BossFight = (() => {
  let gameState = {
    appState: null,
    isTherapist: false,
    quest: null,
    currentRound: 0,
    bossHP: 100,
    teamDamage: 0,
    comboStreak: 0,
    contributions: [],
    totalContributions: 0,
    roundInputCount: 0
  };

  function init(appState, isTherapist) {
    gameState.appState = appState;
    gameState.isTherapist = isTherapist;
    gameState.currentRound = 0;
    gameState.teamDamage = 0;
    gameState.comboStreak = 0;
    gameState.totalContributions = 0;
    gameState.roundInputCount = 0;

    const quest = appState.selectedQuest || QUESTS['boss-fight'][0];
    gameState.quest = quest;
    gameState.bossHP = quest.bossHP || 100;

    renderBoss();
    renderRound();
    listenForActions();
  }

  function renderBoss() {
    const quest = gameState.quest;
    document.getElementById('boss-name').textContent = quest.name;
    document.getElementById('boss-sprite').textContent = quest.bossEmoji;
    document.getElementById('boss-display-name').textContent = `${quest.bossEmoji} ${quest.name}`;
    updateBossHP();
  }

  function updateBossHP() {
    const bar = document.getElementById('boss-hp-bar');
    const text = document.getElementById('boss-hp-text');
    const hp = Math.max(0, gameState.bossHP);
    if (bar) bar.style.width = hp + '%';
    if (text) text.textContent = `${Math.round(hp)} HP`;

    if (hp <= 50) {
      bar.classList.remove('bg-red-500');
      bar.classList.add('bg-yellow-500');
    }
    if (hp <= 25) {
      bar.classList.remove('bg-yellow-500');
      bar.classList.add('bg-green-500');
    }

    document.getElementById('team-damage').textContent = gameState.teamDamage;
    document.getElementById('team-combo').textContent = gameState.comboStreak + 'x';
  }

  function renderRound() {
    const quest = gameState.quest;
    const round = quest.rounds[gameState.currentRound];
    if (!round) {
      completeBossFight();
      return;
    }

    document.getElementById('boss-round-display').textContent =
      `Runde ${gameState.currentRound + 1} von ${quest.rounds.length}`;
    document.getElementById('boss-attack-text').textContent = round.attack;
    document.getElementById('boss-scenario').textContent = round.scenario;

    shakeBoss();
    renderRoundAction(round);
  }

  function shakeBoss() {
    const sprite = document.getElementById('boss-sprite');
    sprite.classList.remove('animate-shake');
    void sprite.offsetWidth;
    sprite.classList.add('animate-shake');
  }

  function renderRoundAction(round) {
    const area = document.getElementById('boss-action-area');
    area.innerHTML = '';
    gameState.roundInputCount = 0;

    switch (round.type) {
      case 'multi-choice':
        renderMultiChoice(area, round);
        break;
      case 'reframe':
        renderBossReframe(area, round);
        break;
      case 'group-input':
        renderBossGroupInput(area, round);
        break;
      case 'affirmation-collect':
        renderAffirmationCollect(area, round);
        break;
      case 'group-collect':
        renderBossGroupCollect(area, round);
        break;
      default:
        area.innerHTML = '<p class="text-gray-400">Aktion laden...</p>';
    }
  }

  /* --- Multi Choice Attack --- */
  function renderMultiChoice(container, round) {
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-yellow-400 mb-3">Wähle deine Verteidigung:</h4>
      <div class="space-y-2">
        ${round.options.map((opt, i) => `
          <button class="puzzle-option" onclick="BossFight.selectOption(${i})" data-opt="${i}">
            ${opt.text}
          </button>
        `).join('')}
      </div>
    `;
  }

  function selectOption(index) {
    const round = gameState.quest.rounds[gameState.currentRound];
    const option = round.options[index];

    document.querySelectorAll('.puzzle-option').forEach(b => {
      b.disabled = true;
      b.classList.remove('selected');
    });

    const btn = document.querySelector(`[data-opt="${index}"]`);

    if (option.effective) {
      btn.classList.add('correct');
      dealDamage(option.damage);
      gameState.comboStreak++;
      addBossLog(`⚔️ ${round.feedback_good || 'Starker Treffer!'} (-${option.damage} HP)`);
    } else {
      btn.classList.add('incorrect');
      gameState.comboStreak = 0;
      addBossLog(`🛡️ ${round.feedback_bad || 'Das war nicht effektiv!'}`);
    }

    submitBossAction('choice', { optionIndex: index, effective: option.effective });
    updateBossHP();

    setTimeout(() => nextRound(), 3000);
  }

  /* --- Boss Reframe Attack --- */
  function renderBossReframe(container, round) {
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-red-400 mb-2">Der Boss sagt:</h4>
      <div class="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-3 mb-4">
        <p class="text-red-300 italic">"${round.negative}"</p>
      </div>
      ${round.hints ? `
        <div class="mb-3">
          ${round.hints.map(h => `<p class="text-xs text-yellow-400">💡 ${h}</p>`).join('')}
        </div>
      ` : ''}
      <h4 class="text-sm font-semibold text-green-400 mb-2">Eure Gegenattacke – formuliert um:</h4>
      <div class="flex gap-2">
        <input type="text" id="boss-reframe-input" class="input-field flex-1" 
               placeholder="Hilfreicher Gedanke als Waffe..." maxlength="300">
        <button onclick="BossFight.submitReframe()" class="btn-primary px-4">⚔️</button>
      </div>
      <p class="text-xs text-gray-500 mt-2">${round.feedback || ''}</p>
    `;

    document.getElementById('boss-reframe-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') BossFight.submitReframe();
    });
  }

  function submitReframe() {
    const input = document.getElementById('boss-reframe-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    gameState.roundInputCount++;

    const round = gameState.quest.rounds[gameState.currentRound];
    const damage = round.damage_per_response || 15;
    dealDamage(damage);
    gameState.comboStreak++;

    const avatar = gameState.appState.playerAvatar || { emoji: '🎭' };
    addBossLog(`${avatar.emoji} 🧠 "${App.escapeHTML(text)}" (-${damage} HP)`);
    submitBossAction('reframe', { text });
    updateBossHP();

    if (gameState.roundInputCount >= 3 || gameState.bossHP <= 0) {
      setTimeout(() => nextRound(), 2000);
    }
  }

  /* --- Boss Group Input Attack --- */
  function renderBossGroupInput(container, round) {
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-yellow-400 mb-3">${round.prompt}</h4>
      <div class="flex gap-2">
        <input type="text" id="boss-group-input" class="input-field flex-1" 
               placeholder="Deine Antwort..." maxlength="200">
        <button onclick="BossFight.submitGroupInput()" class="btn-primary px-4">⚔️</button>
      </div>
      <p class="text-xs text-gray-500 mt-2">${round.feedback || ''}</p>
    `;

    document.getElementById('boss-group-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') BossFight.submitGroupInput();
    });
  }

  function submitGroupInput() {
    const input = document.getElementById('boss-group-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    gameState.roundInputCount++;

    const round = gameState.quest.rounds[gameState.currentRound];
    const damage = round.damage_per_response || 10;
    dealDamage(damage);
    gameState.comboStreak++;

    const avatar = gameState.appState.playerAvatar || { emoji: '🎭' };
    addBossLog(`${avatar.emoji} 💬 ${App.escapeHTML(text)} (-${damage} HP)`);
    submitBossAction('group-input', { text });
    updateBossHP();

    if (gameState.roundInputCount >= 4 || gameState.bossHP <= 0) {
      setTimeout(() => nextRound(), 2000);
    }
  }

  /* --- Affirmation Collect Attack --- */
  function renderAffirmationCollect(container, round) {
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-yellow-400 mb-2">🌟 Finale Waffe: Affirmationen!</h4>
      <p class="text-gray-400 text-sm mb-3">${round.prompt}</p>
      <p class="text-xs text-gray-500 mb-3">Beispiele: ${(round.examples || []).join(' · ')}</p>
      <div class="flex gap-2">
        <input type="text" id="affirmation-input" class="input-field flex-1" 
               placeholder="Eure stärkste Affirmation..." maxlength="200">
        <button onclick="BossFight.submitAffirmation()" class="btn-primary px-4">✨</button>
      </div>
      <div id="affirmation-collection" class="flex flex-wrap gap-2 mt-3"></div>
      <p class="text-xs text-gray-500 mt-2">${round.feedback || ''}</p>
    `;

    document.getElementById('affirmation-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') BossFight.submitAffirmation();
    });
  }

  function submitAffirmation() {
    const input = document.getElementById('affirmation-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    gameState.roundInputCount++;

    const round = gameState.quest.rounds[gameState.currentRound];
    const damage = round.damage_per_response || 12;
    dealDamage(damage);
    gameState.comboStreak++;

    const collection = document.getElementById('affirmation-collection');
    if (collection) {
      const chip = document.createElement('span');
      chip.className = 'match-card matched slide-up';
      chip.textContent = `✨ ${text}`;
      collection.appendChild(chip);
    }

    addBossLog(`✨ "${App.escapeHTML(text)}" (-${damage} HP)`);
    submitBossAction('affirmation', { text });
    updateBossHP();

    if (gameState.roundInputCount >= 5 || gameState.bossHP <= 0) {
      setTimeout(() => nextRound(), 2000);
    }
  }

  /* --- Boss Group Collect --- */
  function renderBossGroupCollect(container, round) {
    container.innerHTML = `
      <h4 class="text-sm font-semibold text-yellow-400 mb-2">${round.prompt || 'Sammelt gemeinsam Strategien!'}</h4>
      <p class="text-xs text-gray-500 mb-3">Beispiele: ${(round.examples || []).join(' · ')}</p>
      <div class="flex gap-2">
        <input type="text" id="boss-collect-input" class="input-field flex-1" 
               placeholder="Dein Beitrag..." maxlength="200">
        <button onclick="BossFight.submitBossCollect()" class="btn-primary px-4">⚔️</button>
      </div>
      <div class="mt-3">
        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Gesammelt</span>
          <span id="boss-collect-count">0 / ${round.targetCount || 6}</span>
        </div>
        <div class="progress-bar-container">
          <div id="boss-collect-progress" class="progress-bar-fill" style="width: 0%"></div>
        </div>
      </div>
      <div id="boss-collect-items" class="flex flex-wrap gap-2 mt-3"></div>
    `;

    document.getElementById('boss-collect-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') BossFight.submitBossCollect();
    });
  }

  function submitBossCollect() {
    const input = document.getElementById('boss-collect-input');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';
    gameState.roundInputCount++;

    const round = gameState.quest.rounds[gameState.currentRound];
    const damage = round.damage_per_response || 12;
    const target = round.targetCount || 6;
    dealDamage(damage);
    gameState.comboStreak++;

    const countEl = document.getElementById('boss-collect-count');
    const barEl = document.getElementById('boss-collect-progress');
    if (countEl) countEl.textContent = `${gameState.roundInputCount} / ${target}`;
    if (barEl) barEl.style.width = Math.min(100, (gameState.roundInputCount / target) * 100) + '%';

    const items = document.getElementById('boss-collect-items');
    if (items) {
      const chip = document.createElement('span');
      chip.className = 'match-card matched slide-up';
      chip.textContent = `⚔️ ${text}`;
      items.appendChild(chip);
    }

    addBossLog(`⚔️ ${App.escapeHTML(text)} (-${damage} HP)`);
    submitBossAction('collect', { text });
    updateBossHP();

    if (gameState.roundInputCount >= target || gameState.bossHP <= 0) {
      setTimeout(() => nextRound(), 2000);
    }
  }

  /* --- Damage & Round Progression --- */
  function dealDamage(amount) {
    const combo = Math.max(1, gameState.comboStreak);
    const multiplied = Math.round(amount * (1 + combo * 0.1));
    gameState.bossHP -= multiplied;
    gameState.teamDamage += multiplied;
    gameState.totalContributions++;

    const sprite = document.getElementById('boss-sprite');
    sprite.classList.add('hit-flash');
    setTimeout(() => sprite.classList.remove('hit-flash'), 500);

    if (gameState.bossHP <= 0) {
      gameState.bossHP = 0;
    }
  }

  function nextRound() {
    if (gameState.bossHP <= 0) {
      completeBossFight();
      return;
    }

    gameState.currentRound++;
    gameState.roundInputCount = 0;

    if (gameState.currentRound >= gameState.quest.rounds.length) {
      gameState.bossHP = 0;
      completeBossFight();
    } else {
      renderRound();
    }
  }

  function completeBossFight() {
    gameState.bossHP = 0;
    updateBossHP();
    App.showToast('⚔️ Boss besiegt!', 'success');

    addBossLog('🏆 DER BOSS IST BESIEGT! Ihr habt es geschafft!');

    if (gameState.isTherapist || gameState.appState.role === 'therapist') {
      setTimeout(() => {
        App.triggerVictory({
          contributions: gameState.totalContributions,
          puzzlesSolved: gameState.currentRound + 1,
          timeElapsed: document.getElementById('boss-timer')?.textContent || '--:--'
        });
      }, 2000);
    }
  }

  function addBossLog(text) {
    const log = document.getElementById('boss-fight-log');
    if (!log) return;

    const div = document.createElement('div');
    div.className = 'slide-up text-gray-300';
    div.innerHTML = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  async function submitBossAction(type, data) {
    const state = gameState.appState;
    if (!state.sessionId) return;

    await Database.submitAction(state.sessionId, {
      type: 'boss-fight',
      subType: type,
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
      const bossActions = actions
        .filter(a => a.type === 'boss-fight' && a.playerId !== state.playerId)
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      const latestActions = bossActions.slice(-3);
      latestActions.forEach(action => {
        if (!action._shown) {
          action._shown = true;
          const emoji = action.playerEmoji || '🎭';
          const name = action.playerName || 'Anonym';
          if (action.subType === 'reframe' || action.subType === 'affirmation') {
            addBossLog(`${emoji} ${name}: "${App.escapeHTML(action.data.text)}"`);
          } else if (action.subType === 'group-input' || action.subType === 'collect') {
            addBossLog(`${emoji} ${name}: ${App.escapeHTML(action.data.text)}`);
          }
        }
      });
    });
  }

  return {
    init,
    selectOption,
    submitReframe,
    submitGroupInput,
    submitAffirmation,
    submitBossCollect,
    getState: () => gameState
  };
})();
