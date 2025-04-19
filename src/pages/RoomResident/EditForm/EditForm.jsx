import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyButton from "../../../components/UI/button/MyButton";
import cl from './EditForm.module.css';

const EditForm = ({ post, onUpdate }) => {
    const [formData, setFormData] = useState({
        block_id: post.block_id,
        room_number: post.room_number,
        max_capacity: post.max_capacity,
        current_occupancy: post.current_occupancy
    });

    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);

    // Загрузка этажей
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/management/floors/floors/')
            .then(res => setFloors(res.data.data))
            .catch(err => console.error('Failed to fetch floors:', err));
    }, []);

    // Загрузка блоков для выбранного этажа
    useEffect(() => {
        if (formData.floor_id) {
            axios.get(`http://127.0.0.1:8000/management/floors/floors/${formData.floor_id}/blocks/`)
                .then(res => setBlocks(res.data.data))
                .catch(err => console.error('Failed to fetch blocks:', err));
        }
    }, [formData.floor_id]);

    // Загрузка комнат для выбранного блока
    useEffect(() => {
        if (formData.block_id) {
            axios.get(`http://127.0.0.1:8000/management/blocks/blocks/${formData.block_id}/rooms/`)
                .then(res => setRooms(res.data.data))
                .catch(err => console.error('Failed to fetch rooms:', err));
        }
    }, [formData.block_id]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://127.0.0.1:8000/management/rooms/rooms/${post.id}`, {
                block_id: formData.block_id,
                room_number: formData.room_number,
                max_capacity: formData.max_capacity,
                current_occupancy: formData.current_occupancy
            });
            // Подготовка данных для передачи в onUpdate
            const updatedData = {
                ...post,
                ...formData,
                block_name: blocks.find(b => b.id === formData.block_id)?.block_name,
                floor_number: floors.find(f => f.id === formData.floor_id)?.floor_number
            };
            onUpdate(updatedData);
        } catch (error) {
            console.error('Failed to update room:', error);
        }
    };

    return (
        <form className={cl.postForm} onSubmit={handleSubmit}>
            <div className={cl.formGroup}>
                <label>Floor:</label>
                <select name="floor_id" value={formData.floor_id} onChange={handleChange}>
                    <option value="">Select floor</option>
                    {floors.map(floor => (
                        <option key={floor.id} value={floor.id}>{floor.floor_number}</option>
                    ))}
                </select>
            </div>
            <div className={cl.formGroup}>
                <label>Block:</label>
                <select name="block_id" value={formData.block_id} onChange={handleChange} disabled={!formData.floor_id}>
                    <option value="">Select block</option>
                    {blocks.map(block => (
                        <option key={block.id} value={block.id}>{block.block_name}</option>
                    ))}
                </select>
            </div>
            <div className={cl.formGroup}>
                <label>Room Number:</label>
                <select name="room_number" value={formData.room_number} onChange={handleChange} disabled={!formData.block_id}>
                    <option value="">Select room</option>
                    {rooms.map(room => (
                        <option key={room.id} value={room.room_number}>{room.room_number}</option>
                    ))}
                </select>
            </div>
            <div className={cl.formGroup}>
                <label>Max Capacity:</label>
                <input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleChange} />
            </div>
            <div className={cl.formGroup}>
                <label>Current Occupancy:</label>
                <input type="number" name="current_occupancy" value={formData.current_occupancy} onChange={handleChange} />
            </div>
            <MyButton type="submit">Save Changes</MyButton>
        </form>
    );
};

export default EditForm;
