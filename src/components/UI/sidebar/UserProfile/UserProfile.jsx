import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cl from './UserProfile.module.css';

const UserProfile = () => {
    const [user, setUser] = useState({
        username: '',
        email: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Добавлено withCredentials для поддержки Cookie в запросах
                const response = await axios.get('http://localhost:8000/users/me', {
                    withCredentials: true
                });
                setUser({
                    username: response.data.username,
                    email: response.data.email
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className={cl.profileContainer}>
            <img src="https://via.placeholder.com/150" alt="User" className={cl.profileImage} />
            <div className={cl.profileDetails}>
                <h3>{user.username}</h3>
                <p style={{ color: "#26a69a" }}>{user.email}</p>
            </div>
            <button className={cl.editButton} onClick={() => { /* логика перехода на страницу настроек */ }}>
                <span className="material-icons">settings</span>
            </button>
        </div>
    );
};

export default UserProfile;
