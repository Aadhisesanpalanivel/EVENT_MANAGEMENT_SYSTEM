import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({ id: '1', name: 'Test User' }); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate successful login
        setCurrentUser({ id: '1', name: 'Test User' });
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setCurrentUser({ ...user, token });
            setError(null);

            // Set default authorization header for all future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to register';
            setError(message);
            throw err;
        }
    };

    const logout = async () => {
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        error,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
