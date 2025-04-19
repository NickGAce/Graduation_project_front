import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./roomResident.css";
import MyModal from "../../components/UI/MyModal/MyModal";
import Resettlement from "../Resident/ResidentPost/Resettlement/Resettlement";
import Comments from "./comments/Comments";
import ResidentRating from "./ResidentRating/ResidentRating";

const RoomResident = () => {
    const { id } = useParams();
    const [roomDetails, setRoomDetails] = useState({});
    const [residents, setResidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resettlementVisible, setResettlementVisible] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const capacityPercentage = (roomDetails.current_occupancy / roomDetails.max_capacity) * 100;

    useEffect(() => {
        const fetchRoomDetails = async () => {
            setIsLoading(true);
            try {
                const [roomRes, residentsRes] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/management/rooms/rooms/${id}`),
                    axios.get(`http://127.0.0.1:8000/management/rooms/${id}/residents`)
                ]);
                setRoomDetails(roomRes.data.data);
                setResidents(residentsRes.data.data || []);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchRoomDetails();
    }, [id]);

    const evictResident = async (residentId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/management/residents/residents/${residentId}`, {
                room_id: null
            });
            setResidents(residents.filter(res => res.id !== residentId)); // Обновляем состояние, убирая выселенного жильца
        } catch (error) {
            console.error('Failed to evict resident:', error);
            alert('Failed to evict resident.');
        }
    };

    const handleResettlement = (resident) => {
        if (!resident) {
            console.error("No resident data available for resettlement.");
            return;
        }
        setSelectedResident(resident);
        setResettlementVisible(true);
    };


    const handleUpdate = (updatedResident) => {
        // Удаление жителя из списка после его переселения
        const filteredResidents = residents.filter(resident => resident.id !== updatedResident.id);
        setResidents(filteredResidents);
        setResettlementVisible(false);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="wrapper_room_resident">

            {/* Block 1: Room Information */}
            <div className="room_info">
                <div className="room_info_item">
                    <span className="room_info_label">Floor:</span>
                    <span>{roomDetails.floor_number}</span>
                </div>
                <div className="room_info_item">
                    <span className="room_info_label">Block:</span>
                    <span>{roomDetails.block_name}</span>
                </div>
                <div className="room_info_item">
                    <span className="room_info_label">Room Number:</span>
                    <span>{roomDetails.room_number}</span>
                </div>
                <div className="room_info_item">
                    <span className="room_info_label">Max Capacity:</span>
                    <span>{roomDetails.max_capacity}</span>
                </div>
                <div className="room_info_item">
                    <span className="room_info_label">Current Occupancy:</span>
                    <div className="capacity_bar">
                        <div className="capacity_fill" style={{width: `${capacityPercentage}%`}}></div>
                        <div className="snap_indicator" style={{left: `${capacityPercentage}%`}}>
                            {roomDetails.current_occupancy}
                        </div>
                    </div>
                </div>
            </div>
            {/* Block 2: Residents List */}
            <div className="residents_list">
                {residents.length > 0 ? (
                    residents.map(resident => (
                    <div key={resident.id} className="resident_card">
                        <div className="resident_card_content">
                            <h3 className="highlight">{resident.full_name}</h3>
                            <p><span className="resident_card_label">Gender:</span> {resident.gender}</p>
                            <p><span className="resident_card_label">Role:</span> {resident.role}</p>
                            <p><span className="resident_card_label">Citizenship:</span> {resident.citizenship}</p>
                            <p><span className="resident_card_label">Email:</span> {resident.email}</p>
                            <p><span className="resident_card_label">Faculty:</span> {resident.faculty}</p>
                            <p><span className="resident_card_label">Group Number:</span> {resident.group_number}</p>
                            <p><span
                                className="resident_card_label">Date of Check-In:</span> {resident.date_of_check_in}</p>
                            <p><span
                                className="resident_card_label">Date of Check-Out:</span> {resident.date_of_check_out}
                            </p>
                            <p><span className="resident_card_label">Status:</span> {resident.status}</p>

                            <div className="ratings">
                                <ResidentRating residentId={resident.id}/>

                            </div>
                        </div>

                        <div className="resident_card_actions">
                            <button className="resident_action_button"
                                    onClick={() => handleResettlement(resident)}>Переселить
                            </button>
                            <button className="resident_action_button" onClick={() => evictResident(resident.id)}>
                                Выселить из комнаты
                            </button>

                            <MyModal visible={resettlementVisible && selectedResident !== null}
                                     setVisible={setResettlementVisible}>
                                {selectedResident && <Resettlement post={selectedResident} onUpdate={handleUpdate}/>}
                            </MyModal>
                        </div>
                    </div>
                )) ) : (
                    <p className="no_residents_notice">В этой комнате пока нет студентов.</p>
                )}
            </div>
            {/* Block 3: Comments */}
            <div className="comments_section">
                <Comments roomId={id}/>
            </div>
        </div>
    );
};

export default RoomResident;
