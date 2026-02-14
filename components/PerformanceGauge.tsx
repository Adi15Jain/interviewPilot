"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface PerformanceGaugeProps {
    score: number;
}

const PerformanceGauge = ({ score }: PerformanceGaugeProps) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(score), 500);
        return () => clearTimeout(timer);
    }, [score]);

    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress / 100) * circumference;

    const getStatus = (s: number) => {
        if (s >= 80)
            return { label: "Industry Ready", color: "text-green-400" };
        if (s >= 60)
            return { label: "Strong Candidate", color: "text-blue-400" };
        if (s >= 40) return { label: "Developing", color: "text-amber-400" };
        return { label: "Needs Focus", color: "text-red-400" };
    };

    const status = getStatus(score);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary-500/10 blur-[60px] rounded-full group-hover:bg-primary-500/20 transition-all duration-700" />

            <div className="relative w-48 h-48">
                {/* SVG Gauge */}
                <svg
                    className="w-full h-full -rotate-90 transform"
                    viewBox="0 0 100 100"
                >
                    {/* Background Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    {/* Progress Bar */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="text-primary-200 transition-all duration-1000 ease-out"
                        style={{
                            filter: "drop-shadow(0 0 8px rgba(202, 197, 254, 0.4))",
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-black text-white tracking-tighter">
                        {Math.round(progress)}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600 -mt-1">
                        Mastery
                    </span>
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
                <div
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 ${status.color}`}
                >
                    <Zap className="size-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {status.label}
                    </span>
                </div>
                <p className="text-[10px] font-bold text-light-600 uppercase tracking-[0.2em] opacity-50">
                    Calculated by Gemini Engine
                </p>
            </div>
        </div>
    );
};

export default PerformanceGauge;
