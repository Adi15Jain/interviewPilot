import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
    "react.js": "react",
    reactjs: "react",
    react: "react",
    "next.js": "nextjs",
    nextjs: "nextjs",
    next: "nextjs",
    "vue.js": "vuejs",
    vuejs: "vuejs",
    vue: "vuejs",
    "express.js": "express",
    expressjs: "express",
    express: "express",
    "node.js": "nodejs",
    nodejs: "nodejs",
    node: "nodejs",
    mongodb: "mongodb",
    mongo: "mongodb",
    mongoose: "mongoose",
    mysql: "mysql",
    postgresql: "postgresql",
    sqlite: "sqlite",
    firebase: "firebase",
    docker: "docker",
    kubernetes: "kubernetes",
    aws: "aws",
    azure: "azure",
    gcp: "gcp",
    digitalocean: "digitalocean",
    heroku: "heroku",
    photoshop: "photoshop",
    "adobe photoshop": "photoshop",
    html5: "html5",
    html: "html5",
    css3: "css3",
    css: "css3",
    sass: "sass",
    scss: "sass",
    less: "less",
    tailwindcss: "tailwindcss",
    tailwind: "tailwindcss",
    bootstrap: "bootstrap",
    jquery: "jquery",
    typescript: "typescript",
    ts: "typescript",
    javascript: "javascript",
    js: "javascript",
    "angular.js": "angular",
    angularjs: "angular",
    angular: "angular",
    "ember.js": "ember",
    emberjs: "ember",
    ember: "ember",
    "backbone.js": "backbone",
    backbonejs: "backbone",
    backbone: "backbone",
    nestjs: "nestjs",
    graphql: "graphql",
    "graph ql": "graphql",
    apollo: "apollo",
    webpack: "webpack",
    babel: "babel",
    "rollup.js": "rollup",
    rollupjs: "rollup",
    rollup: "rollup",
    "parcel.js": "parcel",
    parceljs: "parcel",
    npm: "npm",
    yarn: "yarn",
    git: "git",
    github: "github",
    gitlab: "gitlab",
    bitbucket: "bitbucket",
    figma: "figma",
    prisma: "prisma",
    redux: "redux",
    flux: "flux",
    redis: "redis",
    selenium: "selenium",
    cypress: "cypress",
    jest: "jest",
    mocha: "mocha",
    chai: "chai",
    karma: "karma",
    vuex: "vuex",
    "nuxt.js": "nuxt",
    nuxtjs: "nuxt",
    nuxt: "nuxt",
    strapi: "strapi",
    wordpress: "wordpress",
    contentful: "contentful",
    netlify: "netlify",
    vercel: "vercel",
    "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
    name: "Interviewer",
    firstMessage:
        "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
    transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",
    },
    voice: {
        provider: "11labs",
        voiceId: "sarah",
        stability: 0.4,
        similarityBoost: 0.8,
        speed: 0.9,
        style: 0.5,
        useSpeakerBoost: true,
    },
    model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
            },
        ],
    },
};

export const feedbackSchema = z.object({
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
});

export interface InterviewDomain {
    id: string;
    name: string;
    icon: string;
    description: string;
    popularRoles: string[];
    techStacks: string[];
}

