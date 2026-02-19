"use client";

import { useEffect, useState } from "react";
import {
    Loader2,
    Cpu,
    UserCheck,
    Globe,
    TrendingUp,
    ShieldCheck,
    Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAS_STAGES = [
    {
        id: "orchestrator-init",
        name: "Orchestrator",
        status: "Initializing collective intelligence...",
        icon: ShieldCheck,
        duration: 5,
    },
    {
        id: "tech-spec",
        name: "Technical Specialist",
        status: "Reverse-engineering code patterns and logic flow...",
        icon: Cpu,
        duration: 40,
    },
    {
        id: "behavioral",
        name: "Behavioral Analyst",
        status: "Decoding communication frequency and confidence markers...",
        icon: UserCheck,
        duration: 40,
    },
    {
        id: "culture",
        name: "Culture Expert",
        status: "Measuring professional resonance and role alignment...",
        icon: Globe,
        duration: 30,
    },
    {
        id: "growth",
        name: "Growth Coach",
        status: "Engineering personalized career growth vectors...",
        icon: TrendingUp,
        duration: 40,
    },
    {
        id: "orchestrator-final",
        name: "Orchestrator",
        status: "Compiling reports into the astronomical dashboard...",
        icon: Zap,
        duration: 25,
    },
];

const MASLoading = () => {
    const [currentStageIdx, setCurrentStageIdx] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const totalDuration = MAS_STAGES.reduce(
            (acc, s) => acc + s.duration,
            0,
        );
        let elapsed = 0;

        const interval = setInterval(() => {
            elapsed += 1;
            const newProgress = Math.min(98, (elapsed / totalDuration) * 100);
            setProgress(newProgress);

            // Calculate which stage we should be in
            let accDuration = 0;
            for (let i = 0; i < MAS_STAGES.length; i++) {
                accDuration += MAS_STAGES[i].duration;
                if (elapsed <= accDuration) {
                    setCurrentStageIdx(i);
                    break;
                }
            }

            if (elapsed >= totalDuration) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const currentStage = MAS_STAGES[currentStageIdx];

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-3xl mx-auto p-8 gap-12 bg-dark-200/50 backdrop-blur-3xl rounded-[40px] border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
            {/* Header section */}
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100/10 border border-primary-100/20 text-primary-200 text-xs font-black uppercase tracking-[0.2em]">
                    <Loader2 className="size-3 animate-spin" />
                    Multi-Agentic System Active
                </div>
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    Decoding Your Performance
                </h2>
                <p className="text-light-400 text-lg max-w-xl mx-auto leading-relaxed">
                    Collaborating across specialized AI nodes to synthesize your
                    comprehensive professional report.
                </p>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
                {MAS_STAGES.map((stage, idx) => (
                    <div
                        key={stage.id}
                        className={cn(
                            "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-700",
                            idx === currentStageIdx
                                ? "bg-primary-500/10 border-primary-500/30 scale-105"
                                : idx < currentStageIdx
                                  ? "bg-success-500/5 border-success-500/20 opacity-50 font-medium"
                                  : "bg-white/5 border-white/5 opacity-30",
                        )}
                    >
                        <div
                            className={cn(
                                "p-2.5 rounded-xl transition-colors duration-700",
                                idx === currentStageIdx
                                    ? "bg-primary-500/20 text-primary-200"
                                    : idx < currentStageIdx
                                      ? "bg-success-500/20 text-success-400"
                                      : "bg-white/10 text-white/40",
                            )}
                        >
                            <stage.icon className="size-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                            {stage.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Active Status Display */}
            <div className="flex flex-col gap-6 w-full max-w-xl">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-200">
                            Current Node: {currentStage.name}
                        </span>
                        <p className="text-white font-medium animate-in slide-in-from-left-4 duration-500">
                            {currentStage.status}
                        </p>
                    </div>
                    <span className="text-sm font-mono text-light-600">
                        {Math.round(progress)}%
                    </span>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 via-primary-300 to-primary-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="text-light-600 text-[10px] font-medium uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-12 h-px bg-white/10" />
                This process typically takes 180 seconds
                <div className="w-12 h-px bg-white/10" />
            </div>
        </div>
    );
};

export default MASLoading;
