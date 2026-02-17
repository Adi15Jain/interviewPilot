"use client";

import { useState, useMemo } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import InterviewCard from "@/components/InterviewCard";

interface HistoryListProps {
    feedbacks: any[];
}

const HistoryList = ({ feedbacks }: HistoryListProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("All");

    const filteredFeedbacks = useMemo(() => {
        return feedbacks.filter((f) => {
            const matchesSearch =
                f.interview.role
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                f.interview.techstack.some((tech: string) =>
                    tech.toLowerCase().includes(searchQuery.toLowerCase()),
                );

            const matchesType =
                selectedType === "All" || f.interview.type === selectedType;

            return matchesSearch && matchesType;
        });
    }, [feedbacks, searchQuery, selectedType]);

    const types = ["All", "Behavioral", "Technical", "Mixed"];

    return (
        <div className="space-y-12">
            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between glass-card-extreme !p-4">
                <div className="relative w-full md:max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-light-600 transition-colors group-focus-within:text-primary-200" />
                    <Input
                        placeholder="Search by role or technology..."
                        className="pl-12 bg-white/5 border-white/10 h-12 text-base focus-visible:ring-primary-200/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-light-600 hover:text-white transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    <div className="flex items-center gap-2 mr-4 text-light-600">
                        <Filter className="size-4" />
                        <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
                            Filter By
                        </span>
                    </div>
                    {types.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                selectedType === type
                                    ? "bg-primary-200 text-[#020408] shadow-[0_0_15px_rgba(202,197,254,0.3)]"
                                    : "bg-white/5 text-light-400 hover:bg-white/10 hover:text-white border border-white/5"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            {filteredFeedbacks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredFeedbacks.map((f: any) => (
                        <InterviewCard
                            key={f.id}
                            interviewId={f.interviewId}
                            userId={f.userId}
                            role={f.interview.role}
                            type={f.interview.type}
                            techstack={f.interview.techstack}
                            createdAt={f.createdAt}
                            feedback={f}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                    <div className="size-16 rounded-full bg-white/5 flex items-center justify-center opacity-40">
                        <Search className="size-8 text-light-600" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xl font-bold text-white">
                            No matches found
                        </h4>
                        <p className="text-light-600 max-w-xs mx-auto text-sm">
                            Adjust your filters or search query to find specific
                            simulation logs.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedType("All");
                        }}
                        className="text-primary-200 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em] pt-4"
                    >
                        Clear All Parameters
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryList;
