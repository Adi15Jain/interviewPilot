import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getInterviewCover } from "@/lib/utils";
import { InterviewCardProps } from "@/types";

const InterviewCard = ({
    interviewId,
    userId,
    role,
    type,
    techstack,
    createdAt,
    feedback,
}: InterviewCardProps) => {
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

    const badgeStyles =
        {
            Behavioral: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            Mixed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            Technical:
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        }[normalizedType] ||
        "bg-light-600/10 text-light-600 border-light-600/20";

    const formattedDate = dayjs(
        feedback?.createdAt || createdAt || Date.now(),
    ).format("MMM D, YYYY");

    return (
        <div className="card-border w-full">
            <div className="card-interview !p-6 !gap-7">
                <div className="flex flex-col gap-5">
                    {/* Header: Logo & Type */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="size-14 rounded-xl bg-white/5 p-3 flex items-center justify-center border border-white/10 shadow-inner">
                            <Image
                                src={getInterviewCover(interviewId || "", role)}
                                alt="company-logo"
                                width={40}
                                height={40}
                                className="object-contain size-full"
                            />
                        </div>
                        <div
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider border",
                                badgeStyles,
                            )}
                        >
                            {normalizedType}
                        </div>
                    </div>

                    {/* Role & Date */}
                    <div className="flex flex-col gap-1.5">
                        <h3 className="text-xl font-black text-white hover:text-primary-200 transition-colors line-clamp-1">
                            {role}
                        </h3>
                        <div className="flex items-center gap-2 text-light-600">
                            <Image
                                src="/calendar.svg"
                                width={16}
                                height={16}
                                alt="calendar"
                                className="opacity-50"
                            />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                {formattedDate}
                            </span>
                        </div>
                    </div>

                    {/* Score & Assessment */}
                    <div className="flex flex-col gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-light-600 uppercase tracking-widest">
                                Proficiency Score
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Image
                                    src="/star.svg"
                                    width={16}
                                    height={16}
                                    alt="star"
                                />
                                <span
                                    className={`text-base font-black ${feedback ? "text-primary-200" : "text-light-800"}`}
                                >
                                    {feedback?.totalScore || "---"}
                                    <span className="text-xs opacity-40 ml-0.5">
                                        /100
                                    </span>
                                </span>
                            </div>
                        </div>
                        <p className="text-lg text-light-400 line-clamp-2 leading-relaxed">
                            {feedback?.finalAssessment ||
                                "Awaiting simulation attempt. Take the interview to generate your competency report."}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-auto">
                    <DisplayTechIcons techStack={techstack} />

                    <Button
                        asChild
                        className="btn-primary !h-10 !px-5 !text-sm"
                    >
                        <Link
                            href={
                                feedback
                                    ? `/interview/${interviewId}/feedback`
                                    : `/interview/${interviewId}`
                            }
                        >
                            {feedback ? "View Result Details" : "Launch Now"}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
