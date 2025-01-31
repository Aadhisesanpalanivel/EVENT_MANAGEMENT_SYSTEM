import React, { useEffect, useState } from 'react';
import { useEvents } from '../../context/EventContext';
import './DeleteEvents.css';

const DeleteEvents = () => {
    const { events, deleteEvent } = useEvents();
    const [eventList, setEventList] = useState([]);

    useEffect(() => {
        setEventList(events);
    }, [events]);

    const handleDelete = async (eventId) => {
        await deleteEvent(eventId);
        console.log('Event deleted:', eventId);
    };

    return (
        <div className="delete-events-container">
            <h2>Delete Events</h2>
            <ul>
                {eventList.map(event => (
                    <li key={event._id}>
                        {event.title} - {event.date} - {event.time}
                        <button onClick={() => handleDelete(event._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeleteEvents;
