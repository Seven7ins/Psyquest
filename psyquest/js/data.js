/* ============================================
   PsyQuest – Game Data & Content
   All quests, puzzles, avatars, badges, and
   therapeutic content in one place.
   ============================================ */

const AVATARS = [
  { emoji: '🦁', name: 'Mutiger Löwe' },
  { emoji: '🦊', name: 'Schlaue Füchsin' },
  { emoji: '🐻', name: 'Starker Bär' },
  { emoji: '🦉', name: 'Weise Eule' },
  { emoji: '🐺', name: 'Tapferer Wolf' },
  { emoji: '🦅', name: 'Freier Adler' },
  { emoji: '🐬', name: 'Fröhlicher Delfin' },
  { emoji: '🦋', name: 'Sanfter Schmetterling' },
  { emoji: '🐢', name: 'Geduldige Schildkröte' },
  { emoji: '🦌', name: 'Anmutiger Hirsch' },
  { emoji: '🐙', name: 'Kreativer Oktopus' },
  { emoji: '🦜', name: 'Bunter Papagei' }
];

const BADGES = {
  'thought-reframer': { icon: '🧠', name: 'Gedanken-Umformer', description: 'Hat negative Gedanken erfolgreich umformuliert' },
  'empathy-hero': { icon: '💜', name: 'Empathie-Held', description: 'Zeigt besonderes Mitgefühl' },
  'calm-master': { icon: '🧘', name: 'Ruhe-Meister', description: 'Hat Achtsamkeitsübungen gemeistert' },
  'team-player': { icon: '🤝', name: 'Team-Spieler', description: 'Hat aktiv zum Gruppenfortschritt beigetragen' },
  'demon-slayer': { icon: '⚔️', name: 'Dämonen-Jäger', description: 'Hat einen inneren Dämon besiegt' },
  'labyrinth-conqueror': { icon: '🏰', name: 'Labyrinth-Bezwinger', description: 'Ist aus dem Angst-Labyrinth entkommen' },
  'strength-finder': { icon: '💪', name: 'Stärken-Finder', description: 'Hat eigene Stärken entdeckt' },
  'perspective-shifter': { icon: '🔮', name: 'Perspektiv-Wechsler', description: 'Meistert den Blickwinkelwechsel' },
  'coping-collector': { icon: '🎒', name: 'Coping-Sammler', description: 'Hat viele Bewältigungsstrategien gesammelt' },
  'first-step': { icon: '👣', name: 'Erster Schritt', description: 'Hat zum ersten Mal teilgenommen' }
};

/* ============================================
   QUEST 1: Flucht aus dem Angst-Labyrinth
   (Depression, Anxiety, General)
   ============================================ */

/* ============================================
   QUEST 2: Dunkelheits-Drache besiegen
   (Depression focus)
   ============================================ */

/* ============================================
   QUEST 3: Soziale Brücke bauen
   (Social Phobia focus)
   ============================================ */

/* ============================================
   QUEST 4: Stress-Vulkan beruhigen
   (Stress Management focus)
   ============================================ */

/* ============================================
   QUEST 5: Emotions-Labor
   (DBT Skills - Emotion Labeling)
   ============================================ */

/* ============================================
   QUEST 6: Gedanken-Tribunal
   (CBT Focus - Cognitive Restructuring)
   ============================================ */

/* ============================================
   QUEST 7: Werte-Kompass
   (ACT - Values Exploration)
   ============================================ */

/* ============================================
   QUEST 8: Achtsamkeits-Oase
   (Mindfulness / DBT)
   ============================================ */

/* ============================================
   QUEST 9: Selbstmitgefühl-Schatz
   (Self-Compassion focus)
   ============================================ */

/* ============================================
   QUEST 10: Zukunfts-Zeitreise
   (Hope & Motivation)
   ============================================ */

