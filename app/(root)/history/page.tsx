import Link from "next/link";
import {
    ChevronLeft,
    History,
    Search,
    Filter,
    TrendingUp,
    Target,
    Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbacksByUserId } from "@/lib/actions/general.action";
import InterviewCard from "@/components/InterviewCard";
import HistoryList from "@/components/HistoryList";
import dayjs from "dayjs";

const HistoryPage = async () => {
    const user = await getCurrentUser();
    if (!user) return null;

    const feedbacks = await getFeedbacksByUserId(user.id);
    const hasHistory = feedbacks && feedbacks.length > 0;

    // Calculate Stats
    const totalSimulations = feedbacks?.length || 0;
    const averageScore =
        totalSimulations > 0
            ? Math.round(
                  feedbacks!.reduce((acc, f) => acc + (f.totalScore || 0), 0) /
                      totalSimulations,
              )
            : 0;

    const bestScore =
        totalSimulations > 0
            ? Math.max(...feedbacks!.map((f) => f.totalScore || 0))
            : 0;

    return (
        <main className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12">
            {/* Header section with back button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-primary-200 hover:text-white transition-colors text-sm font-black uppercase tracking-widest"
                    >
                        <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                        Return to Command Center
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                            <History className="size-10 text-primary-200" />
                            Simulation History
                        </h1>
                        <p className="text-lg text-light-400 max-w-2xl">
                            Review your complete record of AI simulations,
                            performance metrics, and growth trajectories.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            {hasHistory && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card-extreme p-8 flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-primary-200/10 border border-primary-200/20 flex items-center justify-center">
                            <Target className="size-8 text-primary-200" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600 mb-1">
                                Total Simulations
                            </p>
                            <p className="text-3xl font-black text-white">
                                {totalSimulations}
                            </p>
                        </div>
                    </div>
                    <div className="glass-card-extreme p-8 flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <TrendingUp className="size-8 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600 mb-1">
                                Average Mastery
                            </p>
                            <p className="text-3xl font-black text-white">
                                {averageScore}%
                            </p>
                        </div>
                    </div>
                    <div className="glass-card-extreme p-8 flex items-center gap-6">
                        <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Award className="size-8 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600 mb-1">
                                Peak Performance
                            </p>
                            <p className="text-3xl font-black text-white">
                                {bestScore}%
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {hasHistory ? (
                <HistoryList feedbacks={feedbacks} />
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 glass-card-extreme">
                    <div className="size-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <History className="size-10 text-light-800" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white px-5">
                            No Simulation Log Detected
                        </h3>
                        <p className="text-light-400 max-w-sm mx-auto">
                            Initial data point missing. Launch your first AI
                            simulation to begin generating your performance
                            history.
                        </p>
                    </div>
                    <Button asChild className="btn-primary px-8">
                        <Link href="/interview/new">
                            Initialize First Session
                        </Link>
                    </Button>
                </div>
            )}
        </main>
    );
};

export default HistoryPage;
