"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { TrendingUp } from "lucide-react";

interface ScoreTrendChartProps {
    data: Array<{
        date: string | Date;
        score: number;
    }>;
}

const ScoreTrendChart = ({ data }: ScoreTrendChartProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // 1. Process and sort data
    const chartData = useMemo(() => {
        return [...(data || [])]
            .map((item) => ({
                label: dayjs(item.date).format("MMM D"),
                fullDate: dayjs(item.date).format("MMMM D, YYYY"),
                score: Math.min(100, Math.max(0, Number(item.score) || 0)),
                timestamp: dayjs(item.date).valueOf(),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [data]);

    const hasData = chartData.length > 1; // Need at least 2 points for a trend

    // 2. SVG Dimensions & Mapping logic
    const width = 1000;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = useMemo(() => {
        if (chartData.length === 0) return [];
        return chartData.map((d, i) => {
            const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
            const y = padding.top + chartHeight - (d.score / 100) * chartHeight;
            return {
                x,
                y,
                score: d.score,
                label: d.label,
                fullDate: d.fullDate,
            };
        });
    }, [chartData, chartWidth, chartHeight, padding]);

    // 3. Generate Smooth Curve Path (Cubic Bezier)
    const linePath = useMemo(() => {
        if (points.length < 2) return "";
        let path = `M ${points[0].x},${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            // Control points for smoothness
            const cp1x = curr.x + (next.x - curr.x) / 3;
            const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
            path += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
        }
        return path;
    }, [points]);

    const areaPath = useMemo(() => {
        if (points.length < 2) return "";
        const baseLine = padding.top + chartHeight;
        return `${linePath} V ${baseLine} H ${points[0].x} Z`;
    }, [linePath, points, padding, chartHeight]);

    // 4. Grid lines
    const yTicks = [25, 50, 75, 100];

    return (
        <div className="w-full flex flex-col relative group/chart min-h-[350px]">
            <h4 className="text-sm font-black text-light-600 uppercase tracking-[0.3em] mb-8 relative z-10 transition-colors group-hover/chart:text-primary-200">
                Performance Trajectory
            </h4>

            {!hasData ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center opacity-40">
                    <TrendingUp className="size-6 text-light-600" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-light-600">
                        {chartData.length === 1
                            ? "Keep practicing to see your trend"
                            : "Awaiting initial simulation results"}
                    </p>
                </div>
            ) : (
                <div className="relative w-full aspect-[21/9] lg:aspect-[3/1] bg-white/[0.01] rounded-2xl border border-white/[0.03] overflow-visible">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-full overflow-visible"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient
                                id="areaGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#CAC5FE"
                                    stopOpacity="0.2"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#CAC5FE"
                                    stopOpacity="0"
                                />
                            </linearGradient>
                            <filter
                                id="glow"
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                            >
                                <feGaussianBlur
                                    stdDeviation="4"
                                    result="blur"
                                />
                                <feComposite
                                    in="SourceGraphic"
                                    in2="blur"
                                    operator="over"
                                />
                            </filter>
                        </defs>

                        {/* Y-Axis Grid Marks */}
                        {yTicks.map((tick) => (
                            <g
                                key={tick}
                                className="opacity-20 transition-opacity group-hover/chart:opacity-40"
                            >
                                <line
                                    x1={padding.left}
                                    y1={
                                        padding.top +
                                        chartHeight -
                                        (tick / 100) * chartHeight
                                    }
                                    x2={width - padding.right}
                                    y2={
                                        padding.top +
                                        chartHeight -
                                        (tick / 100) * chartHeight
                                    }
                                    stroke="#4F557D"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={padding.left - 25}
                                    y={
                                        padding.top +
                                        chartHeight -
                                        (tick / 100) * chartHeight +
                                        8
                                    }
                                    fill="#6870A6"
                                    fontSize="20"
                                    fontWeight="900"
                                    textAnchor="end"
                                >
                                    {tick}
                                </text>
                            </g>
                        ))}

                        {/* X-Axis Labels */}
                        {points.map(
                            (p, i) =>
                                (i === 0 ||
                                    i === points.length - 1 ||
                                    i === Math.floor(points.length / 2)) && (
                                    <text
                                        key={i}
                                        x={p.x}
                                        y={height - 20}
                                        fill="#6870A6"
                                        fontSize="20"
                                        fontWeight="900"
                                        textAnchor="middle"
                                        className="opacity-60"
                                    >
                                        {p.label}
                                    </text>
                                ),
                        )}

                        {/* Area Fill */}
                        <path
                            d={areaPath}
                            fill="url(#areaGradient)"
                            className="animate-in fade-in duration-1000"
                        />

                        {/* Main Line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="#CAC5FE"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#glow)"
                            className="animate-in fade-in slide-in-from-left duration-1000"
                        />

                        {/* Data Points & Interaction areas */}
                        {points.map((p, i) => (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Transparent wide hit area */}
                                <rect
                                    x={p.x - 20}
                                    y={padding.top}
                                    width={40}
                                    height={chartHeight}
                                    fill="transparent"
                                    className="cursor-pointer"
                                />

                                {/* Point Circle */}
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={hoveredIndex === i ? 8 : 4}
                                    fill={
                                        hoveredIndex === i ? "#FFF" : "#CAC5FE"
                                    }
                                    stroke="#020408"
                                    strokeWidth="2"
                                    className="transition-all duration-300"
                                />

                                {/* Vertical line on hover */}
                                {hoveredIndex === i && (
                                    <line
                                        x1={p.x}
                                        y1={padding.top}
                                        x2={p.x}
                                        y2={padding.top + chartHeight}
                                        stroke="#CAC5FE"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                        className="animate-in fade-in"
                                    />
                                )}
                            </g>
                        ))}
                    </svg>

                    {/* Tooltip (Overlaying the SVG) */}
                    {hoveredIndex !== null && points[hoveredIndex] && (
                        <div
                            className="absolute pointer-events-none z-50 bg-[#020408]/95 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
                            style={{
                                left: `${(points[hoveredIndex].x / width) * 100}%`,
                                top: `${(points[hoveredIndex].y / height) * 100}%`,
                                transform:
                                    hoveredIndex === 0
                                        ? "translate(0%, -120%)"
                                        : hoveredIndex === points.length - 1
                                          ? "translate(-100%, -120%)"
                                          : "translate(-50%, -120%)",
                            }}
                        >
                            <div className="flex flex-col gap-2 min-w-[180px]">
                                <span className="text-sm font-black uppercase tracking-widest text-light-600">
                                    {points[hoveredIndex].fullDate}
                                </span>
                                <div className="flex items-center justify-between gap-8">
                                    <span className="text-base font-bold text-white">
                                        Mastery Score
                                    </span>
                                    <span className="text-2xl font-black text-primary-200">
                                        {points[hoveredIndex].score}%
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`absolute -bottom-1.5 w-3 h-3 bg-[#020408] border-r border-b border-white/10 rotate-45 ${
                                    hoveredIndex === 0
                                        ? "left-6"
                                        : hoveredIndex === points.length - 1
                                          ? "right-6"
                                          : "left-1/2 -translate-x-1/2"
                                }`}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScoreTrendChart;
