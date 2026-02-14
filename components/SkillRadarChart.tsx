"use client";

import { useState, useEffect } from "react";
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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 150);
        return () => clearTimeout(timer);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[320px] flex items-center justify-center bg-white/[0.02] rounded-3xl animate-pulse">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-20 text-light-600">
                    Calibrating Profile...
                </span>
            </div>
        );
    }

    const hasData = data && data.length > 0;

    return (
        <div className="w-full h-[320px] flex flex-col justify-between min-h-0 relative">
            <h4 className="text-[10px] font-black text-light-600 uppercase tracking-[0.4em] mb-2 opacity-50 text-center">
                Skill Topology
            </h4>

            {!hasData ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 opacity-20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#CAC5FE]">
                        Incomplete Metrics
                    </span>
                    <p className="text-[8px] font-bold uppercase tracking-widest">
                        Awaiting Categorical Data
                    </p>
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="80%"
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                bottom: 10,
                                left: 30,
                            }}
                        >
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis
                                dataKey="name"
                                tick={{
                                    fill: "#D6E0FF",
                                    fontSize: 10,
                                    fontWeight: 800,
                                }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{
                                    fill: "#6870A6",
                                    fontSize: 9,
                                    fontWeight: 800,
                                }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Radar
                                name="Competency"
                                dataKey="score"
                                stroke="#CAC5FE"
                                strokeWidth={2}
                                fill="#CAC5FE"
                                fillOpacity={0.4}
                                isAnimationActive={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020408",
                                    borderColor: "rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                }}
                                itemStyle={{
                                    color: "#CAC5FE",
                                    fontWeight: "bold",
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default SkillRadarChart;
