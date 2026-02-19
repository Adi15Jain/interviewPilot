"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/constants";
import {
    Feedback,
    GetLatestInterviewsParams,
    Interview,
    GetFeedbackByInterviewIdParams,
} from "@/types";
import {
    runTechnicalSpecialist,
    runBehavioralAnalyst,
    runCultureExpert,
    runGrowthCoach,
    runOrchestrator,
} from "@/lib/mas/agents";

export interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
    feedbackId?: string;
    emotionalData?: {
        confidence: number;
        eyeContact: number;
        timestamp: number;
    }[];
    totalQuestions?: number;
    isEarlyTermination?: boolean;
}

export async function createFeedback(params: CreateFeedbackParams) {
    const {
        interviewId,
        userId,
        transcript,
        feedbackId,
        emotionalData,
        totalQuestions = 1,
        isEarlyTermination = false,
    } = params;

    try {
        const interview = await prisma.interview.findUnique({
            where: { id: interviewId },
        });

        if (!interview) {
            throw new Error("Interview not found");
        }

        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `${sentence.role}: ${sentence.content}`,
            )
            .join("\n");

        console.log("Starting MAS Workflow...");

        // Run specialized agents in parallel
        const [techResult, behavioralResult, cultureResult] = await Promise.all(
            [
                runTechnicalSpecialist(formattedTranscript, interview.role),
                runBehavioralAnalyst(formattedTranscript, emotionalData),
                runCultureExpert(formattedTranscript, interview.role),
            ],
        );

        console.log("Specialized analysis completed. Running Growth Coach...");

        // Run Growth Coach based on specialized analysis
        const { object: growthCoachReport } = await runGrowthCoach(
            techResult.object,
            behavioralResult.object,
            cultureResult.object,
        );

        console.log("Growth Coach completed. Running Orchestrator...");

        // Orchestrate final feedback
        const { object: orchestratedFeedback } = await runOrchestrator(
            interview.role,
            techResult.object,
            behavioralResult.object,
            cultureResult.object,
            growthCoachReport,
        );

        const feedbackData = {
            interviewId: interviewId,
            userId: userId,
            totalScore: orchestratedFeedback.totalScore,
            categoryScores: orchestratedFeedback.categoryScores,
            strengths: orchestratedFeedback.strengths,
            areasForImprovement: orchestratedFeedback.areasForImprovement,
            finalAssessment: orchestratedFeedback.finalAssessment,
            emotionalAnalysis: emotionalData || [],
            behavioralTips: orchestratedFeedback.behavioralTips || [],
            learningPath: orchestratedFeedback.learningPath || [],
        };

        let feedback;

        if (feedbackId) {
            // Update existing feedback
            feedback = await prisma.feedback.update({
                where: { id: feedbackId },
                data: feedbackData,
            });
        } else {
            // Create new feedback
            feedback = await prisma.feedback.create({
                data: feedbackData,
            });
        }

        return { success: true, feedbackId: feedback.id };
    } catch (error) {
        console.error("Error in MAS Workflow:", error);
        return { success: false };
    }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    try {
        const interview = await prisma.interview.findUnique({
            where: { id },
        });

        return interview as Interview | null;
    } catch (error) {
        console.error("Error getting interview:", error);
        return null;
    }
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    try {
        const feedback = await prisma.feedback.findUnique({
            where: {
                interviewId_userId: {
                    interviewId,
                    userId,
                },
            },
        });

        if (!feedback) return null;

        return {
            ...feedback,
            categoryScores: feedback.categoryScores as any,
            createdAt: feedback.createdAt.toISOString(),
        } as Feedback;
    } catch (error) {
        console.error("Error getting feedback:", error);
        return null;
    }
}

export async function getLatestInterviews(
    params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    try {
        const interviews = await prisma.interview.findMany({
            where: {
                finalized: true,
                userId: {
                    not: userId,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });

        return interviews.map((interview) => ({
            ...interview,
            createdAt: interview.createdAt.toISOString(),
        })) as Interview[];
    } catch (error) {
        console.error("Error getting latest interviews:", error);
        return null;
    }
}

export async function getInterviewsByUserId(
    userId: string,
): Promise<Interview[] | null> {
    try {
        const interviews = await prisma.interview.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return interviews.map((interview) => ({
            ...interview,
            createdAt: interview.createdAt.toISOString(),
        })) as Interview[];
    } catch (error) {
        console.error("Error getting user interviews:", error);
        return null;
    }
}
export async function getFeedbacksByUserId(
    userId: string,
): Promise<any[] | null> {
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: {
                userId,
            },
            include: {
                interview: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return feedbacks.map((feedback) => ({
            ...feedback,
            categoryScores: feedback.categoryScores as any,
            createdAt: feedback.createdAt.toISOString(),
            interview: {
                ...feedback.interview,
                createdAt: feedback.interview.createdAt.toISOString(),
            },
        }));
    } catch (error) {
        console.error("Error getting user feedbacks:", error);
        return null;
    }
}
export async function getGlobalStats(userId: string) {
    try {
        // Get average score for the current user
        const userFeedbacks = await prisma.feedback.findMany({
            where: { userId },
            select: { totalScore: true },
        });

        if (userFeedbacks.length === 0) {
            return { percentile: 100, globalAverage: 0 };
        }

        const userAvg =
            userFeedbacks.reduce((acc, f) => acc + f.totalScore, 0) /
            userFeedbacks.length;

        // Get average scores for all other users who have feedbacks
        const allUserFeedbacks = await prisma.feedback.groupBy({
            by: ["userId"],
            _avg: {
                totalScore: true,
            },
        });

        const otherAvgs = allUserFeedbacks
            .filter((stat) => stat.userId !== userId)
            .map((stat) => stat._avg.totalScore || 0);

        if (otherAvgs.length === 0) {
            return { percentile: 50, globalAverage: userAvg };
        }

        // Calculate percentile: how many users have a lower average score than current user
        const usersBelow = otherAvgs.filter((avg) => avg < userAvg).length;
        const totalUsers = otherAvgs.length + 1; // +1 for the current user

        // Rank is (totalUsers - usersBelow) / totalUsers
        // If usersBelow is totalUsers - 1, then rank is 1/totalUsers (e.g. top 1%)
        const percentile = Math.max(
            1,
            Math.round(((totalUsers - usersBelow) / totalUsers) * 100),
        );

        const globalAvg =
            allUserFeedbacks.reduce(
                (acc, stat) => acc + (stat._avg.totalScore || 0),
                0,
            ) / allUserFeedbacks.length;

        return { percentile, globalAverage: globalAvg };
    } catch (error) {
        console.error("Error getting global stats:", error);
        return { percentile: 100, globalAverage: 0 };
    }
}

export async function getLeaderboard(limit: number = 50) {
    try {
        const leaderboardData = await prisma.feedback.groupBy({
            by: ["userId"],
            _avg: {
                totalScore: true,
            },
            _count: {
                interviewId: true,
            },
            orderBy: {
                _avg: {
                    totalScore: "desc",
                },
            },
            take: limit,
        });

        const userIds = leaderboardData.map((d) => d.userId);
        const users = await prisma.user.findMany({
            where: {
                id: { in: userIds },
            },
            select: {
                id: true,
                name: true,
                image: true,
                profileURL: true,
            },
        });

        return leaderboardData.map((data) => {
            const user = users.find((u) => u.id === data.userId);
            return {
                userId: data.userId,
                name: user?.name || "Unknown User",
                image: user?.image || user?.profileURL || null,
                avgScore: Math.round(data._avg.totalScore || 0),
                interviewCount: data._count.interviewId,
            };
        });
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
    }
}
