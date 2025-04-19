import React, { useState } from 'react';
import axios from "axios";
import './EditRoomModal.css'


const EditRoomModal = ({ isOpen, onClose, room, onRoomUpdated }) => {
    const [roomName, setRoomName] = useState(room.room_name);
    const [floorNumber, setFloorNumber] = useState(room.floor_number);
    const [blockName, setBlockName] = useState(room.block_name);
    const [capacity, setCapacity] = useState(room.capacity);
    const [description, setDescription] = useState(room.description);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Собираем данные для обновления
        const updatedRoomData = {
            room_name: roomName,
            floor_number: floorNumber,
            block_name: blockName,
            capacity: capacity,
            description: description
        };

        try {
            // Отправляем обновленные данные на сервер
            const response = await axios.patch(`http://127.0.0.1:8000/management/public-rooms/${room.id}`, updatedRoomData);
            if (response.status === 200) {
                // При успешном обновлении данных на сервере обновляем локальный стейт
                onRoomUpdated(response.data.data); // Предполагается, что API возвращает обновленные данные комнаты
                onClose(); // Закрываем модальное окно
            } else {
                throw new Error('Failed to update the room');
            }
        } catch (error) {
            console.error('Failed to update the room:', error);
            alert('Failed to update the room.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit}>
                    <h2>Edit Room</h2>
                    <label>Room Name:
                        <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} />
                    </label>
                    <label>Floor Number:
                        <input type="number" value={floorNumber} onChange={e => setFloorNumber(e.target.value)} />
                    </label>
                    <label>Block Name:
                        <input type="text" value={blockName} onChange={e => setBlockName(e.target.value)} />
                    </label>
                    <label>Capacity:
                        <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
                    </label>
                    <label>Description:
                        <textarea value={description} onChange={e => setDescription(e.target.value)} />
                    </label>
                    <button type="submit">Update Room</button>
                </form>
            </div>
        </div>
    );
};

export default EditRoomModal;


