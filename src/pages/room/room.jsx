import React, { useEffect, useState } from "react";
import { usePost } from "../../hooks/usePost";
import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import MyButton from "../../components/UI/button/MyButton";
import MyModal from "../../components/UI/MyModal/MyModal";
import PostFilter from "./RoomPost/PostFilter";
import PostForm from "./RoomPost/PostForm";
import Loader from "../../components/UI/Loader/Loader";
import RoomList from "./RoomPost/RoomList";
import "./room.css";
import Floors from "./floors/Floors";
import Blocks from "./blocks/Blocks";
import Rooms from "./rooms/Rooms"

function Room() {
    const [originalPosts, setOriginalPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({ sort: 'room_number', query: '' });
    const [modal, setModal] = useState(false);
    const [isCreateDisabled, setIsCreateDisabled] = useState(false); // Управление доступностью кнопки Create
    const sortedAndSearchedPosts = usePost(posts, filter.sort, filter.query);

    const [fetchInitialPosts, isPostsLoading, postError] = useFetching(async () => {
        const fetchedPosts = await PostService.getAllRooms();
        setOriginalPosts(fetchedPosts);
        setPosts(fetchedPosts);
    });

    const fetchUpdatedRooms = async () => {
        try {
            const updatedRooms = await PostService.getUpdatedRooms();
            setPosts(updatedRooms);
            setIsCreateDisabled(true); // Блокируем кнопку Create
        } catch (error) {
            console.error('Failed to fetch updated rooms:', error);
        }
    };

    const resetToOriginalPosts = () => {
        setPosts(originalPosts);
        setIsCreateDisabled(false); // Разблокируем кнопку Create
    };

    useEffect(() => {
        fetchInitialPosts();
    }, []);

    const createPost = (newPost) => {
        setPosts(prevPosts => [...prevPosts, newPost]);
        setOriginalPosts(prevPosts => [...prevPosts, newPost]);
        setModal(false);
    };

    const removePost = (post) => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
        setOriginalPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
    };


    return (
        <div className="App">
            <div className="filter_content">
                <div className="filter_block ">
                    <PostFilter
                        filter={filter}
                        setFilter={setFilter}
                    />
                    {postError && <h1>ERROR: {postError}</h1>}
                </div>
                <div className="filter_block">

                    <MyModal visible={modal} setVisible={setModal}>
                        <PostForm create={createPost}/>
                    </MyModal>

                    <MyButton
                        style={{ width: '100%' }}
                        onClick={() => setModal(true)}
                        disabled={isCreateDisabled}
                        title={isCreateDisabled ? "Вы не можете сейчас создать новую комнату" : "Click to create a new room"}
                    >
                        Создать новую комнату
                    </MyButton>


                    <MyButton
                        onClick={fetchUpdatedRooms}
                        style={{marginTop: 10, width: '100%' }}
                        title="Загрузить свободные комнаты "
                    >
                        Свободные комнаты
                    </MyButton>
                    <MyButton
                        onClick={resetToOriginalPosts}
                        style={{marginTop: 10, width: '100%' }}
                        title="Показать все доступные комнаты"
                    >
                        Все комнаты
                    </MyButton>
                </div>
                <div className="filter_block">
                    <Floors/>
                    <Blocks/>
                    <Rooms/>
                </div>

            </div>
            <div className="content">
                {isPostsLoading ? (
                    <Loader/>
                ) : (
                    <RoomList posts={sortedAndSearchedPosts} remove={removePost}  title="Rooms"/>
                )}
            </div>
        </div>
    );
}

export default Room;
