"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import EmotionTracker from "./EmotionTracker";
import MASLoading from "./MASLoading";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { AgentProps } from "@/types";
import { Message } from "@/types/vapi";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const Agent = ({
    userName,
    userId,
    interviewId,
    feedbackId,
    type,
    profileImage,
    questions,
}: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(
        CallStatus.INACTIVE,
    );
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [emotionalData, setEmotionalData] = useState<any[]>([]);
    const [isEarlyTermination, setIsEarlyTermination] = useState(false);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

    const handleEmotionData = useCallback((data: any) => {
        setEmotionalData((prev) => [...prev, data]);
    }, []);

    useEffect(() => {
        const onCallStart = () => {
            setCallStatus(CallStatus.ACTIVE);
        };

        const onCallEnd = () => {
            console.log("VAPI call ended naturally");
            setCallStatus(CallStatus.FINISHED);
        };

        const onMessage = (message: Message) => {
            console.log("VAPI message received:", message);

            if (
                message.type === "transcript" &&
                message.transcriptType === "final"
            ) {
                const newMessage = {
                    role: message.role,
                    content: message.transcript,
                };
                setMessages((prev) => [...prev, newMessage]);
            }

            // Handle other message types that might indicate workflow completion
            if (
                message.type === "function-call" ||
                message.type === "tool-calls"
            ) {
                console.log("Function/tool call detected:", message);
            }
        };

        const onSpeechStart = () => {
            console.log("speech start");
            setIsSpeaking(true);
        };

        const onSpeechEnd = () => {
            console.log("speech end");
            setIsSpeaking(false);
        };

        const onError = (error: any) => {
            console.error("VAPI Error:", error);
            setCallStatus(CallStatus.FINISHED);

            // Show a more user-friendly error message
            const errorMessage =
                error?.message || error?.errorMsg || JSON.stringify(error);
            if (errorMessage && typeof errorMessage === "string") {
                if (
                    errorMessage.includes("workflow") ||
                    errorMessage.includes("assistant")
                ) {
                    console.error(
                        "VAPI Configuration Error - Check your environment variables",
                    );
                }
                if (
                    errorMessage.includes("Meeting has ended") ||
                    errorMessage.includes("ejection")
                ) {
                    console.error(
                        "VAPI Meeting Error - This could be due to workflow configuration or timeout",
                    );
                }
            }
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setLastMessage(messages[messages.length - 1].content);
        }

        const handleGenerateFeedback = async (messages: SavedMessage[]) => {
            console.log("handleGenerateFeedback");
            setIsGeneratingFeedback(true);

            const { success, feedbackId: id } = await createFeedback({
                interviewId: interviewId!,
                userId: userId!,
                transcript: messages,
                feedbackId,
                emotionalData: emotionalData,
                totalQuestions: (questions || []).length,
                isEarlyTermination: isEarlyTermination,
            });

            if (success && id) {
                router.push(`/interview/${interviewId}/feedback`);
            } else {
                console.log("Error saving feedback");
                router.push("/");
            }
        };

        if (callStatus === CallStatus.FINISHED) {
            if (type === "generate") {
                console.log(
                    "Interview generation completed, redirecting to home...",
                );
                // Check if the interview was actually created before redirecting
                if (messages.length > 0) {
                    // There were messages, so the workflow ran
                    router.push("/");
                } else {
                    // No messages, might be an error - stay on the page
                    console.log("No messages received, staying on page");
                }
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

    const handleCall = async () => {
        try {
            setCallStatus(CallStatus.CONNECTING);

            if (type === "generate") {
                // Validate environment variables
                if (!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
                    throw new Error("VAPI_WORKFLOW_ID not configured");
                }

                console.log("Starting VAPI workflow for interview generation");
                console.log(
                    "Workflow ID:",
                    process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID,
                );
                console.log("Variables:", {
                    username: userName,
                    userid: userId,
                });

                await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    },
                });
            } else {
                let formattedQuestions = "";
                if (questions && questions.length > 0) {
                    formattedQuestions = questions
                        .map((question) => `- ${question}`)
                        .join("\n");
                } else {
                    throw new Error("No questions available for interview");
                }

                console.log("Starting VAPI assistant for interview");
                await vapi.start(interviewer, {
                    variableValues: {
                        questions: formattedQuestions,
                    },
                });
            }
        } catch (error) {
            console.error("Error starting VAPI call:", error);
            setCallStatus(CallStatus.FINISHED);

            // Show user-friendly error message
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            alert(`Failed to start interview: ${errorMessage}`);
        }
    };

    const handleDisconnect = () => {
        setIsEarlyTermination(true);
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    if (isGeneratingFeedback) {
        return <MASLoading />;
    }

    return (
        <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto">
            <div className="call-view items-stretch">
                {/* AI Interviewer Card */}
                <div className="card-interviewer group relative overflow-hidden transition-all duration-700 hover:border-primary-200/80 hover:scale-[1.02] active:scale-[0.99] shadow-2xl">
                    <div className="absolute inset-0 bg-primary-200/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="avatar animate-float shadow-[0_0_40px_rgba(202,197,254,0.3)] !size-[120px]">
                        <Image
                            src="/ai-avatar.png"
                            alt="profile-image"
                            width={100}
                            height={100}
                            className="object-contain relative z-10 size-[80px]"
                        />
                        {isSpeaking && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-primary-200 opacity-20 scale-150" />
                        )}
                        <span className="absolute inset-0 rounded-full border-2 border-primary-200/30 animate-subtle-pulse" />
                    </div>
                    <div className="z-10 text-center">
                        <h3 className="text-2xl font-semibold tracking-tight">
                            AI Interviewer
                        </h3>
                        <p className="text-sm text-primary-200/60 uppercase tracking-widest mt-1">
                            Interviewer
                        </p>
                    </div>

                    {callStatus === CallStatus.ACTIVE && isSpeaking && (
                        <div className="flex gap-1.5 mt-6 h-6 items-end">
                            {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 bg-primary-200 rounded-full animate-bounce"
                                    style={{
                                        height: `${h * 6}px`,
                                        animationDelay: `${i * 0.1}s`,
                                        animationDuration: "0.6s",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* User Profile Card */}
                <div className="card-border group hover:border-white/20 hover:scale-[1.02] active:scale-[0.99] transition-all duration-700 shadow-2xl">
                    <div className="card-content relative overflow-hidden p-10">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative">
                            <Image
                                src={profileImage || "/user-avatar.png"}
                                alt="profile-image"
                                width={120}
                                height={120}
                                className="rounded-full object-cover size-[120px] ring-4 ring-white/5 shadow-2xl"
                            />
                            <div className="absolute -bottom-1 -right-1 size-8 bg-success-100 rounded-full border-4 border-dark-200 flex items-center justify-center">
                                <span className="size-2 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div className="z-10 text-center mt-6">
                            <h3 className="text-2xl font-semibold tracking-tight">
                                {userName}
                            </h3>
                            <p className="text-sm text-light-400 uppercase tracking-widest mt-1">
                                Candidate
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-10 items-center">
                {messages.length > 0 && (
                    <div className="transcript-border max-w-2xl animate-in zoom-in-95 duration-1000">
                        <div className="transcript min-h-24 px-10 py-8">
                            <p
                                key={lastMessage}
                                className="text-xl md:text-2xl leading-snug text-center font-medium bg-gradient-to-r from-white via-white to-white/40 bg-clip-text"
                            >
                                {lastMessage.split(" ").map((word, i) => (
                                    <span
                                        key={i}
                                        className="inline-block animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                                        style={{
                                            animationDelay: `${i * 0.05}s`,
                                        }}
                                    >
                                        {word}&nbsp;
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                )}

                <div className="w-full flex justify-center mt-6">
                    {callStatus !== "ACTIVE" ? (
                        <button
                            className="btn-call group relative overflow-hidden transform transition-all active:scale-95 px-10 py-4"
                            onClick={() => handleCall()}
                        >
                            <span
                                className={cn(
                                    "absolute inset-0 bg-white/20 transition-transform translate-y-full group-hover:translate-y-0 duration-300",
                                    callStatus === "CONNECTING" &&
                                        "translate-y-0",
                                )}
                            />
                            <span className="relative flex items-center gap-2">
                                {callStatus === "INACTIVE" ||
                                callStatus === "FINISHED" ? (
                                    <>Start Interview</>
                                ) : (
                                    <>
                                        <span className="animate-spin size-4 border-2 border-white/20 border-t-white rounded-full" />
                                        Connecting...
                                    </>
                                )}
                            </span>
                        </button>
                    ) : (
                        <button
                            className="btn-disconnect group relative overflow-hidden transform transition-all active:scale-95 px-10 py-4"
                            onClick={() => handleDisconnect()}
                        >
                            <span className="absolute inset-0 bg-white/10 transition-transform translate-y-full group-hover:translate-y-0 duration-300" />
                            <span className="relative">
                                {messages.filter((m) => m.role === "assistant")
                                    .length >= (questions?.length || 0)
                                    ? "Finish & Generate Report"
                                    : "End Interview Early"}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            <EmotionTracker
                isActive={callStatus === CallStatus.ACTIVE}
                onData={handleEmotionData}
            />
        </div>
    );
};

export default Agent;
