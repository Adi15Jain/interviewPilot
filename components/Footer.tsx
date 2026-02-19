import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";

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

    return (
        <footer className="w-full border-t border-white/5 bg-[#020408]/40 backdrop-blur-xl mt-10 relative group/footer mesh-gradient">
            <div className="max-w-7xl mx-auto px-12 max-sm:px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 lg:gap-24">
                    {/* Brand & Institution Section */}
                    <div className="flex flex-col gap-6 md:col-span-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 group/logo w-fit">
                                <h3 className="text-3xl font-black text-white tracking-tighter transition-all duration-300 group-hover/logo:text-primary-200">
                                    InterviewPilot
                                    <span className="text-primary-200 group-hover/logo:text-white transition-colors">
                                        .
                                    </span>
                                </h3>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-primary-200/80 text-[12px] font-black uppercase tracking-[0.2em]">
                                    A Final Year Major Project
                                </p>
                                <p className="text-light-100 text-sm font-bold uppercase tracking-tight">
                                    College of Computing Sciences & IT
                                </p>
                                <p className="text-light-400 text-sm font-semibold">
                                    Teerthanker Mahaveer University, Moradabad
                                </p>
                            </div>
                        </div>
                        <p className="text-light-400 text-sm leading-relaxed max-w-sm">
                            The ultimate AI-powered interview practice platform.
                            Designed and developed as a pinnacle engineering
                            achievement by BTECH CSE AI Students (Batch
                            2022-26).
                        </p>
                    </div>

                    {/* Quick Access */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-[12px] font-black text-white uppercase tracking-[0.3em] opacity-50">
                            Navigation
                        </h4>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Homepage", href: "/" },
                                { label: "Practice Lab", href: "/interview" },
                                { label: "Performance Hub", href: "/feedback" },
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-light-400 hover:text-primary-200 transition-all text-sm w-fit flex items-center group/link"
                                >
                                    <span className="w-0 group-hover/link:w-3 h-px bg-primary-200 mr-0 group-hover/link:mr-3 transition-all duration-300" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-[12px] font-black text-white uppercase tracking-[0.3em] opacity-50">
                            Development Team
                        </h4>
                        <div className="flex flex-col gap-5">
                            {creators.map((creator) => (
                                <div
                                    key={creator.name}
                                    className="flex flex-col gap-1.5 group/item relative"
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
                                        {/* Tooltip Arrow alternative */}
                                        <div className="absolute -bottom-1 left-6 w-3 h-3 bg-dark-200/80 border-r border-b border-white/10 rotate-45" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-light-100 text-sm font-black tracking-tight cursor-default">
                                            {creator.name}
                                        </p>
                                        <div className="flex items-center gap-3 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <a
                                                href={creator.github}
                                                target="_blank"
                                                className="text-light-600 hover:text-primary-200 transition-colors"
                                            >
                                                <Github className="size-4.5" />
                                            </a>
                                            <a
                                                href={creator.linkedin}
                                                target="_blank"
                                                className="text-light-600 hover:text-primary-200 transition-colors"
                                            >
                                                <Linkedin className="size-4.5" />
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-light-600 font-bold uppercase tracking-wider">
                                        {creator.role}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Academic Footer Bar */}
                <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                    <p className="text-light-600 text-[10px] font-black tracking-[0.3em] text-center uppercase">
                        © {currentYear} INTERVIEW PILOT • PROUDLY DEVELOPED AT
                        CCSIT, TMU UNIVERSITY
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        <div className="flex items-center gap-2 group cursor-help">
                            <span className="text-[9px] font-black text-light-800 uppercase tracking-widest group-hover:text-light-400 transition-colors">
                                Powered by High-End LLMs
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="size-1 rounded-full bg-primary-200/40" />
                                <span className="text-[9px] font-black text-light-600 uppercase">
                                    GPT-4o
                                </span>
                                <span className="size-1 rounded-full bg-primary-200/40" />
                                <span className="text-[9px] font-black text-light-600 uppercase">
                                    Gemini 1.5 Pro
                                </span>
                                <span className="size-1 rounded-full bg-primary-200/40" />
                                <span className="text-[9px] font-black text-light-600 uppercase">
                                    Vapi.ai
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
