"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Campaign, DailyStat } from "@/types";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useMetricToggle } from "@/hooks/useMetricToggle";
import { aggregateDailyStats } from "@/utils/dataset";

interface Props {
  allCampaigns: Campaign[];
  allDailyStats: DailyStat[];
}

export default function DailyTrendChart({
  allCampaigns,
  allDailyStats,
}: Props) {
  const { dailyStats } = useFilteredData(allCampaigns, allDailyStats);
  const { showImpressions, showClicks, toggleMetric } = useMetricToggle();

  const chartData = useMemo(
    () => aggregateDailyStats(dailyStats),
    [dailyStats],
  );

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">일별 추이 차트</h3>
        <div className="flex gap-2">
          <button
            onClick={() => toggleMetric("impressions")}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${showImpressions ? "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400" : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700"}`}
          >
            노출수
          </button>
          <button
            onClick={() => toggleMetric("clicks")}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${showClicks ? "bg-teal-100 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800/50 dark:text-teal-400" : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700"}`}
          >
            클릭수
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  const parts = val.split("-");
                  if (parts.length === 3) return `${parts[1]}/${parts[2]}`;
                  return val;
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  new Intl.NumberFormat("ko-KR", {
                    notation: "compact",
                  }).format(val)
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "12px",
                  color: "#000",
                }}
                cursor={{
                  stroke: "#cbd5e1",
                  strokeWidth: 1,
                  strokeDasharray: "3 3",
                }}
                labelFormatter={(label) => `날짜: ${label}`}
                formatter={(value: unknown) => [
                  new Intl.NumberFormat("ko-KR").format(Number(value) || 0),
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {showImpressions && (
                <Line
                  type="monotone"
                  dataKey="impressions"
                  name="노출수"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#3b82f6" }}
                  activeDot={{ r: 5 }}
                />
              )}
              {showClicks && (
                <Line
                  type="monotone"
                  dataKey="clicks"
                  name="클릭수"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#14b8a6" }}
                  activeDot={{ r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-400">
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
