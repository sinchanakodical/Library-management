import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BrowseBooks() {
    const [books, setBooks] = useState([]);
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

    async function handleBorrow(id) {
        setMessage('');
        try {
            await axios.post(`http://localhost:5000/api/books/${id}/borrow`, {}, { withCredentials: true });
            setMessage('✅ Book borrowed!');
            fetchBooks();
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Failed'));
        }
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '20px' }}>
            <h1>📚 Browse Books</h1>
            {message && <p style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>{message}</p>}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '30px'
            }}>
                {books.map((book) => (
                    <div key={book._id} style={{
                        padding: '20px', border: '1px solid #ddd',
                        borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ marginTop: 0 }}>{book.title}</h3>
                        <p style={{ color: '#666', margin: '5px 0' }}><strong>Author:</strong> {book.author}</p>
                        <p style={{ color: '#666', margin: '5px 0' }}><strong>Edition:</strong> {book.edition}</p>
                        <p style={{ color: '#666', margin: '5px 0' }}><strong>Tag:</strong> {book.tag}</p>
                        <p style={{ color: '#666', margin: '5px 0' }}>
                            <strong>Established:</strong> {new Date(book.establishedDate).toLocaleDateString()}
                        </p>
                        <div style={{ marginTop: '15px' }}>
                            {book.available ? (
                                <button onClick={() => handleBorrow(book._id)} style={{
                                    padding: '8px 15px', backgroundColor: '#28a745',
                                    color: 'white', border: 'none',
                                    borderRadius: '4px', cursor: 'pointer', width: '100%'
                                }}>
                                    Borrow
                                </button>
                            ) : (
                                <div style={{
                                    padding: '8px 15px', backgroundColor: '#ddd',
                                    color: '#666', textAlign: 'center', borderRadius: '4px'
                                }}>
                                    Not Available
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {books.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
                    No books available yet.
                </p>
            )}
        </div>
    );
}