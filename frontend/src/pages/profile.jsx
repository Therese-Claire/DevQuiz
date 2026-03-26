import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyResults } from "../services/api";
import { categories, topicsByCategory } from "../data/quizMetaData";

export default function Profile() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
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
    loadResults();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalQuizzes = results.length;
  const totalScore = results.reduce((acc, r) => acc + (r.score || 0), 0);
  const totalQuestions = results.reduce((acc, r) => acc + (r.total || 0), 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

  const streakDays = computeStreak(results);

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
            <Stat title="Streak" value={loading ? "..." : `${streakDays} days`} />
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
