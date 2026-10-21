import { useState } from "react";

function RandomQuestion({ categories, pool, onPull, onDelete }) {
  const [category, setCategory] = useState("All");
  const [current, setCurrent] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  // Only questions in the chosen category
  const available =
    category === "All" ? pool : pool.filter((q) => q.category === category);

  function pullQuestion() {
    if (available.length === 0) {
      setCurrent(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const picked = available[randomIndex];

    setCurrent(picked);
    setConfirming(false);
    setMessage("");
    onPull(picked.id);
  }

  // Permanently removes the current question from the database
  async function deleteCurrent() {
    setDeleting(true);
    try {
      await onDelete(current.id);
      setCurrent(null);
      setMessage("Question asked. It's been removed from the box.");
    } catch (err) {
      setMessage("Could not delete question: " + err.message);
    }
    setConfirming(false);
    setDeleting(false);
  }

  return (
    <div className="card cam-2">
      <h2>Pull a Random Question</h2>

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <p>Questions left: {available.length}</p>

      <button onClick={pullQuestion} disabled={available.length === 0}>
        Pull Random Question
      </button>

      {current && (
        <div className="result">
          <span className="tag">{current.category}</span>
          <p>{current.text}</p>

          {/* First click asks "Are you sure?", second click removes it */}
          {confirming ? (
            <button
              className="confirm-btn"
              onClick={deleteCurrent}
              disabled={deleting}
            >
              {deleting ? "Removing..." : "Are you sure?"}
            </button>
          ) : (
            <button onClick={() => setConfirming(true)}>
              Question Has Been Asked
            </button>
          )}
        </div>
      )}

      {message && <p className="message">{message}</p>}

      {available.length === 0 && (
        <p className="message">
          No questions left. Refresh the page to reset the pool.
        </p>
      )}
    </div>
  );
}

export default RandomQuestion;
