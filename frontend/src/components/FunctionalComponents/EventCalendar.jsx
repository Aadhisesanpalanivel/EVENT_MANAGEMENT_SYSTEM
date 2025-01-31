import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEvents } from '../../context/EventContext';
import { useNavigate } from 'react-router-dom';
import './EventCalendar.css';

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
    const { events, loading, error, fetchEvents } = useEvents();
    const navigate = useNavigate();
    const [view, setView] = useState('month');
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (events) {
            let filtered = events;

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

            // Format events for calendar
            const formattedEvents = filtered.map(event => ({
                id: event._id,
                title: event.title,
                start: new Date(event.date + 'T' + event.time),
                end: moment(event.date + 'T' + event.time).add(1, 'hours').toDate(),
                resource: event
            }));

            setFilteredEvents(formattedEvents);
        }
    }, [events, searchTerm, selectedCategory]);

    const handleEventClick = event => {
        navigate(`/events/${event.id}`);
    };

    const handleViewChange = newView => {
        setView(newView);
    };

    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="calendar-container">
            <div className="calendar-filters">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="all">All Categories</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Social">Social</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                view={view}
                onView={handleViewChange}
                onSelectEvent={handleEventClick}
                eventPropGetter={event => ({
                    className: `event-${event.resource.status}`,
                    style: {
                        backgroundColor: event.resource.status === 'upcoming' ? '#4CAF50' :
                                      event.resource.status === 'ongoing' ? '#2196F3' :
                                      event.resource.status === 'completed' ? '#9E9E9E' : '#F44336'
                    }
                })}
                popup
                tooltipAccessor={event => `
                    ${event.title}
                    Location: ${event.resource.location}
                    Status: ${event.resource.status}
                `}
            />
        </div>
    );
};

export default EventCalendar;
