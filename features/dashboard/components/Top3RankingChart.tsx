"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Campaign, DailyStat } from "@/shared/types";
import { useFilteredData } from "@/features/filter/hooks/useFilteredData";
import { formatTick, getMetricFormat } from "@/shared/utils/formatters";
import { useTopRanking } from "@/features/dashboard/hooks/useTopRanking";
import { RankingMetric } from "@/features/dashboard/types/chart";
import { getMetricColor } from "@/features/dashboard/utils/chart";

interface Props {
  allCampaigns: Campaign[];
  allDailyStats: DailyStat[];
}

export default function Top3RankingChart({
  allCampaigns,
  allDailyStats,
}: Props) {
  const { campaigns } = useFilteredData(allCampaigns, allDailyStats);
  const { metric, setMetric, chartData } = useTopRanking(campaigns);

  const barColor = getMetricColor(metric);

  return (
    <div className="flex flex-col h-full min-h-[250px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[15px]">우수 캠페인 Top3</h3>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as RankingMetric)}
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none"
        >
          <option value="roas">ROAS</option>
          <option value="ctr">CTR</option>
          <option value="cpc">CPC</option>
        </select>
      </div>

      <div className="flex-1 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e2e8f0"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatTick}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                width={70}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(value: unknown) =>
                  getMetricFormat(metric, Number(value))
                }
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.fullName || label
                }
              />
              {/* 모든 막대 색상이 같다면 Cell 없이 fill 속성만 사용합니다. */}
              <Bar
                dataKey="value"
                fill={barColor}
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
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
