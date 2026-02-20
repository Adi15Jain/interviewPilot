"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Rocket,
    Sparkles,
    ArrowRight,
    Mic,
    Brain,
    BarChart3,
    Globe2,
    Code,
    Briefcase,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/lib/actions/auth.action";

interface OnboardingFlowProps {
    userId: string;
    userName: string;
}

const DOMAINS = [
    { name: "Frontend", icon: Code, color: "#60a5fa" },
    { name: "Backend", icon: Briefcase, color: "#34d399" },
    { name: "Full Stack", icon: Globe2, color: "#a78bfa" },
    { name: "DevOps / Cloud", icon: BarChart3, color: "#fbbf24" },
    { name: "Data / ML", icon: Brain, color: "#f472b6" },
    { name: "Other", icon: Sparkles, color: "#fb923c" },
];

const OnboardingFlow = ({ userId, userName }: OnboardingFlowProps) => {
    const [step, setStep] = useState(0);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleComplete = async () => {
        startTransition(async () => {
            await completeOnboarding(userId);
            router.refresh();
        });
    };

    const slideVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 },
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl glass-card-extreme p-12 rounded-[3rem] relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-200/5 blur-[120px] rounded-full -mr-48 -mt-48" />

                {/* Progress */}
                <div className="flex items-center gap-2 mb-10">
                    {[0, 1, 2].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                s <= step
                                    ? "bg-primary-200 flex-[2]"
                                    : "bg-white/10 flex-1"
                            }`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 0: Welcome */}
                    {step === 0 && (
                        <motion.div
                            key="welcome"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="size-20 rounded-3xl bg-primary-200/10 border border-primary-200/20 flex items-center justify-center">
                                <Rocket className="size-10 text-primary-200" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <h1 className="text-4xl font-black text-white tracking-tight">
                                    Welcome,{" "}
                                    <span className="text-primary-200">
                                        {userName.split(" ")[0]}
                                    </span>
                                </h1>
                                <p className="text-light-400 text-lg leading-relaxed max-w-md">
                                    InterviewPilot uses{" "}
                                    <span className="text-white font-bold">
                                        AI-powered voice agents
                                    </span>{" "}
                                    and a{" "}
                                    <span className="text-white font-bold">
                                        multi-agent analysis system
                                    </span>{" "}
                                    to simulate real interviews and give you
                                    professional-grade feedback.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-2">
                                {[
                                    {
                                        icon: Mic,
                                        label: "Voice AI",
                                        desc: "Talk naturally",
                                    },
                                    {
                                        icon: Brain,
                                        label: "MAS Analysis",
                                        desc: "5-agent grading",
                                    },
                                    {
                                        icon: BarChart3,
                                        label: "Deep Metrics",
                                        desc: "Track growth",
                                    },
                                ].map((f, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center"
                                    >
                                        <f.icon className="size-6 text-primary-200" />
                                        <span className="text-xs font-black text-white uppercase tracking-wider">
                                            {f.label}
                                        </span>
                                        <span className="text-[10px] text-light-600 font-bold">
                                            {f.desc}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => setStep(1)}
                                className="h-12 px-8 bg-primary-200 text-black hover:bg-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(202,197,254,0.3)] transition-all hover:scale-105 self-end gap-2 mt-4"
                            >
                                Get Started
                                <ArrowRight className="size-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 1: Pick Domain */}
                    {step === 1 && (
                        <motion.div
                            key="domain"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-3">
                                <h2 className="text-3xl font-black text-white tracking-tight">
                                    What&apos;s your primary field?
                                </h2>
                                <p className="text-light-400">
                                    We&apos;ll tailor your experience based on
                                    your domain.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {DOMAINS.map((domain) => (
                                    <button
                                        key={domain.name}
                                        onClick={() =>
                                            setSelectedDomain(domain.name)
                                        }
                                        className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                                            selectedDomain === domain.name
                                                ? "bg-primary-200/10 border-primary-200/30 scale-[1.02]"
                                                : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                                        }`}
                                    >
                                        <div
                                            className="size-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                backgroundColor: `${domain.color}15`,
                                                borderColor: `${domain.color}30`,
                                                borderWidth: "1px",
                                            }}
                                        >
                                            <domain.icon
                                                className="size-5"
                                                style={{
                                                    color: domain.color,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-white">
                                            {domain.name}
                                        </span>
                                        {selectedDomain === domain.name && (
                                            <CheckCircle2 className="size-4 text-primary-200 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <Button
                                onClick={() => setStep(2)}
                                disabled={!selectedDomain}
                                className="h-12 px-8 bg-primary-200 text-black hover:bg-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(202,197,254,0.3)] transition-all hover:scale-105 self-end gap-2 mt-4 disabled:opacity-50"
                            >
                                Continue
                                <ArrowRight className="size-4" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 2: Launch */}
                    {step === 2 && (
                        <motion.div
                            key="launch"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-8 text-center py-6"
                        >
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <div className="size-24 rounded-[2rem] bg-gradient-to-br from-primary-200/20 to-primary-200/5 border border-primary-200/20 flex items-center justify-center">
                                    <Sparkles className="size-12 text-primary-200" />
                                </div>
                            </motion.div>

                            <div className="flex flex-col gap-3 max-w-md">
                                <h2 className="text-3xl font-black text-white tracking-tight">
                                    You&apos;re All Set!
                                </h2>
                                <p className="text-light-400 leading-relaxed">
                                    Your{" "}
                                    <span className="text-white font-bold">
                                        {selectedDomain}
                                    </span>{" "}
                                    journey begins now. Launch your first
                                    AI-powered interview simulation and
                                    experience the future of interview
                                    preparation.
                                </p>
                            </div>

                            <Button
                                onClick={handleComplete}
                                disabled={isPending}
                                className="h-14 px-10 bg-primary-200 text-black hover:bg-white text-sm font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(202,197,254,0.4)] transition-all hover:scale-105 gap-2"
                            >
                                {isPending ? (
                                    "Launching..."
                                ) : (
                                    <>
                                        <Rocket className="size-5" />
                                        Launch Dashboard
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default OnboardingFlow;
