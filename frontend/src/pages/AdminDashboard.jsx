import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { clearCache } from '../services/api';

// Operational Components
import AdminSidebar from '../components/admin/AdminSidebar';
import CategoryManager from '../components/admin/CategoryManager';
import TopicManager from '../components/admin/TopicManager';
import QuestionManager from '../components/admin/QuestionManager';
import MissionSetManager from '../components/admin/MissionSetManager';
import BadgeManager from '../components/admin/BadgeManager';
import ReportManager from '../components/admin/ReportManager';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics');

    // Shared State Intelligence
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

    // Protocol Forms
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
                    .select('id, category_id, topic_id, question, is_archived, difficulty, options, correct_answer', { count: 'exact' })
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
            supabase
                .from('question_reports')
                .select('id, question_id, user_id, reason, status, created_at, questions(id, question, category_id, topic_id, is_archived)')
                .order('created_at', { ascending: false })
                .then(res => {
                    let data = res.data || [];
                    if (reportStatus !== 'all') data = data.filter(r => r.status === reportStatus);
                    if (reportSince) data = data.filter(r => r.created_at >= reportSince);
                    return { data, error: res.error };
                })
        ]);

        if (catRes.error || topicRes.error || questionRes.error || setRes.error || assignRes.error || badgeRes.error || reportRes.error) {
            setError('Failed to load global intelligence matrix.');
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
            let query = supabase.from('results').select('created_at, user_id, category_id, topic_id');
            if (since) query = query.gte('created_at', since);
            if (analyticsCategory) query = query.eq('category_id', analyticsCategory);
            if (analyticsTopic) query = query.eq('topic_id', analyticsTopic);
            const { data, error } = await query;
            if (!error) setAnalytics(buildAnalytics(data || []));
            setAnalyticsLoading(false);
        };
        loadAnalytics();
    }, [analyticsRange, analyticsCategory, analyticsTopic]);

    // Categorization Protocol
    const handleCategoryCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error: err } = await supabase.from('categories').upsert({
            id: categoryForm.id.trim(),
            name: categoryForm.name.trim(),
            icon: categoryForm.icon.trim(),
            description: categoryForm.description.trim()
        });
        if (err) setError('Sector initialization failed.');
        else {
            setSuccess(editingCategoryId ? 'Sector parameters synced.' : 'New sector deployed.');
            setCategoryForm({ id: '', name: '', icon: '', description: '' });
            setEditingCategoryId(null);
            clearCache();
            loadAll();
        }
        setLoading(false);
    };

    const deleteCategory = async (id) => {
        if (!window.confirm('Archive this sector?')) return;
        setLoading(true);
        const { error: err } = await supabase.from('categories').update({ is_archived: true }).eq('id', id);
        if (err) setError('Sector archive failed.');
        else { setSuccess('Sector archived.'); clearCache(); loadAll(); }
        setLoading(false);
    };

    const restoreCategory = async (id) => {
        setLoading(true);
        const { error: err } = await supabase.from('categories').update({ is_archived: false }).eq('id', id);
        if (err) setError('Sector restore failed.');
        else { setSuccess('Sector access restored.'); clearCache(); loadAll(); }
        setLoading(false);
    };

    const bulkArchiveCategories = async () => {
        if (selectedCategories.size === 0) return;
        setLoading(true);
        const ids = Array.from(selectedCategories);
        const { error: err } = await supabase.from('categories').update({ is_archived: true }).in('id', ids);
        if (!err) { setSuccess('Sectors purged.'); setSelectedCategories(new Set()); clearCache(); loadAll(); }
        setLoading(false);
    };

    // Objective Protocol
    const handleTopicCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error: err } = await supabase.from('topics').upsert({
            id: topicForm.id.trim(),
            category_id: topicForm.category_id,
            name: topicForm.name.trim(),
            description: topicForm.description.trim()
        }, { onConflict: 'category_id,id' });
        if (err) setError('Objective deployment failed.');
        else {
            setSuccess(editingTopicKey ? 'Objective protocol synced.' : 'New objective deployed.');
            setTopicForm({ id: '', category_id: '', name: '', description: '' });
            setEditingTopicKey(null);
            clearCache();
            loadAll();
        }
        setLoading(false);
    };

    const deleteTopic = async (catId, topicId) => {
        if (!window.confirm('Archive this objective?')) return;
        setLoading(true);
        const { error: err } = await supabase.from('topics').update({ is_archived: true }).eq('category_id', catId).eq('id', topicId);
        if (err) setError('Objective archive failed.');
        else { setSuccess('Objective archived.'); clearCache(); loadAll(); }
        setLoading(false);
    };

    const restoreTopic = async (catId, topicId) => {
        setLoading(true);
        const { error: err } = await supabase.from('topics').update({ is_archived: false }).eq('category_id', catId).eq('id', topicId);
        if (err) setError('Objective restore failed.');
        else { setSuccess('Objective access restored.'); clearCache(); loadAll(); }
        setLoading(false);
    };

    const bulkArchiveTopics = async () => {
        if (selectedTopics.size === 0) return;
        setLoading(true);
        const pairs = Array.from(selectedTopics).map((key) => key.split(':'));
        await Promise.all(pairs.map(([cat, id]) => supabase.from('topics').update({ is_archived: true }).eq('category_id', cat).eq('id', id)));
        setSuccess('Objectives purged.'); setSelectedTopics(new Set()); clearCache(); loadAll();
        setLoading(false);
    };

    // Logic Protocol
    const handleQuestionCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const options = questionForm.options.map(o => o.trim()).filter(Boolean);
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
        if (err) setError('Logic node synchronization failed.');
        else {
            setSuccess(editingQuestionId ? 'Logic node updated.' : 'New logic node deployed.');
            setQuestionForm({ category_id: '', topic_id: '', question: '', options: ['', '', '', ''], correct_answer: '', difficulty: 'medium' });
            setEditingQuestionId(null);
            clearCache(); loadAll();
        }
        setLoading(false);
    };

    const deleteQuestion = async (id) => {
        setLoading(true);
        const { error: err } = await supabase.from('questions').update({ is_archived: true }).eq('id', id);
        if (err) setError('Logic node archive failed.');
        else { setSuccess('Logic node archived.'); clearCache(); loadAll(); }
        setLoading(false);
    };

    const restoreQuestion = async (id) => {
        setLoading(true);
        const { error: err } = await supabase.from('questions').update({ is_archived: false }).eq('id', id);
        if (err) setError('Logic node restore failed.');
        else { setSuccess('Logic node restored.'); clearCache(); loadAll(); }
        setLoading(false);
    };

    const bulkArchiveQuestions = async () => {
        if (selectedQuestions.size === 0) return;
        setLoading(true);
        await supabase.from('questions').update({ is_archived: true }).in('id', Array.from(selectedQuestions));
        setSuccess('Logic nodes purged.'); setSelectedQuestions(new Set()); clearCache(); loadAll();
        setLoading(false);
    };

    const bulkUnarchiveQuestions = async () => {
        if (selectedQuestions.size === 0) return;
        setLoading(true);
        await supabase.from('questions').update({ is_archived: false }).in('id', Array.from(selectedQuestions));
        setSuccess('Logic nodes restored.'); setSelectedQuestions(new Set()); clearCache(); loadAll();
        setLoading(false);
    };

    // Mission Set Protocol
    const handleSetCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error: err } = await supabase.from('quiz_sets').insert({
            name: setForm.name.trim(),
            difficulty: setForm.difficulty
        });
        if (err) setError('Mission set initialization failed.');
        else { setSuccess('New mission set deployed.'); setSetForm({ name: '', difficulty: 'mixed' }); loadAll(); }
        setLoading(false);
    };

    const autoPopulateSet = async () => {
        if (!selectedSetId) return;
        const selectedSet = quizSets.find((s) => s.id === selectedSetId);
        setLoading(true);
        await supabase.from('quiz_set_questions').delete().eq('quiz_set_id', selectedSetId);
        let query = supabase.from('questions').select('id').eq('is_archived', false).order('created_at', { ascending: false }).limit(50);
        if (selectedSet.difficulty !== 'mixed') query = query.eq('difficulty', selectedSet.difficulty);
        const { data, error } = await query;
        if (!error && data.length > 0) {
            await supabase.from('quiz_set_questions').insert(data.map((q) => ({ quiz_set_id: selectedSetId, question_id: q.id })));
            setSuccess(`Set populated with ${data.length} logic nodes.`);
        }
        loadAll(); setLoading(false);
    };

    const toggleAssignQuestion = async (qId) => {
        if (!selectedSetId) return;
        const exists = setAssignments.some(a => a.quiz_set_id === selectedSetId && a.question_id === qId);
        if (exists) await supabase.from('quiz_set_questions').delete().eq('quiz_set_id', selectedSetId).eq('question_id', qId);
        else await supabase.from('quiz_set_questions').insert({ quiz_set_id: selectedSetId, question_id: qId });
        loadAll();
    };

    // Merit Protocol
    const handleBadgeCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            id: badgeForm.id.trim(),
            name: badgeForm.name.trim(),
            description: badgeForm.description.trim(),
            icon: badgeForm.icon.trim()
        };
        const { error: err } = editingBadgeId
            ? await supabase.from('badges').update({ name: payload.name, description: payload.description, icon: payload.icon }).eq('id', editingBadgeId)
            : await supabase.from('badges').insert(payload);
        if (err) setError('Merit artifact forge failed.');
        else {
            setSuccess(editingBadgeId ? 'Artifact parameters synced.' : 'New merit artifact forged.');
            setBadgeForm({ id: '', name: '', description: '', icon: '' }); setEditingBadgeId(null); loadAll();
        }
        setLoading(false);
    };

    const deleteBadge = async (id) => {
        if (!window.confirm('Dismantle this artifact?')) return;
        setLoading(true);
        const { error: err } = await supabase.from('badges').delete().eq('id', id);
        if (err) setError('Artifact dismantle failed.');
        else { setSuccess('Artifact dismantled.'); loadAll(); }
        setLoading(false);
    };

    // Feedback Protocol
    const handleResolveReport = async (id) => {
        setLoading(true);
        const { error: err } = await supabase.from('question_reports').update({ status: 'resolved' }).eq('id', id);
        if (!err) { setSuccess('Signal resolved.'); loadAll(); }
        setLoading(false);
    };

    // Analytics Protocol
    const buildAnalytics = (rows) => {
        const map = new Map();
        for (const r of rows) {
            const d = new Date(r.created_at);
            if (Number.isNaN(d.getTime())) continue;
            const day = d.toISOString().slice(0, 10);
            if (!map.has(day)) map.set(day, { day, users: new Set(), quiz_completions: 0 });
            const entry = map.get(day);
            entry.quiz_completions += 1;
            if (r.user_id) entry.users.add(r.user_id);
        }
        const list = Array.from(map.values())
            .map((r) => ({ day: r.day, active_users: r.users.size, quiz_completions: r.quiz_completions }))
            .sort((a, b) => (a.day > b.day ? 1 : -1));
        const max = Math.max(1, ...list.map((r) => r.quiz_completions));
        return list.map((r) => ({ ...r, completionsPct: Math.round((r.quiz_completions / max) * 100) }));
    };

    const exportAnalyticsCsv = (rows) => {
        const headers = ['day', 'active_users', 'quiz_completions'];
        const csv = [headers.join(','), ...rows.map(r => `"${r.day}","${r.active_users}","${r.quiz_completions}"`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'devquiz-telemetry.csv'; a.click();
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify({ categories, topics, questions }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'devquiz-intelligence-core.json'; a.click();
    };

    return (
        <div className="min-h-screen bg-[#0a0814] flex overflow-hidden">
            {/* Command Sidebar */}
            <AdminSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                onLogout={handleLogout} 
            />

            {/* Tactical Control Room */}
            <main className="flex-1 h-screen overflow-y-auto relative pb-20 selection:bg-primary selection:text-white">
                {/* Global Status Banner */}
                <div className="sticky top-0 z-30 px-12 py-3 bg-[#0a0814]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {(error || success) && (
                            <div className={`text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 animate-reveal
                                ${error ? 'text-red-500' : 'text-secondary'}`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-secondary animate-pulse'}`} />
                                {error || success}
                            </div>
                        )}
                        {!error && !success && (
                            <div className="text-[10px] font-mono font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                                Standby for Command
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleExport} className="text-[10px] font-mono text-gray-600 hover:text-white uppercase tracking-widest transition-colors">Export Intelligence</button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-12 py-12">
                    {activeTab === 'analytics' && <AnalyticsDashboard analytics={analytics} analyticsLoading={analyticsLoading} analyticsRange={analyticsRange} setAnalyticsRange={setAnalyticsRange} analyticsCategory={analyticsCategory} setAnalyticsCategory={setAnalyticsCategory} analyticsTopic={analyticsTopic} setAnalyticsTopic={setAnalyticsTopic} categories={categories} availableTopics={topics} exportAnalyticsCsv={exportAnalyticsCsv} />}
                    {activeTab === 'categories' && <CategoryManager categories={categories} categoryForm={categoryForm} setCategoryForm={setCategoryForm} handleCategoryCreate={handleCategoryCreate} editingCategoryId={editingCategoryId} setEditingCategoryId={setEditingCategoryId} deleteCategory={deleteCategory} restoreCategory={restoreCategory} categoryTab={categoryTab} setCategoryTab={setCategoryTab} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} bulkArchiveCategories={bulkArchiveCategories} loading={loading} />}
                    {activeTab === 'topics' && <TopicManager topics={topics} categories={categories} topicForm={topicForm} setTopicForm={setTopicForm} handleTopicCreate={handleTopicCreate} editingTopicKey={editingTopicKey} setEditingTopicKey={setEditingTopicKey} deleteTopic={deleteTopic} restoreTopic={restoreTopic} topicTab={topicTab} setTopicTab={setTopicTab} selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} bulkArchiveTopics={bulkArchiveTopics} loading={loading} />}
                    {activeTab === 'questions' && <QuestionManager questions={questions} categories={categories} topics={topics} questionForm={questionForm} setQuestionForm={setQuestionForm} handleQuestionCreate={handleQuestionCreate} editingQuestionId={editingQuestionId} setEditingQuestionId={setEditingQuestionId} deleteQuestion={deleteQuestion} restoreQuestion={restoreQuestion} questionTab={questionTab} setQuestionTab={setQuestionTab} selectedQuestions={selectedQuestions} setSelectedQuestions={setSelectedQuestions} bulkArchiveQuestions={bulkArchiveQuestions} bulkUnarchiveQuestions={bulkUnarchiveQuestions} questionPage={questionPage} setQuestionPage={setQuestionPage} questionTotal={questionTotal} questionSearch={questionSearch} setQuestionSearch={setQuestionSearch} filterCategory={filterCategory} setFilterCategory={setFilterCategory} filterTopic={filterTopic} setFilterTopic={setFilterTopic} loading={loading} />}
                    {activeTab === 'sets' && <MissionSetManager quizSets={quizSets} setAssignments={setAssignments} setForm={setForm} setSetForm={setSetForm} handleSetCreate={handleSetCreate} selectedSetId={selectedSetId} setSelectedSetId={setSelectedSetId} autoPopulateSet={autoPopulateSet} toggleAssignQuestion={toggleAssignQuestion} questions={questions} loading={loading} />}
                    {activeTab === 'badges' && <BadgeManager badges={badges} badgeForm={badgeForm} setBadgeForm={setBadgeForm} handleBadgeCreate={handleBadgeCreate} editingBadgeId={editingBadgeId} setEditingBadgeId={setEditingBadgeId} deleteBadge={deleteBadge} loading={loading} />}
                    {activeTab === 'reports' && <ReportManager reports={reports} reportStatus={reportStatus} setReportStatus={setReportStatus} reportRange={reportRange} setReportRange={setReportRange} handleResolveReport={handleResolveReport} loading={loading} />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
