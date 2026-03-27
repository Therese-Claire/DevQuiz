import React, { useEffect, useMemo, useState } from 'react';
import { fetchLeaderboard, fetchMetadata } from '../services/api';
import { categories as displayCategories, topicsByCategory as displayTopics } from '../data/quizMetaData';
import { useAuth } from '../context/AuthContext';

const timeTabs = [
  { label: 'All Time', value: 'all' },
  { label: 'Weekly', value: '7' },
  { label: 'Monthly', value: '30' },
];

const Leaderboard = () => {
  const { user } = useAuth();
  const [categoryId, setCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availableTopics, setAvailableTopics] = useState([]);

  useEffect(() => {
    const loadTopics = async () => {
      const meta = await fetchMetadata();
      const backendTopics = meta.topicsByCategory?.[categoryId] || [];
      const merged = backendTopics.map((t) => {
        const display = displayTopics[categoryId]?.find((d) => d.id === t.topicId);
        return display || { id: t.topicId, name: t.topicId };
      });
      setAvailableTopics(merged);
    };
    if (categoryId) loadTopics();
    else setAvailableTopics([]);
  }, [categoryId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const since =
          timeFilter === 'all' ? null : new Date(Date.now() - Number(timeFilter) * 24 * 60 * 60 * 1000).toISOString();
        const data = await fetchLeaderboard({ categoryId, topicId, since });
        setRows(data);
      } catch (e) {
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId, topicId, timeFilter]);

  const userRank = useMemo(() => {
    if (!user?.id || rows.length === 0) return null;
    const idx = rows.findIndex((r) => r.user_id === user.id);
    if (idx === -1) return null;
    return idx + 1;
  }, [rows, user?.id]);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leaderboard.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = ['rank', 'username', 'user_id', 'category_id', 'topic_id', 'avg_percentage', 'total_score'];
    const csvRows = [
      headers.join(','),
      ...rows.map((r, idx) => ([
        idx + 1,
        r.username || 'User',
        r.user_id,
        r.category_id,
        r.topic_id,
        r.avg_percentage,
        r.total_score,
      ].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leaderboard.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-gray-400 mb-8">Top performers by category, topic, and timeframe</p>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {timeTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setTimeFilter(tab.value)}
                className={`px-3 py-1 rounded-lg text-sm ${timeFilter === tab.value ? 'bg-primary text-white' : 'bg-white/5 text-gray-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCsv}
              className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            >
              Export CSV
            </button>
            <button
              onClick={exportJson}
              className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            >
              Export JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <select
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setTopicId(''); }}
          >
            <option value="">All Categories</option>
            {displayCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            disabled={!categoryId}
          >
            <option value="">All Topics</option>
            {availableTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          {loading && <div className="text-gray-400">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          {!loading && !error && rows.length === 0 && (
            <div className="text-gray-400">No leaderboard data yet.</div>
          )}
          {!loading && !error && rows.length > 0 && (
            <div className="mb-4 text-sm text-gray-400">
              Your rank: {userRank ? `#${userRank}` : 'Not ranked yet'}
            </div>
          )}
          {!loading && !error && rows.length > 0 && (
            <div className="space-y-3">
              {rows.slice(0, 50).map((r, idx) => (
                <div
                  key={`${r.user_id}-${r.category_id}-${r.topic_id}-${idx}`}
                  className={`flex items-center justify-between rounded-xl p-4 border ${r.user_id === user?.id
                    ? 'bg-primary/20 border-primary/50 shadow-[0_0_20px_rgba(108,93,211,0.35)]'
                    : 'bg-white/5 border-white/10'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl text-secondary font-bold">{idx + 1}</div>
                    <div>
                      <div className="text-white font-semibold">
                        {r.username || 'User'}
                        {r.user_id === user?.id && <span className="ml-2 text-xs text-secondary">You</span>}
                      </div>
                      <div className="text-gray-400 text-sm">{r.category_id}/{r.topic_id}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{r.avg_percentage}%</div>
                    <div className="text-gray-400 text-sm">{r.total_score} pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
