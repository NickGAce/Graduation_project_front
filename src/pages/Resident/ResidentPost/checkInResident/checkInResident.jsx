import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyButton from "../../../../components/UI/button/MyButton";
import cl from './checkInResident.module.css';
import PostService from "../../../../API/PostService"; // Ensure this is correctly imported

const CheckInResident = ({ post, onUpdate }) => {
    const [formData, setFormData] = useState({
        id: post.id || '',
        full_name: post.full_name || '',
        gender: post.gender || '',
        citizenship: post.citizenship || '',
        role: post.role || '',
        faculty: post.faculty || '',
        group_number: post.group_number || '',
        date_of_check_in: post.date_of_check_in || '',
        date_of_check_out: post.room_id ? post.date_of_check_out : '',  // Only initialize if room_id is not null
        room_id: post.room_id || '',
        email: post.email || '',
        status: post.status || ''
    });

    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);


    useEffect(() => {
        setFormData({
            id: post.id || '',
            full_name: post.full_name || '',
            gender: post.gender || '',
            citizenship: post.citizenship || '',
            role: post.role || '',
            faculty: post.faculty || '',
            group_number: post.group_number || '',
            date_of_check_in: post.date_of_check_in || '',
            date_of_check_out: post.room_id ? post.date_of_check_out : '',
            room_id: post.room_id || '',
            email: post.email || '',
            status: post.status || ''
        });
    }, [post]);

    useEffect(() => {
        fetchFloors();
    }, []);

    const fetchFloors = async () => {
        const response = await PostService.getAllFloors();
        setFloors(response);
    };

    const fetchBlocks = async (floorId) => {
        const response = await axios.get(`http://127.0.0.1:8000/management/floors/floors/${floorId}/blocks/`);
        setBlocks(response.data.data);
        setRooms([]);
    };

    const fetchRooms = async (blockId) => {
        const response = await axios.get(`http://127.0.0.1:8000/management/blocks/blocks/${blockId}/rooms/`);
        setRooms(response.data.data.filter(room => room.max_capacity !== room.current_occupancy));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://127.0.0.1:8000/management/residents/residents/${post.id}`, formData);
            onUpdate(formData); // Update the parent component with the new data
            await downloadDocument(post.id); // Call to download document function after successful update
        } catch (error) {
            console.error('Failed to update resident:', error);
        }
    };

    const downloadDocument = async (residentId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/management/residents/${residentId}/check-in-document`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relocation_notice_${residentId}.docx`); // or any other extension
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Failed to download the document:', error);
        }
    };

    return (
        <>
            <div className={cl.residentSummary}>
                <h3>Resident Information</h3>
                <p><strong>Full Name:</strong> {post.full_name}</p>
                <p><strong>Gender:</strong> {post.gender}</p>
                <p><strong>Date of Check-In:</strong> {post.date_of_check_in}</p>
                <p><strong>Citizenship:</strong> {post.citizenship}</p>
                <p><strong>Role:</strong> {post.role}</p>
            </div>
            <form className={cl.postForm} onSubmit={handleSubmit}>
                <div className={cl.formGroup}>
                    <label htmlFor="floor">Floor:</label>
                    <div className="select-container">
                        <select
                            id="floor"
                            onChange={e => {
                                const floorId = e.target.value;
                                fetchBlocks(floorId);
                                setFormData({...formData, floor_id: floorId, block_id: '', room_id: ''});
                            }}
                            className="select"
                        >
                            <option value="">Select a floor</option>
                            {floors.map(floor => (
                                <option key={floor.id} value={floor.id}>{floor.floor_number}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={cl.formGroup}>
                    <label htmlFor="block">Block:</label>
                    <div className="select-container">
                        <select
                            id="block"
                            onChange={e => {
                                const blockId = e.target.value;
                                fetchRooms(blockId);
                                setFormData({...formData, block_id: blockId, room_id: ''});
                            }}
                            className="select"
                            disabled={!formData.floor_id}
                        >
                            <option value="">Select a block</option>
                            {blocks.map(block => (
                                <option key={block.id} value={block.id}>{block.block_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={cl.formGroup}>
                    <label htmlFor="room_id">Room ID:</label>
                    <div className="select-container">
                        <select
                            id="room_id"
                            name="room_id"
                            onChange={handleChange}
                            className="select"
                            disabled={!formData.block_id}
                        >
                            <option value="">Select a room</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>{room.room_number}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {formData.room_id && (
                    <div className={cl.formGroup}>
                        <label htmlFor="date_of_check_out">Date of Check-Out:</label>
                        <input type="date" id="date_of_check_out" name="date_of_check_out" onChange={handleChange} className="input" />
                    </div>
                )}
                <MyButton type="submit" className="button">Update Resident</MyButton>
            </form>
        </>
    );
};

export default CheckInResident;
