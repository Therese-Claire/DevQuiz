import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#110e1b] flex flex-col md:flex-row overflow-hidden">
            {/* Main Content Area (Left) */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage your quiz ecosystem</p>
                    </div>
                    {/* Mobile Menu Toggle could go here */}
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: 'Total Users', value: '1,234', icon: '👥', color: 'from-blue-500 to-cyan-500' },
                        { title: 'Active Quizzes', value: '42', icon: '📝', color: 'from-primary to-purple-500' },
                        { title: 'Completion Rate', value: '78%', icon: '📈', color: 'from-secondary to-orange-500' }
                    ].map((stat, idx) => (
                        <div key={idx} className="relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-white/20 transition-all">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl rounded-full -mr-4 -mt-4`} />
                            <span className="text-3xl mb-4 block">{stat.icon}</span>
                            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity / Content Table */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        JS
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">New Score Recorded</h4>
                                        <p className="text-sm text-gray-400">User successfully completed JavaScript Basics</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">2 min ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right-Side Navigation Sidebar */}
            <aside className="w-full md:w-72 bg-white/5 border-l border-white/10 p-6 flex flex-col h-screen backdrop-blur-md">
                <div className="flex items-center gap-2 mb-12 px-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        A
                    </div>
                    <span className="text-xl font-bold text-white">AdminPanel</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { name: 'Overview', icon: '📊', active: true },
                        { name: 'Quizzes', icon: '📚' },
                        { name: 'Users', icon: '👥' },
                        { name: 'Settings', icon: '⚙️' },
                        { name: 'Analytics', icon: '📉' }
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                ${item.active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                            AD
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">Administrator</p>
                            <p className="text-xs text-gray-400">admin@dev.com</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all text-sm font-medium"
                    >
                        Log Out
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default AdminDashboard;