const QUESTS = {
  'escape-room': [
    {
      id: 'anxiety-labyrinth',
      name: 'Flucht aus dem Angst-Labyrinth',
      icon: '🏰',
      disorder: ['anxiety', 'mixed'],
      description: 'Navigiert durch 4 Räume und besiegt das Anxiety Monster',
      rooms: [
        {
          id: 'emotion-match',
          title: 'Raum 1: Emotions-Erkennung',
          monster: '👹',
          monsterName: 'Anxiety Monster',
          description: 'Ordne Angstsymptome den richtigen Coping-Strategien zu!',
          type: 'matching',
          pairs: [
            { symptom: '💓 Herzrasen', strategy: '🫁 Tief und langsam atmen (4-7-8)' },
            { symptom: '🌀 Gedankenkarussell', strategy: '📝 Gedanken aufschreiben & hinterfragen' },
            { symptom: '😰 Schwitzen & Zittern', strategy: '🧊 Kaltes Wasser / Grounding (5-4-3-2-1)' },
            { symptom: '🏃 Fluchtimpuls', strategy: '🧘 Bewusst stehenbleiben & Achtsamkeit' },
            { symptom: '😶 Sprachlosigkeit', strategy: '🗣️ Einfache Sätze vorbereiten' }
          ],
          hint: 'Denkt an eure eigenen Erfahrungen – welche Strategie hat euch schon geholfen?',
          reflection: 'Welches Symptom kennt ihr am besten? Welche Strategie wollt ihr ausprobieren?'
        },
        {
          id: 'strength-discovery',
          title: 'Raum 2: Stärken-Entdeckung',
          monster: '🗣️',
          monsterName: 'Inner Critic',
          description: 'Der Inner Critic sagt "Du kannst nichts!" – Beweist ihm das Gegenteil!',
          type: 'group-input',
          prompt: 'Nenne eine persönliche Stärke oder etwas, worauf du stolz bist:',
          examples: ['Ich bin kreativ', 'Ich kann gut zuhören', 'Ich bin mutig, weil ich hier bin'],
          minAnswers: 3,
          hint: 'Jede Stärke, egal wie klein, ist ein Schlüssel! Auch "Ich bin hier" zählt.',
          reflection: 'Wie fühlt es sich an, eure Stärken zu nennen? War es schwer oder leicht?'
        },
        {
          id: 'coping-maze',
          title: 'Raum 3: Coping-Pfade',
          monster: '🌪️',
          monsterName: 'Stress-Tornado',
          description: 'Wählt den richtigen Coping-Pfad – nicht jeder Weg führt nach draußen!',
          type: 'choice-path',
          scenario: 'Du hast morgen eine wichtige Prüfung und fühlst dich völlig überfordert. Was tust du?',
          paths: [
            {
              text: '🏃 Alles vermeiden und Netflix schauen',
              effective: false,
              feedback: 'Vermeidung fühlt sich kurzfristig gut an, aber die Angst wächst. Versuch einen anderen Weg!',
              damage: 0
            },
            {
              text: '📋 Einen kleinen Plan machen: 30 Min lernen, dann Pause',
              effective: true,
              feedback: 'Super! Kleine Schritte und Pausen sind ein bewährter Weg!',
              damage: 30
            },
            {
              text: '📱 Einem Freund schreiben, wie ich mich fühle',
              effective: true,
              feedback: 'Sehr gut! Soziale Unterstützung suchen ist eine starke Coping-Strategie!',
              damage: 25
            },
            {
              text: '🧘 5 Minuten Atemübung, dann die wichtigsten 3 Themen aufschreiben',
              effective: true,
              feedback: 'Hervorragend! Achtsamkeit + Struktur ist eine Profi-Kombination!',
              damage: 35
            }
          ],
          hint: 'Nicht jede Strategie ist schlecht – manche sind nur weniger effektiv.',
          reflection: 'Welchen Pfad wählt ihr normalerweise? Was könntet ihr anders machen?'
        },
        {
          id: 'group-affirmation',
          title: 'Raum 4: Gemeinsame Kraft',
          monster: '🌑',
          monsterName: 'Dunkelheit',
          description: 'Sammelt gemeinsam positive Affirmationen als Licht gegen die Dunkelheit!',
          type: 'group-collect',
          prompt: 'Schreibe einen ermutigenden Satz für die Gruppe:',
          examples: ['Wir schaffen das gemeinsam', 'Jeder Schritt zählt', 'Du bist nicht allein'],
          targetCount: 8,
          hint: 'Stellt euch vor, was ihr eurem besten Freund sagen würdet!',
          reflection: 'Welche Affirmation hat euch am meisten berührt? Warum?'
        }
      ]
    },
    {
      id: 'darkness-dragon',
      name: 'Besiege den Dunkelheits-Drachen',
      icon: '🐉',
      disorder: ['depression', 'mixed'],
      description: 'Kämpft gegen die depressive Dunkelheit mit Licht und Hoffnung',
      rooms: [
        {
          id: 'emotion-label',
          title: 'Raum 1: Gefühle benennen',
          monster: '🐉',
          monsterName: 'Dunkelheits-Drache',
          description: 'Der Drache versteckt sich hinter unbenannten Gefühlen. Benennt sie!',
          type: 'matching',
          pairs: [
            { symptom: '😶 "Ich fühle gar nichts"', strategy: '🏷️ Taubheit / Emotionale Betäubung' },
            { symptom: '🛌 "Ich will nur schlafen"', strategy: '🏷️ Erschöpfung / Antriebslosigkeit' },
            { symptom: '😢 "Nichts macht Spaß"', strategy: '🏷️ Anhedonie / Freudlosigkeit' },
            { symptom: '🤔 "Ich bin allen zur Last"', strategy: '🏷️ Kognitiver Fehler: Gedankenlesen' },
            { symptom: '😤 "Alles ist sinnlos"', strategy: '🏷️ Hoffnungslosigkeit / Schwarz-Weiß-Denken' }
          ],
          hint: 'Gefühle zu benennen ist der erste Schritt – "Name it to tame it"!',
          reflection: 'Kennt ihr eines dieser Gefühle? Wie fühlt es sich an, es zu benennen?'
        },
        {
          id: 'light-collector',
          title: 'Raum 2: Licht sammeln',
          monster: '🌑',
          monsterName: 'Leere',
          description: 'Sammelt kleine Lichtpunkte: Dinge, die euch ein kleines Lächeln schenken!',
          type: 'group-collect',
          prompt: 'Nenne eine kleine Sache, die dir ein winziges Lächeln entlockt:',
          examples: ['Die Sonne auf der Haut', 'Ein gutes Lied', 'Ein warmes Getränk'],
          targetCount: 10,
          hint: 'Es müssen keine großen Dinge sein! Auch "ein lustiges Meme" zählt.',
          reflection: 'Welche kleinen Lichtpunkte übersehen wir im Alltag?'
        },
        {
          id: 'thought-reframe',
          title: 'Raum 3: Gedanken umformen',
          monster: '🗣️',
          monsterName: 'Inner Critic',
          description: 'Verwandelt die negativen Sätze des Inner Critics in hilfreiche Gedanken!',
          type: 'reframe',
          thoughts: [
            {
              negative: 'Ich bin ein Versager und schaffe nie etwas.',
              hints: ['Ist das wirklich immer so?', 'Was hast du schon geschafft?'],
              examples: ['Ich habe schwierige Zeiten überstanden – das zeigt Stärke.', 'Ich muss nicht perfekt sein, um wertvoll zu sein.']
            },
            {
              negative: 'Niemand mag mich wirklich.',
              hints: ['Gibt es Gegenbeweise?', 'Was würde dein bester Freund sagen?'],
              examples: ['Manche Menschen zeigen Zuneigung anders als ich erwarte.', 'Ich bin hier in einer Gruppe – das zeigt, dass mir andere wichtig sind.']
            },
            {
              negative: 'Es wird nie besser werden.',
              hints: ['Gab es je eine Zeit, wo etwas besser wurde?', 'Was sagt die Erfahrung?'],
              examples: ['Veränderung braucht Zeit, aber sie ist möglich.', 'Ich kann nicht die Zukunft vorhersagen – ein kleiner Schritt reicht.']
            }
          ],
          hint: 'Es geht nicht darum, "positiv zu denken", sondern realistisch und freundlich zu sich selbst.',
          reflection: 'Welcher umformulierte Gedanke fühlt sich am glaubwürdigsten an?'
        },
        {
          id: 'hope-letter',
          title: 'Raum 4: Brief der Hoffnung',
          monster: '🐉',
          monsterName: 'Dunkelheits-Drache',
          description: 'Schreibt gemeinsam einen Brief an euer zukünftiges, stärkeres Ich!',
          type: 'group-input',
          prompt: 'Schreibe einen Satz an dein zukünftiges Ich (in 6 Monaten):',
          examples: ['Du hast es geschafft, weiterzumachen!', 'Erinnere dich: Du bist stärker als du denkst.'],
          minAnswers: 4,
          hint: 'Stellt euch vor, wie ihr in 6 Monaten auf heute zurückblickt.',
          reflection: 'Wie fühlt es sich an, aus der Zukunft auf heute zu schauen?'
        }
      ]
    },
    {
      id: 'social-bridge',
      name: 'Baue die Soziale Brücke',
      icon: '🌉',
      disorder: ['social-phobia', 'mixed'],
      description: 'Überwindet die Kluft der sozialen Angst Schritt für Schritt',
      rooms: [
        {
          id: 'fear-ranking',
          title: 'Raum 1: Angst-Hierarchie',
          monster: '👁️',
          monsterName: 'Beobachter-Auge',
          description: 'Sortiert soziale Situationen von "leicht" bis "schwer"!',
          type: 'choice-path',
          scenario: 'Welche Situation würdest du als weniger angstauslösend einschätzen?',
          paths: [
            { text: '👋 Jemanden kurz grüßen', effective: true, feedback: 'Ein kleiner Gruß ist ein wunderbarer Anfang!', damage: 20 },
            { text: '🗣️ In einer Gruppe eine Meinung sagen', effective: true, feedback: 'Mutig! Das erfordert Übung, aber jeder Versuch zählt!', damage: 30 },
            { text: '📞 Jemanden anrufen', effective: true, feedback: 'Telefonieren ist für viele herausfordernd – du bist nicht allein!', damage: 25 },
            { text: '🤝 Auf eine fremde Person zugehen', effective: true, feedback: 'Respekt! Das ist für viele Menschen schwer.', damage: 35 }
          ],
          hint: 'Es gibt kein "richtig" oder "falsch" – jeder empfindet anders.',
          reflection: 'Was war für euch überraschend an den Antworten der anderen?'
        },
        {
          id: 'safe-sentence',
          title: 'Raum 2: Sichere Sätze',
          monster: '🤐',
          monsterName: 'Stille-Monster',
          description: 'Sammelt "sichere Sätze" für schwierige soziale Situationen!',
          type: 'group-collect',
          prompt: 'Nenne einen Satz, der in einer sozialen Situation helfen könnte:',
          examples: ['Darf ich mich kurz setzen?', 'Das finde ich auch interessant!', 'Ich brauche kurz eine Pause.'],
          targetCount: 8,
          hint: 'Einfache Sätze sind Gold wert! Sie müssen nicht perfekt sein.',
          reflection: 'Welchen Satz würdet ihr gerne mal ausprobieren?'
        },
        {
          id: 'assumption-check',
          title: 'Raum 3: Annahmen prüfen',
          monster: '🔮',
          monsterName: 'Gedankenleser',
          description: 'Entlarvt falsche Annahmen über das, was andere denken!',
          type: 'reframe',
          thoughts: [
            {
              negative: 'Alle starren mich an und finden mich seltsam.',
              hints: ['Starren sie wirklich oder sind sie mit sich beschäftigt?'],
              examples: ['Die meisten Menschen sind mit sich selbst beschäftigt.', 'Ich kann nicht Gedanken lesen.']
            },
            {
              negative: 'Wenn ich etwas Falsches sage, werden alle lachen.',
              hints: ['Wie oft lachst du über Fehler anderer?'],
              examples: ['Fehler machen ist menschlich und meistens vergessen es alle schnell.']
            }
          ],
          hint: 'Unsere Angst sagt uns oft Geschichten, die nicht stimmen.',
          reflection: 'Welche Annahme hat sich bei euch schon mal als falsch herausgestellt?'
        },
        {
          id: 'courage-steps',
          title: 'Raum 4: Mutige Schritte',
          monster: '🏔️',
          monsterName: 'Der Berg',
          description: 'Plant gemeinsam kleine mutige Schritte für die nächste Woche!',
          type: 'group-input',
          prompt: 'Nenne einen kleinen mutigen Schritt, den du diese Woche versuchen könntest:',
          examples: ['Beim Einkaufen die Kassiererin anlächeln', 'In der Gruppe eine Frage stellen'],
          minAnswers: 4,
          hint: 'Kleine Schritte sind keine kleinen Erfolge – sie sind riesig!',
          reflection: 'Wie können wir uns gegenseitig bei diesen Schritten unterstützen?'
        }
      ]
    }
  ],

  'boss-fight': [
    {
      id: 'anxiety-monster',
      name: 'Kampf gegen das Anxiety Monster',
      icon: '👹',
      disorder: ['anxiety', 'mixed'],
      description: 'Besiegt den Angst-Dämon mit Coping-Strategien',
      bossHP: 100,
      bossEmoji: '👹',
      rounds: [
        {
          attack: 'Das Monster schleudert Panik-Gedanken!',
          scenario: 'Du sitzt in der Bahn und plötzlich wird dir schwindelig. Dein Herz rast.',
          type: 'multi-choice',
          options: [
            { text: '🫁 4-7-8 Atemtechnik: 4 Sek. einatmen, 7 halten, 8 ausatmen', effective: true, damage: 25 },
            { text: '🧊 Grounding: 5 Dinge sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken', effective: true, damage: 20 },
            { text: '🏃 Sofort aussteigen und nach Hause rennen', effective: false, damage: 5 },
            { text: '📱 Einem Freund schreiben: "Mir geht es gerade nicht gut"', effective: true, damage: 15 }
          ],
          feedback_good: 'Starker Treffer! Das Monster wankt!',
          feedback_bad: 'Vermeidung macht das Monster langfristig stärker. Versucht eine andere Strategie!'
        },
        {
          attack: 'Das Monster flüstert Katastrophen-Gedanken!',
          scenario: '"Was wenn du ohnmächtig wirst? Was wenn alle dich auslachen?"',
          type: 'reframe',
          negative: 'Ich werde bestimmt ohnmächtig und alle werden mich für verrückt halten!',
          hints: ['Bist du jemals wirklich ohnmächtig geworden?', 'Was wäre das Schlimmste – und wie wahrscheinlich ist es?'],
          damage_per_response: 15,
          feedback: 'Jede umformulierte Antwort schwächt den Katastrophen-Gedanken!'
        },
        {
          attack: 'Das Monster erzeugt körperliche Symptome!',
          scenario: 'Herzrasen, Schwitzen, Zittern – der Körper spielt verrückt.',
          type: 'multi-choice',
          options: [
            { text: '🧘 Progressive Muskelentspannung: Anspannen – Loslassen', effective: true, damage: 20 },
            { text: '🌡️ Kälte-Technik: Kaltes Wasser über die Handgelenke', effective: true, damage: 20 },
            { text: '🗣️ Sich selbst beruhigen: "Das ist Angst, nicht Gefahr. Es geht vorbei."', effective: true, damage: 25 },
            { text: '🍷 Etwas trinken, um die Nerven zu beruhigen', effective: false, damage: 5 }
          ],
          feedback_good: 'Der Körper entspannt sich – das Monster wird schwächer!',
          feedback_bad: 'Substanzen helfen nur kurzfristig und können Angst langfristig verstärken.'
        },
        {
          attack: 'Das Monster versucht euch zu isolieren!',
          scenario: '"Du bist der einzige, der so fühlt. Niemand versteht dich."',
          type: 'group-input',
          prompt: 'Schreibt eine ermutigende Nachricht an die Gruppe:',
          damage_per_response: 10,
          feedback: 'Gemeinschaft ist die stärkste Waffe gegen Isolation!'
        },
        {
          attack: 'Finaler Angriff: Das Monster gibt alles!',
          scenario: 'Sammelt eure stärksten Affirmationen als finale Waffe!',
          type: 'affirmation-collect',
          prompt: 'Eure stärkste Affirmation gegen die Angst:',
          examples: ['Angst ist ein Gefühl, keine Tatsache', 'Ich habe schon schlimmeres überstanden'],
          damage_per_response: 12,
          feedback: 'Jede Affirmation ist ein Lichtstrahl gegen die Dunkelheit!'
        }
      ]
    },
    {
      id: 'inner-critic',
      name: 'Kampf gegen den Inner Critic',
      icon: '🗣️',
      disorder: ['depression', 'mixed'],
      description: 'Stellt den inneren Kritiker mit Selbstmitgefühl ruhig',
      bossHP: 100,
      bossEmoji: '🗣️',
      rounds: [
        {
          attack: 'Der Inner Critic sagt: "Du bist nicht gut genug!"',
          scenario: 'Du hast bei der Arbeit/Schule einen Fehler gemacht.',
          type: 'reframe',
          negative: 'Ich bin ein totaler Versager. Ich mache immer alles falsch.',
          hints: ['Was würdest du einem Freund in dieser Situation sagen?', 'Stimmt "immer" und "alles" wirklich?'],
          damage_per_response: 15,
          feedback: 'Selbstmitgefühl ist die Geheimwaffe gegen den Inner Critic!'
        },
        {
          attack: 'Der Inner Critic vergleicht dich mit anderen!',
          scenario: '"Alle anderen schaffen es, nur du nicht. Schau dir X an..."',
          type: 'multi-choice',
          options: [
            { text: '🔍 Erkennen: Das ist der Vergleichs-Fehler – ich sehe nur die Oberfläche', effective: true, damage: 25 },
            { text: '📱 Social Media eine Weile meiden', effective: true, damage: 20 },
            { text: '📝 Eigene Fortschritte aufschreiben, egal wie klein', effective: true, damage: 20 },
            { text: '😔 Stimmt, ich bin einfach nicht so gut', effective: false, damage: 5 }
          ],
          feedback_good: 'Der Vergleichs-Angriff prallt ab!',
          feedback_bad: 'Der Inner Critic hat einen Punkt gelandet. Erinnere dich: Du siehst nie das ganze Bild anderer.'
        },
        {
          attack: 'Der Inner Critic greift dein Selbstwertgefühl an!',
          scenario: '"Was hast du je erreicht? Nichts!"',
          type: 'group-input',
          prompt: 'Nenne eine Sache, auf die du (auch heimlich) ein bisschen stolz bist:',
          damage_per_response: 12,
          feedback: 'Jede genannte Stärke ist ein Schlag gegen den Inner Critic!'
        },
        {
          attack: 'Der Inner Critic versucht den letzten Angriff!',
          scenario: 'Er sammelt all seine Kraft für einen finalen Schlag...',
          type: 'affirmation-collect',
          prompt: 'Formuliert gemeinsam einen Satz, den ihr dem Inner Critic entgegenhaltet:',
          examples: ['Ich bin genug, so wie ich bin', 'Mein Wert hängt nicht von meiner Leistung ab'],
          damage_per_response: 15,
          feedback: 'Gemeinsam seid ihr stärker als jeder innere Kritiker!'
        }
      ]
    },
    {
      id: 'stress-volcano',
      name: 'Beruhige den Stress-Vulkan',
      icon: '🌋',
      disorder: ['stress', 'mixed'],
      description: 'Kühlt den Stress-Vulkan ab, bevor er ausbricht',
      bossHP: 100,
      bossEmoji: '🌋',
      rounds: [
        {
          attack: 'Der Vulkan brodelt: Zu viele Aufgaben!',
          scenario: 'Du hast 10 Aufgaben und nur Zeit für 3. Panik steigt auf.',
          type: 'multi-choice',
          options: [
            { text: '📋 Priorisieren: Die 3 wichtigsten auswählen', effective: true, damage: 25 },
            { text: '🤯 Alles gleichzeitig versuchen', effective: false, damage: 5 },
            { text: '🗣️ Um Hilfe bitten oder delegieren', effective: true, damage: 20 },
            { text: '⏰ Pomodoro: 25 Min fokussiert, 5 Min Pause', effective: true, damage: 20 }
          ],
          feedback_good: 'Der Vulkan kühlt sich etwas ab!',
          feedback_bad: 'Multitasking erhöht den Druck! Probier einen anderen Ansatz.'
        },
        {
          attack: 'Die Lava steigt: Schlaflose Nächte!',
          scenario: 'Du liegst wach und grübelst über morgen.',
          type: 'group-collect',
          prompt: 'Nenne eine Strategie für besseren Schlaf:',
          examples: ['Handy 1 Stunde vor dem Schlafen weglegen', 'Entspannende Musik hören'],
          targetCount: 6,
          damage_per_response: 12,
          feedback: 'Jeder Schlaf-Tipp kühlt den Vulkan!'
        },
        {
          attack: 'Eruption droht: Emotionaler Ausbruch!',
          scenario: 'Du merkst, dass du gleich explodierst – Wut oder Tränen.',
          type: 'multi-choice',
          options: [
            { text: '🧊 TIPP-Skill (DBT): Kaltes Wasser ins Gesicht', effective: true, damage: 25 },
            { text: '🏃 Kurz den Raum verlassen und 10x tief atmen', effective: true, damage: 20 },
            { text: '😡 Alles rausschreien an die nächste Person', effective: false, damage: 5 },
            { text: '📝 Gefühle kurz aufschreiben, dann STOP sagen', effective: true, damage: 20 }
          ],
          feedback_good: 'Die Lava zieht sich zurück!',
          feedback_bad: 'Reaktives Handeln kann Beziehungen belasten. Versuch eine Pause-Strategie!'
        },
        {
          attack: 'Letzte Chance: Der Vulkan oder ihr!',
          scenario: 'Sammelt eure besten Stress-Killer als Löschwaffen!',
          type: 'affirmation-collect',
          prompt: 'Euer persönlicher Stress-Killer:',
          examples: ['Sport/Bewegung', 'Musik hören', 'Mit jemandem reden'],
          damage_per_response: 12,
          feedback: 'Jeder Stress-Killer ist ein Eimer Wasser auf den Vulkan!'
        }
      ]
    }
  ]
};

