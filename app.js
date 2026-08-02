function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* app.src.jsx — editable JSX source for the app.
   This is the file to edit. Recompile to app.js (loaded by index.html) with:
     npx @babel/cli@7 --presets @babel/preset-react app.src.jsx > app.js
   React 18 classic runtime; React/ReactDOM are global (vendored UMD builds). */
const {
  useState,
  useEffect,
  useRef
} = React;

/* ============================================================
   CONTENT — the prompt tables, transcribed from the rulebook.
   Text is verbatim except where a table-of-players instruction
   had to become a solo one (noted at each site).
   ============================================================ */
const SUITS = {
  hearts: {
    glyph: '♥',
    red: true
  },
  diamonds: {
    glyph: '♦',
    red: true
  },
  clubs: {
    glyph: '♣',
    red: false
  },
  spades: {
    glyph: '♠',
    red: false
  }
};
const SUIT_ORDER = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANK_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/* --- biome card 1: the region at a macroscopic level --- */
const B1_RANK = {
  A: 'Desert',
  '2': 'Tundra or wasteland',
  '3': 'Scrub or grassland',
  '4': 'Temperate forest',
  '5': 'Tropical forest, jungle',
  '6': 'Snow forest, taiga',
  '7': 'Mountain',
  '8': 'Glacier or fjord',
  '9': 'Floodplain',
  '10': 'Lagoon or cove',
  J: 'Shoreline or coast',
  Q: 'Stream or river',
  K: 'Wetland or marsh'
};
const B1_SUIT = {
  hearts: 'The season is warm and wet',
  diamonds: 'The season is warm and dry',
  clubs: 'The season is cool and dry',
  spades: 'The season is cool and wet'
};

/* --- biome card 2: additional context and detail --- */
const B2_RANK = {
  A: 'Waterfall',
  '2': 'Cavern or tunnel',
  '3': 'Canyon or valley',
  '4': 'Flowering plants',
  '5': 'Island',
  '6': 'Lake or spring',
  '7': 'Strong winds',
  '8': 'Extreme temperature',
  '9': 'High altitude',
  '10': 'Low altitude',
  J: 'Dormant volcano',
  Q: 'Volatile weather patterns',
  K: 'Partially or fully submerged'
};
const B2_SUIT = {
  hearts: 'Early morning',
  diamonds: 'Midday',
  clubs: 'Afternoon or twilight',
  spades: 'Deep night'
};

/* --- creature card 1: a general description --- */
const C1_RANK = {
  A: 'Pollinator or plant spreader',
  '2': 'Grain or seed-eater',
  '3': 'Leaf, shrub, or fruit eater',
  '4': 'Grass, moss, or algae eater',
  '5': 'Insect forager',
  '6': 'Climber or tree-dweller',
  '7': 'Burrower or builder',
  '8': 'Flyer or glider',
  '9': 'Decomposer or recycler',
  '10': 'Scavenger or thief',
  J: 'Generalist omnivore',
  Q: 'Ambush predator',
  K: 'Apex predator'
};
const C1_SUIT = {
  hearts: 'Mammal (e.g. rodents, big cats, ungulates, marsupials, mustelids, canids, cetaceans)',
  diamonds: 'Bird or fish (e.g. raptors, songbirds, flightless birds, corvids, sharks, eels, rays)',
  clubs: 'Reptile or amphibian (e.g. crocodilians, sauropods, lizards, frogs, salamanders)',
  spades: 'Invertebrate (e.g. insects, squid, arachnids, molluscs, crustaceans, cnidarians)'
};

/* --- creature card 2: a distinctive feature.
       Selected by card COLOR, not suit — the one place color is mechanical. --- */
const C2_RED = {
  A: 'Long tail. Stiff? Flexible? Prehensile?',
  '2': 'Broad claws or talons. What are they used for?',
  '3': 'Beak or bill. What tool or object does it resemble?',
  '4': 'Spines or spikes. How long? Where are they placed?',
  '5': 'Curious jaws, teeth, or tusks. How many? What shape?',
  '6': 'More or fewer appendages. How many?',
  '7': 'Powerful hind limbs. For jumping? Running? Kicking?',
  '8': 'Leathery wings or hide. How thick?',
  '9': 'Captivating eyes. What size? What color?',
  '10': 'Specialized diet. What does it eat? What makes it specialized?',
  J: 'Strange gills or lungs. What does it breathe? How?',
  Q: 'Bioluminescence. Where on its body?',
  K: 'Camouflage or mimicry. What does it disguise itself as?'
};
const C2_BLACK = {
  A: 'Short tail. Or no tail at all?',
  '2': 'Small, flat feet. Hooves? Paws? Fins?',
  '3': 'Distinctive muzzle or snout. What shape is its head?',
  '4': 'Hard carapace. Dull and flat, or shiny and reflective?',
  '5': 'Horns or antlers. Or both?',
  '6': 'Iconic patterns. Spots? Stripes? What colors? What shapes?',
  '7': 'Prehensile digits. Fingers? Tentacles? What do they grasp?',
  '8': 'Broad feathers or scales. Does it molt or shed? How often?',
  '9': 'Whiskers or antennae. Spread out or clustered? Short or long?',
  '10': 'Noisy. What does it sound like?',
  J: 'Iconic ears. What shape? What purpose?',
  Q: 'Poison or venom sacs. Where are they located?',
  K: 'Vivid coloration. To warn, or entice?'
};

/* --- creature card 3: habits and personality --- */
const C3_RANK = {
  A: 'Invasive species. This creature is not native to this region. What allows it to thrive here? What does it threaten?',
  '2': "Endangered. This creature's species is at risk of extinction. What forces endanger its livelihood?",
  '3': 'Migratory. This creature travels through and beyond this region. What is its final destination? What does it do there?',
  '4': 'Endemic. This species is found exclusively in this particular region. What prevents it from traveling beyond?',
  '5': 'Dwellings or nests. This creature makes its home of strange material. How does it use its environment?',
  '6': 'Offspring. This creature has a distinct method of reproduction or child-rearing. Why is it noteworthy?',
  '7': 'Folkloric. There is a well-known myth or fable about this animal. How is it characterized?',
  '8': 'Tool user. This creature can operate crude or makeshift tools. What are they made of? What are they used for?',
  '9': 'Courtship displays. This creature has a distinctive mating ritual. What does it encompass?',
  '10': 'Life cycle. This creature undergoes metamorphosis. How many stages? How do they differ? What stage is it in now?',
  J: "Sexual dimorphism. This species' two or more sexes exhibit different characteristics. Size? Color? Something else?",
  Q: 'Hibernating. This creature is dormant during certain times of year. How soon before it retires again?',
  K: 'Sedentary lifestyle. This creature does not move often. What is enough to stir its attention?'
};
const C3_SUIT = {
  hearts: 'A solitary species. What happens when two meet?',
  diamonds: 'This species lives in very small groups. Mated pairs, a family unit, or some other arrangement?',
  clubs: 'This species lives in groups of a dozen or more. What is the social hierarchy? How is status measured and judged?',
  spades: 'Dozens, hundreds, or thousands of this species live together. What is the collective noun for these creatures?'
};

/* --- scene prompts (rank only; suit is ignored) --- */
const SCENE_RANK = {
  A: 'Daily routines',
  '2': 'Child rearing',
  '3': 'Rest, leisure, or play',
  '4': 'A hearty meal',
  '5': 'What lies beneath',
  '6': 'On the prowl',
  '7': 'Who watches whom',
  '8': "Biding one's time",
  '9': 'Risk and reward',
  '10': 'A tough life lesson',
  J: 'Pursuit or defense',
  Q: 'Mates or rivals',
  K: 'A birth or death'
};

/* The three lenses offered in "Nature in Motion". */
const FRAMES = ['A nature documentary, complete with musical underscoring and narration.', "Field biologists, documenting research notes in a written or audio journal.", 'The creature’s own point of view, without any human onlookers present.'];

