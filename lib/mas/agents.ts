import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import {
    technicalSpecialistSchema,
    behavioralAnalystSchema,
    cultureExpertSchema,
    growthCoachSchema,
    summarizedFeedbackSchema,
} from "./schemas";

export async function runTechnicalSpecialist(
    transcript: string,
    role: string,
    language: string = "en",
) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: technicalSpecialistSchema,
        prompt: `Analyze the technical aspects of this interview transcript for the role of ${role}. Focus on accuracy, depth, and efficiency of the answers.
        
        IMPORTANT: Your entire analysis and output MUST be in ${language === "en" ? "English" : language}.
        
        Transcript:
        ${transcript}`,
    });
}

export async function runBehavioralAnalyst(
    transcript: string,
    emotionalData: any,
    language: string = "en",
) {
    const emotionalContext = JSON.stringify(emotionalData);
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: behavioralAnalystSchema,
        prompt: `Analyze the behavioral patterns and emotional data from this interview. Focus on confidence, communication structure, and eye contact.
        
        IMPORTANT: Your entire analysis and output MUST be in ${language === "en" ? "English" : language}.
        
        Emotional Data:
        ${emotionalContext}
        
        Transcript:
        ${transcript}`,
    });
}

export async function runCultureExpert(
    transcript: string,
    role: string,
    language: string = "en",
) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: cultureExpertSchema,
        prompt: `Evaluate if the candidate is a good culture and role fit for a ${role} position based on their answers and attitude.
        
        IMPORTANT: Your entire analysis and output MUST be in ${language === "en" ? "English" : language}.
        
        Transcript:
        ${transcript}`,
    });
}

export async function runGrowthCoach(
    techAnalysis: any,
    behavioralAnalysis: any,
    cultureAnalysis: any,
    language: string = "en",
) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: growthCoachSchema,
        prompt: `Based on the following analysis reports, generate a personalized learning path and roadmap for the candidate.
        
        IMPORTANT: Your entire analysis and output MUST be in ${language === "en" ? "English" : language}.
        
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
    language: string = "en",
) {
    return await generateObject({
        model: google("gemini-2.5-flash"),
        schema: summarizedFeedbackSchema,
        prompt: `Synthesize a final, high-level feedback report from the specialized agent analyses. Ensure the feedback is professional, strict but fair, and provides a clear "astronomical" level of insight.
        
        IMPORTANT: The entire synthesis, feedback, and final report MUST be in ${language === "en" ? "English" : language}.
        
        Role: ${role}
        Technical Specialist: ${JSON.stringify(techAnalysis)}
        Behavioral Analyst: ${JSON.stringify(behavioralAnalysis)}
        Culture Expert: ${JSON.stringify(cultureAnalysis)}
        Growth Coach: ${JSON.stringify(growthCoachReport)}`,
    });
}