const COMPETITIVE_SCENARIOS = {
  'empathy-duel': [
    {
      scenario: 'Dein Freund erzählt dir, dass er/sie sich in der Schule/Arbeit total überfordert fühlt und am liebsten alles hinschmeißen würde.',
      context: 'Empathisch reagieren'
    },
    {
      scenario: 'Jemand in der Gruppe sagt: "Mir geht es nicht gut, aber ich will niemandem zur Last fallen."',
      context: 'Unterstützung zeigen'
    },
    {
      scenario: 'Ein Familienmitglied hat einen wichtigen Termin vergessen, der dir sehr wichtig war.',
      context: 'Verständnis zeigen trotz Enttäuschung'
    },
    {
      scenario: 'Dein Freund hat Angst davor, in der Öffentlichkeit zu sprechen, und muss nächste Woche eine Präsentation halten.',
      context: 'Ermutigung & praktische Hilfe'
    },
    {
      scenario: 'Jemand erzählt dir, dass er/sie sich einsam fühlt, obwohl er/sie viele Leute kennt.',
      context: 'Einsamkeit verstehen'
    }
  ],
  'skill-race': [
    {
      scenario: 'Du stehst vor einer Prüfung und hast einen kompletten Blackout. Was tust du?',
      options: [
        { text: '🫁 3x tief atmen und bei 1 beginnen', points: 3 },
        { text: '📝 Alles aufschreiben, was du noch weißt', points: 2 },
        { text: '😰 In Panik geraten', points: 0 },
        { text: '🧊 Grounding: Füße auf den Boden drücken', points: 3 }
      ],
      openPrompt: 'Oder deine eigene Strategie:'
    },
    {
      scenario: 'Du hast einen Streit mit einem guten Freund und bist wütend. Was ist dein nächster Schritt?',
      options: [
        { text: '⏸️ Pause nehmen bevor ich reagiere', points: 3 },
        { text: '📱 Sofort eine wütende Nachricht schreiben', points: 0 },
        { text: '🗣️ "Ich"-Botschaften verwenden: "Ich fühle mich..."', points: 3 },
        { text: '🏃 Erst Bewegung, dann Gespräch', points: 2 }
      ],
      openPrompt: 'Oder deine eigene Strategie:'
    },
    {
      scenario: 'Du liegst seit 2 Stunden wach und kannst nicht einschlafen. Was machst du?',
      options: [
        { text: '📱 Social Media checken', points: 0 },
        { text: '🧘 Body Scan Meditation', points: 3 },
        { text: '📖 Aufstehen und etwas Langweiliges lesen', points: 2 },
        { text: '🫁 4-7-8 Atemtechnik', points: 3 }
      ],
      openPrompt: 'Oder deine eigene Strategie:'
    },
    {
      scenario: 'Du vergleichst dich auf Instagram mit anderen und fühlst dich danach schlecht. Was hilft?',
      options: [
        { text: '📵 App für heute schließen', points: 2 },
        { text: '📝 3 Dinge aufschreiben, wofür ich dankbar bin', points: 3 },
        { text: '📱 Noch mehr scrollen', points: 0 },
        { text: '🗣️ Mit jemandem darüber reden', points: 3 }
      ],
      openPrompt: 'Oder deine eigene Strategie:'
    },
    {
      scenario: 'Du fühlst eine Panikattacke aufkommen – Herz rast, Atemnot. Was ist der erste Schritt?',
      options: [
        { text: '🫁 Langsam ausatmen – länger als einatmen', points: 3 },
        { text: '🧊 5-4-3-2-1 Grounding Technik', points: 3 },
        { text: '🏃 Wegrennen', points: 0 },
        { text: '🗣️ "Das ist eine Panikattacke. Sie geht vorbei."', points: 3 }
      ],
      openPrompt: 'Oder deine eigene Strategie:'
    }
  ],
  'perspective-battle': [
    {
      scenario: 'Du hast gerade eine schlechte Note bekommen oder negatives Feedback bei der Arbeit erhalten.',
      prompt: 'Beschreibe die Situation aus der Sicht deines zukünftigen, starken Ichs (in 5 Jahren):',
      criteria: 'Kreativität, Hoffnung und Selbstmitgefühl'
    },
    {
      scenario: 'Dein Freundeskreis hat etwas ohne dich unternommen.',
      prompt: 'Wie würde dein stärkstes, weisestes Ich diese Situation sehen?',
      criteria: 'Perspektivenvielfalt und Gelassenheit'
    },
    {
      scenario: 'Du hast dich vor einer Gruppe blamiert – etwas Peinliches gesagt.',
      prompt: 'Beschreibe, wie du in 10 Jahren auf diesen Moment zurückblickst:',
      criteria: 'Humor, Milde und Wachstum'
    },
    {
      scenario: 'Du fühlst dich seit Wochen antriebslos und schaffst kaum das Nötigste.',
      prompt: 'Was würde ein liebevoller innerer Mentor dir sagen?',
      criteria: 'Wärme, Verständnis und sanfte Ermutigung'
    },
    {
      scenario: 'Du musst eine wichtige Entscheidung treffen und hast Angst, die falsche zu wählen.',
      prompt: 'Wie beschreibt dein 80-jähriges weises Ich diese Entscheidung?',
      criteria: 'Weisheit, Gelassenheit und Lebenserfahrung'
    }
  ]
};

