"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
    Mic,
    Brain,
    ScanFace,
    Globe2,
    Layers,
    Share2,
    Settings2,
    Play,
    FileBarChart,
    ChevronRight,
    Sparkles,
} from "lucide-react";

/* ── Animated Counter ── */
const AnimatedCounter = ({
    target,
    suffix = "",
    prefix = "",
    duration = 2,
}: {
    target: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = target / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, target, duration]);

    return (
        <span ref={ref} className="tabular-nums">
            {prefix}
            {count}
            {suffix}
        </span>
    );
};

/* ── USP Card ── */
const USPCard = ({
    icon: Icon,
    title,
    description,
    poweredBy,
    accentColor,
    delay,
}: {
    icon: any;
    title: string;
    description: string;
    poweredBy: string;
    accentColor: string;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay, type: "spring", stiffness: 80 }}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className="relative group/usp rounded-[1.5rem] md:rounded-[2rem] p-[1px] overflow-hidden"
    >
        {/* Animated gradient border */}
        <motion.div
            className="absolute inset-0 rounded-[2rem]"
            style={{
                background: `linear-gradient(135deg, ${accentColor}25, transparent 40%, transparent 60%, ${accentColor}15)`,
            }}
            animate={{
                background: [
                    `linear-gradient(135deg, ${accentColor}25, transparent 40%, transparent 60%, ${accentColor}15)`,
                    `linear-gradient(315deg, ${accentColor}25, transparent 40%, transparent 60%, ${accentColor}15)`,
                    `linear-gradient(135deg, ${accentColor}25, transparent 40%, transparent 60%, ${accentColor}15)`,
                ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative bg-dark-200/80 backdrop-blur-xl p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] h-full flex flex-col gap-4 md:gap-5 border-0">
            {/* Hover glow */}
            <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover/usp:opacity-25 transition-opacity duration-500 -mt-8 -mr-8"
                style={{ background: accentColor }}
            />

            <div className="relative z-10 flex flex-col gap-4">
                <motion.div
                    className="size-12 rounded-xl border border-white/10 flex items-center justify-center"
                    style={{ background: `${accentColor}10` }}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Icon className="size-6" style={{ color: accentColor }} />
                    <div
                        className="absolute inset-0 rounded-xl blur-xl opacity-25"
                        style={{ background: accentColor }}
                    />
                </motion.div>

                <div className="flex flex-col gap-3">
                    <h3 className="text-base md:text-lg font-black text-white tracking-tight leading-snug">
                        {title}
                    </h3>
                    <p className="text-xs md:text-[13px] text-light-400 leading-relaxed">
                        {description}
                    </p>
                </div>

                <span className="inline-flex self-start px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-primary-200 uppercase tracking-widest">
                    {poweredBy}
                </span>
            </div>
        </div>
    </motion.div>
);

/* ── How It Works Step ── */
const HowItWorksStep = ({
    icon: Icon,
    step,
    title,
    description,
    accentColor,
    delay,
}: {
    icon: any;
    step: number;
    title: string;
    description: string;
    accentColor: string;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
            duration: 0.5,
            delay,
            type: "spring",
            stiffness: 120,
        }}
        className="flex flex-col items-center gap-4 text-center group/step relative"
    >
        <div className="relative">
            <motion.div
                className="size-20 rounded-2xl border flex items-center justify-center relative z-10 shadow-xl"
                style={{
                    background: "#0a0d14",
                    borderColor: `${accentColor}40`,
                }}
                whileHover={{
                    scale: 1.1,
                    borderColor: accentColor,
                    transition: { duration: 0.3 },
                }}
            >
                <Icon className="size-8" style={{ color: accentColor }} />
            </motion.div>
            {/* Step number badge */}
            <div
                className="absolute -top-2 -right-2 size-7 rounded-full flex items-center justify-center text-[11px] font-black text-dark-100 z-20 shadow-lg"
                style={{ background: accentColor }}
            >
                {step}
            </div>
            {/* Pulse ring */}
            <motion.div
                className="absolute inset-0 rounded-2xl border"
                style={{ borderColor: `${accentColor}20` }}
                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                transition={{
                    duration: 2.5,
                    delay: delay + 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
            />
        </div>
        <div className="flex flex-col gap-1">
            <h4 className="text-base font-black text-white uppercase tracking-wider">
                {title}
            </h4>
            <p className="text-sm text-light-400 max-w-[200px] leading-relaxed">
                {description}
            </p>
        </div>
    </motion.div>
);

/* ── Connecting Arrow (for How It Works) ── */
const ConnectingArrow = ({ delay }: { delay: number }) => (
    <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
        className="hidden md:flex items-center justify-center pt-4"
    >
        <div className="flex items-center gap-1">
            <div className="w-16 h-px bg-gradient-to-r from-white/5 to-white/20" />
            <ChevronRight className="size-4 text-white/20" />
        </div>
    </motion.div>
);

/* ── Main Component ── */
const WhyInterviewPilot = () => {
    const uspCards = [
        {
            icon: Mic,
            title: "Voice-First AI Interviews",
            description:
                "Talk to an AI interviewer in real-time voice — not text. Natural conversation dynamics with sub-second latency.",
            poweredBy: "VAPI.ai · WebRTC",
            accentColor: "#22d3ee",
        },
        {
            icon: ScanFace,
            title: "Emotion Intelligence",
            description:
                "Your webcam tracks confidence levels and eye contact throughout the interview. No competitor offers this.",
            poweredBy: "MediaPipe · Face Landmarks",
            accentColor: "#f472b6",
        },
        {
            icon: Brain,
            title: "5-Agent MAS Feedback",
            description:
                "Five specialized AI agents analyze you: Technical, Behavioral, Culture Fit, Growth Coach, and an Orchestrator synthesizer.",
            poweredBy: "Gemini 2.5 · Multi-Agent",
            accentColor: "#CAC5FE",
        },
        {
            icon: Globe2,
            title: "7+ Languages",
            description:
                "Practice in Hindi, French, Spanish, German, Japanese, and more — with native-accent voice synthesis.",
            poweredBy: "ElevenLabs v2 · Deepgram",
            accentColor: "#a78bfa",
        },
        {
            icon: Layers,
            title: "9+ Interview Domains",
            description:
                "Not just tech — prepare for Healthcare, Finance, Law, Education, Manufacturing, Creative Arts, and more.",
            poweredBy: "Multi-Domain Engine",
            accentColor: "#34d399",
        },
        {
            icon: Share2,
            title: "Shareable Report Cards",
            description:
                "Download or share your performance report as a polished PNG — perfect for LinkedIn or your portfolio.",
            poweredBy: "html-to-image · Web Share API",
            accentColor: "#fbbf24",
        },
    ];

    const stats = [
        { value: 500, suffix: "+", label: "Candidates" },
        { value: 9, suffix: "+", label: "Domains" },
        { value: 7, suffix: "+", label: "Languages" },
        { value: 5, suffix: "", label: "AI Agents" },
    ];

    return (
        <div className="flex flex-col gap-12 md:gap-20">
            {/* Section 1: Why InterviewPilot */}
            <section className="flex flex-col gap-8 md:gap-12 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary-200/3 blur-[150px] rounded-full pointer-events-none" />

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col gap-3 relative z-10 text-center items-center"
                >
                    <div className="flex badge-institutional">
                        <Sparkles className="size-5 text-primary-200" />
                        <span className="text-base">
                            What Makes Us Different
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        Not Another{" "}
                        <span className="text-gradient-premium">
                            Chatbot Quiz
                        </span>
                    </h2>
                    <p className="text-light-400 text-base md:text-lg max-w-2xl leading-relaxed">
                        InterviewPilot is the only platform that combines
                        real-time voice AI, emotional intelligence tracking, and
                        multi-agent analysis — all in one interview session.
                    </p>
                </motion.div>

                {/* USP Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
                    {uspCards.map((card, i) => (
                        <USPCard key={card.title} {...card} delay={i * 0.1} />
                    ))}
                </div>
            </section>

            {/* Section 2: Stats Bar */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="glass-card-extreme rounded-2xl md:rounded-[2.5rem] px-6 md:px-10 py-8 md:py-10 border border-white/5 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-200/5 via-transparent to-primary-200/5 pointer-events-none" />
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center gap-2 text-center"
                        >
                            <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
                                <AnimatedCounter
                                    target={stat.value}
                                    suffix={stat.suffix}
                                    duration={1.5}
                                />
                            </span>
                            <span className="text-[11px] font-black text-light-400 uppercase tracking-[0.3em]">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Section 3: How It Works */}
            <section className="flex flex-col gap-8 md:gap-12 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col gap-3 text-center items-center"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        Three Steps to{" "}
                        <span className="text-gradient-premium">Mastery</span>
                    </h2>
                    <p className="text-light-400 text-base md:text-lg max-w-xl">
                        From customization to AI-powered analysis — your
                        complete interview journey.
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
                    <HowItWorksStep
                        icon={Settings2}
                        step={1}
                        title="Customize"
                        description="Pick your domain, role, tech stack, language, and difficulty level."
                        accentColor="#a78bfa"
                        delay={0.1}
                    />
                    <ConnectingArrow delay={0.2} />
                    <HowItWorksStep
                        icon={Play}
                        step={2}
                        title="Practice Live"
                        description="Real-time voice interview with AI tracking your confidence and eye contact."
                        accentColor="#CAC5FE"
                        delay={0.3}
                    />
                    <ConnectingArrow delay={0.4} />
                    <HowItWorksStep
                        icon={FileBarChart}
                        step={3}
                        title="Get AI Report"
                        description="5 specialized agents generate your detailed feedback with scores and coaching tips."
                        accentColor="#34d399"
                        delay={0.5}
                    />
                </div>
            </section>
        </div>
    );
};

export default WhyInterviewPilot;
