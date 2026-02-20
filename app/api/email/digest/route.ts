import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generates a styled HTML email for the weekly digest
function generateDigestHTML(data: {
    name: string;
    totalInterviews: number;
    avgScore: number;
    bestScore: number;
    percentile: number;
    recentCount: number;
}) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
    </head>
    <body style="margin:0;padding:0;background-color:#08090D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#08090D;padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#0d0f17;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;">
                        <!-- Header -->
                        <tr>
                            <td style="padding:40px 40px 30px;background:linear-gradient(135deg,rgba(202,197,254,0.1),transparent);">
                                <h1 style="margin:0;color:#cac5fe;font-size:24px;font-weight:900;letter-spacing:-0.5px;">
                                    InterviewPilot
                                </h1>
                                <p style="margin:8px 0 0;color:#6870a6;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:3px;">
                                    Weekly Performance Digest
                                </p>
                            </td>
                        </tr>

                        <!-- Greeting -->
                        <tr>
                            <td style="padding:0 40px 30px;">
                                <h2 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">
                                    Hey ${data.name.split(" ")[0]} 👋
                                </h2>
                                <p style="margin:10px 0 0;color:#6870a6;font-size:14px;line-height:1.6;">
                                    Here's your weekly performance snapshot.
                                </p>
                            </td>
                        </tr>

                        <!-- Stats Grid -->
                        <tr>
                            <td style="padding:0 40px 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:16px;text-align:center;width:33%;">
                                            <p style="margin:0;color:#cac5fe;font-size:28px;font-weight:900;">${data.totalInterviews}</p>
                                            <p style="margin:6px 0 0;color:#6870a6;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Total Sessions</p>
                                        </td>
                                        <td width="12"></td>
                                        <td style="padding:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:16px;text-align:center;width:33%;">
                                            <p style="margin:0;color:#4ade80;font-size:28px;font-weight:900;">${data.avgScore}%</p>
                                            <p style="margin:6px 0 0;color:#6870a6;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Avg Score</p>
                                        </td>
                                        <td width="12"></td>
                                        <td style="padding:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:16px;text-align:center;width:33%;">
                                            <p style="margin:0;color:#fbbf24;font-size:28px;font-weight:900;">${data.bestScore}%</p>
                                            <p style="margin:6px 0 0;color:#6870a6;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">Best Score</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Percentile Badge -->
                        <tr>
                            <td style="padding:0 40px 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(202,197,254,0.08),rgba(202,197,254,0.02));border:1px solid rgba(202,197,254,0.15);border-radius:16px;">
                                    <tr>
                                        <td style="padding:24px 28px;">
                                            <p style="margin:0;color:#cac5fe;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:3px;">Global Ranking</p>
                                            <p style="margin:8px 0 0;color:#ffffff;font-size:18px;font-weight:800;">
                                                You're in the <span style="color:#cac5fe;">top ${data.percentile}%</span> of all users
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        ${
                            data.recentCount > 0
                                ? `
                        <!-- Recent Activity -->
                        <tr>
                            <td style="padding:0 40px 30px;">
                                <p style="margin:0;color:#6870a6;font-size:12px;">
                                    📊 You completed <strong style="color:#ffffff;">${data.recentCount} interviews</strong> this week. Keep the momentum going!
                                </p>
                            </td>
                        </tr>`
                                : `
                        <!-- Nudge -->
                        <tr>
                            <td style="padding:0 40px 30px;">
                                <p style="margin:0;color:#6870a6;font-size:12px;">
                                    🎯 No interviews this week. <strong style="color:#ffffff;">Jump back in</strong> to keep growing!
                                </p>
                            </td>
                        </tr>`
                        }

                        <!-- CTA -->
                        <tr>
                            <td style="padding:0 40px 40px;" align="center">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://interviewpilot.vercel.app"}" 
                                   style="display:inline-block;padding:14px 32px;background:#cac5fe;color:#08090D;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:2px;text-decoration:none;border-radius:12px;">
                                    Launch Dashboard →
                                </a>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.05);">
                                <p style="margin:0;color:#4f557d;font-size:10px;text-align:center;">
                                    InterviewPilot — AI-Powered Interview Preparation
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}

export async function POST(request: Request) {
    try {
        // Auth: Verify cron secret for security
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        // Get all users who have at least one feedback
        const users = await prisma.user.findMany({
            where: {
                feedback: { some: {} },
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        let sent = 0;

        for (const user of users) {
            // Get user stats
            const feedbacks = await prisma.feedback.findMany({
                where: { userId: user.id },
                select: { totalScore: true, createdAt: true },
            });

            const recentFeedbacks = feedbacks.filter(
                (f) => f.createdAt >= oneWeekAgo,
            );
            const totalInterviews = feedbacks.length;
            const avgScore = Math.round(
                feedbacks.reduce((a, f) => a + f.totalScore, 0) /
                    totalInterviews,
            );
            const bestScore = Math.max(...feedbacks.map((f) => f.totalScore));

            // Percentile calculation
            const allAvgs = await prisma.feedback.groupBy({
                by: ["userId"],
                _avg: { totalScore: true },
            });
            const otherAvgs = allAvgs
                .filter((a) => a.userId !== user.id)
                .map((a) => a._avg.totalScore || 0);
            const usersBelow = otherAvgs.filter((a) => a < avgScore).length;
            const percentile =
                otherAvgs.length === 0
                    ? 50
                    : Math.max(
                          1,
                          Math.round(
                              ((otherAvgs.length + 1 - usersBelow) /
                                  (otherAvgs.length + 1)) *
                                  100,
                          ),
                      );

            const html = generateDigestHTML({
                name: user.name,
                totalInterviews,
                avgScore,
                bestScore,
                percentile,
                recentCount: recentFeedbacks.length,
            });

            await resend.emails.send({
                from: "InterviewPilot <digest@interviewpilot.dev>",
                to: user.email,
                subject: `📊 Your Weekly Performance Digest — InterviewPilot`,
                html,
            });

            sent++;
        }

        return NextResponse.json({
            success: true,
            emailsSent: sent,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error sending digest:", error);
        return NextResponse.json(
            { error: "Failed to send digest" },
            { status: 500 },
        );
    }
}
