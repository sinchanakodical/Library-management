import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ books: 0, users: 0, active: 0 });

    useEffect(() => {
        async function fetchStats() {
            try {
                const [booksRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/books', { withCredentials: true }),
                    axios.get('http://localhost:5000/api/users', { withCredentials: true })
                ]);

                const users = usersRes.data.users || [];
                setStats({
                    books: booksRes.data.books?.length || 0,
                    users: users.length,
                    active: users.filter(u => u.active).length
                });
            } catch (err) {
                console.error(err);
            }
        }
        fetchStats();
    }, []);

    return (
        <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '20px' }}>
            <h1>🛠️ Admin Dashboard</h1>
            <p>Welcome back, <strong>{user?.firstName} {user?.secondName}</strong></p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
                <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '36px', margin: 0 }}>{stats.books}</h2>
                    <p>Total Books</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#fff0f5', borderRadius: '8px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '36px', margin: 0 }}>{stats.users}</h2>
                    <p>Total Members</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#f0fff0', borderRadius: '8px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '36px', margin: 0 }}>{stats.active}</h2>
                    <p>Active Users</p>
                </div>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                <Link to="/admin/books" style={{
                    padding: '15px 30px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px'
                }}>
                    📚 Manage Books
                </Link>
                <Link to="/admin/members" style={{
                    padding: '15px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px'
                }}>
                    👥 Manage Members
                </Link>
            </div>
        </div>
    );
}