import React, { useState, useEffect } from 'react';
import './EditCommentModal.css'; // Импорт стилей

const EditCommentModal = ({ isOpen, commentText, onSave, onCancel }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setText(commentText);  // Обновление состояния текста при открытии модального окна
        }
    }, [isOpen, commentText]);  // Зависимости: isOpen и commentText

    if (!isOpen) return null;

    return (
        <div className="edit-modal">
            <textarea
                className="edit-modal-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ whiteSpace: 'pre-wrap' }}
            ></textarea>
            <div className="edit-modal-buttons">
                <button className="edit-modal-button" onClick={() => onSave(text)}>Save</button>
                <button className="edit-modal-button" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default EditCommentModal;
