import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PublicRooms.css';
import CreateRoomModal from "./CreateRoomModal/CreateRoomModal";
import EditRoomModal from "./EditRoomModal/EditRoomModal";
import BookRoomModal from "./BookRoomModal/BookRoomModal";
import RoomBookingsModal from "./RoomBookingsModal/RoomBookingsModal";

const PublicRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const [bookingRoom, setBookingRoom] = useState(null);
    const [viewingBookingsRoom, setViewingBookingsRoom] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleBookClick = (room) => {
        setBookingRoom(room);
    };

    const handleViewBookingsClick = (room) => {
        setViewingBookingsRoom(room);
    };

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/management/public-rooms/');
            setRooms(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSearch = event => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleRoomCreated = newRoom => {
        setRooms(prevRooms => [...prevRooms, newRoom]);
    };

    const updateRoom = (updatedRoom) => {
        const updatedRooms = rooms.map(room =>
            room.id === updatedRoom.id ? updatedRoom : room
        );
        setRooms(updatedRooms);
    };


    const deletePublicRooms = async (PublicRoomsId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/management/public-rooms/${PublicRoomsId}`);
            setRooms(prev => prev.filter(PublicRooms => PublicRooms.id !== PublicRoomsId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment.');
        }
    };

    const handleEditClick = (room) => {
        setEditRoom(room);
    };

    const filteredRooms = rooms.filter(room => room.room_name.toLowerCase().includes(searchTerm));

    return (
        <div className="wrapper_public_rooms">
            <h1 className="h1_public_rooms">Общедоступные комнаты</h1>
            <div className="control-panel">
                <input
                    type="text"
                    placeholder="Поиск по названию комнаты..."
                    className="input-field"
                    onChange={handleSearch}
                />
                <button className="button" onClick={() => setIsCreateModalOpen(true)}>Создать комнату</button>

            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <div className="rooms-container">
                {filteredRooms.map(room => (
                    <div key={room.id} className="room-card">
                        <h2>{room.room_name} ({room.type_name})</h2>
                        <p>Этаж: {room.floor_number}</p>
                        <p>Блок: {room.block_name || 'Не указан'}</p>
                        <p>Вместимость: {room.capacity}</p>
                        <p>Описание: {room.description}</p>
                        <div className="button-group">
                            <button className="button" onClick={() => handleBookClick(room)}>Забронировать</button>
                            <button className="button" onClick={() => handleViewBookingsClick(room)}>бронирование</button>

                            <button className="button" onClick={() => handleEditClick(room)}>Редактировать</button>
                            <button className="button" onClick={() => deletePublicRooms(room.id)}>Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onRoomCreated={handleRoomCreated} />
            {editRoom && (
                <EditRoomModal
                    isOpen={Boolean(editRoom)}
                    room={editRoom}
                    onClose={() => setEditRoom(null)}
                    onRoomUpdated={updateRoom}
                />
            )}

            {bookingRoom && (
                <BookRoomModal
                    isOpen={Boolean(bookingRoom)}
                    room={bookingRoom}
                    onClose={() => setBookingRoom(null)}
                />
            )}

            {viewingBookingsRoom && (
                <RoomBookingsModal
                    isOpen={Boolean(viewingBookingsRoom)}
                    room={viewingBookingsRoom}
                    onClose={() => setViewingBookingsRoom(null)}
                />
            )}
        </div>
    );
};

export default PublicRooms;
