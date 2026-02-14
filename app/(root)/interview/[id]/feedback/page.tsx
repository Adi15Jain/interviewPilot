import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, RotateCcw, Quote } from "lucide-react";

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
import { RouteParams } from "@/types";

const Feedback = async ({ params }: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user?.id!,
    });

    if (!feedback) redirect("/");

    return (
        <main className="min-h-screen bg-[#020408] text-white selection:bg-primary-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/5 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/5 blur-[120px] rounded-full animate-pulse-slow active" />
            </div>

            <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col gap-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-light-100/60 hover:text-primary-200 transition-colors w-fit group"
                        >
                            <ChevronLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
                            Return to Mission Control
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase">
                            Performance{" "}
                            <span className="text-primary-200">Analysis</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-black uppercase tracking-[0.2em] text-light-100/40">
                            <span className="text-light-100">
                                {interview.role}
                            </span>
                            <span className="size-1 bg-white/20 rounded-full" />
                            <span>
                                {dayjs(feedback.createdAt).format(
                                    "MMM D, YYYY",
                                )}
                            </span>
                            <span className="size-1 bg-white/20 rounded-full" />
                            <span>ID: {id.slice(-6).toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            asChild
                            className="h-11 px-6 bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-black uppercase tracking-widest transition-all glass-morphism rounded-xl text-white shadow-lg shadow-black/20"
                        >
                            <Link href="/">Dashboard</Link>
                        </Button>
                        <Button
                            asChild
                            className="h-11 px-6 bg-primary-200 text-black hover:bg-white text-xs font-black uppercase tracking-widest transition-all rounded-xl shadow-[0_0_30px_rgba(202,197,254,0.3)]"
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <PerformanceGauge score={feedback.totalScore} />
                    <div className="flex flex-col p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl relative overflow-hidden group">
                        <SkillRadarChart
                            data={(feedback.categoryScores as any).map(
                                (c: any) => ({
                                    name: c.name,
                                    score: c.score,
                                }),
                            )}
                        />
                    </div>
                </div>

                {/* Tier 2: Strategic Summary (The Narrative) */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="p-10 md:p-14 rounded-[3rem] bg-gradient-to-br from-primary-500/10 via-primary-500/[0.02] to-transparent border border-primary-500/10 relative overflow-hidden group">
                        <Quote className="absolute -top-6 -left-6 size-32 text-primary-500/5 -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
                        <div className="relative flex flex-col gap-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-primary-200">
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

                {/* Tier 3: In-Depth Breakdown & Qualitative Analysis */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                    {/* Detailed Category Progress */}
                    <div className="xl:col-span-12">
                        <CategoryList
                            categories={feedback.categoryScores as any}
                        />
                    </div>

                    {/* Qualitative Insights Grid */}
                    <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <InsightCard
                            title="Mission Successes"
                            type="strength"
                            items={feedback.strengths}
                        />
                        <InsightCard
                            title="Growth Vectors"
                            type="improvement"
                            items={feedback.areasForImprovement}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Feedback;
