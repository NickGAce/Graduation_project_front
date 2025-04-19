import React from 'react';
import cl from './style.module.css';
import { useNavigate } from 'react-router-dom';
import UserProfile from "./UserProfile/UserProfile";
import DormInfo from "./DormInfo/DormInfo";
import WheelOfFortune from "../WheelOfFortune/WheelOfFortune";

const Sidebar = () => {
    const navigate = useNavigate(); // Получаем функцию для навигации

    // Универсальная функция для перехода по маршруту
    const goToPage = (path) => {
        navigate(path);
    };

    return (
        <div className={cl.sidebarContainer}>
            <div className={`${cl.sidebarItem} ${cl.dormInfoItem}`}>
                <DormInfo/>
            </div>

            <div className={`${cl.sidebarItem} ${cl.searchItem}`}>
                <WheelOfFortune/>
            </div>

            <div className={`${cl.sidebarItem} ${cl.functionalityItem}`}>
                <div className={cl.functionBlock} onClick={() => goToPage('/room')}>
                    <span style={{marginRight: 10}} className="material-icons">meeting_room</span>
                    Управление комнатами
                </div>
                <div  className={cl.functionBlock} onClick={() => goToPage('/resident')}>
                    <span style={{marginRight: 10}} className="material-icons">face</span>
                       Управление жильцами
                </div>
                <div className={cl.functionBlock} onClick={() => goToPage('/public_rooms/')}>
                    <span style={{marginRight: 10}} className="material-icons">event</span>
                    Бронирование общественных мест
                </div>
            </div>

            <div className={`${cl.sidebarItem} ${cl.profileItem}`}>
                <UserProfile/>
            </div>
        </div>
    );
};

export default Sidebar;
