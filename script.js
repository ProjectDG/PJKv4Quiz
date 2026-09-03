const menuBtn = document.getElementById('menuBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const themeBtns = document.querySelectorAll('.theme-btn');
const mainContainer = document.getElementById('mainContainer');
const mainMenuBtn = document.querySelector('.main-menu-btn');

const state = {
  modes: [],
  currentView: 'menu',
  flashcards: {}
};

const BOTTLE_RECOGNITION_IMAGES = [
  'BR_images/corazon_tequila_blanco.jpg',
  'BR_images/gran-gala_triple-sec.jpg',
  'BR_images/rivi_gin.jpg',
  'BR_images/the-critic_cabernet.jpg',
  'BR_images/wheatley_vodka.jpg'
];
const BOTTLE_RECOGNITION_IMAGE_DIRECTORY = 'BR_images';
const BOTTLE_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
const DEFAULT_BRAND_CHOICES = ['Gran Gala', 'Wheatley', 'Rivi', 'Corazon', 'The Critic', 'Tito\'s', 'Ketel One', 'Grey Goose', 'Patron', 'Don Julio'];
const DEFAULT_ALCOHOL_TYPE_CHOICES = [
  'Vodka',
  'Gin',
  'Rum',
  'Tequila',
  'Whiskey',
  'Bourbon',
  'Scotch',
  'Brandy',
  'Cognac',
  'Mezcal',
  'Sake',
  'Soju',
  'Baijiu',
  'Absinthe',
  'Liqueur',
  'Aperitif',
  'Digestif',
  'Vermouth',
  'Amaro',
  'Triple Sec',
  'Cabernet Sauvignon',
  'Pinot Noir',
  'Merlot',
  'Chardonnay',
  'Sauvignon Blanc',
  'Riesling',
  'Ros\u00e9',
  'Sparkling Wine'
];

const ALCOHOL_TYPE_PATTERNS = [
  { pattern: /cabernet/, label: 'Cabernet Sauvignon' },
  { pattern: /pinot/, label: 'Pinot Noir' },
  { pattern: /chardonnay/, label: 'Chardonnay' },
  { pattern: /merlot/, label: 'Merlot' },
  { pattern: /sauvignon\s*blanc|sauvignonblanc/, label: 'Sauvignon Blanc' },
  { pattern: /riesling/, label: 'Riesling' },
  { pattern: /rose|ros\u00e9/, label: 'Ros\u00e9' },
  { pattern: /sparkling/, label: 'Sparkling Wine' },
  { pattern: /triple\s*sec|triplesec/, label: 'Triple Sec' },
  { pattern: /amaro/, label: 'Amaro' },
  { pattern: /vermouth/, label: 'Vermouth' },
  { pattern: /aperitif/, label: 'Aperitif' },
  { pattern: /digestif/, label: 'Digestif' },
  { pattern: /liqueur|liquor/, label: 'Liqueur' },
  { pattern: /absinthe/, label: 'Absinthe' },
  { pattern: /baijiu/, label: 'Baijiu' },
  { pattern: /soju/, label: 'Soju' },
  { pattern: /sake/, label: 'Sake' },
  { pattern: /mezcal/, label: 'Mezcal' },
  { pattern: /cognac/, label: 'Cognac' },
  { pattern: /brandy/, label: 'Brandy' },
  { pattern: /scotch/, label: 'Scotch' },
  { pattern: /bourbon/, label: 'Bourbon' },
  { pattern: /whiskey|whisky/, label: 'Whiskey' },
  { pattern: /tequila/, label: 'Tequila' },
  { pattern: /rum/, label: 'Rum' },
  { pattern: /gin/, label: 'Gin' },
  { pattern: /vodka/, label: 'Vodka' }
];

const ALCOHOL_TYPE_FAMILIES = {
  'Vodka': 'clear-spirits',
  'Gin': 'clear-spirits',
  'Rum': 'cane-spirits',
  'Tequila': 'agave-spirits',
  'Mezcal': 'agave-spirits',
  'Whiskey': 'whiskey',
  'Bourbon': 'whiskey',
  'Scotch': 'whiskey',
  'Brandy': 'grape-spirits',
  'Cognac': 'grape-spirits',
  'Sake': 'rice-spirits',
  'Soju': 'rice-spirits',
  'Baijiu': 'rice-spirits',
  'Absinthe': 'herbal-spirits',
  'Liqueur': 'fortified-liqueurs',
  'Aperitif': 'fortified-liqueurs',
  'Digestif': 'fortified-liqueurs',
  'Vermouth': 'fortified-liqueurs',
  'Amaro': 'fortified-liqueurs',
  'Triple Sec': 'fortified-liqueurs',
  'Cabernet Sauvignon': 'red-wine',
  'Pinot Noir': 'red-wine',
  'Merlot': 'red-wine',
  'Chardonnay': 'white-wine',
  'Sauvignon Blanc': 'white-wine',
  'Riesling': 'white-wine',
  'Rosé': 'rose-wine',
  'Sparkling Wine': 'sparkling-wine'
};

const DEFAULT_GLASS_OPTIONS = ['Rocks Glass', 'Martini Glass', 'Collins Glass', 'Coupe Glass', 'Highball Glass', 'Wine Glass', 'Pint Glass'];
const DEFAULT_ICE_OPTIONS = ['No Ice (Neat/Up)', 'Cubed Ice', 'Crushed Ice', 'Large Cube'];
const DEFAULT_TOOL_OPTIONS = ['Mixing Glass (Stir)', 'Cocktail Shaker (Shake)', 'Build in Glass'];
const DEFAULT_GARNISH_OPTIONS = ['Dehydrated Lemon', 'Basil Sprig', 'Cherry', 'Orange Twist', 'Orange Slice', 'Olive', 'Pickled Carrot', 'Lime Wheel', 'Chili', 'Grapefruit Slice', 'Pineapple Frond', 'Dehydrated Lime', 'Jalapeno Slice', 'Flower'];

// Recipes may list combined garnishes like "X & Y" — split those into separately-pickable parts.
function expandGarnishNames(list) {
  return (Array.isArray(list) ? list : [])
    .flatMap((g) => String(g).split(/\s*&\s*/))
    .map((g) => g.trim())
    .filter(Boolean);
}
const DEFAULT_OUNCE_OPTIONS = ['.25 oz', '.5 oz', '.75 oz', '1 oz', '1.25 oz', '1.5 oz', '1.75 oz', '2 oz', '2.5 oz', '3 oz', 'Dashes', 'Float', 'Topped'];
const DASH_OUNCE_OPTIONS = ['1 Dash', '2 Dashes', '3 Dashes', '4 Dashes', '1 to 2 Dashes', '2 to 3 Dashes', '3 to 4 Dashes'];

// Approximate real-world bottle/liquid colors, keyed by bottle id (base, bright highlight, shadow accent)
const BOTTLE_COLOR_MAP = {
  b2: { base: '#cfd8dc', bright: '#ffffff', accent: '#90a4ae' }, // Wheatley Vodka
  b1: { base: '#dce8d5', bright: '#ffffff', accent: '#a5c98c' }, // Rivi Gin
  b3: { base: '#c0392b', bright: '#e74c3c', accent: '#922b21' }, // Corazon Tequila (Spicy)
  b10: { base: '#e08e0b', bright: '#f5a623', accent: '#b8720a' }, // Gran Gala
  b3b: { base: '#c98a2c', bright: '#e0a94a', accent: '#a8721f' }, // Corazon Tequila
  b4: { base: '#b8752e', bright: '#d99a4e', accent: '#8f5a20' }, // Cincoro Reposado
  b5: { base: '#7b3f14', bright: '#a85d24', accent: '#5c2e0d' }, // Sazerac Rye
  b41: { base: '#8bc34a', bright: '#aed581', accent: '#689f38' }, // Lime Juice
  b42: { base: '#f5f0e1', bright: '#ffffff', accent: '#e8dfc0' }, // Simple Syrup
  b12: { base: '#f1c40f', bright: '#f9e076', accent: '#d4ac0d' }, // Lemon Juice
  b49: { base: '#6b1420', bright: '#922b3e', accent: '#4a0e16' }, // Angostura Bitters
  b51: { base: '#d9720c', bright: '#f0902c', accent: '#a85809' }, // Angostura Orange Bitters
  b50: { base: '#a3172c', bright: '#c53a4e', accent: '#7a0f20' }, // Peychaud's Bitters
  b45: { base: '#7a4a24', bright: '#9c6a3a', accent: '#573317' }, // 5 Spice
  b11: { base: '#a3193c', bright: '#c73357', accent: '#7a1030' }, // Cranberry Juice
  b43: { base: '#1565c0', bright: '#2196f3', accent: '#0d47a1' }, // Blue Simple Syrup
  b13: { base: '#7a0e2c', bright: '#9c1e3f', accent: '#52091e' }, // Pomegranate Juice
  b44: { base: '#d4a94a', bright: '#e8c477', accent: '#b08a34' }, // Agave
  b15: { base: '#6b7a3a', bright: '#8a9a52', accent: '#4c5628' }, // Olive Brine
  b46: { base: '#f2c81d', bright: '#f7db56', accent: '#d1a80f' }, // Pineapple Juice
  b47: { base: '#f3c9d0', bright: '#fbe1e6', accent: '#e0a3ad' }, // Lychee Syrup
  b48: { base: '#4a2f1e', bright: '#6b452c', accent: '#2f1c11' }, // Blk Tea Simple
  b18: { base: '#cfe0c8', bright: '#eef7ea', accent: '#a9c79f' }, // Tinkerman's
  b19: { base: '#1857a4', bright: '#2f7ad1', accent: '#103c73' }, // Bombay Sapphire
  b20: { base: '#0b6e4f', bright: '#12996d', accent: '#074a35' }, // Tanqueray
  b21: { base: '#123524', bright: '#1e4d34', accent: '#0a2115' }, // Hendrick's
  b22: { base: '#8a8a8a', bright: '#aaaaaa', accent: '#666666' }, // Blank
  b23: { base: '#c9922e', bright: '#e0ac4c', accent: '#a3711f' }, // Toki Whisky
  b24: { base: '#c9862f', bright: '#e0a24f', accent: '#a06a20' }, // Domaine de Canton
  b25: { base: '#e2711d', bright: '#f28c3c', accent: '#b85813' }, // Aperol
  b26: { base: '#b0142a', bright: '#d4213b', accent: '#7d0e1e' }, // Campari
  b27: { base: '#3b2415', bright: '#56341e', accent: '#24140b' }, // Tia Maria
  b28: { base: '#9a5a1e', bright: '#bd7a34', accent: '#714012' }, // Benchmark
  b29: { base: '#2b1a12', bright: '#43291b', accent: '#180d08' }, // Fernet Branca
  b30: { base: '#e8e4d8', bright: '#fbf8ef', accent: '#c9c3ac' }, // Bacardi
  b31: { base: '#f0dfc0', bright: '#f9eeda', accent: '#dcc79c' }, // Orgeat
  b32: { base: '#4a2712', bright: '#6b3a1c', accent: '#2d160a' }, // Myers's Dark
  b33: { base: '#e3c98a', bright: '#f0dcae', accent: '#c7a862' }, // Don Q
  b34: { base: '#a5651f', bright: '#c9853a', accent: '#7a4712' }, // Captain Morgan
  b35: { base: '#5c3417', bright: '#7d4a24', accent: '#38200d' }, // Montenegro
  b36: { base: '#e6e9ec', bright: '#ffffff', accent: '#c5cbd1' }, // Tito's
  b37: { base: '#dfe4e8', bright: '#f5f8fa', accent: '#b9c2c9' }, // Ketel One
  b38: { base: '#b9d3e0', bright: '#d6ecf5', accent: '#8fb3c7' }, // Grey Goose
  b39: { base: '#e3e7ea', bright: '#ffffff', accent: '#c2c9cf' }, // Belvedere
  b40: { base: '#eef0c0', bright: '#f7f8de', accent: '#d8dc9a' }, // Wheatley (Citrus)
  b14: { base: '#6e1626', bright: '#8f2438', accent: '#4a0e19' }, // Sweet Vermouth
  b6: { base: '#e9dfa8', bright: '#f5eecb', accent: '#cdbf7e' }, // Dry Vermouth
  b7: { base: '#c8401f', bright: '#e2602f', accent: '#9c3016' }, // Cointreau
  b8: { base: '#e8d97a', bright: '#f3e9a0', accent: '#cbb94a' }, // St. Germain
  b9: { base: '#8a5a2a', bright: '#a97a3f', accent: '#603d1a' }, // Los Vecinos
  b16: { base: '#e8c96a', bright: '#f2dd94', accent: '#c9a643' }, // Lillet
  b17: { base: '#b85a1a', bright: '#d47530', accent: '#8a4212' }, // Dry Curaçao
  b52: { base: '#a9762e', bright: '#c9954c', accent: '#7d5620' }, // Q Ginger Beer
  b53: { base: '#e8a33c', bright: '#f5bd63', accent: '#c17f24' }, // Q Grapefruit Soda
  b54: { base: '#8a1a2c', bright: '#a8334a', accent: '#5c0f1c' }, // Bloody Mary Mix
  b57: { base: '#6b8f3a', bright: '#8ab34f', accent: '#4a6427' }, // Matcha Syrup
  b58: { base: '#3a2418', bright: '#54341f', accent: '#22150d' }, // Espresso
  b59: { base: '#9c1a2e', bright: '#c53347', accent: '#6e0f1f' }, // Cherry Syrup
  b60: { base: '#5c0f1c', bright: '#7d1c2c', accent: '#3d0a13' }, // Planet Oregon Pinot Noir
  b61: { base: '#eee7c9', bright: '#f8f3e0', accent: '#d8cc9e' } // Beviamo Pinot Grigio
};

// Configurable bottle layout based on reference diagram (Speed Rail + Backbar Grid)
const DRINK_GAME_BOTTLE_LAYOUT = [
  // Speed rail (bottom row, left to right)
  { id: 'b2', name: 'Wheatley Vodka', row: 'rail', col: 1 },
  { id: 'b1', name: 'Rivi Gin', row: 'rail', col: 2 },
  { id: 'b3', name: 'Corazon Tequila (Spicy)', row: 'rail', col: 3 },
  { id: 'b10', name: 'Gran Gala', row: 'rail', col: 4 },
  { id: 'b3b', name: 'Corazon Tequila', row: 'rail', col: 5 },
  { id: 'b4', name: 'Cincoro Reposado', row: 'rail', col: 6 },
  { id: 'b5', name: 'Sazerac Rye', row: 'rail', col: 7 },
  { id: 'b41', name: 'Lime Juice', row: 'rail', col: 8 },
  { id: 'b42', name: 'Simple Syrup', row: 'rail', col: 9 },
  { id: 'b12', name: 'Lemon Juice', row: 'rail', col: 10 },
  // Sodas (left of the bitters)
  { id: 'b52', name: 'Q Ginger Beer', row: 'sodas', col: 1 },
  { id: 'b53', name: 'Q Grapefruit Soda', row: 'sodas', col: 2 },
  // Bitters (above the mixer block, left side)
  { id: 'b49', name: 'Angostura Bitters', row: 'bitters', col: 1 },
  { id: 'b51', name: 'Angostura Orange Bitters', row: 'bitters', col: 2 },
  { id: 'b50', name: 'Peychaud\'s Bitters', row: 'bitters', col: 3 },
  { id: 'bitters-spacer1', name: '', row: 'bitters', col: 4, spacer: true },
  { id: 'bitters-spacer2', name: '', row: 'bitters', col: 5, spacer: true },
  { id: 'b45', name: '5 Spice', row: 'bitters', col: 6 },
  { id: 'b54', name: 'Bloody Mary Mix', row: 'bitters', col: 7 },
  { id: 'b57', name: 'Matcha Syrup', row: 'bitters', col: 8 },
  { id: 'b58', name: 'Espresso', row: 'bitters', col: 9 },
  { id: 'b59', name: 'Cherry Syrup', row: 'bitters', col: 10 },
  // Mixer block (two rows, above the rail, left side)
  { id: 'b11', name: 'Cranberry Juice', row: 'mixer1', col: 1 },
  { id: 'b43', name: 'Blue Simple Syrup', row: 'mixer1', col: 2 },
  { id: 'b13', name: 'Pomegranate Juice', row: 'mixer1', col: 3 },
  { id: 'b44', name: 'Agave', row: 'mixer1', col: 4 },
  { id: 'b15', name: 'Olive Brine', row: 'mixer2', col: 1 },
  { id: 'b46', name: 'Pineapple Juice', row: 'mixer2', col: 2 },
  { id: 'b47', name: 'Lychee Syrup', row: 'mixer2', col: 3 },
  { id: 'b48', name: 'Blk Tea Simple', row: 'mixer2', col: 4 },
  // Side Well tier 1 (top row, 6 bottles)
  { id: 'b18', name: 'Tinkerman\'s', row: 'sidewell1', col: 1 },
  { id: 'b19', name: 'Bombay Sapphire', row: 'sidewell1', col: 2 },
  { id: 'b20', name: 'Tanqueray', row: 'sidewell1', col: 3 },
  { id: 'b21', name: 'Hendrick\'s', row: 'sidewell1', col: 4 },
  { id: 'b22', name: 'Blank', row: 'sidewell1', col: 5 },
  { id: 'b23', name: 'Toki Whisky', row: 'sidewell1', col: 6 },
  // Side Well tier 2 (6 bottles)
  { id: 'b24', name: 'Domaine de Canton', row: 'sidewell2', col: 1 },
  { id: 'b25', name: 'Aperol', row: 'sidewell2', col: 2 },
  { id: 'b26', name: 'Campari', row: 'sidewell2', col: 3 },
  { id: 'b27', name: 'Tia Maria', row: 'sidewell2', col: 4 },
  { id: 'b28', name: 'Benchmark', row: 'sidewell2', col: 5 },
  { id: 'b29', name: 'Fernet Branca', row: 'sidewell2', col: 6 },
  // Side Well tier 3 (6 bottles)
  { id: 'b30', name: 'Bacardi', row: 'sidewell3', col: 1 },
  { id: 'b31', name: 'Orgeat', row: 'sidewell3', col: 2 },
  { id: 'b32', name: 'Myers\'s Dark', row: 'sidewell3', col: 3 },
  { id: 'b33', name: 'Don Q', row: 'sidewell3', col: 4 },
  { id: 'b34', name: 'Captain Morgan', row: 'sidewell3', col: 5 },
  { id: 'b35', name: 'Montenegro', row: 'sidewell3', col: 6 },
  // Side Well tier 4 (5 bottles)
  { id: 'b36', name: 'Tito\'s', row: 'sidewell4', col: 1 },
  { id: 'b37', name: 'Ketel One', row: 'sidewell4', col: 2 },
  { id: 'b38', name: 'Grey Goose', row: 'sidewell4', col: 3 },
  { id: 'b39', name: 'Belvedere', row: 'sidewell4', col: 4 },
  { id: 'b40', name: 'Wheatley (Citrus)', row: 'sidewell4', col: 5 },
  // Side Well tier 5 (7 bottles)
  { id: 'b14', name: 'Sweet Vermouth', row: 'sidewell5', col: 1 },
  { id: 'b6', name: 'Dry Vermouth', row: 'sidewell5', col: 2 },
  { id: 'b7', name: 'Cointreau', row: 'sidewell5', col: 3 },
  { id: 'b8', name: 'St. Germain', row: 'sidewell5', col: 4 },
  { id: 'b9', name: 'Los Vecinos', row: 'sidewell5', col: 5 },
  { id: 'b16', name: 'Lillet', row: 'sidewell5', col: 6 },
  { id: 'b17', name: 'Dry Curaçao', row: 'sidewell5', col: 7 },
  // Wine list view (Reds / Whites categories)
  { id: 'b60', name: 'Planet Oregon Pinot Noir', row: 'wine-Reds', col: 1 },
  { id: 'b61', name: 'Beviamo Pinot Grigio', row: 'wine-Whites', col: 1 }
];

function createModeState() {
  return {
    index: 0,
    revealed: false,
    selectedOptions: [],
    selectedBrand: '',
    selectedType: '',
    inputValue: '',
    answerCorrect: null,
    answerOrder: [],
    revealOnly: false,
    cardOrder: [],
    bottleBrandOrder: [],
    bottleBrandOrderKey: '',
    bottleTypeOrder: [],
    bottleTypeOrderKey: '',
    focusDrink: '',
    showDrinkPicker: false,
    cardResults: {},
    completed: false,
    buildOrder: [],
    buildSelectedOptions: [],
    buildRoundRevealed: false,
    buildRoundCorrect: null,
    buildRoundOptions: [],
    buildRoundKey: '',
    buildHintUsed: false,
    gameScore: 0,
    gameStreak: 0,
    gameMaxStreak: 0,
    gameLives: 3,
    gameTickets: [],
    gameTicketIndex: 0,
    gameAnswerRevealed: false,
    gameSelectedAnswer: '',
    gameRoundCorrect: null,

    // New Interactive Flow State
    gameStage: 'prep', // 'prep' (glass/ice/tool) -> 'build' (ingredients) -> 'garnish' -> 'complete'
    gameSelectedGlass: '',
    gameSelectedIce: '',
    gameSelectedTool: '',
    gameAddedIngredients: [], // [{ name, oz }]
    gameIngredientFeedback: [], // per-index 'correct' | 'incorrect', aligned to gameAddedIngredients
    gameSelectedGarnishes: [],
    gameGarnishOrder: [],
    gameActiveModal: null, // null | 'glass' | 'ice' | 'tool' | 'bottle'
    gameActiveBottle: null,
    gameActiveOz: '.75 oz',
    gameOzShowDashes: false,
    gameErrorMessage: '',
    gameDrinkImage: '',
    gameStationView: 'default' // 'default' | 'winelist'
  };
}

function resetCardProgress(modeState) {
  modeState.index = 0;
  modeState.revealed = false;
  modeState.selectedOptions = [];
  modeState.selectedBrand = '';
  modeState.selectedType = '';
  modeState.inputValue = '';
  modeState.answerCorrect = null;
  modeState.answerOrder = [];
  modeState.bottleBrandOrder = [];
  modeState.bottleBrandOrderKey = '';
  modeState.bottleTypeOrder = [];
  modeState.bottleTypeOrderKey = '';
  modeState.revealOnly = false;
  modeState.cardResults = {};
  modeState.completed = false;
  modeState.buildOrder = [];
  modeState.buildSelectedOptions = [];
  modeState.buildRoundRevealed = false;
  modeState.buildRoundCorrect = null;
  modeState.buildRoundOptions = [];
  modeState.buildRoundKey = '';
  modeState.buildHintUsed = false;
  modeState.gameScore = 0;
  modeState.gameStreak = 0;
  modeState.gameMaxStreak = 0;
  modeState.gameLives = 3;
  modeState.gameTickets = [];
  modeState.gameTicketIndex = 0;
  modeState.gameAnswerRevealed = false;
  modeState.gameSelectedAnswer = '';
  modeState.gameRoundCorrect = null;
  modeState.gameStage = 'prep';
  modeState.gameSelectedGlass = '';
  modeState.gameSelectedIce = '';
  modeState.gameSelectedTool = '';
  modeState.gameAddedIngredients = [];
  modeState.gameSelectedGarnishes = [];
  modeState.gameActiveModal = null;
  modeState.gameActiveBottle = null;
  modeState.gameActiveOz = '.75 oz';
  modeState.gameOzShowDashes = false;
  modeState.gameErrorMessage = '';
  modeState.gameDrinkImage = '';
}

function resetModeState(modeId) {
  state.flashcards[modeId] = createModeState();
}

initApp();

function initApp() {
  const savedTheme = localStorage.getItem('theme') || 'original';
  applyTheme(savedTheme);
  updateActiveThemeBtn(savedTheme);

  bindEvents();
  loadModes().then(() => renderView());
}

function bindEvents() {
  menuBtn.addEventListener('click', () => {
    settingsModal.classList.add('active');
    setSettingsSectionOpen('modes');
  });

  closeModal.addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  settingsModal.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.classList.remove('active');
      return;
    }

    const toggleButton = event.target.closest('[data-settings-toggle]');
    if (!toggleButton) {
      return;
    }

    const sectionId = String(toggleButton.getAttribute('data-settings-toggle') || '').trim();
    if (!sectionId) {
      return;
    }

    const section = settingsModal.querySelector(`[data-settings-section="${sectionId}"]`);
    const isOpen = Boolean(section && section.classList.contains('is-open'));
    setSettingsSectionOpen(isOpen ? '' : sectionId);
  });

  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
      localStorage.setItem('theme', theme);
      updateActiveThemeBtn(theme);
    });
  });

  mainMenuBtn.addEventListener('click', () => {
    state.currentView = 'menu';
    settingsModal.classList.remove('active');
    renderView();
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.mode) {
      const selectedMode = String(button.dataset.mode || '').trim().toLowerCase();
      state.currentView = selectedMode || 'menu';
      settingsModal.classList.remove('active');
      resetModeState(selectedMode || 'menu');
      renderView();
      return;
    }

    if (button.dataset.action === 'back') {
      state.currentView = 'menu';
      renderView();
      return;
    }

    const modeId = state.currentView;
    const modeState = state.flashcards[modeId] || createModeState();
    const currentMode = state.modes.find((entry) => entry.id === modeId);

    if (isBuildDrinkMode(currentMode)) {
      if (button.dataset.action === 'build-toggle-option') {
        if (modeState.buildRoundRevealed) {
          return;
        }

        const option = String(button.dataset.buildOption || '').trim();
        if (!option) {
          return;
        }

        const selected = Array.isArray(modeState.buildSelectedOptions) ? [...modeState.buildSelectedOptions] : [];
        const existingIndex = selected.indexOf(option);
        if (existingIndex >= 0) {
          selected.splice(existingIndex, 1);
        } else {
          selected.push(option);
        }

        modeState.buildSelectedOptions = selected;
        modeState.buildRoundCorrect = null;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      if (button.dataset.action === 'build-check') {
        scoreBuildDrinkRound(currentMode, modeState);
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      if (button.dataset.action === 'build-next') {
        const context = getBuildDrinkRoundContext(currentMode, modeState);
        if (!context) {
          return;
        }

        if (!modeState.buildRoundRevealed) {
          scoreBuildDrinkRound(currentMode, modeState);
          state.flashcards[modeId] = modeState;
          renderView();
          return;
        }

        const isLastRound = context.itemCount > 0 && modeState.index >= context.itemCount - 1;
        if (isLastRound) {
          modeState.completed = true;
          state.flashcards[modeId] = modeState;
          renderView();
          return;
        }

        modeState.index = Math.min(Math.max(context.itemCount - 1, 0), modeState.index + 1);
        modeState.buildSelectedOptions = [];
        modeState.buildRoundRevealed = false;
        modeState.buildRoundCorrect = null;
        modeState.buildRoundOptions = [];
        modeState.buildRoundKey = '';
        modeState.buildHintUsed = false;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      if (button.dataset.action === 'build-prev') {
        modeState.index = Math.max(0, modeState.index - 1);
        modeState.buildSelectedOptions = [];
        modeState.buildRoundRevealed = false;
        modeState.buildRoundCorrect = null;
        modeState.buildRoundOptions = [];
        modeState.buildRoundKey = '';
        modeState.buildHintUsed = false;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      if (button.dataset.action === 'build-hint') {
        modeState.buildHintUsed = true;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }
    }

    if (isDrinkGameMode(currentMode)) {
      // Switch Station View (default station <-> wine list)
      if (button.dataset.action === 'game-station-view') {
        modeState.gameStationView = String(button.dataset.view || 'default').trim();
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Modal Open Triggers
      if (button.dataset.action === 'game-open-modal') {
        const modalType = String(button.dataset.modalType || '').trim();
        modeState.gameActiveModal = modalType;
        modeState.gameErrorMessage = '';
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Modal Close
      if (button.dataset.action === 'game-close-modal') {
        modeState.gameActiveModal = null;
        modeState.gameActiveBottle = null;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Select Glass
      if (button.dataset.action === 'game-select-glass') {
        modeState.gameSelectedGlass = String(button.dataset.value || '').trim();
        modeState.gameActiveModal = null;
        modeState.gameErrorMessage = '';
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Select Ice
      if (button.dataset.action === 'game-select-ice') {
        modeState.gameSelectedIce = String(button.dataset.value || '').trim();
        modeState.gameActiveModal = null;
        modeState.gameErrorMessage = '';
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Select Tool
      if (button.dataset.action === 'game-select-tool') {
        modeState.gameSelectedTool = String(button.dataset.value || '').trim();
        modeState.gameActiveModal = null;
        modeState.gameErrorMessage = '';
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Click Bottle on Station
      if (button.dataset.action === 'game-click-bottle') {
        const bottleName = String(button.dataset.bottleName || '').trim();
        modeState.gameActiveBottle = bottleName;
        modeState.gameActiveModal = 'bottle';
        modeState.gameOzShowDashes = false;
        modeState.gameErrorMessage = '';
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Select Ounces in Bottle Modal
      if (button.dataset.action === 'game-select-oz') {
        const oz = String(button.dataset.oz || '').trim();
        if (oz === 'Dashes') {
          modeState.gameOzShowDashes = true;
        } else {
          modeState.gameActiveOz = oz;
        }
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Back Out of Dashes Sub-Menu
      if (button.dataset.action === 'game-oz-back') {
        modeState.gameOzShowDashes = false;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Add Bottle Ingredient
      if (button.dataset.action === 'game-add-bottle-ingredient') {
        if (modeState.gameActiveBottle) {
          modeState.gameAddedIngredients.push({
            name: modeState.gameActiveBottle,
            oz: modeState.gameActiveOz || '.75 oz'
          });
        }
        modeState.gameActiveModal = null;
        modeState.gameActiveBottle = null;
        modeState.gameErrorMessage = '';
        modeState.gameIngredientFeedback = [];
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Remove Ingredient From List
      if (button.dataset.action === 'game-remove-ingredient') {
        const index = parseInt(button.dataset.index, 10);
        if (!isNaN(index) && index >= 0 && index < modeState.gameAddedIngredients.length) {
          modeState.gameAddedIngredients.splice(index, 1);
        }
        modeState.gameIngredientFeedback = [];
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Mix (Complete Ingredients Stage)
      if (button.dataset.action === 'game-mix-build') {
        const ticket = modeState.gameTickets[modeState.gameTicketIndex];
        const drinkName = (ticket?.drinkName || '').toLowerCase();
        const recipe = getDrinkRecipesFromModes(state.modes).find((r) => r.name.toLowerCase() === drinkName);
        const drinkProfile = getDrinkProfilesFromModes(state.modes).find((d) => d.name.toLowerCase() === drinkName);

        // Validate Glass, Ice, Tool, and Ingredients
        let errors = [];
        if (!modeState.gameSelectedGlass) errors.push('Please select glassware!');
        if (!modeState.gameSelectedIce) errors.push('Please select ice!');
        if (!modeState.gameSelectedTool) errors.push('Please select a tool!');

        if (recipe) {
          if (recipe.glass && modeState.gameSelectedGlass.toLowerCase() !== recipe.glass.toLowerCase()) {
            errors.push(`Wrong Glass! Expected ${recipe.glass}.`);
          }
          if (recipe.ice && modeState.gameSelectedIce.toLowerCase() !== recipe.ice.toLowerCase()) {
            errors.push(`Wrong Ice! Expected ${recipe.ice}.`);
          }
          if (recipe.tool && modeState.gameSelectedTool.toLowerCase() !== recipe.tool.toLowerCase()) {
            errors.push(`Wrong Tool! Expected ${recipe.tool}.`);
          }

          // Validate required ingredients (name and amount must both match; "X or Y" names accept either;
          // a generic varietal like "Pinot Noir" matches any bottle whose name contains that phrase, so brand doesn't matter)
          const ingredientMatches = (added, req) => {
            const reqNames = req.name.toLowerCase().split(/\s+or\s+/i).map((n) => n.trim());
            const addedName = added.name.trim().toLowerCase();
            const nameMatches = reqNames.some((reqName) => reqName === addedName || addedName.includes(reqName) || reqName.includes(addedName));
            return nameMatches && added.oz.trim().toLowerCase() === req.oz.trim().toLowerCase();
          };
          const missing = (recipe.ingredients || []).filter((req) => {
            return !modeState.gameAddedIngredients.some((added) => ingredientMatches(added, req));
          });
          const extra = modeState.gameAddedIngredients.filter((added) => {
            return !(recipe.ingredients || []).some((req) => ingredientMatches(added, req));
          });

          if (missing.length > 0 || extra.length > 0) {
            errors.push('Missing or incorrect ingredients! Check your mix.');
          }

          modeState.gameIngredientFeedback = modeState.gameAddedIngredients.map((added) => {
            return extra.includes(added) ? 'incorrect' : 'correct';
          });
        } else if (drinkProfile) {
          if (drinkProfile.glass && modeState.gameSelectedGlass.toLowerCase() !== drinkProfile.glass.toLowerCase()) {
            errors.push(`Wrong Glass! Expected ${drinkProfile.glass}.`);
          }
          if (drinkProfile.method && !modeState.gameSelectedTool.toLowerCase().includes(drinkProfile.method.toLowerCase())) {
            errors.push(`Wrong Preparation Method! Expected ${drinkProfile.method}.`);
          }

          // Validate required ingredients
          const requiredClean = (drinkProfile.ingredients || []).map((req) => cleanIngredientAnswer(req).toLowerCase());
          const userIngredientsClean = modeState.gameAddedIngredients.map((i) => i.name.toLowerCase());
          const missing = requiredClean.filter((reqClean) => {
            return !userIngredientsClean.some((u) => reqClean.includes(u) || u.includes(reqClean));
          });

          if (missing.length > 0) {
            errors.push(`Missing or incorrect ingredients! Check your mix.`);
          }

          modeState.gameIngredientFeedback = modeState.gameAddedIngredients.map((added) => {
            const addedClean = added.name.toLowerCase();
            const matchesSome = requiredClean.some((reqClean) => reqClean.includes(addedClean) || addedClean.includes(reqClean));
            return matchesSome ? 'correct' : 'incorrect';
          });
        }

        if (errors.length > 0) {
          modeState.gameErrorMessage = errors.join(' ');
          modeState.gameLives = Math.max(0, modeState.gameLives - 1);
          if (modeState.gameLives <= 0) {
            modeState.completed = true;
            checkAndSaveHighScore(modeState.gameScore);
          }
        } else {
          modeState.gameErrorMessage = '';
          modeState.gameIngredientFeedback = [];
          modeState.gameStage = 'garnish';
        }

        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Toggle Garnish
      if (button.dataset.action === 'game-toggle-garnish') {
        const garnish = String(button.dataset.garnish || '').trim();
        const idx = modeState.gameSelectedGarnishes.indexOf(garnish);
        if (idx >= 0) {
          modeState.gameSelectedGarnishes.splice(idx, 1);
        } else {
          modeState.gameSelectedGarnishes.push(garnish);
        }
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Serve Drink
      if (button.dataset.action === 'game-serve-drink') {
        const ticket = modeState.gameTickets[modeState.gameTicketIndex];
        const drinkName = (ticket?.drinkName || '').toLowerCase();
        const recipe = getDrinkRecipesFromModes(state.modes).find((r) => r.name.toLowerCase() === drinkName);
        const drinkProfile = getDrinkProfilesFromModes(state.modes).find((d) => d.name.toLowerCase() === drinkName);
        const requiredGarnishesRaw = (recipe && recipe.garnishes && recipe.garnishes.length > 0) ? recipe.garnishes : (drinkProfile?.garnishes || []);
        const reqGarnishesDisplay = expandGarnishNames(requiredGarnishesRaw);

        let garnishError = false;
        if (reqGarnishesDisplay.length > 0) {
          const reqGarnishes = reqGarnishesDisplay.map((g) => g.toLowerCase());
          const selectedGarnishes = modeState.gameSelectedGarnishes.map((g) => g.toLowerCase());
          const isCorrect = reqGarnishes.length === selectedGarnishes.length && reqGarnishes.every((rg) => selectedGarnishes.some((sg) => sg.includes(rg) || rg.includes(sg)));
          if (!isCorrect) {
            garnishError = true;
          }
        }

        if (garnishError) {
          modeState.gameErrorMessage = `Incorrect garnish! Required: ${reqGarnishesDisplay.join(', ')}`;
          modeState.gameLives = Math.max(0, modeState.gameLives - 1);
          if (modeState.gameLives <= 0) {
            modeState.completed = true;
            checkAndSaveHighScore(modeState.gameScore);
          }
        } else {
          modeState.gameErrorMessage = '';
          modeState.gameStage = 'complete';
          modeState.gameStreak += 1;
          const points = 250 + ((modeState.gameStreak - 1) * 100);
          modeState.gameScore += points;
          if (modeState.gameStreak > modeState.gameMaxStreak) {
            modeState.gameMaxStreak = modeState.gameStreak;
          }
          setCardResult(modeState, modeState.gameTicketIndex, true);
        }

        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      // Next Ticket
      if (button.dataset.action === 'game-next-ticket') {
        const ticketCount = modeState.gameTickets.length;
        if (modeState.gameTicketIndex >= ticketCount - 1 || modeState.gameLives <= 0) {
          modeState.completed = true;
          checkAndSaveHighScore(modeState.gameScore);
        } else {
          modeState.gameTicketIndex += 1;
          modeState.gameStage = 'prep';
          modeState.gameSelectedGlass = '';
          modeState.gameSelectedIce = '';
          modeState.gameSelectedTool = '';
          modeState.gameAddedIngredients = [];
          modeState.gameIngredientFeedback = [];
          modeState.gameSelectedGarnishes = [];
          modeState.gameActiveModal = null;
          modeState.gameActiveBottle = null;
          modeState.gameErrorMessage = '';
        }
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      if (button.dataset.action === 'game-restart') {
        resetModeState(modeId);
        renderView();
        return;
      }
    }

    if (button.dataset.action === 'toggle-drink-picker') {
      modeState.showDrinkPicker = !modeState.showDrinkPicker;
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'close-drink-picker') {
      modeState.showDrinkPicker = false;
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'clear-drink-focus') {
      modeState.focusDrink = '';
      modeState.showDrinkPicker = false;
      modeState.cardOrder = [];
      resetCardProgress(modeState);
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'set-drink-focus') {
      modeState.focusDrink = String(button.dataset.drink || '').trim();
      modeState.showDrinkPicker = false;
      modeState.cardOrder = [];
      resetCardProgress(modeState);
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'restart-mode') {
      resetModeState(modeId);
      renderView();
      return;
    }

    if (button.dataset.action === 'menu') {
      state.currentView = 'menu';
      renderView();
      return;
    }

    if (button.dataset.action === 'prev') {
      modeState.index = Math.max(0, modeState.index - 1);
      modeState.revealed = false;
      modeState.selectedOptions = [];
      modeState.selectedBrand = '';
      modeState.selectedType = '';
      modeState.inputValue = '';
      modeState.answerCorrect = null;
      modeState.answerOrder = [];
      modeState.revealOnly = false;
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'next') {
      const mode = state.modes.find((entry) => entry.id === modeId);
      const cardOrder = mode ? getOrBuildCardOrder(mode, modeState) : [];
      const itemCount = cardOrder.length;
      const cardIndex = cardOrder[modeState.index] ?? modeState.index;
      const card = mode && Array.isArray(mode.items) ? mode.items[cardIndex] : null;

      if (!modeState.revealed && card) {
        if (mode?.type === 'bottle-recognition') {
          const brandCorrect = String(card?.brand || '').trim().toLowerCase();
          const typeCorrect = String(card?.alcoholType || '').trim().toLowerCase();
          const brandSubmitted = String(modeState.selectedBrand || '').trim().toLowerCase();
          const typeSubmitted = String(modeState.selectedType || '').trim().toLowerCase();
          modeState.revealed = true;
          modeState.answerCorrect = brandSubmitted === brandCorrect && typeSubmitted === typeCorrect;
          setCardResult(modeState, cardIndex, modeState.answerCorrect);
        } else if (isMultipleChoiceCard(card)) {
          const expected = getCorrectAnswers(card);
          const submitted = Array.isArray(modeState.selectedOptions) ? modeState.selectedOptions : [];
          modeState.revealed = true;
          modeState.answerCorrect = isSelectionCorrect(submitted, expected);
          setCardResult(modeState, cardIndex, modeState.answerCorrect);
        } else {
          const expected = String(card?.answer || '').trim().toLowerCase();
          const submitted = String(modeState.inputValue || '').trim().toLowerCase();
          modeState.revealed = true;
          modeState.answerCorrect = submitted === expected;
          setCardResult(modeState, cardIndex, modeState.answerCorrect);
        }

        modeState.revealOnly = false;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      const isLastCard = itemCount > 0 && modeState.index >= itemCount - 1;
      if (isLastCard) {
        modeState.completed = true;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      modeState.index = Math.min(Math.max(itemCount - 1, 0), modeState.index + 1);
      modeState.revealed = false;
      modeState.selectedOptions = [];
      modeState.selectedBrand = '';
      modeState.selectedType = '';
      modeState.inputValue = '';
      modeState.answerCorrect = null;
      modeState.answerOrder = [];
      modeState.revealOnly = false;
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'check') {
      const mode = state.modes.find((entry) => entry.id === modeId);
      const cardOrder = mode ? getOrBuildCardOrder(mode, modeState) : [];
      const cardIndex = cardOrder[modeState.index] ?? modeState.index;
      const card = mode && Array.isArray(mode.items) ? mode.items[cardIndex] : null;
      if (mode?.type === 'bottle-recognition') {
        const brandCorrect = String(card?.brand || '').trim().toLowerCase();
        const typeCorrect = String(card?.alcoholType || '').trim().toLowerCase();
        const brandSubmitted = String(modeState.selectedBrand || '').trim().toLowerCase();
        const typeSubmitted = String(modeState.selectedType || '').trim().toLowerCase();
        modeState.revealed = true;
        modeState.answerCorrect = brandSubmitted === brandCorrect && typeSubmitted === typeCorrect;
        setCardResult(modeState, cardIndex, modeState.answerCorrect);
        modeState.revealOnly = false;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      if (isMultipleChoiceCard(card)) {
        const expected = getCorrectAnswers(card);
        const submitted = Array.isArray(modeState.selectedOptions) ? modeState.selectedOptions : [];
        modeState.revealed = true;
        modeState.answerCorrect = isSelectionCorrect(submitted, expected);
        setCardResult(modeState, cardIndex, modeState.answerCorrect);
        modeState.revealOnly = false;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      const expected = String(card?.answer || '').trim().toLowerCase();
      const submitted = String(modeState.inputValue || '').trim().toLowerCase();
      modeState.revealed = true;
      modeState.answerCorrect = submitted === expected;
      setCardResult(modeState, cardIndex, modeState.answerCorrect);
      modeState.revealOnly = false;
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'reveal') {
      const mode = state.modes.find((entry) => entry.id === modeId);
      const cardOrder = mode ? getOrBuildCardOrder(mode, modeState) : [];
      const cardIndex = cardOrder[modeState.index] ?? modeState.index;
      modeState.revealed = true;
      modeState.answerCorrect = null;
      modeState.revealOnly = true;
      setCardResult(modeState, cardIndex, false);
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.option !== undefined) {
      const option = String(button.dataset.option || '');
      const mode = state.modes.find((entry) => entry.id === modeId);
      if (mode?.type === 'bottle-recognition') {
        if (button.dataset.group === 'brand') {
          modeState.selectedBrand = option;
        } else if (button.dataset.group === 'type') {
          modeState.selectedType = option;
        }
        modeState.revealed = false;
        modeState.answerCorrect = null;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      const cardOrder = mode ? getOrBuildCardOrder(mode, modeState) : [];
      const cardIndex = cardOrder[modeState.index] ?? modeState.index;
      const card = mode && Array.isArray(mode.items) ? mode.items[cardIndex] : null;
      const selectedOptions = Array.isArray(modeState.selectedOptions) ? [...modeState.selectedOptions] : [];
      const isSinglePickQuestion = shouldUseSingleSelection(card);
      const optionIndex = selectedOptions.indexOf(option);

      if (isSinglePickQuestion) {
        modeState.selectedOptions = optionIndex >= 0 ? [] : [option];
      } else if (optionIndex >= 0) {
        selectedOptions.splice(optionIndex, 1);
        modeState.selectedOptions = selectedOptions;
      } else {
        selectedOptions.push(option);
        modeState.selectedOptions = selectedOptions;
      }

      modeState.revealed = false;
      modeState.answerCorrect = null;
      state.flashcards[modeId] = modeState;
      renderView();
    }
  });

  mainContainer.addEventListener('input', (event) => {
    if (!event.target.classList.contains('answer-input')) return;

    const modeId = state.currentView;
    const modeState = state.flashcards[modeId] || createModeState();
    modeState.inputValue = event.target.value;
    modeState.revealed = false;
    modeState.answerCorrect = null;
    state.flashcards[modeId] = modeState;
  });

  mainContainer.addEventListener('click', (event) => {
    if (!event.target.classList.contains('flashcard-drink-modal')) return;

    const modeId = state.currentView;
    const modeState = state.flashcards[modeId] || createModeState();
    modeState.showDrinkPicker = false;
    state.flashcards[modeId] = modeState;
    renderView();
  });
}

function setSettingsSectionOpen(openSectionId) {
  if (!settingsModal) return;

  const sections = settingsModal.querySelectorAll('[data-settings-section]');
  sections.forEach((section) => {
    const sectionId = String(section.getAttribute('data-settings-section') || '').trim();
    const shouldOpen = Boolean(openSectionId && sectionId === openSectionId);
    const toggleButton = section.querySelector('[data-settings-toggle]');
    const panel = section.querySelector('.settings-panel');

    section.classList.toggle('is-open', shouldOpen);
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }

    if (panel) {
      panel.hidden = !shouldOpen;
    }
  });
}

async function loadModes() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Unable to load data.json');
    const payload = await response.json();
    const normalizedModes = normalizeModes(payload);
    const bottleImages = await discoverBottleRecognitionImages(normalizedModes);
    state.modes = applyBottleRecognitionImagePool(normalizedModes, bottleImages);
  } catch (error) {
    console.warn('Using fallback quiz data:', error);
    const normalizedModes = normalizeModes(getFallbackModes());
    const bottleImages = await discoverBottleRecognitionImages(normalizedModes);
    state.modes = applyBottleRecognitionImagePool(normalizedModes, bottleImages);
  }
}

async function discoverBottleRecognitionImages(modes = []) {
  const discovered = [];

  try {
    const response = await fetch(`./${BOTTLE_RECOGNITION_IMAGE_DIRECTORY}/`);
    if (response.ok) {
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const links = Array.from(doc.querySelectorAll('a[href]'));

      links.forEach((link) => {
        const href = String(link.getAttribute('href') || '').trim();
        const fileName = getFileName(href);
        if (!fileName) return;
        if (!isBottleImageFile(fileName)) return;
        discovered.push(`${BOTTLE_RECOGNITION_IMAGE_DIRECTORY}/${fileName}`);
      });
    }
  } catch (error) {
    // Ignore directory-listing failures and keep fallback sources.
  }

  const imagesFromModeData = collectBottleRecognitionImagesFromModes(modes);
  const merged = [...discovered, ...imagesFromModeData, ...BOTTLE_RECOGNITION_IMAGES];

  return Array.from(new Set(merged.map((imagePath) => normalizeImagePath(imagePath)).filter(Boolean)));
}

function isBottleImageFile(fileName) {
  const lowerName = String(fileName || '').trim().toLowerCase();
  return BOTTLE_IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

function normalizeImagePath(filePath) {
  const normalized = String(filePath || '').trim().replace(/^\.\//, '');
  if (!normalized) return '';

  const fileName = getFileName(normalized);
  if (!fileName) return '';

  // Keep explicit folder paths (for example BR_images/*) untouched.
  if (normalized.includes('/')) {
    return normalized;
  }

  return `${BOTTLE_RECOGNITION_IMAGE_DIRECTORY}/${fileName}`;
}

function collectBottleRecognitionImagesFromModes(modes = []) {
  return (Array.isArray(modes) ? modes : [])
    .filter((mode) => mode?.type === 'bottle-recognition')
    .flatMap((mode) => Array.isArray(mode.items) ? mode.items : [])
    .map((item) => normalizeImagePath(item?.image || ''))
    .filter((imagePath) => {
      const fileName = getFileName(imagePath);
      return Boolean(fileName && isBottleImageFile(fileName));
    });
}

function applyBottleRecognitionImagePool(modes, imagePool) {
  const normalizedPool = Array.from(new Set((Array.isArray(imagePool) ? imagePool : []).map((path) => normalizeImagePath(path)).filter(Boolean)));

  if (!normalizedPool.length) {
    return modes;
  }

  return modes.map((mode) => {
    if (mode?.type !== 'bottle-recognition') {
      return mode;
    }

    const existingItems = Array.isArray(mode.items) ? mode.items : [];
    const itemsByImageName = new Map();
    const itemsByImageKey = new Map();
    existingItems.forEach((item) => {
      const imageName = getFileName(normalizeImagePath(item?.image || ''));
      const imageKey = getBottleImageMatchKey(imageName);
      if (imageName) {
        itemsByImageName.set(imageName, item);
      }
      if (imageKey) {
        itemsByImageKey.set(imageKey, item);
      }
    });

    const knownBrands = existingItems.map((item) => sanitizeBrandName(item?.brand)).filter(Boolean);
    const knownTypes = existingItems.map((item) => normalizeAlcoholType(item?.alcoholType)).filter(Boolean);

    const nextItems = normalizedPool.map((imagePath) => {
      const imageName = getFileName(imagePath);
      const imageKey = getBottleImageMatchKey(imageName);
      const existing = itemsByImageName.get(imageName) || itemsByImageKey.get(imageKey);
      if (existing) {
        const normalizedBrand = sanitizeBrandName(existing.brand);
        const normalizedType = normalizeAlcoholType(existing.alcoholType);
        return {
          ...existing,
          image: imagePath,
          brand: normalizedBrand,
          alcoholType: normalizedType,
          brandOptions: buildBrandOptions(normalizedBrand, existing.brandOptions, knownBrands),
          typeOptions: buildAlcoholTypeOptions(normalizedType, existing.typeOptions, [...knownTypes, ...DEFAULT_ALCOHOL_TYPE_CHOICES])
        };
      }

      return buildBottleRecognitionItemFromImage(imagePath, knownBrands, knownTypes);
    });

    return {
      ...mode,
      items: nextItems
    };
  });
}

function getBottleImageMatchKey(fileName) {
  return String(fileName || '')
    .trim()
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]/g, '');
}

function buildBottleRecognitionItemFromImage(imagePath, knownBrands = [], knownTypes = []) {
  const imageName = getFileName(imagePath);
  const parsedMeta = parseBottleFileNameMetadata(imageName);
  const inferredBrand = inferBottleBrandFromFileName(imageName);
  const inferredType = inferBottleTypeFromFileName(imageName);

  return {
    type: 'bottle-recognition',
    question: 'Identify the bottle',
    image: imagePath,
    brand: inferredBrand,
    alcoholType: inferredType,
    fileNameCategories: parsedMeta.categories,
    fileNameExtraCategories: parsedMeta.extraCategories,
    brandOptions: buildBrandOptions(inferredBrand, knownBrands, DEFAULT_BRAND_CHOICES),
    typeOptions: buildAlcoholTypeOptions(inferredType, knownTypes, DEFAULT_ALCOHOL_TYPE_CHOICES)
  };
}

function inferBottleBrandFromFileName(fileName) {
  const meta = parseBottleFileNameMetadata(fileName);
  const clean = String(meta.brandSegment || '')
    .trim()
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return 'Unknown Brand';

  return sanitizeBrandName(clean);
}

function inferBottleTypeFromFileName(fileName) {
  const meta = parseBottleFileNameMetadata(fileName);
  const typeSegment = String(meta.alcoholTypeSegment || '')
    .trim()
    .replace(/-+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalizeAlcoholType(typeSegment) || 'Unknown';
}

function parseBottleFileNameMetadata(fileName) {
  const stem = String(fileName || '')
    .trim()
    .replace(/\.[^.]+$/, '');

  const categories = stem
    .split('_')
    .map((part) => String(part || '').trim())
    .filter(Boolean);

  return {
    categories,
    brandSegment: categories[0] || '',
    alcoholTypeSegment: categories[1] || '',
    extraCategories: categories.slice(2)
  };
}

function buildBrandOptions(correctValue, knownValues = [], fallbackValues = []) {
  const normalizedCorrect = sanitizeBrandName(correctValue) || 'Unknown Brand';
  const merged = [normalizedCorrect, ...knownValues, ...fallbackValues]
    .map((value) => sanitizeBrandName(value))
    .filter(Boolean);

  return ensureSixChoices(merged, ['Unknown Brand']);
}

function buildAlcoholTypeOptions(correctValue, knownValues = [], fallbackValues = []) {
  const normalizedCorrect = normalizeAlcoholType(correctValue) || 'Unknown';
  const merged = [normalizedCorrect, ...knownValues, ...fallbackValues]
    .map((value) => normalizeAlcoholType(value))
    .filter(Boolean);

  const unique = Array.from(new Set(merged));
  const distractors = unique.filter((value) => value !== normalizedCorrect);
  const correctFamily = getAlcoholTypeFamily(normalizedCorrect);
  const correctGroup = getAlcoholTypeGroup(correctFamily);

  const sameFamily = distractors.filter((value) => getAlcoholTypeFamily(value) === correctFamily);
  const sameGroup = distractors.filter((value) => {
    const family = getAlcoholTypeFamily(value);
    return family !== correctFamily && getAlcoholTypeGroup(family) === correctGroup;
  });
  const differentGroup = distractors.filter((value) => getAlcoholTypeGroup(getAlcoholTypeFamily(value)) !== correctGroup);

  const prioritized = [
    ...shuffleArray(sameFamily),
    ...shuffleArray(sameGroup),
    ...shuffleArray(differentGroup)
  ];

  const randomizedDistractors = prioritized.slice(0, 5);
  const combined = shuffleArray([normalizedCorrect, ...randomizedDistractors]);

  if (combined.length < 6) {
    return ensureSixChoices(combined, ['Unknown']);
  }

  return combined.slice(0, 6);
}

function getAlcoholTypeFamily(value) {
  const normalized = normalizeAlcoholType(value);
  if (!normalized) return 'unknown';

  if (ALCOHOL_TYPE_FAMILIES[normalized]) {
    return ALCOHOL_TYPE_FAMILIES[normalized];
  }

  const lower = normalized.toLowerCase();
  if (lower.includes('wine')) return 'wine';
  if (lower.includes('liqueur') || lower.includes('vermouth') || lower.includes('amaro')) return 'fortified-liqueurs';
  if (lower.includes('whiskey') || lower.includes('bourbon') || lower.includes('scotch')) return 'whiskey';
  if (lower.includes('vodka') || lower.includes('gin')) return 'clear-spirits';
  if (lower.includes('tequila') || lower.includes('mezcal')) return 'agave-spirits';
  if (lower.includes('rum')) return 'cane-spirits';

  return 'other';
}

function getAlcoholTypeGroup(family) {
  const normalized = String(family || '').trim().toLowerCase();

  if (['red-wine', 'white-wine', 'rose-wine', 'sparkling-wine', 'wine'].includes(normalized)) {
    return 'wine';
  }

  if (['fortified-liqueurs'].includes(normalized)) {
    return 'fortified';
  }

  if (['clear-spirits', 'cane-spirits', 'agave-spirits', 'whiskey', 'grape-spirits', 'rice-spirits', 'herbal-spirits'].includes(normalized)) {
    return 'spirits';
  }

  return 'other';
}

function ensureSixChoices(values, fillers = []) {
  const unique = Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));

  for (const filler of fillers) {
    if (unique.length >= 6) break;
    if (!unique.includes(filler)) unique.push(filler);
  }

  while (unique.length < 6) {
    unique.push(`Choice ${unique.length + 1}`);
  }

  return unique.slice(0, 6);
}

function sanitizeBrandName(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const descriptorWords = new Set([
    'vodka', 'gin', 'tequila', 'rum', 'whiskey', 'whisky', 'bourbon', 'scotch',
    'cabernet', 'sauvignon', 'pinot', 'noir', 'chardonnay', 'rose', 'rosé',
    'liqueur', 'liquor', 'blanco', 'reposado', 'anejo', 'añejo', 'silver', 'gold',
    'spiced', 'flavored', 'flavoured', 'extra', 'dry', 'orange'
  ]);

  const filteredWords = raw
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter((word) => word)
    .filter((word) => !descriptorWords.has(word.toLowerCase()));

  const sourceWords = filteredWords.length ? filteredWords : raw.split(/\s+/).filter(Boolean);

  return sourceWords
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

function normalizeAlcoholType(value) {
  const text = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ');
  if (!text) return '';

  for (const entry of ALCOHOL_TYPE_PATTERNS) {
    if (entry.pattern.test(text)) {
      return entry.label;
    }
  }

  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

function getFallbackModes() {
  return [
    {
      id: 'flashcards',
      label: 'Flash Cards',
      description: 'Practice questions with multiple-choice or single-answer cards.',
      type: 'flashcards',
      items: [
        {
          type: 'multiple-choice',
          question: 'What beers are on tap?',
          answers: ['Sapporo', 'Asahi', 'Turtle Season', 'Orange Blossom Pilsner'],
          correctAnswer: 'Sapporo'
        },
        {
          type: 'single-answer',
          question: 'What is the signature house drink?',
          answer: 'Sakura Tini'
        }
      ]
    }
  ];
}

function normalizeModes(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizeMode).filter(Boolean);
  }

  if (payload && typeof payload === 'object' && Array.isArray(payload.modes)) {
    return payload.modes.map(normalizeMode).filter(Boolean);
  }

  if (payload && typeof payload === 'object' && payload.id) {
    return [normalizeMode(payload)].filter(Boolean);
  }

  return [];
}

function normalizeMode(entry) {
  if (!entry || typeof entry !== 'object') return null;

  const items = Array.isArray(entry.items)
    ? entry.items.map(normalizeItem).filter(Boolean)
    : [];

  const recipes = Array.isArray(entry.recipes)
    ? entry.recipes.map(normalizeRecipe).filter(Boolean)
    : [];

  return {
    id: String(entry.id || 'mode').trim().toLowerCase(),
    label: entry.label || entry.title || 'Quiz Mode',
    description: entry.description || '',
    type: entry.type || 'flashcards',
    items,
    recipes,
    samplePrompts: Array.isArray(entry.samplePrompts)
      ? entry.samplePrompts.filter((item) => typeof item === 'string' && item.trim())
      : []
  };
}

function normalizeRecipe(recipe) {
  if (!recipe || typeof recipe !== 'object' || !recipe.name) return null;

  return {
    name: String(recipe.name),
    glass: recipe.glass ? String(recipe.glass) : '',
    ice: recipe.ice ? String(recipe.ice) : '',
    tool: recipe.tool ? String(recipe.tool) : '',
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients
        .filter((ing) => ing && ing.name)
        .map((ing) => ({ name: String(ing.name), oz: String(ing.oz || '') }))
      : [],
    garnishes: Array.isArray(recipe.garnishes)
      ? recipe.garnishes.filter((g) => typeof g === 'string' && g.trim())
      : []
  };
}

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null;

  const questionType = item['question-type'] || item.type || 'multiple-choice';

  if (questionType === 'bottle-recognition') {
    return {
      type: 'bottle-recognition',
      question: item.question || 'Identify the bottle',
      image: item.image || '',
      brand: item.brand || '',
      alcoholType: item.alcoholType || item.alcohol_type || '',
      brandOptions: Array.isArray(item.brandOptions) ? item.brandOptions.filter((entry) => typeof entry === 'string' && entry.trim()) : [],
      typeOptions: Array.isArray(item.typeOptions) ? item.typeOptions.filter((entry) => typeof entry === 'string' && entry.trim()) : []
    };
  }

  const hasChoices = questionType === 'multiple-choice' || Array.isArray(item.answers) || Array.isArray(item.options) || Array.isArray(item.choices) || Array.isArray(item['corect-answers']) || Array.isArray(item['correct-answers']) || Array.isArray(item.correctAnswers) || Array.isArray(item['correctAnswers']) || Array.isArray(item.distractors);

  if (hasChoices && questionType !== 'single-answer') {
    const correctAnswers = Array.isArray(item['corect-answers'])
      ? item['corect-answers']
      : Array.isArray(item['correct-answers'])
        ? item['correct-answers']
        : Array.isArray(item.correctAnswers)
          ? item.correctAnswers
          : Array.isArray(item['correctAnswers'])
            ? item['correctAnswers']
            : [];

    const distractors = Array.isArray(item.distractors)
      ? item.distractors
      : [];

    const answers = Array.isArray(item.answers)
      ? item.answers
      : Array.isArray(item.options)
        ? item.options
        : Array.isArray(item.choices)
          ? item.choices
          : [...correctAnswers, ...distractors];

    const normalizedCorrectAnswers = (correctAnswers.length ? correctAnswers : (item.correctAnswer || item['correct-answer'] || item['corect-answer'] ? [item.correctAnswer || item['correct-answer'] || item['corect-answer']] : [])).map(String);

    return {
      type: 'multiple-choice',
      question: item.question || 'Untitled question',
      answers,
      correctAnswers: normalizedCorrectAnswers,
      correctAnswer: normalizedCorrectAnswers[0] || ''
    };
  }

  return {
    type: 'single-answer',
    question: item.question || 'Untitled question',
    answer: item.answer || item.correctAnswer || item['correct-answer'] || item['corect-answer'] || ''
  };
}

function renderView() {
  if (!mainContainer) return;

  if (state.currentView === 'menu' || !state.modes.length) {
    renderModeMenu();
    return;
  }

  const mode = state.modes.find((entry) => entry.id === state.currentView);
  if (!mode) {
    state.currentView = 'menu';
    renderModeMenu();
    return;
  }

  if (mode.type === 'flashcards') {
    renderFlashcards(mode);
    return;
  }

  if (isBuildDrinkMode(mode)) {
    renderBuildDrink(mode);
    return;
  }

  if (mode.type === 'bottle-recognition') {
    renderBottleRecognition(mode);
    return;
  }

  if (isDrinkGameMode(mode)) {
    renderDrinkGame(mode);
    return;
  }

  if (mode.type === 'placeholder') {
    renderPlaceholderMode(mode);
    return;
  }

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card">
        <p>More quiz modes can be added here later.</p>
      </div>
    </section>
  `;
  updateActiveModeButtons();
}

function renderModeMenu() {
  const cardsMarkup = state.modes.map((mode) => {
    const modeClassToken = String(mode.id || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    return `
      <button class="mode-btn mode-btn--${escapeAttribute(modeClassToken || 'default')}${state.currentView === mode.id ? ' active' : ''}" type="button" data-mode="${escapeAttribute(mode.id)}">
        <span class="mode-btn-header">
          <span class="mode-btn-title">${escapeHtml(mode.label)}</span>
        </span>
        <span class="mode-btn-copy original-theme-titles">${escapeHtml(mode.description || 'Start this quiz mode.')}</span>
      </button>
    `;
  }).join('');

  mainContainer.innerHTML = `
    <section class="mode-menu">
      <h2>Choose a quiz mode</h2>
      <div class="mode-menu-intro">
        <p class="original-theme-titles">Select a mode to start practicing the drink menu and service knowledge.</p>
      </div>
      <div class="mode-grid">
        ${cardsMarkup}
      </div>
    </section>
  `;
  updateActiveModeButtons();
}

function renderPlaceholderMode(mode) {
  const prompts = Array.isArray(mode.samplePrompts) && mode.samplePrompts.length
    ? mode.samplePrompts
    : (Array.isArray(mode.items) && mode.items.length ? mode.items.map((item) => item.question).filter(Boolean) : []);

  const promptsMarkup = prompts.length
    ? `<div class="mode-prompt-list">${prompts.map((prompt) => `<span class="mode-prompt-pill">${escapeHtml(prompt)}</span>`).join('')}</div>`
    : '';

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card placeholder-card">
        <p class="quiz-counter">Coming soon</p>
        <h3>${escapeHtml(mode.description || 'This mode is ready for more content.')}</h3>
        <p class="placeholder-copy">This screen is now wired for future prompts, answer keys, and scoring so new quiz modes can be added without rebuilding the shell.</p>
        ${promptsMarkup}
      </div>
    </section>
  `;
  updateActiveModeButtons();
}

function renderBottleRecognition(mode) {
  const modeState = state.flashcards[mode.id] || createModeState();
  state.flashcards[mode.id] = modeState;

  const cardOrder = getOrBuildCardOrder(mode, modeState);
  const itemCount = cardOrder.length;

  if (modeState.completed) {
    renderModeCompletion(mode, modeState, itemCount);
    return;
  }

  if (modeState.index > Math.max(itemCount - 1, 0)) {
    modeState.index = Math.max(itemCount - 1, 0);
  }

  const cardIndex = cardOrder[modeState.index] ?? modeState.index;
  const card = Array.isArray(mode.items) ? mode.items[cardIndex] : null;
  const imageSrc = resolveBottleRecognitionImage(card, modeState.index);

  const brandOptions = Array.isArray(card?.brandOptions) && card.brandOptions.length ? card.brandOptions : [];
  const typeOptions = Array.isArray(card?.typeOptions) && card.typeOptions.length ? card.typeOptions : [];
  const brandCardKey = `brand:${mode.id}:${cardIndex}`;
  const typeCardKey = `type:${mode.id}:${cardIndex}`;
  const orderedBrandOptions = getBottleOptionOrder(modeState, 'brand', brandOptions, brandCardKey);
  const orderedTypeOptions = getBottleOptionOrder(modeState, 'type', typeOptions, typeCardKey);
  const selectedBrand = String(modeState.selectedBrand || '').trim();
  const selectedType = String(modeState.selectedType || '').trim();
  const correctBrand = String(card?.brand || '').trim();
  const correctType = String(card?.alcoholType || '').trim();

  const brandOptionsMarkup = orderedBrandOptions.map((option) => {
    const normalizedOption = String(option);
    const isSelected = selectedBrand === normalizedOption;
    const className = `answer-btn bottle-choice-btn${isSelected ? ' selected' : ''}${modeState.revealed && normalizedOption === correctBrand ? ' answer-btn-correct' : ''}${modeState.revealed && isSelected && normalizedOption !== correctBrand ? ' answer-btn-incorrect' : ''}`;
    return `<button class="${className}" type="button" data-option="${escapeAttribute(normalizedOption)}" data-group="brand">${escapeHtml(normalizedOption)}</button>`;
  }).join('');

  const typeOptionsMarkup = orderedTypeOptions.map((option) => {
    const normalizedOption = String(option);
    const isSelected = selectedType === normalizedOption;
    const className = `answer-btn bottle-choice-btn${isSelected ? ' selected' : ''}${modeState.revealed && normalizedOption === correctType ? ' answer-btn-correct' : ''}${modeState.revealed && isSelected && normalizedOption !== correctType ? ' answer-btn-incorrect' : ''}`;
    return `<button class="${className}" type="button" data-option="${escapeAttribute(normalizedOption)}" data-group="type">${escapeHtml(normalizedOption)}</button>`;
  }).join('');

  const feedbackMarkup = modeState.revealed
    ? `<p class="feedback ${modeState.answerCorrect ? 'correct' : 'incorrect'}">${modeState.answerCorrect ? 'Nice work — you identified both the brand and the alcohol type.' : `Not quite — the brand was ${escapeHtml(correctBrand || 'unknown')} and the alcohol type was ${escapeHtml(correctType || 'unknown')}.`}</p>`
    : '';

  const isLastCard = itemCount > 0 && modeState.index >= itemCount - 1;
  const nextButtonLabel = modeState.revealed ? (isLastCard ? 'Finish' : 'Next') : 'Check';

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card bottle-card">
        <p class="quiz-counter">Bottle recognition • ${modeState.index + 1} / ${itemCount}</p>
        <div class="bottle-image-panel">
          <img class="bottle-image" src="${escapeAttribute(imageSrc)}" alt="Bottle image to identify" />
        </div>
        <div class="bottle-choices">
          <div class="bottle-choice-group">
            <h3>Brand</h3>
            <div class="choice-grid">${brandOptionsMarkup}</div>
          </div>
          <div class="bottle-choice-group">
            <h3>Alcohol Type</h3>
            <div class="choice-grid">${typeOptionsMarkup}</div>
          </div>
          ${feedbackMarkup}
        </div>
      </div>
      <div class="quiz-actions">
        <button class="action-btn" type="button" data-action="prev">Previous</button>
        <button class="action-btn" type="button" data-action="next">${nextButtonLabel}</button>
      </div>
    </section>
  `;
  updateActiveModeButtons();
}

function isBuildDrinkMode(mode) {
  return Boolean(mode && (mode.id === 'builddrink' || mode.type === 'build-drink'));
}

function getBuildDrinkRecipes(mode) {
  const directRecipes = (Array.isArray(mode?.items) ? mode.items : [])
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const drinkName = String(item.drinkName || item.name || '').trim();
      const ingredients = Array.isArray(item.ingredients)
        ? item.ingredients.map((entry) => cleanIngredientAnswer(entry)).filter(Boolean)
        : [];

      if (!drinkName || !ingredients.length) {
        return null;
      }

      return {
        drinkName,
        ingredients: Array.from(new Set(ingredients))
      };
    })
    .filter(Boolean);

  if (directRecipes.length) {
    return directRecipes;
  }

  const flashcardMode = state.modes.find((entry) => entry.id === 'flashcards' || entry.type === 'flashcards');
  const recipes = [];
  const sourceItems = Array.isArray(flashcardMode?.items) ? flashcardMode.items : [];

  sourceItems.forEach((item) => {
    const questionText = String(item?.question || '');
    const match = questionText.match(/^Which ingredients come in (.+)\? \(Select all that apply\)$/);
    if (!match) {
      return;
    }

    const drinkName = String(match[1] || '').trim();
    const ingredients = getCorrectAnswers(item)
      .map((entry) => cleanIngredientAnswer(entry))
      .filter(Boolean);

    if (!drinkName || !ingredients.length) {
      return;
    }

    if (recipes.some((recipe) => recipe.drinkName === drinkName)) {
      return;
    }

    recipes.push({
      drinkName,
      ingredients: Array.from(new Set(ingredients))
    });
  });

  return recipes;
}

function getOrBuildBuildDrinkOrder(modeState, itemCount) {
  if (!itemCount) {
    modeState.buildOrder = [];
    return modeState.buildOrder;
  }

  const hasValidOrder = Array.isArray(modeState.buildOrder)
    && modeState.buildOrder.length === itemCount
    && new Set(modeState.buildOrder).size === itemCount
    && modeState.buildOrder.every((index) => Number.isInteger(index) && index >= 0 && index < itemCount);

  if (!hasValidOrder) {
    modeState.buildOrder = shuffleArray(Array.from({ length: itemCount }, (_, index) => index));
  }

  return modeState.buildOrder;
}

function getBuildDrinkRoundContext(mode, modeState) {
  const recipes = getBuildDrinkRecipes(mode);
  const itemCount = recipes.length;
  const order = getOrBuildBuildDrinkOrder(modeState, itemCount);

  if (!itemCount) {
    return null;
  }

  if (modeState.index > Math.max(itemCount - 1, 0)) {
    modeState.index = Math.max(itemCount - 1, 0);
  }

  const recipeIndex = order[modeState.index] ?? modeState.index;
  const recipe = recipes[recipeIndex] || recipes[0];
  if (!recipe) {
    return null;
  }

  return {
    recipes,
    itemCount,
    recipeIndex,
    recipe
  };
}

function getOrBuildBuildDrinkRoundOptions(modeState, recipe, recipes, recipeIndex) {
  const correctIngredients = Array.isArray(recipe?.ingredients)
    ? recipe.ingredients.map((entry) => String(entry || '').trim()).filter(Boolean)
    : [];
  const key = `${recipeIndex}:${correctIngredients.join('|')}`;
  const cached = Array.isArray(modeState.buildRoundOptions) ? modeState.buildRoundOptions : [];

  const hasValidCache = modeState.buildRoundKey === key
    && cached.length >= correctIngredients.length
    && correctIngredients.every((ingredient) => cached.includes(ingredient));

  if (hasValidCache) {
    return cached;
  }

  const allIngredients = Array.from(new Set(
    (Array.isArray(recipes) ? recipes : [])
      .flatMap((entry) => Array.isArray(entry.ingredients) ? entry.ingredients : [])
      .map((entry) => String(entry || '').trim())
      .filter(Boolean)
  ));
  const distractorPool = allIngredients.filter((ingredient) => !correctIngredients.includes(ingredient));
  const desiredCount = Math.max(8, correctIngredients.length + 3);
  const distractorCount = Math.max(0, desiredCount - correctIngredients.length);
  const distractors = shuffleArray(distractorPool).slice(0, distractorCount);

  modeState.buildRoundOptions = shuffleArray(Array.from(new Set([...correctIngredients, ...distractors])));
  modeState.buildRoundKey = key;
  return modeState.buildRoundOptions;
}

function getBuildDrinkHintText(recipe, selectedOptions) {
  const expected = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const selected = Array.isArray(selectedOptions) ? selectedOptions : [];
  const missing = expected.filter((ingredient) => !selected.includes(ingredient));

  if (!missing.length) {
    return 'Hint: You already selected all required ingredients. Check your extras.';
  }

  const suggestion = missing[0];
  const firstChar = suggestion.charAt(0).toUpperCase();
  return `Hint: one missing ingredient starts with "${firstChar}".`;
}

function scoreBuildDrinkRound(mode, modeState) {
  const context = getBuildDrinkRoundContext(mode, modeState);
  if (!context) {
    return;
  }

  const expected = Array.isArray(context.recipe.ingredients) ? context.recipe.ingredients : [];
  const submitted = Array.isArray(modeState.buildSelectedOptions) ? modeState.buildSelectedOptions : [];
  const isCorrect = isSelectionCorrect(submitted, expected);

  modeState.buildRoundRevealed = true;
  modeState.buildRoundCorrect = isCorrect;
  setCardResult(modeState, context.recipeIndex, isCorrect);
}

function renderBuildDrink(mode) {
  const modeState = state.flashcards[mode.id] || createModeState();
  state.flashcards[mode.id] = modeState;

  const context = getBuildDrinkRoundContext(mode, modeState);
  if (!context) {
    mainContainer.innerHTML = `
      <section class="quiz-view">
        <div class="quiz-header">
          <button class="back-btn" type="button" data-action="back">Back</button>
          <h2>${escapeHtml(mode.label)}</h2>
        </div>
        <div class="quiz-card placeholder-card">
          <p class="quiz-counter">Build a drink</p>
          <h3>No recipes found yet.</h3>
          <p class="placeholder-copy">Add ingredient cards in Flash Cards and this mode will auto-build rounds from them.</p>
        </div>
      </section>
    `;
    updateActiveModeButtons();
    return;
  }

  if (modeState.completed) {
    renderBuildDrinkCompletion(mode, modeState, context.itemCount);
    return;
  }

  const { recipes, recipe, recipeIndex, itemCount } = context;
  const roundOptions = getOrBuildBuildDrinkRoundOptions(modeState, recipe, recipes, recipeIndex);
  const selectedOptions = Array.isArray(modeState.buildSelectedOptions) ? modeState.buildSelectedOptions : [];
  const expected = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const isLastRound = modeState.index >= itemCount - 1;

  const optionMarkup = roundOptions.map((option) => {
    const normalizedOption = String(option || '').trim();
    const isSelected = selectedOptions.includes(normalizedOption);
    const isCorrectIngredient = expected.includes(normalizedOption);

    let className = `answer-btn build-option-btn${isSelected ? ' selected' : ''}`;
    if (modeState.buildRoundRevealed) {
      if (isSelected && isCorrectIngredient) {
        className += ' answer-btn-correct';
      } else if (isSelected && !isCorrectIngredient) {
        className += ' answer-btn-incorrect';
      } else if (!isSelected && isCorrectIngredient) {
        className += ' answer-btn-missed';
      }
    }

    return `
      <button class="${className}" type="button" data-action="build-toggle-option" data-build-option="${escapeAttribute(normalizedOption)}">
        ${escapeHtml(normalizedOption)}
      </button>
    `;
  }).join('');

  const feedbackMarkup = modeState.buildRoundRevealed
    ? `<p class="feedback ${modeState.buildRoundCorrect ? 'correct' : 'incorrect'}">${modeState.buildRoundCorrect ? 'Perfect pour. That build is correct.' : `Close, but not quite. Correct ingredients: ${escapeHtml(expected.join(', '))}.`}</p>`
    : '';
  const hintMarkup = modeState.buildHintUsed && !modeState.buildRoundRevealed
    ? `<p class="build-hint">${escapeHtml(getBuildDrinkHintText(recipe, selectedOptions))}</p>`
    : '';

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card build-drink-card">
        <p class="quiz-counter">Round ${modeState.index + 1} / ${itemCount}</p>
        <h3>Build: ${escapeHtml(recipe.drinkName)}</h3>
        <p class="build-meta">Pick exactly ${expected.length} ingredient${expected.length === 1 ? '' : 's'}.</p>
        <div class="build-score-strip">
          <span>Selected: ${selectedOptions.length}</span>
          <span>Target: ${expected.length}</span>
        </div>
        <div class="answer-list build-option-grid">
          ${optionMarkup}
        </div>
        ${hintMarkup}
        ${feedbackMarkup}
      </div>
      <div class="quiz-actions">
        <button class="action-btn" type="button" data-action="build-prev">Previous</button>
        <button class="action-btn" type="button" data-action="build-hint">Hint</button>
        <button class="action-btn" type="button" data-action="build-check">Check</button>
        <button class="action-btn" type="button" data-action="build-next">${modeState.buildRoundRevealed ? (isLastRound ? 'Finish' : 'Next Round') : 'Lock In'}</button>
      </div>
    </section>
  `;

  updateActiveModeButtons();
}

function renderBuildDrinkCompletion(mode, modeState, itemCount) {
  const score = getModeScore(modeState, itemCount);
  const headline = score.percent >= 90
    ? 'Bartender mode: unlocked.'
    : score.percent >= 70
      ? 'Solid run. You are getting sharp.'
      : 'Good practice set. Run it back.';

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card build-drink-card build-complete-card">
        <p class="quiz-counter">Service rush complete</p>
        <h3>${escapeHtml(headline)}</h3>
        <p class="build-final-score">Score: ${score.correct} / ${score.total} (${score.percent}%)</p>
      </div>
      <div class="quiz-actions">
        <button class="action-btn" type="button" data-action="restart-mode">Start Over</button>
        <button class="action-btn" type="button" data-action="menu">Back to Main Menu</button>
      </div>
    </section>
  `;

  updateActiveModeButtons();
}

function isDrinkGameMode(mode) {
  return Boolean(mode && (mode.id === 'drinkgame' || mode.type === 'drink-game'));
}

function getHighScore() {
  const saved = localStorage.getItem('drinkgame_highscore');
  return saved ? Math.max(0, parseInt(saved, 10) || 0) : 0;
}

function checkAndSaveHighScore(score) {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem('drinkgame_highscore', String(score));
    return true;
  }
  return false;
}

function getDrinkRecipesFromModes(modes = []) {
  const drinkGameMode = modes.find((m) => m.id === 'drinkgame' || m.type === 'drink-game');
  return Array.isArray(drinkGameMode?.recipes) ? drinkGameMode.recipes : [];
}

function getDrinkProfilesFromModes(modes = []) {
  const flashcardMode = modes.find((m) => m.id === 'flashcards' || m.type === 'flashcards');
  const items = Array.isArray(flashcardMode?.items) ? flashcardMode.items : [];
  const drinkMap = new Map();

  items.forEach((item) => {
    const q = String(item.question || '').trim();

    const ingMatch = q.match(/^Which ingredients come in (.+)\? \(Select all that apply\)$/);
    if (ingMatch) {
      const name = ingMatch[1].trim();
      if (!drinkMap.has(name)) drinkMap.set(name, { name, ingredients: [], glass: '', method: '', garnishes: [] });
      const entry = drinkMap.get(name);
      entry.ingredients = getCorrectAnswers(item).map(cleanIngredientAnswer).filter(Boolean);
      return;
    }

    const glassMatch = q.match(/^Which glass does (.+) go in\?$/);
    if (glassMatch) {
      const name = glassMatch[1].trim();
      if (!drinkMap.has(name)) drinkMap.set(name, { name, ingredients: [], glass: '', method: '', garnishes: [] });
      const entry = drinkMap.get(name);
      const glasses = getCorrectAnswers(item);
      if (glasses.length) entry.glass = glasses[0];
      return;
    }

    const shakeMatch = q.match(/^Is (.+) shaken or stirred\?$/);
    if (shakeMatch) {
      const name = shakeMatch[1].trim();
      if (!drinkMap.has(name)) drinkMap.set(name, { name, ingredients: [], glass: '', method: '', garnishes: [] });
      const entry = drinkMap.get(name);
      const methods = getCorrectAnswers(item);
      if (methods.length) entry.method = methods[0];
      return;
    }

    const garnishMatch = q.match(/^Which garnishes go on (.+)\? \(Select all that apply\)$/);
    if (garnishMatch) {
      const name = garnishMatch[1].trim();
      if (!drinkMap.has(name)) drinkMap.set(name, { name, ingredients: [], glass: '', method: '', garnishes: [] });
      const entry = drinkMap.get(name);
      entry.garnishes = getCorrectAnswers(item);
      return;
    }
  });

  return Array.from(drinkMap.values());
}

function getOrBuildDrinkGameTickets(modeState, modes) {
  if (Array.isArray(modeState.gameTickets) && modeState.gameTickets.length > 0) {
    return modeState.gameTickets;
  }

  const drinkProfiles = getDrinkProfilesFromModes(modes);
  const tickets = drinkProfiles.map((drink) => ({
    drinkName: drink.name,
    tag: 'ORDER TICKET',
    prompt: `Order Up: 1x ${drink.name}`
  }));

  const shuffledTickets = shuffleArray(tickets);
  modeState.gameTickets = shuffledTickets.length ? shuffledTickets : [
    { drinkName: "Call Me 'Koko'", tag: 'ORDER TICKET', prompt: 'Order Up: 1x Call Me \'Koko\'' },
    { drinkName: "Mary Not Martha", tag: 'ORDER TICKET', prompt: 'Order Up: 1x Mary Not Martha' },
    { drinkName: "Negroni", tag: 'ORDER TICKET', prompt: 'Order Up: 1x Negroni' }
  ];
  return modeState.gameTickets;
}

// Renders a CSS-drawn glass silhouette matching the given glass type (falls back to a rocks glass shape).
function getGlassIconMarkup(glassName) {
  const normalized = String(glassName || '').toLowerCase();
  let shape = 'rocks';
  if (normalized.includes('martini')) shape = 'martini';
  else if (normalized.includes('collins')) shape = 'collins';
  else if (normalized.includes('coupe')) shape = 'coupe';
  else if (normalized.includes('highball')) shape = 'highball';
  else if (normalized.includes('wine')) shape = 'wine';
  else if (normalized.includes('pint')) shape = 'pint';
  else if (normalized.includes('rocks')) shape = 'rocks';

  if (shape === 'martini' || shape === 'coupe' || shape === 'wine') {
    return `
      <span class="glass-icon glass-icon-${shape}">
        <span class="glass-bowl"></span>
        <span class="glass-stem"></span>
        <span class="glass-base"></span>
      </span>
    `;
  }

  return `
    <span class="glass-icon glass-icon-${shape}">
      <span class="glass-bowl"></span>
    </span>
  `;
}

function renderDrinkGameModal(modeState) {
  if (!modeState.gameActiveModal) return '';

  const modalType = modeState.gameActiveModal;

  if (modalType === 'glass') {
    const glassOptionsMarkup = DEFAULT_GLASS_OPTIONS.map((glass) => `
      <button class="answer-btn game-modal-option-btn" type="button" data-action="game-select-glass" data-value="${escapeAttribute(glass)}">
        ${getGlassIconMarkup(glass)}
        <span>${escapeHtml(glass)}</span>
      </button>
    `).join('');

    return `
      <div class="modal active" id="gameModal" aria-hidden="false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Select Glassware</h2>
            <button class="close-btn" type="button" data-action="game-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="game-modal-grid">${glassOptionsMarkup}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (modalType === 'ice') {
    const iceOptionsMarkup = DEFAULT_ICE_OPTIONS.map((ice) => `
      <button class="answer-btn game-modal-option-btn" type="button" data-action="game-select-ice" data-value="${escapeAttribute(ice)}">
        <span class="game-placeholder-icon">🧊</span>
        <span>${escapeHtml(ice)}</span>
      </button>
    `).join('');

    return `
      <div class="modal active" id="gameModal" aria-hidden="false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Select Ice</h2>
            <button class="close-btn" type="button" data-action="game-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="game-modal-grid">${iceOptionsMarkup}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (modalType === 'tool') {
    const toolOptionsMarkup = DEFAULT_TOOL_OPTIONS.map((tool) => `
      <button class="answer-btn game-modal-option-btn" type="button" data-action="game-select-tool" data-value="${escapeAttribute(tool)}">
        <span class="game-placeholder-icon">🥄</span>
        <span>${escapeHtml(tool)}</span>
      </button>
    `).join('');

    return `
      <div class="modal active" id="gameModal" aria-hidden="false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Select Tool / Vessel</h2>
            <button class="close-btn" type="button" data-action="game-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="game-modal-grid">${toolOptionsMarkup}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (modalType === 'bottle') {
    const bottleName = modeState.gameActiveBottle || 'Bottle';
    const currentOz = modeState.gameActiveOz || '.75 oz';
    const showDashes = !!modeState.gameOzShowDashes;

    const ozButtonsMarkup = showDashes
      ? DASH_OUNCE_OPTIONS.map((oz) => `
        <button class="answer-btn game-oz-btn ${currentOz === oz ? 'selected' : ''}" type="button" data-action="game-select-oz" data-oz="${escapeAttribute(oz)}">
          ${escapeHtml(oz)}
        </button>
      `).join('')
      : DEFAULT_OUNCE_OPTIONS.map((oz) => `
        <button class="answer-btn game-oz-btn ${currentOz === oz ? 'selected' : ''}" type="button" data-action="game-select-oz" data-oz="${escapeAttribute(oz)}">
          ${escapeHtml(oz)}
        </button>
      `).join('');

    return `
      <div class="modal active" id="gameModal" aria-hidden="false">
        <div class="modal-content">
          <div class="modal-header">
            ${showDashes ? '<button class="back-btn game-oz-back-btn" type="button" data-action="game-oz-back">&larr; Back</button>' : ''}
            <h2>Pour: ${escapeHtml(bottleName)}</h2>
            <button class="close-btn" type="button" data-action="game-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="bottle-pour-modal-body">
              <div class="bottle-modal-img-placeholder">
                <span class="game-placeholder-icon">🍾</span>
                <p><strong>${escapeHtml(bottleName)}</strong></p>
              </div>
              <div class="pour-amount-selector">
                <label class="option-label">Select Amount to Pour:</label>
                <div class="oz-grid">${ozButtonsMarkup}</div>
              </div>
              <button class="action-btn game-confirm-pour-btn" type="button" data-action="game-add-bottle-ingredient">
                Pour ${escapeHtml(currentOz)} into Vessel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

function renderStationPrepControls(modeState) {
  return `
    <div class="station-prep-controls">
      <button class="station-prep-btn ${modeState.gameSelectedGlass ? 'completed' : ''}" type="button" data-action="game-open-modal" data-modal-type="glass">
        ${getGlassIconMarkup(modeState.gameSelectedGlass)}
        <span class="prep-text">${escapeHtml(modeState.gameSelectedGlass || 'GLASS')}</span>
      </button>
      <button class="station-prep-btn ${modeState.gameSelectedIce ? 'completed' : ''}" type="button" data-action="game-open-modal" data-modal-type="ice">
        <span class="prep-icon">🧊</span>
        <span class="prep-text">${escapeHtml(modeState.gameSelectedIce || 'ICE')}</span>
      </button>
      <button class="station-prep-btn ${modeState.gameSelectedTool ? 'completed' : ''}" type="button" data-action="game-open-modal" data-modal-type="tool">
        <span class="prep-icon">🥄</span>
        <span class="prep-text">${escapeHtml(modeState.gameSelectedTool || 'TOOLS')}</span>
      </button>
    </div>
  `;
}

function renderDrinkGameStation(modeState) {
  const railBottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'rail');
  const sodaBottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'sodas');
  const bittersBottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'bitters' && !b.spacer && !['b45', 'b54', 'b57', 'b58', 'b59'].includes(b.id)).reverse();
  const bittersExtraBottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => ['b45', 'b54', 'b57', 'b58', 'b59'].includes(b.id));
  const mixer1Bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'mixer1');
  const mixer2Bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'mixer2');
  const sidewell1Bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'sidewell1');
  const sidewell2Bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'sidewell2');
  const sidewell3Bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'sidewell3');
  const sidewell4Bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'sidewell4');
  const sidewell5Bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === 'sidewell5');

  const renderBottleCircles = (bottles) => bottles.map((b) => {
    if (b.spacer) {
      return '<span class="station-bottle-spacer"></span>';
    }
    const color = BOTTLE_COLOR_MAP[b.id];
    const colorStyle = color ? `--bottle-base: ${color.base}; --bottle-bright: ${color.bright}; --bottle-accent: ${color.accent};` : '';
    return `
    <button class="station-bottle-circle" type="button" data-action="game-click-bottle" data-bottle-name="${escapeAttribute(b.name)}" title="${escapeAttribute(b.name)}">
      <span class="bottle-icon" style="${escapeAttribute(colorStyle)}"></span>
      <span class="circle-label">${escapeHtml(b.name)}</span>
    </button>
  `;
  }).join('');

  const stationViewButtons = `
    <div class="station-view-toggle">
      <button class="action-btn station-view-btn ${modeState.gameStationView !== 'winelist' ? 'selected' : ''}" type="button" data-action="game-station-view" data-view="default">
        Reset Station
      </button>
      <button class="action-btn station-view-btn ${modeState.gameStationView === 'winelist' ? 'selected' : ''}" type="button" data-action="game-station-view" data-view="winelist">
        Wine List
      </button>
    </div>
  `;

  if (modeState.gameStationView === 'winelist') {
    const wineCategories = ['Reds', 'Whites', 'Rose', 'Bubbles', 'Sake'];
    const categoriesMarkup = wineCategories.map((category) => {
      const bottles = DRINK_GAME_BOTTLE_LAYOUT.filter((b) => b.row === `wine-${category}`);
      return `
      <div class="wine-category-area">
        <span class="wine-category-label">${escapeHtml(category.toUpperCase())}</span>
        <div class="wine-category-row">${renderBottleCircles(bottles)}</div>
      </div>
    `;
    }).join('');

    return `
      <div class="interactive-station-container">
        <div class="station-grid-layout">
          <div class="wine-category-grid">${categoriesMarkup}</div>
        </div>
        ${stationViewButtons}
      </div>
    `;
  }

  return `
    <div class="interactive-station-container">
      <div class="station-grid-layout">
        <!-- Upper Shelf: Mixer block (left) + Side Well (left, divided) -->
        <div class="upper-shelf-row">
          <div class="mixer-column">
            <div class="bitters-top-row">
              <div class="bitters-shelf-area">
                <span class="bitters-label">BITTERS</span>
                <div class="bitters-row">${renderBottleCircles(bittersBottles)}</div>
              </div>

              <div class="mixer-top-divider" style="height: ${16 + bittersBottles.length * 68 + Math.max(0, bittersBottles.length - 1) * 10}px;"></div>

              <div class="soda-shelf-area">
                <span class="soda-label">SODAS</span>
                <div class="soda-row">${renderBottleCircles(sodaBottles)}</div>
              </div>

              <div class="bitters-extra-row">${renderBottleCircles(bittersExtraBottles)}</div>
            </div>

            <div class="station-empty-row"></div>
            <div class="station-empty-row"></div>
            <div class="mixer-column-divider"></div>

            <div class="mixer-shelf-area">
              <span class="mixer-label">MIXERS</span>
              <div class="mixer-row">${renderBottleCircles(mixer1Bottles)}</div>
              <div class="mixer-row">${renderBottleCircles(mixer2Bottles)}</div>
            </div>
          </div>

          <div class="shelf-divider"></div>

          <div class="sidewell-shelf-area">
            <span class="sidewell-label">SIDE WELL</span>
            <div class="sidewell-row">${renderBottleCircles(sidewell1Bottles)}</div>
            <div class="sidewell-row">${renderBottleCircles(sidewell2Bottles)}</div>
            <div class="sidewell-row">${renderBottleCircles(sidewell3Bottles)}</div>
            <div class="sidewell-row">${renderBottleCircles(sidewell4Bottles)}</div>
            <div class="sidewell-row">${renderBottleCircles(sidewell5Bottles)}</div>
          </div>
        </div>

        <!-- Speed Rail (Bottom Row, full width) -->
        <div class="speedrail-area">
          <span class="rail-label">SPEED RAIL</span>
          <div class="speedrail-row">${renderBottleCircles(railBottles)}</div>
        </div>
      </div>
      ${stationViewButtons}
    </div>
  `;
}

function renderDrinkGame(mode) {
  const modeState = state.flashcards[mode.id] || createModeState();
  state.flashcards[mode.id] = modeState;

  const tickets = getOrBuildDrinkGameTickets(modeState, state.modes);
  const ticketCount = tickets.length;

  if (modeState.completed) {
    renderDrinkGameCompletion(mode, modeState);
    return;
  }

  if (modeState.gameTicketIndex >= ticketCount) {
    modeState.completed = true;
    checkAndSaveHighScore(modeState.gameScore);
    renderDrinkGameCompletion(mode, modeState);
    return;
  }

  const ticket = tickets[modeState.gameTicketIndex];
  const hearts = '❤️ '.repeat(modeState.gameLives) + '💔 '.repeat(Math.max(0, 3 - modeState.gameLives));
  const highScore = getHighScore();

  // STAGE 1: Prep & Build Stage
  if (modeState.gameStage === 'prep' || modeState.gameStage === 'build') {
    const ingredientsListMarkup = modeState.gameAddedIngredients.length > 0
      ? modeState.gameAddedIngredients.map((item, idx) => {
          const feedback = modeState.gameIngredientFeedback[idx];
          const feedbackClass = feedback ? ` ingredient-${feedback}` : '';
          return `
          <div class="game-added-ingredient-row${feedbackClass}">
            <span>🔹 <strong>${escapeHtml(item.name)}</strong> - ${escapeHtml(item.oz)}</span>
            <button class="game-remove-ing-btn" type="button" data-action="game-remove-ingredient" data-index="${idx}">&times;</button>
          </div>
        `;
        }).join('')
      : `<p class="game-empty-list-text">No bottles poured yet. Click any bottle below to pour!</p>`;

    const errorMessageMarkup = modeState.gameErrorMessage
      ? `<div class="game-error-toast">⚠️ ${escapeHtml(modeState.gameErrorMessage)}</div>`
      : '';

    mainContainer.innerHTML = `
      <section class="quiz-view drink-game-view">
        <div class="quiz-header">
          <button class="back-btn" type="button" data-action="back">Back</button>
          <h2>${escapeHtml(mode.label)}</h2>
          <button class="action-btn" type="button" data-action="game-restart">Restart Shift</button>
        </div>

        <div class="quiz-card drink-game-card game-build-stage">
          <div class="game-side-panel">
            <div class="ticket-status-bar">
              <div class="status-item"><span class="status-label">Lives:</span><span class="heart-lives">${hearts}</span></div>
              <div class="status-item"><span class="status-label">Score:</span><span>${modeState.gameScore} PTS</span></div>
              <div class="status-item streak-badge"><span>🔥 ${modeState.gameStreak}</span></div>
              <div class="status-item high-score-text"><span>🏆 Best: ${highScore}</span></div>
            </div>

            ${renderStationPrepControls(modeState)}

            <!-- Current Mixer Contents Summary -->
            <div class="game-vessel-summary-panel">
              <h4>Mixer</h4>
              <div class="vessel-ingredients-list">${ingredientsListMarkup}</div>
              <button class="action-btn game-mix-btn" type="button" data-action="game-mix-build">
                🥄 MIX (COMPLETE BUILD)
              </button>
            </div>
          </div>

          <div class="ticket-container">
            <span class="ticket-header-tag">${escapeHtml(ticket.tag || 'ORDER TICKET')} #${modeState.gameTicketIndex + 1} / ${ticketCount}</span>
            <p class="ticket-prompt">ORDER UP: <strong>${escapeHtml(ticket.drinkName)}</strong></p>
          </div>

          ${errorMessageMarkup}

          <!-- Interactive Station (Speed Rail + Backbar) -->
          ${renderDrinkGameStation(modeState)}
        </div>

        ${renderDrinkGameModal(modeState)}
      </section>
    `;

    updateActiveModeButtons();
    return;
  }

  // STAGE 2: Garnish Stage
  if (modeState.gameStage === 'garnish') {
    const garnishButtonsMarkup = DEFAULT_GARNISH_OPTIONS.map((garnish) => {
      const isSelected = modeState.gameSelectedGarnishes.includes(garnish);
      return `
        <button class="answer-btn game-choice-btn ${isSelected ? 'selected' : ''}" type="button" data-action="game-toggle-garnish" data-garnish="${escapeAttribute(garnish)}">
          ${isSelected ? '✅ ' : ''}${escapeHtml(garnish)}
        </button>
      `;
    }).join('');

    const errorMessageMarkup = modeState.gameErrorMessage
      ? `<div class="game-error-toast">⚠️ ${escapeHtml(modeState.gameErrorMessage)}</div>`
      : '';

    mainContainer.innerHTML = `
      <section class="quiz-view">
        <div class="quiz-header">
          <button class="back-btn" type="button" data-action="back">Back</button>
          <h2>${escapeHtml(mode.label)}</h2>
          <button class="action-btn" type="button" data-action="game-restart">Restart Shift</button>
        </div>

        <div class="quiz-card drink-game-card">
          <div class="ticket-status-bar">
            <div class="status-item"><span class="status-label">Lives:</span><span class="heart-lives">${hearts}</span></div>
            <div class="status-item"><span class="status-label">Score:</span><span>${modeState.gameScore} PTS</span></div>
            <div class="status-item streak-badge"><span>🔥 ${modeState.gameStreak}</span></div>
            <div class="status-item high-score-text"><span>🏆 Best: ${highScore}</span></div>
          </div>

          <div class="ticket-container">
            <span class="ticket-header-tag">GARNISH SECTION</span>
            <p class="ticket-prompt">Add Garnishes for: <strong>${escapeHtml(ticket.drinkName)}</strong></p>
          </div>

          ${errorMessageMarkup}

          <div class="game-choice-grid">
            ${garnishButtonsMarkup}
          </div>

          <button class="action-btn game-serve-btn" type="button" data-action="game-serve-drink">
            🥂 SERVE DRINK TO GUEST
          </button>
        </div>
      </section>
    `;

    updateActiveModeButtons();
    return;
  }

  // STAGE 3: Complete / Drink Served Stage
  if (modeState.gameStage === 'complete') {
    mainContainer.innerHTML = `
      <section class="quiz-view">
        <div class="quiz-header">
          <button class="back-btn" type="button" data-action="back">Back</button>
          <h2>${escapeHtml(mode.label)}</h2>
        </div>

        <div class="quiz-card drink-game-card game-complete-card">
          <p class="quiz-counter">ORDER SERVED!</p>
          <h3 class="game-complete-title">✨ ${escapeHtml(ticket.drinkName)} Served!</h3>
          <div class="completed-drink-img-placeholder">
            <span class="game-placeholder-icon">🍸</span>
            <p><strong>Perfect Pour!</strong></p>
          </div>
          <p class="feedback correct">+250 PTS (Order Ticket Completed!)</p>
        </div>

        <div class="quiz-actions">
          <button class="action-btn" type="button" data-action="game-next-ticket">Next Ticket -></button>
        </div>
      </section>
    `;

    updateActiveModeButtons();
    return;
  }
}

function renderDrinkGameCompletion(mode, modeState) {
  const isNewHighScore = checkAndSaveHighScore(modeState.gameScore);
  const highScore = getHighScore();
  const ticketCount = modeState.gameTickets.length;
  const correctCount = Object.values(modeState.cardResults || {}).filter(Boolean).length;
  const accuracy = ticketCount > 0 ? Math.round((correctCount / ticketCount) * 100) : 0;

  let rankTitle = '🧊 Barback in Training';
  if (modeState.gameScore >= 1500) rankTitle = '🔥 Master Mixologist';
  else if (modeState.gameScore >= 1000) rankTitle = '🍸 Head Bartender';
  else if (modeState.gameScore >= 600) rankTitle = '🍷 Senior Bartender';
  else if (modeState.gameScore >= 300) rankTitle = '🍺 Bartender';

  const isGameOverByHearts = modeState.gameLives <= 0;
  const headline = isGameOverByHearts ? 'Out of Hearts!' : 'Service Rush Complete!';

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card drink-game-card game-complete-card">
        <p class="quiz-counter">${isGameOverByHearts ? 'Shift Ended Early' : 'Shift Complete'}</p>
        <h3 class="game-complete-title">${headline}</h3>
        ${isNewHighScore ? '<div class="new-high-score-banner">🏆 New High Score!</div>' : ''}
        <div class="final-score-display">${modeState.gameScore} PTS</div>
        <div class="rank-badge">${rankTitle}</div>

        <div class="game-stats-summary">
          <span>Orders Fulfilled: ${correctCount} / ${ticketCount} (${accuracy}%)</span>
          <span>Max Streak: 🔥 ${modeState.gameMaxStreak}</span>
          <span>Personal Best: 🏆 ${highScore} PTS</span>
        </div>
      </div>
      <div class="quiz-actions">
        <button class="action-btn" type="button" data-action="game-restart">Start New Shift</button>
        <button class="action-btn" type="button" data-action="menu">Back to Main Menu</button>
      </div>
    </section>
  `;

  updateActiveModeButtons();
}

function resolveBottleRecognitionImage(card, index) {
  const configuredImage = String(card?.image || '').trim();

  if (configuredImage) {
    return normalizeImagePath(configuredImage);
  }

  if (BOTTLE_RECOGNITION_IMAGES.length) {
    const normalizedIndex = Math.max(0, Number(index) || 0);
    return BOTTLE_RECOGNITION_IMAGES[normalizedIndex % BOTTLE_RECOGNITION_IMAGES.length];
  }

  return configuredImage;
}

function getBottleOptionOrder(modeState, group, options, cardKey) {
  const orderProp = group === 'brand' ? 'bottleBrandOrder' : 'bottleTypeOrder';
  const keyProp = group === 'brand' ? 'bottleBrandOrderKey' : 'bottleTypeOrderKey';
  const cachedOrder = Array.isArray(modeState[orderProp]) ? modeState[orderProp] : [];
  const cachedKey = String(modeState[keyProp] || '');
  const optionSet = new Set(options.map((option) => String(option)));
  const hasAllOptions = cachedOrder.length === options.length && cachedOrder.every((option) => optionSet.has(String(option)));

  if (!hasAllOptions || cachedKey !== cardKey) {
    modeState[orderProp] = shuffleArray([...options]);
    modeState[keyProp] = cardKey;
  }

  return modeState[orderProp];
}

function getFileName(filePath) {
  const normalizedPath = String(filePath || '').trim();
  if (!normalizedPath) return '';
  const pathParts = normalizedPath.split('/');
  return pathParts[pathParts.length - 1] || '';
}

function renderFlashcards(mode) {
  const modeState = state.flashcards[mode.id] || createModeState();
  state.flashcards[mode.id] = modeState;

  const drinkGroups = getDrinkCardGroups(mode.items);
  const drinkNames = drinkGroups
    .map((group) => group.drinkName)
    .filter((name) => typeof name === 'string' && name.trim());
  const hasDrinkPicker = drinkNames.length > 0;

  const cardOrder = getOrBuildCardOrder(mode, modeState);
  const itemCount = cardOrder.length;

  if (modeState.completed) {
    renderModeCompletion(mode, modeState, itemCount);
    return;
  }

  if (modeState.index > Math.max(itemCount - 1, 0)) {
    modeState.index = Math.max(itemCount - 1, 0);
  }

  const cardIndex = cardOrder[modeState.index] ?? modeState.index;
  const card = mode.items[cardIndex] || mode.items[0];
  if (!card) {
    mainContainer.innerHTML = `
      <section class="quiz-view">
        <div class="quiz-header">
          <button class="back-btn" type="button" data-action="back">Back</button>
          <h2>${escapeHtml(mode.label)}</h2>
        </div>
        <div class="quiz-card">
          <p>No cards have been added for this mode yet.</p>
        </div>
      </section>
    `;
    return;
  }

  const isMultipleChoice = isMultipleChoiceCard(card);
  const options = Array.isArray(card.answers) ? card.answers : [];
  if (!Array.isArray(modeState.answerOrder) || modeState.answerOrder.length !== options.length) {
    modeState.answerOrder = shuffleArray([...options]);
  }
  const correctAnswers = getCorrectAnswers(card);
  const answersMarkup = modeState.answerOrder.map((option) => {
    const normalizedOption = isIngredientQuestion(card) ? cleanIngredientAnswer(option) : String(option);
    const isSelected = Array.isArray(modeState.selectedOptions) && modeState.selectedOptions.includes(normalizedOption);
    const isCorrect = correctAnswers.includes(normalizedOption);

    let className = 'answer-btn';
    if (modeState.revealed && modeState.revealOnly) {
      if (isCorrect) {
        className += ' answer-btn-correct';
      }
    } else if (modeState.revealed) {
      if (isSelected && isCorrect) {
        className += ' answer-btn-correct';
      } else if (isSelected && !isCorrect) {
        className += ' answer-btn-incorrect';
      } else if (!modeState.answerCorrect && !isSelected && isCorrect) {
        className += ' answer-btn-missed';
      }
    } else if (isSelected) {
      className += ' selected';
    }

    return `
      <button class="${className}" type="button" data-option="${escapeAttribute(normalizedOption)}">
        ${escapeHtml(normalizedOption)}
      </button>
    `;
  }).join('');

  const feedbackClass = modeState.revealOnly ? 'revealed' : (modeState.answerCorrect ? 'correct' : 'incorrect');
  const revealBtnClass = `answer-btn reveal-btn${modeState.revealOnly ? ' is-revealed' : ''}`;
  const revealBtnDisabled = modeState.revealOnly ? ' disabled aria-disabled="true"' : '';

  const feedbackMarkup = modeState.revealed
    ? `<p class="feedback ${feedbackClass}">${modeState.revealOnly ? 'Answer revealed. These are the correct options.' : (modeState.answerCorrect ? 'Correct! You selected the right options.' : buildFeedbackText(card, modeState.selectedOptions))}</p>`
    : '';

  const answerBody = isMultipleChoice
    ? `
        <div class="answer-list">
          ${answersMarkup}
        </div>
        <div class="single-answer-actions">
          <button class="answer-btn" type="button" data-action="check">Check Answers</button>
          <button class="${revealBtnClass}" type="button" data-action="reveal"${revealBtnDisabled}>${modeState.revealOnly ? 'Answers Revealed' : 'Show Answers'}</button>
        </div>
        ${feedbackMarkup}
        <div class="answer-key" aria-label="Answer color key">
          <p><span class="answer-key-dot key-correct"></span> Correct</p>
          <p><span class="answer-key-dot key-incorrect"></span> Incorrect</p>
          <p><span class="answer-key-dot key-missed"></span> Missed</p>
        </div>
      `
    : `
        <div class="single-answer-block">
          <label class="answer-label" for="answerInput">Type your answer</label>
          <input id="answerInput" class="answer-input" type="text" value="${escapeAttribute(modeState.inputValue || '')}" placeholder="Type your answer here" />
          <div class="single-answer-actions">
            <button class="answer-btn" type="button" data-action="check">Check Answer</button>
            <button class="${revealBtnClass}" type="button" data-action="reveal"${revealBtnDisabled}>${modeState.revealOnly ? 'Answer Revealed' : 'Show Answer'}</button>
          </div>
          ${modeState.revealed ? `<p class="feedback ${feedbackClass}">${modeState.revealOnly ? 'Answer revealed below.' : (modeState.answerCorrect ? 'Nice! That looks right.' : `Not quite — the answer is ${escapeHtml(card.answer || '')}.`)}</p>` : ''}
          ${modeState.revealed ? `<p class="single-answer-value">Answer: ${escapeHtml(card.answer || '')}</p>` : ''}
        </div>
      `;

  const isLastCard = itemCount > 0 && modeState.index >= itemCount - 1;
  const nextButtonLabel = modeState.revealed ? (isLastCard ? 'Finish' : 'Next') : 'Check';
  const drinkPickerButtonLabel = modeState.focusDrink ? `Drink: ${modeState.focusDrink}` : 'Choose Drink';

  const drinkPickerModalMarkup = hasDrinkPicker
    ? `
        <div class="modal flashcard-drink-modal${modeState.showDrinkPicker ? ' active' : ''}" aria-hidden="${modeState.showDrinkPicker ? 'false' : 'true'}">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="drink-picker-title">Choose Drink Focus</h2>
              <button class="close-btn" type="button" data-action="close-drink-picker">&times;</button>
            </div>
            <div class="modal-body">
              <p class="option-label">Start with one drink first</p>
              <div class="menu-options">
                <button class="quiz-btn" type="button" data-action="clear-drink-focus">All Drinks</button>
                ${drinkNames.map((drinkName) => `<button class="quiz-btn" type="button" data-action="set-drink-focus" data-drink="${escapeAttribute(drinkName)}">${escapeHtml(drinkName)}</button>`).join('')}
              </div>
            </div>
          </div>
        </div>
      `
    : '';

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
        ${hasDrinkPicker ? `<button class="action-btn drink-picker-btn" type="button" data-action="toggle-drink-picker">${escapeHtml(drinkPickerButtonLabel)}</button>` : ''}
      </div>
      <div class="quiz-card">
        <p class="quiz-counter">${modeState.index + 1} / ${itemCount}</p>
        <h3>${escapeHtml(card.question || 'Untitled question').replace(/&lt;u&gt;/g, '<u>').replace(/&lt;\/u&gt;/g, '</u>')}</h3>
        ${answerBody}
      </div>
      <div class="quiz-actions">
        <button class="action-btn" type="button" data-action="prev">Previous</button>
        <button class="action-btn" type="button" data-action="next">${nextButtonLabel}</button>
      </div>
      ${drinkPickerModalMarkup}
    </section>
  `;
  updateActiveModeButtons();
}

function updateActiveModeButtons() {
  document.querySelectorAll('[data-mode]').forEach((button) => {
    const isActive = String(button.getAttribute('data-mode') || '').trim().toLowerCase() === String(state.currentView || '').trim().toLowerCase();
    button.classList.toggle('active', isActive);
  });
}

function isMultipleChoiceCard(card) {
  return Boolean(card && (card.type === 'multiple-choice' || Array.isArray(card.answers) || Array.isArray(card.options) || Array.isArray(card.choices)));
}

function shouldUseSingleSelection(card) {
  if (!card || !Array.isArray(card.answers)) return false;

  const correctAnswers = getCorrectAnswers(card);
  return correctAnswers.length === 1;
}

function isIngredientQuestion(card) {
  return Boolean(card && typeof card.question === 'string' && /^Which ingredients come in .+\? \(Select all that apply\)$/.test(card.question.trim()));
}

function cleanIngredientAnswer(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';

  const withoutMeasure = text.replace(/\s*-\s*.+$/, '').trim();
  if (withoutMeasure && withoutMeasure !== text) {
    return withoutMeasure.replace(/\s*\(.*\)\s*$/, '').trim();
  }

  return text.replace(/\s*\(.*\)\s*$/, '').trim();
}

function getCorrectAnswers(card) {
  if (!card) return [];

  const correctAnswers = Array.isArray(card.correctAnswers)
    ? card.correctAnswers
    : Array.isArray(card['correct-answers'])
      ? card['correct-answers']
      : Array.isArray(card['corect-answers'])
        ? card['corect-answers']
        : [];

  const rawAnswers = correctAnswers.length
    ? correctAnswers
    : [card.correctAnswer || card['correct-answer'] || card['corect-answer']].filter((answer) => answer !== undefined && answer !== null && String(answer).trim());

  if (!rawAnswers.length) {
    return [];
  }

  const normalizedAnswers = rawAnswers.map((answer) => isIngredientQuestion(card) ? cleanIngredientAnswer(answer) : String(answer));
  return normalizedAnswers.filter(Boolean);
}

function isSelectionCorrect(selectedOptions, correctAnswers) {
  const submitted = (Array.isArray(selectedOptions) ? selectedOptions : []).map(String);
  const expected = Array.isArray(correctAnswers) ? correctAnswers.map(String) : [String(correctAnswers || '')].filter(Boolean);

  if (!expected.length) return false;
  if (submitted.length !== expected.length) return false;

  return expected.every((answer) => submitted.includes(answer)) && submitted.every((answer) => expected.includes(answer));
}

function buildFeedbackText(card, selectedOptions) {
  const correctAnswers = getCorrectAnswers(card);
  const selected = Array.isArray(selectedOptions) ? selectedOptions : [];

  if (!selected.length) {
    return `No answers selected. The correct answer${correctAnswers.length > 1 ? 's are' : ' is'} ${correctAnswers.join(', ')}.`;
  }

  return `Not quite — the correct answer${correctAnswers.length > 1 ? 's are' : ' is'} ${correctAnswers.join(', ')}.`;
}

function setCardResult(modeState, cardIndex, isCorrect) {
  if (!modeState || !Number.isInteger(cardIndex) || cardIndex < 0) {
    return;
  }

  if (!modeState.cardResults || typeof modeState.cardResults !== 'object') {
    modeState.cardResults = {};
  }

  modeState.cardResults[String(cardIndex)] = Boolean(isCorrect);
}

function getModeScore(modeState, itemCount) {
  const results = modeState && typeof modeState.cardResults === 'object' ? modeState.cardResults : {};
  const correct = Object.values(results).filter(Boolean).length;
  const total = Math.max(0, Number(itemCount) || 0);
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, total, percent };
}

function renderModeCompletion(mode, modeState, itemCount) {
  const score = getModeScore(modeState, itemCount);

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card">
        <p class="quiz-counter">Section complete</p>
        <h3>Your score: ${score.correct} / ${score.total}</h3>
        <p class="feedback ${score.percent >= 70 ? 'correct' : 'incorrect'}">${score.percent}% correct</p>
      </div>
      <div class="quiz-actions">
        <button class="action-btn" type="button" data-action="restart-mode">Start Over</button>
        <button class="action-btn" type="button" data-action="menu">Back to Main Menu</button>
      </div>
    </section>
  `;

  updateActiveModeButtons();
}

function getOrBuildCardOrder(mode, modeState) {
  const itemCount = Array.isArray(mode?.items) ? mode.items.length : 0;
  if (!itemCount) {
    modeState.cardOrder = [];
    return modeState.cardOrder;
  }

  const hasValidOrder = Array.isArray(modeState.cardOrder)
    && modeState.cardOrder.length === itemCount
    && new Set(modeState.cardOrder).size === itemCount
    && modeState.cardOrder.every((index) => Number.isInteger(index) && index >= 0 && index < itemCount);

  if (!hasValidOrder) {
    modeState.cardOrder = mode?.type === 'bottle-recognition'
      ? shuffleArray(Array.from({ length: itemCount }, (_, index) => index))
      : buildDrinkGroupedCardOrder(mode.items, modeState.focusDrink);
  }

  return modeState.cardOrder;
}

function getQuestionPriority(question) {
  const text = String(question || '').trim();

  if (/^Which ingredients come in .+\? \(Select all that apply\)$/.test(text)) return 0;
  if (/^Which glass does .+ go in\?$/.test(text)) return 1;
  if (/^Is .+ shaken or stirred\?$/.test(text)) return 2;
  if (/^How much .+ goes in .+\?$/.test(text)) return 3;
  if (/^Which garnishes go on .+\? \(Select all that apply\)$/.test(text)) return 4;

  return 999;
}

function buildDrinkGroupedCardOrder(items, focusDrink = '') {
  const groups = getDrinkCardGroups(items).map((group) => ({
    ...group,
    indices: [...group.indices].sort((a, b) => {
      const priorityA = getQuestionPriority(items[a]?.question);
      const priorityB = getQuestionPriority(items[b]?.question);
      return priorityA - priorityB || a - b;
    })
  }));

  const normalizedFocus = String(focusDrink || '').trim();

  if (!normalizedFocus) {
    return groups.flatMap((group) => group.indices);
  }

  const focused = groups.find((group) => group.drinkName === normalizedFocus);
  if (!focused) {
    return groups.flatMap((group) => group.indices);
  }

  const remainingGroups = groups.filter((group) => group !== focused);
  return [focused, ...remainingGroups].flatMap((group) => group.indices);
}

function getDrinkCardGroups(items) {
  const ingredientPromptPattern = /^Which ingredients come in (.+)\? \(Select all that apply\)$/;
  const glassPromptPattern = /^Which glass does (.+) go in\?$/;
  const shakenPromptPattern = /^Is (.+) shaken or stirred\?$/;
  const amountPromptPattern = /^How much .+ goes in (.+)\?$/;
  const garnishPromptPattern = /^Which garnishes go on (.+)\? \(Select all that apply\)$/;

  const groups = [];
  let activeDrink = '';

  items.forEach((item, index) => {
    const question = String(item?.question || '');
    const ingredientMatch = question.match(ingredientPromptPattern);

    if (ingredientMatch) {
      activeDrink = ingredientMatch[1].trim();
      groups.push({ drinkName: activeDrink, indices: [index] });
      return;
    }

    const glassMatch = question.match(glassPromptPattern);
    const shakenMatch = question.match(shakenPromptPattern);
    const amountMatch = question.match(amountPromptPattern);
    const garnishMatch = question.match(garnishPromptPattern);
    const matchedDrink = glassMatch
      ? glassMatch[1].trim()
      : (shakenMatch
        ? shakenMatch[1].trim()
        : (amountMatch
          ? amountMatch[1].trim()
          : (garnishMatch ? garnishMatch[1].trim() : '')));
    const belongsToActiveDrink = Boolean(matchedDrink && groups.length && activeDrink && matchedDrink === activeDrink);

    if (belongsToActiveDrink) {
      groups[groups.length - 1].indices.push(index);
      return;
    }

    activeDrink = '';
    groups.push({ drinkName: '', indices: [index] });
  });

  return groups;
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function applyTheme(theme) {
  const root = document.documentElement;
  const body = document.body;

  root.setAttribute('data-theme', theme);

  switch (theme) {
    case 'original':
      root.style.setProperty('--bg-color', '#000000');
      root.style.setProperty('--bg-image', 'url(./images/japan.jpg)');
      root.style.setProperty('--primary-color', '#8B7500');
      root.style.setProperty('--primary-light', '#B8860B');
      root.style.setProperty('--primary-bright', '#DAA520');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--header-bg', 'rgba(0, 0, 0, 0.6)');
      root.style.setProperty('--modal-bg', 'rgba(20, 20, 30, 0.95)');
      root.style.setProperty('--accent-color', '#B8860B');
      root.style.setProperty('--border-color', '#8B7500');
      root.style.setProperty('--button-bg', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--button-hover-bg', 'rgba(184, 134, 11, 0.3)');
      body.style.backgroundImage = 'url(./images/japan.jpg)';
      body.style.backgroundColor = '#000000';
      body.style.textShadow = 'none';
      body.style.fontFamily = 'Arial, sans-serif';
      break;

    case 'dark':
      root.style.setProperty('--bg-color', '#1e1e1e');
      root.style.setProperty('--bg-image', 'none');
      root.style.setProperty('--primary-color', '#007acc');
      root.style.setProperty('--primary-light', '#0e639c');
      root.style.setProperty('--primary-bright', '#007fd4');
      root.style.setProperty('--text-color', '#e0e0e0');
      root.style.setProperty('--header-bg', 'rgba(30, 30, 30, 0.95)');
      root.style.setProperty('--modal-bg', 'rgba(45, 45, 48, 0.95)');
      root.style.setProperty('--accent-color', '#007acc');
      root.style.setProperty('--border-color', '#3e3e42');
      root.style.setProperty('--button-bg', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--button-hover-bg', 'rgba(255, 255, 255, 0.12)');
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = '#1e1e1e';
      body.style.textShadow = 'none';
      body.style.fontFamily = 'Arial, sans-serif';
      break;

    case 'light':
      root.style.setProperty('--bg-color', '#f5f5f5');
      root.style.setProperty('--bg-image', 'none');
      root.style.setProperty('--primary-color', '#4a4a4a');
      root.style.setProperty('--primary-light', '#7a7a7a');
      root.style.setProperty('--primary-bright', '#333333');
      root.style.setProperty('--text-color', '#333333');
      root.style.setProperty('--header-bg', 'rgba(255, 255, 255, 0.95)');
      root.style.setProperty('--modal-bg', 'rgba(240, 240, 240, 0.98)');
      root.style.setProperty('--accent-color', '#555555');
      root.style.setProperty('--border-color', '#999999');
      root.style.setProperty('--button-bg', 'rgba(100, 100, 100, 0.1)');
      root.style.setProperty('--button-hover-bg', 'rgba(100, 100, 100, 0.2)');
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = '#f5f5f5';
      body.style.textShadow = 'none';
      body.style.fontFamily = 'Arial, sans-serif';
      break;

    case 'pipboy':
      root.style.setProperty('--bg-color', '#0a1a0a');
      root.style.setProperty('--bg-image', 'none');
      root.style.setProperty('--primary-color', '#00cc00');
      root.style.setProperty('--primary-light', '#00ff00');
      root.style.setProperty('--primary-bright', '#00ff00');
      root.style.setProperty('--text-color', '#00ff00');
      root.style.setProperty('--header-bg', 'rgba(10, 30, 10, 0.9)');
      root.style.setProperty('--modal-bg', 'rgba(10, 20, 10, 0.95)');
      root.style.setProperty('--accent-color', '#00ff00');
      root.style.setProperty('--border-color', '#00cc00');
      root.style.setProperty('--button-bg', 'rgba(0, 255, 0, 0.1)');
      root.style.setProperty('--button-hover-bg', 'rgba(0, 255, 0, 0.2)');
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = '#0a1a0a';
      body.style.textShadow = '0 0 3px #00ff00';
      body.style.fontFamily = '"Courier New", Courier, monospace';
      break;

    case 'cyberpunk':
      root.style.setProperty('--bg-color', '#0a0e27');
      root.style.setProperty('--bg-image', 'none');
      root.style.setProperty('--primary-color', '#ff00ff');
      root.style.setProperty('--primary-light', '#00ffff');
      root.style.setProperty('--primary-bright', '#ff00ff');
      root.style.setProperty('--text-color', '#00ffff');
      root.style.setProperty('--header-bg', 'rgba(15, 10, 40, 0.95)');
      root.style.setProperty('--modal-bg', 'rgba(10, 10, 30, 0.98)');
      root.style.setProperty('--accent-color', '#ff00ff');
      root.style.setProperty('--border-color', '#ff00ff');
      root.style.setProperty('--button-bg', 'rgba(255, 0, 255, 0.1)');
      root.style.setProperty('--button-hover-bg', 'rgba(255, 0, 255, 0.2)');
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = '#0a0e27';
      body.style.textShadow = '0 0 5px #00ffff, 0 0 10px #ff00ff';
      body.style.fontFamily = '"Arial", sans-serif';
      break;
  }
}

function updateActiveThemeBtn(theme) {
  themeBtns.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-theme') === theme) {
      btn.classList.add('active');
    }
  });
}
