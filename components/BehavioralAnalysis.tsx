"use client";

import { useState, useMemo } from "react";
import { Brain, Eye, Zap, TrendingUp, TrendingDown } from "lucide-react";

interface BehavioralAnalysisProps {
    emotionalAnalysis: any[];
    behavioralTips: string[];
}

/**
 * Downsample raw frame data into N time-window buckets using averaging.
 * This smooths per-frame noise into clean, readable chart segments.
 */
function downsample(
    data: { confidence: number; eyeContact: number }[],
    maxPoints: number,
): { confidence: number; eyeContact: number; index: number }[] {
    if (data.length <= maxPoints) {
        return data.map((d, i) => ({
            confidence: d.confidence,
            eyeContact: d.eyeContact,
            index: i,
        }));
    }

    const bucketSize = data.length / maxPoints;
    const result: { confidence: number; eyeContact: number; index: number }[] =
        [];

    for (let i = 0; i < maxPoints; i++) {
        const start = Math.floor(i * bucketSize);
        const end = Math.floor((i + 1) * bucketSize);
        let sumConf = 0;
        let sumEye = 0;
        let count = 0;

        for (let j = start; j < end && j < data.length; j++) {
            sumConf += data[j].confidence;
            sumEye += data[j].eyeContact;
            count++;
        }

        if (count > 0) {
            result.push({
                confidence: sumConf / count,
                eyeContact: sumEye / count,
                index: i,
            });
        }
    }

    return result;
}

