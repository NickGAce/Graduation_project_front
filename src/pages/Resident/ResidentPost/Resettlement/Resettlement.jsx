import React, {useState, useEffect} from 'react';
import axios from 'axios';
import MyButton from "../../../../components/UI/button/MyButton";
import cl from './Resettlement.module.css';
import PostService from "../../../../API/PostService";

const Resettlement = ({ post, onUpdate }) => {
    const [formData, setFormData] = useState({
        new_room_id: '',
        old_room_id: post.room_id // Assuming you're passing the current room ID when rendering this component
    });

    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);


    useEffect(() => {
        fetchFloors();
    }, [post]);

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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://127.0.0.1:8000/management/residents/residents/${post.id}`, {
                room_id: formData.new_room_id
            });
            onUpdate({ ...post, room_id: formData.new_room_id });
            await generateRelocationDocument(post.id, formData.old_room_id);
        } catch (error) {
            console.error('Failed to resettle resident:', error);
        }
    };

    const generateRelocationDocument = async (residentId, oldRoomId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/management/residents/${residentId}/relocation-document`, {
                params: { old_room_id: oldRoomId },
                responseType: 'blob' // Important for handling binary data files
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `relocation_notice_${residentId}.docx`); // or any other extension
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Failed to create relocation document:', error);
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
                <p><strong>Current Room Number:</strong> {post.room_number}</p>
            </div>
            <form className={cl.postForm} onSubmit={handleSubmit}>
                <div className={cl.formGroup}>
                    <label htmlFor="new_floor">New Floor:</label>
                    <div className="select-container">
                        <select
                            id="new_floor"
                            onChange={e => {
                                const floorId = e.target.value;
                                fetchBlocks(floorId);
                                setFormData({...formData, new_floor_id: floorId, new_block_id: '', new_room_id: ''});
                            }}
                            className="select"
                        >
                            <option value="">Select a new floor</option>
                            {floors.map(floor => (
                                <option key={floor.id} value={floor.id}>{floor.floor_number}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={cl.formGroup}>
                    <label htmlFor="new_block">New Block:</label>
                    <div className="select-container">
                        <select
                            id="new_block"
                            onChange={e => {
                                const blockId = e.target.value;
                                fetchRooms(blockId);
                                setFormData({...formData, new_block_id: blockId, new_room_id: ''});
                            }}
                            className="select"
                            disabled={!formData.new_floor_id}
                        >
                            <option value="">Select a new block</option>
                            {blocks.map(block => (
                                <option key={block.id} value={block.id}>{block.block_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={cl.formGroup}>
                    <label htmlFor="new_room_id">New Room ID:</label>
                    <div className="select-container">
                        <select
                            id="new_room_id"
                            name="new_room_id"
                            onChange={handleChange}
                            className="select"
                            disabled={!formData.new_block_id}
                        >
                            <option value="">Select a new room</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>{room.room_number}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <MyButton type="submit" className="button">Resettle Resident</MyButton>
            </form>
        </>
    );
};

export default Resettlement;
