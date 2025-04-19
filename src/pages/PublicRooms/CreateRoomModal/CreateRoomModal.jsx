import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateRoomModal.css';
import PostService from "../../../API/PostService";

const CreateRoomModal = ({ isOpen, onClose, onRoomCreated }) => {
    const [roomData, setRoomData] = useState({
        room_name: '',
        type_id: '',
        floor_id: '',
        block_id: '',
        capacity: '',
        description: ''
    });
    const [roomTypes, setRoomTypes] = useState([]);
    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchRoomTypes();
            fetchFloors();
        }
    }, [isOpen]);


    const fetchRoomTypes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/management/public-rooms/room_types/');
            setRoomTypes(response.data);
        } catch (error) {
            console.error('Error fetching room types:', error);
        }
    };

    const fetchFloors = async () => {
        try {
            const response = await PostService.getAllFloors();
            setFloors(response);
        } catch (error) {
            console.error('Error fetching floors:', error);
        }
    };

    const fetchBlocks = async (floorId) => {
        if (!floorId) {
            setBlocks([]); // Clear blocks if no floor is selected
            return;
        }
        try {
            const response = await PostService.getBlocksByFloorId(floorId);
            setBlocks(response);
        } catch (error) {
            console.error('Error fetching blocks:', error);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setRoomData(prevData => ({
            ...prevData,
            [name]: value
        }));
        if (name === 'floor_id') {
            fetchBlocks(value);
            setRoomData(prevData => ({ ...prevData, block_id: '' }));
        }
    };


    const handleSubmit = async e => {
        e.preventDefault();
        try {
            // Фильтрация объекта roomData для удаления пустых значений
            const filteredRoomData = Object.fromEntries(
                Object.entries(roomData).filter(([_, value]) => value !== "")
            );

            const response = await axios.post('http://127.0.0.1:8000/management/public-rooms/', filteredRoomData);
            onRoomCreated(response.data.data);
            onClose();
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    return isOpen ? (
        <div className="modal-backdrop">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Create New Room</h2>
                <form onSubmit={handleSubmit}>
                    <select name="type_id" value={roomData.type_id} onChange={handleChange} required>
                        <option value="">Select Room Type</option>
                        {roomTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.type_name}</option>
                        ))}
                    </select>

                    <select name="floor_id" value={roomData.floor_id} onChange={handleChange} required>
                        <option value="">Select Floor</option>
                        {floors.map(floor => (
                            <option key={floor.id} value={floor.id}>{floor.floor_number}</option>
                        ))}
                    </select>
                    {blocks.length > 0 && (
                        <select name="block_id" value={roomData.block_id} onChange={handleChange}>
                            <option value="">Select Block (Optional)</option>
                            {blocks.map(block => (
                                <option key={block.id} value={block.id}>{block.block_name}</option>
                            ))}
                        </select>
                    )}
                    <input type="text" name="room_name" placeholder="Room Name" value={roomData.room_name}
                           onChange={handleChange} required/>
                    <input type="number" name="capacity" placeholder="Capacity" value={roomData.capacity}
                           onChange={handleChange} required/>
                    <textarea name="description" placeholder="Description" value={roomData.description}
                              onChange={handleChange}/>
                    <button type="submit">Create Room</button>
                </form>
            </div>
        </div>
    ) : null;
};

export default CreateRoomModal;
