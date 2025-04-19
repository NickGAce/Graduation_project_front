import React, { useContext } from 'react';
import cl from './TopBar.module.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context';

const TopBar = () => {
    const navigate = useNavigate();
    const { setIsAuth } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setIsAuth(false);
        navigate('/login'); // Предполагается, что есть маршрут для страницы входа
    };

    const handleHome = () => {
        navigate('/'); // Возвращение на домашнюю страницу
    };

    return (
        <div className={cl.topBar}>
            <span className={cl.icon} onClick={handleHome}>
                <span className="material-icons">home</span>
            </span>
            <span className={cl.icon} onClick={handleLogout}>
                <span className="material-icons">exit_to_app</span>
            </span>
        </div>
    );
};

export default TopBar;