export const INTERVIEW_DOMAINS: InterviewDomain[] = [
    {
        id: "software",
        name: "Software & Technology",
        icon: "Code",
        description: "Frontend, Backend, DevOps, Data Science, and more.",
        popularRoles: [
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "DevOps Engineer",
            "Data Scientist",
            "Mobile Developer (iOS/Android)",
            "AI/ML Engineer",
            "Cybersecurity Analyst",
        ],
        techStacks: [
            "React, Next.js, TypeScript",
            "Node.js, Express, MongoDB",
            "Python, Django, PostgreSQL",
            "Java, Spring Boot, AWS",
            "Go, Kubernetes, Docker",
            "Swift, SwiftUI, Firebase",
            "Rust, WebAssembly",
        ],
    },
    {
        id: "medical",
        name: "Medical & Healthcare",
        icon: "Stethoscope",
        description: "Nursing, General Practice, Specialized Medicine, etc.",
        popularRoles: [
            "Registered Nurse",
            "General Practitioner",
            "Medical Resident",
            "Pharmacist",
            "Radiologist",
            "Surgical Assistant",
            "Health Administrator",
        ],
        techStacks: [
            "Clinical Protocols, Patient Care",
            "EHR Systems, Medical Diagnosis",
            "Pharmacology, Patient Safety",
            "Medical Ethics, Emergency Response",
        ],
    },
    {
        id: "finance",
        name: "Finance & Accounting",
        icon: "TrendingUp",
        description: "Banking, Investment, Audit, and Financial Planning.",
        popularRoles: [
            "Financial Analyst",
            "Investment Banker",
            "Auditor",
            "Accountant",
            "Tax Consultant",
            "Risk Manager",
            "Portfolio Manager",
        ],
        techStacks: [
            "Financial Modeling, Excel",
            "Market Analysis, Bloomberg Terminal",
            "Tax Law, Audit Standards",
            "Risk Assessment, Quantitative Analysis",
        ],
    },
    {
        id: "legal",
        name: "Legal & Corporate Law",
        icon: "Scale",
        description: "Litigation, Corporate, Intellectual Property, etc.",
        popularRoles: [
            "Corporate Lawyer",
            "Litigator",
            "Legal Assistant",
            "Paralegal",
            "Compliance Officer",
            "Patent Attorney",
        ],
        techStacks: [
            "Case Law, Legal Research",
            "Corporate Governance, Compliance",
            "Contract Law, Intellectual Property",
            "Jurisprudence, Legal Writing",
        ],
    },
    {
        id: "business",
        name: "Business & Marketing",
        icon: "Briefcase",
        description: "Product, Sales, HR, and Digital Marketing.",
        popularRoles: [
            "Product Manager",
            "Marketing Specialist",
            "Sales Executive",
            "HR Manager",
            "Business Analyst",
            "SEO Specialist",
        ],
        techStacks: [
            "Product Strategy, Agile",
            "Digital Marketing, SEO, SEM",
            "B2B Sales, CRM (Salesforce)",
            "Talent Acquisition, Employee Relations",
        ],
    },
    {
        id: "education",
        name: "Education & Teaching",
        icon: "GraduationCap",
        description: "Primary, Secondary, Higher Ed, and corporate training.",
        popularRoles: [
            "University Professor",
            "High School Teacher",
            "Instructional Designer",
            "School Administrator",
            "Tutor",
            "Educational Consultant",
        ],
        techStacks: [
            "Curriculum Design, Pedagogy",
            "LMS (Canvas, Blackboard)",
            "Student Engagement, Classroom Management",
            "Academic Research, E-learning",
        ],
    },
    {
        id: "creative",
        name: "Creative & Design",
        icon: "Palette",
        description: "UI/UX, Graphic Design, Video, and Animation.",
        popularRoles: [
            "UI/UX Designer",
            "Graphic Designer",
            "Art Director",
            "Motion Designer",
            "Video Editor",
            "Product Designer",
        ],
        techStacks: [
            "Figma, Adobe Creative Suite",
            "Design Systems, Prototyping",
            "Typography, Color Theory",
            "Video Production, Storyboarding",
        ],
    },
    {
        id: "government",
        name: "Public Service",
        icon: "Gavel",
        description:
            "Administration, Policy, Social Work, and Law Enforcement.",
        popularRoles: [
            "Policy Analyst",
            "Public Administrator",
            "Social Worker",
            "Firefighter",
            "Police Officer",
            "Human Rights Advocate",
        ],
        techStacks: [
            "Public Policy, Legislation",
            "Case Management, Crisis Intervention",
            "Community Outreach, Logistics",
            "Administrative Law, Ethics",
        ],
    },
];

export const interviewCovers = [
    "/adobe.png",
    "/amazon.png",
    "/facebook.png",
    "/hostinger.png",
    "/pinterest.png",
    "/quora.png",
    "/reddit.png",
    "/skype.png",
    "/spotify.png",
    "/telegram.png",
    "/tiktok.png",
    "/yahoo.png",
];
