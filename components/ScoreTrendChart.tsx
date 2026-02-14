"use client";

import { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { TrendingUp } from "lucide-react";

interface ScoreTrendChartProps {
    data: Array<{
        date: string | Date;
        score: number;
    }>;
}

const ScoreTrendChart = ({ data }: ScoreTrendChartProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Delay mounting to ensure parent dimensions are ready even with complex CSS
        const timer = setTimeout(() => setIsMounted(true), 150);
        return () => clearTimeout(timer);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-[320px] flex flex-col relative animate-pulse">
                <div className="h-4 w-32 bg-white/5 rounded mb-8" />
                <div className="flex-1 w-full bg-white/[0.02] rounded-2xl" />
            </div>
        );
    }

    // Sort and sanitize data
    const sortedData = [...(data || [])]
        .map((item) => ({
            date: dayjs(item.date).format("MMM D"),
            score: Number(item.score) || 0,
            timestamp: dayjs(item.date).valueOf(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    const hasData = sortedData.length > 0;

    return (
        <div className="w-full h-[320px] flex flex-col relative group/chart">
            <h4 className="text-xs font-black text-light-600 uppercase tracking-[0.3em] mb-8 relative z-10 transition-colors group-hover/chart:text-primary-200">
                Performance Trajectory
            </h4>

            {!hasData ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center opacity-40">
                    <TrendingUp className="size-6 text-light-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-light-600">
                        Awaiting initial simulation results
                    </p>
                </div>
            ) : (
                <div className="relative w-full flex-1 min-h-[220px] rounded-xl bg-white/[0.01] border border-white/[0.03]">
                    <ResponsiveContainer width="99%" height="100%">
                        <AreaChart
                            data={sortedData}
                            margin={{
                                top: 20,
                                right: 30,
                                left: -20,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="scoreColor"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#CAC5FE"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#CAC5FE"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(255,255,255,0.05)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#6870A6",
                                    fontSize: 10,
                                    fontWeight: "bold",
                                }}
                                padding={{ left: 20, right: 20 }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#6870A6",
                                    fontSize: 10,
                                    fontWeight: "bold",
                                }}
                                ticks={[0, 25, 50, 75, 100]}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020408",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                }}
                                itemStyle={{ color: "#CAC5FE" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#CAC5FE"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#scoreColor)"
                                isAnimationActive={false}
                                dot={{ r: 4, fill: "#CAC5FE" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default ScoreTrendChart;
