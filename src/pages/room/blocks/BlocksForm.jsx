import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyButton from '../../../components/UI/button/MyButton';
import MyInput from '../../../components/UI/input/MyInput';
import cl from './BlocksForm.module.css';

const BlocksForm = ({ modal }) => {
    const [floors, setFloors] = useState([]);
    const [selectedFloor, setSelectedFloor] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [newBlockName, setNewBlockName] = useState('');

    useEffect(() => {
        fetchFloors();
    }, [modal]);

    useEffect(() => {
        if (selectedFloor) {
            fetchBlocks(selectedFloor);
        } else {
            setBlocks([]);  // Очищаем список блоков, если нет выбранного этажа
        }
    }, [selectedFloor]);

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
            setBlocks(response.data.data || []);  // Устанавливаем блоки или пустой массив, если нет данных
        } catch (error) {
            console.error('Failed to fetch blocks:', error);
            setBlocks([]);  // Устанавливаем пустой список блоков в случае ошибки
        }
    };

    const addBlock = async () => {
        if (selectedFloor && newBlockName) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/management/blocks/blocks/', {
                    floor_id: selectedFloor,
                    block_name: newBlockName
                });
                setBlocks([...blocks, response.data.data]);
                setNewBlockName('');
            } catch (error) {
                console.error('Failed to add block:', error);
            }
        } else {
            alert('Please select a floor and enter a block name.');
        }
    };

    const deleteBlock = async (blockId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/management/blocks/blocks/${blockId}`);
            setBlocks(blocks.filter(block => block.id !== blockId));
        } catch (error) {
            console.error('Failed to delete block:', error);
        }
    };

    return (
        <div className={cl.blocksContainer}>
            <h1 className={cl.blocksHeader}>Manage Blocks</h1>
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
            <div className={cl.blockInputContainer}>
                <MyInput
                    value={newBlockName}
                    onChange={e => setNewBlockName(e.target.value)}
                    placeholder="Enter new block name"
                />
                <MyButton onClick={addBlock}>Add Block</MyButton>
            </div>
            {blocks.length > 0 && (
                <div>

                    <ul className={cl.blocksList}>
                        {blocks.map(block => (
                            <li key={block.id}>
                                {block.block_name}
                                <MyButton onClick={() => deleteBlock(block.id)} style={{ marginLeft: '10px' }}>
                                    Delete
                                </MyButton>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BlocksForm;
