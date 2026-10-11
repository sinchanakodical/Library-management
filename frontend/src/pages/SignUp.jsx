import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    const isPasswordValid = passwordRegex.test(password);
    const isEmailValid = email.includes('@') && (email.endsWith('.com') || email.endsWith('.in'));

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/signup', {
                firstName,
                secondName,
                email,
                password
            });

            setMessage('✅ Account created! Redirecting to sign in...');
            setTimeout(() => navigate('/signin'), 1500);
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Sign up failed'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>📝 Sign Up</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0 15px' }}
                    />
                </div>

                <div>
                    <label>Second Name:</label>
                    <input
                        type="text"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0 15px' }}
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0 5px' }}
                    />
                    <small style={{ color: isEmailValid ? 'green' : '#666' }}>
                        {isEmailValid ? '✅' : ''} Must contain @ and end with .com or .in
                    </small>
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', margin: '5px 0' }}
                    />
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                        <div style={{ color: password.length >= 8 ? 'green' : 'red' }}>
                            {password.length >= 8 ? '✅' : '❌'} 8+ characters
                        </div>
                        <div style={{ color: /[A-Z]/.test(password) ? 'green' : 'red' }}>
                            {/[A-Z]/.test(password) ? '✅' : '❌'} Uppercase letter
                        </div>
                        <div style={{ color: /[a-z]/.test(password) ? 'green' : 'red' }}>
                            {/[a-z]/.test(password) ? '✅' : '❌'} Lowercase letter
                        </div>
                        <div style={{ color: /[0-9]/.test(password) ? 'green' : 'red' }}>
                            {/[0-9]/.test(password) ? '✅' : '❌'} Number
                        </div>
                        <div style={{ color: /[!@#$%^&*]/.test(password) ? 'green' : 'red' }}>
                            {/[!@#$%^&*]/.test(password) ? '✅' : '❌'} Special character
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !isPasswordValid || !isEmailValid}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '20px',
                        backgroundColor: (loading || !isPasswordValid || !isEmailValid) ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (loading || !isPasswordValid || !isEmailValid) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                {message && <p style={{ textAlign: 'center', marginTop: '15px' }}>{message}</p>}
            </form>

            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </div>
    );
}