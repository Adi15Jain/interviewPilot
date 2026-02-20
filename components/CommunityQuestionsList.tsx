"use client";

import { useState, useTransition } from "react";
import {
    ArrowUp,
    Briefcase,
    Building2,
    MessageSquare,
    Plus,
    Flame,
    Clock,
    Tag,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    submitCommunityQuestion,
    toggleUpvote,
    getCommunityQuestions,
} from "@/lib/actions/general.action";

interface CommunityQuestion {
    id: string;
    question: string;
    company: string;
    role: string;
    tags: string[];
    upvotes: number;
    hasVoted: boolean;
    createdAt: Date;
    user: { name: string; image: string | null };
}

interface CommunityQuestionsListProps {
    initialQuestions: CommunityQuestion[];
    totalPages: number;
    total: number;
    userId: string;
}

const CommunityQuestionsList = ({
    initialQuestions,
    totalPages,
    total,
    userId,
}: CommunityQuestionsListProps) => {
    const [questions, setQuestions] =
        useState<CommunityQuestion[]>(initialQuestions);
    const [showForm, setShowForm] = useState(false);
    const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
    const [isPending, startTransition] = useTransition();

    // Form state
    const [question, setQuestion] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [tagsInput, setTagsInput] = useState("");

    const handleSubmit = async () => {
        if (!question.trim() || !company.trim() || !role.trim()) return;
        const tags = tagsInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        startTransition(async () => {
            const result = await submitCommunityQuestion({
                question: question.trim(),
                company: company.trim(),
                role: role.trim(),
                tags,
                userId,
            });

            if (result.success) {
                setQuestion("");
                setCompany("");
                setRole("");
                setTagsInput("");
                setShowForm(false);
                // Refresh
                const data = await getCommunityQuestions({
                    sortBy,
                    userId,
                });
                setQuestions(data.questions as any);
            }
        });
    };

    const handleUpvote = async (questionId: string) => {
        startTransition(async () => {
            const result = await toggleUpvote(questionId, userId);
            if (result.success) {
                setQuestions((prev) =>
                    prev.map((q) =>
                        q.id === questionId
                            ? {
                                  ...q,
                                  upvotes:
                                      result.action === "added"
                                          ? q.upvotes + 1
                                          : q.upvotes - 1,
                                  hasVoted: result.action === "added",
                              }
                            : q,
                    ),
                );
            }
        });
    };

    const handleSort = async (sort: "newest" | "popular") => {
        setSortBy(sort);
        startTransition(async () => {
            const data = await getCommunityQuestions({
                sortBy: sort,
                userId,
            });
            setQuestions(data.questions as any);
        });
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSort("newest")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            sortBy === "newest"
                                ? "bg-primary-200/10 text-primary-200 border border-primary-200/20"
                                : "bg-white/5 text-light-400 border border-white/10 hover:bg-white/10"
                        }`}
                    >
                        <Clock className="size-3.5" />
                        Newest
                    </button>
                    <button
                        onClick={() => handleSort("popular")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            sortBy === "popular"
                                ? "bg-primary-200/10 text-primary-200 border border-primary-200/20"
                                : "bg-white/5 text-light-400 border border-white/10 hover:bg-white/10"
                        }`}
                    >
                        <Flame className="size-3.5" />
                        Most Voted
                    </button>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="h-11 px-6 bg-primary-200 text-black hover:bg-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(202,197,254,0.3)] transition-all hover:scale-105 gap-2"
                >
                    {showForm ? (
                        <X className="size-3.5" />
                    ) : (
                        <Plus className="size-3.5" />
                    )}
                    {showForm ? "Cancel" : "Submit Question"}
                </Button>
            </div>

            {/* Submission Form */}
            {showForm && (
                <div className="glass-card-extreme p-8 rounded-[2.5rem] flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary-200">
                        Submit a Real Interview Question
                    </h3>
                    <div className="flex flex-col gap-4">
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="What question were you asked?"
                            rows={3}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-light-600 resize-none focus:outline-none focus:border-primary-200/30 text-sm"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Company (e.g., Google)"
                                className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-light-600 focus:outline-none focus:border-primary-200/30 text-sm"
                            />
                            <input
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Role (e.g., Frontend Developer)"
                                className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-light-600 focus:outline-none focus:border-primary-200/30 text-sm"
                            />
                        </div>
                        <input
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="Tags (comma separated: react, hooks, state)"
                            className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-light-600 focus:outline-none focus:border-primary-200/30 text-sm"
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                isPending || !question.trim() || !company.trim()
                            }
                            className="h-11 bg-primary-200 text-black hover:bg-white text-xs font-black uppercase tracking-widest rounded-xl self-end px-8 disabled:opacity-50"
                        >
                            {isPending ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Questions List */}
            <div className="flex flex-col gap-4">
                {questions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 glass-card-extreme rounded-[2.5rem] text-center gap-4">
                        <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <MessageSquare className="size-8 text-light-600" />
                        </div>
                        <h3 className="text-xl font-black text-white">
                            No Questions Yet
                        </h3>
                        <p className="text-sm text-light-400 max-w-sm">
                            Be the first to share a real interview question and
                            help the community prepare better.
                        </p>
                    </div>
                ) : (
                    questions.map((q) => (
                        <div
                            key={q.id}
                            className="glass-card-extreme p-6 rounded-[2rem] flex gap-5 group hover:border-primary-200/10 transition-all"
                        >
                            {/* Upvote */}
                            <button
                                onClick={() => handleUpvote(q.id)}
                                className={`flex flex-col items-center gap-1 min-w-[48px] pt-1 transition-all ${
                                    q.hasVoted
                                        ? "text-primary-200"
                                        : "text-light-600 hover:text-white"
                                }`}
                            >
                                <ArrowUp
                                    className={`size-5 ${q.hasVoted ? "fill-primary-200/20" : ""}`}
                                />
                                <span className="text-md font-black tabular-nums">
                                    {q.upvotes}
                                </span>
                            </button>

                            {/* Content */}
                            <div className="flex flex-col gap-3 flex-1 min-w-0">
                                <p className="text-white font-bold text-base leading-relaxed">
                                    {q.question}
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                                        <Building2 className="size-3 text-blue-400" />
                                        <span className="text-[12px] font-black text-blue-400 uppercase">
                                            {q.company}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <Briefcase className="size-3 text-emerald-400" />
                                        <span className="text-[12px] font-black text-emerald-400 uppercase">
                                            {q.role}
                                        </span>
                                    </div>
                                    {q.tags.map((tag) => (
                                        <div
                                            key={tag}
                                            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10"
                                        >
                                            <Tag className="size-2.5 text-light-600" />
                                            <span className="text-[11px] font-bold text-light-400">
                                                {tag}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[12px] text-light-600 font-bold">
                                    by {q.user.name} •{" "}
                                    {new Date(q.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommunityQuestionsList;
