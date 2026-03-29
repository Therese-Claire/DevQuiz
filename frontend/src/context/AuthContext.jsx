import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const hydrateUser = async (sessionUser) => {
            if (!sessionUser) {
                setUser(null);
                return;
            }
            let { data, error } = await supabase
                .from('users')
                .select('username, email, is_admin, total_score')
                .eq('id', sessionUser.id)
                .single();

            // If profile row is missing, handle gracefully (trigger should have created it)
            if (error) {
                console.warn('Profile sync delay or error:', error.message);
            }

            const role = data?.is_admin ? 'admin' : 'user';
            const hydrated = {
                ...sessionUser,
                username: data?.username || sessionUser.email?.split('@')[0] || 'User',
                email: data?.email || sessionUser.email,
                isAdmin: !!data?.is_admin,
                totalScore: data?.total_score || 0,
                role,
            };
            setUser(hydrated);
        };

        const init = async () => {
            const { data } = await supabase.auth.getSession();
            if (!isMounted) return;
            await hydrateUser(data.session?.user || null);
            setLoading(false);
        };
        init();

        const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
            await hydrateUser(session?.user || null);
            setLoading(false);
        });

        return () => {
            isMounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const logout = () => {
        supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
