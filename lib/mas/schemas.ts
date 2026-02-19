import { z } from "zod";

// Base schema for shared properties
export const agentBaseSchema = z.object({
    observations: z.array(z.string()),
    score: z.number().min(0).max(100),
});

// Technical Specialist Schema
export const technicalSpecialistSchema = agentBaseSchema.extend({
    technicalGaps: z.array(z.string()),
    accuracyRating: z.number().min(0).max(100),
    efficiencyRating: z.number().min(0).max(100),
});

// Behavioral Analyst Schema
export const behavioralAnalystSchema = agentBaseSchema.extend({
    communicationPatterns: z.array(z.string()),
    confidenceAnalysis: z.string(),
    eyeContactRating: z.number().min(0).max(100),
    fillerWordUsage: z.string(), // "Low", "Moderate", "High"
});

// Culture & Role Expert Schema
export const cultureExpertSchema = agentBaseSchema.extend({
    valueAlignment: z.array(z.string()),
    roleSpecificSuitability: z.string(),
    companyFitScore: z.number().min(0).max(100),
});

// Growth Coach Schema
export const growthCoachSchema = z.object({
    personalizedLearningItems: z.array(
        z.object({
            topic: z.string(),
            resourceType: z.string(), // "Article", "Video", "Flashcard"
            reason: z.string(),
        }),
    ),
    shortTermGoals: z.array(z.string()),
    longTermRoadmap: z.array(z.string()),
});

// Orchestrator Schema (The final feedback structure)
export const summarizedFeedbackSchema = z.object({
    totalScore: z.number(),
    categoryScores: z.array(
        z.object({
            name: z.string(),
            score: z.number(),
            comment: z.string(),
        }),
    ),
    strengths: z.array(z.string()),
    areasForImprovement: z.array(z.string()),
    finalAssessment: z.string(),
    behavioralTips: z.array(z.string()),
    learningPath: z.array(
        z.object({
            topic: z.string(),
            resourceType: z.string(),
            reason: z.string(),
        }),
    ),
});