/* The three roles a creature card can play, by position in the row. */
const ROLES = [{
  key: 'desc',
  title: 'A general description'
}, {
  key: 'feature',
  title: 'A distinctive feature'
}, {
  key: 'habits',
  title: 'Habits and personality'
}];
const ABOUT_TEXT = `EXQUISITE BIOME
A game of speculative biology
By Caro Asercion (seaexcursion.itch.io)
With art by Si Sweetman (sifsweetman.com)

A digital tribute by Jesse Mann.
This app carries no art from the original.

THE BIRD'S EYE VIEW

Exquisite Biome is a game about the natural world, the creatures that inhabit it, and the ways they live alongside each other.

During play, you will generate an ecosystem and use prompts and questions to create and discover the creatures that live there. In the physical game you play it with a standard 52-card deck and a journal; here the app deals the cards and keeps the journal.

SAFETY & COMFORT

Exquisite Biome draws inspiration from nature and the natural world. If there are topics or themes that you do not want to explore in your game, note them as lines and veils. Lines are subjects that you don't want to include in your game; veils are subjects that you might include, but agree not to discuss in vivid detail. You can always update these lists throughout the game.

Some of the prompts in this game delve into territory that you might have included in your lines or veils. You may always read the prompts before answering them, and curate your play experience. If you encounter a prompt you do not want to use, you can change it, sidestep it, or draw a different card instead. Player safety and enjoyment is always more important than following the game rules.

HOW A GAME GOES

Two biome cards frame the environment. Three creature cards are then laid in a row: the first describes the creature, the second gives it a distinctive feature, the third sets its habits and personality. After answering the prompts, you play out a brief scene and name the species.

Then the left-most card moves to the far right, and the same three cards — in their new order — describe a second creature. Repeat once more for a third. Finally, frame one scene of all three creatures coexisting.

THE FIRST BIOME CARD: THE REGION AT A MACROSCOPIC LEVEL

Rank — environmental focus
A. Desert
2. Tundra or wasteland
3. Scrub or grassland
4. Temperate forest
5. Tropical forest, jungle
6. Snow forest, taiga
7. Mountain
8. Glacier or fjord
9. Floodplain
10. Lagoon or cove
J. Shoreline or coast
Q. Stream or river
K. Wetland or marsh

Suit — the current season
Hearts - The season is warm and wet
Diamonds - The season is warm and dry
Clubs - The season is cool and dry
Spades - The season is cool and wet

THE SECOND BIOME CARD: ADDITIONAL CONTEXT AND DETAIL

Rank — a detail about the environment
A. Waterfall
2. Cavern or tunnel
3. Canyon or valley
4. Flowering plants
5. Island
6. Lake or spring
7. Strong winds
8. Extreme temperature
9. High altitude
10. Low altitude
J. Dormant volcano
Q. Volatile weather patterns
K. Partially or fully submerged

Suit — the time of day
Hearts - Early morning
Diamonds - Midday
Clubs - Afternoon or twilight
Spades - Deep night

Some of these prompts may overlap, contradict each other, or raise further questions. What does the dry season look like in this wetland? What is a "high-altitude shoreline"? If you don't have an answer, make something up.

THE FIRST CREATURE CARD: A GENERAL DESCRIPTION

Rank — an ecological niche
A. Pollinator or plant spreader
2. Grain or seed-eater
3. Leaf, shrub, or fruit eater
4. Grass, moss, or algae eater
5. Insect forager
6. Climber or tree-dweller
7. Burrower or builder
8. Flyer or glider
9. Decomposer or recycler
10. Scavenger or thief
J. Generalist omnivore
Q. Ambush predator
K. Apex predator

Suit — taxonomy
Hearts - Mammal (e.g. rodents, big cats, ungulates, marsupials, mustelids, canids, cetaceans)
Diamonds - Bird or fish (e.g. raptors, songbirds, flightless birds, corvids, sharks, eels, rays)
Clubs - Reptile or amphibian (e.g. crocodilians, sauropods, lizards, frogs, salamanders)
Spades - Invertebrate (e.g. insects, squid, arachnids, molluscs, crustaceans, cnidarians)

THE SECOND CREATURE CARD: A DISTINCTIVE FEATURE

Red suit — diamonds or hearts
A. Long tail. Stiff? Flexible? Prehensile?
2. Broad claws or talons. What are they used for?
3. Beak or bill. What tool or object does it resemble?
4. Spines or spikes. How long? Where are they placed?
5. Curious jaws, teeth, or tusks. How many? What shape?
6. More or fewer appendages. How many?
7. Powerful hind limbs. For jumping? Running? Kicking?
8. Leathery wings or hide. How thick?
9. Captivating eyes. What size? What color?
10. Specialized diet. What does it eat? What makes it specialized?
J. Strange gills or lungs. What does it breathe? How?
Q. Bioluminescence. Where on its body?
K. Camouflage or mimicry. What does it disguise itself as?

Black suit — spades or clubs
A. Short tail. Or no tail at all?
2. Small, flat feet. Hooves? Paws? Fins?
3. Distinctive muzzle or snout. What shape is its head?
4. Hard carapace. Dull and flat, or shiny and reflective?
5. Horns or antlers. Or both?
6. Iconic patterns. Spots? Stripes? What colors? What shapes?
7. Prehensile digits. Fingers? Tentacles? What do they grasp?
8. Broad feathers or scales. Does it molt or shed? How often?
9. Whiskers or antennae. Spread out or clustered? Short or long?
10. Noisy. What does it sound like?
J. Iconic ears. What shape? What purpose?
Q. Poison or venom sacs. Where are they located?
K. Vivid coloration. To warn, or entice?

THE THIRD CREATURE CARD: HABITS AND PERSONALITY

Rank — environmental behavior
A. Invasive species. This creature is not native to this region. What allows it to thrive here? What does it threaten?
2. Endangered. This creature's species is at risk of extinction. What forces endanger its livelihood?
3. Migratory. This creature travels through and beyond this region. What is its final destination? What does it do there?
4. Endemic. This species is found exclusively in this particular region. What prevents it from traveling beyond?
5. Dwellings or nests. This creature makes its home of strange material. How does it use its environment?
6. Offspring. This creature has a distinct method of reproduction or child-rearing. Why is it noteworthy?
7. Folkloric. There is a well-known myth or fable about this animal. How is it characterized?
8. Tool user. This creature can operate crude or makeshift tools. What are they made of? What are they used for?
9. Courtship displays. This creature has a distinctive mating ritual. What does it encompass?
10. Life cycle. This creature undergoes metamorphosis. How many stages? How do they differ? What stage is it in now?
J. Sexual dimorphism. This species' two or more sexes exhibit different characteristics. Size? Color? Something else?
Q. Hibernating. This creature is dormant during certain times of year. How soon before it retires again?
K. Sedentary lifestyle. This creature does not move often. What is enough to stir its attention?

Suit — social groupings
Hearts - A solitary species. What happens when two meet?
Diamonds - This species lives in very small groups. Mated pairs, a family unit, or some other arrangement?
Clubs - This species lives in groups of a dozen or more. What is the social hierarchy? How is status measured and judged?
Spades - Dozens, hundreds, or thousands of this species live together. What is the collective noun for these creatures?

SCENE PROMPTS

A. Daily routines
2. Child rearing
3. Rest, leisure, or play
4. A hearty meal
5. What lies beneath
6. On the prowl
7. Who watches whom
8. Biding one's time
9. Risk and reward
10. A tough life lesson
J. Pursuit or defense
Q. Mates or rivals
K. A birth or death

ATTRIBUTION

Exquisite Biome v1.0 published September 2022. It takes inspiration from Voyage by Brendan McLeod (sulcata.itch.io) and Alone Among the Stars by Takuma Okada (noroadhome.itch.io).`;
const NAME_LIMIT = 32;
const STORE_KEY = 'eb.archive';
const SESSION_KEY = 'eb.session';
const ARCHIVE_FORMAT = 'eb-archive';
const ARCHIVE_VERSION = 1;

/* ============================================================
   DECK / PROMPT HELPERS
   ============================================================ */
function buildDeck() {
  const deck = [];
  for (const suit of SUIT_ORDER) for (const rank of RANK_ORDER) deck.push({
    rank,
    suit
  });
  return deck;
}
function shuffle(a) {
  const d = a.slice();
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}
/* Draw n cards off the end of `deck`, returning [drawn, remainingDeck].
   One deck lasts a whole expedition; if it ever runs dry mid-draw (long games
   with several rounds), a fresh shuffled deck takes over. */
