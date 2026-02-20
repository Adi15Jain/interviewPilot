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
                runTechnicalSpecialist(
                    formattedTranscript,
                    interview.role,
                    interview.language,
                ),
                runBehavioralAnalyst(
                    formattedTranscript,
                    emotionalData,
                    interview.language,
                ),
                runCultureExpert(
                    formattedTranscript,
                    interview.role,
                    interview.language,
                ),
            ],
        );

        console.log("Specialized analysis completed. Running Growth Coach...");

        // Run Growth Coach based on specialized analysis
        const { object: growthCoachReport } = await runGrowthCoach(
            techResult.object,
            behavioralResult.object,
            cultureResult.object,
            interview.language,
        );

        console.log("Growth Coach completed. Running Orchestrator...");

        // Orchestrate final feedback
        const { object: orchestratedFeedback } = await runOrchestrator(
            interview.role,
            techResult.object,
            behavioralResult.object,
            cultureResult.object,
            growthCoachReport,
            interview.language,
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
            categoryScores: (feedback.categoryScores as any) || [],
            learningPath: (feedback.learningPath as any) || [],
            emotionalAnalysis: (feedback.emotionalAnalysis as any) || [],
            createdAt: feedback.createdAt.toISOString(),
        } as unknown as Feedback;
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
            categoryScores: (feedback.categoryScores as any) || [],
            learningPath: (feedback.learningPath as any) || [],
            emotionalAnalysis: (feedback.emotionalAnalysis as any) || [],
            createdAt: feedback.createdAt.toISOString(),
            interview: {
                ...feedback.interview,
                createdAt: feedback.interview.createdAt.toISOString(),
            },
        })) as any[];
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

export async function getRoleBenchmark(role: string, userId: string) {
    try {
        // Get all feedbacks for this role (across all users)
        const roleFeedbacks = await prisma.feedback.findMany({
            where: {
                interview: { role: { equals: role, mode: "insensitive" } },
            },
            select: { totalScore: true, userId: true },
        });

        if (roleFeedbacks.length === 0) {
            return {
                roleAvg: 0,
                userAvg: 0,
                percentile: 50,
                totalInterviews: 0,
            };
        }

        // Role-wide average
        const roleAvg = Math.round(
            roleFeedbacks.reduce((acc, f) => acc + f.totalScore, 0) /
                roleFeedbacks.length,
        );

        // User's average for this role
        const userRoleFeedbacks = roleFeedbacks.filter(
            (f) => f.userId === userId,
        );
        const userAvg =
            userRoleFeedbacks.length > 0
                ? Math.round(
                      userRoleFeedbacks.reduce(
                          (acc, f) => acc + f.totalScore,
                          0,
                      ) / userRoleFeedbacks.length,
                  )
                : 0;

        // Percentile: how many unique users' averages are below this user's average
        const userAvgMap: Record<string, number[]> = {};
        roleFeedbacks.forEach((f) => {
            if (!userAvgMap[f.userId]) userAvgMap[f.userId] = [];
            userAvgMap[f.userId].push(f.totalScore);
        });

        const userAverages = Object.entries(userAvgMap).map(
            ([uid, scores]) => ({
                userId: uid,
                avg: scores.reduce((a, b) => a + b, 0) / scores.length,
            }),
        );

        const usersBelow = userAverages.filter(
            (u) => u.userId !== userId && u.avg < userAvg,
        ).length;
        const totalUsers = userAverages.length;
        const percentile =
            totalUsers <= 1
                ? 50
                : Math.max(
                      1,
                      Math.round(
                          ((totalUsers - usersBelow) / totalUsers) * 100,
                      ),
                  );

        return {
            roleAvg,
            userAvg,
            percentile,
            totalInterviews: roleFeedbacks.length,
        };
    } catch (error) {
        console.error("Error getting role benchmark:", error);
        return { roleAvg: 0, userAvg: 0, percentile: 50, totalInterviews: 0 };
    }
}

/* ── Community Question Bank ── */

export async function submitCommunityQuestion(data: {
    question: string;
    company: string;
    role: string;
    tags: string[];
    userId: string;
}) {
    try {
        const question = await prisma.communityQuestion.create({
            data: {
                question: data.question,
                company: data.company,
                role: data.role,
                tags: data.tags,
                userId: data.userId,
            },
        });
        return { success: true, question };
    } catch (error) {
        console.error("Error submitting community question:", error);
        return { success: false };
    }
}

export async function getCommunityQuestions(filters?: {
    sortBy?: "newest" | "popular";
    company?: string;
    role?: string;
    page?: number;
    userId?: string;
}) {
    try {
        const page = filters?.page || 1;
        const perPage = 20;
        const skip = (page - 1) * perPage;

        const where: any = {};
        if (filters?.company)
            where.company = {
                equals: filters.company,
                mode: "insensitive",
            };
        if (filters?.role)
            where.role = { equals: filters.role, mode: "insensitive" };

        const orderBy =
            filters?.sortBy === "popular"
                ? { upvotes: "desc" as const }
                : { createdAt: "desc" as const };

        const [questions, total] = await Promise.all([
            prisma.communityQuestion.findMany({
                where,
                orderBy,
                skip,
                take: perPage,
                include: {
                    user: { select: { name: true, image: true } },
                    votes: filters?.userId
                        ? {
                              where: { userId: filters.userId },
                              select: { id: true },
                          }
                        : false,
                },
            }),
            prisma.communityQuestion.count({ where }),
        ]);

        return {
            questions: questions.map((q) => ({
                ...q,
                hasVoted: Array.isArray(q.votes) && q.votes.length > 0,
                votes: undefined,
            })),
            total,
            totalPages: Math.ceil(total / perPage),
        };
    } catch (error) {
        console.error("Error getting community questions:", error);
        return { questions: [], total: 0, totalPages: 0 };
    }
}

export async function toggleUpvote(questionId: string, userId: string) {
    try {
        const existingVote = await prisma.communityVote.findUnique({
            where: {
                questionId_userId: { questionId, userId },
            },
        });

        if (existingVote) {
            // Remove vote
            await prisma.$transaction([
                prisma.communityVote.delete({
                    where: { id: existingVote.id },
                }),
                prisma.communityQuestion.update({
                    where: { id: questionId },
                    data: { upvotes: { decrement: 1 } },
                }),
            ]);
            return { success: true, action: "removed" };
        } else {
            // Add vote
            await prisma.$transaction([
                prisma.communityVote.create({
                    data: { questionId, userId },
                }),
                prisma.communityQuestion.update({
                    where: { id: questionId },
                    data: { upvotes: { increment: 1 } },
                }),
            ]);
            return { success: true, action: "added" };
        }
    } catch (error) {
        console.error("Error toggling upvote:", error);
        return { success: false, action: "error" };
    }
}
