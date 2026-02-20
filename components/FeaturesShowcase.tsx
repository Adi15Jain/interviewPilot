"use client";

import { motion } from "framer-motion";
import {
    Globe2,
    Cpu,
    Layers,
    Zap,
    Mic,
    Brain,
    AudioLines,
    MessageSquare,
    BarChart3,
    ShieldCheck,
} from "lucide-react";

/* ── Animated flowing dots along a path ── */
const FlowingDot = ({
    delay,
    duration,
    color,
}: {
    delay: number;
    duration: number;
    color: string;
}) => (
    <motion.div
        className="absolute size-2.5 rounded-full"
        style={{
            background: color,
            boxShadow: `0 0 8px ${color}90, 0 0 20px ${color}30`,
            left: 0,
            top: "50%",
            marginTop: "-5px",
        }}
        animate={{
            left: ["0%", "100%"],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.6, 1, 1, 0.6],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    />
);

/* ── Animated connection line with flowing particles ── */
const FlowLine = () => (
    <div className="relative w-full h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
        <FlowingDot delay={0} duration={5} color="#CAC5FE" />
        <FlowingDot delay={2.5} duration={5} color="#a78bfa" />
    </div>
);

/* ── Pulsing ring animation for pipeline nodes ── */
const PulseRing = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
        className="absolute inset-0 rounded-2xl border border-primary-200/20"
        animate={{
            scale: [1, 1.6],
            opacity: [0.4, 0],
        }}
        transition={{
            duration: 3,
            delay,
            repeat: Infinity,
            ease: "easeOut",
        }}
    />
);

/* ── Feature card with animated border gradient ── */
const FeatureCard = ({
    icon: Icon,
    title,
    description,
    technicalStack,
    delay,
    accentColor,
}: {
    icon: any;
    title: string;
    description: string;
    technicalStack: string[];
    delay: number;
    accentColor: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay, type: "spring", stiffness: 80 }}
        whileHover={{ y: -8, transition: { duration: 0.3 } }}
        className="relative group/feature rounded-[2.5rem] p-[1px] overflow-hidden"
    >
        {/* Animated border gradient */}
        <motion.div
            className="absolute inset-0 rounded-[2.5rem]"
            style={{
                background: `linear-gradient(135deg, ${accentColor}30, transparent 40%, transparent 60%, ${accentColor}20)`,
            }}
            animate={{
                background: [
                    `linear-gradient(135deg, ${accentColor}30, transparent 40%, transparent 60%, ${accentColor}20)`,
                    `linear-gradient(225deg, ${accentColor}30, transparent 40%, transparent 60%, ${accentColor}20)`,
                    `linear-gradient(315deg, ${accentColor}30, transparent 40%, transparent 60%, ${accentColor}20)`,
                    `linear-gradient(45deg, ${accentColor}30, transparent 40%, transparent 60%, ${accentColor}20)`,
                    `linear-gradient(135deg, ${accentColor}30, transparent 40%, transparent 60%, ${accentColor}20)`,
                ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative glass-card-extreme p-8 rounded-[2.5rem] h-full flex flex-col gap-6 border-0 bg-dark-200/80">
            {/* Hover glow */}
            <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover/feature:opacity-30 transition-opacity duration-700 -mt-10 -mr-10"
                style={{ background: accentColor }}
            />

            <div className="relative z-10 flex flex-col gap-6">
                <motion.div
                    className="size-14 rounded-2xl border border-white/10 flex items-center justify-center relative"
                    style={{ background: `${accentColor}10` }}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Icon className="size-7" style={{ color: accentColor }} />
                    {/* Subtle glow behind icon */}
                    <div
                        className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                        style={{ background: accentColor }}
                    />
                </motion.div>

                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-black text-white tracking-tight">
                        {title}
                    </h3>
                    <p className="text-light-400 leading-relaxed text-sm">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {technicalStack.map((tech, i) => (
                        <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: delay + i * 0.1 }}
                            className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[12px] font-bold text-primary-200 uppercase tracking-widest hover:border-primary-200/30 hover:text-light-600 transition-all cursor-default"
                        >
                            {tech}
                        </motion.span>
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

/* ── Pipeline step node with animations ── */
const PipelineNode = ({
    icon: Icon,
    label,
    sublabel,
    index,
    accentColor,
}: {
    icon: any;
    label: string;
    sublabel: string;
    index: number;
    accentColor: string;
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
            duration: 0.5,
            delay: 0.3 + index * 0.15,
            type: "spring",
            stiffness: 200,
        }}
        className="relative flex flex-col items-center gap-3 group/node"
    >
        {/* Node circle */}
        <div className="relative">
            <motion.div
                className="size-16 rounded-2xl border flex items-center justify-center relative z-10 shadow-2xl"
                style={{
                    background: "#0a0d14",
                    borderColor: `${accentColor}40`,
                }}
                whileHover={{
                    scale: 1.15,
                    borderColor: accentColor,
                    transition: { duration: 0.3 },
                }}
            >
                <Icon className="size-7" style={{ color: accentColor }} />
            </motion.div>

            {/* Pulse rings */}
            <PulseRing delay={index * 0.5} />
            <PulseRing delay={index * 0.5 + 1} />
        </div>

        {/* Labels */}
        <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-black text-white uppercase tracking-wider text-center">
                {label}
            </span>
            <span className="text-[14px] text-light-600 font-medium text-center">
                {sublabel}
            </span>
        </div>
    </motion.div>
);

/* ── Main Component ── */
const FeaturesShowcase = () => {
    const pipelineSteps = [
        {
            icon: Mic,
            label: "Audio Capture",
            sublabel: "WebRTC Stream",
            accentColor: "#22d3ee",
        },
        {
            icon: AudioLines,
            label: "STT Engine",
            sublabel: "Deepgram Nova-2",
            accentColor: "#a78bfa",
        },
        {
            icon: Brain,
            label: "LLM Reasoning",
            sublabel: "GPT-4 Turbo",
            accentColor: "#CAC5FE",
        },
        {
            icon: MessageSquare,
            label: "TTS Synthesis",
            sublabel: "ElevenLabs v2",
            accentColor: "#34d399",
        },
        {
            icon: BarChart3,
            label: "MAS Analysis",
            sublabel: "Gemini 2.5 Pro",
            accentColor: "#f472b6",
        },
        {
            icon: ShieldCheck,
            label: "Feedback",
            sublabel: "Score & Report",
            accentColor: "#fbbf24",
        },
    ];

    return (
        <section className="flex flex-col gap-12 py-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-200/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-2 relative z-10 text-center items-center"
            >
                <div className="badge-institutional mb-2">
                    <Zap className="size-3 text-primary-200" />
                    <span>Advanced Architecture</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                    Engineered for{" "}
                    <span className="text-gradient-premium">Precision</span>
                </h2>
                <p className="text-light-400 text-lg max-w-2xl">
                    A neural interview ecosystem powered by cutting-edge
                    pipelines and
                    <br />
                    multi-agent coordination.
                </p>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                <FeatureCard
                    icon={Globe2}
                    title="Multilingual Synthesis"
                    description="Native-accent voice generation in 7+ languages. Gender-aware, culturally respectful communication powered by neural text-to-speech."
                    technicalStack={[
                        "ElevenLabs v2",
                        "Deepgram Nova-2",
                        "ISO-639",
                    ]}
                    delay={0.1}
                    accentColor="#a78bfa"
                />
                <FeatureCard
                    icon={Cpu}
                    title="MAS Coordination"
                    description="Multi-Agent Systems orchestrate specialized LLM instances for multifaceted behavioral analysis, technical evaluation, and sentiment scoring."
                    technicalStack={[
                        "GPT-4 Turbo",
                        "Gemini 2.5 Pro",
                        "Agentic MAS",
                    ]}
                    delay={0.2}
                    accentColor="#CAC5FE"
                />
                <FeatureCard
                    icon={Layers}
                    title="Neural Pipeline"
                    description="Synchronous STT→LLM→TTS architecture delivers sub-second response latency, enabling fluid real-time conversational dynamics."
                    technicalStack={[
                        "VAPI.ai",
                        "WebRTC",
                        "Streaming Inference",
                    ]}
                    delay={0.3}
                    accentColor="#34d399"
                />
            </div>

            {/* Animated Pipeline Visualization */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
                className="mt-4 glass-card-extreme p-10 rounded-[3rem] border border-white/5 relative group/pipeline overflow-hidden"
            >
                {/* Background glow effect */}
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                        background: [
                            "radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.08) 0%, transparent 50%)",
                            "radial-gradient(ellipse at 50% 50%, rgba(202,197,254,0.08) 0%, transparent 50%)",
                            "radial-gradient(ellipse at 80% 50%, rgba(52,211,153,0.08) 0%, transparent 50%)",
                            "radial-gradient(ellipse at 50% 50%, rgba(244,114,182,0.08) 0%, transparent 50%)",
                            "radial-gradient(ellipse at 20% 50%, rgba(167,139,250,0.08) 0%, transparent 50%)",
                        ],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <div className="relative z-10 flex flex-col gap-10">
                    {/* Pipeline Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="size-2 rounded-full bg-green-400"
                                    animate={{
                                        opacity: [1, 0.3, 1],
                                        scale: [1, 0.8, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">
                                    Live Pipeline
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-white leading-tight">
                                Interview Lifecycle
                            </h3>
                            <p className="text-light-400 text-sm max-w-md">
                                From neural audio capture to MAS-driven analysis
                                — every stage is optimized for
                                professional-grade reliability.
                            </p>
                        </div>

                        {/* Latency badge */}
                        <motion.div
                            className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3"
                            animate={{
                                borderColor: [
                                    "rgba(255,255,255,0.1)",
                                    "rgba(202,197,254,0.3)",
                                    "rgba(255,255,255,0.1)",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                        >
                            <Zap className="size-4 text-primary-200" />
                            <div className="flex flex-col">
                                <span className="text-[12px] text-light-600 uppercase tracking-widest font-bold">
                                    Avg. Latency
                                </span>
                                <span className="text-xl font-black text-white tabular-nums">
                                    ~500
                                    <span className="text-sm text-light-400 ml-1">
                                        ms
                                    </span>
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Pipeline Nodes with Flow Lines */}
                    <div className="relative flex flex-wrap md:flex-nowrap items-center justify-between gap-4 md:gap-0 px-2">
                        {/* Connection lines between nodes */}
                        <div className="hidden md:block absolute top-8 left-[8%] right-[8%] h-px z-[-10]">
                            <FlowLine />
                        </div>

                        {pipelineSteps.map((step, idx) => (
                            <PipelineNode
                                key={step.label}
                                icon={step.icon}
                                label={step.label}
                                sublabel={step.sublabel}
                                index={idx}
                                accentColor={step.accentColor}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturesShowcase;
