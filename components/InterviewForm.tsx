"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Code,
    Stethoscope,
    TrendingUp,
    Scale,
    Briefcase,
    ChevronRight,
    Sparkles,
    GraduationCap,
    Palette,
    Gavel,
    Factory,
} from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InterviewFormProps } from "@/types";
import {
    INTERVIEW_DOMAINS,
    InterviewDomain,
    SUPPORTED_LANGUAGES,
} from "@/constants";
import FormField from "./FormField";
import { Globe } from "lucide-react";

const interviewFormSchema = z.object({
    role: z.string().min(2, "Role is required"),
    level: z.string().min(1, "Experience level is required"),
    type: z.string().min(1, "Interview type is required"),
    techstack: z.string().min(1, "Tech stack is required"),
    amount: z.number().min(3).max(15),
    jobDescription: z.string().optional(),
    language: z.string().default("en"),
});

const iconMap: Record<string, any> = {
    Code: Code,
    Stethoscope: Stethoscope,
    TrendingUp: TrendingUp,
    Scale: Scale,
    Briefcase: Briefcase,
    GraduationCap: GraduationCap,
    Palette: Palette,
    Gavel: Gavel,
    Factory: Factory,
};

const InterviewForm = ({ userId }: InterviewFormProps) => {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<InterviewDomain>(
        INTERVIEW_DOMAINS[0],
    );

    const form = useForm<z.infer<typeof interviewFormSchema>>({
        resolver: zodResolver(interviewFormSchema),
        defaultValues: {
            role: "",
            level: "mid",
            type: "technical",
            techstack: "",
            amount: 5,
            jobDescription: "",
            language: "en",
        },
    });

    // Sync form language with global navbar language preference
    useEffect(() => {
        const stored = localStorage.getItem("interviewpilot-lang");
        if (stored) form.setValue("language", stored);

        const handleStorage = (e: StorageEvent) => {
            if (e.key === "interviewpilot-lang" && e.newValue) {
                form.setValue("language", e.newValue);
            }
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [form]);

    const onSubmit = async (data: z.infer<typeof interviewFormSchema>) => {
        try {
            setIsGenerating(true);
            const response = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, userid: userId }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success("Interview created successfully! 🎉");
                router.push(`/interview/${result.interviewId}`);
            } else {
                toast.error(result.error || "Failed to create interview");
            }
        } catch (error) {
            toast.error("An error occurred while creating the interview");
        } finally {
            setIsGenerating(false);
        }
    };

    const experienceLevels = [
        { value: "junior", label: "Junior", desc: "0-2 years" },
        { value: "mid", label: "Mid-level", desc: "2-5 years" },
        { value: "senior", label: "Senior", desc: "5+ years" },
    ];

    const interviewTypes = [
        { value: "technical", label: "Technical", desc: "Hard skills & depth" },
        { value: "behavioral", label: "Behavioral", desc: "Soft skills & fit" },
        { value: "mixed", label: "Mixed", desc: "Both combined" },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto pb-10">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:flex-row gap-10 items-start"
                >
                    {/* Left Side: Domain Selection */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-base font-bold text-primary-200 uppercase tracking-[0.2em]">
                                1. Select Domain
                            </h3>
                            <p className="text-sm text-light-400">
                                Choose the industry for your simulation
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {INTERVIEW_DOMAINS.map(
                                (domain: InterviewDomain) => {
                                    const Icon = iconMap[domain.icon];
                                    const isActive =
                                        selectedDomain.id === domain.id;
                                    return (
                                        <button
                                            key={domain.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedDomain(domain)
                                            }
                                            className={`group relative flex items-start gap-4 p-6 rounded-2xl border transition-all duration-300 text-left ${
                                                isActive
                                                    ? "bg-primary-200/10 border-primary-200 shadow-[0_0_30px_rgba(202,197,254,0.15)]"
                                                    : "bg-[#020408]/40 border-white/5 hover:border-white/10 hover:bg-[#020408]/60 hover:translate-x-1"
                                            }`}
                                        >
                                            <div
                                                className={`p-4 rounded-xl transition-all duration-300 ${
                                                    isActive
                                                        ? "bg-primary-200 text-dark-100 scale-110"
                                                        : "bg-white/5 text-light-400 group-hover:text-white group-hover:bg-white/10"
                                                }`}
                                            >
                                                <Icon className="size-6" />
                                            </div>
                                            <div className="flex flex-col gap-1 pr-6">
                                                <span
                                                    className={`text-base font-bold transition-colors ${isActive ? "text-white" : "text-light-100 group-hover:text-white"}`}
                                                >
                                                    {domain.name}
                                                </span>
                                                <span className="text-xs text-light-400 line-clamp-2 leading-relaxed">
                                                    {domain.description}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                                    <div className="size-2.5 rounded-full bg-primary-200 animate-pulse" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {/* Right Side: Form Details */}
                    <div className="w-full lg:w-2/3 flex flex-col gap-8">
                        <div className="p-10 rounded-[2rem] bg-[#020408]/40 backdrop-blur-3xl border border-white/5 relative overflow-hidden group/form shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            {/* Premium Glow Effects */}
                            <div className="absolute -top-40 -left-40 size-80 bg-primary-200/10 blur-[120px] rounded-full pointer-events-none group-hover/form:bg-primary-200/20 transition-all duration-1000" />
                            <div className="absolute -bottom-40 -right-40 size-80 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-10">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-base font-bold text-primary-200 uppercase tracking-[0.2em]">
                                        2. Customization
                                    </h3>
                                    <p className="text-sm text-light-400">
                                        Fine-tune the interview to your specific
                                        needs
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {/* Role Selection */}
                                    <div className="flex flex-col gap-5">
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            label="Target Role"
                                            placeholder={`e.g. ${selectedDomain.popularRoles.slice(0, 2).join(", ")}`}
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDomain.popularRoles
                                                .slice(0, 5)
                                                .map((role: string) => (
                                                    <button
                                                        key={role}
                                                        type="button"
                                                        onClick={() =>
                                                            form.setValue(
                                                                "role",
                                                                role,
                                                            )
                                                        }
                                                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-primary-200/20 text-light-400 hover:text-primary-200 rounded-lg transition-all border border-white/5 hover:border-primary-200/30"
                                                    >
                                                        {role}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="flex flex-col gap-5">
                                        <FormField
                                            control={form.control}
                                            name="techstack"
                                            label="Key Topics / Stack"
                                            placeholder={`e.g. ${selectedDomain.techStacks.slice(0, 2).join(", ")}`}
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDomain.techStacks
                                                .slice(0, 4)
                                                .map((stack: string) => (
                                                    <button
                                                        key={stack}
                                                        type="button"
                                                        onClick={() =>
                                                            form.setValue(
                                                                "techstack",
                                                                stack,
                                                            )
                                                        }
                                                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-primary-200/20 text-light-400 hover:text-primary-200 rounded-lg transition-all border border-white/5 hover:border-primary-200/30"
                                                    >
                                                        {stack}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div className="flex flex-col gap-5 pt-6 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="size-5 text-primary-200" />
                                            <h4 className="text-base font-bold text-light-100">
                                                Job Description
                                            </h4>
                                        </div>
                                        <span className="text-xs text-light-400 bg-white/5 px-3 py-1.5 rounded">
                                            Optional but Recommended
                                        </span>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="jobDescription"
                                        label=""
                                        placeholder="Paste the Job Description here for a more tailored experience..."
                                        isTextArea
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                    {/* Level */}
                                    <div className="flex flex-col gap-4">
                                        <label className="text-xs font-black text-primary-200 uppercase tracking-[0.2em]">
                                            Experience
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            {experienceLevels.map((lvl) => (
                                                <button
                                                    key={lvl.value}
                                                    type="button"
                                                    onClick={() =>
                                                        form.setValue(
                                                            "level",
                                                            lvl.value,
                                                        )
                                                    }
                                                    className={`px-4 py-4 rounded-2xl text-left transition-all border-2 ${
                                                        form.watch("level") ===
                                                        lvl.value
                                                            ? "bg-primary-200/10 border-primary-200 text-white shadow-[0_0_20px_rgba(202,197,254,0.1)]"
                                                            : "bg-white/5 border-transparent text-light-400 hover:bg-white/10"
                                                    }`}
                                                >
                                                    <div className="text-sm font-bold leading-none mb-1">
                                                        {lvl.label}
                                                    </div>
                                                    <div className="text-xs opacity-50 font-medium">
                                                        {lvl.desc}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Type */}
                                    <div className="flex flex-col gap-4">
                                        <label className="text-xs font-black text-primary-200 uppercase tracking-[0.2em]">
                                            Simulation type
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            {interviewTypes.map((t) => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    onClick={() =>
                                                        form.setValue(
                                                            "type",
                                                            t.value,
                                                        )
                                                    }
                                                    className={`px-4 py-4 rounded-2xl text-left transition-all border-2 ${
                                                        form.watch("type") ===
                                                        t.value
                                                            ? "bg-primary-200/10 border-primary-200 text-white shadow-[0_0_20px_rgba(202,197,254,0.1)]"
                                                            : "bg-white/5 border-transparent text-light-400 hover:bg-white/10"
                                                    }`}
                                                >
                                                    <div className="text-sm font-bold leading-none mb-1">
                                                        {t.label}
                                                    </div>
                                                    <div className="text-xs opacity-50 font-medium">
                                                        {t.desc}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Number of Questions */}
                                    <div className="flex flex-col gap-4">
                                        <label className="text-xs font-black text-primary-200 uppercase tracking-[0.2em]">
                                            No. of Questions
                                        </label>
                                        <div className="flex flex-col gap-4 bg-white/5 rounded-2xl p-5 border-2 border-transparent">
                                            <div className="flex items-center justify-center">
                                                <span className="text-4xl font-black text-primary-200 tabular-nums">
                                                    {form.watch("amount")}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min={3}
                                                max={15}
                                                step={1}
                                                value={form.watch("amount")}
                                                onChange={(e) =>
                                                    form.setValue(
                                                        "amount",
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-primary-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-200 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(202,197,254,0.5)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125"
                                            />
                                            <div className="flex justify-between text-xs text-light-400 font-medium">
                                                <span>3</span>
                                                <span>15</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Language Selection */}
                                    <div className="flex flex-col gap-4">
                                        <label className="text-xs font-black text-primary-200 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Globe className="size-4" /> Native
                                            Language
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                {SUPPORTED_LANGUAGES.map(
                                                    (lang) => (
                                                        <button
                                                            key={lang.code}
                                                            type="button"
                                                            onClick={() =>
                                                                form.setValue(
                                                                    "language",
                                                                    lang.code,
                                                                )
                                                            }
                                                            className={`px-4 py-3 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
                                                                form.watch(
                                                                    "language",
                                                                ) === lang.code
                                                                    ? "bg-primary-200/10 border-primary-200 text-white"
                                                                    : "bg-white/5 border-transparent text-light-400 hover:bg-white/10"
                                                            }`}
                                                        >
                                                            <span className="text-xl">
                                                                {lang.flag}
                                                            </span>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-bold leading-none">
                                                                    {lang.name}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="w-full py-10 rounded-2xl bg-primary-200 text-dark-100 hover:bg-primary-200/90 text-2xl font-black uppercase tracking-[0.25em] relative overflow-hidden group/submit transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(202,197,254,0.3)] hover:shadow-[0_0_60px_rgba(202,197,254,0.4)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/submit:animate-shimmer" />
                                    {isGenerating ? (
                                        <div className="flex items-center gap-4">
                                            <div className="animate-spin rounded-full h-7 w-7 border-4 border-dark-100/30 border-t-dark-100" />
                                            <span className="animate-pulse">
                                                Analyzing...
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="size-8 animate-pulse text-dark-100" />
                                            <span>Initialize Session</span>
                                            <ChevronRight className="size-8 group-hover/submit:translate-x-2 transition-all duration-500" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default InterviewForm;
