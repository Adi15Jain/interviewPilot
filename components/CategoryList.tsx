"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Code, Lightbulb, Users, BarChart3 } from "lucide-react";

interface CategoryScore {
    name: string;
    score: number;
    comment: string;
}

interface CategoryListProps {
    categories: CategoryScore[];
}

const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("communication")) return MessageSquare;
    if (n.includes("technical")) return Code;
    if (n.includes("problem")) return Lightbulb;
    if (n.includes("fit") || n.includes("culture")) return Users;
    return BarChart3;
};

const CategoryItem = ({
    category,
    index,
}: {
    category: CategoryScore;
    index: number;
}) => {
    const [progress, setProgress] = useState(0);
    const Icon = getCategoryIcon(category.name);

    useEffect(() => {
        const timer = setTimeout(
            () => setProgress(category.score),
            100 * index + 600,
        );
        return () => clearTimeout(timer);
    }, [category.score, index]);

    return (
        <div className="group flex flex-col gap-3 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-500/10 text-primary-200 group-hover:scale-110 transition-transform">
                        <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-white/90">
                        {category.name}
                    </span>
                </div>
                <span className="text-sm font-black text-primary-200 tracking-tight">
                    {category.score}/100
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary-500/50 to-primary-200 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
                </div>
            </div>

            <p className="text-[11px] leading-relaxed text-light-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {category.comment}
            </p>
        </div>
    );
};

const CategoryList = ({ categories }: CategoryListProps) => {
    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-light-600 mb-2 pl-2">
                Categorical Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat, idx) => (
                    <CategoryItem key={idx} category={cat} index={idx} />
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
