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

function createModeState() {
  return {
    index: 0,
    revealed: false,
    selectedOptions: [],
    inputValue: '',
    answerCorrect: null,
    answerOrder: [],
    revealOnly: false
  };
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
  });

  closeModal.addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  settingsModal.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.classList.remove('active');
    }
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

    if (button.dataset.action === 'prev') {
      modeState.index = Math.max(0, modeState.index - 1);
      modeState.revealed = false;
      modeState.selectedOptions = [];
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
      const itemCount = mode && Array.isArray(mode.items) ? mode.items.length : 0;
      modeState.index = Math.min(Math.max(itemCount - 1, 0), modeState.index + 1);
      modeState.revealed = false;
      modeState.selectedOptions = [];
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
      const card = mode && Array.isArray(mode.items) ? mode.items[modeState.index] : null;
      if (isMultipleChoiceCard(card)) {
        const expected = getCorrectAnswers(card);
        const submitted = Array.isArray(modeState.selectedOptions) ? modeState.selectedOptions : [];
        modeState.revealed = true;
        modeState.answerCorrect = isSelectionCorrect(submitted, expected);
        modeState.revealOnly = false;
        state.flashcards[modeId] = modeState;
        renderView();
        return;
      }

      const expected = String(card?.answer || '').trim().toLowerCase();
      const submitted = String(modeState.inputValue || '').trim().toLowerCase();
      modeState.revealed = true;
      modeState.answerCorrect = submitted === expected;
      modeState.revealOnly = false;
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.action === 'reveal') {
      modeState.revealed = true;
      modeState.answerCorrect = null;
      modeState.revealOnly = true;
      state.flashcards[modeId] = modeState;
      renderView();
      return;
    }

    if (button.dataset.option !== undefined) {
      const option = String(button.dataset.option || '');
      const selectedOptions = Array.isArray(modeState.selectedOptions) ? [...modeState.selectedOptions] : [];
      const optionIndex = selectedOptions.indexOf(option);
      if (optionIndex >= 0) {
        selectedOptions.splice(optionIndex, 1);
      } else {
        selectedOptions.push(option);
      }
      modeState.selectedOptions = selectedOptions;
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
}

async function loadModes() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('Unable to load data.json');
    const payload = await response.json();
    state.modes = normalizeModes(payload);
  } catch (error) {
    console.warn('Using fallback quiz data:', error);
    state.modes = normalizeModes(getFallbackModes());
  }
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

  return {
    id: String(entry.id || 'mode').trim().toLowerCase(),
    label: entry.label || entry.title || 'Quiz Mode',
    description: entry.description || '',
    type: entry.type || 'flashcards',
    items,
    samplePrompts: Array.isArray(entry.samplePrompts)
      ? entry.samplePrompts.filter((item) => typeof item === 'string' && item.trim())
      : []
  };
}

function normalizeItem(item) {
  if (!item || typeof item !== 'object') return null;

  const questionType = item['question-type'] || item.type || 'multiple-choice';
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
  const cardsMarkup = state.modes.map((mode) => `
    <button class="mode-btn${state.currentView === mode.id ? ' active' : ''}" type="button" data-mode="${escapeAttribute(mode.id)}">
      <span class="mode-btn-title">${escapeHtml(mode.label)}</span>
      <span class="mode-btn-copy original-theme-titles">${escapeHtml(mode.description || 'Start this quiz mode.')}</span>
    </button>
  `).join('');

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

function renderFlashcards(mode) {
  const modeState = state.flashcards[mode.id] || createModeState();
  state.flashcards[mode.id] = modeState;

  const card = mode.items[modeState.index] || mode.items[0];
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
    const normalizedOption = String(option);
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
      } else if (!isSelected && isCorrect) {
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

  const feedbackMarkup = modeState.revealed
    ? `<p class="feedback ${modeState.answerCorrect ? 'correct' : 'incorrect'}">${modeState.revealOnly ? 'Answer revealed. These are the correct options.' : (modeState.answerCorrect ? 'Correct! You selected the right options.' : buildFeedbackText(card, modeState.selectedOptions))}</p>`
    : '';

  const answerBody = isMultipleChoice
    ? `
        <div class="answer-list">
          ${answersMarkup}
        </div>
        <div class="single-answer-actions">
          <button class="answer-btn" type="button" data-action="check">Check Answers</button>
          <button class="answer-btn reveal-btn" type="button" data-action="reveal">Show Answers</button>
        </div>
        ${feedbackMarkup}
      `
    : `
        <div class="single-answer-block">
          <label class="answer-label" for="answerInput">Type your answer</label>
          <input id="answerInput" class="answer-input" type="text" value="${escapeAttribute(modeState.inputValue || '')}" placeholder="Type your answer here" />
          <div class="single-answer-actions">
            <button class="answer-btn" type="button" data-action="check">Check Answer</button>
            <button class="answer-btn reveal-btn" type="button" data-action="reveal">Show Answer</button>
          </div>
          ${modeState.revealed ? `<p class="feedback ${modeState.answerCorrect ? 'correct' : 'incorrect'}">${modeState.revealOnly ? 'Answer revealed below.' : (modeState.answerCorrect ? 'Nice! That looks right.' : `Not quite — the answer is ${escapeHtml(card.answer || '')}.`)}</p>` : ''}
          ${modeState.revealed ? `<p class="single-answer-value">Answer: ${escapeHtml(card.answer || '')}</p>` : ''}
        </div>
      `;

  mainContainer.innerHTML = `
    <section class="quiz-view">
      <div class="quiz-header">
        <button class="back-btn" type="button" data-action="back">Back</button>
        <h2>${escapeHtml(mode.label)}</h2>
      </div>
      <div class="quiz-card">
        <p class="quiz-counter">${modeState.index + 1} / ${mode.items.length}</p>
        <h3>${escapeHtml(card.question || 'Untitled question')}</h3>
        ${answerBody}
      </div>
      <div class="quiz-actions">
        <button class="action-btn" type="button" data-action="prev">Previous</button>
        <button class="action-btn" type="button" data-action="next">Next</button>
      </div>
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

function getCorrectAnswers(card) {
  if (!card) return [];

  const correctAnswers = Array.isArray(card.correctAnswers)
    ? card.correctAnswers
    : Array.isArray(card['correct-answers'])
      ? card['correct-answers']
      : Array.isArray(card['corect-answers'])
        ? card['corect-answers']
        : [];

  if (correctAnswers.length) {
    return correctAnswers.map(String);
  }

  const fallback = card.correctAnswer || card['correct-answer'] || card['corect-answer'];
  return fallback ? [String(fallback)] : [];
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
      root.style.setProperty('--bg-image', 'url(./images/japan.png)');
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
      body.style.backgroundImage = 'url(./images/japan.png)';
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