function drawCards(deck, n) {
  let d = (deck || []).slice();
  const out = [];
  for (let i = 0; i < n; i++) {
    if (d.length === 0) d = shuffle(buildDeck());
    out.push(d.pop());
  }
  return [out, d];
}
function isRed(card) {
  return SUITS[card.suit].red;
}
function cardText(card) {
  return card.rank + SUITS[card.suit].glyph;
}
function biomePrompts(cards) {
  if (!cards || cards.length < 2) return [];
  return [{
    label: 'Environmental focus',
    text: B1_RANK[cards[0].rank]
  }, {
    label: 'The current season',
    text: B1_SUIT[cards[0].suit]
  }, {
    label: 'A detail about the environment',
    text: B2_RANK[cards[1].rank]
  }, {
    label: 'The time of day',
    text: B2_SUIT[cards[1].suit]
  }];
}
/* The prompts a card carries when it sits in a given role. */
function creaturePrompts(roleKey, card) {
  if (!card) return [];
  if (roleKey === 'desc') return [{
    label: 'An ecological niche',
    text: C1_RANK[card.rank]
  }, {
    label: 'Taxonomy',
    text: C1_SUIT[card.suit]
  }];
  if (roleKey === 'feature') return [
  // Labelled by color, since color — not suit — picks the table.
  {
    label: isRed(card) ? 'Red suit — diamonds or hearts' : 'Black suit — spades or clubs',
    text: isRed(card) ? C2_RED[card.rank] : C2_BLACK[card.rank]
  }];
  return [{
    label: 'Environmental behavior',
    text: C3_RANK[card.rank]
  }, {
    label: 'Social groupings',
    text: C3_SUIT[card.suit]
  }];
}
/* Creature i reads the row rotated i places: the left-most card keeps moving
   to the far right, so each card plays each role exactly once. */
function rotate(base, i) {
  return [base[i % 3], base[(i + 1) % 3], base[(i + 2) % 3]];
}
function biomeSummary(cards) {
  return biomePrompts(cards).map(p => p.text).join(' · ');
}

/* ============================================================
   STORAGE
   ============================================================ */
function loadArchive() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveArchive(arr) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(arr));
  } catch (e) {}
}
/* An expedition runs long — three species, four scenes. Unlike a short
   planet-hop, losing it to a backgrounded tab would hurt, so the in-progress
   session is mirrored to localStorage and offered back on the title screen. */
function loadSavedSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch (e) {
    return null;
  }
}
function persistSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));else localStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}
function fmtDate(ms) {
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

/* ============================================================
   SESSION SHAPE
   ============================================================ */
function newCreature(base, i) {
  return {
    name: '',
    cards: rotate(base, i),
    entries: {
      desc: '',
      feature: '',
      habits: ''
    },
    done: {
      desc: false,
      feature: false,
      habits: false
    },
    scene: {
      frame: '',
      promptCard: null,
      body: ''
    }
  };
}
function newRound(biome, base) {
  return {
    biome,
    // { cards, body, name, inherited }
    base,
    // the three creature cards, in dealt order
    creatures: [newCreature(base, 0)],
    creatureIndex: 0,
    finalScene: {
      frame: '',
      promptCard: null,
      body: ''
    }
  };
}

/* ============================================================
   EXPORT — a shareable PNG of one expedition's field journal.
   Same two-pass measure/paint trick as the layout it's modelled on:
   one code path runs without painting to size the canvas exactly.
   ============================================================ */
const EXP = {
  W: 1000,
  PAD: 60,
  ink: '#000',
  red: '#c00'
};
function expWrap(ctx, text, maxW) {
  const lines = [];
  for (const para of String(text || '').split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (line && ctx.measureText(t).width > maxW) {
        lines.push(line);
        line = w;
      } else line = t;
    }
    lines.push(line);
  }
  return lines;
}
function expCard(ctx, x, y, card, draw) {
  const W = 56,
    H = 80;
  if (draw) {
    ctx.strokeStyle = EXP.ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, W - 2, H - 2);
    ctx.fillStyle = isRed(card) ? EXP.red : EXP.ink;
    ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.rank, x + W / 2, y + H / 2 - 11);
    ctx.font = '22px Arial, Helvetica, sans-serif';
    ctx.fillText(SUITS[card.suit].glyph, x + W / 2, y + H / 2 + 14);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
  return W;
}
function paintExport(ctx, rec, sketchImg, measureOnly) {
  const {
      W,
      PAD
    } = EXP,
    CW = W - 2 * PAD;
  const draw = !measureOnly;
  if (draw) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, ctx.canvas.height);
  }
  let y = PAD;
  const line = () => {
    if (draw) {
      ctx.fillStyle = EXP.ink;
      ctx.fillRect(PAD, y, CW, 2);
    }
    y += 2;
  };
  const text = (str, font, gap, lead) => {
    if (!str) return;
    ctx.font = font;
    const lines = expWrap(ctx, str, CW);
    if (draw) {
      ctx.fillStyle = EXP.ink;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      lines.forEach((ln, k) => ctx.fillText(ln, PAD, y + lead * 0.78 + k * lead));
    }
    y += lines.length * lead + (gap || 0);
  };
  const cardRow = cards => {
    if (draw) cards.forEach((c, i) => expCard(ctx, PAD + i * 70, y, c, true));
    y += 80 + 16;
  };
  text(rec.name, 'bold 40px Arial, Helvetica, sans-serif', 8, 46);
  const speciesCount = rec.rounds.reduce((n, r) => n + r.creatures.filter(c => c.name).length, 0);
  text(`Exquisite Biome · ${fmtDate(rec.createdAt)} · ${speciesCount} species`, '20px Arial, Helvetica, sans-serif', 22, 26);
  line();
  y += 26;
  if (rec.realism) {
    text('LEVEL OF REALISM', 'bold 16px Arial, Helvetica, sans-serif', 4, 20);
    text(rec.realism, '20px Arial, Helvetica, sans-serif', 20, 28);
  }
  if (rec.linesVeils) {
    text('LINES AND VEILS', 'bold 16px Arial, Helvetica, sans-serif', 4, 20);
    text(rec.linesVeils, '20px Arial, Helvetica, sans-serif', 20, 28);
  }
  rec.rounds.forEach((r, ri) => {
    line();
    y += 26;
    text(ri === 0 ? 'THE LAY OF THE LAND' : 'THE LAY OF THE LAND — CONTINUED', 'bold 16px Arial, Helvetica, sans-serif', 12, 20);
    cardRow(r.biome.cards);
    biomePrompts(r.biome.cards).forEach(p => {
      text(p.label.toUpperCase(), 'bold 15px Arial, Helvetica, sans-serif', 2, 18);
      text(p.text, '20px Arial, Helvetica, sans-serif', 12, 28);
    });
    text(r.biome.body, '20px Arial, Helvetica, sans-serif', 24, 28);
    r.creatures.forEach(cr => {
      if (!cr.name) return;
      line();
      y += 26;
      text(cr.name, 'bold 28px Arial, Helvetica, sans-serif', 14, 34);
      cardRow(cr.cards);
      ROLES.forEach((role, i) => {
        text(role.title.toUpperCase(), 'bold 15px Arial, Helvetica, sans-serif', 4, 18);
        creaturePrompts(role.key, cr.cards[i]).forEach(p => text(p.text, 'italic 20px Arial, Helvetica, sans-serif', 6, 28));
        text(cr.entries[role.key], '20px Arial, Helvetica, sans-serif', 18, 28);
      });
      if (cr.scene.body || cr.scene.frame) {
        text('SCENE', 'bold 15px Arial, Helvetica, sans-serif', 4, 18);
        if (cr.scene.frame) text(cr.scene.frame, 'italic 20px Arial, Helvetica, sans-serif', 6, 28);
        if (cr.scene.promptCard) text(`Scene prompt: ${SCENE_RANK[cr.scene.promptCard.rank]}`, 'italic 20px Arial, Helvetica, sans-serif', 6, 28);
        text(cr.scene.body, '20px Arial, Helvetica, sans-serif', 18, 28);
      }
    });
    if (r.finalScene.body || r.finalScene.frame) {
      line();
      y += 26;
      text('CREATURE COMFORTS', 'bold 16px Arial, Helvetica, sans-serif', 10, 20);
      if (r.finalScene.frame) text(r.finalScene.frame, 'italic 20px Arial, Helvetica, sans-serif', 6, 28);
      if (r.finalScene.promptCard) text(`Scene prompt: ${SCENE_RANK[r.finalScene.promptCard.rank]}`, 'italic 20px Arial, Helvetica, sans-serif', 6, 28);
      text(r.finalScene.body, '20px Arial, Helvetica, sans-serif', 18, 28);
    }
  });
  if (sketchImg) {
    line();
    y += 26;
    const sh = Math.round(CW * sketchImg.height / sketchImg.width);
    if (draw) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sketchImg, PAD, y, CW, sh);
      ctx.strokeStyle = EXP.ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(PAD + 1, y + 1, CW - 2, sh - 2);
    }
    y += sh + 20;
  }
  return y + PAD;
}
async function renderExport(rec) {
  const sketchImg = rec.sketch ? await new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = rec.sketch;
  }) : null;
  const measure = document.createElement('canvas');
  measure.width = measure.height = 1;
  const H = Math.ceil(paintExport(measure.getContext('2d'), rec, sketchImg, true));
  const canvas = document.createElement('canvas');
  canvas.width = EXP.W;
  canvas.height = H;
  paintExport(canvas.getContext('2d'), rec, sketchImg, false);
  return canvas;
}

