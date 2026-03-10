"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How does AI interview practice work?",
        answer: "InterviewPilot uses real-time voice AI to simulate a live interview. You speak naturally through your microphone, and the AI interviewer responds conversationally — just like a human interviewer. Meanwhile, your webcam tracks confidence and eye contact for behavioral analysis.",
    },
    {
        question: "Is InterviewPilot free to use?",
        answer: "Yes! You can start practicing interviews for free. Create an account, pick your domain, role, and language — and you're ready to go. We'll be adding premium tiers in the future for advanced analytics and unlimited sessions.",
    },
    {
        question: "What languages are supported?",
        answer: "InterviewPilot supports 7+ languages including English, Hindi, French, Spanish, German, Japanese, and more. The AI interviewer speaks with a native accent in your chosen language, making practice feel authentic.",
    },
    {
        question: "What makes the feedback different from other platforms?",
        answer: "Unlike single-AI feedback, InterviewPilot uses a Multi-Agent System (MAS) — five specialized AI agents analyze your performance: a Technical Specialist, Behavioral Analyst, Culture Expert, Growth Coach, and an Orchestrator that synthesizes everything into a comprehensive report.",
    },
    {
        question: "What interview domains are available?",
        answer: "We support 9+ domains: Technology, Healthcare, Finance & Banking, Legal, Business & Management, Education, Creative & Design, Government & Public Service, and Manufacturing. Each domain has tailored roles, tech stacks, and evaluation criteria.",
    },
    {
        question: "How does emotion and confidence tracking work?",
        answer: "With your permission, InterviewPilot uses your webcam to track facial landmarks via MediaPipe. It measures eye contact quality, facial expressiveness, head pose stability, and more — giving you objective behavioral insights that no text-based platform can offer.",
    },
    {
        question: "Can I share my results?",
        answer: "Absolutely! After each interview, you get a shareable Report Card that can be downloaded as a PNG image or shared directly via the Web Share API. It's perfect for LinkedIn posts or tracking your progress over time.",
    },
    {
        question: "Do I need to install anything?",
        answer: "No installation required. InterviewPilot runs entirely in your browser. All you need is a microphone (for voice interviews) and optionally a webcam (for behavioral analysis). Works on any modern browser.",
    },
];

const FAQItem = ({
    faq,
    isOpen,
    onToggle,
    index,
}: {
    faq: { question: string; answer: string };
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="group"
    >
        <button
            onClick={onToggle}
            className={`w-full flex items-center justify-between gap-4 p-6 rounded-2xl text-left transition-all duration-300 border ${
                isOpen
                    ? "bg-primary-200/5 border-primary-200/20"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
            }`}
        >
            <span
                className={`text-base font-bold transition-colors ${isOpen ? "text-white" : "text-light-100"}`}
            >
                {faq.question}
            </span>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0"
            >
                <ChevronDown
                    className={`size-5 transition-colors ${isOpen ? "text-primary-200" : "text-light-600"}`}
                />
            </motion.div>
        </button>

        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <p className="px-6 py-4 text-sm text-light-400 leading-relaxed">
                        {faq.answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="flex flex-col gap-10 relative">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-200/3 blur-[130px] rounded-full pointer-events-none" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-3 text-center items-center relative z-10"
            >
                <div className="flex badge-institutional">
                    <HelpCircle className="size-5 text-primary-200" />
                    <span className="text-base">Common Questions</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                    Frequently Asked{" "}
                    <span className="text-gradient-premium">Questions</span>
                </h2>
                <p className="text-light-400 text-lg max-w-xl">
                    Everything you need to know about getting started with
                    InterviewPilot.
                </p>
            </motion.div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
                {faqs.map((faq, i) => (
                    <FAQItem
                        key={i}
                        faq={faq}
                        index={i}
                        isOpen={openIndex === i}
                        onToggle={() =>
                            setOpenIndex(openIndex === i ? null : i)
                        }
                    />
                ))}
            </div>
        </section>
    );
};

export default FAQSection;
