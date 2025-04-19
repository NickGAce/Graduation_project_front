import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import './style.css';
import ModalK from "./Modal";

const Home = () => {
    const calendarRef = useRef(null);
    const calendarInstanceRef = useRef(null); // Для инстанса календаря
    let calendar;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);



    useEffect(() => {
        const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
        calendarInstanceRef.current = new Calendar(calendarRef.current, {
            plugins: [multiMonthPlugin, interactionPlugin],
            initialView: 'multiMonthYear',
            multiMonthMinWidth: 300,
            height: '770px',
            contentHeight: 'auto',
            events: events,
            eventClick: handleEventClick,
            dateClick: handleDateClick
        });
        calendarInstanceRef.current.render();
        return () => calendarInstanceRef.current.destroy();
    }, []);

    const handleEventClick = (info) => {
        setSelectedEvent({
            title: info.event.title,
            id: info.event.id,
            start: info.event.start.toISOString().substring(0, 10)
        });
        setModalOpen(true);
    };

    const handleDateClick = (arg) => {
        const newEventTitle = prompt('Введите название нового события:');
        if (newEventTitle) {
            const newEvent = {
                id: Date.now().toString(), // Уникальный идентификатор
                title: newEventTitle,
                start: arg.date,
                allDay: true
            };
            // Используйте calendarInstanceRef.current для доступа к методам Calendar
            calendarInstanceRef.current.addEvent(newEvent);
            updateLocalStorage();
        }
    };

    const deleteEvent = () => {
        calendarInstanceRef.current.getEventById(selectedEvent.id).remove();
        updateLocalStorage();
        setModalOpen(false);
    };

    const updateLocalStorage = () => {
        const events = calendarInstanceRef.current.getEvents().map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            allDay: event.allDay
        }));
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    };


    return (
        <div className="home-container">
            <div ref={calendarRef} />
            <ModalK isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h2>Событие: {selectedEvent?.title}</h2>
                <p>Дата начала: {selectedEvent?.start}</p>
                <button onClick={deleteEvent}>Удалить событие</button>
            </ModalK>
        </div>
    );
};

export default Home;
