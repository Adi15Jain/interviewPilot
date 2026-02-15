import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getInterviewCover } from "@/lib/utils";

import {
    getFeedbackByInterviewId,
    getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { RouteParams } from "@/types";

const InterviewDetails = async ({ params }: RouteParams) => {
    const { id } = await params;

    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const interview = await getInterviewById(id);
    if (!interview) redirect("/");

    const feedback = await getFeedbackByInterviewId({
        interviewId: id,
        userId: user.id,
    });

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-[1500ms]">
            <header className="flex flex-row gap-4 justify-between items-center opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-row gap-4 items-center">
                        <Image
                            src={getInterviewCover(
                                interview.id,
                                interview.role,
                            )}
                            alt="cover-image"
                            width={32}
                            height={32}
                            className="rounded-full object-cover size-[32px] border border-white/10"
                        />
                        <h1 className="text-3xl font-medium capitalize text-white">
                            {interview.role} Interview
                        </h1>
                    </div>

                    <div className="hidden md:block">
                        <DisplayTechIcons techStack={interview.techstack} />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-dark-200/50 border border-white/10 rounded-full text-xs font-medium text-light-400 capitalize">
                        {interview.type}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-success-100/10 border border-success-100/20 rounded-full">
                        <span className="size-2 bg-success-100 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-success-100 uppercase tracking-wider">
                            Live
                        </span>
                    </div>
                </div>
            </header>

            <Agent
                userName={user.name}
                userId={user.id}
                profileImage={user.image}
                interviewId={id}
                type="interview"
                questions={interview.questions}
                feedbackId={feedback?.id}
            />
        </div>
    );
};

export default InterviewDetails;
