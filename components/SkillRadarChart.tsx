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
        <div className="w-full h-auto min-h-[300px] flex flex-col items-center justify-center relative">
            <h4 className="text-[10px] font-black text-light-600 uppercase tracking-[0.4em] mb-4 absolute top-0 left-0 transition-colors group-hover:text-primary-200">
                Performance Vector
            </h4>
            <div className="w-full h-[280px] mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#4F557D" />
                        <PolarAngleAxis
                            dataKey="name"
                            tick={{
                                fill: "#D6E0FF",
                                fontSize: 10,
                                fontWeight: 900,
                            }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fill: "#6870A6", fontSize: 8 }}
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
        </div>
    );
};

export default SkillRadarChart;
