import { useState } from "react";

function RandomQuestion({ categories, pool, onPull }) {
  const [category, setCategory] = useState("All");
  const [current, setCurrent] = useState(null);

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
    onPull(picked.id);
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
        </div>
      )}

      {available.length === 0 && (
        <p className="message">
          No questions left. Refresh the page to reset the pool.
        </p>
      )}
    </div>
  );
}

export default RandomQuestion;
