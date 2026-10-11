import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyBorrowings() {
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState('');

    async function fetchBorrowed() {
        try {
            const res = await axios.get('http://localhost:5000/api/users/me/borrowed', { withCredentials: true });
            setBooks(res.data.borrowedBooks || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetchBorrowed(); }, []);

    async function handleReturn(id) {
        setMessage('');
        try {
            await axios.post(`http://localhost:5000/api/books/${id}/return`, {}, { withCredentials: true });
            setMessage('✅ Book returned!');
            fetchBorrowed();
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Failed'));
        }
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
            <h1>📖 My Borrowings</h1>
            {message && <p style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{message}</p>}

            {books.length === 0 ? (
                <p style={{ marginTop: '30px', color: '#888' }}>
                    You haven't borrowed any books yet. Go to <strong>Browse Books</strong> to borrow one!
                </p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#eee' }}>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Author</th>
                            <th style={thStyle}>Edition</th>
                            <th style={thStyle}>Tag</th>
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
                                <td style={tdStyle}>
                                    <button onClick={() => handleReturn(book._id)} style={{
                                        padding: '5px 10px', backgroundColor: '#dc3545',
                                        color: 'white', border: 'none',
                                        borderRadius: '4px', cursor: 'pointer'
                                    }}>
                                        Return
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #eee' };