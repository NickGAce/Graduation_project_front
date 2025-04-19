import React, {useEffect, useState} from 'react';
import axios from 'axios';
import MyButton from "../../../../components/UI/button/MyButton";
import cl from './EditForm.module.css';

const EditForm = ({ post, onUpdate }) => {
    const [formData, setFormData] = useState({
        id: post.id || '',
        full_name: post.full_name || '',
        gender: post.gender || '',
        citizenship: post.citizenship || '',
        role: post.role || '',
        faculty: post.faculty || '',
        group_number: post.group_number || '',
        date_of_check_in: post.date_of_check_in || '',
        date_of_check_out: post.room_id ? post.date_of_check_out : '',  // Only initialize if room_id is not null
        room_id: post.room_id || '',
        email: post.email || '',
        status: post.status || ''
    });

    useEffect(() => {
        setFormData({
            id: post.id || '',
            full_name: post.full_name || '',
            gender: post.gender || '',
            citizenship: post.citizenship || '',
            role: post.role || '',
            faculty: post.faculty || '',
            group_number: post.group_number || '',
            date_of_check_in: post.date_of_check_in || '',
            date_of_check_out: post.room_id ? post.date_of_check_out : '',
            room_id: post.room_id || '',
            email: post.email || '',
            status: post.status || ''
        });
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure we don't send null values if room_id was originally null
        const dataToSend = {
            ...formData,
            date_of_check_out: post.room_id ? formData.date_of_check_out : null,
            room_id: post.room_id ? formData.room_id : null
        };

        try {
            await axios.patch(`http://127.0.0.1:8000/management/residents/residents/${post.id}`, dataToSend);
            onUpdate(dataToSend);  // Update the parent component with the new data
        } catch (error) {
            console.error('Failed to update resident:', error);
        }
    };

    return (
        <form className={cl.postForm} onSubmit={handleSubmit}>
            {['full_name', 'gender', 'citizenship', 'role', 'faculty', 'group_number', 'email', 'status'].map(field => (
                <div key={field} className={cl.formGroup}>
                    <label htmlFor={field}>{field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                    <input type="text" id={field} name={field} value={formData[field]} onChange={handleChange} className={cl.input} />
                </div>
            ))}
            <div className={cl.formGroup}>
                <label htmlFor="date_of_check_in">Date of Check-In:</label>
                <input type="date" id="date_of_check_in" name="date_of_check_in" value={formData.date_of_check_in} onChange={handleChange} className={cl.input} />
            </div>
            {post.room_id && (
                <>
                    <div className={cl.formGroup}>
                        <label htmlFor="date_of_check_out">Date of Check-Out:</label>
                        <input type="date" id="date_of_check_out" name="date_of_check_out"
                               value={formData.date_of_check_out} onChange={handleChange} className={cl.input}/>
                    </div>
                </>
            )}
            <MyButton type="submit" className={cl.submitButton}>
                Save Changes
            </MyButton>
        </form>
    );
};

export default EditForm;
