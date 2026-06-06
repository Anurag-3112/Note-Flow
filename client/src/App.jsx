import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./services/notesApi";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const loadNotes = async () => {
    try {
      const data = await getNotes();

      console.log("API Response:", data);
      console.log("Is Array:", Array.isArray(data));

      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const selectNote = (note) => {
    setSelectedNote(note);
    setTitle(note?.title || "");
    setContent(note?.content || "");
  };

  const newNote = async () => {
    try {
      const noteData = {
        title: "Untitled",
        content: "<p></p>",
      };

      const created = await createNote(noteData);

      setSelectedNote(created);
      setTitle(created?.title || "");
      setContent(created?.content || "");

      await loadNotes();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  useEffect(() => {
    if (!selectedNote) return;

    const timeout = setTimeout(async () => {
      try {
        const noteData = {
          title: title || "Untitled",
          content: content || "<p></p>",
        };

        await updateNote(selectedNote._id, noteData);
        await loadNotes();
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content]);

  const handleDelete = async (e, id) => {
    try {
      e.stopPropagation();

      await deleteNote(id);

      if (selectedNote?._id === id) {
        setSelectedNote(null);
        setTitle("");
        setContent("");
      }

      await loadNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const filteredNotes = Array.isArray(notes)
    ? notes.filter((note) => {
        const noteTitle = note?.title || "";
        const noteContent = note?.content || "";
        const searchText = search.toLowerCase();

        return (
          noteTitle.toLowerCase().includes(searchText) ||
          noteContent.toLowerCase().includes(searchText)
        );
      })
    : [];

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Sidebar
        notes={filteredNotes}
        selectedNote={selectedNote}
        selectNote={selectNote}
        deleteNote={handleDelete}
        search={search}
        setSearch={setSearch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        newNote={newNote}
      />

      {!selectedNote && (
        <div className="empty-state">
          <h1>Select a note</h1>
          <p>Choose a note or create a new one</p>
        </div>
      )}

      {selectedNote && (
        <Editor
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          setSelectedNote={setSelectedNote}
          setTitleState={setTitle}
          setContentState={setContent}
        />
      )}
    </div>
  );
}

export default App;
