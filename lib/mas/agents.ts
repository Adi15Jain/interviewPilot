import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import {
    technicalSpecialistSchema,
    behavioralAnalystSchema,
    cultureExpertSchema,
    growthCoachSchema,
    summarizedFeedbackSchema,
} from "./schemas";

export async function runTechnicalSpecialist(transcript: string, role: string) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: technicalSpecialistSchema,
        prompt: `Analyze the technical aspects of this interview transcript for the role of ${role}. Focus on accuracy, depth, and efficiency of the answers.
        
        Transcript:
        ${transcript}`,
    });
}

export async function runBehavioralAnalyst(
    transcript: string,
    emotionalData: any,
) {
    const emotionalContext = JSON.stringify(emotionalData);
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: behavioralAnalystSchema,
        prompt: `Analyze the behavioral patterns and emotional data from this interview. Focus on confidence, communication structure, and eye contact.
        
        Emotional Data:
        ${emotionalContext}
        
        Transcript:
        ${transcript}`,
    });
}

export async function runCultureExpert(transcript: string, role: string) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: cultureExpertSchema,
        prompt: `Evaluate if the candidate is a good culture and role fit for a ${role} position based on their answers and attitude.
        
        Transcript:
        ${transcript}`,
    });
}

export async function runGrowthCoach(
    techAnalysis: any,
    behavioralAnalysis: any,
    cultureAnalysis: any,
) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: growthCoachSchema,
        prompt: `Based on the following analysis reports, generate a personalized learning path and roadmap for the candidate.
        
        Technical Analysis: ${JSON.stringify(techAnalysis)}
        Behavioral Analysis: ${JSON.stringify(behavioralAnalysis)}
        Culture Analysis: ${JSON.stringify(cultureAnalysis)}`,
    });
}

export async function runOrchestrator(
    role: string,
    techAnalysis: any,
    behavioralAnalysis: any,
    cultureAnalysis: any,
    growthCoachReport: any,
) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: summarizedFeedbackSchema,
        prompt: `Synthesize a final, high-level feedback report from the specialized agent analyses. Ensure the feedback is professional, strict but fair, and provides a clear "astronomical" level of insight.
        
        Role: ${role}
        Technical Specialist: ${JSON.stringify(techAnalysis)}
        Behavioral Analyst: ${JSON.stringify(behavioralAnalysis)}
        Culture Expert: ${JSON.stringify(cultureAnalysis)}
        Growth Coach: ${JSON.stringify(growthCoachReport)}`,
    });
}
