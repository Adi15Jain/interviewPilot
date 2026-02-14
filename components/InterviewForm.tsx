"use client";

import { z } from "zod";
import { useState } from "react";
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
    CheckCircle2,
} from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InterviewFormProps } from "@/types";
import { INTERVIEW_DOMAINS, InterviewDomain } from "@/constants";
import FormField from "./FormField";

const interviewFormSchema = z.object({
    role: z.string().min(2, "Role is required"),
    level: z.string().min(1, "Experience level is required"),
    type: z.string().min(1, "Interview type is required"),
    techstack: z.string().min(1, "Tech stack is required"),
    amount: z.number().min(3).max(15),
});

const iconMap: Record<string, any> = {
    Code: Code,
    Stethoscope: Stethoscope,
    TrendingUp: TrendingUp,
    Scale: Scale,
    Briefcase: Briefcase,
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
        },
    });

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
                    <div className="w-full lg:w-1/3 flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-primary-200 uppercase tracking-widest mb-2">
                            1. Select Domain
                        </h3>
                        <div className="flex flex-col gap-3">
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
                                            className={`group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 text-left ${
                                                isActive
                                                    ? "bg-primary-200/10 border-primary-200 shadow-[0_0_20px_rgba(202,197,254,0.1)]"
                                                    : "bg-[#020408]/40 border-white/5 hover:border-white/10 hover:bg-[#020408]/60"
                                            }`}
                                        >
                                            <div
                                                className={`p-3 rounded-xl transition-colors ${
                                                    isActive
                                                        ? "bg-primary-200 text-dark-100"
                                                        : "bg-white/5 text-light-400 group-hover:text-white"
                                                }`}
                                            >
                                                <Icon className="size-6" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`font-bold transition-colors ${isActive ? "text-white" : "text-light-100"}`}
                                                >
                                                    {domain.name}
                                                </span>
                                                <span className="text-xs text-light-400 line-clamp-1">
                                                    {domain.description}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    <CheckCircle2 className="size-5 text-primary-200" />
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
                        <div className="p-8 rounded-3xl bg-[#020408]/40 backdrop-blur-xl border border-white/5 relative overflow-hidden group/form shadow-2xl">
                            {/* Decorative glow */}
                            <div className="absolute -top-24 -right-24 size-48 bg-primary-200/5 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex flex-col gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Role Selection */}
                                    <div className="flex flex-col gap-4">
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            label="Specific Role"
                                            placeholder="e.g. Senior Software Engineer"
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDomain.popularRoles
                                                .slice(0, 4)
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
                                                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-light-400 hover:text-white rounded-full transition-all border border-white/5 hover:border-white/10"
                                                    >
                                                        {role}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Tech Stack */}
                                    <div className="flex flex-col gap-4">
                                        <FormField
                                            control={form.control}
                                            name="techstack"
                                            label="Relevant Topics / Tech"
                                            placeholder="e.g. React, System Design"
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDomain.techStacks
                                                .slice(0, 3)
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
                                                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary-200/5 hover:bg-primary-200/10 text-primary-200/70 hover:text-primary-200 rounded-full transition-all border border-primary-200/10 hover:border-primary-200/20"
                                                    >
                                                        {stack}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                                    {/* Level */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-light-600 uppercase tracking-[0.2em]">
                                            Level
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
                                                    className={`px-4 py-3 rounded-xl text-left transition-all border ${
                                                        form.watch("level") ===
                                                        lvl.value
                                                            ? "bg-white/10 border-white/20 text-white"
                                                            : "bg-transparent border-white/5 text-light-400 hover:border-white/10"
                                                    }`}
                                                >
                                                    <div className="text-sm font-bold">
                                                        {lvl.label}
                                                    </div>
                                                    <div className="text-[10px] opacity-60">
                                                        {lvl.desc}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Type */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-light-600 uppercase tracking-[0.2em]">
                                            Format
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
                                                    className={`px-4 py-3 rounded-xl text-left transition-all border ${
                                                        form.watch("type") ===
                                                        t.value
                                                            ? "bg-white/10 border-white/20 text-white"
                                                            : "bg-transparent border-white/5 text-light-400 hover:border-white/10"
                                                    }`}
                                                >
                                                    <div className="text-sm font-bold">
                                                        {t.label}
                                                    </div>
                                                    <div className="text-[10px] opacity-60">
                                                        {t.desc}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] font-black text-light-600 uppercase tracking-[0.2em]">
                                            Duration
                                        </label>
                                        <div className="flex flex-col h-full gap-4">
                                            <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                                                <span className="text-4xl font-black text-white">
                                                    {form.watch("amount")}
                                                </span>
                                                <span className="text-[10px] text-light-400 uppercase font-bold mt-1">
                                                    Questions
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="3"
                                                max="15"
                                                step="1"
                                                {...form.register("amount", {
                                                    valueAsNumber: true,
                                                })}
                                                className="w-full accent-primary-200 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isGenerating}
                                    className="w-full py-8 rounded-2xl bg-primary-200 text-dark-100 hover:bg-primary-200/90 text-lg font-black uppercase tracking-widest relative overflow-hidden group/submit transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_30px_rgba(202,197,254,0.2)] hover:shadow-[0_0_50px_rgba(202,197,254,0.3)]"
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-dark-100/30 border-t-dark-100" />
                                            <span>Crafting Simulation...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="size-6 animate-pulse" />
                                            <span>Generate Interview</span>
                                            <ChevronRight className="size-6 group-hover/submit:translate-x-1 transition-transform" />
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
