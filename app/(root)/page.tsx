import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
    getInterviewsByUserId,
    getFeedbacksByUserId,
} from "@/lib/actions/general.action";
import ScoreTrendChart from "@/components/ScoreTrendChart";
import CategoryProgress from "@/components/CategoryProgress";

async function Home() {
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
        <>
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>
                        Get Interview-Ready with AI-Powered Practice & Feedback
                    </h2>
                    <p className="text-lg">
                        Practice real interview questions & get instant feedback
                    </p>

                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>

                <Image
                    src="/robot.png"
                    alt="robo-dude"
                    width={400}
                    height={400}
                    className="max-sm:hidden"
                />
            </section>

            {trendData.length > 0 && (
                <section className="flex flex-col gap-6 mt-8">
                    <h2>Performance Overview</h2>
                    <div className="flex flex-row gap-6 max-lg:flex-col items-stretch">
                        <div className="flex-1">
                            <ScoreTrendChart data={trendData} />
                        </div>
                        <div className="lg:w-[350px]">
                            <CategoryProgress categories={categories} />
                        </div>
                    </div>
                </section>
            )}

            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>

                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews?.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                userId={user?.id}
                                interviewId={interview.id}
                                role={interview.role}
                                type={interview.type}
                                techstack={interview.techstack}
                                createdAt={interview.createdAt}
                            />
                        ))
                    ) : (
                        <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>
        </>
    );
}

export default Home;
