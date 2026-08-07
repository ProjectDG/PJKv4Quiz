const fallbackFlashcards = [
  {
    prompt: "What is the base spirit in a Margarita?",
    answer: "Tequila."
  },
  {
    prompt: "What does 'up' mean when ordering a drink?",
    answer: "Served without ice in a stemmed glass."
  },
  {
    prompt: "What ingredient helps balance sweetness in many cocktails?",
    answer: "Acid such as lemon or lime juice."
  }
];

const fallbackQuiz = {
  multipleChoice: {
    prompt: "Which option is a citrus ingredient?",
    options: ["Lemon juice", "Cinnamon", "Olive oil"],
    answer: "Lemon juice"
  },
  pickAll: {
    prompt: "Select every mixer from the list below.",
    options: ["Lemon juice", "Rocks glass", "Basil sprig", "Tonic water"],
    answer: ["Lemon juice", "Tonic water"]
  }
};

const state = {
  flashcards: [],
  reviewItems: [],
  currentCard: 0,
  currentQuizAnswers: [],
  expectedPickAllAnswers: [],
  currentScreen: "menu"
};

const themes = ["main", "light", "dark", "cyber"];

function getDrinkValue(drink, key) {
  const value = drink[key];
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined && item !== "");
  }

  if (value !== null && value !== undefined && value !== "") {
    return [String(value)];
  }

  return [];
}

function normalizeDrinkData(payload) {
  if (Array.isArray(payload)) {
    if (payload.length && payload[0] && typeof payload[0] === "object" && Array.isArray(payload[0].drinks)) {
      return payload[0].drinks;
    }

    return payload.filter((item) => item && typeof item === "object" && item.name);
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.drinks)) {
      return payload.drinks;
    }

    const nestedArray = Object.values(payload).find((value) => Array.isArray(value));
    if (nestedArray) {
      return nestedArray.filter((item) => item && typeof item === "object" && item.name);
    }
  }

  return [];
}

function buildFlashcards(drinks) {
  return drinks.slice(0, 6).map((drink) => {
    const glass = getDrinkValue(drink, "glass")[0] || "Unknown";
    return {
      prompt: `What glass is used for ${drink.name}?`,
      answer: glass,
      detail: `${drink.name} is typically served in a ${glass.toLowerCase()}.`,
      sourceDrink: drink
    };
  });
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function setTheme(themeName) {
  document.body.setAttribute("data-theme", themeName);
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === themeName);
  });
}

function shuffleTheme() {
  const currentTheme = document.body.getAttribute("data-theme") || "main";
  const availableThemes = themes.filter((theme) => theme !== currentTheme);
  const nextTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
  setTheme(nextTheme);
}

function showScreen(screenName) {
  state.currentScreen = screenName;
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active", screen.id === `${screenName}Screen`));
  document.getElementById("backButton").style.display = screenName === "menu" ? "none" : "inline-flex";
}

async function loadData() {
  let drinks = [];
  const candidates = ["./data.json", "../PJKv4/data.json"];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate);
      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const found = normalizeDrinkData(data);
      if (found.length) {
        drinks = found;
        break;
      }
    } catch (error) {
      // keep trying the next source
    }
  }

  if (drinks.length) {
    state.flashcards = buildFlashcards(drinks);
  } else {
    state.flashcards = fallbackFlashcards;
  }

  state.reviewItems = state.flashcards.map((card, index) => ({
    label: `Card ${index + 1}`,
    note: card.prompt
  }));
  state.currentCard = 0;
  state.currentQuizAnswers = [];
  state.expectedPickAllAnswers = [];

  renderFlashcard();
  renderQuiz();
  renderReview();
}

function renderFlashcard() {
  const card = document.getElementById("flashcard");
  const promptEl = document.getElementById("flashcardPrompt");
  const answerEl = document.getElementById("flashcardAnswer");

  if (!state.flashcards.length) {
    return;
  }

  const cardData = state.flashcards[state.currentCard];
  promptEl.textContent = cardData.prompt;
  answerEl.textContent = cardData.answer;
  card.classList.remove("is-flipped");
}

function toggleFlashcard() {
  document.getElementById("flashcard").classList.toggle("is-flipped");
}

function nextFlashcard() {
  state.currentCard = (state.currentCard + 1) % state.flashcards.length;
  renderFlashcard();
  renderQuiz();
}

