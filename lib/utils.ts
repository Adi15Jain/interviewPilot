import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
    const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
    return mappings[key as keyof typeof mappings];
};

export const getTechLogos = (techArray: string[]) => {
    return techArray.map((tech) => {
        const normalized = normalizeTechName(tech);
        return {
            tech,
            url: normalized
                ? `${techIconBaseURL}/${normalized}/${normalized}-original.svg`
                : "/tech.svg",
        };
    });
};

export const getInterviewCover = (id: string, role: string = "") => {
    // 1. Try to detect company from role
    const normalizedRole = role.toLowerCase();
    const company = interviewCovers.find((c) =>
        normalizedRole.includes(c.split(".")[0].replace("/", "")),
    );

    if (company) return `/covers${company}`;

    // 2. Fallback to deterministic selection based on ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % interviewCovers.length;
    return `/covers${interviewCovers[index]}`;
};
