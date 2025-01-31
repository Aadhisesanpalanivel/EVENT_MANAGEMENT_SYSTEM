import React, { useState, useEffect } from 'react';
import { useEvents } from '../../context/EventContext';
import { useNavigate } from 'react-router-dom';
import './EventSearch.css';

const EventSearch = () => {
    const { events, loading, error, fetchEvents } = useEvents();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [sortBy, setSortBy] = useState('date');

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (events) {
            let filtered = [...events];

            // Apply search filter
            if (searchTerm) {
                filtered = filtered.filter(event =>
                    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    event.location.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply category filter
            if (selectedCategory !== 'all') {
                filtered = filtered.filter(event => event.category === selectedCategory);
            }

            // Apply date filter
            if (selectedDate) {
                const selectedDateStr = new Date(selectedDate).toDateString();
                filtered = filtered.filter(event => 
                    new Date(event.date).toDateString() === selectedDateStr
                );
            }

            // Apply sorting
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case 'date':
                        return new Date(a.date) - new Date(b.date);
                    case 'title':
                        return a.title.localeCompare(b.title);
                    case 'capacity':
                        return b.capacity - a.capacity;
                    default:
                        return 0;
                }
            });

            setFilteredEvents(filtered);
        }
    }, [events, searchTerm, selectedCategory, selectedDate, sortBy]);

    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="event-search-container">
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="all">All Categories</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Social">Social</option>
                    <option value="Other">Other</option>
                </select>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-input"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="capacity">Sort by Capacity</option>
                </select>
            </div>

            <div className="events-grid">
                {filteredEvents.length === 0 ? (
                    <div className="no-events">No events found</div>
                ) : (
                    filteredEvents.map(event => (
                        <div
                            key={event._id}
                            className={`event-card ${event.status}`}
                            onClick={() => handleEventClick(event._id)}
                        >
                            <div className="event-image">
                                <img src={event.image || '/default-event-image.jpg'} alt={event.title} />
                                <div className="event-status">{event.status}</div>
                            </div>
                            <div className="event-details">
                                <h3>{event.title}</h3>
                                <p className="event-date">
                                    {new Date(event.date).toLocaleDateString()} at {event.time}
                                </p>
                                <p className="event-location">{event.location}</p>
                                <div className="event-capacity">
                                    <span className="available-spots">
                                        {event.availableSpots} spots left
                                    </span>
                                    <span className="category-tag">{event.category}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventSearch;
