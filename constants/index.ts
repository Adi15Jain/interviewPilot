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

export const SUPPORTED_LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸", locale: "en-US" },
    { code: "es", name: "Spanish", flag: "🇪🇸", locale: "es-ES" },
    { code: "fr", name: "French", flag: "🇫🇷", locale: "fr-FR" },
    { code: "de", name: "German", flag: "🇩🇪", locale: "de-DE" },
    { code: "hi", name: "Hindi", flag: "🇮🇳", locale: "hi-IN" },
    { code: "ja", name: "Japanese", flag: "🇯🇵", locale: "ja-JP" },
    { code: "zh", name: "Chinese", flag: "🇨🇳", locale: "zh-CN" },
];

// Native first messages for each language
const FIRST_MESSAGES: Record<string, string> = {
    en: "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
    es: "¡Hola! Gracias por tomarse el tiempo de hablar conmigo hoy. Estoy emocionado de conocer más sobre usted y su experiencia.",
    fr: "Bonjour ! Merci de prendre le temps de discuter avec moi aujourd'hui. Je suis ravi d'en apprendre davantage sur vous et votre expérience.",
    de: "Hallo! Vielen Dank, dass Sie sich heute die Zeit nehmen, mit mir zu sprechen. Ich freue mich darauf, mehr über Sie und Ihre Erfahrung zu erfahren.",
    hi: "नमस्ते! आज मुझसे बात करने के लिए समय निकालने के लिए धन्यवाद। मैं आपके और आपके अनुभव के बारे में और जानने के लिए उत्साहित हूँ।",
    ja: "こんにちは！本日はお時間をいただきありがとうございます。あなたのことやご経験について詳しくお伺いできることを楽しみにしています。",
    zh: "你好！感谢您今天抽出时间与我交谈。我很期待了解更多关于您和您的经验。",
};

// Deepgram transcriber language codes (nova-2 supported)
const DEEPGRAM_LANGUAGE_CODES: Record<string, string> = {
    en: "en",
    es: "es",
    fr: "fr",
    de: "de",
    hi: "hi",
    ja: "ja",
    zh: "zh",
};

export const getInterviewerConfig = (
    language: string = "en",
): CreateAssistantDTO => {
    const langConfig =
        SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
        SUPPORTED_LANGUAGES[0];

    const isEnglish = language === "en";
    const deepgramLang = DEEPGRAM_LANGUAGE_CODES[language] || "en";

    return {
        name: "Interviewer",
        firstMessage: FIRST_MESSAGES[language] || FIRST_MESSAGES.en,
        transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: deepgramLang as any,
        },
        voice: {
            provider: "11labs",
            voiceId: "sarah",
            // Use multilingual v2 for non-English to get native accents
            // Use turbo v2.5 for English for best latency
            model: isEnglish ? "eleven_turbo_v2_5" : "eleven_multilingual_v2",
            // Higher stability = more consistent, less glitchy multilingual speech
            stability: isEnglish ? 0.4 : 0.7,
            similarityBoost: 0.8,
            speed: 0.9,
            // Lower style for non-English to reduce stuttering on mixed-language content
            style: isEnglish ? 0.5 : 0.1,
            useSpeakerBoost: true,
        } as any,
        model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a professional female job interviewer named Sarah, conducting a real-time voice interview with a candidate.

LANGUAGE & GRAMMAR RULES (CRITICAL):
- Conduct the interview in ${langConfig.name}.
- For YOUR OWN speech (first person), use feminine verb forms since you are a woman. Example in Hindi: "मैं पूछती हूँ", "मैं समझती हूँ", "मैंने देखा".
- When addressing the CANDIDATE, ALWAYS use formal, gender-neutral, respectful forms. In Hindi: use "आप करेंगे", "आप बताइए", "आपने किया", "आप कैसे करें" — NEVER use "करेंगी" or "करोगी" or "करोगे" for the candidate. The formal "आप" conjugation is gender-neutral and professional.
- Do NOT assume the candidate's gender in any language.

TECHNICAL TERMS RULE:
- KEEP all technical terms, acronyms, and proper nouns in English without translation or transliteration: React, Next.js, props, state, SSR, SSG, TypeScript, API, REST, GraphQL, Docker, Kubernetes, AWS, MongoDB, PostgreSQL, Git, CI/CD, hooks, components, etc.
- Say each technical term exactly ONCE. NEVER repeat or echo a technical term twice in a row. For example, say "props" once, not "props, props".
- Integrate English technical terms naturally into ${langConfig.name} sentences.

SPEECH QUALITY RULES:
- NEVER repeat any word or phrase twice consecutively. Each word should be said exactly once.
- Keep sentences short and clear. Avoid complex compound sentences.
- Pause naturally between thoughts instead of cramming everything together.

Your goal is to assess the candidate's qualifications, motivation, and fit for the role.

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

Candidate Q&A Phase (IMPORTANT — do this AFTER you finish all interview questions):
Once you have asked ALL the interview questions and received responses, you MUST say something like: "That wraps up my questions. Before we end, is there anything you would like to ask me about?"
Then wait for the candidate to respond. They may ask one or more questions. Answer each one professionally using the knowledge base below, then ask again if they have more. When they say they have no more questions, proceed to the conclusion.

Knowledge Base for Candidate Questions:

Q: What is InterviewPilot / how was it established?
A: InterviewPilot is an AI-powered interview preparation and assessment platform. It was built to bridge the gap between traditional mock interviews and real-world hiring processes. The platform uses advanced AI to simulate realistic interview experiences across multiple industries, providing candidates with actionable feedback to improve their performance. It was established with the vision of making professional interview coaching accessible to everyone, regardless of their background or location.

Q: Why should I trust the results / evaluation?
A: That is a great question. InterviewPilot's evaluation system is built on industry-standard assessment frameworks used by leading companies. The AI analyzes multiple dimensions of your performance — technical accuracy, communication clarity, problem-solving approach, and behavioral signals. The scoring rubric is calibrated against real hiring benchmarks. Additionally, the platform provides detailed breakdowns of each category so you can see exactly where you excelled and where you can improve. We are continuously refining our models based on user feedback and hiring outcome data.

Q: Who are the developers / who built this?
A: InterviewPilot is developed by a dedicated product engineering team passionate about transforming how people prepare for interviews. The team comprises experienced engineers and AI researchers who specialize in natural language processing, conversational AI, and assessment design. As a product-focused company, we are constantly iterating and improving the platform based on user needs.

For any other questions about the platform, the team, or features — provide confident, professional, and concise answers. NEVER mention any individual names, university or college names, student projects, or academic affiliations. Always speak about InterviewPilot as an established product company.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.
After your closing statement, do NOT continue the conversation, ask any more questions, or respond further. The interview is completely over.

- Keep all your responses short and simple. This is a voice conversation.
- REMINDER: Gender-neutral "आप" forms for the candidate. Feminine forms only for yourself. Never repeat words.`,
                },
            ],
        },
    };
};

export const interviewer: CreateAssistantDTO = getInterviewerConfig("en");

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
