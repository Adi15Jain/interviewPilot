import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ChevronLeft,
    RotateCcw,
    Quote,
    Target,
    TrendingUp,
    Users,
    Award,
} from "lucide-react";

import {
    getFeedbackByInterviewId,
    getInterviewById,
    getRoleBenchmark,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import SkillRadarChart from "@/components/SkillRadarChart";
import PerformanceGauge from "@/components/PerformanceGauge";
import CategoryList from "@/components/CategoryList";
import InsightCard from "@/components/InsightCard";
import BehavioralAnalysis from "@/components/BehavioralAnalysis";
import LearningHub from "@/components/LearningHub";
import CareerRoadmap from "@/components/CareerRoadmap";
import ReportCard from "@/components/ReportCard";
import { RouteParams } from "@/types";

const Feedback = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const [feedback, benchmark] = await Promise.all([
        getFeedbackByInterviewId({ interviewId: id, userId: user.id }),
        getRoleBenchmark(interview.role, user.id),
    ]);

    if (!feedback) redirect("/");

    return (
        <div className="relative min-h-screen selection:bg-primary-500/30">
            {/* Ambient Background Layer */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/10 to-transparent rotate-[35deg] blur-sm opacity-50" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 pt-2 pb-48 flex flex-col gap-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-light-100/40 hover:text-primary-200 transition-colors w-fit group"
                        >
                            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Mission Control
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                            Performance{" "}
                            <span className="text-primary-200">Analysis</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-6 text-[12px] font-black uppercase tracking-widest text-light-600">
                            <span className="text-primary-200/80">
                                {interview.role}
                            </span>
                            <span className="size-2 bg-white/50 rounded-full" />
                            <span className="text-white">
                                {dayjs(feedback.createdAt).format(
                                    "MMM D, YYYY",
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            asChild
                            variant="ghost"
                            className="h-11 px-6 border border-white/5 bg-white/[0.02] hover:bg-white/5 text-xs font-black uppercase tracking-widest rounded-xl text-white"
                        >
                            <Link href="/">Dashboard</Link>
                        </Button>
                        <Button
                            asChild
                            className="h-11 px-6 bg-primary-200 text-black hover:bg-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(202,197,254,0.3)] transition-all hover:scale-105"
                        >
                            <Link
                                href={`/interview/${id}`}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw className="size-3" />
                                Retake
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Industry Benchmark Bar */}
                {benchmark.totalInterviews > 0 && (
                    <div className="glass-card-extreme p-8 rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <TrendingUp className="size-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-light-400">
                                            Industry Benchmark
                                        </h4>
                                        <p className="text-[10px] text-light-600 font-bold uppercase tracking-wider">
                                            vs. all {interview.role} interviews
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                        <Users className="size-3.5 text-light-400" />
                                        <span className="text-xs font-black text-light-100 tabular-nums">
                                            {benchmark.totalInterviews} sessions
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-200/10 border border-primary-200/20">
                                        <Award className="size-3.5 text-primary-200" />
                                        <span className="text-xs font-black text-primary-200">
                                            Top {benchmark.percentile}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Comparison Bar */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-light-600">
                                    <span>Score Distribution</span>
                                    <span>100%</span>
                                </div>
                                <div className="relative h-8 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    {/* Role Average Marker */}
                                    <div
                                        className="absolute top-0 bottom-0 w-0.5 bg-light-400/60 z-20"
                                        style={{
                                            left: `${benchmark.roleAvg}%`,
                                        }}
                                    />
                                    <div
                                        className="absolute -top-6 z-20 flex flex-col items-center"
                                        style={{
                                            left: `${benchmark.roleAvg}%`,
                                            transform: "translateX(-50%)",
                                        }}
                                    >
                                        <span className="text-[9px] font-black text-light-400 whitespace-nowrap">
                                            Avg: {benchmark.roleAvg}%
                                        </span>
                                    </div>
                                    {/* User Score Bar */}
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-200/40 to-primary-200/80 rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${feedback.totalScore}%`,
                                        }}
                                    />
                                    <div
                                        className="absolute inset-y-0 flex items-center z-10"
                                        style={{
                                            left: `${Math.min(feedback.totalScore, 92)}%`,
                                        }}
                                    >
                                        <span className="text-[10px] font-black text-white ml-2 whitespace-nowrap">
                                            You: {feedback.totalScore}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tier 1: Core Metrics Snapshot */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Mastery Gauge */}
                    <div className="lg:col-span-4 glass-card-extreme p-8 flex flex-col items-center justify-center rounded-[2.5rem]">
                        <PerformanceGauge score={feedback.totalScore} />
                    </div>

                    {/* Mission Constants (Grid of 4) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        <div className="glass-card-extreme p-8 flex flex-col gap-10 group hover:translate-y-[-4px] transition-all duration-500 rounded-[3rem] border-white/[0.08]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-200 border border-primary-500/20">
                                        <Target className="size-5" />
                                    </div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-light-400">
                                        Mission Parameters
                                    </h4>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary-200">
                                        Verified
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                                {[
                                    {
                                        label: "Intelligence",
                                        value: `${(interview.questions || []).length} Qs`,
                                        icon: <Quote className="size-3" />,
                                    },
                                    {
                                        label: "Expertise",
                                        value: interview.level,
                                        icon: <Target className="size-3" />,
                                    },
                                    {
                                        label: "Specialization",
                                        value: interview.role,
                                        icon: <Target className="size-3" />,
                                    },
                                    {
                                        label: "Protocol",
                                        value: interview.type,
                                        icon: <RotateCcw className="size-3" />,
                                    },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-2 relative"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="text-primary-200/60 group-hover:text-primary-200 transition-colors">
                                                {stat.icon}
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-light-600/60 font-mono">
                                                {stat.label}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xl md:text-2xl font-black text-white leading-tight">
                                                {stat.value}
                                            </span>
                                            <div className="h-[2px] w-0 group-hover:w-8 bg-primary-500/40 transition-all duration-700 mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Vector (Radar) */}
                        <div className="flex flex-col p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl relative group">
                            <SkillRadarChart
                                data={(
                                    (feedback.categoryScores as any) || []
                                ).map((c: any) => ({
                                    name: c.name,
                                    score: c.score,
                                }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Tier 2: Strategic Summary (The Narrative) */}
                <div className="relative z-10 w-full">
                    <div className="p-10 md:p-14 rounded-[3rem] bg-gradient-to-br from-primary-500/10 via-primary-500/[0.02] to-transparent border border-primary-500/10 relative overflow-hidden group">
                        <Quote className="absolute -top-6 -left-6 size-32 text-primary-500/5 -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
                        <div className="relative flex flex-col gap-6">
                            <h3 className="text-lg font-black uppercase tracking-[0.5em] text-primary-200 pl-14">
                                Strategic Assessment
                            </h3>
                            <p className="text-xl md:text-2xl font-bold text-light-100 leading-tight tracking-tight">
                                {feedback.finalAssessment}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="size-1.5 rounded-full bg-primary-200 animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest text-light-600">
                                    AI Evaluator • Gemini Flash Engine 2.5
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tier 2.5: Behavioral Analysis */}
                <div className="w-full animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <BehavioralAnalysis
                        emotionalAnalysis={
                            (feedback.emotionalAnalysis as any[]) || []
                        }
                        behavioralTips={feedback.behavioralTips || []}
                    />
                </div>

                {/* Tier 2.7: Learning Hub (The Astro-Academy) */}
                <div className="w-full">
                    <LearningHub
                        learningPath={(feedback.learningPath as any[]) || []}
                    />
                </div>

                {/* Tier 2.8: Career Roadmap (Gap Analysis) */}
                <div className="w-full">
                    <CareerRoadmap
                        currentScores={(feedback.categoryScores as any) || []}
                        totalScore={feedback.totalScore}
                        role={interview.role}
                    />
                </div>

                {/* Tier 3: In-Depth Breakdown & Qualitative Analysis */}
                <div className="flex flex-col gap-16">
                    {/* Detailed Category Progress */}
                    <CategoryList
                        categories={(feedback.categoryScores as any) || []}
                    />

                    {/* Qualitative Insights Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <InsightCard
                            title="Mission Successes"
                            type="strength"
                            items={feedback.strengths || []}
                        />
                        <InsightCard
                            title="Growth Vectors"
                            type="improvement"
                            items={feedback.areasForImprovement || []}
                        />
                    </div>
                </div>

                {/* Tier 4: Export & Share */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-lg font-black uppercase tracking-[0.5em] text-light-600">
                        Export Report
                    </h3>
                    <ReportCard
                        userName={user.name}
                        role={interview.role}
                        date={dayjs(feedback.createdAt).format("MMM D, YYYY")}
                        totalScore={feedback.totalScore}
                        categoryScores={(feedback.categoryScores as any) || []}
                        strengths={feedback.strengths || []}
                        finalAssessment={feedback.finalAssessment}
                        benchmarkPercentile={benchmark.percentile}
                    />
                </div>
            </div>
        </div>
    );
};

export default Feedback;
