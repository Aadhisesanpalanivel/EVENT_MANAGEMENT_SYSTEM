import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import './EventList.css';

const EventList = () => {
    const { events, loading, error, fetchEvents } = useEvents();
    const { currentUser } = useAuth();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        if (filter === 'registered') {
            return matchesSearch && event.registeredParticipants.some(
                p => p.user._id === currentUser?.id
            );
        }
        if (filter === 'created') {
            return matchesSearch && event.createdBy?._id === currentUser?.id;
        }
        if (filter === 'upcoming') {
            return matchesSearch && new Date(event.date) > new Date();
        }
        return matchesSearch;
    });

    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="event-list-container">
            <div className="event-list-header">
                <h1>Events</h1>
                <Link to="/create-event" className="create-event-button">
                    Create Event
                </Link>
            </div>

            <div className="event-filters">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Events</option>
                    <option value="registered">Registered Events</option>
                    <option value="created">Created Events</option>
                    <option value="upcoming">Upcoming Events</option>
                </select>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="no-events">
                    <p>No events found.</p>
                </div>
            ) : (
                <div className="event-grid">
                    {filteredEvents.map(event => (
                        <Link to={`/event/${event._id}`} key={event._id} className="event-card">
                            <div className="event-card-content">
                                <h2>{event.name}</h2>
                                <p className="event-description">{event.description}</p>
                                
                                <div className="event-details">
                                    <div className="detail">
                                        <span className="icon">📅</span>
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="detail">
                                        <span className="icon">⏰</span>
                                        {event.time}
                                    </div>
                                    <div className="detail">
                                        <span className="icon">📍</span>
                                        {event.location}
                                    </div>
                                </div>

                                <div className="event-meta">
                                    <span className={`status ${event.status}`}>
                                        {event.status}
                                    </span>
                                    <span className="capacity">
                                        {event.registeredParticipants.length} / {event.capacity} spots
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
