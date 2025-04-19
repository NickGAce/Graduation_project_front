import React, { useState } from 'react';
import classes from './MyInput.module.css';

const MyInputA = (props) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        // Определите вашу длину границы, например, 20 символов
        const boundaryLength = 20;

        if (value.length > boundaryLength) {
            // Добавляем перевод строки (\n) после достижения границы
            setInputValue(value.slice(0, boundaryLength) + '\n' + value.slice(boundaryLength));
        } else {
            setInputValue(value);
        }
    };

    return (
        <textarea
            className={classes.MyInput}
            value={inputValue}
            onChange={handleChange}
            {...props}
        />
    );
};

export default MyInputA;
