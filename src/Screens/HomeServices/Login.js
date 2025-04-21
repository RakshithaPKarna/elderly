
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3000/api/login', { email, password }, { withCredentials: 'inlcude' });
            localStorage.setItem('token', res.data.token);
            alert('login successful')
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div style={{
            margin: '20px',
            padding: '20px',
            background: `url('../../assets/purple.jpg') no-repeat center center/cover`
        }}>
        
            <h2>Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    style={{
                        'width': '50%',
                        'margin': '10px'
                    }}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    style={{
                        'width': '50%',
                        'margin': '10px'
                    }}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" style={{
                    'width': '30%',
                    'cursor': 'pointer'
                }}>Login</button>
            </form>
        </div>
    );
};

export default Login;