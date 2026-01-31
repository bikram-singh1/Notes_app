import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    const res = await axios.get("http://localhost:5000/notes");
    setNotes(res.data);
    setFilteredNotes(res.data);
    setLoading(false);
  };

  const addNote = async () => {
    if (!title || !content) return;

    await axios.post("http://localhost:5000/notes/add", {
      title,
      content
    });

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    fetchNotes();
  };

  const handleSearch = (value) => {
    setSearch(value);
    const filtered = notes.filter(note =>
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
