import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const creators = [
        {
            name: "Adi Jain",
            role: "AI/ML Engineer",
            image: "/creators/adi.jpg",
            github: "https://github.com/Adi15Jain",
            linkedin: "https://www.linkedin.com/in/adi-jain-73334724b/",
        },
        {
            name: "Himanshu Jain",
            role: "Backend Developer",
            image: "/creators/himanshu.jpeg",
            github: "https://github.com/himanshujain112",
            linkedin: "https://www.linkedin.com/in/himanshu-jain112/",
        },
        {
            name: "Ashmit Jain",
            role: "Frontend Developer",
            image: "/creators/himanshu.jpeg",
            github: "https://github.com",
            linkedin: "https://www.linkedin.com/in/ashmit--jain/",
        },
    ];

    const navLinks = [
        { label: "Homepage", href: "/" },
        { label: "Practice Lab", href: "/interview" },
        { label: "Performance Hub", href: "/feedback" },
        { label: "Leaderboard", href: "/leaderboard" },
        { label: "Community", href: "/community" },
    ];

    const techStack = [
        "GPT-4o",
        "Gemini 2.5 Pro",
        "Vapi.ai",
        "Deepgram",
        "ElevenLabs",
    ];

    return (
        <footer className="w-full border-t border-white/5 bg-[#020408]/40 backdrop-blur-xl mt-5 relative group/footer mesh-gradient">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-10">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 lg:gap-24">
                    {/* Brand & Institution */}
                    <div className="flex flex-col gap-5 md:col-span-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 group/logo w-fit">
                                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter transition-all duration-300 group-hover/logo:text-primary-200">
                                    InterviewPilot
                                    <span className="text-primary-200 group-hover/logo:text-white transition-colors">
                                        .
                                    </span>
                                </h3>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-primary-200/80 text-[11px] font-black uppercase tracking-[0.2em]">
                                    Next-Gen AI Platform
                                </p>
                                <p className="text-light-100 text-sm font-bold uppercase tracking-tight">
                                    Adaptive Learning Ecosystem
                                </p>
                            </div>
                        </div>
                        <p className="text-light-400 text-sm leading-relaxed max-w-sm">
                            The ultimate AI-powered interview practice platform.
                            Designed and developed as a pinnacle engineering
                            achievement for high-performance candidates.
                        </p>
                    </div>

                    {/* Navigation — horizontal on mobile, vertical on desktop */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-50">
                            Navigation
                        </h4>
                        <div className="flex flex-wrap gap-2 md:flex-col md:gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-light-400 hover:text-primary-200 transition-all text-sm w-fit flex items-center group/link px-3 py-1.5 md:px-0 md:py-0 bg-white/[0.03] md:bg-transparent rounded-lg md:rounded-none border border-white/5 md:border-0"
                                >
                                    <span className="hidden md:block w-0 group-hover/link:w-3 h-px bg-primary-200 mr-0 group-hover/link:mr-3 transition-all duration-300" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-50">
                            Development Team
                        </h4>
                        <div className="flex flex-col gap-4">
                            {creators.map((creator) => (
                                <div
                                    key={creator.name}
                                    className="flex items-center justify-between gap-3 group/item relative"
                                >
                                    {/* Hover Image Card */}
                                    <div className="absolute bottom-full left-0 mb-4 opacity-0 scale-90 group-hover/item:opacity-100 group-hover/item:scale-100 transition-all duration-300 pointer-events-none z-50">
                                        <div className="relative w-40 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-500/20 bg-dark-200/80 backdrop-blur-xl p-1.5">
                                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                                <Image
                                                    src={creator.image}
                                                    alt={creator.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 left-6 w-3 h-3 bg-dark-200/80 border-r border-b border-white/10 rotate-45" />
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-light-100 text-sm font-black tracking-tight cursor-default">
                                            {creator.name}
                                        </p>
                                        <p className="text-[10px] text-light-600 font-bold uppercase tracking-wider">
                                            {creator.role}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <a
                                            href={creator.github}
                                            target="_blank"
                                            className="text-light-600 hover:text-primary-200 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                                        >
                                            <Github className="size-4" />
                                        </a>
                                        <a
                                            href={creator.linkedin}
                                            target="_blank"
                                            className="text-light-600 hover:text-primary-200 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                                        >
                                            <Linkedin className="size-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                    {/* Copyright */}
                    <p className="text-light-600 text-[11px] md:text-[13px] font-black tracking-[0.2em] md:tracking-[0.3em] text-center uppercase">
                        © {currentYear} Interview Pilot
                    </p>

                    {/* Tech Stack — scrollable on mobile */}
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
                        <span className="text-[10px] font-black text-light-800 uppercase tracking-widest mr-1 hidden md:inline">
                            Powered by
                        </span>
                        {techStack.map((tech, i) => (
                            <span key={tech} className="flex items-center gap-2">
                                {i > 0 && (
                                    <span className="size-1.5 rounded-full bg-primary-200/30" />
                                )}
                                <span className="text-[10px] md:text-[11px] font-bold text-light-600 uppercase">
                                    {tech}
                                </span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
