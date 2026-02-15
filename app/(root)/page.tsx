import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
    getInterviewsByUserId,
    getFeedbacksByUserId,
} from "@/lib/actions/general.action";
import {
    Briefcase,
    ChevronRight,
    Code,
    Scale,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import ScoreTrendChart from "@/components/ScoreTrendChart";
import CategoryProgress from "@/components/CategoryProgress";

const Home = async () => {
    const user = await getCurrentUser();

    const [userInterviews, feedbacks] = await Promise.all([
        getInterviewsByUserId(user?.id!),
        getFeedbacksByUserId(user?.id!),
    ]);

    const hasPastInterviews = userInterviews?.length! > 0;

    // Process Trend Data
    const trendData =
        feedbacks?.map((f) => ({
            date: f.createdAt,
            score: f.totalScore,
        })) || [];

    // Process Category Proficiency
    const techScores: Record<string, { total: number; count: number }> = {};
    feedbacks?.forEach((f) => {
        f.interview.techstack.forEach((tech: string) => {
            if (!techScores[tech]) techScores[tech] = { total: 0, count: 0 };
            techScores[tech].total += f.totalScore;
            techScores[tech].count += 1;
        });
    });

    const categories = Object.entries(techScores)
        .map(([name, { total, count }]) => ({
            name,
            score: Math.round(total / count),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-12 pb-20 animate-in fade-in duration-1000">
            {/* Cinematic Hero */}
            <section className="card-cta relative group/hero overflow-visible">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/5 blur-[120px] rounded-full -mr-48 -mt-48 transition-all duration-700 group-hover/hero:bg-primary-200/10" />

                <div className="flex flex-col gap-8 relative z-10 w-full lg:w-3/5">
                    <div className="flex flex-col gap-4">
                        <div className="badge-institutional animate-in slide-in-from-left duration-700">
                            <Sparkles className="size-3" />
                            <span>
                                Final Year Project • BTECH CSE AI • CCSIT, TMU
                            </span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter">
                            Master the Art of <br />
                            <span className="text-gradient-premium">
                                Interviews with AI
                            </span>
                        </h1>
                        <p className="text-xl text-light-400 max-w-xl leading-relaxed">
                            Experience professional-grade simulations tailored
                            to your career path. Practiced by the next
                            generation of AI engineers at Teerthanker Mahaveer
                            University.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <Button
                            asChild
                            className="btn-primary h-14 px-8 text-base shadow-[0_0_30px_rgba(202,197,254,0.3)] hover:scale-105 active:scale-95 transition-all"
                        >
                            <Link
                                href="/interview"
                                className="flex items-center gap-2"
                            >
                                <span>Take Interview</span>
                                <ChevronRight className="size-5" />
                            </Link>
                        </Button>
                        <div className="flex -space-x-3 items-center ml-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="size-10 rounded-full border-2 border-dark-100 bg-dark-200 flex items-center justify-center overflow-hidden transition-transform hover:scale-110 hover:z-20"
                                >
                                    <Image
                                        src={`/user-avatar.png`}
                                        alt="User"
                                        width={40}
                                        height={40}
                                        className="opacity-80"
                                    />
                                </div>
                            ))}
                            <span className="ml-6 text-xs font-bold text-light-600 uppercase tracking-widest">
                                Trusted by 500+ Students
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative w-full lg:w-2/5 flex justify-center lg:justify-end animate-in zoom-in duration-1000 delay-300 mt-10 lg:mt-0">
                    <div className="relative group/img-container">
                        <div className="absolute inset-0 bg-primary-200/20 blur-[80px] rounded-full scale-75 group-hover/img-container:scale-100 transition-all duration-700" />
                        <Image
                            src="/robot.png"
                            alt="robo-dude"
                            width={500}
                            height={500}
                            className="relative z-10 drop-shadow-[0_0_50px_rgba(202,197,254,0.3)] hover:scale-105 hover:-rotate-3 transition-all duration-700 cursor-none"
                        />
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <div className="flex flex-col gap-16">
                {hasPastInterviews && (
                    <section className="flex flex-col gap-8 animate-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-end justify-between border-b border-white/5 pb-6">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl font-black text-white tracking-tight">
                                    Performance Overview
                                </h2>
                                <p className="text-sm text-light-400">
                                    Track your progress and proficiency levels
                                    across different technologies.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                            <div className="lg:col-span-8 glass-card-extreme p-8 rounded-[2rem] overflow-hidden">
                                <ScoreTrendChart data={trendData} />
                            </div>
                            <div className="lg:col-span-4 glass-card-extreme p-8 rounded-[2rem] overflow-hidden">
                                <CategoryProgress categories={categories} />
                            </div>
                        </div>
                    </section>
                )}

                <section className="flex flex-col gap-8 animate-in slide-in-from-bottom-12 duration-1000">
                    <div className="flex items-end justify-between border-b border-white/5 pb-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                Your Interviews
                            </h2>
                            <p className="text-sm text-light-400">
                                Manage and review your past interview
                                simulations and performance feedback.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-primary-200 hover:text-white transition-colors font-bold text-sm"
                        >
                            View All History
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hasPastInterviews ? (
                            userInterviews?.map((interview) => (
                                <div
                                    key={interview.id}
                                    className="transition-all hover:scale-[1.02] hover:-translate-y-1"
                                >
                                    <InterviewCard
                                        userId={user?.id}
                                        interviewId={interview.id}
                                        role={interview.role}
                                        type={interview.type}
                                        techstack={interview.techstack}
                                        createdAt={interview.createdAt}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-10 flex flex-col items-center justify-center gap-4 glass-card-extreme rounded-[2rem] border-dashed border-white/10">
                                <div className="p-4 bg-white/5 rounded-full">
                                    <Sparkles className="size-10 text-light-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">
                                        No interviews yet
                                    </h3>
                                    <p className="text-light-400">
                                        Take your first leap towards a dream
                                        career.
                                    </p>
                                </div>
                                <Button asChild className="btn-primary mt-4">
                                    <Link href="/interview">
                                        Start Practice Now
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
