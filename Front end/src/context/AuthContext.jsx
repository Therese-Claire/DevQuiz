import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for mock user session
        const storedUser = localStorage.getItem('devquiz_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Check for admin
        const role = userData.email === 'admin@dev.com' ? 'admin' : 'user';
        const userWithRole = { ...userData, role };

        setUser(userWithRole);
        localStorage.setItem('devquiz_user', JSON.stringify(userWithRole));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('devquiz_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
