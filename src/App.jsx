import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";
import AddQuestion from "./components/AddQuestion.jsx";
import RandomQuestion from "./components/RandomQuestion.jsx";
import Nose from "./components/Nose.jsx";
import Locked, { LockIcon } from "./components/Locked.jsx";

const CATEGORIES = [
  "General",
  "Personal",
  "Funny",
  "Hot Takes / Opinion",
  "Hypotheticals",
  "Misc",
];

// Pulling questions opens at midnight (local time) on November 28th 2026
const UNLOCK_DATE = new Date(2026, 10, 28);

function App() {
  const [page, setPage] = useState("add");
  // Admin password entered this visit (cleared on refresh)
  const [isAdmin, setIsAdmin] = useState(false);

  // All questions from the online database
  const [questions, setQuestions] = useState([]);

  // IDs pulled in this visit (cleared on refresh)
  const [pulledIds, setPulledIds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Listen for questions, updates live when anyone adds one
  useEffect(() => {
    const q = query(collection(db, "questions"), orderBy("createdAt"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(list);
        setLoading(false);
      },
      (err) => {
        setError("Could not load questions: " + err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function addQuestion(text, category) {
    await addDoc(collection(db, "questions"), {
      text: text,
      category: category,
      createdAt: serverTimestamp(),
    });
  }

  async function deleteQuestion(id) {
    await deleteDoc(doc(db, "questions", id));
  }

  function removeFromPool(id) {
    setPulledIds([...pulledIds, id]);
  }

  // Pool is every question not yet pulled
  const pool = questions.filter((q) => !pulledIds.includes(q.id));

  const isLocked = new Date() < UNLOCK_DATE && !isAdmin;

  return (
    <div className="app">
      <h1>The Lounge Q&amp;A</h1>

      <nav>
        <button
          className={page === "add" ? "active" : ""}
          onClick={() => setPage("add")}
        >
          Add Question
        </button>
        <button
          className={page === "random" ? "active" : ""}
          onClick={() => setPage("random")}
        >
          {isLocked && <LockIcon />} Pull Random Question
        </button>
      </nav>

      {loading && <p>Loading questions...</p>}
      {error && <p className="error">{error}</p>}

      {!loading &&
        (page === "add" ? (
          <AddQuestion
            categories={CATEGORIES}
            questions={questions}
            onAdd={addQuestion}
          />
        ) : isLocked ? (
          <Locked unlockDate={UNLOCK_DATE} onUnlock={() => setIsAdmin(true)} />
        ) : (
          <RandomQuestion
            categories={CATEGORIES}
            pool={pool}
            onPull={removeFromPool}
            onDelete={deleteQuestion}
          />
        ))}

      <Nose />
    </div>
  );
}

export default App;
