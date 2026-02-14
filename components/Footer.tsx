import Link from "next/link";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-light-800/30 bg-dark-200/50 backdrop-blur-sm mt-20">
            <div className="max-w-7xl mx-auto px-16 max-sm:px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-primary-100">
                            InterviewPilot
                        </h3>
                        <p className="text-light-400 text-sm leading-relaxed">
                            AI-powered interview practice platform to help you
                            ace your next job interview with confidence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-semibold text-white">
                            Quick Links
                        </h4>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-light-400 hover:text-primary-200 transition-colors text-sm w-fit"
                            >
                                Home
                            </Link>
                            <Link
                                href="/interview"
                                className="text-light-400 hover:text-primary-200 transition-colors text-sm w-fit"
                            >
                                Start Interview
                            </Link>
                            <Link
                                href="/feedback"
                                className="text-light-400 hover:text-primary-200 transition-colors text-sm w-fit"
                            >
                                Feedbacks
                            </Link>
                        </div>
                    </div>

                    {/* Developer Info */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-base font-semibold text-white">
                            Developer
                        </h4>
                        <p className="text-light-400 text-sm">
                            Built by Adi, Himanshu, Ashmit
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/Adi15Jain"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-light-400 hover:text-primary-200 transition-all hover:scale-110"
                                aria-label="GitHub"
                            >
                                <Github className="size-8" />
                            </a>
                            <a
                                href="https://linkedin.com/in/adi-jain"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-light-400 hover:text-primary-200 transition-all hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="size-8" />
                            </a>
                            <a
                                href="mailto:adijain@example.com"
                                className="text-light-400 hover:text-primary-200 transition-all hover:scale-110"
                                aria-label="Email"
                            >
                                <Mail className="size-8" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-light-800/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-light-600 text-sm">
                        © {currentYear} InterviewPilot. All rights reserved.
                    </p>
                    <p className="text-light-600 text-sm">
                        Powered by AI • Made with Next.js
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
