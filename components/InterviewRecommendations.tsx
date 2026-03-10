"use client";

import Link from "next/link";
import { Target, TrendingUp, Brain, ArrowRight, Lightbulb } from "lucide-react";

interface RecommendationData {
    feedbacks: {
        totalScore: number;
        categoryScores: { name: string; score: number; comment: string }[];
        areasForImprovement: string[];
        interview: {
            role: string;
            type: string;
            techstack: string[];
        };
    }[];
    interviews: {
        role: string;
        type: string;
        techstack: string[];
    }[];
}

interface Recommendation {
    icon: any;
    title: string;
    description: string;
    reason: string;
    accentColor: string;
}

function generateRecommendations(data: RecommendationData): Recommendation[] {
    const { feedbacks, interviews } = data;
    const recommendations: Recommendation[] = [];

    if (!feedbacks || feedbacks.length === 0) return recommendations;

    // 1. Analyze weak categories across all feedbacks
    const categoryAgg: Record<string, { total: number; count: number }> = {};
    feedbacks.forEach((f) => {
        if (Array.isArray(f.categoryScores)) {
            f.categoryScores.forEach((cat) => {
                if (!categoryAgg[cat.name])
                    categoryAgg[cat.name] = { total: 0, count: 0 };
                categoryAgg[cat.name].total += cat.score;
                categoryAgg[cat.name].count += 1;
            });
        }
    });

    const weakCategories = Object.entries(categoryAgg)
        .map(([name, { total, count }]) => ({
            name,
            avg: Math.round(total / count),
        }))
        .filter((c) => c.avg < 70)
        .sort((a, b) => a.avg - b.avg);

    if (weakCategories.length > 0) {
        const weakest = weakCategories[0];
        recommendations.push({
            icon: Target,
            title: `Focus on ${weakest.name}`,
            description: `Your average score for ${weakest.name} is ${weakest.avg}%. A targeted practice session can boost this significantly.`,
            reason: "Based on your lowest category score",
            accentColor: "#f472b6",
        });
    }

    // 2. Check interview type balance
    const typeCounts: Record<string, number> = {};
    interviews.forEach((i) => {
        typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
    });

    const types = ["technical", "behavioral", "mixed"];
    const untried = types.filter((t) => !typeCounts[t]);
    if (untried.length > 0) {
        const suggest = untried[0];
        const labels: Record<string, string> = {
            technical: "Technical",
            behavioral: "Behavioral",
            mixed: "Mixed",
        };
        recommendations.push({
            icon: Brain,
            title: `Try a ${labels[suggest]} Interview`,
            description: `You haven't practiced ${labels[suggest].toLowerCase()} interviews yet. Diversifying builds well-rounded skills.`,
            reason: "Diversify your practice",
            accentColor: "#a78bfa",
        });
    }

    // 3. Score trend — encourage if improving, suggest more practice if declining
    if (feedbacks.length >= 2) {
        const recent = feedbacks.slice(0, Math.ceil(feedbacks.length / 2));
        const older = feedbacks.slice(Math.ceil(feedbacks.length / 2));
        const recentAvg =
            recent.reduce((acc, f) => acc + f.totalScore, 0) / recent.length;
        const olderAvg =
            older.reduce((acc, f) => acc + f.totalScore, 0) / older.length;
        const trend = recentAvg - olderAvg;

        if (trend > 5) {
            recommendations.push({
                icon: TrendingUp,
                title: "You're on a Roll! 🔥",
                description: `Your scores improved by ${Math.round(trend)}% recently. Keep the momentum — try a harder role or bump up to Senior level.`,
                reason: "Positive score trend detected",
                accentColor: "#34d399",
            });
        } else if (trend < -5) {
            recommendations.push({
                icon: Lightbulb,
                title: "Review Your Fundamentals",
                description: `Your recent scores dipped by ${Math.abs(Math.round(trend))}%. Revisit your core strengths and try a shorter, focused session.`,
                reason: "Score trend needs attention",
                accentColor: "#fbbf24",
            });
        }
    }

    return recommendations.slice(0, 3);
}

const InterviewRecommendations = ({
    feedbacks,
    interviews,
}: RecommendationData) => {
    const recommendations = generateRecommendations({ feedbacks, interviews });

    if (recommendations.length === 0) return null;

    return (
        <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-end justify-between border-b border-white/5 pb-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Recommended for You
                    </h2>
                    <p className="text-md text-light-400">
                        Personalized suggestions based on your performance
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {recommendations.map((rec, i) => {
                    const Icon = rec.icon;
                    return (
                        <Link
                            key={i}
                            href="/interview"
                            className="group relative rounded-[2rem] p-7 border border-white/5 bg-dark-200/60 backdrop-blur-xl hover:border-white/15 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 -mt-8 -mr-8"
                                style={{ background: rec.accentColor }}
                            />

                            <div className="relative z-10 flex flex-col gap-3">
                                <div
                                    className="size-11 rounded-xl flex items-center justify-center border border-white/10"
                                    style={{
                                        background: `${rec.accentColor}10`,
                                    }}
                                >
                                    <Icon
                                        className="size-5"
                                        style={{ color: rec.accentColor }}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <h3 className="text-base font-black text-white tracking-tight leading-snug">
                                        {rec.title}
                                    </h3>
                                    <p className="text-sm text-light-400 leading-relaxed">
                                        {rec.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                                    <span className="text-[10px] font-bold text-light-600 uppercase tracking-widest">
                                        {rec.reason}
                                    </span>
                                    <ArrowRight className="size-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default InterviewRecommendations;
