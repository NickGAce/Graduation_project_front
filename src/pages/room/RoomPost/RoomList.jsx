import React from 'react';
import PostItem from "./PostItem";
import {TransitionGroup, CSSTransition} from "react-transition-group";

const RoomList = ({posts, title, remove}) => {
    if(!posts.length){
        return (
            <div className="not-found-message">
                <h2>Посты не найдены</h2>
            </div>

        )
    }
    return (
        <div>
            <h1 style={{textAlign: 'center'}}>
                {title}
            </h1>
            <TransitionGroup>
                {posts.map((post, index)=>
                    <CSSTransition
                        key={post.id}
                        timeout={500}
                        classNames="post"
                    >
                        <PostItem remove={remove}  number={index+1} post={post}/>
                    </CSSTransition>

                )}
            </TransitionGroup>

        </div>
    );
};

export default RoomList;