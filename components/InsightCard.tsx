"use client";

import { CheckCircle2, AlertCircle, LucideIcon } from "lucide-react";

interface InsightCardProps {
    title: string;
    items: string[];
    type: "strength" | "improvement";
}

const InsightCard = ({ title, items, type }: InsightCardProps) => {
    const isStrength = type === "strength";
    const Icon = isStrength ? CheckCircle2 : AlertCircle;

    return (
        <div
            className={`flex flex-col gap-6 p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 group relative overflow-hidden ${
                isStrength
                    ? "bg-green-500/[0.02] border-green-500/10 hover:border-green-500/30"
                    : "bg-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/30"
            }`}
        >
            {/* Corner Glow */}
            <div
                className={`absolute -top-12 -right-12 w-32 h-32 blur-[60px] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${
                    isStrength ? "bg-green-500" : "bg-amber-500"
                }`}
            />

            <div className="flex items-center gap-4">
                <div
                    className={`p-3 rounded-2xl ${
                        isStrength
                            ? "bg-green-500/10 text-green-400"
                            : "bg-amber-500/10 text-amber-400"
                    }`}
                >
                    <Icon className="size-6" />
                </div>
                <h3 className="text-base font-black uppercase tracking-[0.3em] text-white">
                    {title}
                </h3>
            </div>

            <ul className="flex flex-col gap-4">
                {items.map((item, index) => (
                    <li key={index} className="flex gap-4 group/item">
                        <span
                            className={`mt-1.5 size-1.5 rounded-full shrink-0 transition-transform duration-300 group-hover/item:scale-150 ${
                                isStrength
                                    ? "bg-green-500/40"
                                    : "bg-amber-500/40"
                            }`}
                        />
                        <p className="text-base font-medium text-light-600 leading-relaxed group-hover/item:text-light-100 transition-colors">
                            {item}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InsightCard;
