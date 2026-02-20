"use client";

import { useRef, useCallback } from "react";
import { toPng, toBlob } from "html-to-image";
import { Download, Share2, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportCardProps {
    userName: string;
    role: string;
    date: string;
    totalScore: number;
    categoryScores: Array<{ name: string; score: number; comment: string }>;
    strengths: string[];
    finalAssessment: string;
    benchmarkPercentile?: number;
}

const ReportCard = ({
    userName,
    role,
    date,
    totalScore,
    categoryScores,
    strengths,
    finalAssessment,
    benchmarkPercentile,
}: ReportCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = useCallback(async () => {
        if (!cardRef.current) return;
        try {
            const dataUrl = await toPng(cardRef.current, {
                backgroundColor: "#08090D",
                pixelRatio: 2,
            });
            const link = document.createElement("a");
            link.download = `InterviewPilot-Report-${role.replace(/\s+/g, "-")}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Failed to generate report card:", err);
        }
    }, [role]);

    const handleShare = useCallback(async () => {
        if (!cardRef.current) return;
        try {
            const blob = await toBlob(cardRef.current, {
                backgroundColor: "#08090D",
                pixelRatio: 2,
            });
            if (!blob) return;
            const file = new File([blob], `interviewpilot-report.png`, {
                type: "image/png",
            });
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `InterviewPilot - ${role} Report`,
                    text: `I scored ${totalScore}% on my ${role} interview simulation!`,
                    files: [file],
                });
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob }),
                ]);
                alert("Report card copied to clipboard!");
            }
        } catch (err) {
            console.error("Failed to share report card:", err);
        }
    }, [role, totalScore]);

    const scoreColor =
        totalScore >= 80 ? "#4ade80" : totalScore >= 60 ? "#facc15" : "#f87171";

    return (
        <div className="flex flex-col gap-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Button
                    onClick={handleDownload}
                    variant="ghost"
                    className="h-11 px-6 border border-white/5 bg-white/[0.02] hover:bg-white/5 text-xs font-black uppercase tracking-widest rounded-xl text-white gap-2"
                >
                    <Download className="size-3.5" />
                    Download Report
                </Button>
                <Button
                    onClick={handleShare}
                    variant="ghost"
                    className="h-11 px-6 border border-primary-200/20 bg-primary-200/5 hover:bg-primary-200/10 text-xs font-black uppercase tracking-widest rounded-xl text-primary-200 gap-2"
                >
                    <Share2 className="size-3.5" />
                    Share
                </Button>
            </div>

            {/* The Report Card (capture target) */}
            <div
                ref={cardRef}
                className="w-full max-w-2xl p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden"
                style={{ backgroundColor: "#08090D" }}
            >
                {/* Background glow */}
                <div
                    className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-20"
                    style={{ background: scoreColor }}
                />

                <div className="relative z-10 flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-2xl font-black text-white tracking-tight">
                                {userName}
                            </h3>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-light-600">
                                <span className="text-primary-200">{role}</span>
                                <span className="size-1.5 bg-white/20 rounded-full" />
                                <span>{date}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className="text-5xl font-black tabular-nums"
                                style={{ color: scoreColor }}
                            >
                                {totalScore}
                                <span className="text-lg text-light-400 ml-0.5">
                                    %
                                </span>
                            </div>
                            {benchmarkPercentile &&
                                benchmarkPercentile <= 25 && (
                                    <div className="flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <Award className="size-3 text-emerald-400" />
                                        <span className="text-[9px] font-black text-emerald-400 uppercase">
                                            Top {benchmarkPercentile}%
                                        </span>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Category Scores */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600">
                            Performance Breakdown
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {categoryScores.slice(0, 5).map((cat) => (
                                <div
                                    key={cat.name}
                                    className="flex items-center gap-4"
                                >
                                    <span className="text-xs font-bold text-light-400 w-32 truncate">
                                        {cat.name}
                                    </span>
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-primary-200/60 to-primary-200"
                                            style={{
                                                width: `${cat.score}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-white tabular-nums w-10 text-right">
                                        {cat.score}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Strengths */}
                    <div className="flex flex-col gap-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-light-600">
                            Key Strengths
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {strengths.slice(0, 3).map((s, i) => (
                                <div
                                    key={i}
                                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-light-100"
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAS Verdict */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="size-3 text-primary-200" />
                            <span className="text-[9px] font-black text-primary-200 uppercase tracking-[0.3em]">
                                AI Assessment
                            </span>
                        </div>
                        <p className="text-xs text-light-400 leading-relaxed line-clamp-3">
                            {finalAssessment}
                        </p>
                    </div>

                    {/* Footer Branding */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white tracking-tight">
                                InterviewPilot
                                <span className="text-primary-200">.</span>
                            </span>
                        </div>
                        <span className="text-[8px] font-bold text-light-800 uppercase tracking-[0.3em]">
                            AI-Powered Interview Platform
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportCard;
