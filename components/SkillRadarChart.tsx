"use client";

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

interface SkillRadarChartProps {
    data: Array<{
        name: string;
        score: number;
    }>;
}

const SkillRadarChart = ({ data }: SkillRadarChartProps) => {
    return (
        <div className="w-full h-[300px] mt-8 bg-dark-300/30 rounded-3xl border border-light-800/50 p-6 flex flex-col items-center justify-center">
            <h4 className="text-lg font-semibold text-primary-100 mb-2">
                Performance Breakdown
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#4F557D" />
                    <PolarAngleAxis
                        dataKey="name"
                        tick={{
                            fill: "#D6E0FF",
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#6870A6", fontSize: 10 }}
                    />
                    <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#CAC5FE"
                        strokeWidth={2}
                        fill="#CAC5FE"
                        fillOpacity={0.6}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1A1C20",
                            borderColor: "#4F557D",
                            borderRadius: "12px",
                            color: "#FFF",
                        }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillRadarChart;
