"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillRadarChartProps {
    data: Array<{
        name: string;
        score: number;
    }>;
}

const SkillRadarChart = ({ data }: SkillRadarChartProps) => {
    // Chart dimensions - Optimized for wrapping labels
    const size = 500;
    const center = size / 2;
    const radius = 160; // Keep the core chart compact
    const padding = 10; // Space for labels

    // Calculate coordinates for the radar polygons and axes
    const points = useMemo(() => {
        if (!data || data.length === 0) return [];

        const angleStep = (Math.PI * 2) / data.length;

        return data.map((d, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const value = Math.max(0, Math.min(100, d.score));
            const r = (value / 100) * radius;

            return {
                name: d.name,
                x: center + r * Math.cos(angle),
                y: center + r * Math.sin(angle),
                // Axis end point (100% score)
                labelX: center + (radius + padding) * Math.cos(angle),
                labelY: center + (radius + padding) * Math.sin(angle),
                axisX: center + radius * Math.cos(angle),
                axisY: center + radius * Math.sin(angle),
            };
        });
    }, [data, radius, center, padding]);

    // Path for the background grid (concentric polygons)
    const gridLevels = [25, 50, 75, 100];
    const gridPaths = gridLevels.map((level) => {
        const angleStep = (Math.PI * 2) / data.length;
        return data
            .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = (level / 100) * radius;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                return `${x},${y}`;
            })
            .join(" ");
    });

    // Path for the actual score data
    const scorePath = points.map((p) => `${p.x},${p.y}`).join(" ");

    return (
        <div className="w-full h-auto min-h-[350px] flex flex-col items-center justify-center relative group">
            <h4 className="text-[12px] font-black text-light-600 uppercase tracking-[0.4em] mb-4 absolute top-0 left-0 transition-colors group-hover:text-primary-200">
                Performance Vector
            </h4>

            <div className="w-full max-w-[400px] aspect-square relative mt-8">
                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full drop-shadow-[0_0_20px_rgba(202,197,254,0.1)] overflow-visible"
                >
                    <defs>
                        <radialGradient
                            id="radarGradient"
                            cx="50%"
                            cy="50%"
                            r="50%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#CAC5FE"
                                stopOpacity="0.1"
                            />
                            <stop
                                offset="100%"
                                stopColor="#CAC5FE"
                                stopOpacity="0.4"
                            />
                        </radialGradient>
                    </defs>

                    {/* Background Grid */}
                    {gridPaths.map((path, i) => (
                        <polygon
                            key={i}
                            points={path}
                            fill="transparent"
                            stroke="#4F557D"
                            strokeWidth="0.8"
                            strokeDasharray="2 4"
                            opacity={0.15 + i * 0.15}
                        />
                    ))}

                    {/* Axis Lines */}
                    {points.map((p, i) => (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={p.axisX}
                            y2={p.axisY}
                            stroke="#4F557D"
                            strokeWidth="0.5"
                            opacity="0.3"
                        />
                    ))}

                    {/* Data Polygon */}
                    <AnimatePresence>
                        <motion.polygon
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            points={scorePath}
                            fill="url(#radarGradient)"
                            stroke="#CAC5FE"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            className="transition-all duration-700 ease-out"
                            style={{
                                filter: "drop-shadow(0 0 15px rgba(202,197,254,0.3))",
                            }}
                        />
                    </AnimatePresence>

                    {/* Data Points (Dots) */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <motion.circle
                                initial={{ opacity: 0, r: 0 }}
                                animate={{ opacity: 1, r: 4 }}
                                transition={{
                                    delay: 0.5 + i * 0.1,
                                    duration: 0.5,
                                }}
                                cx={p.x}
                                cy={p.y}
                                fill="#CAC5FE"
                                className="drop-shadow-[0_0_10px_rgba(202,197,254,1)]"
                            />
                            {/* Inner core for extra glow effect */}
                            <circle cx={p.x} cy={p.y} r="1.5" fill="white" />
                        </g>
                    ))}

                    {/* Labels */}
                    {points.map((p, i) => {
                        const angle =
                            (i * (Math.PI * 2)) / data.length - Math.PI / 2;
                        const cos = Math.cos(angle);
                        const sin = Math.sin(angle);

                        // Dynamic anchoring
                        let textAnchor: "start" | "middle" | "end" = "middle";
                        if (cos > 0.3) textAnchor = "start";
                        else if (cos < -0.3) textAnchor = "end";

                        // Split label into lines for better wrapping
                        const name = p.name || "";
                        const words = name.split(" ");
                        let lines: string[] = [];

                        if (words.length > 1) {
                            // Simple logic to split 2-3 word labels into roughly equal halves
                            const mid = Math.ceil(words.length / 2);
                            lines = [
                                words.slice(0, mid).join(" "),
                                words.slice(mid).join(" "),
                            ];
                        } else {
                            lines = [name];
                        }

                        // Adjust Y to vertically center the multi-line block
                        const lineHeight = 20;
                        const totalHeight = lines.length * lineHeight;
                        const yStart =
                            p.labelY - totalHeight / 2 + lineHeight / 2;

                        return (
                            <text
                                key={i}
                                x={p.labelX}
                                y={yStart}
                                textAnchor={textAnchor}
                                fill="#D6E0FF"
                                fontSize="20"
                                fontWeight="900"
                                className="uppercase tracking-tighter opacity-85 group-hover:opacity-100 transition-opacity"
                                style={{
                                    textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                                    filter: "drop-shadow(0 0 10px rgba(202,197,254,0.3))",
                                }}
                            >
                                {lines.map((line, lIdx) => (
                                    <tspan
                                        key={lIdx}
                                        x={p.labelX}
                                        dy={lIdx === 0 ? 0 : "1em"}
                                    >
                                        {line}
                                    </tspan>
                                ))}
                            </text>
                        );
                    })}
                </svg>

                {/* Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500/20 blur-xl rounded-full" />
            </div>
        </div>
    );
};

export default SkillRadarChart;
