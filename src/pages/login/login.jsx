import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyInput from "../../components/UI/input/MyInput";
import MyButton from "../../components/UI/button/MyButton";
import "./style.css";
import { AuthContext } from "../../context";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuth, setIsAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const formData = new FormData();
            formData.append('grant_type', '');
            formData.append('username', email);
            formData.append('password', password);

            const response = await axios.post(
                'http://localhost:8000/auth/jwt/login',
                formData,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    withCredentials: true }
            );
            setIsAuth(true);
            localStorage.setItem('auth', 'true');
            navigate('/dashboard');
        } catch (err) {
            setError('Incorrect email or password');
        }
    };

    const handleGoToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login">
            <div className="login-content">
                <h2>Login</h2>
                <div>
                    <label>Email:</label>
                    <MyInput
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <MyButton onClick={handleLogin}>Login</MyButton>
                <MyButton onClick={handleGoToRegister}>Register</MyButton>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default Login;
