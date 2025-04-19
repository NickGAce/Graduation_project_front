import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyInput from '../../../components/UI/input/MyInput';
import MyButton from '../../../components/UI/button/MyButton';
import cl from './ResidentForms.module.css';

const ResidentForm = ({ create }) => {
    const [resident, setResident] = useState({
        full_name: '',
        gender: '',
        citizenship: '',
        role: '',
        faculty: '',
        group_number: '',
        date_of_check_in: new Date().toISOString().slice(0, 10), // Форматируем дату сегодняшним числом
        date_of_check_out: '',
        room_id: '',
        email: '',
        status: ''
    });

    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/management/floors/floors/')
            .then(response => setFloors(response.data.data))
            .catch(error => console.error('Failed to fetch floors:', error));
    }, []);

    useEffect(() => {
        if (resident.floor_id) {
            axios.get(`http://127.0.0.1:8000/management/floors/floors/${resident.floor_id}/blocks/`)
                .then(response => {
                    setBlocks(response.data.data);
                    setRooms([]);
                })
                .catch(error => console.error('Failed to fetch blocks:', error));
        } else {
            setBlocks([]);
        }
    }, [resident.floor_id]);

    useEffect(() => {
        if (resident.block_id) {
            axios.get(`http://127.0.0.1:8000/management/blocks/blocks/${resident.block_id}/rooms/`)
                .then(response => setRooms(response.data.data))
                .catch(error => console.error('Failed to fetch rooms:', error));
        } else {
            setRooms([]);
        }
    }, [resident.block_id]);

    const addNewResident = async (e) => {
        e.preventDefault();
        try {
            const postData = {
                ...resident,
                room_id: resident.room_id || null,
                date_of_check_out: resident.date_of_check_out || null
            };

            const response = await axios.post('http://127.0.0.1:8000/management/residents/residents/', postData);

            create(response.data.data);
            setResident({
                full_name: '',
                gender: '',
                citizenship: '',
                role: '',
                faculty: '',
                group_number: '',
                date_of_check_in: new Date().toISOString().slice(0, 10),
                date_of_check_out: '',
                room_id: '',
                email: '',
                status: ''
            });
        } catch (error) {
            console.error('Failed to create resident:', error.response ? error.response.data : "No response from server");
        }
    };

    return (
        <form className={cl.postForm} onSubmit={addNewResident}>
            {/* Выбор этажа */}
            <div className={cl.formGroup}>
                <label>Floor:</label>
                <select
                    value={resident.floor_id || ''}
                    onChange={e => setResident({ ...resident, floor_id: e.target.value, block_id: '', room_id: '' })}
                    className={cl.select}
                >
                    <option value="">Select a floor</option>
                    {floors.map(floor => (
                        <option key={floor.id} value={floor.id}>{floor.floor_number}</option>
                    ))}
                </select>
            </div>
            {/* Выбор блока */}
            <div className={cl.formGroup}>
                <label>Block:</label>
                <select
                    value={resident.block_id || ''}
                    onChange={e => setResident({ ...resident, block_id: e.target.value, room_id: '' })}
                    disabled={!resident.floor_id}
                    className={cl.select}
                >
                    <option value="">Select a block</option>
                    {blocks.map(block => (
                        <option key={block.id} value={block.id}>{block.block_name}</option>
                    ))}
                </select>
            </div>
            {/* Выбор комнаты */}
            <div className={cl.formGroup}>
                <label>Room:</label>
                <select
                    value={resident.room_id || ''}
                    onChange={e => setResident({ ...resident, room_id: e.target.value })}
                    disabled={!resident.block_id}
                    className={cl.select}
                >
                    <option value="">Select a room (Optional)</option>
                    {rooms.map(room => (
                        <option key={room.id} value={room.id}>Room {room.room_number}</option>
                    ))}
                </select>
            </div>
            {/* Остальные поля */}
            <MyInput label="Full Name" value={resident.full_name} onChange={e => setResident({...resident, full_name: e.target.value})} placeholder="Enter full name"/>
            <MyInput label="Gender" value={resident.gender} onChange={e => setResident({...resident, gender: e.target.value})} placeholder="Enter gender"/>
            <MyInput label="Citizenship" value={resident.citizenship} onChange={e => setResident({...resident, citizenship: e.target.value})} placeholder="Enter citizenship"/>
            <MyInput label="Role" value={resident.role} onChange={e => setResident({...resident, role: e.target.value})} placeholder="Enter role"/>
            <MyInput label="Faculty" value={resident.faculty} onChange={e => setResident({...resident, faculty: e.target.value})} placeholder="Enter faculty"/>
            <MyInput label="Group Number" value={resident.group_number} onChange={e => setResident({...resident, group_number: e.target.value})} placeholder="Enter group number"/>
            <MyInput label="Date of Check-In" type="date" value={resident.date_of_check_in} onChange={e => setResident({...resident, date_of_check_in: e.target.value})}/>
            <MyInput label="Date of Check-Out" type="date" value={resident.date_of_check_out} onChange={e => setResident({...resident, date_of_check_out: e.target.value})} placeholder="Optional"/>
            <MyInput label="Email" value={resident.email} onChange={e => setResident({...resident, email: e.target.value})} placeholder="Enter email"/>
            <MyInput label="Status" value={resident.status} onChange={e => setResident({...resident, status: e.target.value})} placeholder="Enter status"/>
            <MyButton type="submit">Create Resident</MyButton>
        </form>
    );
};

export default ResidentForm;
