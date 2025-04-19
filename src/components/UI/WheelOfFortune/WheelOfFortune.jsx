import React, { useState } from 'react';
import './WheelOfFortune.css';

const sectors = [
    { color: '#80cbc4', label: 'Да' },
    { color: '#4db6ac', label: 'Нет' },
    { color: '#80cbc4', label: 'Возможно' },
    { color: '#4db6ac', label: 'Скорее нет' },
    { color: '#80cbc4', label: 'Скорее да' },
    { color: '#4db6ac', label: 'Потом' },
];

const WheelOfFortune = () => {
    const [rotation, setRotation] = useState(0);

    const spin = () => {
        const newDegrees = Math.random() * 360 + (360 * Math.random())+720; // Гарантирует минимум 2 полных вращения|
        console.log(newDegrees)
        setRotation(rotation + newDegrees);
    };

    return (
        <div className='wheel-container'>
            {/* Добавляем курсор в углу контейнера */}
            <div className="cursor"></div>
            <svg width="300" height="300" viewBox="0 0 100 100" className='wheel' style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 3s ease-out' }}>
                {sectors.map((sector, index) => {
                    const angle = 360 / sectors.length * index;
                    const textAngle = angle + 360 / sectors.length / 2 - 90;
                    const x = 50 + 30 * Math.cos(Math.PI / 180 * (textAngle + 90));
                    const y = 50 + 30 * Math.sin(Math.PI / 180 * (textAngle + 90));

                    return (
                        <g key={index}>
                            <path d={`M50,50 L ${50 + 50 * Math.cos(Math.PI / 180 * angle)} ${50 + 50 * Math.sin(Math.PI / 180 * angle)} A 50 50 0 ${360 / sectors.length > 180 ? 1 : 0} 1 ${50 + 50 * Math.cos(Math.PI / 180 * (angle + 360 / sectors.length))} ${50 + 50 * Math.sin(Math.PI / 180 * (angle + 360 / sectors.length))} Z`} fill={sector.color} />
                            <text x={x} y={y} fill="white" transform={`rotate(${textAngle + 90}, ${x}, ${y})`} textAnchor="middle" fontSize="5" alignmentBaseline="middle">{sector.label}</text>
                        </g>
                    );
                })}
            </svg>
            <button onClick={spin} className='spin-button'>Spin</button>
        </div>
    );
};

export default WheelOfFortune;
