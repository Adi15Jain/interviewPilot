"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    History,
    Trophy,
    AlertTriangle,
    Rocket,
    ArrowRight,
    SearchX,
} from "lucide-react";

/* ── Floating Particle Component ── */
const NeuralParticle = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1.2, 0],
            x: ["0%", `${Math.random() * 100 - 50}%`],
            y: ["0%", `${Math.random() * 100 - 50}%`],
        }}
        transition={{
            duration: 8 + Math.random() * 5,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
        className="absolute size-1 rounded-full bg-primary-200/40 blur-[1px]"
    />
);

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-between relative overflow-hidden py-20 px-4">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-200/5 blur-[160px] rounded-full" />
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="absolute top-1/2 left-1/2">
                        <NeuralParticle delay={i * 0.5} />
                    </div>
                ))}
            </div>

            {/* Top Badge */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-xl">
                    <AlertTriangle className="size-4 text-primary-200 animate-pulse" />
                    <span className="text-[10px] font-black text-light-100 uppercase tracking-[0.3em]">
                        System Error: Request_Timeout_Anomaly
                    </span>
                </div>
            </motion.div>

            {/* Central Hero Section */}
            <div className="relative z-10 flex flex-col items-center gap-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="relative"
                >
                    {/* The 404 Glitch Text */}
                    <div className="relative">
                        <motion.h1
                            animate={{
                                x: [0, -2, 2, -1, 0],
                                opacity: [1, 0.8, 1, 0.9, 1],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                            className="text-[12rem] md:text-[16rem] font-black text-gradient-premium leading-none tracking-tighter"
                        >
                            404
                        </motion.h1>

                        {/* Overlay "Shadow" for Depth */}
                        <h1 className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-white/5 leading-none tracking-tighter blur-2xl -z-10 translate-y-4">
                            404
                        </h1>
                    </div>

                    {/* Technical Icon Overlay */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -20 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="absolute -top-6 -right-6 md:-top-10 md:-right-10 size-20 md:size-24 rounded-[2rem] bg-dark-200 border border-white/10 flex items-center justify-center shadow-2xl rotate-12"
                    >
                        <SearchX className="size-10 md:size-12 text-primary-200" />
                        <div className="absolute inset-0 rounded-[2rem] bg-primary-200/5 animate-pulse" />
                    </motion.div>
                </motion.div>

                <div className="flex flex-col items-center gap-4 text-center max-w-xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-4xl font-black text-white tracking-tight uppercase"
                    >
                        Lost in the Neural Void
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-light-400 text-md leading-relaxed"
                    >
                        It seems you've drifted beyond the mapped neural
                        pipeline. The resource you are looking for has either
                        been unlinked or never existed in this sector.
                    </motion.p>
                </div>
            </div>

            {/* Bottom Navigation Hub */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="relative z-10 w-full max-w-4xl"
            >
                <div className="flex flex-col gap-6 items-center">
                    <span className="text-[14px] font-black text-white/40 uppercase tracking-[0.5em]">
                        Relocation Channels
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {[
                            {
                                name: "Home",
                                icon: Home,
                                href: "/",
                                desc: "Return to central command",
                                color: "#cac5fe",
                            },
                            {
                                name: "History",
                                icon: History,
                                href: "/history",
                                desc: "View past neural logs",
                                color: "#a78bfa",
                            },
                            {
                                name: "Global Rank",
                                icon: Trophy,
                                href: "/leaderboard",
                                desc: "Consult the leaderboard",
                                color: "#818cf8",
                            },
                        ].map((nav, i) => (
                            <Link key={nav.name} href={nav.href}>
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="glass-card-extreme p-6 rounded-3xl border border-white/5 hover:border-primary-200/30 transition-all group/navitem relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover/navitem:opacity-100" />

                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover/navitem:bg-primary-200/10">
                                            <nav.icon className="size-6 text-light-100 group-hover/navitem:text-primary-200 transition-colors" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-white uppercase text-xs tracking-widest">
                                                {nav.name}
                                            </span>
                                            <span className="text-[10px] text-light-600 font-bold uppercase tracking-tight">
                                                {nav.desc}
                                            </span>
                                        </div>
                                        <ArrowRight className="size-4 text-white/0 group-hover/navitem:text-primary-200 group-hover/navitem:translate-x-1 transition-all ml-auto" />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Footer Decal */}
                    <div className="flex items-center gap-4 mt-8 opacity-30">
                        <span className="text-[10px] font-bold text-white tracking-[0.4em] uppercase">
                            Status: Null_Reference
                        </span>
                        <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white tracking-[0.4em] uppercase">
                            Sector: 0x404
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
