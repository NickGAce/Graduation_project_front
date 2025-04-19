import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ResidentRating.module.css'; // Импорт стилей как модуля

const ResidentRating = ({ residentId }) => {
    const [rating, setRating] = useState({
        achievement_score: 0,
        infraction_score: 0,
        overall_score: 0
    });

    // Функция для загрузки текущего рейтинга
    const fetchRating = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/management/ratings/ratings/${residentId}`);
            setRating({
                ...response.data.data,
                achievement_score: parseFloat(response.data.data.achievement_score).toFixed(2),
                infraction_score: parseFloat(response.data.data.infraction_score).toFixed(2),
                overall_score: parseFloat(response.data.data.overall_score).toFixed(2)
            });
        } catch (error) {
            console.error("Failed to fetch rating:", error);
        }
    };

    // Загрузка рейтинга при монтировании компонента
    useEffect(() => {
        fetchRating();
    }, [residentId]);

    // Функция для изменения рейтинга
    const updateRating = async (changeType, isAchievement) => {
        const typeUrl = isAchievement ? 'increase_achievement' : 'decrease_infraction';
        try {
            await axios.patch(`http://127.0.0.1:8000/management/ratings/ratings/${rating.id}/${typeUrl}/${changeType}`);
            fetchRating(); // Повторно загружаем данные после изменения
        } catch (error) {
            console.error("Failed to update rating:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.header}>Resident Rating</h3>
            <p className={styles.score}>Achievement Score: {rating.achievement_score}</p>
            <p className={styles.score}>Infraction Score: {rating.infraction_score}</p>
            <p className={styles.score}>Overall Score: {rating.overall_score}</p>

            <div className={styles.capacityBar}>
                <div className={styles.capacityFill} style={{width: `${(rating.overall_score / 5) * 100}%`}}></div>
                <div className={styles.snapIndicator} style={{left: `${(rating.overall_score / 5) * 100}%`}}>
                    {rating.overall_score}
                </div>
            </div>

            <div className={styles.actions}>
                <button onClick={() => updateRating('small', true)} className={styles.button}>Small Achievement</button>

                <button onClick={() => updateRating('medium', true)} className={styles.button}>Medium Achievement
                </button>

                <button onClick={() => updateRating('large', true)} className={styles.button}>Large Achievement</button>

                <button onClick={() => updateRating('moderate', false)} className={styles.button}>Moderate Infraction</button>
                
                <button onClick={() => updateRating('minor', false)} className={styles.button}>Minor Infraction</button>

                <button onClick={() => updateRating('major', false)} className={styles.button}>Major Infraction</button>
            </div>
        </div>
    );
};

export default ResidentRating;
