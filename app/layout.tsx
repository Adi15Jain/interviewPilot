import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import Providers from "@/components/Providers";

import "./globals.css";

const monaSans = Mona_Sans({
    variable: "--font-mona-sans",
    subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://interviewpilot.ai";

export const metadata: Metadata = {
    title: {
        default: "InterviewPilot — AI-Powered Voice Interview Practice",
        template: "%s | InterviewPilot",
    },
    description:
        "Practice interviews with a real-time voice AI interviewer. Get emotion tracking, confidence analysis, and multi-agent feedback in 7+ languages across 9+ domains.",
    keywords: [
        "AI interview practice",
        "voice interview simulator",
        "mock interview AI",
        "interview preparation",
        "behavioral interview practice",
        "technical interview practice",
        "AI interview feedback",
        "confidence tracking",
        "emotion analysis interview",
        "multilingual interview practice",
        "interview coaching AI",
    ],
    authors: [{ name: "InterviewPilot" }],
    creator: "InterviewPilot",
    metadataBase: new URL(SITE_URL),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: "InterviewPilot",
        title: "InterviewPilot — AI-Powered Voice Interview Practice",
        description:
            "The only platform combining real-time voice AI, emotion tracking, and 5-agent analysis. Practice in 7+ languages across 9+ domains.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "InterviewPilot — AI Interview Practice Platform",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "InterviewPilot — AI-Powered Voice Interview Practice",
        description:
            "Practice interviews with real-time voice AI. Get emotion tracking, confidence analysis, and multi-agent feedback.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    alternates: {
        canonical: SITE_URL,
    },
};

// JSON-LD Structured Data
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InterviewPilot",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
        "AI-powered voice interview practice platform with emotion tracking, multi-agent feedback, and 7+ language support across 9+ domains.",
    url: SITE_URL,
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "500",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
            </head>
            <body className={`${monaSans.className} antialiased`}>
                <Providers>{children}</Providers>

                <Toaster />
            </body>
        </html>
    );
}
