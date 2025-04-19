import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Для программной навигации
import MyButton from '../../../components/UI/button/MyButton'; // Предполагается, что кнопка импортирована
import cl from './Rooms.module.css';

const RoomsForm = () => {
    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const navigate = useNavigate(); // Хук для навигации

    useEffect(() => {
        fetchFloors();
    }, []);

    useEffect(() => {
        if (selectedFloor) {
            fetchBlocks(selectedFloor);
        } else {
            setBlocks([]);
            setRooms([]);
        }
    }, [selectedFloor]);

    useEffect(() => {
        if (selectedBlock) {
            fetchRooms(selectedBlock);
        } else {
            setRooms([]);
        }
    }, [selectedBlock]);

    const fetchFloors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/management/floors/floors/');
            setFloors(response.data.data);
        } catch (error) {
            console.error('Failed to fetch floors:', error);
        }
    };

    const fetchBlocks = async (floorId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/management/floors/floors/${floorId}/blocks/`);
            setBlocks(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch blocks:', error);
            setBlocks([]);
        }
    };

    const fetchRooms = async (blockId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/management/blocks/blocks/${blockId}/rooms/`);
            setRooms(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
            setRooms([]);
        }
    };

    // Функция для перехода к странице жителей комнаты
    const handleViewResidents = roomId => {
        navigate(`/resident_room/${roomId}`);
    };

    return (
        <div className={cl.roomsContainer}>
            <h1 className={cl.roomsHeader}>Manage Rooms</h1>
            <select
                className={cl.select}
                value={selectedFloor}
                onChange={e => setSelectedFloor(e.target.value)}
            >
                <option value="">Select a floor</option>
                {floors.map(floor => (
                    <option key={floor.id} value={floor.id}>
                        Floor {floor.floor_number}
                    </option>
                ))}
            </select>
            <select
                className={cl.select}
                value={selectedBlock}
                onChange={e => setSelectedBlock(e.target.value)}
                disabled={!selectedFloor}
            >
                <option value="">Select a block</option>
                {blocks.map(block => (
                    <option key={block.id} value={block.id}>
                        {block.block_name}
                    </option>
                ))}
            </select>
            {rooms.length > 0 && (
                <div>
                    <h2>Rooms in Block {selectedBlock}</h2>
                    <ul className={cl.roomsList}>
                        {rooms.map(room => (
                            <li key={room.id} className={cl.roomItem}>
                                Room {room.room_number} - Capacity: {room.max_capacity}, Current Occupancy: {room.current_occupancy}
                                <MyButton onClick={() => handleViewResidents(room.id)} style={{ marginLeft: '10px' }}>
                                    View Residents
                                </MyButton>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RoomsForm;
