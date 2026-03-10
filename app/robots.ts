import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://interviewpilot.ai";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/leaderboard", "/community"],
                disallow: [
                    "/interview/",
                    "/feedback/",
                    "/history/",
                    "/profile/",
                    "/api/",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
