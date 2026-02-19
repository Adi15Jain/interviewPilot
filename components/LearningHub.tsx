"use client";

import { BookOpen, Video, Brain, ExternalLink } from "lucide-react";

interface LearningItem {
    topic: string;
    resourceType: string;
    reason: string;
}

interface LearningHubProps {
    learningPath: LearningItem[];
}

const LearningHub = ({ learningPath }: LearningHubProps) => {
    if (!learningPath || learningPath.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "video":
                return <Video className="size-5" />;
            case "flashcard":
                return <Brain className="size-5" />;
            default:
                return <BookOpen className="size-5" />;
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-black uppercase tracking-[0.3em] text-primary-200">
                    Astro-Academy: Learning Hub
                </h3>
                <p className="text-light-400 text-md tracking-wide">
                    Personalized resources curated by our Specialized Agents to
                    accelerate your growth.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningPath.map((item, index) => (
                    <div
                        key={index}
                        className="glass-card flex flex-col gap-4 p-6 hover:border-primary-500/30 transition-all duration-300 group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="p-3 rounded-xl bg-primary-500/10 text-primary-200 border border-primary-500/20 group-hover:bg-primary-500/20 transition-colors">
                                {getIcon(item.resourceType)}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-light-600/60 font-mono">
                                {item.resourceType}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-lg font-bold text-white group-hover:text-primary-200 transition-colors">
                                {item.topic}
                            </h4>
                            <p className="text-xs text-light-400 leading-relaxed italic">
                                "{item.reason}"
                            </p>
                        </div>

                        <button className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-200 hover:text-white transition-colors">
                            Explore Resource
                            <ExternalLink className="size-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningHub;
