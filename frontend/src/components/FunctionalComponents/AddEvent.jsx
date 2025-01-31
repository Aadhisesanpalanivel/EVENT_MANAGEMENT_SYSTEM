import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import './AddEvent.css';

const AddEvent = () => {
    const { createEvent } = useEvents();
    const [eventData, setEventData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        category: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting event data:', eventData); 
        await createEvent(eventData);
        console.log('Event added:', eventData);
        // Clear form after submission
        setEventData({
            title: '',
            date: '',
            time: '',
            location: '',
            category: '',
            description: ''
        });
    };

    return (
        <div className="add-event-container">
            <h2>Add Event</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Event Title" value={eventData.title} onChange={handleChange} required />
                <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
                <input type="time" name="time" value={eventData.time} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" value={eventData.location} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={eventData.category} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={eventData.description} onChange={handleChange} required></textarea>
                <button type="submit">Add Event</button>
            </form>
        </div>
    );
};

export default AddEvent;
