import React, { useState, useEffect } from 'react';
import MyInput from '../../../components/UI/input/MyInput';
import MyButton from '../../../components/UI/button/MyButton';
import cl from './PostForm.module.css';
import PostService from "../../../API/PostService";

const PostForm = ({ create }) => {
    const [post, setPost] = useState({
        floor_id: '',
        block_id: '',
        room_number: '',
        max_capacity: '',
        current_occupancy: ''
    });

    const [floors, setFloors] = useState([]);
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        PostService.getAllFloors()
            .then(floors => setFloors(floors))
            .catch(error => console.error('Failed to fetch floors:', error));
    }, [create]);

    useEffect(() => {
        if (post.floor_id) {
            PostService.getBlocksByFloorId(post.floor_id)
                .then(blocks => {
                    if (blocks.length > 0) {
                        setBlocks(blocks);
                    } else {
                        setBlocks([]); // Если на этаже нет блоков, устанавливаем пустой массив
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch blocks:', error);
                    setBlocks([]); // Обработка случая, когда на этаже нет блоков
                });
        } else {
            setBlocks([]);
        }
    }, [post.floor_id, create]);

    const addNewPost = async (e) => {
        e.preventDefault();
        try {
            const newRoom = await PostService.createRoom(post);

            // Приводим ID к числу для корректного сравнения
            const blockId = Number(post.block_id);
            const floorId = Number(post.floor_id);

            // Ищем block и floor с использованием приведенных значений
            const block = blocks.find(b => b.id === blockId);
            const floor = floors.find(f => f.id === floorId);

            // Обогащаем данные newRoom новыми полями
            const enrichedRoom = {
                ...newRoom,
                block_name: block ? block.block_name : '', // Указываем имя блока, если блок найден
                floor_number: floor ? floor.floor_number : '' // Указываем номер этажа, если этаж найден
            };

            // Используем обогащённый объект для обновления состояния
            create(enrichedRoom);

            setPost({
                floor_id: '',
                block_id: '',
                room_number: '',
                max_capacity: '',
                current_occupancy: ''
            });
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    return (
        <form className={cl.postForm}>
            <div className={cl.formGroup}>
                <label htmlFor="floor_id">Floor:</label>
                <div className="select-container">
                    <select
                        id="floor_id"
                        value={post.floor_id}
                        onChange={e => setPost({...post, floor_id: e.target.value, block_id: ''})}
                        className="select"
                    >
                        <option value="">Select floor</option>
                        {floors.map(floor => (
                            <option key={floor.id} value={floor.id}>Этаж {floor.floor_number}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={cl.formGroup}>
                <label htmlFor="block_id">Block:</label>
                <div className="select-container">
                    <select
                        id="block_id"
                        value={post.block_id}
                        onChange={e => setPost({...post, block_id: e.target.value})}
                        className="select"
                        disabled={!post.floor_id || blocks.length === 0}
                    >
                        <option value="">Select block</option>
                        {blocks.map(block => (
                            <option key={block.id} value={block.id}>{block.block_name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={cl.formGroup}>
                <MyInput label="Room Number" type="number" id="room_number" value={post.room_number}
                         onChange={e => setPost({...post, room_number: e.target.value})}
                         placeholder="Enter room number"/>
            </div>
            <div className={cl.formGroup}>
                <MyInput label="Max Capacity" type="number" id="max_capacity" value={post.max_capacity}
                         onChange={e => setPost({...post, max_capacity: e.target.value})}
                         placeholder="Enter max capacity"/>
            </div>
            <div className={cl.formGroup}>
                <MyInput label="Current Occupancy" type="number" id="current_occupancy" value={post.current_occupancy}
                         onChange={e => setPost({...post, current_occupancy: e.target.value})}
                         placeholder="Enter current occupancy"/>
            </div>
            <div className={cl.formGroup}>
                <MyButton onClick={addNewPost}>Create Room</MyButton>
            </div>
        </form>
    );
};

export default PostForm;
