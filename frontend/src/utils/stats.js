export function computeStreak(results) {
    if (!results || results.length === 0) return 0;
    const days = new Set(
        results
            .map((r) => new Date(r.created_at || r.createdAt))
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

export function computeTopicPerformance(results) {
    if (!results || results.length === 0) return {};
    const performance = {};
    results.forEach(r => {
        const key = `${r.category_id}:${r.topic_id}`;
        if (!performance[key]) {
            performance[key] = { 
                categoryId: r.category_id, 
                topicId: r.topic_id, 
                scores: [], 
                best: 0,
                totalAttempts: 0 
            };
        }
        performance[key].scores.push(r.percentage);
        performance[key].best = Math.max(performance[key].best, r.percentage);
        performance[key].totalAttempts += 1;
    });
    return performance;
}
