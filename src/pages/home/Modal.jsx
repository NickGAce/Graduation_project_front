import React from 'react';
import './Modal.css'

const ModalK = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalK;