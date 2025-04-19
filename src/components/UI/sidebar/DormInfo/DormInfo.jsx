import React, { useState, useEffect } from 'react';
import axios from 'axios';
import cl from './DormInfo.module.css';  // Убедитесь, что создали соответствующий CSS-файл

const DormInfo = () => {
    const [dormData, setDormData] = useState({ total_occupancy: 0, total_capacity: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/management/summary/all/');
                setDormData(response.data);
            } catch (error) {
                console.error('Ошибка при получении данных об общежитии', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={cl.container}>
            <h1>Общежитие</h1>
            <p>Адрес: Некий адрес общежития</p>
            <p>Загруженность: {dormData.total_occupancy} из {dormData.total_capacity}</p>
        </div>
    );
};

export default DormInfo;
