import { useState, useEffect } from "react";
import { api } from "../utils/api";

function Notes({token, onLogout}) {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState(null);
    
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        const data = await api.getNotes(token);
        if (!data.error) {
            setNotes(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            await api.updateNote(token, editingId, title, content);
            setEditingId(null);
        } else {
            await api.createNote(token, title, content);
        }

        setTitle('');
        setContent('');
        loadNotes();
    };

    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingId(note.id);
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this note?')) {
            await api.deleteNote(token, id);
            loadNotes();
        }
    };

    const handleCancel = () => {
        setTitle('');
        setContent('');
        setEditingId(null);
    };
    
    return (
        <div className="container">
            <div className="header">
                <h1>My Notes</h1>
                <button onClick={onLogout}>Logout</button>
            </div>

            <div className="note-form">
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit">
                            {editingId ? 'Update Note' : 'Add Note'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="notes-list">
                {notes.map(note => (
                    <div key={note.id} className="note-card">
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <div className="note-actions">
                            <button className="edit-btn" onClick={() => handleEdit(note)}>
                                Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(note.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notes;