/* ============================================================
   PRESENTATIONAL COMPONENTS
   ============================================================ */
function Card({
  card,
  variant = '',
  selected = false
}) {
  const cls = ['card', variant];
  if (!card) return /*#__PURE__*/React.createElement("div", {
    className: cls.concat('back').join(' ')
  });
  if (isRed(card)) cls.push('red');
  if (selected) cls.push('sel');
  return /*#__PURE__*/React.createElement("div", {
    className: cls.filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("span", {
    className: "rk"
  }, card.rank), /*#__PURE__*/React.createElement("span", {
    className: "st"
  }, SUITS[card.suit].glyph));
}
function Prompt({
  label,
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "prompt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, label), /*#__PURE__*/React.createElement("div", null, text));
}
function Chrome({
  onHome,
  onHelp
}) {
  // Both slots always render so space-between keeps Home left / Help right.
  return /*#__PURE__*/React.createElement("div", {
    className: "chrome-bar"
  }, onHome ? /*#__PURE__*/React.createElement("button", {
    className: "chrome",
    "aria-label": "Home",
    onClick: onHome
  }, "Home") : /*#__PURE__*/React.createElement("span", {
    className: "chrome-spacer",
    "aria-hidden": "true"
  }), onHelp ? /*#__PURE__*/React.createElement("button", {
    className: "chrome",
    "aria-label": "Rules",
    onClick: onHelp
  }, "?") : /*#__PURE__*/React.createElement("span", {
    className: "chrome-spacer",
    "aria-hidden": "true"
  }));
}

/* ============================================================
   APP
   ============================================================ */
function App() {
  const [screen, setScreen] = useState('title');
  const [overlay, setOverlay] = useState(null); // 'help' | 'home' | 'burn' | 'goback' | 'restart'
  const [archive, setArchive] = useState(loadArchive);
  const [session, setSession] = useState(null);
  const [saved, setSaved] = useState(loadSavedSession);
  const [roleKey, setRoleKey] = useState(null); // creature role being written
  const [draft, setDraft] = useState('');
  const [sceneTarget, setSceneTarget] = useState('creature'); // 'creature' | 'final'
  const [viewId, setViewId] = useState(null);
  const [toast, setToast] = useState(null);
  const [sharing, setSharing] = useState(false);
  const restoreInputRef = useRef(null);

  // Mirror every session change to storage so a backgrounded tab can resume.
  // Only writes: clearing the saved expedition is always explicit (publish,
  // burn, start-over), so navigating home leaves it intact to resume later.
  useEffect(() => {
    if (session) {
      persistSession(session);
      setSaved(session);
    }
  }, [session]);
  const round = session ? session.rounds[session.rounds.length - 1] : null;
  const creature = round ? round.creatures[round.creatureIndex] : null;

  /* State is plain JSON, so a clone-then-mutate edit keeps call sites readable
     without hand-threading spreads through four levels of nesting. */
  function edit(fn) {
    setSession(s => {
      if (!s) return s;
      const n = JSON.parse(JSON.stringify(s));
      fn(n, n.rounds[n.rounds.length - 1]);
      return n;
    });
  }

  /* ---------- navigation ---------- */
  function goTitle() {
    setSession(null);
    setRoleKey(null);
    setDraft('');
    setOverlay(null);
    setScreen('title');
  }
  function startNew() {
    setSession({
      id: 'e' + Date.now() + Math.floor(Math.random() * 1000),
      createdAt: Date.now(),
      realism: '',
      linesVeils: '',
      deck: shuffle(buildDeck()),
      rounds: [],
      sketch: null
    });
    setScreen('setup');
  }
  function resume() {
    setSession(saved);
    setScreen(saved && saved.rounds.length ? 'creatureRow' : 'setup');
  }
  function drawBiome() {
    edit(s => {
      const [cards, deck] = drawCards(s.deck, 2);
      const [base, deck2] = drawCards(deck, 3);
      s.deck = deck2;
      s.rounds.push(newRound({
        cards,
        body: '',
        name: '',
        inherited: false
      }, base));
    });
    setScreen('biomeReveal');
  }
  function redrawBiomeCard(i) {
    edit((s, r) => {
      const [cards, deck] = drawCards(s.deck, 1);
      s.deck = deck;
      r.biome.cards[i] = cards[0];
    });
  }

  /* Replace one creature card. Row position p in creature i maps back to
     base index (i + p) % 3, so the rotation keeps working afterwards. */
  function redrawCreatureCard(p) {
    edit((s, r) => {
      const [cards, deck] = drawCards(s.deck, 1);
      s.deck = deck;
      const cr = r.creatures[r.creatureIndex];
      r.base[(r.creatureIndex + p) % 3] = cards[0];
      cr.cards[p] = cards[0];
      cr.entries[ROLES[p].key] = '';
      cr.done[ROLES[p].key] = false;
    });
    setDraft('');
  }
  function openRole(key) {
    setRoleKey(key);
    setDraft(creature ? creature.entries[key] : '');
    setScreen('creatureEntry');
  }
  function saveRole() {
    edit((s, r) => {
      const cr = r.creatures[r.creatureIndex];
      cr.entries[roleKey] = draft;
      cr.done[roleKey] = true;
    });
    setRoleKey(null);
    setDraft('');
    setScreen('creatureRow');
  }
  function openScene(target) {
    setSceneTarget(target);
    setScreen('sceneFrame');
  }
  function setFrame(frame) {
    edit((s, r) => {
      const t = sceneTarget === 'final' ? r.finalScene : r.creatures[r.creatureIndex].scene;
      t.frame = frame;
    });
  }
  function drawScenePrompt() {
    edit((s, r) => {
      const [cards, deck] = drawCards(s.deck, 1);
      s.deck = deck;
      const t = sceneTarget === 'final' ? r.finalScene : r.creatures[r.creatureIndex].scene;
      t.promptCard = cards[0];
    });
  }
  function saveScene() {
    const target = sceneTarget;
    edit((s, r) => {
      const t = target === 'final' ? r.finalScene : r.creatures[r.creatureIndex].scene;
      t.body = draft;
    });
    setDraft('');
    if (target === 'final') {
      setScreen('continue');
      return;
    }
    // Third creature done -> the final coexistence scene; otherwise rotate.
    if (round.creatureIndex >= 2) setScreen('finalIntro');else setScreen('rotate');
  }
  function advanceCreature() {
    edit((s, r) => {
      r.creatureIndex += 1;
      if (!r.creatures[r.creatureIndex]) r.creatures[r.creatureIndex] = newCreature(r.base, r.creatureIndex);
    });
    setScreen('creatureRow');
  }

  /* Continue play: a new biome, or new creatures in the one you're in. */
  function continueNewBiome() {
    edit(s => {
      const [cards, deck] = drawCards(s.deck, 2);
      const [base, deck2] = drawCards(deck, 3);
      s.deck = deck2;
      s.rounds.push(newRound({
        cards,
        body: '',
        name: '',
        inherited: false
      }, base));
    });
    setScreen('biomeReveal');
  }
  function continueSameBiome() {
    edit(s => {
      const prev = s.rounds[s.rounds.length - 1];
      const [base, deck] = drawCards(s.deck, 3);
      s.deck = deck;
      s.rounds.push(newRound({
        ...JSON.parse(JSON.stringify(prev.biome)),
        inherited: true
      }, base));
    });
    setScreen('creatureRow');
  }

  /* ---------- finishing ---------- */
  function finishSketch(dataURL) {
    edit(s => {
      s.sketch = dataURL;
    });
    publish(dataURL);
  }
  function skipSketch() {
    publish(null);
  }
  function publish(sketch) {
    const rec = {
      id: session.id,
      name: (session.rounds[0].biome.name || 'Unnamed biome').trim(),
      createdAt: session.createdAt,
      realism: session.realism,
      linesVeils: session.linesVeils,
      rounds: session.rounds,
      sketch: sketch || session.sketch || null
    };
    const next = [rec, ...archive];
    setArchive(next);
    saveArchive(next);
    persistSession(null);
    setSaved(null);
    setSession(null);
    setRoleKey(null);
    setDraft('');
    setScreen('archive');
  }
  function burnSession() {
    persistSession(null);
    setSaved(null);
    setOverlay(null);
    goTitle();
  }
  function burnRecord(id) {
    const next = archive.filter(r => r.id !== id);
    setArchive(next);
    saveArchive(next);
    setOverlay(null);
    setViewId(null);
    setScreen('archive');
  }

  /* ---------- share / save / restore ---------- */
  async function shareRecord(rec) {
    if (sharing) return;
    setSharing(true);
    try {
      const canvas = await renderExport(rec);
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      const slug = (rec.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'biome';
      const file = new File([blob], slug + '-field-journal.png', {
        type: 'image/png'
      });
      if (navigator.canShare && navigator.canShare({
        files: [file]
      })) {
        try {
          await navigator.share({
            files: [file]
          });
        } catch (err) {
          if (!err || err.name !== 'AbortError') downloadBlob(blob, file.name);
        }
      } else {
        downloadBlob(blob, file.name);
      }
    } catch (e) {/* export failed; the journal is untouched */} finally {
      setSharing(false);
    }
  }
  function exportArchive() {
    const payload = {
      format: ARCHIVE_FORMAT,
      version: ARCHIVE_VERSION,
      exportedAt: new Date().toISOString(),
      recordCount: archive.length,
      records: archive
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const d = new Date(),
      p2 = n => String(n).padStart(2, '0');
    downloadBlob(blob, `exquisite-biome-archive-${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}.json`);
  }
  function requestRestore() {
    if (restoreInputRef.current) restoreInputRef.current.click();
  }
  // Merge by id: restoring twice is harmless and never removes local records.
  function onRestoreFile(ev) {
    const f = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      let records = null;
      try {
        const data = JSON.parse(reader.result);
        if (data && data.format === ARCHIVE_FORMAT && Array.isArray(data.records)) records = data.records;else if (Array.isArray(data)) records = data;
      } catch (e) {}
      if (!records) {
        setToast("This doesn't look like an archive file.");
        return;
      }
      const valid = records.filter(r => r && r.id && Array.isArray(r.rounds));
      const have = new Set(archive.map(r => r.id));
      const fresh = valid.filter(r => !have.has(r.id));
      if (fresh.length === 0) {
        setToast('Nothing new to restore.');
        return;
      }
      const next = [...fresh, ...archive].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setArchive(next);
      saveArchive(next);
      setToast(`${fresh.length} ${fresh.length === 1 ? 'expedition' : 'expeditions'} restored.`);
    };
    reader.readAsText(f);
  }

  /* ---------- chrome ---------- */
  function onHome() {
    if (screen === 'archive' || screen === 'record') {
      goTitle();
    } else {
      setOverlay('home');
    }
  }
  const help = () => setOverlay('help');

  /* ============================================================
     SCREENS
     ============================================================ */
  function Title() {
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("h1", null, "Exquisite Biome"), /*#__PURE__*/React.createElement("p", {
      className: "meta"
    }, "A game of speculative biology", /*#__PURE__*/React.createElement("br", null), "By Caro Asercion"), /*#__PURE__*/React.createElement("div", {
      className: "btn-stack",
      style: {
        marginTop: '16px'
      }
    }, saved ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: resume
    }, "Resume expedition"), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => setOverlay('restart')
    }, "Start over")) : /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: startNew
    }, "Begin"), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => {
        setToast(null);
        setScreen('archive');
      }
    }, "Archive"))), /*#__PURE__*/React.createElement(Chrome, {
      onHelp: help
    }));
  }
  function Setup() {
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("h2", null, "Preparing to Play"), /*#__PURE__*/React.createElement("p", null, "Before you begin, decide the level of realism you wish to explore. You may create a science fiction or fantasy setting, encountering aliens or monsters that could never exist on Earth. On the other hand, you may wish to keep your game quite grounded, and discover animals that could plausibly exist in the real world."), /*#__PURE__*/React.createElement("div", {
      className: "label",
      style: {
        marginTop: '12px'
      }
    }, "Level of realism (optional)"), /*#__PURE__*/React.createElement("textarea", {
      className: "field short",
      value: session.realism,
      onChange: e => {
        const v = e.target.value;
        edit(s => {
          s.realism = v;
        });
      }
    }), /*#__PURE__*/React.createElement("h2", {
      style: {
        marginTop: '20px'
      }
    }, "Safety & comfort"), /*#__PURE__*/React.createElement("p", null, "Exquisite Biome is a game that draws inspiration from nature and the natural world. If there are topics or themes that you do not want to explore in your game, now is an opportunity to address those. Lines are subjects that you don\u2019t want to include in your game; veils are subjects that you might include, but agree not to discuss in vivid detail. You can always update these lists throughout the game."), /*#__PURE__*/React.createElement("p", null, "Potential lines and veils might include: snakes, spiders, insect infestations, cramped or confined spaces, descriptions of violence or gore, animal mimicry."), /*#__PURE__*/React.createElement("div", {
      className: "label",
      style: {
        marginTop: '12px'
      }
    }, "Lines and veils (optional)"), /*#__PURE__*/React.createElement("textarea", {
      className: "field short",
      value: session.linesVeils,
      onChange: e => {
        const v = e.target.value;
        edit(s => {
          s.linesVeils = v;
        });
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => setOverlay('home')
    }, "Back"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => setScreen('biomeDraw')
    }, "Continue")), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function BiomeDraw() {
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("h2", null, "The Lay of the Land"), /*#__PURE__*/React.createElement("p", null, "Draw two cards. These are your biome cards, which you will use to frame the environment in which your creatures dwell."), /*#__PURE__*/React.createElement("div", {
      className: "card-row",
      style: {
        margin: '8px 0'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      variant: "lg"
    }), /*#__PURE__*/React.createElement(Card, {
      variant: "lg"
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: drawBiome
    }, "Draw two cards")), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function BiomeReveal() {
    const cards = round.biome.cards;
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-row",
      style: {
        marginBottom: '16px'
      }
    }, cards.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "card-slot",
      style: {
        width: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      card: c,
      variant: "lg"
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn small",
      onClick: () => redrawBiomeCard(i)
    }, "Redraw")))), /*#__PURE__*/React.createElement("div", {
      className: "box"
    }, biomePrompts(cards).map((p, i) => /*#__PURE__*/React.createElement(Prompt, _extends({
      key: i
    }, p)))), /*#__PURE__*/React.createElement("p", {
      className: "meta"
    }, "Some of these prompts may overlap, contradict each other, or raise further questions. What does the dry season look like in this wetland? What is a \u201Chigh-altitude shoreline\u201D? If you don\u2019t have an answer, make something up."), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => {
        setDraft(round.biome.body);
        setScreen('biomeEntry');
      }
    }, "Describe the biome")), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function BiomeEntry() {
    const cards = round.biome.cards;
    return /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "entry-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-row",
      style: {
        justifyContent: 'flex-start',
        marginBottom: '8px'
      }
    }, cards.map((c, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      card: c,
      variant: "sm"
    }))), biomePrompts(cards).map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "meta"
    }, p.text))), /*#__PURE__*/React.createElement("textarea", {
      className: "field",
      placeholder: "Describe this environment...",
      value: draft,
      autoFocus: true,
      onChange: e => setDraft(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => {
        if (draft !== round.biome.body) setOverlay('goback');else setScreen('biomeReveal');
      }
    }, "Go back"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => {
        const v = draft;
        edit((s, r) => {
          r.biome.body = v;
        });
        setDraft(round.biome.name || '');
        setScreen('biomeName');
      }
    }, "Save")));
  }
  function BiomeName() {
    const valid = draft.trim().length > 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("h2", null, "Give this biome a name."), /*#__PURE__*/React.createElement("p", {
      className: "meta"
    }, "Used to file this expedition in the archive."), /*#__PURE__*/React.createElement("input", {
      className: "name-field",
      maxLength: NAME_LIMIT,
      value: draft,
      placeholder: "Name",
      onChange: e => setDraft(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      className: "btn-stack",
      style: {
        marginTop: '8px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      disabled: !valid,
      onClick: () => {
        const v = draft.trim();
        edit((s, r) => {
          r.biome.name = v;
        });
        setDraft('');
        setScreen('creatureRow');
      }
    }, "Continue"), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => {
        setDraft(round.biome.body);
        setScreen('biomeEntry');
      }
    }, "Go back"))), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function CreatureRow() {
    const allDone = ROLES.every(r => creature.done[r.key]);
    const n = round.creatureIndex + 1;
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "step"
    }, "Creature ", n, " of 3"), /*#__PURE__*/React.createElement("div", {
      className: "box tight"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "Biome", round.biome.inherited ? ' (continued)' : ''), /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, round.biome.name ? round.biome.name + ' — ' : '', biomeSummary(round.biome.cards))), /*#__PURE__*/React.createElement("div", {
      className: "card-row",
      style: {
        margin: '16px 0'
      }
    }, ROLES.map((role, i) => /*#__PURE__*/React.createElement("div", {
      key: role.key,
      className: "card-slot"
    }, /*#__PURE__*/React.createElement("button", {
      className: "slot-tap",
      onClick: () => openRole(role.key)
    }, /*#__PURE__*/React.createElement(Card, {
      card: creature.cards[i],
      selected: creature.done[role.key]
    }), /*#__PURE__*/React.createElement("span", {
      className: "slot-label"
    }, role.title), /*#__PURE__*/React.createElement("span", {
      className: "slot-state"
    }, creature.done[role.key] ? '✓ written' : 'tap to write'))))), /*#__PURE__*/React.createElement("p", {
      className: "meta"
    }, "Each card has one or more prompts that correspond to its suit or rank. Respond to them in whichever order you please."), /*#__PURE__*/React.createElement("div", {
      className: "grow"
    }), /*#__PURE__*/React.createElement("div", {
      className: "stack"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      disabled: !allDone,
      onClick: () => {
        setDraft(creature.name || '');
        setScreen('creatureName');
      }
    }, allDone ? 'Name this species' : 'Answer all three cards to continue')), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function CreatureEntry() {
    const p = ROLES.findIndex(r => r.key === roleKey);
    const role = ROLES[p];
    const card = creature.cards[p];
    return /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "entry-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row",
      style: {
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      card: card,
      variant: "sm"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "label",
      style: {
        marginBottom: 0
      }
    }, role.title), /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, "Card ", p + 1, " of 3"))), creaturePrompts(roleKey, card).map((pr, i) => /*#__PURE__*/React.createElement(Prompt, _extends({
      key: i
    }, pr))), /*#__PURE__*/React.createElement("button", {
      className: "btn small",
      style: {
        marginTop: '8px'
      },
      onClick: () => redrawCreatureCard(p)
    }, "Draw a different card")), /*#__PURE__*/React.createElement("textarea", {
      className: "field",
      placeholder: "Respond to the prompts...",
      value: draft,
      autoFocus: true,
      onChange: e => setDraft(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => {
        if (draft !== creature.entries[roleKey]) setOverlay('goback');else {
          setRoleKey(null);
          setScreen('creatureRow');
        }
      }
    }, "Go back"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: saveRole
    }, "Save")));
  }
  function CreatureName() {
    const valid = draft.trim().length > 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("h2", null, "Give this species a name."), /*#__PURE__*/React.createElement("div", {
      className: "card-row"
    }, creature.cards.map((c, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      card: c,
      variant: "sm"
    }))), /*#__PURE__*/React.createElement("input", {
      className: "name-field",
      maxLength: NAME_LIMIT,
      value: draft,
      placeholder: "Name",
      onChange: e => setDraft(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      className: "btn-stack",
      style: {
        marginTop: '8px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      disabled: !valid,
      onClick: () => {
        const v = draft.trim();
        edit((s, r) => {
          r.creatures[r.creatureIndex].name = v;
        });
        setDraft('');
        openScene('creature');
      }
    }, "Continue"), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => {
        setDraft('');
        setScreen('creatureRow');
      }
    }, "Go back"))), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function FinalIntro() {
    const named = round.creatures.filter(c => c.name).map(c => c.name);
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("h2", null, "Creature Comforts"), /*#__PURE__*/React.createElement("p", null, "Frame one final scene of these creatures coexisting alongside each other. This is your chance to really play with the ways these creatures interact."), /*#__PURE__*/React.createElement("div", {
      className: "box",
      style: {
        width: '100%',
        textAlign: 'left'
      }
    }, named.map((n, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, n))), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => openScene('final')
    }, "Frame the scene")), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function SceneFrame() {
    const isFinal = sceneTarget === 'final';
    const target = isFinal ? round.finalScene : creature.scene;
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("h2", null, isFinal ? 'Creature Comforts' : 'Nature in Motion'), !isFinal && /*#__PURE__*/React.createElement("p", null, "Now you will play out a brief scene, highlighting this creature\u2019s features and traits in more detail."), /*#__PURE__*/React.createElement("p", null, "Establish the frame for this scene. What is the lens through which you\u2019re watching this creature\u2019s life?"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '12px'
      }
    }, FRAMES.map((f, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: 'option' + (target.frame === f ? ' on' : ''),
      onClick: () => setFrame(f)
    }, f))), /*#__PURE__*/React.createElement("div", {
      className: "box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "Scene prompt (optional)"), target.promptCard ? /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement(Card, {
      card: target.promptCard,
      variant: "sm"
    }), /*#__PURE__*/React.createElement("div", null, SCENE_RANK[target.promptCard.rank])) : /*#__PURE__*/React.createElement("p", {
      className: "meta"
    }, "If you need a scene prompt, draw one additional card and use the rank as extra inspiration. (Don\u2019t worry about the suit.)"), /*#__PURE__*/React.createElement("button", {
      className: "btn small",
      style: {
        marginTop: '10px'
      },
      onClick: drawScenePrompt
    }, target.promptCard ? 'Draw a different card' : 'Draw a scene prompt')), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => setScreen(isFinal ? 'finalIntro' : 'creatureRow')
    }, "Go back"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      disabled: !target.frame,
      onClick: () => {
        setDraft(target.body);
        setScreen('sceneEntry');
      }
    }, "Write the scene")), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function SceneEntry() {
    const isFinal = sceneTarget === 'final';
    const target = isFinal ? round.finalScene : creature.scene;
    return /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("div", {
      className: "entry-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, isFinal ? 'All three species' : creature.name), /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, target.frame), target.promptCard && /*#__PURE__*/React.createElement("div", {
      className: "meta",
      style: {
        marginTop: '6px'
      }
    }, "Scene prompt: ", SCENE_RANK[target.promptCard.rank], " (", cardText(target.promptCard), ")")), /*#__PURE__*/React.createElement("textarea", {
      className: "field",
      placeholder: "Play out the scene...",
      value: draft,
      autoFocus: true,
      onChange: e => setDraft(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => {
        if (draft !== target.body) setOverlay('goback');else setScreen('sceneFrame');
      }
    }, "Go back"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: saveScene
    }, "Save")));
  }
  function Rotate() {
    const before = creature.cards;
    const after = rotate(round.base, round.creatureIndex + 1);
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("h2", null, "Natural Selection"), /*#__PURE__*/React.createElement("p", null, "Move your left-most creature card to the far right, so that the cards are arranged in a new order. These same cards can be used, in their new order, to come up with another creature."), /*#__PURE__*/React.createElement("div", {
      className: "box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "Before"), /*#__PURE__*/React.createElement("div", {
      className: "card-row",
      style: {
        justifyContent: 'flex-start'
      }
    }, before.map((c, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      card: c,
      variant: "sm"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "label",
      style: {
        marginTop: '12px'
      }
    }, "After"), /*#__PURE__*/React.createElement("div", {
      className: "card-row",
      style: {
        justifyContent: 'flex-start'
      }
    }, after.map((c, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      card: c,
      variant: "sm"
    })))), /*#__PURE__*/React.createElement("p", null, "As you create this new animal, consider how it coexists with the previous species. Are they predator and prey? Do they have a symbiotic relationship? Do they ignore each other, or compete for territory?"), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions"
    }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: advanceCreature
    }, "Continue")), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function ContinueOrEnd() {
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("h2", null, "Continue playing, or end the game?"), /*#__PURE__*/React.createElement("p", null, "If you decide to continue, use this chance to take a break if needed, then draw two new biome cards to explore a new environment \u2014 or three new creature cards, if you wish to stay in the same biome."), /*#__PURE__*/React.createElement("div", {
      className: "btn-stack",
      style: {
        marginTop: '8px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: continueNewBiome
    }, "Draw a new biome"), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: continueSameBiome
    }, "New creatures, same biome"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => setScreen('ending')
    }, "End the game"))), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function Ending() {
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("h2", null, "Ending the game"), /*#__PURE__*/React.createElement("p", null, "You might wrap up by noting a detail from this expedition that delighted or surprised you."), /*#__PURE__*/React.createElement("p", null, "What would you like to do with your journal?"), /*#__PURE__*/React.createElement("div", {
      className: "btn-stack",
      style: {
        marginTop: '8px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => setScreen('sketch')
    }, "Keep it"), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => setOverlay('burn')
    }, "Burn it"))), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function Archive() {
    return /*#__PURE__*/React.createElement("div", {
      className: "screen with-chrome"
    }, /*#__PURE__*/React.createElement("h2", null, "Archive"), archive.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "center"
    }, /*#__PURE__*/React.createElement("p", {
      className: "empty"
    }, "No expeditions yet."), /*#__PURE__*/React.createElement("button", {
      className: "btn small",
      onClick: requestRestore
    }, "Restore archive")) : /*#__PURE__*/React.createElement(React.Fragment, null, archive.map(r => {
      const species = r.rounds.reduce((n, x) => n + x.creatures.filter(c => c.name).length, 0);
      return /*#__PURE__*/React.createElement("button", {
        key: r.id,
        className: "archive-item",
        onClick: () => {
          setViewId(r.id);
          setScreen('record');
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, r.name)), /*#__PURE__*/React.createElement("div", {
        className: "meta"
      }, fmtDate(r.createdAt), " \xB7 ", species, " ", species === 1 ? 'species' : 'species'));
    }), /*#__PURE__*/React.createElement("div", {
      className: "row center-row",
      style: {
        marginTop: '12px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn small",
      onClick: exportArchive
    }, "Save archive"), /*#__PURE__*/React.createElement("button", {
      className: "btn small",
      onClick: requestRestore
    }, "Restore"))), /*#__PURE__*/React.createElement("input", {
      ref: restoreInputRef,
      type: "file",
      accept: ".json,application/json",
      style: {
        display: 'none'
      },
      onChange: onRestoreFile
    }), toast && /*#__PURE__*/React.createElement("div", {
      className: "toast"
    }, /*#__PURE__*/React.createElement("span", null, toast), /*#__PURE__*/React.createElement("button", {
      "aria-label": "Dismiss",
      onClick: () => setToast(null)
    }, "\u2715")), /*#__PURE__*/React.createElement(Chrome, {
      onHome: onHome,
      onHelp: help
    }));
  }
  function Record() {
    const rec = archive.find(r => r.id === viewId);
    if (!rec) return Archive();
    return /*#__PURE__*/React.createElement("div", {
      className: "screen"
    }, /*#__PURE__*/React.createElement("button", {
      className: "close-x",
      "aria-label": "Close",
      onClick: () => setScreen('archive')
    }, "\u2715"), /*#__PURE__*/React.createElement("h1", null, rec.name), /*#__PURE__*/React.createElement("p", {
      className: "meta"
    }, fmtDate(rec.createdAt)), rec.realism && /*#__PURE__*/React.createElement("div", {
      className: "box",
      style: {
        marginTop: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "Level of realism"), /*#__PURE__*/React.createElement("div", {
      className: "body-text selectable"
    }, rec.realism)), rec.linesVeils && /*#__PURE__*/React.createElement("div", {
      className: "box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "Lines and veils"), /*#__PURE__*/React.createElement("div", {
      className: "body-text selectable"
    }, rec.linesVeils)), rec.rounds.map((r, ri) => /*#__PURE__*/React.createElement("div", {
      key: ri
    }, /*#__PURE__*/React.createElement("hr", {
      className: "divider"
    }), /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "The lay of the land", r.biome.inherited ? ' (continued)' : ''), /*#__PURE__*/React.createElement("div", {
      className: "card-row",
      style: {
        justifyContent: 'flex-start',
        margin: '8px 0'
      }
    }, r.biome.cards.map((c, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      card: c,
      variant: "sm"
    }))), biomePrompts(r.biome.cards).map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "meta"
    }, p.text)), /*#__PURE__*/React.createElement("p", {
      className: "body-text selectable",
      style: {
        marginTop: '8px'
      }
    }, r.biome.body), r.creatures.filter(c => c.name).map((cr, ci) => /*#__PURE__*/React.createElement("div", {
      key: ci
    }, /*#__PURE__*/React.createElement("hr", {
      className: "divider"
    }), /*#__PURE__*/React.createElement("h2", null, cr.name), ROLES.map((role, i) => /*#__PURE__*/React.createElement("div", {
      key: role.key,
      className: "box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row",
      style: {
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      card: cr.cards[i],
      variant: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      className: "label",
      style: {
        marginBottom: 0
      }
    }, role.title)), creaturePrompts(role.key, cr.cards[i]).map((p, k) => /*#__PURE__*/React.createElement("div", {
      key: k,
      className: "meta"
    }, p.text)), /*#__PURE__*/React.createElement("p", {
      className: "body-text selectable",
      style: {
        marginTop: '8px'
      }
    }, cr.entries[role.key]))), cr.scene.body && /*#__PURE__*/React.createElement("div", {
      className: "box"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "Scene"), /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, cr.scene.frame), cr.scene.promptCard && /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, "Scene prompt: ", SCENE_RANK[cr.scene.promptCard.rank]), /*#__PURE__*/React.createElement("p", {
      className: "body-text selectable",
      style: {
        marginTop: '8px'
      }
    }, cr.scene.body)))), r.finalScene.body && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
      className: "divider"
    }), /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, "Creature comforts"), /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, r.finalScene.frame), r.finalScene.promptCard && /*#__PURE__*/React.createElement("div", {
      className: "meta"
    }, "Scene prompt: ", SCENE_RANK[r.finalScene.promptCard.rank]), /*#__PURE__*/React.createElement("p", {
      className: "body-text selectable",
      style: {
        marginTop: '8px'
      }
    }, r.finalScene.body)))), rec.sketch && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
      className: "divider"
    }), /*#__PURE__*/React.createElement("img", {
      className: "sketch-img",
      src: rec.sketch,
      alt: "Sketch from this expedition"
    })), /*#__PURE__*/React.createElement("div", {
      className: "entry-actions",
      style: {
        marginTop: '20px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => setOverlay('burn')
    }, "Burn journal"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      disabled: sharing,
      onClick: () => shareRecord(rec)
    }, "Share")));
  }

  /* ---------- overlays ---------- */
  function Overlay() {
    if (overlay === 'help') {
      const notes = session && (session.realism || session.linesVeils);
      return /*#__PURE__*/React.createElement("div", {
        className: "overlay"
      }, /*#__PURE__*/React.createElement("button", {
        className: "close-x",
        "aria-label": "Close",
        onClick: () => setOverlay(null)
      }, "\u2715"), /*#__PURE__*/React.createElement("div", {
        className: "help-body selectable"
      }, notes ? [session.realism ? 'YOUR LEVEL OF REALISM\n' + session.realism + '\n\n' : '', session.linesVeils ? 'YOUR LINES AND VEILS\n' + session.linesVeils + '\n\n' : '', '—\n\n'].join('') : '', ABOUT_TEXT));
    }
    const box = (text, danger, onYes) => /*#__PURE__*/React.createElement("div", {
      className: "overlay confirm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "confirm-box"
    }, /*#__PURE__*/React.createElement("p", null, text), /*#__PURE__*/React.createElement("div", {
      className: "btn-stack"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: onYes
    }, danger), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => setOverlay(null)
    }, "Nevermind"))));
    if (overlay === 'home') return box('Go home? Your expedition is saved and you can resume it from the title screen.', 'Go home', () => {
      setOverlay(null);
      setSession(null);
      setScreen('title');
    });
    if (overlay === 'restart') return box('Start over? Your saved expedition will be lost.', 'Start over', () => {
      setOverlay(null);
      persistSession(null);
      setSaved(null);
      startNew();
    });
    if (overlay === 'burn') {
      const fromRecord = screen === 'record';
      return box('Are you sure? This journal will be gone for good.', 'Yes, burn it', () => fromRecord ? burnRecord(viewId) : burnSession());
    }
    if (overlay === 'goback') return box('Leave without saving? This entry will be lost.', 'Leave', () => {
      setOverlay(null);
      if (screen === 'creatureEntry') {
        setRoleKey(null);
        setScreen('creatureRow');
      } else if (screen === 'sceneEntry') {
        setScreen('sceneFrame');
      } else {
        setScreen('biomeReveal');
      }
    });
    return null;
  }

  /* ---------- screen switch ----------
     Screens are CALLED, not rendered as <Screen />. They're closures redefined
     on every App render, so as element types they'd be a brand-new component
     each time — React would unmount and remount the subtree on every keystroke,
     stealing focus from the textarea being typed into. Calling them inlines
     their elements into App's own tree, where reconciliation works normally. */
  let body;
  switch (screen) {
    case 'setup':
      body = Setup();
      break;
    case 'biomeDraw':
      body = BiomeDraw();
      break;
    case 'biomeReveal':
      body = BiomeReveal();
      break;
    case 'biomeEntry':
      body = BiomeEntry();
      break;
    case 'biomeName':
      body = BiomeName();
      break;
    case 'creatureRow':
      body = CreatureRow();
      break;
    case 'creatureEntry':
      body = CreatureEntry();
      break;
    case 'creatureName':
      body = CreatureName();
      break;
    case 'sceneFrame':
      body = SceneFrame();
      break;
    case 'sceneEntry':
      body = SceneEntry();
      break;
    case 'rotate':
      body = Rotate();
      break;
    case 'finalIntro':
      body = FinalIntro();
      break;
    case 'continue':
      body = ContinueOrEnd();
      break;
    case 'ending':
      body = Ending();
      break;
    case 'sketch':
      body = /*#__PURE__*/React.createElement(SketchScreen, {
        onAdd: finishSketch,
        onSkip: skipSketch,
        onHome: onHome,
        onHelp: help
      });
      break;
    case 'archive':
      body = Archive();
      break;
    case 'record':
      body = Record();
      break;
    default:
      body = Title();
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, body, Overlay());
}

