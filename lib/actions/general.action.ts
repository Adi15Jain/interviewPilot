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
}

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId, emotionalData } =
        params;

    try {
        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}\n`,
            )
            .join("");

        const emotionalContext =
            emotionalData && emotionalData.length > 0
                ? `\nBehavioral Data:
               - Average Eye Contact: ${((emotionalData.reduce((acc: number, curr: any) => acc + curr.eyeContact, 0) / emotionalData.length) * 100).toFixed(1)}%
               - Confidence Trend: ${emotionalData.map((d: any) => d.confidence.toFixed(2)).join(", ")}
               Use this data to provide specific "Body Language Coaching" tips in the 'behavioralTips' array.`
                : "";

        const { object } = await generateObject({
            model: google("gemini-2.5-flash"),
            schema: feedbackSchema,
            prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}
        ${emotionalContext}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system: "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        const feedbackData = {
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            emotionalAnalysis: emotionalData || [],
            behavioralTips: (object as any).behavioralTips || [], // We expect Gemini to fill this based on the prompt advice if we update schema
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
        console.error("Error saving feedback:", error);
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
