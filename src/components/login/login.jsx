import React, { useState } from 'react';

const Login = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const getProfile = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/institutes/profile', {
                method: 'GET',
                credentials: 'include', // Ensure credentials are included
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/institutes/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                credentials: 'include', // Ensure credentials are included
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
            setMessage('Login successful!');
        } catch (error) {
            console.error('Error:', error.message);
            setMessage('Login failed: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div>
            <h1>Login Page</h1>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="button" onClick={handleSubmit}>Enter</button>
            {message && <p>{message}</p>}

            <button type="button" onClick={getProfile}>Profile</button>
        </div>
    );
};

export default Login;