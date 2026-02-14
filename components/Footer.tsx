import Link from "next/link";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-white/5 bg-[#020408]/40 backdrop-blur-xl mt-32 relative overflow-hidden group/footer">
            {/* Futuristic Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/5 blur-[120px] rounded-full -z-10 group-hover/footer:bg-primary-200/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10 group-hover/footer:bg-blue-500/10 transition-colors duration-1000" />

            <div className="max-w-7xl mx-auto px-12 max-sm:px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-6 md:col-span-2">
                        <div className="flex items-center gap-2 group/logo w-fit">
                            <h3 className="text-2xl font-black text-white tracking-tighter transition-all duration-300 group-hover/logo:text-primary-200">
                                InterviewPilot
                                <span className="text-primary-200 group-hover/logo:text-white transition-colors">
                                    .
                                </span>
                            </h3>
                        </div>
                        <p className="text-light-400 text-base leading-relaxed max-w-sm">
                            The ultimate AI-powered interview practice platform.
                            Designed to bridge the gap between preparation and
                            performance with state-of-the-art simulations.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                            Navigation
                        </h4>
                        <div className="flex flex-col gap-4">
                            {[
                                { label: "Home", href: "/" },
                                {
                                    label: "Start Interview",
                                    href: "/interview",
                                },
                                { label: "Feedbacks", href: "/feedback" },
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-light-400 hover:text-primary-200 transition-all text-sm w-fit flex items-center group/link"
                                >
                                    <span className="w-0 group-hover/link:w-2 h-px bg-primary-200 mr-0 group-hover/link:mr-2 transition-all duration-300" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">
                            Created By
                        </h4>
                        <div className="flex flex-col gap-4">
                            <p className="text-light-100 text-sm font-medium flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-primary-200 animate-pulse" />
                                Adi
                            </p>
                            <p className="text-light-100 text-sm font-medium flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-primary-200 animate-pulse" />
                                Himanshu
                            </p>
                            <p className="text-light-100 text-sm font-medium flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-primary-200 animate-pulse" />
                                Ashmit
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-light-600 text-xs font-medium tracking-wide">
                        © {currentYear} INTERVIEWPILOT. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-6">
                        <p className="text-light-600 text-xs font-semibold flex items-center gap-2">
                            <span className="size-2 rounded-full border border-primary-200/30 flex items-center justify-center">
                                <span className="size-0.5 rounded-full bg-primary-200" />
                            </span>
                            POWERED BY GEMINI
                        </p>
                        <p className="text-light-600 text-xs font-semibold">
                            BUILT WITH NEXT.JS
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
