
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await axios.post('http://localhost:3000/api/signup', { name, email, password }, { withCredentials: 'include' });
            setSuccess(res.data.message);
            // Optionally store the token (e.g., in localStorage) and navigate
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div style={{
            margin: '20px',
            padding: '20px',
            background: `url('../../assets/purple.jpg') no-repeat center center/cover`
        }}>
        
            <h2>Sign Up</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    style={{
                        'width': '50%',
                        'margin': '10px'
                    }}
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                }}>Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;