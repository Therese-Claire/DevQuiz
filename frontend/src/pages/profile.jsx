import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyResults } from "../services/api";
import { supabase } from "../services/supabase";
import { categories, topicsByCategory } from "../data/quizMetaData";

export default function Profile() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadResults = async () => {
      try {
        setLoading(true);
        const data = await fetchMyResults();
        if (isMounted) {
          setResults(data.results || []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load your stats.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    const loadBadges = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;
      const { data } = await supabase
        .from('user_badges')
        .select('badge_id, badges(name, description, icon)')
        .eq('user_id', userId);
      setBadges(data || []);
    };
    loadResults();
    loadBadges();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalQuizzes = results.length;
  const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0);
  const totalQuestions = results.reduce((acc, r) => acc + (r.total || 0), 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
  const bestPercentage = results.length > 0
    ? Math.max(...results.map((r) => r.percentage || Math.round((r.score / r.total) * 100)))
    : 0;

  const streakDays = computeStreak(results);
  const topicPerformance = computeTopicPerformance(results);
  const badgeProgress = computeBadgeProgress({ results, streakDays, badges });

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-16 left-8 w-72 h-72 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-16 right-8 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl w-full">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-3xl shadow-lg">
              👤
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">
                {user?.username || "Guest User"}
              </h1>
              <p className="text-gray-400">Quiz Enthusiast</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Stat title="Quizzes" value={loading ? "..." : String(totalQuizzes)} />
            <Stat title="Accuracy" value={loading ? "..." : `${accuracy}%`} />
            <Stat title="Best Score" value={loading ? "..." : `${bestPercentage}%`} />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Recent Activity
            </h2>
            {loading && (
              <div className="space-y-3">
                <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
              </div>
            )}
            {!loading && error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            {!loading && !error && results.length === 0 && (
              <p className="text-gray-400">No quiz activity yet.</p>
            )}
            {!loading && !error && results.length > 0 && (
              <div className="space-y-3">
                {results.slice(0, 3).map((result) => (
                  <div
                    key={result._id}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {getCategoryName(result.categoryId)} / {getTopicName(result.categoryId, result.topicId)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Score: {result.score}/{result.total}
                      </p>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {formatDate(result.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Topic Performance
            </h2>
            {loading && (
              <div className="space-y-3">
                <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
                <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
              </div>
            )}
            {!loading && topicPerformance.length === 0 && (
              <p className="text-gray-400">No topic data yet.</p>
            )}
            {!loading && topicPerformance.length > 0 && (
              <div className="space-y-3">
                {topicPerformance.slice(0, 5).map((t) => (
                  <div
                    key={`${t.categoryId}-${t.topicId}`}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {getCategoryName(t.categoryId)} / {getTopicName(t.categoryId, t.topicId)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Attempts: {t.count}
                      </p>
                    </div>
                    <div className="text-secondary font-semibold">
                      {t.avg}% avg
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-3">Badges</h2>
            {badges.length === 0 && !loading && (
              <p className="text-gray-400">No badges yet. Complete quizzes to earn some!</p>
            )}
            {badgeProgress.length > 0 && (
              <div className="mb-6 space-y-3">
                {badgeProgress.map((b) => (
                  <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-semibold">{b.title}</div>
                      <div className="text-xs text-gray-400">{b.subtitle}</div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-primary transition-all"
                        style={{ width: `${Math.round(b.progress * 100)}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {b.completed ? 'Unlocked' : `Progress ${Math.round(b.progress * 100)}%`}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {badges.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((b, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="text-2xl mb-2">{b.badges?.icon || '🏅'}</div>
                    <div className="text-white font-semibold">{b.badges?.name || b.badge_id}</div>
                    <div className="text-gray-400 text-sm">{b.badges?.description || ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function getCategoryName(categoryId) {
  return categories.find((c) => c.id === categoryId)?.name || categoryId;
}

function getTopicName(categoryId, topicId) {
  return topicsByCategory[categoryId]?.find((t) => t.id === topicId)?.name || topicId;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString();
}

function computeStreak(results) {
  if (!results || results.length === 0) return 0;
  const days = new Set(
    results
      .map((r) => new Date(r.createdAt))
      .filter((d) => !Number.isNaN(d.getTime()))
      .map((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime())
  );
  const sortedDays = Array.from(days).sort((a, b) => b - a);
  let streak = 0;
  let current = new Date();
  current = new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
  for (const day of sortedDays) {
    if (day === current) {
      streak += 1;
      current -= 24 * 60 * 60 * 1000;
    } else if (day < current) {
      break;
    }
  }
  return streak;
}

function computeTopicPerformance(results) {
  const map = new Map();
  for (const r of results) {
    const key = `${r.category_id || r.categoryId}|${r.topic_id || r.topicId}`;
    const categoryId = r.category_id || r.categoryId;
    const topicId = r.topic_id || r.topicId;
    const percentage = r.percentage || Math.round((r.score / r.total) * 100);
    const current = map.get(key) || { categoryId, topicId, total: 0, count: 0 };
    current.total += percentage;
    current.count += 1;
    map.set(key, current);
  }
  return Array.from(map.values())
    .map((t) => ({ ...t, avg: Math.round(t.total / t.count) }))
    .sort((a, b) => b.avg - a.avg);
}

function computeBadgeProgress({ results, streakDays, badges }) {
  const earned = new Set((badges || []).map((b) => b.badge_id));
  const totalQuizzes = results.length;
  const perfectCount = results.filter((r) => {
    const percentage = r.percentage ?? Math.round((r.score / r.total) * 100);
    return percentage === 100;
  }).length;

  const definitions = [
    {
      id: 'first_quiz',
      title: 'First Quiz',
      subtitle: `${Math.min(totalQuizzes, 1)}/1 complete`,
      progress: Math.min(totalQuizzes / 1, 1),
    },
    {
      id: 'perfect_score',
      title: 'Perfect Score',
      subtitle: `${Math.min(perfectCount, 1)}/1 perfect`,
      progress: Math.min(perfectCount / 1, 1),
    },
    {
      id: 'hot_streak_3',
      title: '3 Day Streak',
      subtitle: `${Math.min(streakDays, 3)}/3 days`,
      progress: Math.min(streakDays / 3, 1),
    },
    {
      id: 'hot_streak_7',
      title: '7 Day Streak',
      subtitle: `${Math.min(streakDays, 7)}/7 days`,
      progress: Math.min(streakDays / 7, 1),
    },
  ];

  return definitions.map((d) => ({
    ...d,
    completed: earned.has(d.id),
    progress: earned.has(d.id) ? 1 : d.progress,
    subtitle: earned.has(d.id) ? 'Completed' : d.subtitle,
  }));
}