const BehavioralAnalysis = ({
    emotionalAnalysis,
    behavioralTips,
}: BehavioralAnalysisProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Downsample raw data to ~30 clean segments for readable chart
    const chartData = useMemo(() => {
        const raw = emotionalAnalysis.map((data) => ({
            confidence: Math.min(
                100,
                Math.max(0, (data.confidence ?? 0) * 100),
            ),
            eyeContact: Math.min(
                100,
                Math.max(0, (data.eyeContact ?? 0) * 100),
            ),
        }));
        return downsample(raw, 30);
    }, [emotionalAnalysis]);

    const hasData = chartData.length >= 2;

    // --- Statistics ---
    const stats = useMemo(() => {
        if (chartData.length === 0) return null;
        const confArr = chartData.map((d) => d.confidence);
        const eyeArr = chartData.map((d) => d.eyeContact);

        const avgConf = confArr.reduce((a, b) => a + b, 0) / confArr.length;
        const avgEye = eyeArr.reduce((a, b) => a + b, 0) / eyeArr.length;
        const minConf = Math.min(...confArr);
        const maxConf = Math.max(...confArr);
        const confRange = maxConf - minConf;

        // Trend: compare last third vs first third
        const third = Math.floor(confArr.length / 3);
        const firstThirdAvg =
            confArr.slice(0, third).reduce((a, b) => a + b, 0) / third;
        const lastThirdAvg =
            confArr.slice(-third).reduce((a, b) => a + b, 0) / third;
        const trend = lastThirdAvg - firstThirdAvg;

        return {
            avgConf,
            avgEye,
            minConf,
            maxConf,
            confRange,
            trend,
        };
    }, [chartData]);

    // --- SVG dimensions & scales ---
    const width = 900;
    const height = 340;
    const pad = { top: 30, right: 30, bottom: 40, left: 50 };
    const cw = width - pad.left - pad.right;
    const ch = height - pad.top - pad.bottom;

    const scaleX = (i: number) =>
        pad.left +
        (chartData.length > 1 ? (i / (chartData.length - 1)) * cw : cw / 2);
    const scaleY = (v: number) => pad.top + ch - (v / 100) * ch;

    // --- Build smooth Catmull-Rom spline paths (better than cubic bezier) ---
    const buildSplinePath = (key: "confidence" | "eyeContact") => {
        if (chartData.length < 2) return "";
        const pts = chartData.map((d, i) => ({
            x: scaleX(i),
            y: scaleY(d[key]),
        }));

        // Catmull-Rom to Cubic Bezier conversion for smooth curves
        let path = `M ${pts[0].x},${pts[0].y}`;

        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[Math.max(0, i - 1)];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[Math.min(pts.length - 1, i + 2)];

            const tension = 0.35;
            const cp1x = p1.x + (p2.x - p0.x) * tension;
            const cp1y = p1.y + (p2.y - p0.y) * tension;
            const cp2x = p2.x - (p3.x - p1.x) * tension;
            const cp2y = p2.y - (p3.y - p1.y) * tension;

            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return path;
    };

    const confidencePath = useMemo(
        () => buildSplinePath("confidence"),
        [chartData],
    );
    const eyeContactPath = useMemo(
        () => buildSplinePath("eyeContact"),
        [chartData],
    );

    // Area paths
    const buildArea = (linePath: string) => {
        if (!linePath) return "";
        const baseLine = pad.top + ch;
        return `${linePath} V ${baseLine} H ${scaleX(0)} Z`;
    };

    const confidenceArea = useMemo(
        () => buildArea(confidencePath),
        [confidencePath],
    );
    const eyeContactArea = useMemo(
        () => buildArea(eyeContactPath),
        [eyeContactPath],
    );

    // Grid
    const yTicks = [0, 25, 50, 75, 100];

    // Points for interaction
    const points = useMemo(
        () =>
            chartData.map((d, i) => ({
                x: scaleX(i),
                yConf: scaleY(d.confidence),
                yEye: scaleY(d.eyeContact),
                confidence: d.confidence,
                eyeContact: d.eyeContact,
                index: d.index,
            })),
        [chartData],
    );

    const averageEyeContact = stats ? stats.avgEye.toFixed(0) : "0";
    const averageConfidence = stats ? stats.avgConf.toFixed(0) : "0";

    return (
        <div className="flex flex-col gap-12">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary-200/10 text-primary-200">
                    <Brain className="size-9" />
                </div>
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">
                        Behavioral Analysis
                    </h2>
                    <p className="text-md text-light-400">
                        AI-powered insights into your non-verbal communication
                        and confidence.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Confidence & Gaze Chart */}
                <div className="lg:col-span-8 glass-card-extreme p-8 rounded-[2.5rem] flex flex-col gap-6">
                    <div className="flex justify-between items-center px-2">
                        <h4 className="text-sm font-black uppercase tracking-[0.4em] text-light-400">
                            Confidence Trend
                        </h4>
                        <div className="flex gap-5">
                            <div className="flex items-center gap-2">
                                <div className="size-2.5 rounded-full bg-[#CAC5FE] shadow-[0_0_6px_rgba(202,197,254,0.6)]" />
                                <span className="text-[11px] font-bold text-light-400 uppercase tracking-wider">
                                    Confidence
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2.5 rounded-full bg-[#60a5fa] shadow-[0_0_6px_rgba(96,165,250,0.6)]" />
                                <span className="text-[11px] font-bold text-light-400 uppercase tracking-wider">
                                    Eye Contact
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative w-full"
                        style={{ minHeight: "300px" }}
                    >
                        {!hasData ? (
                            <div className="flex items-center justify-center h-[300px] opacity-40">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-light-600">
                                    {chartData.length === 1
                                        ? "Need more data points to render trend"
                                        : "Awaiting behavioral analysis data"}
                                </p>
                            </div>
                        ) : (
                            <>
                                <svg
                                    viewBox={`0 0 ${width} ${height}`}
                                    className="w-full h-full overflow-visible"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <defs>
                                        {/* Confidence gradient fill */}
                                        <linearGradient
                                            id="confAreaGrad"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#CAC5FE"
                                                stopOpacity="0.20"
                                            />
                                            <stop
                                                offset="60%"
                                                stopColor="#CAC5FE"
                                                stopOpacity="0.05"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#CAC5FE"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                        {/* Eye contact gradient fill */}
                                        <linearGradient
                                            id="eyeAreaGrad"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#60a5fa"
                                                stopOpacity="0.12"
                                            />
                                            <stop
                                                offset="60%"
                                                stopColor="#60a5fa"
                                                stopOpacity="0.03"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#60a5fa"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                        {/* Line glow */}
                                        <filter
                                            id="lineGlowConf"
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
                                        <filter
                                            id="lineGlowEye"
                                            x="-20%"
                                            y="-20%"
                                            width="140%"
                                            height="140%"
                                        >
                                            <feGaussianBlur
                                                stdDeviation="3"
                                                result="blur"
                                            />
                                            <feComposite
                                                in="SourceGraphic"
                                                in2="blur"
                                                operator="over"
                                            />
                                        </filter>
                                        {/* Dot glow */}
                                        <filter
                                            id="dotGlow"
                                            x="-100%"
                                            y="-100%"
                                            width="300%"
                                            height="300%"
                                        >
                                            <feGaussianBlur
                                                stdDeviation="6"
                                                result="blur"
                                            />
                                            <feComposite
                                                in="SourceGraphic"
                                                in2="blur"
                                                operator="over"
                                            />
                                        </filter>
                                    </defs>

                                    {/* Y-axis grid & labels */}
                                    {yTicks.map((tick) => (
                                        <g key={tick}>
                                            <line
                                                x1={pad.left}
                                                y1={scaleY(tick)}
                                                x2={width - pad.right}
                                                y2={scaleY(tick)}
                                                stroke="#4F557D"
                                                strokeWidth="0.8"
                                                strokeDasharray="6 4"
                                                opacity="0.15"
                                            />
                                            <text
                                                x={pad.left - 14}
                                                y={scaleY(tick) + 4}
                                                fill="#6870A6"
                                                fontSize="18"
                                                fontWeight="700"
                                                textAnchor="end"
                                                opacity="0.7"
                                            >
                                                {tick}%
                                            </text>
                                        </g>
                                    ))}

                                    {/* X-axis time labels */}
                                    {points.length > 0 &&
                                        [
                                            0,
                                            Math.floor(points.length / 4),
                                            Math.floor(points.length / 2),
                                            Math.floor((3 * points.length) / 4),
                                            points.length - 1,
                                        ]
                                            .filter(
                                                (v, i, a) => a.indexOf(v) === i,
                                            )
                                            .map((idx) => (
                                                <text
                                                    key={idx}
                                                    x={points[idx].x}
                                                    y={height - 8}
                                                    fill="#6870A6"
                                                    fontSize="18"
                                                    fontWeight="700"
                                                    textAnchor="middle"
                                                    opacity="0.4"
                                                >
                                                    {idx === 0
                                                        ? "Start"
                                                        : idx ===
                                                            points.length - 1
                                                          ? "End"
                                                          : `${Math.round((idx / (points.length - 1)) * 100)}%`}
                                                </text>
                                            ))}

                                    {/* Area fills */}
                                    <path
                                        d={confidenceArea}
                                        fill="url(#confAreaGrad)"
                                    />
                                    <path
                                        d={eyeContactArea}
                                        fill="url(#eyeAreaGrad)"
                                    />

                                    {/* Eye contact line (behind confidence) */}
                                    <path
                                        d={eyeContactPath}
                                        fill="none"
                                        stroke="#60a5fa"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#lineGlowEye)"
                                        opacity="0.85"
                                    />

                                    {/* Confidence line (primary, on top) */}
                                    <path
                                        d={confidencePath}
                                        fill="none"
                                        stroke="#CAC5FE"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#lineGlowConf)"
                                    />

                                    {/* Hover interaction */}
                                    {points.map((p, i) => {
                                        const hitWidth =
                                            cw / (chartData.length - 1);
                                        return (
                                            <g
                                                key={i}
                                                onMouseEnter={() =>
                                                    setHoveredIndex(i)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredIndex(null)
                                                }
                                            >
                                                <rect
                                                    x={p.x - hitWidth / 2}
                                                    y={pad.top}
                                                    width={hitWidth}
                                                    height={ch}
                                                    fill="transparent"
                                                    className="cursor-pointer"
                                                />

                                                {/* Hover vertical line */}
                                                {hoveredIndex === i && (
                                                    <line
                                                        x1={p.x}
                                                        y1={pad.top}
                                                        x2={p.x}
                                                        y2={pad.top + ch}
                                                        stroke="#CAC5FE"
                                                        strokeWidth="1"
                                                        strokeDasharray="3 3"
                                                        opacity="0.3"
                                                    />
                                                )}

                                                {/* Confidence dot */}
                                                <circle
                                                    cx={p.x}
                                                    cy={p.yConf}
                                                    r={
                                                        hoveredIndex === i
                                                            ? 6
                                                            : 0
                                                    }
                                                    fill="#CAC5FE"
                                                    stroke="#020408"
                                                    strokeWidth="2.5"
                                                    filter={
                                                        hoveredIndex === i
                                                            ? "url(#dotGlow)"
                                                            : undefined
                                                    }
                                                    style={{
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                />

                                                {/* Eye contact dot */}
                                                <circle
                                                    cx={p.x}
                                                    cy={p.yEye}
                                                    r={
                                                        hoveredIndex === i
                                                            ? 6
                                                            : 0
                                                    }
                                                    fill="#60a5fa"
                                                    stroke="#020408"
                                                    strokeWidth="2.5"
                                                    filter={
                                                        hoveredIndex === i
                                                            ? "url(#dotGlow)"
                                                            : undefined
                                                    }
                                                    style={{
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                />
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* Floating tooltip */}
                                {hoveredIndex !== null &&
                                    points[hoveredIndex] && (
                                        <div
                                            className="absolute pointer-events-none z-50 bg-[#0a0c14]/95 border border-white/10 backdrop-blur-2xl px-5 py-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                                            style={{
                                                left: `${(points[hoveredIndex].x / width) * 100}%`,
                                                top: `${(Math.min(points[hoveredIndex].yConf, points[hoveredIndex].yEye) / height) * 100}%`,
                                                transform:
                                                    hoveredIndex <= 2
                                                        ? "translate(4%, -110%)"
                                                        : hoveredIndex >=
                                                            points.length - 3
                                                          ? "translate(-104%, -110%)"
                                                          : "translate(-50%, -110%)",
                                            }}
                                        >
                                            <div className="flex flex-col gap-2.5 min-w-[170px]">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-light-600">
                                                    Segment{" "}
                                                    {points[hoveredIndex]
                                                        .index + 1}{" "}
                                                    / {chartData.length}
                                                </span>
                                                <div className="h-px bg-white/5" />
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-2 rounded-full bg-[#CAC5FE] shadow-[0_0_4px_rgba(202,197,254,0.5)]" />
                                                        <span className="text-xs font-bold text-light-400">
                                                            Confidence
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-black text-white tabular-nums">
                                                        {points[
                                                            hoveredIndex
                                                        ].confidence.toFixed(1)}
                                                        %
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between gap-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-2 rounded-full bg-[#60a5fa] shadow-[0_0_4px_rgba(96,165,250,0.5)]" />
                                                        <span className="text-xs font-bold text-light-400">
                                                            Eye Contact
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-black text-white tabular-nums">
                                                        {points[
                                                            hoveredIndex
                                                        ].eyeContact.toFixed(1)}
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`absolute -bottom-1.5 w-3 h-3 bg-[#0a0c14] border-r border-b border-white/10 rotate-45 ${
                                                    hoveredIndex <= 2
                                                        ? "left-6"
                                                        : hoveredIndex >=
                                                            points.length - 3
                                                          ? "right-6"
                                                          : "left-1/2 -translate-x-1/2"
                                                }`}
                                            />
                                        </div>
                                    )}
                            </>
                        )}
                    </div>
                </div>

                {/* Stats & Tips Column */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Average Confidence */}
                    <div className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary-500/10 text-primary-200">
                            {stats && stats.trend >= 0 ? (
                                <TrendingUp className="size-5" />
                            ) : (
                                <TrendingDown className="size-5" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[12px] font-black uppercase tracking-widest text-light-400">
                                Average Confidence
                            </p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black text-white tabular-nums">
                                    {averageConfidence}%
                                </p>
                                {stats && (
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-wider ${stats.trend >= 0 ? "text-emerald-400" : "text-red-400"}`}
                                    >
                                        {stats.trend >= 0 ? "↑" : "↓"}{" "}
                                        {Math.abs(stats.trend).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Average Eye Contact */}
                    <div className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                            <Eye className="size-5" />
                        </div>
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-widest text-light-400">
                                Average Eye Contact
                            </p>
                            <p className="text-2xl font-black text-white tabular-nums">
                                {averageEyeContact}%
                            </p>
                        </div>
                    </div>

                    {/* Coaching Tips */}
                    <div className="glass-card-extreme p-8 rounded-[2.5rem] flex-1 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <Zap className="size-4 text-primary-200" />
                            <h4 className="text-[14px] font-black uppercase tracking-widest text-light-400">
                                Coaching Tips
                            </h4>
                        </div>
                        <ul className="flex flex-col gap-4">
                            {behavioralTips.length > 0 ? (
                                behavioralTips.map((tip, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-3 items-start group"
                                    >
                                        <div className="size-1.5 rounded-full bg-primary-200 mt-2 shrink-0 animate-pulse" />
                                        <span className="text-sm font-medium text-light-100/80 group-hover:text-white transition-colors">
                                            {tip}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-light-600">
                                    Could not generate behavioral data...
                                </p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BehavioralAnalysis;
