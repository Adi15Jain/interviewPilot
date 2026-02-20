import { redirect } from "next/navigation";
import { MessageSquare, Users, TrendingUp, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getCommunityQuestions } from "@/lib/actions/general.action";
import CommunityQuestionsList from "@/components/CommunityQuestionsList";

const CommunityPage = async () => {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const data = await getCommunityQuestions({
        sortBy: "newest",
        userId: user.id,
    });

    return (
        <main className="min-h-screen pt-8 pb-20 px-6 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                        <MessageSquare className="size-10 text-primary-200" />
                        Community Question Bank
                    </h1>
                    <p className="text-lg text-light-400 max-w-2xl">
                        Real interview questions shared by the community.
                        Practice with authentic questions from top companies.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card-extreme p-8 flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-primary-200/10 border border-primary-200/20 flex items-center justify-center">
                        <MessageSquare className="size-8 text-primary-200" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600 mb-1">
                            Total Questions
                        </p>
                        <p className="text-3xl font-black text-white">
                            {data.total}
                        </p>
                    </div>
                </div>
                <div className="glass-card-extreme p-8 flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Users className="size-8 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600 mb-1">
                            Community Driven
                        </p>
                        <p className="text-3xl font-black text-white">100%</p>
                    </div>
                </div>
                <div className="glass-card-extreme p-8 flex items-center gap-6">
                    <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Sparkles className="size-8 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600 mb-1">
                            Verified Real
                        </p>
                        <p className="text-3xl font-black text-white">
                            Questions
                        </p>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <CommunityQuestionsList
                initialQuestions={data.questions as any}
                totalPages={data.totalPages}
                total={data.total}
                userId={user.id}
            />
        </main>
    );
};

export default CommunityPage;
