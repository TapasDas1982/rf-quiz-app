// SERVER ONLY. Never import this file from a client component or a file that
// lib/questions.js's consumers also import; it must only be reachable from
// app/api/submit/route.js so the answers never reach the browser bundle.
// Index (0 based) of the correct option for each of the 50 questions, in order.
const answerKey = [
  0, 2, 0, 2, 2, 2, 1, 2, 2, 2,
  0, 1, 1, 1, 1, 1, 2, 0, 2, 1,
  1, 0, 1, 1, 1, 1, 1, 2, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
  ];

module.exports = { answerKey };