/* ============================================================
   SKETCH — optional drawing space, kept as its own component so the
   canvas + tool state stay isolated from app re-renders. Strokes
   rasterize onto a fixed 96-cell grid; the canvas upscales
   nearest-neighbor via CSS and saves the tiny grid PNG.
   ============================================================ */
const SKETCH_PAPER = '#ffffff';
const SKETCH_GRID = 96;
const ERASER_CELLS = 7;
function SketchScreen({
  onAdd,
  onSkip,
  onHome,
  onHelp
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({
    x: 0,
    y: 0
  });
  const history = useRef([]);
  const toolRef = useRef('pen');
  const dirtyRef = useRef(false);
  const [tool, setTool] = useState('pen');
  const [canUndo, setCanUndo] = useState(false);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = SKETCH_GRID;
    canvas.height = Math.max(1, Math.round(SKETCH_GRID * rect.height / rect.width));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = SKETCH_PAPER;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctxRef.current = ctx;
  }, []);
  function cellAt(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) / rect.width * canvas.width),
      y: Math.floor((e.clientY - rect.top) / rect.height * canvas.height)
    };
  }
  function stamp(ctx, c) {
    if (toolRef.current === 'eraser') {
      const o = Math.floor(ERASER_CELLS / 2);
      ctx.fillStyle = SKETCH_PAPER;
      ctx.fillRect(c.x - o, c.y - o, ERASER_CELLS, ERASER_CELLS);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(c.x, c.y, 1, 1);
    }
  }
  // Bresenham between cells so fast strokes stay continuous
  function stampLine(ctx, a, b) {
    let x0 = a.x,
      y0 = a.y;
    const dx = Math.abs(b.x - x0),
      dy = -Math.abs(b.y - y0);
    const sx = x0 < b.x ? 1 : -1,
      sy = y0 < b.y ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      stamp(ctx, {
        x: x0,
        y: y0
      });
      if (x0 === b.x && y0 === b.y) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }
  function down(e) {
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    history.current.push(canvasRef.current.toDataURL());
    if (history.current.length > 40) history.current.shift();
    setCanUndo(true);
    if (!dirtyRef.current) {
      dirtyRef.current = true;
      setDirty(true);
    }
    drawing.current = true;
    const c = cellAt(e);
    last.current = c;
    stamp(ctxRef.current, c);
  }
  function move(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const c = cellAt(e);
    if (c.x === last.current.x && c.y === last.current.y) return;
    stampLine(ctxRef.current, last.current, c);
    last.current = c;
  }
  function up() {
    drawing.current = false;
  }
  function undo() {
    const prev = history.current.pop();
    setCanUndo(history.current.length > 0);
    if (history.current.length === 0) {
      dirtyRef.current = false;
      setDirty(false);
    }
    if (!prev) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current,
        ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = prev;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "screen with-chrome"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sketch-wrap"
  }, /*#__PURE__*/React.createElement("h2", null, "Add a sketch to the journal?"), /*#__PURE__*/React.createElement("div", {
    className: "sketch-paper"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    onPointerDown: down,
    onPointerMove: move,
    onPointerUp: up,
    onPointerCancel: up,
    onPointerLeave: up
  })), /*#__PURE__*/React.createElement("div", {
    className: "sketch-tools"
  }, /*#__PURE__*/React.createElement("button", {
    className: 'tool-btn' + (tool === 'pen' ? ' active' : ''),
    onClick: () => setTool('pen')
  }, "Pen"), /*#__PURE__*/React.createElement("button", {
    className: 'tool-btn' + (tool === 'eraser' ? ' active' : ''),
    onClick: () => setTool('eraser')
  }, "Eraser"), /*#__PURE__*/React.createElement("button", {
    className: "tool-btn",
    disabled: !canUndo,
    onClick: undo
  }, "Undo"))), /*#__PURE__*/React.createElement("div", {
    className: "entry-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onSkip
  }, "Skip"), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    disabled: !dirty,
    onClick: () => dirty && onAdd(canvasRef.current.toDataURL('image/png'))
  }, "Add")), /*#__PURE__*/React.createElement(Chrome, {
    onHome: onHome,
    onHelp: onHelp
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
