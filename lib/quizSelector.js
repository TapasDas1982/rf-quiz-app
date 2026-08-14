// Server-side balanced quiz selection.
// Picks QUESTIONS_PER_QUIZ questions: 30% easy / 70% tough, spread evenly
// across all categories, then returns them in random order.
const { questions } = require("./questions");

const QUESTIONS_PER_QUIZ = 50;
const EASY_PERCENT = 0.3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz() {
  const categories = [...new Set(questions.map((q) => q.category))];
  const easyCount = Math.round(QUESTIONS_PER_QUIZ * EASY_PERCENT); // 15
  const toughCount = QUESTIONS_PER_QUIZ - easyCount; // 35

  // Per category, per difficulty, take equal shares so every category is
  // represented and the 30/70 easy/tough split holds overall.
  const perCatEasy = Math.floor(easyCount / categories.length); // 3
  const perCatTough = Math.floor(toughCount / categories.length); // 7

  const selected = [];
  for (const category of categories) {
    const byDifficulty = (d) =>
      shuffle(questions.filter((q) => q.category === category && q.difficulty === d));

    const easy = byDifficulty("easy").slice(0, perCatEasy);
    const tough = byDifficulty("tough").slice(0, perCatTough);
    selected.push(...easy, ...tough);
  }

  // If rounding left any shortfall, top it up from the remaining pool.
  let remaining = questions.filter(
    (q) => !selected.some((s) => s.id === q.id)
  );
  while (selected.length < QUESTIONS_PER_QUIZ && remaining.length > 0) {
    const idx = Math.floor(Math.random() * remaining.length);
    selected.push(remaining.splice(idx, 1)[0]);
  }

  return shuffle(selected);
}

module.exports = { buildQuiz, QUESTIONS_PER_QUIZ };
