import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({
        title: '', author: '', establishedDate: '', edition: '', tag: ''
    });
    const [message, setMessage] = useState('');

    async function fetchBooks() {
        try {
            const res = await axios.get('http://localhost:5000/api/books', { withCredentials: true });
            setBooks(res.data.books || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetchBooks(); }, []);

    async function handleAdd(e) {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/books', form, { withCredentials: true });
            setMessage('✅ Book added!');
            setForm({ title: '', author: '', establishedDate: '', edition: '', tag: '' });
            fetchBooks();
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Failed'));
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this book?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`, { withCredentials: true });
            fetchBooks();
        } catch (err) {
            alert('Failed to delete');
        }
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
            <h1>📚 Manage Books</h1>

            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginTop: '20px' }}>
                <h3>Add New Book</h3>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <input placeholder="Title" value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <input placeholder="Author" value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <input type="date" value={form.establishedDate}
                        onChange={(e) => setForm({ ...form, establishedDate: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <input placeholder="Edition (e.g., 1st)" value={form.edition}
                        onChange={(e) => setForm({ ...form, edition: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <input placeholder="Tag (e.g., Programming)" value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <button type="submit" style={{
                        padding: '10px', backgroundColor: '#007bff', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}>
                        Add Book
                    </button>
                </form>
                {message && <p style={{ marginTop: '10px' }}>{message}</p>}
            </div>

            <h3 style={{ marginTop: '40px' }}>All Books ({books.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee' }}>
                        <th style={thStyle}>Title</th>
                        <th style={thStyle}>Author</th>
                        <th style={thStyle}>Edition</th>
                        <th style={thStyle}>Tag</th>
                        <th style={thStyle}>Available</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book._id}>
                            <td style={tdStyle}>{book.title}</td>
                            <td style={tdStyle}>{book.author}</td>
                            <td style={tdStyle}>{book.edition}</td>
                            <td style={tdStyle}>{book.tag}</td>
                            <td style={tdStyle}>{book.available ? '✅' : '❌'}</td>
                            <td style={tdStyle}>
                                <button onClick={() => handleDelete(book._id)} style={{
                                    padding: '5px 10px', backgroundColor: '#dc3545',
                                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #eee' };