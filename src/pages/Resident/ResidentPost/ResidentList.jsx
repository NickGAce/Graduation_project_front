import React from 'react';
import ResidentItem from "./ResidentItem";
import {TransitionGroup, CSSTransition} from "react-transition-group";

const ResidentList = ({posts, title, remove, update}) => {
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
                        <ResidentItem remove={remove} update={update}  number={index+1} post={post}/>
                    </CSSTransition>

                )}
            </TransitionGroup>

        </div>
    );
};

export default ResidentList;