import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/signin');
    }

    return (
        <nav style={{
            padding: '15px 30px',
            backgroundColor: '#222',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' }}>
                📚 Library
            </Link>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span>Hi, {user.firstName} ({user.role})</span>

                        {user.role === 'admin' ? (
                            <>
                                <Link to="/admin" style={{ color: 'white' }}>Dashboard</Link>
                                <Link to="/admin/books" style={{ color: 'white' }}>Books</Link>
                                <Link to="/admin/members" style={{ color: 'white' }}>Members</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
                                <Link to="/books" style={{ color: 'white' }}>Browse Books</Link>
                                <Link to="/my-borrowings" style={{ color: 'white' }}>My Books</Link>
                            </>
                        )}

                        <Link to="/change-password" style={{ color: 'white' }}>Change Password</Link>

                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '6px 12px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/signin" style={{ color: 'white' }}>Sign In</Link>
                        <Link to="/signup" style={{ color: 'white' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}