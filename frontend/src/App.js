import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// 👉 Render backend URL
const BASE_URL = "https://notes-app-r4so.onrender.com";


function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/notes`);
      setNotes(res.data);
      setFilteredNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a note
  const addNote = async () => {
    if (!title || !content) return;

    try {
      await axios.post(`${BASE_URL}/notes/add`, {
        title,
        content
      });

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // Search notes
  const handleSearch = (value) => {
    setSearch(value);
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(value.toLowerCase()) ||
        note.content.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🧠 Smart Notes Dashboard</h1>
        <input
          className="search"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </header>

      <div className="main">
        {/* LEFT PANEL */}
        <div className="form-card">
          <h3>Create Note</h3>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={addNote}>Save Note</button>
        </div>

        {/* RIGHT PANEL */}
        <div className="notes-panel">
          <h3>All Notes</h3>

          {loading ? (
            <p className="loading">Loading notes...</p>
          ) : filteredNotes.length === 0 ? (
            <p className="empty">No notes found</p>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <div className="note-card" key={note._id}>
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                  <button
                    className="delete-btn"
                    onClick={() => deleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
