"use client";

import { TrendingUp, Award, Target, ChevronRight } from "lucide-react";

interface CategoryScore {
    name: string;
    score: number;
    comment: string;
}

interface CareerRoadmapProps {
    currentScores: CategoryScore[];
    totalScore: number;
    role: string;
}

const CareerRoadmap = ({
    currentScores,
    totalScore,
    role,
}: CareerRoadmapProps) => {
    // Mock data for "Senior" level benchmarks (in a real app, this could come from AI or DB)
    const seniorBenchmark = 85;
    const gap = Math.max(0, seniorBenchmark - totalScore);

    const milestones = [
        { name: "Junior", threshold: 40, completed: totalScore >= 40 },
        { name: "Mid-Level", threshold: 65, completed: totalScore >= 65 },
        { name: "Senior", threshold: 85, completed: totalScore >= 85 },
        {
            name: "Lead / Architect",
            threshold: 95,
            completed: totalScore >= 95,
        },
    ];

    return (
        <div className="flex flex-col gap-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-black uppercase tracking-[0.3em] text-primary-200">
                    Career Roadmap: {role}
                </h3>
                <p className="text-light-400 text-md tracking-wide">
                    Visualizing your journey from current performance to
                    industry leadership.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Skill Gap Analysis */}
                <div className="lg:col-span-7 glass-card p-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-200 border border-primary-500/20">
                                <TrendingUp className="size-5" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                                Skill Gap Analysis
                            </h4>
                        </div>
                        <span className="text-2xl font-black text-primary-200">
                            -{gap}%{" "}
                            <span className="text-[12px] text-light-600 uppercase">
                                to Senior
                            </span>
                        </span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {currentScores.map((cat, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between text-[12px] font-black uppercase tracking-widest">
                                    <span className="text-light-400">
                                        {cat.name}
                                    </span>
                                    <span className="text-white">
                                        {cat.score}% / {seniorBenchmark}%
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-primary-200/20 rounded-full"
                                        style={{ width: `${seniorBenchmark}%` }}
                                    />
                                    <div
                                        className="absolute top-0 left-0 h-full bg-primary-200 rounded-full transition-all duration-1000 delay-1000"
                                        style={{ width: `${cat.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progression Milestones */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {milestones.map((m, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${
                                m.completed
                                    ? "bg-primary-500/5 border-primary-500/20 text-white"
                                    : "bg-white/[0.02] border-white/5 text-light-600"
                            }`}
                        >
                            <div
                                className={`p-2 rounded-lg ${
                                    m.completed
                                        ? "bg-primary-500/20 text-primary-200"
                                        : "bg-white/5 text-light-600"
                                }`}
                            >
                                {m.completed ? (
                                    <Award className="size-4" />
                                ) : (
                                    <Target className="size-4" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black uppercase tracking-widest">
                                    {m.name}
                                </span>
                                <span className="text-[12px] opacity-60">
                                    Benchmark: {m.threshold}%
                                </span>
                            </div>
                            {m.completed && (
                                <ChevronRight className="ml-auto size-4 text-primary-200" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CareerRoadmap;
