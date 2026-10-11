import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
    const { user } = useAuth();
    const [borrowedCount, setBorrowedCount] = useState(0);
    const [booksCount, setBooksCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const [borrowedRes, booksRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users/me/borrowed', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/books', { withCredentials: true })
                ]);
                setBorrowedCount(borrowedRes.data.borrowedBooks?.length || 0);
                setBooksCount(booksRes.data.books?.length || 0);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    return (
        <div style={{ maxWidth: '900px', margin: '30px auto', padding: '20px' }}>
            <h1>👋 Welcome, {user?.firstName}!</h1>
            <p>This is your library dashboard.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '30px' }}>
                <div style={{ padding: '25px', backgroundColor: '#f0f8ff', borderRadius: '8px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '42px', margin: 0 }}>{booksCount}</h2>
                    <p>Books Available</p>
                </div>
                <div style={{ padding: '25px', backgroundColor: '#fff0f5', borderRadius: '8px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '42px', margin: 0 }}>{borrowedCount}</h2>
                    <p>Books You Borrowed</p>
                </div>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                <Link to="/books" style={{
                    padding: '15px 30px', backgroundColor: '#007bff',
                    color: 'white', textDecoration: 'none', borderRadius: '6px'
                }}>
                    📚 Browse Books
                </Link>
                <Link to="/my-borrowings" style={{
                    padding: '15px 30px', backgroundColor: '#6f42c1',
                    color: 'white', textDecoration: 'none', borderRadius: '6px'
                }}>
                    📖 My Borrowings
                </Link>
            </div>
        </div>
    );
}