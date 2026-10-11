import { useState } from 'react';
import axios from 'axios';

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    const isNewPasswordValid = passwordRegex.test(newPassword);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await axios.post(
                'http://localhost:5000/api/auth/change-password',
                { oldPassword, newPassword },
                { withCredentials: true }
            );

            setMessage('✅ Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Change failed'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>🔑 Change Password</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Old Password:</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0 15px' }}
                    />
                </div>

                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                        <div style={{ color: newPassword.length >= 8 ? 'green' : 'red' }}>
                            {newPassword.length >= 8 ? '✅' : '❌'} 8+ characters
                        </div>
                        <div style={{ color: /[A-Z]/.test(newPassword) ? 'green' : 'red' }}>
                            {/[A-Z]/.test(newPassword) ? '✅' : '❌'} Uppercase letter
                        </div>
                        <div style={{ color: /[a-z]/.test(newPassword) ? 'green' : 'red' }}>
                            {/[a-z]/.test(newPassword) ? '✅' : '❌'} Lowercase letter
                        </div>
                        <div style={{ color: /[0-9]/.test(newPassword) ? 'green' : 'red' }}>
                            {/[0-9]/.test(newPassword) ? '✅' : '❌'} Number
                        </div>
                        <div style={{ color: /[!@#$%^&*]/.test(newPassword) ? 'green' : 'red' }}>
                            {/[!@#$%^&*]/.test(newPassword) ? '✅' : '❌'} Special character
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !isNewPasswordValid}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '20px',
                        backgroundColor: (loading || !isNewPasswordValid) ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || !isNewPasswordValid) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Changing...' : 'Change Password'}
                </button>

                {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
            </form>
        </div>
    );
}