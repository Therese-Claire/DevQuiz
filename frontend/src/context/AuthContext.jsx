import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const hydrateUser = async (sessionUser) => {
            try {
                if (!sessionUser) {
                    setUser(null);
                    return;
                }
                const [{ data: profile, error: profileError }, stats] = await Promise.all([
                    supabase.from('users').select('username, email, is_admin').eq('id', sessionUser.id).single(),
                    supabase.rpc('get_user_stats', { user_uuid: sessionUser.id })
                ]);

                if (profileError) {
                    console.warn('Profile sync delay:', profileError.message);
                }

                const statsData = stats.data || {};
                const role = profile?.is_admin ? 'admin' : 'user';
                const hydrated = {
                    ...sessionUser,
                    username: profile?.username || sessionUser.email?.split('@')[0] || 'User',
                    email: profile?.email || sessionUser.email,
                    isAdmin: !!profile?.is_admin,
                    totalScore: statsData.score || 0,
                    percentile: statsData.percentile || 0,
                    rank: statsData.rank || 0,
                    role,
                };
                setUser(hydrated);
            } catch (err) {
                console.error('Core auth hydration failure:', err);
                setUser(sessionUser ? { ...sessionUser, role: 'user' } : null);
            }
        };

        const init = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (isMounted) {
                    await hydrateUser(data.session?.user || null);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        init();

        const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
            try {
                await hydrateUser(session?.user || null);
            } catch (err) {
                console.error('Auth state change error:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
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

export const useAuth = () => useContext(AuthContext);
