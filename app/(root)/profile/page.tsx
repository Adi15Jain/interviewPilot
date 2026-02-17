import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    getInterviewsByUserId,
    getFeedbacksByUserId,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import ScoreTrendChart from "@/components/ScoreTrendChart";
import CategoryProgress from "@/components/CategoryProgress";
import InterviewCard from "@/components/InterviewCard";
import {
    ChevronLeft,
    Mail,
    Calendar,
    Trophy,
    Target,
    TrendingUp,
    Sparkles,
} from "lucide-react";

const ProfilePage = async () => {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const [interviews, feedbacks] = await Promise.all([
        getInterviewsByUserId(user.id),
        getFeedbacksByUserId(user.id),
    ]);

    const totalInterviews = interviews?.length || 0;
    const completedFeedbacks = feedbacks?.length || 0;

    const averageScore =
        completedFeedbacks > 0
            ? Math.round(
                  feedbacks!.reduce((acc, f) => acc + f.totalScore, 0) /
                      completedFeedbacks,
              )
            : 0;

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
        <div className="flex flex-col gap-10 pb-20 animate-in fade-in duration-1000">
            {/* Back Button & Title */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    asChild
                    className="text-light-400 hover:text-white -ml-4"
                >
                    <Link href="/" className="flex items-center gap-2">
                        <ChevronLeft className="size-4" />
                        <span>Back to Home</span>
                    </Link>
                </Button>
            </div>

            {/* Profile Header Card */}
            <section className="glass-card-extreme p-8 lg:p-12 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-primary-200/10 transition-all duration-700" />

                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary-200/20 blur-2xl rounded-full scale-110" />
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name!}
                                width={160}
                                height={160}
                                className="rounded-full size-40 object-cover border-4 border-white/10 relative z-10 shadow-2xl"
                            />
                        ) : (
                            <div className="size-40 rounded-full bg-gradient-to-br from-primary-200 to-primary-200/60 border-4 border-white/10 relative z-10 flex items-center justify-center">
                                <span className="text-5xl font-black text-dark-100">
                                    {user.name?.[0]?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6 flex-1 text-center md:text-left">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                                <div className="flex items-center gap-2 text-light-400">
                                    <Mail className="size-4" />
                                    <span className="text-sm">
                                        {user.email}
                                    </span>
                                </div>
                                <div className="size-1 bg-white/10 rounded-full hidden md:block" />
                                <div className="flex items-center gap-2 text-light-400">
                                    <Calendar className="size-4" />
                                    <span className="text-sm">
                                        Student since 2024
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-primary-200">
                                    <Trophy className="size-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">
                                        Avg. Score
                                    </span>
                                </div>
                                <span className="text-2xl font-black text-white">
                                    {averageScore}%
                                </span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-success-100">
                                    <Target className="size-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">
                                        Interviews
                                    </span>
                                </div>
                                <span className="text-2xl font-black text-white">
                                    {totalInterviews}
                                </span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-light-100">
                                    <TrendingUp className="size-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">
                                        Level
                                    </span>
                                </div>
                                <span className="text-2xl font-black text-white">
                                    Advanced
                                </span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-primary-200">
                                    <Sparkles className="size-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">
                                        Rank
                                    </span>
                                </div>
                                <span className="text-2xl font-black text-white">
                                    Top 5%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Analysis */}
            {completedFeedbacks > 0 && (
                <section className="flex flex-col gap-8">
                    <div className="flex items-end justify-between border-b border-white/5 pb-6">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl font-black text-white tracking-tight">
                                Performance Statistics
                            </h2>
                            <p className="text-sm text-light-400">
                                Deep dive into your interview trends and
                                technical proficiency.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        <div className="lg:col-span-8 glass-card p-8 rounded-[2rem] border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6">
                                Score Progression
                            </h3>
                            <ScoreTrendChart data={trendData} />
                        </div>
                        <div className="lg:col-span-4 glass-card p-8 rounded-[2rem] border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-6">
                                Skill Proficiency
                            </h3>
                            <CategoryProgress categories={categories} />
                        </div>
                    </div>
                </section>
            )}

            {/* Recent History */}
            <section className="flex flex-col gap-8">
                <div className="flex items-end justify-between border-b border-white/5 pb-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            Interview History
                        </h2>
                        <p className="text-sm text-light-400">
                            Review your past performance and growth journey.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviews && interviews.length > 0 ? (
                        interviews.map((interview) => {
                            const feedback = feedbacks?.find(
                                (f) => f.interviewId === interview.id,
                            );

                            return (
                                <InterviewCard
                                    key={interview.id}
                                    userId={user.id}
                                    interviewId={interview.id}
                                    role={interview.role}
                                    type={interview.type}
                                    techstack={interview.techstack}
                                    createdAt={interview.createdAt}
                                    feedback={feedback}
                                />
                            );
                        })
                    ) : (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center gap-6 glass-card rounded-[2.5rem] border-dashed border-white/10">
                            <div className="p-6 bg-white/5 rounded-full ring-1 ring-white/10">
                                <Sparkles className="size-12 text-light-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white">
                                    Your journey starts here
                                </h3>
                                <p className="text-light-400 max-w-sm mt-2">
                                    Take your first interview to see detailed
                                    stats and personalized feedback.
                                </p>
                            </div>
                            <Button asChild className="btn-primary h-12 px-8">
                                <Link href="/interview">Ready to Begin?</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
