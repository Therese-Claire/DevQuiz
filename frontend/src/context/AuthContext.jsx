import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for mock user session
        const storedUser = localStorage.getItem('devquiz_user');
        const storedToken = localStorage.getItem('devquiz_token');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const hydratedUser = storedToken ? { ...parsedUser, token: storedToken } : parsedUser;
            setUser(hydratedUser);
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        const role = userData.isAdmin ? 'admin' : 'user';
        const userWithRole = { ...userData, role, ...(token ? { token } : {}) };

        setUser(userWithRole);
        localStorage.setItem('devquiz_user', JSON.stringify(userWithRole));
        if (token) localStorage.setItem('devquiz_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('devquiz_user');
        localStorage.removeItem('devquiz_token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
