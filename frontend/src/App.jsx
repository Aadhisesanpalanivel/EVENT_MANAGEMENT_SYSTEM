import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar/Navbar';
import EventCalendar from './components/FunctionalComponents/EventCalendar';
import EventSearch from './components/FunctionalComponents/EventSearch';
import EventDetails from './components/FunctionalComponents/EventDetails';
import EventCreate from './components/ClassComponents/EventCreate';
import AddEvent from './components/FunctionalComponents/AddEvent';
import DeleteEvents from './components/FunctionalComponents/DeleteEvents';
import PrivateRoute from './components/Auth/PrivateRoute';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <EventProvider>
                    <div className="app">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                {/* Protected Routes */}
                                <Route path="/events" element={
                                    <PrivateRoute>
                                        <EventSearch />
                                    </PrivateRoute>
                                } />
                                <Route path="/calendar" element={
                                    <PrivateRoute>
                                        <EventCalendar />
                                    </PrivateRoute>
                                } />
                                <Route path="/events/create" element={
                                    <PrivateRoute>
                                        <EventCreate />
                                    </PrivateRoute>
                                } />
                                <Route path="/events/add" element={
                                    <PrivateRoute>
                                        <AddEvent />
                                    </PrivateRoute>
                                } />
                                <Route path="/events/delete" element={
                                    <PrivateRoute>
                                        <DeleteEvents />
                                    </PrivateRoute>
                                } />
                                <Route path="/events/:id" element={
                                    <PrivateRoute>
                                        <EventDetails />
                                    </PrivateRoute>
                                } />

                                {/* Default Route */}
                                <Route path="/" element={<Navigate to="/events/create" />} />

                                {/* Redirect root to events */}
                                <Route path="/" element={<Navigate to="/events" replace />} />
                            </Routes>
                        </main>
                    </div>
                </EventProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
