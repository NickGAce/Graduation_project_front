import React, { useState } from 'react';
import axios from 'axios';
import MyButton from "../../../components/UI/button/MyButton";
import { useNavigate } from "react-router-dom";
import MyModal from "../../../components/UI/MyModal/MyModal";
import EditForm from "../ResidentPost/EditForm/EditForm";
import CheckInResident from "./checkInResident/checkInResident";
import Resettlement from "./Resettlement/Resettlement";

const ResidentItem = (props) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // Добавляем состояние для аккордеона
    const [modal, setModal] = useState(false);
    const [checkIn, setCheckIn] = useState(false);
    const [resettlement, setResettlement] = useState(false);
    const toggleDetails = () => {
        setIsOpen(!isOpen); // Переключение видимости деталей
    };

    const handleUpdate = (updatedData) => {
        // Обновляем данные в родительском компоненте
        props.update(updatedData);
        setModal(false)
        setCheckIn(false)
        setResettlement(false)
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/management/residents/residents/${props.post.id}`);
            props.remove(props.post);
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };


    return (
        <div className="resident_wraper">
            <div className="post__content" onClick={toggleDetails}>
                <strong>{props.post.full_name} (ID: {props.post.id})</strong>
                {isOpen && ( // Контент аккордеона показывается только когда isOpen true
                    <>
                        <p><span className="label">Gender:</span> {props.post.gender}</p>
                        <p><span className="label">Citizenship:</span> {props.post.citizenship}</p>
                        <p><span className="label">Role:</span> {props.post.role}</p>
                        <p><span className="label">Faculty:</span> {props.post.faculty || 'N/A'}</p>
                        <p><span className="label">Group Number:</span> {props.post.group_number || 'N/A'}</p>
                        <p><span className="label">Email:</span> {props.post.email}</p>
                        <p><span className="label">Status:</span> {props.post.status}</p>
                        <p><span className="label">Room ID:</span> {props.post.room_id}</p>
                        <p><span className="label">Date of Check-In:</span> {props.post.date_of_check_in}</p>
                        <p><span className="label">Date of Check-Out:</span> {props.post.date_of_check_out || 'N/A'}</p>
                    </>
                )}
            </div>

            <MyModal visible={modal} setVisible={setModal}>
                <EditForm post={props.post} onUpdate={handleUpdate} />
            </MyModal>

            <MyModal visible={checkIn} setVisible={setCheckIn}>
                <CheckInResident post={props.post} onUpdate={handleUpdate}/>
            </MyModal>

            <MyModal visible={resettlement} setVisible={setResettlement}>
                <Resettlement post={props.post} onUpdate={handleUpdate}/>
            </MyModal>


            <div className="post__btns">
                <div className="btn-container">
                    {props.post.room_id ? (
                        <MyButton onClick={() => navigate('/resident_room/' + props.post.room_id)}>
                            Открыть
                        </MyButton>
                    ) : (
                        <div>

                        </div>
                    )}

                    {props.post.room_id ? (
                        <MyButton onClick={() => setResettlement(true)}>
                            Переселить
                        </MyButton>
                    ) : (
                        <MyButton onClick={() => setCheckIn(true)}>
                            Заселить
                        </MyButton>
                    )}

                    <MyButton onClick={() => setModal(true)}>
                        Редактировать
                    </MyButton>

                    <MyButton onClick={handleDelete}>
                    Удалить
                    </MyButton>
                </div>
            </div>
        </div>
    );
};

export default ResidentItem;
