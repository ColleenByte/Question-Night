import { useState } from "react";

function AddQuestion({ categories, questions, onAdd }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (text.trim() === "") {
      setMessage("Please type a question first.");
      return;
    }

    setSaving(true);
    try {
      await onAdd(text.trim(), category);
      setText("");
      setMessage("Question added!");
    } catch (err) {
      setMessage("Could not save question: " + err.message);
    }
    setSaving(false);
  }

  return (
    <div className="card">
      <h2>Add a Question</h2>

      <form onSubmit={handleSubmit}>
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Question</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your question here..."
          rows="3"
          maxLength="300"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Add Question"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}

      <h3>Saved Questions ({questions.length})</h3>
      <ul className="question-list">
        {questions.map((q) => (
          <li key={q.id}>
            <span className="tag">{q.category}</span> {q.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddQuestion;
