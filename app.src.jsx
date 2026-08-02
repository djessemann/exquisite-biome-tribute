/* app.src.jsx — editable JSX source for the app.
   This is the file to edit. Recompile to app.js (loaded by index.html) with:
     npx @babel/cli@7 --presets @babel/preset-react app.src.jsx > app.js
   React 18 classic runtime; React/ReactDOM are global (vendored UMD builds). */
const { useState, useEffect, useRef } = React;

/* ============================================================
   CONTENT — the prompt tables, transcribed from the rulebook.
   Text is verbatim except where a table-of-players instruction
   had to become a solo one (noted at each site).
   ============================================================ */
const SUITS = {
  hearts:   { glyph:'♥', red:true  },
  diamonds: { glyph:'♦', red:true  },
  clubs:    { glyph:'♣', red:false },
  spades:   { glyph:'♠', red:false },
};
const SUIT_ORDER = ['hearts','diamonds','clubs','spades'];
const RANK_ORDER = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

/* --- biome card 1: the region at a macroscopic level --- */
const B1_RANK = {
  A:'Desert',
  '2':'Tundra or wasteland',
  '3':'Scrub or grassland',
  '4':'Temperate forest',
  '5':'Tropical forest, jungle',
  '6':'Snow forest, taiga',
  '7':'Mountain',
  '8':'Glacier or fjord',
  '9':'Floodplain',
  '10':'Lagoon or cove',
  J:'Shoreline or coast',
  Q:'Stream or river',
  K:'Wetland or marsh',
};
const B1_SUIT = {
  hearts:'The season is warm and wet',
  diamonds:'The season is warm and dry',
  clubs:'The season is cool and dry',
  spades:'The season is cool and wet',
};

/* --- biome card 2: additional context and detail --- */
const B2_RANK = {
  A:'Waterfall',
  '2':'Cavern or tunnel',
  '3':'Canyon or valley',
  '4':'Flowering plants',
  '5':'Island',
  '6':'Lake or spring',
  '7':'Strong winds',
  '8':'Extreme temperature',
  '9':'High altitude',
  '10':'Low altitude',
  J:'Dormant volcano',
  Q:'Volatile weather patterns',
  K:'Partially or fully submerged',
};
const B2_SUIT = {
  hearts:'Early morning',
  diamonds:'Midday',
  clubs:'Afternoon or twilight',
  spades:'Deep night',
};

/* --- creature card 1: a general description --- */
const C1_RANK = {
  A:'Pollinator or plant spreader',
  '2':'Grain or seed-eater',
  '3':'Leaf, shrub, or fruit eater',
  '4':'Grass, moss, or algae eater',
  '5':'Insect forager',
  '6':'Climber or tree-dweller',
  '7':'Burrower or builder',
  '8':'Flyer or glider',
  '9':'Decomposer or recycler',
  '10':'Scavenger or thief',
  J:'Generalist omnivore',
  Q:'Ambush predator',
  K:'Apex predator',
};
const C1_SUIT = {
  hearts:'Mammal (e.g. rodents, big cats, ungulates, marsupials, mustelids, canids, cetaceans)',
  diamonds:'Bird or fish (e.g. raptors, songbirds, flightless birds, corvids, sharks, eels, rays)',
  clubs:'Reptile or amphibian (e.g. crocodilians, sauropods, lizards, frogs, salamanders)',
  spades:'Invertebrate (e.g. insects, squid, arachnids, molluscs, crustaceans, cnidarians)',
};

/* --- creature card 2: a distinctive feature.
       Selected by card COLOR, not suit — the one place color is mechanical. --- */
const C2_RED = {
  A:'Long tail. Stiff? Flexible? Prehensile?',
  '2':'Broad claws or talons. What are they used for?',
  '3':'Beak or bill. What tool or object does it resemble?',
  '4':'Spines or spikes. How long? Where are they placed?',
  '5':'Curious jaws, teeth, or tusks. How many? What shape?',
  '6':'More or fewer appendages. How many?',
  '7':'Powerful hind limbs. For jumping? Running? Kicking?',
  '8':'Leathery wings or hide. How thick?',
  '9':'Captivating eyes. What size? What color?',
  '10':'Specialized diet. What does it eat? What makes it specialized?',
  J:'Strange gills or lungs. What does it breathe? How?',
  Q:'Bioluminescence. Where on its body?',
  K:'Camouflage or mimicry. What does it disguise itself as?',
};
const C2_BLACK = {
  A:'Short tail. Or no tail at all?',
  '2':'Small, flat feet. Hooves? Paws? Fins?',
  '3':'Distinctive muzzle or snout. What shape is its head?',
  '4':'Hard carapace. Dull and flat, or shiny and reflective?',
  '5':'Horns or antlers. Or both?',
  '6':'Iconic patterns. Spots? Stripes? What colors? What shapes?',
  '7':'Prehensile digits. Fingers? Tentacles? What do they grasp?',
  '8':'Broad feathers or scales. Does it molt or shed? How often?',
  '9':'Whiskers or antennae. Spread out or clustered? Short or long?',
  '10':'Noisy. What does it sound like?',
  J:'Iconic ears. What shape? What purpose?',
  Q:'Poison or venom sacs. Where are they located?',
  K:'Vivid coloration. To warn, or entice?',
};

/* --- creature card 3: habits and personality --- */
const C3_RANK = {
  A:'Invasive species. This creature is not native to this region. What allows it to thrive here? What does it threaten?',
  '2':"Endangered. This creature's species is at risk of extinction. What forces endanger its livelihood?",
  '3':'Migratory. This creature travels through and beyond this region. What is its final destination? What does it do there?',
  '4':'Endemic. This species is found exclusively in this particular region. What prevents it from traveling beyond?',
  '5':'Dwellings or nests. This creature makes its home of strange material. How does it use its environment?',
  '6':'Offspring. This creature has a distinct method of reproduction or child-rearing. Why is it noteworthy?',
  '7':'Folkloric. There is a well-known myth or fable about this animal. How is it characterized?',
  '8':'Tool user. This creature can operate crude or makeshift tools. What are they made of? What are they used for?',
  '9':'Courtship displays. This creature has a distinctive mating ritual. What does it encompass?',
  '10':'Life cycle. This creature undergoes metamorphosis. How many stages? How do they differ? What stage is it in now?',
  J:"Sexual dimorphism. This species' two or more sexes exhibit different characteristics. Size? Color? Something else?",
  Q:'Hibernating. This creature is dormant during certain times of year. How soon before it retires again?',
  K:'Sedentary lifestyle. This creature does not move often. What is enough to stir its attention?',
};
const C3_SUIT = {
  hearts:'A solitary species. What happens when two meet?',
  diamonds:'This species lives in very small groups. Mated pairs, a family unit, or some other arrangement?',
  clubs:'This species lives in groups of a dozen or more. What is the social hierarchy? How is status measured and judged?',
  spades:'Dozens, hundreds, or thousands of this species live together. What is the collective noun for these creatures?',
};

