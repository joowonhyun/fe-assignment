"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Campaign, DailyStat } from "@/types";
import { useFilteredData } from "@/hooks/useFilteredData";
import { formatTick, getMetricFormat } from "@/utils/formatters";

interface Props {
  allCampaigns: Campaign[];
  allDailyStats: DailyStat[];
}

type Metric = "roas" | "ctr" | "cpc";

export default function Top3RankingChart({
  allCampaigns,
  allDailyStats,
}: Props) {
  const { campaigns } = useFilteredData(allCampaigns, allDailyStats);
  const [metric, setMetric] = useState<Metric>("roas");

  const chartData = useMemo(() => {
    // 배열 복사
    let sortedList = [...campaigns];

    // 정렬 로직 (CPC는 낮을수록 우수, 그 외는 높을수록 우수)
    if (metric === "cpc") {
      const validCpc = sortedList.filter((c) => c.cpc > 0);
      validCpc.sort((a, b) => a.cpc - b.cpc);
      sortedList = validCpc;
    } else {
      sortedList.sort((a, b) => b[metric] - a[metric]);
    }

    return sortedList.slice(0, 3).map((c) => ({
      name: c.name.length > 10 ? c.name.substring(0, 10) + "..." : c.name,
      fullName: c.name,
      value: Number(c[metric].toFixed(2)),
      platform: c.platform,
    }));
  }, [campaigns, metric]);

  return (
    <div className="flex flex-col h-full min-h-[250px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[15px]">우수 캠페인 Top3</h3>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as Metric)}
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
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={metric === "cpc" ? "#8b5cf6" : "#f59e0b"}
                  />
                ))}
              </Bar>
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
