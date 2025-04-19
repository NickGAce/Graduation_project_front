import React, { useEffect, useState } from "react";
import { usePost } from "../../hooks/usePost";
import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import MyButton from "../../components/UI/button/MyButton";
import MyModal from "../../components/UI/MyModal/MyModal";
import ResidentFilter from "./ResidentPost/ResidentFilter";
import PostForm from "./ResidentPost/ResidentForm";
import Loader from "../../components/UI/Loader/Loader";
import ResidentList from "./ResidentPost/ResidentList";
import "./resident.css";

function Resident() {
    const [originalPosts, setOriginalPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState({ sort: '', query: '' });
    const [modal, setModal] = useState(false);
    const [isCreateDisabled, setIsCreateDisabled] = useState(false); // Управление доступностью кнопки Create
    const sortedAndSearchedPosts = usePost(posts, filter.sort, filter.query);

    const [modalDetailsVisible, setModalDetailsVisible] = useState(false);

    const [fetchInitialPosts, isPostsLoading, postError] = useFetching(async () => {
        const fetchedPosts = await PostService.getAllResidents();
        setOriginalPosts(fetchedPosts);
        setPosts(fetchedPosts);
    });

    const fetchUpdatedRooms = async () => {
        try {
            const updatedRooms = await PostService.getResidentsNoRoom();
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

    const updatePost = (updatedPost) => {
        // Обновление массива posts
        const updatedPosts = posts.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        );
        setPosts(updatedPosts);

        // Обновление массива originalPosts
        const updatedOriginalPosts = originalPosts.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        );
        setOriginalPosts(updatedOriginalPosts);
    };


    return (
        <div className="App">
            <div className="filter_content">
                <div className="filter_block">
                    <ResidentFilter
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
                        style={{marginTop: 10, width: '100%' }}
                        onClick={() => setModal(true)}
                        disabled={isCreateDisabled}
                        title={isCreateDisabled ? "Вы не можете сейчас создать нового жильца" : "Click to create a new resident"}
                    >
                        Создать жильца
                    </MyButton>


                    <MyButton
                        onClick={fetchUpdatedRooms}
                        style={{marginTop: 10, width: '100%' }}
                        title="Показать всех жильцов на заселение"
                    >
                        Жильцы на заселение
                    </MyButton>
                    <MyButton

                        onClick={resetToOriginalPosts}
                        style={{marginTop: 10, width: '100%' }}
                        title="Показать всех жильцов"
                    >
                        Все жильцы
                    </MyButton>
                </div>

            </div>
            <div className="content">
                {isPostsLoading ? (
                    <Loader/>
                ) : (
                    <ResidentList posts={sortedAndSearchedPosts} update={updatePost} remove={removePost}  title="Resident"/>
                )}
            </div>
        </div>
    );
}

export default Resident;