/* --- scene prompts (rank only; suit is ignored) --- */
const SCENE_RANK = {
  A:'Daily routines',
  '2':'Child rearing',
  '3':'Rest, leisure, or play',
  '4':'A hearty meal',
  '5':'What lies beneath',
  '6':'On the prowl',
  '7':'Who watches whom',
  '8':"Biding one's time",
  '9':'Risk and reward',
  '10':'A tough life lesson',
  J:'Pursuit or defense',
  Q:'Mates or rivals',
  K:'A birth or death',
};

/* The three lenses offered in "Nature in Motion". */
const FRAMES = [
  'A nature documentary, complete with musical underscoring and narration.',
  "Field biologists, documenting research notes in a written or audio journal.",
  'The creature’s own point of view, without any human onlookers present.',
];

/* The three roles a creature card can play, by position in the row. */
const ROLES = [
  { key:'desc',    title:'A general description' },
  { key:'feature', title:'A distinctive feature' },
  { key:'habits',  title:'Habits and personality' },
];

const ABOUT_TEXT =
`EXQUISITE BIOME
A game of speculative biology
By Caro Asercion (seaexcursion.itch.io)
With art by Si Sweetman (sifsweetman.com)

A digital tribute by Jesse Mann.
This app carries no art from the original.

THE BIRD'S EYE VIEW

Exquisite Biome is a game about the natural world, the creatures that inhabit it, and the ways they live alongside each other.

During play, you will generate an ecosystem and use prompts and questions to create and discover the creatures that live there. In the physical game you play it with a standard 52-card deck and a journal; here the app deals the cards and keeps the journal.

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
function buildDeck(){
  const deck = [];
  for(const suit of SUIT_ORDER) for(const rank of RANK_ORDER) deck.push({ rank, suit });
  return deck;
}
function shuffle(a){
  const d = a.slice();
  for(let i = d.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}
/* Draw n cards off the end of `deck`, returning [drawn, remainingDeck].
   One deck lasts a whole expedition; if it ever runs dry mid-draw (long games
   with several rounds), a fresh shuffled deck takes over. */
function drawCards(deck, n){
  let d = (deck || []).slice();
  const out = [];
  for(let i = 0; i < n; i++){
    if(d.length === 0) d = shuffle(buildDeck());
    out.push(d.pop());
  }
  return [out, d];
}
function isRed(card){ return SUITS[card.suit].red; }
function cardText(card){ return card.rank + SUITS[card.suit].glyph; }

function biomePrompts(cards){
  if(!cards || cards.length < 2) return [];
  return [
    { label:'Environmental focus',            text: B1_RANK[cards[0].rank] },
    { label:'The current season',             text: B1_SUIT[cards[0].suit] },
    { label:'A detail about the environment', text: B2_RANK[cards[1].rank] },
    { label:'The time of day',                text: B2_SUIT[cards[1].suit] },
  ];
}
/* The prompts a card carries when it sits in a given role. */
function creaturePrompts(roleKey, card){
  if(!card) return [];
  if(roleKey === 'desc') return [
    { label:'An ecological niche', text: C1_RANK[card.rank] },
    { label:'Taxonomy',            text: C1_SUIT[card.suit] },
  ];
  if(roleKey === 'feature') return [
    // Labelled by color, since color — not suit — picks the table.
    { label: isRed(card) ? 'Red suit — diamonds or hearts' : 'Black suit — spades or clubs',
      text: isRed(card) ? C2_RED[card.rank] : C2_BLACK[card.rank] },
  ];
  return [
    { label:'Environmental behavior', text: C3_RANK[card.rank] },
    { label:'Social groupings',       text: C3_SUIT[card.suit] },
  ];
}
/* Creature i reads the row rotated i places: the left-most card keeps moving
   to the far right, so each card plays each role exactly once. */
function rotate(base, i){
  return [base[i % 3], base[(i + 1) % 3], base[(i + 2) % 3]];
}
function biomeSummary(cards){
  return biomePrompts(cards).map(p => p.text).join(' · ');
}

/* ============================================================
   STORAGE
   ============================================================ */
function loadArchive(){
  try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch(e){ return []; }
}
function saveArchive(arr){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }catch(e){}
}
/* An expedition runs long — three species, four scenes. Unlike a short
   planet-hop, losing it to a backgrounded tab would hurt, so the in-progress
   session is mirrored to localStorage and offered back on the title screen. */
function loadSavedSession(){
  try{ return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; }
  catch(e){ return null; }
}
function persistSession(s){
  try{
    if(s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  }catch(e){}
}
function fmtDate(ms){
  const d = new Date(ms);
  return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
}
function downloadBlob(blob, name){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

/* ============================================================
   SESSION SHAPE
   ============================================================ */
function newCreature(base, i){
  return {
    name: '',
    cards: rotate(base, i),
    entries: { desc:'', feature:'', habits:'' },
    done:    { desc:false, feature:false, habits:false },
    scene:   { frame:'', promptCard:null, body:'' },
    sketch:  null,               // optional drawing of this creature
  };
}
function newRound(biome, base){
  return {
    biome,                       // { cards, body, name }
    base,                        // the three creature cards, in dealt order
    creatures: [newCreature(base, 0)],
    creatureIndex: 0,
    finalScene: { frame:'', promptCard:null, body:'', sketch:null },
  };
}

/* ============================================================
   EXPORT — a shareable PNG of one expedition's field journal.
   Same two-pass measure/paint trick as the layout it's modelled on:
   one code path runs without painting to size the canvas exactly.
   ============================================================ */
const EXP = { W: 1000, PAD: 60, ink:'#000', red:'#c00' };

function expWrap(ctx, text, maxW){
  const lines = [];
  for(const para of String(text || '').split('\n')){
    let line = '';
    for(const w of para.split(' ')){
      const t = line ? line + ' ' + w : w;
      if(line && ctx.measureText(t).width > maxW){ lines.push(line); line = w; }
      else line = t;
    }
    lines.push(line);
  }
  return lines;
}
function expCard(ctx, x, y, card, draw){
  const W = 56, H = 80;
  if(draw){
    ctx.strokeStyle = EXP.ink; ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, W - 2, H - 2);
    ctx.fillStyle = isRed(card) ? EXP.red : EXP.ink;
    ctx.font = 'bold 20px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(card.rank, x + W/2, y + H/2 - 11);
    ctx.font = '22px Arial, Helvetica, sans-serif';
    ctx.fillText(SUITS[card.suit].glyph, x + W/2, y + H/2 + 14);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
  return W;
}

/* `imgs` maps a sketch data URL to its decoded Image (preloaded by
   renderExport, since the two-pass layout can't await mid-paint). */
function paintExport(ctx, rec, imgs, measureOnly){
  const { W, PAD } = EXP, CW = W - 2*PAD;
  const draw = !measureOnly;
  if(draw){ ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, ctx.canvas.height); }
  let y = PAD;

  const line = () => { if(draw){ ctx.fillStyle = EXP.ink; ctx.fillRect(PAD, y, CW, 2); } y += 2; };
  const text = (str, font, gap, lead) => {
    if(!str) return;
    ctx.font = font;
    const lines = expWrap(ctx, str, CW);
    if(draw){
      ctx.fillStyle = EXP.ink;
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      lines.forEach((ln, k) => ctx.fillText(ln, PAD, y + lead*0.78 + k*lead));
    }
    y += lines.length * lead + (gap || 0);
  };
  const cardRow = (cards) => {
    if(draw) cards.forEach((c, i) => expCard(ctx, PAD + i*70, y, c, true));
    y += 80 + 16;
  };
  /* The sketch pad is portrait, so at full column width a drawing would run
     ~1300px tall and a four-drawing journal would be mostly paper. Bound the
     height and center it instead; aspect ratio is preserved either way. */
  const SKETCH_MAX_H = 560;
  const sketchBlock = (src) => {
    const img = src ? imgs.get(src) : null;
    if(!img) return;
    y += 8;
    let sw = CW, sh = Math.round(CW * img.height / img.width);
    if(sh > SKETCH_MAX_H){ sw = Math.round(SKETCH_MAX_H * img.width / img.height); sh = SKETCH_MAX_H; }
    const sx = PAD + Math.round((CW - sw) / 2);
    if(draw){
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, sx, y, sw, sh);
      ctx.strokeStyle = EXP.ink; ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, y + 1, sw - 2, sh - 2);
    }
    y += sh + 20;
  };

  text(rec.name, 'bold 40px Arial, Helvetica, sans-serif', 8, 46);
  const speciesCount = rec.rounds.reduce((n, r) => n + r.creatures.filter(c => c.name).length, 0);
  text(`Exquisite Biome · ${fmtDate(rec.createdAt)} · ${speciesCount} species`,
       '20px Arial, Helvetica, sans-serif', 22, 26);
  line();
  y += 26;

  rec.rounds.forEach((r) => {
    line(); y += 26;
    text('THE LAY OF THE LAND', 'bold 16px Arial, Helvetica, sans-serif', 12, 20);
    cardRow(r.biome.cards);
    biomePrompts(r.biome.cards).forEach(p => {
      text(p.label.toUpperCase(), 'bold 15px Arial, Helvetica, sans-serif', 2, 18);
      text(p.text, '20px Arial, Helvetica, sans-serif', 12, 28);
    });
    text(r.biome.body, '20px Arial, Helvetica, sans-serif', 24, 28);

    r.creatures.forEach(cr => {
      if(!cr.name) return;
      line(); y += 26;
      text(cr.name, 'bold 28px Arial, Helvetica, sans-serif', 14, 34);
      cardRow(cr.cards);
      ROLES.forEach((role, i) => {
        text(role.title.toUpperCase(), 'bold 15px Arial, Helvetica, sans-serif', 4, 18);
        creaturePrompts(role.key, cr.cards[i]).forEach(p =>
          text(p.text, 'italic 20px Arial, Helvetica, sans-serif', 6, 28));
        text(cr.entries[role.key], '20px Arial, Helvetica, sans-serif', 18, 28);
      });
      if(cr.scene.body || cr.scene.frame){
        text('SCENE', 'bold 15px Arial, Helvetica, sans-serif', 4, 18);
        if(cr.scene.frame) text(cr.scene.frame, 'italic 20px Arial, Helvetica, sans-serif', 6, 28);
        if(cr.scene.promptCard)
          text(`Scene prompt: ${SCENE_RANK[cr.scene.promptCard.rank]}`,
               'italic 20px Arial, Helvetica, sans-serif', 6, 28);
        text(cr.scene.body, '20px Arial, Helvetica, sans-serif', 18, 28);
      }
      sketchBlock(cr.sketch);
    });

    if(r.finalScene.body || r.finalScene.frame){
      line(); y += 26;
      text('CREATURE COMFORTS', 'bold 16px Arial, Helvetica, sans-serif', 10, 20);
      if(r.finalScene.frame) text(r.finalScene.frame, 'italic 20px Arial, Helvetica, sans-serif', 6, 28);
      if(r.finalScene.promptCard)
        text(`Scene prompt: ${SCENE_RANK[r.finalScene.promptCard.rank]}`,
             'italic 20px Arial, Helvetica, sans-serif', 6, 28);
      text(r.finalScene.body, '20px Arial, Helvetica, sans-serif', 18, 28);
      sketchBlock(r.finalScene.sketch);
    }
  });

  // Journals saved before drawings moved into the flow carry one loose sketch.
  if(rec.sketch){ line(); y += 26; sketchBlock(rec.sketch); }
  return y + PAD;
}

/* Every sketch a record carries, in one list, so they can be decoded up front. */
function recordSketches(rec){
  const out = [];
  (rec.rounds || []).forEach(r => {
    r.creatures.forEach(c => { if(c.sketch) out.push(c.sketch); });
    if(r.finalScene && r.finalScene.sketch) out.push(r.finalScene.sketch);
  });
  if(rec.sketch) out.push(rec.sketch);
  return out;
}

async function renderExport(rec){
  const srcs = recordSketches(rec);
  const imgs = new Map();
  await Promise.all(srcs.map(src => new Promise(res => {
    const img = new Image();
    img.onload = () => { imgs.set(src, img); res(); };
    img.onerror = () => res();
    img.src = src;
  })));
  const measure = document.createElement('canvas');
  measure.width = measure.height = 1;
  const H = Math.ceil(paintExport(measure.getContext('2d'), rec, imgs, true));
  const canvas = document.createElement('canvas');
  canvas.width = EXP.W; canvas.height = H;
  paintExport(canvas.getContext('2d'), rec, imgs, false);
  return canvas;
}

/* ============================================================
   PRESENTATIONAL COMPONENTS
   ============================================================ */
function Card({ card, variant = '', selected = false }){
  const cls = ['card', variant];
  if(!card) return <div className={cls.concat('back').join(' ')} />;
  if(isRed(card)) cls.push('red');
  if(selected) cls.push('sel');
  return (
    <div className={cls.filter(Boolean).join(' ')}>
      <span className="rk">{card.rank}</span>
      <span className="st">{SUITS[card.suit].glyph}</span>
    </div>
  );
}

function Prompt({ label, text }){
  return (
    <div className="prompt">
      <div className="label">{label}</div>
      <div>{text}</div>
    </div>
  );
}

function Chrome({ onHome, onHelp }){
  // Both slots always render so space-between keeps Home left / Help right.
  return (
    <div className="chrome-bar">
      {onHome
        ? <button className="chrome" aria-label="Home" onClick={onHome}>Home</button>
        : <span className="chrome-spacer" aria-hidden="true" />}
      {onHelp
        ? <button className="chrome" aria-label="Rules" onClick={onHelp}>?</button>
        : <span className="chrome-spacer" aria-hidden="true" />}
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
function App(){
  const [screen, setScreen] = useState('title');
  const [overlay, setOverlay] = useState(null);   // 'help' | 'home' | 'burn' | 'goback' | 'restart'
  const [archive, setArchive] = useState(loadArchive);
  const [session, setSession] = useState(null);
  const [saved, setSaved] = useState(loadSavedSession);

  const [roleKey, setRoleKey] = useState(null);   // creature role being written
  const [draft, setDraft] = useState('');
  const [sceneTarget, setSceneTarget] = useState('creature'); // 'creature' | 'final'
  const [viewId, setViewId] = useState(null);
  const [toast, setToast] = useState(null);
  const [sharing, setSharing] = useState(false);
  const restoreInputRef = useRef(null);

  // Mirror every session change to storage so a backgrounded tab can resume.
  // Only writes: clearing the saved expedition is always explicit (publish,
  // burn, start-over), so navigating home leaves it intact to resume later.
  useEffect(() => { if(session){ persistSession(session); setSaved(session); } }, [session]);

  const round = session ? session.rounds[session.rounds.length - 1] : null;
  const creature = round ? round.creatures[round.creatureIndex] : null;

  /* State is plain JSON, so a clone-then-mutate edit keeps call sites readable
     without hand-threading spreads through four levels of nesting. */
  function edit(fn){
    setSession(s => {
      if(!s) return s;
      const n = JSON.parse(JSON.stringify(s));
      fn(n, n.rounds[n.rounds.length - 1]);
      return n;
    });
  }

  /* ---------- navigation ---------- */
  function goTitle(){
    setSession(null); setRoleKey(null); setDraft(''); setOverlay(null);
    setScreen('title');
  }
  function startNew(){
    setSession({
      id: 'e' + Date.now() + Math.floor(Math.random()*1000),
      createdAt: Date.now(),
      deck: shuffle(buildDeck()),
      rounds: [], sketch: null,
    });
    setScreen('biomeDraw');
  }
  function resume(){
    setSession(saved);
    setScreen(saved && saved.rounds.length ? 'creatureRow' : 'biomeDraw');
  }

  function drawBiome(){
    edit(s => {
      const [cards, deck] = drawCards(s.deck, 2);
      const [base, deck2] = drawCards(deck, 3);
      s.deck = deck2;
      s.rounds.push(newRound({ cards, body:'', name:'' }, base));
    });
    setScreen('biomeReveal');
  }

  function redrawBiomeCard(i){
    edit((s, r) => {
      const [cards, deck] = drawCards(s.deck, 1);
      s.deck = deck;
      r.biome.cards[i] = cards[0];
    });
  }

  /* Replace one creature card. Row position p in creature i maps back to
     base index (i + p) % 3, so the rotation keeps working afterwards. */
  function redrawCreatureCard(p){
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

  function openRole(key){
    setRoleKey(key);
    setDraft(creature ? creature.entries[key] : '');
    setScreen('creatureEntry');
  }
  function saveRole(){
    edit((s, r) => {
      const cr = r.creatures[r.creatureIndex];
      cr.entries[roleKey] = draft;
      cr.done[roleKey] = true;
    });
    setRoleKey(null); setDraft('');
    setScreen('creatureRow');
  }

  function openScene(target){
    setSceneTarget(target);
    setScreen('sceneFrame');
  }
  function setFrame(frame){
    edit((s, r) => {
      const t = sceneTarget === 'final' ? r.finalScene : r.creatures[r.creatureIndex].scene;
      t.frame = frame;
    });
  }
  function drawScenePrompt(){
    edit((s, r) => {
      const [cards, deck] = drawCards(s.deck, 1);
      s.deck = deck;
      const t = sceneTarget === 'final' ? r.finalScene : r.creatures[r.creatureIndex].scene;
      t.promptCard = cards[0];
    });
  }
  // Every scene is followed by its drawing step; the drawing step decides
  // where play goes next.
  function saveScene(){
    const target = sceneTarget;
    edit((s, r) => {
      const t = target === 'final' ? r.finalScene : r.creatures[r.creatureIndex].scene;
      t.body = draft;
    });
    setDraft('');
    setScreen(target === 'final' ? 'finalSketch' : 'creatureSketch');
  }
  function advanceCreature(){
    edit((s, r) => {
      r.creatureIndex += 1;
      if(!r.creatures[r.creatureIndex]) r.creatures[r.creatureIndex] = newCreature(r.base, r.creatureIndex);
    });
    setScreen('creatureRow');
  }

  /* ---------- drawings ---------- */
  // dataURL is null when skipped. After the third creature there's no
  // rotation left — the row has come full circle — so play moves on.
  function finishCreatureSketch(dataURL){
    const last = round.creatureIndex >= 2;
    if(dataURL) edit((s, r) => { r.creatures[r.creatureIndex].sketch = dataURL; });
    setScreen(last ? 'finalIntro' : 'rotate');
  }
  // The coexistence drawing is the last act; publishing straight from here
  // keeps the sketch out of the stale-session race that an edit() would lose.
  function finishFinalSketch(dataURL){ publish(dataURL); }

  function publish(finalSketch){
    const rounds = JSON.parse(JSON.stringify(session.rounds));
    if(finalSketch) rounds[rounds.length - 1].finalScene.sketch = finalSketch;
    const rec = {
      id: session.id,
      name: (session.rounds[0].biome.name || 'Unnamed biome').trim(),
      createdAt: session.createdAt,
      rounds,
    };
    const next = [rec, ...archive];
    setArchive(next); saveArchive(next);
    persistSession(null); setSaved(null);
    setSession(null); setRoleKey(null); setDraft('');
    setScreen('archive');
  }

  function burnRecord(id){
    const next = archive.filter(r => r.id !== id);
    setArchive(next); saveArchive(next);
    setOverlay(null); setViewId(null);
    setScreen('archive');
  }

  /* ---------- share / save / restore ---------- */
  async function shareRecord(rec){
    if(sharing) return;
    setSharing(true);
    try{
      const canvas = await renderExport(rec);
      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      const slug = (rec.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'biome';
      const file = new File([blob], slug + '-field-journal.png', { type:'image/png' });
      if(navigator.canShare && navigator.canShare({ files:[file] })){
        try{ await navigator.share({ files:[file] }); }
        catch(err){ if(!err || err.name !== 'AbortError') downloadBlob(blob, file.name); }
      } else {
        downloadBlob(blob, file.name);
      }
    }catch(e){ /* export failed; the journal is untouched */ }
    finally{ setSharing(false); }
  }
  function exportArchive(){
    const payload = {
      format: ARCHIVE_FORMAT, version: ARCHIVE_VERSION,
      exportedAt: new Date().toISOString(),
      recordCount: archive.length, records: archive,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
    const d = new Date(), p2 = n => String(n).padStart(2, '0');
    downloadBlob(blob, `exquisite-biome-archive-${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}.json`);
  }
  function requestRestore(){ if(restoreInputRef.current) restoreInputRef.current.click(); }
  // Merge by id: restoring twice is harmless and never removes local records.
  function onRestoreFile(ev){
    const f = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      let records = null;
      try{
        const data = JSON.parse(reader.result);
        if(data && data.format === ARCHIVE_FORMAT && Array.isArray(data.records)) records = data.records;
        else if(Array.isArray(data)) records = data;
      }catch(e){}
      if(!records){ setToast("This doesn't look like an archive file."); return; }
      const valid = records.filter(r => r && r.id && Array.isArray(r.rounds));
      const have = new Set(archive.map(r => r.id));
      const fresh = valid.filter(r => !have.has(r.id));
      if(fresh.length === 0){ setToast('Nothing new to restore.'); return; }
      const next = [...fresh, ...archive].sort((a, b) => (b.createdAt||0) - (a.createdAt||0));
      setArchive(next); saveArchive(next);
      setToast(`${fresh.length} ${fresh.length===1 ? 'expedition' : 'expeditions'} restored.`);
    };
    reader.readAsText(f);
  }

  /* ---------- chrome ---------- */
  function onHome(){
    if(screen === 'archive' || screen === 'record'){ goTitle(); }
    else { setOverlay('home'); }
  }
  const help = () => setOverlay('help');

  /* ============================================================
     SCREENS
     ============================================================ */
  function Title(){
    return (
      <div className="screen with-chrome">
        <div className="center">
          <h1>Exquisite Biome</h1>
          <p className="meta">A game of speculative biology<br/>By Caro Asercion</p>
          <div className="btn-stack" style={{marginTop:'16px'}}>
            {saved
              ? <>
                  <button className="btn primary" onClick={resume}>Resume expedition</button>
                  <button className="btn" onClick={() => setOverlay('restart')}>Start over</button>
                </>
              : <button className="btn primary" onClick={startNew}>Begin</button>}
            <button className="btn" onClick={() => { setToast(null); setScreen('archive'); }}>Archive</button>
          </div>
        </div>
        <Chrome onHelp={help} />
      </div>
    );
  }

  function BiomeDraw(){
    return (
      <div className="screen with-chrome">
        <div className="center">
          <h2>The Lay of the Land</h2>
          <p>Draw two cards. These are your biome cards, which you will use to frame the
            environment in which your creatures dwell.</p>
          <div className="card-row" style={{margin:'8px 0'}}>
            <Card variant="lg" /><Card variant="lg" />
          </div>
          <button className="btn primary" onClick={drawBiome}>Draw two cards</button>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function BiomeReveal(){
    const cards = round.biome.cards;
    return (
      <div className="screen with-chrome">
        <div className="card-row" style={{marginBottom:'16px'}}>
          {cards.map((c, i) =>
            <div key={i} className="card-slot" style={{width:'auto'}}>
              <Card card={c} variant="lg" />
              <button className="btn small" onClick={() => redrawBiomeCard(i)}>Redraw</button>
            </div>
          )}
        </div>
        <div className="box">
          {biomePrompts(cards).map((p, i) => <Prompt key={i} {...p} />)}
        </div>
        <p className="meta">Some of these prompts may overlap, contradict each other, or raise
          further questions. What does the dry season look like in this wetland? What is a
          &ldquo;high-altitude shoreline&rdquo;? If you don&rsquo;t have an answer, make something up.</p>
        <div className="entry-actions">
          <span />
          <button className="btn primary" onClick={() => {
            setDraft(round.biome.body); setScreen('biomeEntry');
          }}>Describe the biome</button>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function BiomeEntry(){
    const cards = round.biome.cards;
    return (
      <div className="screen">
        <div className="entry-head">
          <div className="card-row" style={{justifyContent:'flex-start', marginBottom:'8px'}}>
            {cards.map((c, i) => <Card key={i} card={c} variant="sm" />)}
          </div>
          {biomePrompts(cards).map((p, i) =>
            <div key={i} className="meta">{p.text}</div>)}
        </div>
        <textarea className="field" placeholder="Describe this environment..." value={draft}
          autoFocus onChange={e => setDraft(e.target.value)} />
        <div className="entry-actions">
          <button className="btn" onClick={() => {
            if(draft !== round.biome.body) setOverlay('goback');
            else setScreen('biomeReveal');
          }}>Go back</button>
          <button className="btn primary" onClick={() => {
            const v = draft;
            edit((s, r) => { r.biome.body = v; });
            setDraft(round.biome.name || '');
            setScreen('biomeName');
          }}>Save</button>
        </div>
      </div>
    );
  }

  function BiomeName(){
    const valid = draft.trim().length > 0;
    return (
      <div className="screen with-chrome">
        <div className="center">
          <h2>Give this biome a name.</h2>
          <p className="meta">Used to file this expedition in the archive.</p>
          <input className="name-field" maxLength={NAME_LIMIT} value={draft} placeholder="Name"
            onChange={e => setDraft(e.target.value)} />
          <div className="btn-stack" style={{marginTop:'8px'}}>
            <button className="btn primary" disabled={!valid} onClick={() => {
              const v = draft.trim();
              edit((s, r) => { r.biome.name = v; });
              setDraft('');
              setScreen('creatureRow');
            }}>Continue</button>
            <button className="btn" onClick={() => { setDraft(round.biome.body); setScreen('biomeEntry'); }}>Go back</button>
          </div>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function CreatureRow(){
    const allDone = ROLES.every(r => creature.done[r.key]);
    const n = round.creatureIndex + 1;
    return (
      <div className="screen with-chrome">
        <div className="step">Creature {n} of 3</div>
        <div className="box tight">
          <div className="label">Biome</div>
          <div className="meta">{round.biome.name ? round.biome.name + ' — ' : ''}{biomeSummary(round.biome.cards)}</div>
        </div>
        <div className="card-row" style={{margin:'16px 0'}}>
          {ROLES.map((role, i) =>
            <div key={role.key} className="card-slot">
              <button className="slot-tap" onClick={() => openRole(role.key)}>
                <Card card={creature.cards[i]} selected={creature.done[role.key]} />
                <span className="slot-label">{role.title}</span>
                <span className="slot-state">{creature.done[role.key] ? '✓ written' : 'tap to write'}</span>
              </button>
            </div>
          )}
        </div>
        <p className="meta">Each card has one or more prompts that correspond to its suit or rank.
          Respond to them in whichever order you please.</p>
        <div className="grow" />
        <div className="stack">
          <button className="btn primary" disabled={!allDone} onClick={() => {
            setDraft(creature.name || ''); setScreen('creatureName');
          }}>{allDone ? 'Name this species' : 'Answer all three cards to continue'}</button>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function CreatureEntry(){
    const p = ROLES.findIndex(r => r.key === roleKey);
    const role = ROLES[p];
    const card = creature.cards[p];
    return (
      <div className="screen">
        <div className="entry-head">
          <div className="row" style={{marginBottom:'8px'}}>
            <Card card={card} variant="sm" />
            <div>
              <div className="label" style={{marginBottom:0}}>{role.title}</div>
              <div className="meta">Card {p + 1} of 3</div>
            </div>
          </div>
          {creaturePrompts(roleKey, card).map((pr, i) => <Prompt key={i} {...pr} />)}
          <button className="btn small" style={{marginTop:'8px'}}
            onClick={() => redrawCreatureCard(p)}>Draw a different card</button>
        </div>
        <textarea className="field" placeholder="Respond to the prompts..." value={draft}
          autoFocus onChange={e => setDraft(e.target.value)} />
        <div className="entry-actions">
          <button className="btn" onClick={() => {
            if(draft !== creature.entries[roleKey]) setOverlay('goback');
            else { setRoleKey(null); setScreen('creatureRow'); }
          }}>Go back</button>
          <button className="btn primary" onClick={saveRole}>Save</button>
        </div>
      </div>
    );
  }

  function CreatureName(){
    const valid = draft.trim().length > 0;
    return (
      <div className="screen with-chrome">
        <div className="center">
          <h2>Give this species a name.</h2>
          <div className="card-row">
            {creature.cards.map((c, i) => <Card key={i} card={c} variant="sm" />)}
          </div>
          <input className="name-field" maxLength={NAME_LIMIT} value={draft} placeholder="Name"
            onChange={e => setDraft(e.target.value)} />
          <div className="btn-stack" style={{marginTop:'8px'}}>
            <button className="btn primary" disabled={!valid} onClick={() => {
              const v = draft.trim();
              edit((s, r) => { r.creatures[r.creatureIndex].name = v; });
              setDraft('');
              openScene('creature');
            }}>Continue</button>
            <button className="btn" onClick={() => { setDraft(''); setScreen('creatureRow'); }}>Go back</button>
          </div>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function FinalIntro(){
    const named = round.creatures.filter(c => c.name).map(c => c.name);
    return (
      <div className="screen with-chrome">
        <div className="center">
          <h2>Creature Comforts</h2>
          <p>Frame one final scene of these creatures coexisting alongside each other. This is your
            chance to really play with the ways these creatures interact.</p>
          <div className="box" style={{width:'100%', textAlign:'left'}}>
            {named.map((n, i) => <div key={i}>{n}</div>)}
          </div>
          <button className="btn primary" onClick={() => openScene('final')}>Frame the scene</button>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function SceneFrame(){
    const isFinal = sceneTarget === 'final';
    const target = isFinal ? round.finalScene : creature.scene;
    return (
      <div className="screen with-chrome">
        <h2>{isFinal ? 'Creature Comforts' : 'Nature in Motion'}</h2>
        {!isFinal &&
          <p>Now you will play out a brief scene, highlighting this creature&rsquo;s features and
            traits in more detail.</p>}
        <p>Establish the frame for this scene. What is the lens through which you&rsquo;re watching
          this creature&rsquo;s life?</p>
        <div style={{marginTop:'12px'}}>
          {FRAMES.map((f, i) =>
            <button key={i} className={'option' + (target.frame === f ? ' on' : '')}
              onClick={() => setFrame(f)}>{f}</button>
          )}
        </div>
        <div className="box">
          <div className="label">Scene prompt (optional)</div>
          {target.promptCard
            ? <div className="row">
                <Card card={target.promptCard} variant="sm" />
                <div>{SCENE_RANK[target.promptCard.rank]}</div>
              </div>
            : <p className="meta">If you need a scene prompt, draw one additional card and use the
                rank as extra inspiration. (Don&rsquo;t worry about the suit.)</p>}
          <button className="btn small" style={{marginTop:'10px'}} onClick={drawScenePrompt}>
            {target.promptCard ? 'Draw a different card' : 'Draw a scene prompt'}
          </button>
        </div>
        <div className="entry-actions">
          <button className="btn" onClick={() =>
            setScreen(isFinal ? 'finalIntro' : 'creatureRow')}>Go back</button>
          <button className="btn primary" disabled={!target.frame} onClick={() => {
            setDraft(target.body); setScreen('sceneEntry');
          }}>Write the scene</button>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function SceneEntry(){
    const isFinal = sceneTarget === 'final';
    const target = isFinal ? round.finalScene : creature.scene;
    return (
      <div className="screen">
        <div className="entry-head">
          <div className="label">{isFinal ? 'All three species' : creature.name}</div>
          <div className="meta">{target.frame}</div>
          {target.promptCard &&
            <div className="meta" style={{marginTop:'6px'}}>
              Scene prompt: {SCENE_RANK[target.promptCard.rank]} ({cardText(target.promptCard)})
            </div>}
        </div>
        <textarea className="field" placeholder="Play out the scene..." value={draft}
          autoFocus onChange={e => setDraft(e.target.value)} />
        <div className="entry-actions">
          <button className="btn" onClick={() => {
            if(draft !== target.body) setOverlay('goback');
            else setScreen('sceneFrame');
          }}>Go back</button>
          <button className="btn primary" onClick={saveScene}>Save</button>
        </div>
      </div>
    );
  }

  function Rotate(){
    const before = creature.cards;
    const after = rotate(round.base, round.creatureIndex + 1);
    return (
      <div className="screen with-chrome">
        <h2>Natural Selection</h2>
        <p>Move your left-most creature card to the far right, so that the cards are arranged in a
          new order. These same cards can be used, in their new order, to come up with another
          creature.</p>
        <div className="box">
          <div className="label">Before</div>
          <div className="card-row" style={{justifyContent:'flex-start'}}>
            {before.map((c, i) => <Card key={i} card={c} variant="sm" />)}
          </div>
          <div className="label" style={{marginTop:'12px'}}>After</div>
          <div className="card-row" style={{justifyContent:'flex-start'}}>
            {after.map((c, i) => <Card key={i} card={c} variant="sm" />)}
          </div>
        </div>
        <p>As you create this new animal, consider how it coexists with the previous species. Are
          they predator and prey? Do they have a symbiotic relationship? Do they ignore each other,
          or compete for territory?</p>
        <div className="entry-actions">
          <span />
          <button className="btn primary" onClick={advanceCreature}>Continue</button>
        </div>
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function Archive(){
    return (
      <div className="screen with-chrome">
        <h2>Archive</h2>
        {archive.length === 0 ? (
          <div className="center">
            <p className="empty">No expeditions yet.</p>
            <button className="btn small" onClick={requestRestore}>Restore archive</button>
          </div>
        ) : (
          <>
            {archive.map(r => {
              const species = r.rounds.reduce((n, x) => n + x.creatures.filter(c => c.name).length, 0);
              return (
                <button key={r.id} className="archive-item"
                  onClick={() => { setViewId(r.id); setScreen('record'); }}>
                  <div><strong>{r.name}</strong></div>
                  <div className="meta">{fmtDate(r.createdAt)} &middot; {species} {species === 1 ? 'species' : 'species'}</div>
                </button>
              );
            })}
            <div className="row center-row" style={{marginTop:'12px'}}>
              <button className="btn small" onClick={exportArchive}>Save archive</button>
              <button className="btn small" onClick={requestRestore}>Restore</button>
            </div>
          </>
        )}
        <input ref={restoreInputRef} type="file" accept=".json,application/json"
          style={{display:'none'}} onChange={onRestoreFile} />
        {toast &&
          <div className="toast">
            <span>{toast}</span>
            <button aria-label="Dismiss" onClick={() => setToast(null)}>&#10005;</button>
          </div>}
        <Chrome onHome={onHome} onHelp={help} />
      </div>
    );
  }

  function Record(){
    const rec = archive.find(r => r.id === viewId);
    if(!rec) return Archive();
    return (
      <div className="screen">
        <button className="close-x" aria-label="Close" onClick={() => setScreen('archive')}>&#10005;</button>
        <h1>{rec.name}</h1>
        <p className="meta">{fmtDate(rec.createdAt)}</p>

        {rec.rounds.map((r, ri) =>
          <div key={ri}>
            <hr className="divider" />
            <div className="label">The lay of the land</div>
            <div className="card-row" style={{justifyContent:'flex-start', margin:'8px 0'}}>
              {r.biome.cards.map((c, i) => <Card key={i} card={c} variant="sm" />)}
            </div>
            {biomePrompts(r.biome.cards).map((p, i) => <div key={i} className="meta">{p.text}</div>)}
            <p className="body-text selectable" style={{marginTop:'8px'}}>{r.biome.body}</p>

            {r.creatures.filter(c => c.name).map((cr, ci) =>
              <div key={ci}>
                <hr className="divider" />
                <h2>{cr.name}</h2>
                {ROLES.map((role, i) =>
                  <div key={role.key} className="box">
                    <div className="row" style={{marginBottom:'8px'}}>
                      <Card card={cr.cards[i]} variant="sm" />
                      <div className="label" style={{marginBottom:0}}>{role.title}</div>
                    </div>
                    {creaturePrompts(role.key, cr.cards[i]).map((p, k) =>
                      <div key={k} className="meta">{p.text}</div>)}
                    <p className="body-text selectable" style={{marginTop:'8px'}}>{cr.entries[role.key]}</p>
                  </div>
                )}
                {cr.scene.body &&
                  <div className="box">
                    <div className="label">Scene</div>
                    <div className="meta">{cr.scene.frame}</div>
                    {cr.scene.promptCard &&
                      <div className="meta">Scene prompt: {SCENE_RANK[cr.scene.promptCard.rank]}</div>}
                    <p className="body-text selectable" style={{marginTop:'8px'}}>{cr.scene.body}</p>
                  </div>}
                {cr.sketch && <img className="sketch-img" src={cr.sketch} alt={'Drawing of ' + cr.name} />}
              </div>
            )}

            {r.finalScene.body &&
              <>
                <hr className="divider" />
                <div className="label">Creature comforts</div>
                <div className="meta">{r.finalScene.frame}</div>
                {r.finalScene.promptCard &&
                  <div className="meta">Scene prompt: {SCENE_RANK[r.finalScene.promptCard.rank]}</div>}
                <p className="body-text selectable" style={{marginTop:'8px'}}>{r.finalScene.body}</p>
                {r.finalScene.sketch &&
                  <img className="sketch-img" src={r.finalScene.sketch} alt="Drawing of the coexistence scene" />}
              </>}
          </div>
        )}

        {/* Journals saved before drawings moved into the flow carry one loose sketch. */}
        {rec.sketch &&
          <>
            <hr className="divider" />
            <img className="sketch-img" src={rec.sketch} alt="Sketch from this expedition" />
          </>}

        <div className="entry-actions" style={{marginTop:'20px'}}>
          <button className="btn" onClick={() => setOverlay('burn')}>Burn journal</button>
          <button className="btn primary" disabled={sharing} onClick={() => shareRecord(rec)}>Share</button>
        </div>
      </div>
    );
  }

  /* ---------- overlays ---------- */
  function Overlay(){
    if(overlay === 'help'){
      return (
        <div className="overlay">
          <button className="close-x" aria-label="Close" onClick={() => setOverlay(null)}>&#10005;</button>
          <div className="help-body selectable">{ABOUT_TEXT}</div>
        </div>
      );
    }
    const box = (text, danger, onYes) => (
      <div className="overlay confirm">
        <div className="confirm-box">
          <p>{text}</p>
          <div className="btn-stack">
            <button className="btn" onClick={onYes}>{danger}</button>
            <button className="btn primary" onClick={() => setOverlay(null)}>Nevermind</button>
          </div>
        </div>
      </div>
    );
    if(overlay === 'home')
      return box('Go home? Your expedition is saved and you can resume it from the title screen.',
        'Go home', () => { setOverlay(null); setSession(null); setScreen('title'); });
    if(overlay === 'restart')
      return box('Start over? Your saved expedition will be lost.',
        'Start over', () => { setOverlay(null); persistSession(null); setSaved(null); startNew(); });
    if(overlay === 'burn')
      return box('Are you sure? This journal will be gone for good.',
        'Yes, burn it', () => burnRecord(viewId));
    if(overlay === 'goback')
      return box('Leave without saving? This entry will be lost.',
        'Leave', () => {
          setOverlay(null);
          if(screen === 'creatureEntry'){ setRoleKey(null); setScreen('creatureRow'); }
          else if(screen === 'sceneEntry'){ setScreen('sceneFrame'); }
          else { setScreen('biomeReveal'); }
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
  switch(screen){
    case 'biomeDraw':      body = BiomeDraw(); break;
    case 'biomeReveal':    body = BiomeReveal(); break;
    case 'biomeEntry':     body = BiomeEntry(); break;
    case 'biomeName':      body = BiomeName(); break;
    case 'creatureRow':    body = CreatureRow(); break;
    case 'creatureEntry':  body = CreatureEntry(); break;
    case 'creatureName':   body = CreatureName(); break;
    case 'sceneFrame':     body = SceneFrame(); break;
    case 'sceneEntry':     body = SceneEntry(); break;
    case 'rotate':         body = Rotate(); break;
    case 'finalIntro':     body = FinalIntro(); break;
    case 'creatureSketch': body = <SketchScreen key={'cs' + round.creatureIndex}
                                     title={`Draw ${creature.name}?`}
                                     onDone={finishCreatureSketch}
                                     onHome={onHome} onHelp={help} />; break;
    case 'finalSketch':    body = <SketchScreen key="fs"
                                     title="Draw the scene?"
                                     onDone={finishFinalSketch}
                                     onHome={onHome} onHelp={help} />; break;
    case 'archive':        body = Archive(); break;
    case 'record':         body = Record(); break;
    default:               body = Title();
  }
  return <>{body}{Overlay()}</>;
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
function SketchScreen({ title, onDone, onHome, onHelp }){
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x:0, y:0 });
  const history = useRef([]);
  const toolRef = useRef('pen');
  const dirtyRef = useRef(false);
  const [tool, setTool] = useState('pen');
  const [canUndo, setCanUndo] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { toolRef.current = tool; }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = SKETCH_GRID;
    canvas.height = Math.max(1, Math.round(SKETCH_GRID * rect.height / rect.width));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = SKETCH_PAPER; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctxRef.current = ctx;
  }, []);

  function cellAt(e){
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) / rect.width * canvas.width),
      y: Math.floor((e.clientY - rect.top) / rect.height * canvas.height),
    };
  }
  function stamp(ctx, c){
    if(toolRef.current === 'eraser'){
      const o = Math.floor(ERASER_CELLS / 2);
      ctx.fillStyle = SKETCH_PAPER;
      ctx.fillRect(c.x - o, c.y - o, ERASER_CELLS, ERASER_CELLS);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(c.x, c.y, 1, 1);
    }
  }
  // Bresenham between cells so fast strokes stay continuous
  function stampLine(ctx, a, b){
    let x0 = a.x, y0 = a.y;
    const dx = Math.abs(b.x - x0), dy = -Math.abs(b.y - y0);
    const sx = x0 < b.x ? 1 : -1, sy = y0 < b.y ? 1 : -1;
    let err = dx + dy;
    for(;;){
      stamp(ctx, { x:x0, y:y0 });
      if(x0 === b.x && y0 === b.y) break;
      const e2 = 2 * err;
      if(e2 >= dy){ err += dy; x0 += sx; }
      if(e2 <= dx){ err += dx; y0 += sy; }
    }
  }
  function down(e){
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    history.current.push(canvasRef.current.toDataURL());
    if(history.current.length > 40) history.current.shift();
    setCanUndo(true);
    if(!dirtyRef.current){ dirtyRef.current = true; setDirty(true); }
    drawing.current = true;
    const c = cellAt(e); last.current = c;
    stamp(ctxRef.current, c);
  }
  function move(e){
    if(!drawing.current) return;
    e.preventDefault();
    const c = cellAt(e);
    if(c.x === last.current.x && c.y === last.current.y) return;
    stampLine(ctxRef.current, last.current, c);
    last.current = c;
  }
  function up(){ drawing.current = false; }
  function undo(){
    const prev = history.current.pop();
    setCanUndo(history.current.length > 0);
    if(history.current.length === 0){ dirtyRef.current = false; setDirty(false); }
    if(!prev) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current, ctx = ctxRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = prev;
  }

  return (
    <div className="screen with-chrome">
      <div className="sketch-wrap">
        <h2>{title}</h2>
        <div className="sketch-paper">
          <canvas ref={canvasRef}
            onPointerDown={down} onPointerMove={move} onPointerUp={up}
            onPointerCancel={up} onPointerLeave={up} />
        </div>
        <div className="sketch-tools">
          <button className={'tool-btn' + (tool==='pen' ? ' active' : '')} onClick={() => setTool('pen')}>Pen</button>
          <button className={'tool-btn' + (tool==='eraser' ? ' active' : '')} onClick={() => setTool('eraser')}>Eraser</button>
          <button className="tool-btn" disabled={!canUndo} onClick={undo}>Undo</button>
        </div>
      </div>
      <div className="entry-actions">
        <button className="btn" onClick={() => onDone(null)}>Skip</button>
        <button className="btn primary" disabled={!dirty}
          onClick={() => dirty && onDone(canvasRef.current.toDataURL('image/png'))}>Add</button>
      </div>
      <Chrome onHome={onHome} onHelp={onHelp} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
