import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const EventContext = createContext();

export const useEvents = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventProvider');
    }
    return context;
};

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const fetchEvents = async () => {
        try {
            setLoading(true);
            console.log('Fetching events...');
            const response = await axios.get('http://localhost:5000/api/events');
            console.log('Events fetched:', response.data);
            setEvents(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.response?.data?.message || 'Failed to fetch events');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const createEvent = async (eventData) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Ensure all required fields are present
            if (!eventData.title || !eventData.date || !eventData.time || !eventData.location || !eventData.category || !eventData.description) {
                throw new Error('All fields are required.');
            }

            const response = await axios.post(
                'http://localhost:5000/api/events',
                eventData,
                config
            );

            setEvents(prevEvents => [...prevEvents, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error adding event:', err);
            setError('Failed to create event: ' + (err.response?.data?.message || err.message));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerForEvent = async (eventId) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${currentUser?.token}`
                }
            };

            const response = await axios.post(
                `http://localhost:5000/api/events/${eventId}/register`,
                {},
                config
            );

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId ? response.data : event
                )
            );

            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const unregisterFromEvent = async (eventId) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${currentUser?.token}`
                }
            };

            const response = await axios.post(
                `http://localhost:5000/api/events/${eventId}/unregister`,
                {},
                config
            );

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId ? response.data : event
                )
            );

            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const updateEvent = async (eventId, eventData) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser?.token}`
                }
            };

            const response = await axios.put(
                `http://localhost:5000/api/events/${eventId}`,
                eventData,
                config
            );

            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event._id === eventId ? response.data : event
                )
            );

            return response.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Authorization': `Bearer ${currentUser?.token}`
                }
            };

            await axios.delete(
                `http://localhost:5000/api/events/${eventId}`,
                config
            );

            setEvents(prevEvents =>
                prevEvents.filter(event => event._id !== eventId)
            );
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getUserEvents = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Authorization': `Bearer ${currentUser?.token}`
                }
            };

            const response = await axios.get(
                'http://localhost:5000/api/events/user',
                config
            );

            return response.data;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        unregisterFromEvent,
        getUserEvents
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};

export default EventContext;
