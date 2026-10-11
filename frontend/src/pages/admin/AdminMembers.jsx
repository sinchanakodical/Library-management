import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminMembers() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [newUser, setNewUser] = useState({
        firstName: '', secondName: '', email: '', address: '', password: ''
    });

    async function fetchUsers() {
        try {
            const res = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
            setUsers(res.data.users || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { fetchUsers(); }, []);

    async function handleCreate(e) {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/users', newUser, { withCredentials: true });
            setMessage('✅ User created! Activate them to allow login.');
            setNewUser({ firstName: '', secondName: '', email: '', address: '', password: '' });
            fetchUsers();
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Failed'));
        }
    }

    async function toggleActive(id, currentActive) {
        try {
            await axios.patch(
                `http://localhost:5000/api/users/${id}/active`,
                { active: !currentActive },
                { withCredentials: true }
            );
            fetchUsers();
        } catch (err) {
            alert('Failed to toggle');
        }
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '20px' }}>
            <h1>👥 Manage Members</h1>

            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginTop: '20px' }}>
                <h3>Add New Member (inactive by default)</h3>
                <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <input placeholder="First Name" value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <input placeholder="Second Name" value={newUser.secondName}
                        onChange={(e) => setNewUser({ ...newUser, secondName: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <input type="email" placeholder="Email" value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <input placeholder="Address" value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                        style={{ padding: '8px' }} />
                    <input type="password" placeholder="Temporary Password" value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required style={{ padding: '8px' }} />
                    <button type="submit" style={{
                        padding: '10px', backgroundColor: '#28a745', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer'
                    }}>
                        Create Member
                    </button>
                </form>
                {message && <p style={{ marginTop: '10px' }}>{message}</p>}
            </div>

            <h3 style={{ marginTop: '40px' }}>All Members ({users.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee' }}>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td style={tdStyle}>{u.firstName} {u.secondName}</td>
                            <td style={tdStyle}>{u.email}</td>
                            <td style={tdStyle}>
                                {u.active ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Active</span>
                                ) : (
                                    <span style={{ color: 'red', fontWeight: 'bold' }}>❌ Stopped</span>
                                )}
                            </td>
                            <td style={tdStyle}>
                                <button onClick={() => toggleActive(u._id, u.active)} style={{
                                    padding: '5px 10px',
                                    backgroundColor: u.active ? '#dc3545' : '#28a745',
                                    color: 'white', border: 'none',
                                    borderRadius: '4px', cursor: 'pointer'
                                }}>
                                    {u.active ? 'Stop' : 'Activate'}
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