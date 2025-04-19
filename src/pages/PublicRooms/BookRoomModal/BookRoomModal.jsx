// BookRoomModal.js
import React, { useState } from 'react';
import axios from 'axios';
import './BookRoomModal.css'

const BookRoomModal = ({ isOpen, onClose, room }) => {
    const [bookingDetails, setBookingDetails] = useState({
        startDate: '',
        startTime: '',
        endTime: ''
    });

    const handleChange = (e) => {
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
    };

    const bookRoom = async () => {
        const bookingData = {
            room_id: room.id,
            user_id: 1,  // Тут должен быть ID текущего пользователя, который можно получить из контекста или глобального состояния
            start_time: `${bookingDetails.startDate}T${bookingDetails.startTime}:00.000Z`,
            end_time: `${bookingDetails.startDate}T${bookingDetails.endTime}:00.000Z`
        };

        try {
            await axios.post('http://127.0.0.1:8000/bookings/', bookingData);
            alert('Бронирование успешно выполнено!');
            onClose();
        } catch (error) {
            console.error('Ошибка при бронировании комнаты:', error);
            alert('Ошибка при бронировании');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Бронирование комнаты: {room.room_name}</h2>
                <input name="startDate" type="date" value={bookingDetails.startDate} onChange={handleChange} />
                <input name="startTime" type="time" value={bookingDetails.startTime} onChange={handleChange} />
                <input name="endTime" type="time" value={bookingDetails.endTime} onChange={handleChange} />
                <button onClick={bookRoom}>Забронировать</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default BookRoomModal;
