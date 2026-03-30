import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const hydrateUser = async (sessionUser) => {
        if (!sessionUser) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const { data: profile } = await supabase
                .from('users')
                .select('username, email, is_admin')
                .eq('id', sessionUser.id)
                .single();

            let statsData = {};
            try {
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_stats', { user_uuid: sessionUser.id });
                if (!rpcError) statsData = rpcData || {};
            } catch (_) { /* non-critical */ }

            setUser({
                ...sessionUser,
                username: profile?.username || sessionUser.email?.split('@')[0] || 'User',
                email: profile?.email || sessionUser.email,
                isAdmin: !!profile?.is_admin,
                totalScore: statsData.score || 0,
                percentile: statsData.percentile || 0,
                rank: statsData.rank || 0,
                role: profile?.is_admin ? 'admin' : 'user',
            });
        } catch (err) {
            console.error('Auth hydration error:', err);
            setUser({ ...sessionUser, role: 'user', username: sessionUser.email?.split('@')[0] });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        let initialized = false;

        // Safety timeout: always exit loading after 5s even if Supabase hangs
        const safetyTimer = setTimeout(() => {
            if (isMounted && !initialized) {
                console.warn('Auth init timed out – forcing ready state');
                setLoading(false);
            }
        }, 5000);

        // onAuthStateChange fires FIRST with the current session (INITIAL_SESSION event)
        // This is the recommended Supabase pattern – no need for a separate getSession call
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;
            initialized = true;
            clearTimeout(safetyTimer);
            await hydrateUser(session?.user || null);
        });

        return () => {
            isMounted = false;
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading }}>
            {loading ? (
                <div className="min-h-screen bg-[#0a0814] flex items-center justify-center p-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-primary rounded-full animate-spin" />
                        <div className="text-gray-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                            Initializing Protocol
                        </div>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
