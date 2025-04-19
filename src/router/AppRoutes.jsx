import React, {useContext} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {private_routers, public_routers} from "./routers";
import {AuthContext} from "../context";
import Loader from "../components/UI/Loader/Loader";

const AppRoutes = () => {
    const {isAuth, isLoading} = useContext(AuthContext);

    if(isLoading){
        return <div style={{display: 'flex', justifyContent: 'center', marginTop: 200}}>
            <Loader/>
        </div>
    }

    return (
        isAuth
            ?
            <Routes>
                {private_routers.map(
                    router =>
                        <Route
                            path={router.path}
                            element={router.element}
                            key={router.path}
                        />
                )}
                {/* Добавьте перенаправление */}
                <Route path="/" element={<Navigate to="/home" />} />
                {/* Маршрут для обработки несуществующих URL */}
                {/* Добавьте перенаправление на главную страницу при вводе неверного URL */}
                <Route path="*" element={<Navigate to="/home" />} />

            </Routes>
        :
            <Routes>
                {public_routers.map(
                    router =>
                        <Route
                            path={router.path}
                            element={router.element}
                            key={router.path}
                        />
                )}
                {/* Добавьте перенаправление */}
                <Route path="/" element={<Navigate to="/login" />} />
                {/* Маршрут для обработки несуществующих URL */}
                {/* Добавьте перенаправление на главную страницу при вводе неверного URL */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
    );
};

export default AppRoutes;