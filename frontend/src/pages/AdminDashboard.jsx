import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { clearCache } from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('categories');

    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [quizSets, setQuizSets] = useState([]);
    const [setAssignments, setSetAssignments] = useState([]);
    const [badges, setBadges] = useState([]);
    const [reports, setReports] = useState([]);
    const [reportStatus, setReportStatus] = useState('open');
    const [reportRange, setReportRange] = useState('30');
    const [analytics, setAnalytics] = useState([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsRange, setAnalyticsRange] = useState('30');
    const [analyticsCategory, setAnalyticsCategory] = useState('');
    const [analyticsTopic, setAnalyticsTopic] = useState('');
    const [questionPage, setQuestionPage] = useState(1);
    const [questionTotal, setQuestionTotal] = useState(0);
    const [questionSearch, setQuestionSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterTopic, setFilterTopic] = useState('');
    const [lastDeleted, setLastDeleted] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [selectedTopics, setSelectedTopics] = useState(new Set());
    const [questionTab, setQuestionTab] = useState('active');
    const [selectedQuestions, setSelectedQuestions] = useState(new Set());
    const [categoryTab, setCategoryTab] = useState('active');
    const [topicTab, setTopicTab] = useState('active');
    const [importErrors, setImportErrors] = useState([]);

    const [categoryForm, setCategoryForm] = useState({ id: '', name: '', icon: '', description: '' });
    const [topicForm, setTopicForm] = useState({ id: '', category_id: '', name: '', description: '' });
    const [questionForm, setQuestionForm] = useState({
        category_id: '',
        topic_id: '',
        question: '',
        options: ['', '', '', ''],
        correct_answer: '',
        difficulty: 'medium'
    });
    const [badgeForm, setBadgeForm] = useState({ id: '', name: '', description: '', icon: '' });
    const [setForm, setSetForm] = useState({ name: '', description: '', difficulty: 'mixed' });
    const [selectedSetId, setSelectedSetId] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingTopicKey, setEditingTopicKey] = useState(null);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editingBadgeId, setEditingBadgeId] = useState(null);

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
        const from = (questionPage - 1) * 50;
        const to = from + 49;
        const reportSince = reportRange === 'all'
            ? null
            : new Date(Date.now() - Number(reportRange) * 24 * 60 * 60 * 1000).toISOString();
        const [catRes, topicRes, questionRes, setRes, assignRes, badgeRes, reportRes] = await Promise.all([
            supabase.from('categories').select('id, name, icon, description, is_archived').order('id'),
            supabase.from('topics').select('id, category_id, name, description, is_archived').order('category_id').order('id'),
            (() => {
                let q = supabase.from('questions')
                    .select('id, category_id, topic_id, question, is_archived, difficulty', { count: 'exact' })
                    .order('created_at', { ascending: false })
                    .range(from, to);
                if (questionSearch) q = q.ilike('question', `%${questionSearch}%`);
                if (filterCategory) q = q.eq('category_id', filterCategory);
                if (filterTopic) q = q.eq('topic_id', filterTopic);
                if (questionTab === 'archived') q = q.eq('is_archived', true);
                if (questionTab === 'active') q = q.eq('is_archived', false);
                return q;
            })(),
            supabase.from('quiz_sets').select('id, name, description, difficulty').order('created_at', { ascending: false }),
            supabase.from('quiz_set_questions').select('quiz_set_id, question_id'),
            supabase.from('badges').select('id, name, description, icon').order('id'),
            (() => {
                let q = supabase
                    .from('question_reports')
                    .select('id, question_id, user_id, reason, status, created_at, questions(id, question, category_id, topic_id, is_archived)')
                    .order('created_at', { ascending: false });
                if (reportStatus !== 'all') q = q.eq('status', reportStatus);
                if (reportSince) q = q.gte('created_at', reportSince);
                return q;
            })()
        ]);
        if (catRes.error || topicRes.error || questionRes.error || setRes.error || assignRes.error || badgeRes.error || reportRes.error) {
            setError('Failed to load admin data.');
        } else {
            setCategories(catRes.data || []);
            setTopics(topicRes.data || []);
            setQuestions(questionRes.data || []);
            setQuestionTotal(questionRes.count || 0);
            setQuizSets(setRes.data || []);
            setSetAssignments(assignRes.data || []);
            setBadges(badgeRes.data || []);
            setReports(reportRes.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadAll();
    }, [questionPage, questionSearch, filterCategory, filterTopic, questionTab, reportStatus, reportRange]);

    useEffect(() => {
        const loadAnalytics = async () => {
            setAnalyticsLoading(true);
            const since = analyticsRange === 'all'
                ? null
                : new Date(Date.now() - Number(analyticsRange) * 24 * 60 * 60 * 1000).toISOString();
            let query = supabase
                .from('results')
                .select('created_at, user_id, category_id, topic_id');
            if (since) query = query.gte('created_at', since);
            if (analyticsCategory) query = query.eq('category_id', analyticsCategory);
            if (analyticsTopic) query = query.eq('topic_id', analyticsTopic);
            const { data, error } = await query;
            if (error) {
                setAnalytics([]);
            } else {
                setAnalytics(buildAnalytics(data || []));
            }
            setAnalyticsLoading(false);
        };
        loadAnalytics();
    }, [analyticsRange, analyticsCategory, analyticsTopic]);

    const handleCategoryCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const payload = {
            id: categoryForm.id.trim(),
            name: categoryForm.name.trim(),
            icon: categoryForm.icon.trim(),
            description: categoryForm.description.trim()
        };
        if (editingCategoryId && editingCategoryId !== payload.id) {
            setLoading(false);
            setError('Category ID cannot be changed once created.');
            return;
        }
        const { error: err } = await supabase.from('categories').upsert({
            id: payload.id,
            name: payload.name,
            icon: payload.icon,
            description: payload.description
        });
        if (err) {
            setError('Could not save category.');
        } else {
            setSuccess(editingCategoryId ? 'Category updated.' : 'Category saved.');
            setCategoryForm({ id: '', name: '', icon: '', description: '' });
            setEditingCategoryId(null);
            clearCache();
            loadAll();
        }
        setLoading(false);
    };

    const handleTopicCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const key = `${topicForm.category_id}:${topicForm.id.trim()}`;
        if (editingTopicKey && editingTopicKey !== key) {
            setLoading(false);
            setError('Topic ID and category cannot be changed once created.');
            return;
        }
        const { error: err } = await supabase.from('topics').upsert({
            id: topicForm.id.trim(),
            category_id: topicForm.category_id,
            name: topicForm.name.trim(),
            description: topicForm.description.trim()
        }, { onConflict: 'category_id,id' });
        if (err) {
            setError('Could not save topic.');
        } else {
            setSuccess(editingTopicKey ? 'Topic updated.' : 'Topic saved.');
            setTopicForm({ id: '', category_id: '', name: '', description: '' });
            setEditingTopicKey(null);
            clearCache();
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
        if (!options.includes(questionForm.correct_answer.trim())) {
            setLoading(false);
            setError('Correct answer must match one of the options.');
            return;
        }
        const payload = {
            category_id: questionForm.category_id,
            topic_id: questionForm.topic_id,
            question: questionForm.question.trim(),
            options,
            correct_answer: questionForm.correct_answer.trim(),
            difficulty: questionForm.difficulty
        };
        const { error: err } = editingQuestionId
            ? await supabase.from('questions').update(payload).eq('id', editingQuestionId)
            : await supabase.from('questions').insert(payload);
        if (err) {
            setError('Could not save question.');
        } else {
            setSuccess(editingQuestionId ? 'Question updated.' : 'Question saved.');
            setQuestionForm({ category_id: '', topic_id: '', question: '', options: ['', '', '', ''], correct_answer: '', difficulty: 'medium' });
            setEditingQuestionId(null);
            clearCache();
            loadAll();
        }
        setLoading(false);
    };

    const deleteCategory = async (id) => {
        setLoading(true);
        setError('');
        if (!window.confirm('Archive this category? This will hide related topics and questions.')) {
            setLoading(false);
            return;
        }
        const { data: row } = await supabase.from('categories').select('*').eq('id', id).single();
        const { error: err } = await supabase.from('categories').update({ is_archived: true }).eq('id', id);
        if (err) setError('Could not delete category.');
        else {
            setLastDeleted({ type: 'category', data: row });
            clearCache();
            loadAll();
            setSuccess('Category archived.');
        }
        setLoading(false);
    };

    const deleteTopic = async (categoryId, topicId) => {
        setLoading(true);
        setError('');
        if (!window.confirm('Archive this topic? This will hide related questions.')) {
            setLoading(false);
            return;
        }
        const { data: row } = await supabase.from('topics').select('*').eq('category_id', categoryId).eq('id', topicId).single();
        const { error: err } = await supabase.from('topics').update({ is_archived: true }).eq('category_id', categoryId).eq('id', topicId);
        if (err) setError('Could not delete topic.');
        else {
            setLastDeleted({ type: 'topic', data: row });
            clearCache();
            loadAll();
            setSuccess('Topic archived.');
        }
        setLoading(false);
    };

    const deleteQuestion = async (id) => {
        setLoading(true);
        setError('');
        if (!window.confirm('Archive this question?')) {
            setLoading(false);
            return;
        }
        const { data: row } = await supabase.from('questions').select('*').eq('id', id).single();
        const { error: err } = await supabase.from('questions').update({ is_archived: true }).eq('id', id);
        if (err) setError('Could not delete question.');
        else {
            setLastDeleted({ type: 'question', data: row });
            clearCache();
            loadAll();
            setSuccess('Question archived.');
        }
        setLoading(false);
    };

    const undoDelete = async () => {
        if (!lastDeleted) return;
        setLoading(true);
        setError('');
        const { type, data } = lastDeleted;
        if (type === 'category') {
            await supabase.from('categories').update({ is_archived: false }).eq('id', data.id);
        }
        if (type === 'topic') {
            await supabase.from('topics').update({ is_archived: false }).eq('category_id', data.category_id).eq('id', data.id);
        }
        if (type === 'question') {
            await supabase.from('questions').update({ is_archived: false }).eq('id', data.id);
        }
        setLastDeleted(null);
        clearCache();
        loadAll();
        setLoading(false);
    };

    const bulkUnarchiveQuestions = async () => {
        if (selectedQuestions.size === 0) return;
        if (!window.confirm(`Restore ${selectedQuestions.size} questions?`)) return;
        setLoading(true);
        setError('');
        const ids = Array.from(selectedQuestions);
        const { error: err } = await supabase.from('questions').update({ is_archived: false }).in('id', ids);
        if (err) setError('Bulk restore failed.');
        setSelectedQuestions(new Set());
        clearCache();
        loadAll();
        setSuccess('Questions restored.');
        setLoading(false);
    };

    const bulkArchiveQuestions = async () => {
        if (selectedQuestions.size === 0) return;
        if (!window.confirm(`Archive ${selectedQuestions.size} questions?`)) return;
        setLoading(true);
        setError('');
        const ids = Array.from(selectedQuestions);
        const { error: err } = await supabase.from('questions').update({ is_archived: true }).in('id', ids);
        if (err) setError('Bulk archive failed.');
        setSelectedQuestions(new Set());
        clearCache();
        loadAll();
        setSuccess('Questions archived.');
        setLoading(false);
    };

    const bulkArchiveCategories = async () => {
        if (selectedCategories.size === 0) return;
        if (!window.confirm(`Archive ${selectedCategories.size} categories?`)) return;
        setLoading(true);
        setError('');
        const ids = Array.from(selectedCategories);
        const { error: err } = await supabase.from('categories').update({ is_archived: true }).in('id', ids);
        if (err) setError('Bulk archive failed.');
        setSelectedCategories(new Set());
        clearCache();
        loadAll();
        setSuccess('Categories archived.');
        setLoading(false);
    };

    const bulkArchiveTopics = async () => {
        if (selectedTopics.size === 0) return;
        if (!window.confirm(`Archive ${selectedTopics.size} topics?`)) return;
        setLoading(true);
        setError('');
        const pairs = Array.from(selectedTopics).map((key) => key.split(':'));
        const results = await Promise.all(
            pairs.map(([category_id, id]) =>
                supabase.from('topics').update({ is_archived: true }).eq('category_id', category_id).eq('id', id)
            )
        );
        if (results.some((r) => r.error)) setError('Bulk archive failed.');
        setSelectedTopics(new Set());
        clearCache();
        loadAll();
        setSuccess('Topics archived.');
        setLoading(false);
    };

    const restoreCategory = async (id) => {
        if (!window.confirm('Restore this category?')) return;
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('categories').update({ is_archived: false }).eq('id', id);
        if (err) setError('Could not restore category.');
        else setSuccess('Category restored.');
        clearCache();
        loadAll();
        setLoading(false);
    };

    const restoreTopic = async (categoryId, topicId) => {
        if (!window.confirm('Restore this topic?')) return;
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('topics').update({ is_archived: false }).eq('category_id', categoryId).eq('id', topicId);
        if (err) setError('Could not restore topic.');
        else setSuccess('Topic restored.');
        clearCache();
        loadAll();
        setLoading(false);
    };

    const restoreQuestion = async (id) => {
        if (!window.confirm('Restore this question?')) return;
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('questions').update({ is_archived: false }).eq('id', id);
        if (err) setError('Could not restore question.');
        else setSuccess('Question restored.');
        clearCache();
        loadAll();
        setLoading(false);
    };

    const handleExport = () => {
        const exportData = {
            categories,
            topics,
            questions
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'devquiz-export.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = async (file) => {
        if (!file) return;
        const text = await file.text();
        const data = JSON.parse(text);
        const errors = [];
        if (data.categories && !Array.isArray(data.categories)) errors.push('categories must be an array');
        if (data.topics && !Array.isArray(data.topics)) errors.push('topics must be an array');
        if (data.questions && !Array.isArray(data.questions)) errors.push('questions must be an array');
        if (data.categories) {
            data.categories.forEach((c, i) => {
                if (!c.id || !c.name) errors.push(`categories[${i}] missing id/name`);
            });
        }
        if (data.topics) {
            data.topics.forEach((t, i) => {
                if (!t.id || !t.category_id || !t.name) errors.push(`topics[${i}] missing id/category_id/name`);
            });
        }
        if (data.questions) {
            data.questions.forEach((q, i) => {
                if (!q.category_id || !q.topic_id || !q.question || !Array.isArray(q.options) || !q.correct_answer) {
                    errors.push(`questions[${i}] missing fields`);
                }
            });
        }
        if (errors.length > 0) {
            setImportErrors(errors);
            return;
        }
        setImportErrors([]);
        setLoading(true);
        setError('');
        if (data.categories) {
            await supabase.from('categories').upsert(data.categories);
        }
        if (data.topics) {
            await supabase.from('topics').upsert(data.topics, { onConflict: 'category_id,id' });
        }
        if (data.questions) {
            await supabase.from('questions').insert(data.questions);
        }
        clearCache();
        loadAll();
        setLoading(false);
    };

    const handleSetCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('quiz_sets').insert({
            name: setForm.name.trim(),
            description: setForm.description.trim(),
            difficulty: setForm.difficulty
        });
        if (err) setError('Could not create quiz set.');
        else {
            setSuccess('Quiz set created.');
            setSetForm({ name: '', description: '', difficulty: 'mixed' });
            loadAll();
        }
        setLoading(false);
    };

    const handleBadgeCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        const payload = {
            id: badgeForm.id.trim(),
            name: badgeForm.name.trim(),
            description: badgeForm.description.trim(),
            icon: badgeForm.icon.trim()
        };
        if (editingBadgeId) {
            const { error: err } = await supabase
                .from('badges')
                .update({ name: payload.name, description: payload.description, icon: payload.icon })
                .eq('id', editingBadgeId);
            if (err) setError('Could not update badge.');
            else {
                setSuccess('Badge updated.');
                setEditingBadgeId(null);
                setBadgeForm({ id: '', name: '', description: '', icon: '' });
                loadAll();
            }
        } else {
            const { error: err } = await supabase.from('badges').insert(payload);
            if (err) setError('Could not create badge.');
            else {
                setSuccess('Badge created.');
                setBadgeForm({ id: '', name: '', description: '', icon: '' });
                loadAll();
            }
        }
        setLoading(false);
    };

    const deleteBadge = async (id) => {
        if (!window.confirm('Delete this badge? It will be removed from all users.')) return;
        setLoading(true);
        setError('');
        const { error: err } = await supabase.from('badges').delete().eq('id', id);
        if (err) setError('Could not delete badge.');
        else setSuccess('Badge deleted.');
        loadAll();
        setLoading(false);
    };

    const toggleAssignQuestion = async (questionId) => {
        if (!selectedSetId) return;
        const exists = setAssignments.find(a => a.quiz_set_id === selectedSetId && a.question_id === questionId);
        if (exists) {
            await supabase.from('quiz_set_questions').delete().eq('quiz_set_id', selectedSetId).eq('question_id', questionId);
        } else {
            await supabase.from('quiz_set_questions').insert({ quiz_set_id: selectedSetId, question_id: questionId });
        }
        loadAll();
    };

    const autoPopulateSet = async () => {
        if (!selectedSetId) return;
        const selectedSet = quizSets.find((s) => s.id === selectedSetId);
        if (!selectedSet) return;
        const label = selectedSet.difficulty === 'mixed' ? 'all difficulties' : selectedSet.difficulty;
        if (!window.confirm(`Auto-populate "${selectedSet.name}" with ${label} questions? This will replace current assignments.`)) return;

        setLoading(true);
        setError('');
        await supabase.from('quiz_set_questions').delete().eq('quiz_set_id', selectedSetId);

        let query = supabase
            .from('questions')
            .select('id')
            .eq('is_archived', false)
            .order('created_at', { ascending: false })
            .limit(50);
        if (selectedSet.difficulty !== 'mixed') {
            query = query.eq('difficulty', selectedSet.difficulty);
        }
        const { data, error } = await query;
        if (error) {
            setError('Auto-populate failed.');
            setLoading(false);
            return;
        }
        if (!data || data.length === 0) {
            setError('No questions found for that difficulty.');
            setLoading(false);
            return;
        }
        const rows = data.map((q) => ({ quiz_set_id: selectedSetId, question_id: q.id }));
        const { error: insertError } = await supabase.from('quiz_set_questions').insert(rows);
        if (insertError) setError('Auto-populate failed.');
        else setSuccess(`Auto-populated with ${rows.length} questions.`);
        loadAll();
        setLoading(false);
    };

    const buildAnalytics = (rows) => {
        const map = new Map();
        for (const r of rows) {
            const d = new Date(r.created_at);
            if (Number.isNaN(d.getTime())) continue;
            const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
            if (!map.has(day)) map.set(day, { day, users: new Set(), quiz_completions: 0 });
            const entry = map.get(day);
            entry.quiz_completions += 1;
            if (r.user_id) entry.users.add(r.user_id);
        }
        const list = Array.from(map.values())
            .map((r) => ({
                day: r.day,
                active_users: r.users.size,
                quiz_completions: r.quiz_completions,
                completion_rate: r.users.size === 0 ? 0 : Math.round(r.quiz_completions / r.users.size),
            }))
            .sort((a, b) => (a.day > b.day ? 1 : -1));
        const maxCompletions = Math.max(1, ...list.map((r) => r.quiz_completions));
        return list.map((r) => ({
            ...r,
            completionsPct: Math.round((r.quiz_completions / maxCompletions) * 100),
        }));
    };

    const exportAnalyticsCsv = (rows) => {
        if (!rows || rows.length === 0) return;
        const headers = ['day', 'active_users', 'quiz_completions', 'completion_rate'];
        const csvRows = [
            headers.join(','),
            ...rows.map((r) => ([
                r.day,
                r.active_users,
                r.quiz_completions,
                r.completion_rate
            ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')))
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'admin-analytics.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredTopics = topics.filter(t => t.category_id === questionForm.category_id);

    return (
        <div className="min-h-screen bg-[#110e1b] flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
                <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Admin Control Center</div>
                        <h1 className="text-4xl md:text-5xl font-black text-white">Content and Community</h1>
                        <p className="text-gray-400 mt-2 max-w-2xl">
                            Curate quizzes, monitor reports, and keep the learning experience clean and consistent.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 rounded-xl bg-white/5 text-gray-200 hover:text-white border border-white/10"
                        >
                            Export JSON
                        </button>
                        <label className="px-4 py-2 rounded-xl bg-white/5 text-gray-200 hover:text-white cursor-pointer border border-white/10">
                            Import JSON
                            <input
                                type="file"
                                accept="application/json"
                                className="hidden"
                                onChange={(e) => handleImport(e.target.files?.[0])}
                            />
                        </label>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { title: 'Categories', value: categories.length, color: 'from-blue-500/20 to-cyan-500/20' },
                        { title: 'Topics', value: topics.length, color: 'from-primary/20 to-purple-500/20' },
                        { title: 'Questions', value: questionTotal, color: 'from-secondary/20 to-orange-500/20' },
                        { title: 'Reports', value: reports.length, color: 'from-rose-500/20 to-red-500/20' }
                    ].map((stat, idx) => (
                        <div key={idx} className="relative overflow-hidden bg-white/5 border border-white/10 p-6 rounded-3xl group hover:border-white/20 transition-all">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-80 blur-2xl rounded-full -mr-4 -mt-4`} />
                            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex flex-wrap gap-2 mb-6 bg-white/5 border border-white/10 rounded-2xl p-2">
                        {['categories', 'topics', 'questions', 'sets', 'badges', 'reports', 'analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:text-white'
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

                    {lastDeleted && (
                        <div className="mb-4 text-sm text-gray-300">
                            Item deleted.{' '}
                            <button onClick={undoDelete} className="text-secondary underline underline-offset-2">
                                Undo
                            </button>
                        </div>
                    )}

                    {importErrors.length > 0 && (
                        <div className="mb-4 text-sm text-red-400">
                            Import errors:
                            <ul className="mt-2 space-y-1">
                                {importErrors.slice(0, 5).map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {loading && <div className="text-gray-400 text-sm mb-4">Loading...</div>}

                    {activeTab === 'categories' && (
                        <div className="space-y-6">
                            <div className="flex gap-3">
                                {['active', 'archived'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setCategoryTab(tab);
                                            setSelectedCategories(new Set());
                                        }}
                                        className={`px-3 py-1 rounded-lg text-sm ${categoryTab === tab ? 'bg-primary text-white' : 'bg-white/5 text-gray-300'}`}
                                    >
                                        {tab === 'active' ? 'Active' : 'Archived'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>{selectedCategories.size} selected</span>
                                {categoryTab === 'active' && (
                                    <button
                                        onClick={bulkArchiveCategories}
                                        className="px-3 py-1 rounded-lg bg-white/5 disabled:opacity-50"
                                        disabled={selectedCategories.size === 0}
                                    >
                                        Archive Selected
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleCategoryCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="ID (e.g. html)" value={categoryForm.id} onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })} required />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Icon" value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                                <button className="md:col-span-4 bg-secondary text-white rounded-xl py-2">Save Category</button>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categories
                                    .filter((c) => categoryTab === 'archived' ? c.is_archived : !c.is_archived)
                                    .map((c) => (
                                    <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {!c.is_archived && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.has(c.id)}
                                                    onChange={(e) => {
                                                        const next = new Set(selectedCategories);
                                                        if (e.target.checked) next.add(c.id);
                                                        else next.delete(c.id);
                                                        setSelectedCategories(next);
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <div className="text-white font-semibold">{c.icon} {c.name}</div>
                                                <div className="text-gray-400 text-sm">{c.id}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            {!c.is_archived && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setCategoryForm({ id: c.id, name: c.name || '', icon: c.icon || '', description: c.description || '' });
                                                            setEditingCategoryId(c.id);
                                                        }}
                                                        className="text-secondary"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => deleteCategory(c.id)} className="text-red-400">Archive</button>
                                                </>
                                            )}
                                            {c.is_archived && (
                                                <button onClick={() => restoreCategory(c.id)} className="text-green-400">Restore</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'topics' && (
                        <div className="space-y-6">
                            <div className="flex gap-3">
                                {['active', 'archived'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setTopicTab(tab);
                                            setSelectedTopics(new Set());
                                        }}
                                        className={`px-3 py-1 rounded-lg text-sm ${topicTab === tab ? 'bg-primary text-white' : 'bg-white/5 text-gray-300'}`}
                                    >
                                        {tab === 'active' ? 'Active' : 'Archived'}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>{selectedTopics.size} selected</span>
                                {topicTab === 'active' && (
                                    <button
                                        onClick={bulkArchiveTopics}
                                        className="px-3 py-1 rounded-lg bg-white/5 disabled:opacity-50"
                                        disabled={selectedTopics.size === 0}
                                    >
                                        Archive Selected
                                    </button>
                                )}
                            </div>
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
                                {topics
                                    .filter((t) => topicTab === 'archived' ? t.is_archived : !t.is_archived)
                                    .map((t) => (
                                    <div key={`${t.category_id}-${t.id}`} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {!t.is_archived && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTopics.has(`${t.category_id}:${t.id}`)}
                                                    onChange={(e) => {
                                                        const key = `${t.category_id}:${t.id}`;
                                                        const next = new Set(selectedTopics);
                                                        if (e.target.checked) next.add(key);
                                                        else next.delete(key);
                                                        setSelectedTopics(next);
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <div className="text-white font-semibold">{t.name}</div>
                                                <div className="text-gray-400 text-sm">{t.category_id}/{t.id}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            {!t.is_archived && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setTopicForm({ id: t.id, category_id: t.category_id, name: t.name || '', description: t.description || '' });
                                                            setEditingTopicKey(`${t.category_id}:${t.id}`);
                                                        }}
                                                        className="text-secondary"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => deleteTopic(t.category_id, t.id)} className="text-red-400">Archive</button>
                                                </>
                                            )}
                                            {t.is_archived && (
                                                <button onClick={() => restoreTopic(t.category_id, t.id)} className="text-green-400">Restore</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div className="space-y-6">
                            <div className="flex gap-3">
                                {['active', 'archived'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setQuestionTab(tab);
                                            setQuestionPage(1);
                                            setSelectedQuestions(new Set());
                                        }}
                                        className={`px-3 py-1 rounded-lg text-sm ${questionTab === tab ? 'bg-primary text-white' : 'bg-white/5 text-gray-300'}`}
                                    >
                                        {tab === 'active' ? 'Active' : 'Archived'}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    placeholder="Search questions..."
                                    value={questionSearch}
                                    onChange={(e) => { setQuestionSearch(e.target.value); setQuestionPage(1); }}
                                />
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    value={filterCategory}
                                    onChange={(e) => { setFilterCategory(e.target.value); setFilterTopic(''); setQuestionPage(1); }}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    value={filterTopic}
                                    onChange={(e) => { setFilterTopic(e.target.value); setQuestionPage(1); }}
                                >
                                    <option value="">All Topics</option>
                                    {topics.filter(t => !filterCategory || t.category_id === filterCategory)
                                        .map((t) => <option key={`${t.category_id}-${t.id}`} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
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
                                <select
                                    className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    value={questionForm.correct_answer}
                                    onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                                    required
                                >
                                    <option value="">Select correct answer</option>
                                    {questionForm.options.filter(Boolean).map((opt, idx) => (
                                        <option key={idx} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                <select
                                    className="md:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    value={questionForm.difficulty}
                                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <button className="md:col-span-2 bg-secondary text-white rounded-xl py-2">Save Question</button>
                            </form>

                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>Total results: {questionTotal}</span>
                                <div className="flex items-center gap-3">
                                    {questionTab === 'active' && (
                                        <button
                                            onClick={bulkArchiveQuestions}
                                            className="px-3 py-1 rounded-lg bg-white/5 disabled:opacity-50"
                                            disabled={selectedQuestions.size === 0}
                                        >
                                            Archive Selected
                                        </button>
                                    )}
                                    {questionTab === 'archived' && (
                                        <button
                                            onClick={bulkUnarchiveQuestions}
                                            className="px-3 py-1 rounded-lg bg-white/5 disabled:opacity-50"
                                            disabled={selectedQuestions.size === 0}
                                        >
                                            Restore Selected
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {questions.map((q) => (
                                    <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedQuestions.has(q.id)}
                                                onChange={(e) => {
                                                    const next = new Set(selectedQuestions);
                                                    if (e.target.checked) next.add(q.id);
                                                    else next.delete(q.id);
                                                    setSelectedQuestions(next);
                                                }}
                                            />
                                        <div>
                                            <div className="text-white font-semibold">{q.question}</div>
                                            <div className="text-gray-400 text-sm">{q.category_id}/{q.topic_id}</div>
                                        </div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            {!q.is_archived && (
                                                <>
                                                    <button
                                                        onClick={async () => {
                                                            const { data, error } = await supabase
                                                                .from('questions')
                                                                .select('id, category_id, topic_id, question, options, correct_answer')
                                                                .eq('id', q.id)
                                                                .single();
                                                            if (!error && data) {
                                                                setQuestionForm({
                                                                    category_id: data.category_id,
                                                                    topic_id: data.topic_id,
                                                                    question: data.question,
                                                                    options: data.options || ['', '', '', ''],
                                                                    correct_answer: data.correct_answer
                                                                });
                                                                setEditingQuestionId(data.id);
                                                            }
                                                        }}
                                                        className="text-secondary"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button onClick={() => deleteQuestion(q.id)} className="text-red-400">Archive</button>
                                                </>
                                            )}
                                            {q.is_archived && (
                                                <button onClick={() => restoreQuestion(q.id)} className="text-green-400">Restore</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                                <button
                                    onClick={() => setQuestionPage((p) => Math.max(1, p - 1))}
                                    disabled={questionPage === 1}
                                    className="px-3 py-1 rounded-lg bg-white/5 disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <span>
                                    Page {questionPage} of {Math.max(1, Math.ceil(questionTotal / 50))}
                                </span>
                                <button
                                    onClick={() => setQuestionPage((p) => p + 1)}
                                    disabled={questionPage >= Math.ceil(questionTotal / 50)}
                                    className="px-3 py-1 rounded-lg bg-white/5 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sets' && (
                        <div className="space-y-6">
                            <form onSubmit={handleSetCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Set name" value={setForm.name} onChange={(e) => setSetForm({ ...setForm, name: e.target.value })} required />
                                <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Description" value={setForm.description} onChange={(e) => setSetForm({ ...setForm, description: e.target.value })} />
                                <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" value={setForm.difficulty} onChange={(e) => setSetForm({ ...setForm, difficulty: e.target.value })}>
                                    <option value="mixed">Mixed</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <button className="md:col-span-3 bg-secondary text-white rounded-xl py-2">Create Set</button>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quizSets.map((s) => (
                                    <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <div className="text-white font-semibold">{s.name}</div>
                                        <div className="text-gray-400 text-sm">{s.difficulty}</div>
                                        <button
                                            onClick={() => setSelectedSetId(s.id)}
                                            className="mt-3 text-secondary text-sm"
                                        >
                                            {selectedSetId === s.id ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {selectedSetId && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-white font-semibold">Assign Questions</h3>
                                        <button
                                            onClick={autoPopulateSet}
                                            className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 hover:text-white"
                                        >
                                            Auto-populate by difficulty
                                        </button>
                                    </div>
                                    {questions.map((q) => {
                                        const assigned = setAssignments.find(a => a.quiz_set_id === selectedSetId && a.question_id === q.id);
                                        return (
                                            <div key={q.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
                                                <div>
                                                    <div className="text-white">{q.question}</div>
                                                    <div className="text-gray-400 text-sm">{q.difficulty}</div>
                                                </div>
                                                <button
                                                    onClick={() => toggleAssignQuestion(q.id)}
                                                    className={`px-3 py-1 rounded-lg ${assigned ? 'bg-primary text-white' : 'bg-white/5 text-gray-300'}`}
                                                >
                                                    {assigned ? 'Remove' : 'Add'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'badges' && (
                        <div className="space-y-6">
                            <form onSubmit={handleBadgeCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    placeholder="Badge ID (e.g. first_quiz)"
                                    value={badgeForm.id}
                                    onChange={(e) => setBadgeForm({ ...badgeForm, id: e.target.value })}
                                    disabled={!!editingBadgeId}
                                    required
                                />
                                <input
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    placeholder="Name"
                                    value={badgeForm.name}
                                    onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                                    required
                                />
                                <input
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    placeholder="Icon (emoji)"
                                    value={badgeForm.icon}
                                    onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                                />
                                <input
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
                                    placeholder="Description"
                                    value={badgeForm.description}
                                    onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                                />
                                <button className="md:col-span-4 bg-secondary text-white rounded-xl py-2">
                                    {editingBadgeId ? 'Update Badge' : 'Create Badge'}
                                </button>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {badges.map((b) => (
                                    <div key={b.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-white font-semibold">
                                                {b.icon || '🏅'} {b.name || b.id}
                                            </div>
                                            <div className="text-gray-400 text-sm">{b.description}</div>
                                            <div className="text-gray-500 text-xs">{b.id}</div>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <button
                                                onClick={() => {
                                                    setBadgeForm({
                                                        id: b.id,
                                                        name: b.name || '',
                                                        description: b.description || '',
                                                        icon: b.icon || ''
                                                    });
                                                    setEditingBadgeId(b.id);
                                                }}
                                                className="text-secondary"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteBadge(b.id)} className="text-red-400">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                                    value={reportStatus}
                                    onChange={(e) => setReportStatus(e.target.value)}
                                >
                                    <option value="all">All statuses</option>
                                    <option value="open">Open</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="dismissed">Dismissed</option>
                                </select>
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                                    value={reportRange}
                                    onChange={(e) => setReportRange(e.target.value)}
                                >
                                    <option value="7">Last 7 days</option>
                                    <option value="30">Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                    <option value="all">All time</option>
                                </select>
                            </div>
                            {reports.length === 0 && (
                                <div className="text-gray-400">No reports yet.</div>
                            )}
                            {reports.map((r) => (
                                <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start justify-between">
                                    <div>
                                        <div className="text-white font-semibold">
                                            {r.questions?.question || 'Question not found'}
                                        </div>
                                        <div className="text-gray-400 text-xs mt-1">
                                            {r.questions ? `${r.questions.category_id}/${r.questions.topic_id}` : r.question_id}
                                            {r.questions?.is_archived && <span className="ml-2 text-xs text-red-400">Archived</span>}
                                        </div>
                                        <div className="text-gray-400 text-sm">{r.reason}</div>
                                        <div className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleString()}</div>
                                    </div>
                                    <div className="flex gap-2 text-sm">
                                        {r.questions && !r.questions.is_archived && (
                                            <>
                                                <button
                                                    onClick={async () => {
                                                        const { data, error } = await supabase
                                                            .from('questions')
                                                            .select('id, category_id, topic_id, question, options, correct_answer')
                                                            .eq('id', r.questions.id)
                                                            .single();
                                                        if (!error && data) {
                                                            setQuestionForm({
                                                                category_id: data.category_id,
                                                                topic_id: data.topic_id,
                                                                question: data.question,
                                                                options: data.options || ['', '', '', ''],
                                                                correct_answer: data.correct_answer
                                                            });
                                                            setEditingQuestionId(data.id);
                                                            setActiveTab('questions');
                                                        }
                                                    }}
                                                    className="px-3 py-1 rounded-lg bg-white/5 text-gray-300"
                                                >
                                                    Edit Question
                                                </button>
                                                <button
                                                    onClick={() => deleteQuestion(r.questions.id)}
                                                    className="px-3 py-1 rounded-lg bg-white/5 text-red-300"
                                                >
                                                    Archive
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={async () => {
                                                await supabase.from('question_reports').update({ status: 'reviewed' }).eq('id', r.id);
                                                loadAll();
                                            }}
                                            className="px-3 py-1 rounded-lg bg-white/5 text-gray-300"
                                        >
                                            Mark Reviewed
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await supabase.from('question_reports').update({ status: 'dismissed' }).eq('id', r.id);
                                                loadAll();
                                            }}
                                            className="px-3 py-1 rounded-lg bg-white/5 text-gray-300"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-gray-400 text-sm">Range</span>
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                                    value={analyticsRange}
                                    onChange={(e) => setAnalyticsRange(e.target.value)}
                                >
                                    <option value="7">Last 7 days</option>
                                    <option value="30">Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                    <option value="all">All time</option>
                                </select>
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                                    value={analyticsCategory}
                                    onChange={(e) => { setAnalyticsCategory(e.target.value); setAnalyticsTopic(''); }}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <select
                                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                                    value={analyticsTopic}
                                    onChange={(e) => setAnalyticsTopic(e.target.value)}
                                    disabled={!analyticsCategory}
                                >
                                    <option value="">All Topics</option>
                                    {topics.filter(t => !analyticsCategory || t.category_id === analyticsCategory)
                                        .map((t) => <option key={`${t.category_id}-${t.id}`} value={t.id}>{t.name}</option>)}
                                </select>
                                <button
                                    onClick={() => exportAnalyticsCsv(analytics)}
                                    className="px-3 py-2 rounded-xl bg-white/5 text-gray-300 hover:text-white"
                                >
                                    Export CSV
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="text-gray-400 text-sm">Total Active Users</div>
                                    <div className="text-white text-2xl font-bold">
                                        {analytics.reduce((acc, r) => acc + (r.active_users || 0), 0)}
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="text-gray-400 text-sm">Total Completions</div>
                                    <div className="text-white text-2xl font-bold">
                                        {analytics.reduce((acc, r) => acc + (r.quiz_completions || 0), 0)}
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                    <div className="text-gray-400 text-sm">Avg Completion Rate</div>
                                    <div className="text-white text-2xl font-bold">
                                        {analytics.length > 0
                                            ? Math.round(analytics.reduce((acc, r) => acc + (r.completion_rate || 0), 0) / analytics.length)
                                            : 0}%
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="text-gray-400 text-sm mb-3">Completions Trend</div>
                                {analyticsLoading && (
                                    <div className="h-28 bg-white/10 rounded-xl animate-pulse" />
                                )}
                                {!analyticsLoading && analytics.length === 0 && (
                                    <div className="text-gray-400 text-sm">No analytics data for this filter.</div>
                                )}
                                {!analyticsLoading && analytics.length > 0 && (
                                    <div className="relative h-32">
                                        <div className="absolute inset-0 flex items-end gap-2">
                                            {analytics.map((r) => (
                                                <div
                                                    key={r.day}
                                                    className="flex-1 bg-secondary/40 rounded-t-md"
                                                    style={{ height: `${r.completionsPct}%` }}
                                                    title={`${r.day}: ${r.quiz_completions} completions`}
                                                />
                                            ))}
                                        </div>
                                        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${analytics.length - 1} 100`} preserveAspectRatio="none">
                                            <polyline
                                                fill="none"
                                                stroke="rgba(108,93,211,0.9)"
                                                strokeWidth="2"
                                                points={analytics.map((r, i) => `${i},${100 - r.completion_rate}`).join(' ')}
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="text-gray-400 text-sm mb-3">Daily Activity</div>
                                <div className="space-y-2">
                                    {analytics.map((r) => (
                                        <div key={r.day} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-300">{r.day}</span>
                                            <span className="text-gray-400">{r.active_users} users</span>
                                            <span className="text-gray-400">{r.quiz_completions} quizzes</span>
                                            <span className="text-secondary">{r.completion_rate}%</span>
                                        </div>
                                    ))}
                                </div>
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
                        { name: 'Categories', icon: 'C', tab: 'categories' },
                        { name: 'Topics', icon: 'T', tab: 'topics' },
                        { name: 'Questions', icon: 'Q', tab: 'questions' },
                        { name: 'Sets', icon: 'S', tab: 'sets' },
                        { name: 'Badges', icon: 'B', tab: 'badges' },
                        { name: 'Reports', icon: 'R', tab: 'reports' },
                        { name: 'Analytics', icon: 'A', tab: 'analytics' }
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



