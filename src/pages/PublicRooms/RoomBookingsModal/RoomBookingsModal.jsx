import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RoomBookingsModal.css'

const RoomBookingsModal = ({ isOpen, room, onClose }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchBookings();
        }
    }, [isOpen]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/bookings/room/${room.id}`);
            setBookings(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const deleteBooking = async (bookingId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/bookings/${bookingId}`);
            setBookings(currentBookings => currentBookings.filter(b => b.id !== bookingId));
            alert('Бронирование успешно удалено!');
        } catch (error) {
            console.error('Ошибка при удалении бронирования:', error);
            alert('Ошибка при удалении бронирования.');
        }
    };

    const formatDateTime = (isoString) => {
        return new Date(isoString).toLocaleString();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Бронирования для комнаты: {room.room_name}</h2>
                {loading ? <p>Loading...</p> : (
                    bookings.length > 0 ? (
                        <ul>
                            {bookings.map(booking => (
                                <li key={booking.id}>
                                    <p>Время начала: {formatDateTime(booking.start_time)}</p>
                                    <p>Время окончания: {formatDateTime(booking.end_time)}</p>
                                    <p>Активно: {booking.is_active ? "Да" : "Нет"}</p>
                                    <button onClick={() => deleteBooking(booking.id)}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>Нет бронирований.</p>
                )}
                {error && <p>Error: {error}</p>}
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default RoomBookingsModal;