function renderQuiz() {
  const multiplePrompt = document.getElementById("multipleChoicePrompt");
  const multipleOptions = document.getElementById("multipleChoiceOptions");
  const pickAllPrompt = document.getElementById("pickAllPrompt");
  const pickAllOptions = document.getElementById("pickAllOptions");

  const quizData = state.flashcards[0] || fallbackFlashcards[0];
  const answerText = quizData.answer;
  const glassOptions = state.flashcards
    .map((card) => card.answer)
    .filter((value) => value && value !== answerText);
  const options = shuffleArray([answerText, ...glassOptions.slice(0, 3)]);

  multiplePrompt.textContent = `Which answer best matches the prompt: ${quizData.prompt}`;
  pickAllPrompt.textContent = `Select the cocktail components that are present for ${quizData.sourceDrink ? quizData.sourceDrink.name : "this drink"}.`;

  multipleOptions.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => {
      state.currentQuizAnswers[0] = option;
      Array.from(multipleOptions.children).forEach((child) => child.classList.remove("active"));
      button.classList.add("active");
    });
    multipleOptions.appendChild(button);
  });

  const drinkData = quizData.sourceDrink || {};
  const expectedAnswers = [];
  if (getDrinkValue(drinkData, "liquor").length) expectedAnswers.push("liquor");
  if (getDrinkValue(drinkData, "liqueur").length) expectedAnswers.push("liqueur");
  if (getDrinkValue(drinkData, "vermouth").length) expectedAnswers.push("vermouth");
  if (getDrinkValue(drinkData, "mixers").length) expectedAnswers.push("mixers");
  if (getDrinkValue(drinkData, "garnish").length) expectedAnswers.push("garnish");
  if (getDrinkValue(drinkData, "glass").length) expectedAnswers.push("glass");
  state.expectedPickAllAnswers = expectedAnswers.length ? expectedAnswers : ["liquor", "mixers", "garnish"];

  const pickAllOptionsList = ["liquor", "liqueur", "vermouth", "mixers", "garnish", "glass"];
  pickAllOptions.innerHTML = "";
  pickAllOptionsList.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => {
      const answers = state.currentQuizAnswers[1] || [];
      const exists = answers.includes(option);
      const nextAnswers = exists ? answers.filter((item) => item !== option) : [...answers, option];
      state.currentQuizAnswers[1] = nextAnswers;
      button.classList.toggle("active", nextAnswers.includes(option));
    });
    pickAllOptions.appendChild(button);
  });
}

function renderReview() {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";

  state.reviewItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.label}: ${item.note}`;
    reviewList.appendChild(li);
  });
}

function handleMultipleChoice() {
  const feedback = document.getElementById("multipleChoiceFeedback");
  const selected = state.currentQuizAnswers[0];
  const expected = (state.flashcards[0] && state.flashcards[0].answer) || fallbackFlashcards[0].answer;
  feedback.textContent = selected === expected ? "Correct — that matches the card." : `Not quite. The correct answer is ${expected}.`;
}

function handlePickAll() {
  const feedback = document.getElementById("pickAllFeedback");
  const selected = state.currentQuizAnswers[1] || [];
  const expected = state.expectedPickAllAnswers;
  const isCorrect = selected.length === expected.length && expected.every((item) => selected.includes(item));
  feedback.textContent = isCorrect ? "Correct — those are the drink's key cocktail components." : `Try again. The expected picks are ${expected.join(", ")}.`;
}

function attachMenuHandlers() {
  document.querySelectorAll(".menu-card").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.screen));
  });

  document.querySelectorAll("[data-screen='menu']").forEach((button) => {
    button.addEventListener("click", () => showScreen("menu"));
  });

  document.getElementById("themeMenuButton").addEventListener("click", () => showScreen("themes"));
  document.getElementById("backButton").addEventListener("click", () => showScreen("menu"));
}

function attachThemeHandlers() {
  document.querySelectorAll(".theme-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.id === "shuffleTheme") {
        shuffleTheme();
        return;
      }
      setTheme(button.dataset.theme);
    });
  });
}

function attachButtonHandlers() {
  document.getElementById("flipCard").addEventListener("click", toggleFlashcard);
  document.getElementById("nextCard").addEventListener("click", nextFlashcard);
  document.getElementById("submitMultipleChoice").addEventListener("click", handleMultipleChoice);
  document.getElementById("submitPickAll").addEventListener("click", handlePickAll);
}

attachMenuHandlers();
attachThemeHandlers();
attachButtonHandlers();
setTheme("main");
showScreen("menu");
loadData();