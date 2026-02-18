import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, RotateCcw, Quote, Target } from "lucide-react";

import {
    getFeedbackByInterviewId,
    getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import SkillRadarChart from "@/components/SkillRadarChart";
import PerformanceGauge from "@/components/PerformanceGauge";
import CategoryList from "@/components/CategoryList";
import InsightCard from "@/components/InsightCard";
import BehavioralAnalysis from "@/components/BehavioralAnalysis";
import { RouteParams } from "@/types";

const Feedback = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user.id,
    });

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

                {/* Tier 1: Core Metrics Snapshot */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Mastery Gauge */}
                    <div className="lg:col-span-4 glass-card-extreme p-8 flex flex-col items-center justify-center rounded-[2.5rem]">
                        <PerformanceGauge score={feedback.totalScore} />
                    </div>

                    {/* Mission Constants (Grid of 4) */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        <div className="glass-card-extreme p-10 flex flex-col gap-8 group hover:translate-y-[-4px] transition-all duration-500 rounded-[2.5rem]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary-500/10 text-primary-200">
                                    <Target className="size-4" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-light-400">
                                    Mission Constants
                                </h4>
                            </div>

                            <div className="grid grid-cols-2 gap-y-12 gap-x-6">
                                {[
                                    {
                                        label: "Intelligence",
                                        value: `${(interview.questions || []).length} Questions`,
                                    },
                                    { label: "Level", value: interview.level },
                                    { label: "Sector", value: interview.role },
                                    {
                                        label: "Deployment",
                                        value: interview.type,
                                    },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-1"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest text-light-600/50">
                                            {stat.label}
                                        </span>
                                        <span className="text-xl font-black text-white capitalize">
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Performance Vector (Radar) */}
                        <div className="flex flex-col p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl relative overflow-hidden group">
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
                                    AI Evaluator • Gemini Flash Engine 2.0
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
            </div>
        </div>
    );
};

export default Feedback;
