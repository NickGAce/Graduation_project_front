import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditCommentModal from './EditCommentModal'; // Убедитесь, что компонент импортирован правильно
import "./comments.css";

const Comments = ({ roomId }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [editingComment, setEditingComment] = useState({ id: null, text: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/comments/room/${roomId}`);
                setComments(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
                setError('Failed to fetch comments.');
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [roomId]);

    const addComment = async () => {
        if (!newCommentText.trim()) {
            alert('Comment text cannot be empty.');
            return;
        }

        const requestBody = {
            room_id: roomId,
            text: newCommentText
        };

        try {
            const response = await axios.post(`http://localhost:8000/comments/`, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            const newComment = response.data.data;
            setComments(prev => [...prev, newComment]);
            setNewCommentText('');
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert(`Failed to add comment: ${error.response?.data?.detail || 'Unknown error'}`);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8000/comments/${commentId}`, { withCredentials: true });
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Failed to delete comment.');
        }
    };

    const openEditModal = (commentId, text) => {
        setEditingComment({ id: commentId, text });
        setIsEditModalOpen(true);
    };

    const saveEditedComment = async (text) => {
        try {
            const response = await axios.patch(`http://localhost:8000/comments/${editingComment.id}`, {
                text: text
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            const updatedComment = response.data.data;
            setComments(prev => prev.map(comment =>
                comment.id === editingComment.id ? updatedComment : comment
            ));
            setIsEditModalOpen(false);
            setEditingComment({ id: null, text: '' });
        } catch (error) {
            console.error('Failed to edit comment:', error);
            alert(`Failed to edit comment: ${error.response?.data?.detail || 'Unknown error'}`);
        }
    };

    const cancelEdit = () => {
        setIsEditModalOpen(false);
    };

    if (isLoading) return <p>Loading comments...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="comments">
            <h3>Comments</h3>
            <div className="comment-form">
                <textarea
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ whiteSpace: 'pre-wrap' }}
                ></textarea>
                <button onClick={addComment}>Add</button>
            </div>
            {comments.length === 0 ? <p>No comments yet.</p> : null}
            {comments.map(comment => (
                <div key={comment.id} className="comment-card">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{comment.text}</p>
                    <div className="comment-meta">
                        <span className="comment-date">Created: {new Date(comment.created_at).toLocaleDateString()} {new Date(comment.created_at).toLocaleTimeString()}</span>
                        <span className="comment-date">Updated: {new Date(comment.updated_at).toLocaleDateString()} {new Date(comment.updated_at).toLocaleTimeString()}</span>
                        <span className="comment-user">User ID: {comment.user_id}</span>
                    </div>
                    <div className="comment-actions">
                        <button onClick={() => deleteComment(comment.id)}>Delete</button>
                        <button onClick={() => openEditModal(comment.id, comment.text)}>Edit</button>
                    </div>
                </div>
            ))}
            <EditCommentModal
                isOpen={isEditModalOpen}
                commentText={editingComment.text}
                onSave={saveEditedComment}
                onCancel={cancelEdit}
            />
        </div>
    );
};

export default Comments;
