"use client";

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

interface ScoreTrendChartProps {
    data: Array<{
        date: string;
        score: number;
    }>;
}

const ScoreTrendChart = ({ data }: ScoreTrendChartProps) => {
    // Sort data by date just in case
    const sortedData = [...data].sort(
        (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
    );

    return (
        <div className="w-full h-[350px] bg-dark-300/30 rounded-3xl border border-light-800/50 p-6 flex flex-col">
            <h4 className="text-xl font-semibold text-primary-100 mb-6 px-2">
                Progress Over Time
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={sortedData}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient
                            id="colorScore"
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
                        stroke="#24273A"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "#6870A6", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(str: string) =>
                            dayjs(str).format("MMM D")
                        }
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#6870A6", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1A1C20",
                            borderColor: "#4F557D",
                            borderRadius: "12px",
                            color: "#FFF",
                        }}
                        labelFormatter={(label: any) =>
                            dayjs(label).format("MMM D, YYYY")
                        }
                        formatter={(value: any) => [
                            `${value}/100`,
                            "Overall Score",
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#CAC5FE"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreTrendChart;
