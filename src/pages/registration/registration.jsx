import React, { useState } from 'react';
import axios from 'axios';
import MyInput from "../../components/UI/input/MyInput";
import MyButton from "../../components/UI/button/MyButton";
import "./style.css";

const Registration = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const user = {
                email: email,
                password: password,
                username: username,
                is_active: true,
                is_superuser: false,
                is_verified: false,
                role_id: 0
            };

            const response = await axios.post(
                'http://127.0.0.1:8000/auth/register',
                user,
                { headers: { 'Content-Type': 'application/json' } }
            );
            localStorage.setItem('auth', 'true');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register">
            <div className="register-content">
                <h2>Register</h2>
                <div>
                    <label>Email:</label>
                    <MyInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <MyInput
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <MyInput
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <MyButton onClick={handleRegister}>Register</MyButton>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default Registration;