const DEBRIEF_QUESTIONS = {
  general: [
    'Was hat euch heute am meisten überrascht?',
    'Welche Strategie aus dem Spiel wollt ihr im Alltag ausprobieren?',
    'Was hat euch heute stark gemacht?',
    'Gab es einen Moment, in dem ihr euch verbunden gefühlt habt?',
    'Was nehmt ihr aus dieser Runde mit?'
  ],
  depression: [
    'Welcher kleine Lichtpunkt hat euch am meisten angesprochen?',
    'Was war es wert, heute aufzustehen?',
    'Welchen freundlichen Gedanken wollt ihr euch merken?',
    'Wie hat es sich angefühlt, gemeinsam gegen den Inner Critic zu kämpfen?'
  ],
  anxiety: [
    'Welche Coping-Strategie fühlt sich am machbarsten an?',
    'Hat sich eure Einschätzung von Angst verändert?',
    'Was war der mutigste Moment heute?',
    'Wie fühlt sich der Körper gerade im Vergleich zum Anfang?'
  ],
  'social-phobia': [
    'Wie war es, in der Gruppe etwas zu teilen?',
    'Welcher "sichere Satz" könnte euch diese Woche helfen?',
    'Was habt ihr über die Ängste der anderen gelernt?',
    'Welchen kleinen Schritt plant ihr für die nächsten Tage?'
  ],
  stress: [
    'Welcher Stress-Killer hat euch am meisten angesprochen?',
    'Was hat euch geholfen, im Spiel ruhig zu bleiben?',
    'Wie gestresst fühlt ihr euch jetzt (1-10) verglichen mit vorhin?',
    'Was ist eine Sache, die ihr heute loslassen könnt?'
  ]
};

const STICKERS_REACTIONS = ['💪', '❤️', '🌟', '🤗', '🧘', '🎯', '🌈', '🔥', '🦋', '✨', '👏', '🙏', '😊', '🫂', '🌻'];
