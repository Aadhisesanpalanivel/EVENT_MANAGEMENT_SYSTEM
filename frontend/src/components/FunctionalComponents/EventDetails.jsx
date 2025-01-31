import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import './EventDetails.css';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { events, registerForEvent, unregisterFromEvent } = useEvents();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        console.log('Events:', events);
        console.log('Event ID:', id);
    }, [events, id]);

    const event = events.find(e => e._id === id);

    useEffect(() => {
        if (!event && !loading) {
            setError('Event not found');
        }
    }, [event, loading]);

    const isRegistered = event?.registeredParticipants?.some(
        p => p.user?._id === currentUser?.id
    );

    const isCreator = event?.createdBy?._id === currentUser?.id;
    const hasAvailableSpots = event?.registeredParticipants?.length < event?.capacity;

    const handleRegister = async () => {
        try {
            setLoading(true);
            await registerForEvent(event._id);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register for event');
        } finally {
            setLoading(false);
        }
    };

    const handleUnregister = async () => {
        try {
            setLoading(true);
            await unregisterFromEvent(event._id);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to unregister from event');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !event) {
        return <div className="loading">Loading event details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!event) {
        return <div className="error">Event not found</div>;
    }

    return (
        <div className="event-details-container">
            <div className="event-details-card">
                <h1>{event.name}</h1>
                
                <div className="event-info">
                    <div className="info-group">
                        <span className="label">Date:</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="info-group">
                        <span className="label">Time:</span>
                        <span>{event.time}</span>
                    </div>
                    
                    <div className="info-group">
                        <span className="label">Location:</span>
                        <span>{event.location}</span>
                    </div>
                    
                    <div className="info-group">
                        <span className="label">Category:</span>
                        <span>{event.category}</span>
                    </div>
                    
                    <div className="info-group">
                        <span className="label">Status:</span>
                        <span className={`status ${event.status}`}>{event.status}</span>
                    </div>
                    
                    <div className="info-group">
                        <span className="label">Capacity:</span>
                        <span>
                            {event.registeredParticipants.length} / {event.capacity} spots filled
                        </span>
                    </div>
                </div>

                <div className="description">
                    <h3>Description</h3>
                    <p>{event.description}</p>
                </div>

                {currentUser ? (
                    <div className="actions">
                        {!isCreator && (
                            isRegistered ? (
                                <button 
                                    onClick={handleUnregister}
                                    className="unregister-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Unregister'}
                                </button>
                            ) : (
                                <button 
                                    onClick={handleRegister}
                                    className="register-button"
                                    disabled={loading || !hasAvailableSpots}
                                >
                                    {loading ? 'Processing...' : 
                                     !hasAvailableSpots ? 'Event Full' : 'Register'}
                                </button>
                            )
                        )}
                    </div>
                ) : (
                    <p className="login-prompt">
                        Please <span onClick={() => navigate('/login')}>login</span> to register for this event.
                    </p>
                )}

                <div className="participants">
                    <h3>Registered Participants ({event.registeredParticipants.length})</h3>
                    {event.registeredParticipants.length > 0 ? (
                        <ul>
                            {event.registeredParticipants.map(participant => (
                                <li key={participant.user._id}>
                                    {participant.user.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No participants registered yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
