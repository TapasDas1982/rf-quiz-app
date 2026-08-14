"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;

export default function Home() {
  const [stage, setStage] = useState("intro"); // intro | quiz | submitting | result | error
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});
  const [quiz, setQuiz] = useState(null); // { questionIds, questions }
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  async function handleStart(e) {
    e.preventDefault();
    const errors = {};
    if (!form.name.trim()) errors.name = "Please enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) errors.email = "Please enter a valid email.";
    if (!PHONE_RE.test(form.phone.trim())) errors.phone = "Please enter a valid phone number.";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load the quiz. Please try again.");
      setQuiz(data);
      setAnswers(Array(data.questions.length).fill(-1));
      setCurrent(0);
      setStartTime(Date.now());
      setStage("quiz");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function selectOption(optionIndex) {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
  }

  async function handleSubmit() {
    setStage("submitting");
    setSubmitError("");
    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          questionIds: quiz.questionIds,
          answers,
          timeTakenSeconds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setResult(data);
      setStage("result");
    } catch (err) {
      setSubmitError(err.message);
      setStage("quiz");
    }
  }

  async function loadLeaderboard() {
    setLeaderboardLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaderboard(data.entries || []);
    } catch {
      setLeaderboard([]);
    } finally {
      setLeaderboardLoading(false);
    }
  }

  if (stage === "intro") {
    return (
      <main className="page">
        <div className="card">
          <h1>Reverse Factor Knowledge Quiz</h1>
          <p className="subtitle">
            50 questions randomly picked from 200+ questions on the RF food, lifestyle &
            health concepts. Enter your details to begin.
          </p>
          {submitError && <div className="error">{submitError}</div>}
          <form onSubmit={handleStart}>
            <div className="field">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {formErrors.name && <div className="error">{formErrors.name}</div>}
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {formErrors.email && <div className="error">{formErrors.email}</div>}
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              {formErrors.phone && <div className="error">{formErrors.phone}</div>}
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Loading quiz..." : "Start Quiz"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (stage === "quiz" || stage === "submitting") {
    const q = quiz.questions[current];
    const isLast = current === quiz.questions.length - 1;
    const answered = answers[current] !== -1;

    return (
      <main className="page">
        <div className="card">
          <div className="question-count">
            Question {current + 1} of {quiz.questions.length}
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
          <div className="question-text">{q.q}</div>
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={`option${answers[current] === i ? " selected" : ""}`}
              onClick={() => selectOption(i)}
            >
              {opt}
            </button>
          ))}
          {submitError && <div className="error">{submitError}</div>}
          <div className="btn-row">
            <button
              type="button"
              className="btn secondary"
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
            >
              Back
            </button>
            {isLast ? (
              <button
                type="button"
                className="btn"
                disabled={!answered || stage === "submitting"}
                onClick={handleSubmit}
              >
                {stage === "submitting" ? "Submitting..." : "Submit"}
              </button>
            ) : (
              <button
                type="button"
                className="btn"
                disabled={!answered}
                onClick={() => setCurrent(current + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  // result
  const pct = Math.round((result.score / result.total) * 100);
  const minutes = Math.floor(result.timeTakenSeconds / 60);
  const seconds = result.timeTakenSeconds % 60;

  return (
    <main className="page">
      <div className="card">
        <h1>Your Result</h1>
        <div className="score">
          {result.score} / {result.total}
        </div>
        <div className="result-meta">
          {pct}% correct &middot; Time taken: {minutes}m {seconds}s
        </div>
        {leaderboard === null ? (
          <button type="button" className="btn secondary" onClick={loadLeaderboard} disabled={leaderboardLoading}>
            {leaderboardLoading ? "Loading..." : "View Leaderboard"}
          </button>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Score</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{entry.name}</td>
                  <td>
                    {entry.score}/{entry.total}
                  </td>
                  <td>
                    {Math.floor(entry.time_taken_seconds / 60)}m {entry.time_taken_seconds % 60}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
