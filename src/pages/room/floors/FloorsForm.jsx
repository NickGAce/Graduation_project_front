import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyButton from '../../../components/UI/button/MyButton';
import MyInput from '../../../components/UI/input/MyInput';
import cl from './FloorsForm.module.css'; // Импорт стилей

const FloorsForm = ({ modal }) => {
    const [floors, setFloors] = useState([]);
    const [newFloorNumber, setNewFloorNumber] = useState('');

    useEffect(() => {
        fetchFloors();
    }, [modal]);

    const fetchFloors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/management/floors/floors/');
            setFloors(response.data.data);
        } catch (error) {
            console.error('Failed to fetch floors:', error);
        }
    };

    const addFloor = async () => {
        if (newFloorNumber) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/management/floors/floors/', {
                    floor_number: newFloorNumber
                });
                setFloors([...floors, response.data.data]);
                setNewFloorNumber('');
            } catch (error) {
                console.error('Failed to add floor:', error);
            }
        } else {
            alert('Please enter a floor number.');
        }
    };

    const deleteFloor = async (floorId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/management/floors/floors/${floorId}`);
            setFloors(floors.filter(floor => floor.id !== floorId)); // Обновляем список этажей
        } catch (error) {
            console.error('Failed to delete floor:', error);
        }
    };

    return (
        <div className={cl.floorsContainer}>
            <h1 className={cl.floorsHeader}>Manage Floors</h1>
            <div className={cl.floorInputContainer}>
                <MyInput
                    value={newFloorNumber}
                    onChange={(e) => setNewFloorNumber(e.target.value)}
                    placeholder="Enter new floor number"
                    type="number"
                />
                <MyButton onClick={addFloor}>Add Floor</MyButton>
            </div>
            <div>
                <h2>Existing Floors</h2>
                <ul className={cl.floorsList}>
                    {floors.map((floor) => (
                        <li key={floor.id}>
                            Floor {floor.floor_number}
                            <MyButton onClick={() => deleteFloor(floor.id)} style={{ marginLeft: '10px' }}>
                                Delete
                            </MyButton>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FloorsForm;

