import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';
import { AuthContext } from './context';
import "./styles/style.css"
import Sidebar from './components/UI/sidebar/sidebar';
import TopBar from './components/UI/TopBar/TopBar'; // Подразумевается, что импорт верный

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            setIsAuth(true);
        }
        setIsLoading(false);
    }, []);

    return (
        <div className="app-wrapper">
            <AuthContext.Provider value={{
                isAuth,
                setIsAuth,
                isLoading
            }}>
                <BrowserRouter>
                    <Sidebar />
                    <div className="content-wrapper">
                        <div className="content-right">
                            <div className="content_block upper-block">
                                <TopBar /> {/* Вставляем компонент TopBar */}
                            </div>
                            <div className="content_block lower-block">
                                <AppRoutes />
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
