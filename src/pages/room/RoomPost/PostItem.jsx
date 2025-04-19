
import axios from 'axios';
import MyButton from "../../../components/UI/button/MyButton";
import {useNavigate} from "react-router-dom";

const PostItem = (props) => {
    const response = useNavigate()
    // Функция для обновления данных в родительском компоненте после редактирования

    const handleDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/management/rooms/rooms/${props.post.id}`); // Замените URL на адрес вашего сервера
            props.remove(props.post);
        } catch (error) {
            console.error('Failed to delete RoomPost:', error);
        }
    };

    const handleBlockClick = () => {
        response('/resident_room/'+ props.post.id);
    };

    return (
        <div className="post">
            <div className="post__content">
                <strong>Номер комнаты: {props.post.room_number} (id комнаты: {props.post.id}) </strong>
                <div> Max Capacity: {props.post.max_capacity}</div>
                <div> Current Occupancy: {props.post.current_occupancy}</div>
                <div> Block: {props.post.block_name}</div>
                <div> Floor: {props.post.floor_number}</div>
            </div>


            <div className="post__btns">
                <div className="btn-container">

                    <MyButton onClick={handleBlockClick}>
                    Открыть
                    </MyButton>
                    <MyButton onClick={handleDelete}>
                        Удалить
                    </MyButton>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
