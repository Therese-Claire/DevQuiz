import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const buildUserObject = (sessionUser, profile, statsData = {}) => ({
        ...sessionUser,
        username: profile?.username || sessionUser.email?.split('@')[0] || 'User',
        email: profile?.email || sessionUser.email,
        isAdmin: !!profile?.is_admin,
        avatarUrl: profile?.avatar_url || null,
        totalScore: statsData.score || 0,
        percentile: statsData.percentile || 0,
        rank: statsData.rank || 0,
        role: profile?.is_admin ? 'admin' : 'user',
    });

    const hydrateUser = async (sessionUser) => {
        if (!sessionUser) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const { data: profile } = await supabase
                .from('users')
                .select('username, email, is_admin, avatar_url')
                .eq('id', sessionUser.id)
                .single();

            let statsData = {};
            try {
                const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_stats', { user_uuid: sessionUser.id });
                if (!rpcError) statsData = rpcData || {};
            } catch (_) { /* non-critical */ }

            setUser(buildUserObject(sessionUser, profile, statsData));
        } catch (err) {
            console.error('Auth hydration error:', err);
            setUser({ ...sessionUser, role: 'user', username: sessionUser.email?.split('@')[0] });
        } finally {
            setLoading(false);
        }
    };

    // Exposed method so pages (e.g. ResultPage) can trigger a rank/score refresh
    const refreshStats = useCallback(async () => {
        const { data: { user: sessionUser } } = await supabase.auth.getUser();
        if (!sessionUser) return;
        try {
            const { data: rpcData, error: rpcError } = await supabase.rpc('get_user_stats', { user_uuid: sessionUser.id });
            if (!rpcError && rpcData) {
                setUser(prev => prev ? {
                    ...prev,
                    totalScore: rpcData.score || 0,
                    percentile: rpcData.percentile || 0,
                    rank: rpcData.rank || 0,
                } : prev);
            }
        } catch (_) { /* non-critical */ }
    }, []);

    useEffect(() => {
        let isMounted = true;
        let initialized = false;

        // Safety timeout: always exit loading after 4s even if Supabase hangs
        const safetyTimer = setTimeout(() => {
            if (isMounted && !initialized) {
                console.warn('Auth init timed out – forcing ready state');
                setUser(null);
                setLoading(false);
            }
        }, 4000);

        // Get current session synchronously first to avoid blank flash on reload
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted || initialized) return;
            // Pre-emptively resolve with session data so the page doesn't wait
            // on the listener event (which can be slower on reload)
            if (session?.user) {
                hydrateUser(session.user);
                initialized = true;
                clearTimeout(safetyTimer);
            }
        });

        // onAuthStateChange still handles token refresh and sign-in/out events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;
            if (!initialized) {
                initialized = true;
                clearTimeout(safetyTimer);
                await hydrateUser(session?.user || null);
            }
            // For subsequent events (token refresh, sign out), always re-hydrate
            // but skip the INITIAL_SESSION if we already handled it above
            if (_event !== 'INITIAL_SESSION') {
                await hydrateUser(session?.user || null);
            }
        });

        return () => {
            isMounted = false;
            clearTimeout(safetyTimer);
            subscription.unsubscribe();
        };
    }, []);

    // Optimistically update user profile fields (username, avatarUrl) in context
    const updateProfile = useCallback((patch) => {
        setUser(prev => prev ? { ...prev, ...patch } : prev);
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, logout, loading, refreshStats, updateProfile }}>
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
