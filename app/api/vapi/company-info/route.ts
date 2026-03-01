import { NextResponse } from "next/server";

// Knowledge base for InterviewPilot company info
// This is called by VAPI as a server-side tool when the AI interviewer
// needs to answer candidate questions about the platform.
const KNOWLEDGE_BASE: Record<string, string> = {
    about: "InterviewPilot is an AI-powered interview preparation and assessment platform. It was built to bridge the gap between traditional mock interviews and real-world hiring processes. The platform uses advanced AI to simulate realistic interview experiences across multiple industries, providing candidates with actionable feedback to improve their performance. It was established with the vision of making professional interview coaching accessible to everyone, regardless of their background or location.",

    trust: "InterviewPilot's evaluation system is built on industry-standard assessment frameworks used by leading companies. The AI analyzes multiple dimensions of your performance including technical accuracy, communication clarity, problem-solving approach, and behavioral signals. The scoring rubric is calibrated against real hiring benchmarks. The platform provides detailed breakdowns of each category so you can see exactly where you excelled and where you can improve. We continuously refine our models based on user feedback and hiring outcome data.",

    team: "InterviewPilot is developed by a dedicated product engineering team passionate about transforming how people prepare for interviews. The team comprises experienced engineers and AI researchers who specialize in natural language processing, conversational AI, and assessment design. As a product-focused company, we are constantly iterating and improving the platform based on user needs.",

    general:
        "InterviewPilot is a professional AI-powered interview platform that helps candidates prepare with realistic mock interviews and detailed performance feedback. We cover multiple domains including software engineering, medical, finance, legal, business, education, creative, and public service roles. Our platform supports multiple languages and provides comprehensive feedback including technical scores, behavioral analysis, and personalized improvement paths.",
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // VAPI sends the tool call payload in the `message` field
        const message = body.message;

        // Extract the function call arguments
        let topic = "general";
        if (message?.toolCallList?.[0]?.function?.arguments) {
            try {
                const args =
                    typeof message.toolCallList[0].function.arguments ===
                    "string"
                        ? JSON.parse(message.toolCallList[0].function.arguments)
                        : message.toolCallList[0].function.arguments;
                topic = args.topic || "general";
            } catch {
                topic = "general";
            }
        } else if (message?.functionCall?.parameters) {
            topic = message.functionCall.parameters.topic || "general";
        }

        const answer = KNOWLEDGE_BASE[topic] || KNOWLEDGE_BASE.general;

        // VAPI expects a specific response format for tool call results
        return NextResponse.json({
            results: [
                {
                    toolCallId:
                        message?.toolCallList?.[0]?.id ||
                        message?.functionCall?.id ||
                        "unknown",
                    result: answer,
                },
            ],
        });
    } catch (error) {
        console.error("Error in company-info route:", error);
        return NextResponse.json(
            {
                results: [
                    {
                        toolCallId: "unknown",
                        result: "InterviewPilot is an AI-powered interview preparation platform. For more details, please visit our website.",
                    },
                ],
            },
            { status: 200 }, // Return 200 even on error so VAPI can continue
        );
    }
}

export async function GET() {
    return NextResponse.json({
        success: true,
        data: "Company info API is working",
    });
}
