import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('categories');

    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [categoryForm, setCategoryForm] = useState({ id: '', name: '', icon: '', description: '' });
    const [topicForm, setTopicForm] = useState({ id: '', category_id: '', name: '', description: '' });
    const [questionForm, setQuestionForm] = useState({
        category_id: '',
        topic_id: '',
        question: '',
        options: ['', '', '', ''],
        correct_answer: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const loadAll = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        const [catRes, topicRes, questionRes] = await Promise.all([
            supabase.from('categories').select('id, name, icon, description').order('id'),
            supabase.from('topics').select('id, category_id, name, description').order('category_id').order('id'),
            supabase.from('questions').select('id, category_id, topic_id, question').order('created_at', { ascending: false }).limit(50)
        ]);
        if (catRes.error || topicRes.error || questionRes.error) {
            setError('Failed to load admin data.');
        } else {
            setCategories(catRes.data || []);
            setTopics(topicRes.data || []);
            setQuestions(questionRes.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleCategoryCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const { error: err } = await supabase.from('categories').upsert({
            id: categoryForm.id.trim(),
            name: categoryForm.name.trim(),
            icon: categoryForm.icon.trim(),
            description: categoryForm.description.trim()
        });
        if (err) {
            setError('Could not save category.');
        } else {
            setSuccess('Category saved.');
            setCategoryForm({ id: '', name: '', icon: '', description: '' });
            loadAll();
        }
        setLoading(false);
    };

    const handleTopicCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const { error: err } = await supabase.from('topics').upsert({
            id: topicForm.id.trim(),
            category_id: topicForm.category_id,
            name: topicForm.name.trim(),
            description: topicForm.description.trim()
        }, { onConflict: 'category_id,id' });
        if (err) {
            setError('Could not save topic.');
        } else {
            setSuccess('Topic saved.');
            setTopicForm({ id: '', category_id: '', name: '', description: '' });
            loadAll();
        }
        setLoading(false);
    };

    const handleQuestionCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const options = questionForm.options.map(o => o.trim()).filter(Boolean);
        const { error: err } = await supabase.from('questions').insert({
            category_id: questionForm.category_id,
            topic_id: questionForm.topic_id,
            question: questionForm.question.trim(),
            options,
            correct_answer: questionForm.correct_answer.trim()
        });
        if (err) {
            setError('Could not save question.');
        } else {
            setSuccess('Question saved.');
            setQuestionForm({ category_id: '', topic_id: '', question: '', options: ['', '', '', ''], correct_answer: '' });
            loadAll();
        }
        setLoading(false);
    };

    const deleteCategory = async (id) => {
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('categories').delete().eq('id', id);
        if (err) setError('Could not delete category.');
        else loadAll();
        setLoading(false);
    };

    const deleteTopic = async (categoryId, topicId) => {
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('topics').delete().eq('category_id', categoryId).eq('id', topicId);
        if (err) setError('Could not delete topic.');
        else loadAll();
        setLoading(false);
    };

    const deleteQuestion = async (id) => {
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('questions').delete().eq('id', id);
        if (err) setError('Could not delete question.');
        else loadAll();
        setLoading(false);
    };

    const filteredTopics = topics.filter(t => t.category_id === questionForm.category_id);

    return (
        <div className="min-h-screen bg-[#110e1b] flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage categories, topics, and questions</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: 'Total Categories', value: categories.length, icon: '📦', color: 'from-blue-500 to-cyan-500' },
                        { title: 'Total Topics', value: topics.length, icon: '🧭', color: 'from-primary to-purple-500' },
                        { title: 'Recent Questions', value: questions.length, icon: '❓', color: 'from-secondary to-orange-500' }
                    ].map((stat, idx) => (
                        <div key={idx} className="relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-white/20 transition-all">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl rounded-full -mr-4 -mt-4`} />
                            <span className="text-3xl mb-4 block">{stat.icon}</span>
                            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex flex-wrap gap-3 mb-6">
                        {['categories', 'topics', 'questions'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab
                                    ? 'bg-primary text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab[0].toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {(error || success) && (
                        <div className="mb-4 text-sm">
                            {error && <span className="text-red-400">{error}</span>}
                            {success && <span className="text-green-400">{success}</span>}
                        </div>
                    )}

                    {loading && <div className="text-gray-400 text-sm mb-4">Loading...</div>}

                    {activeTab === 'categories' && (
                        <div className="space-y-6">
                            <form onSubmit={handleCategoryCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="ID (e.g. html)" value={categoryForm.id} onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })} required />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Icon" value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                                <button className="md:col-span-4 bg-secondary text-white rounded-xl py-2">Save Category</button>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categories.map((c) => (
                                    <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-white font-semibold">{c.icon} {c.name}</div>
                                            <div className="text-gray-400 text-sm">{c.id}</div>
                                        </div>
                                        <button onClick={() => deleteCategory(c.id)} className="text-red-400 text-sm">Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'topics' && (
                        <div className="space-y-6">
                            <form onSubmit={handleTopicCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" value={topicForm.category_id} onChange={(e) => setTopicForm({ ...topicForm, category_id: e.target.value })} required>
                                    <option value="">Select Category</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Topic ID" value={topicForm.id} onChange={(e) => setTopicForm({ ...topicForm, id: e.target.value })} required />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Topic Name" value={topicForm.name} onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })} required />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Description" value={topicForm.description} onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })} />
                                <button className="md:col-span-4 bg-secondary text-white rounded-xl py-2">Save Topic</button>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {topics.map((t) => (
                                    <div key={`${t.category_id}-${t.id}`} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-white font-semibold">{t.name}</div>
                                            <div className="text-gray-400 text-sm">{t.category_id}/{t.id}</div>
                                        </div>
                                        <button onClick={() => deleteTopic(t.category_id, t.id)} className="text-red-400 text-sm">Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div className="space-y-6">
                            <form onSubmit={handleQuestionCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" value={questionForm.category_id} onChange={(e) => setQuestionForm({ ...questionForm, category_id: e.target.value, topic_id: '' })} required>
                                    <option value="">Select Category</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" value={questionForm.topic_id} onChange={(e) => setQuestionForm({ ...questionForm, topic_id: e.target.value })} required>
                                    <option value="">Select Topic</option>
                                    {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <input className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Question text" value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} required />
                                {questionForm.options.map((opt, idx) => (
                                    <input
                                        key={idx}
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                        placeholder={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const next = [...questionForm.options];
                                            next[idx] = e.target.value;
                                            setQuestionForm({ ...questionForm, options: next });
                                        }}
                                        required
                                    />
                                ))}
                                <input className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Correct answer (must match an option)" value={questionForm.correct_answer} onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })} required />
                                <button className="md:col-span-2 bg-secondary text-white rounded-xl py-2">Save Question</button>
                            </form>

                            <div className="space-y-3">
                                {questions.map((q) => (
                                    <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-white font-semibold">{q.question}</div>
                                            <div className="text-gray-400 text-sm">{q.category_id}/{q.topic_id}</div>
                                        </div>
                                        <button onClick={() => deleteQuestion(q.id)} className="text-red-400 text-sm">Delete</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <aside className="w-full md:w-72 bg-white/5 border-l border-white/10 p-6 flex flex-col h-screen backdrop-blur-md">
                <div className="flex items-center gap-2 mb-12 px-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        A
                    </div>
                    <span className="text-xl font-bold text-white">AdminPanel</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { name: 'Categories', icon: '📦', tab: 'categories' },
                        { name: 'Topics', icon: '🧭', tab: 'topics' },
                        { name: 'Questions', icon: '❓', tab: 'questions' }
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                ${activeTab === item.tab
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
                            {user?.username ? user.username.slice(0, 2).toUpperCase() : 'AD'}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">Administrator</p>
                            <p className="text-xs text-gray-400">{user?.email || 'admin@dev.com'}</p>
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
