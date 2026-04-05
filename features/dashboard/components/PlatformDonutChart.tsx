"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Platform, Campaign, DailyStat } from "@/shared/types";
import { useFilterStore } from "@/features/filter/store/useFilterStore";
import { useFilteredData } from "@/features/filter/hooks/useFilteredData";

interface Props {
  allCampaigns: Campaign[];
  allDailyStats: DailyStat[];
}

type Metric = "totalCost" | "impressions" | "clicks" | "conversions";

const METRIC_LABELS: Record<Metric, string> = {
  totalCost: "비용",
  impressions: "노출수",
  clicks: "클릭수",
  conversions: "전환수",
};

const COLORS: Record<string, string> = {
  Google: "#ea4335",
  Meta: "#1877f2",
  Naver: "#03c75a",
};

export default function PlatformDonutChart({
  allCampaigns,
  allDailyStats,
}: Props) {
  const { campaigns } = useFilteredData(allCampaigns, allDailyStats);
  const [metric, setMetric] = useState<Metric>("totalCost");
  const { platforms, setPlatforms } = useFilterStore();

  const chartData = useMemo(() => {
    const grouped = new Map<Platform, number>();

    // Initialize
    grouped.set("Google", 0);
    grouped.set("Meta", 0);
    grouped.set("Naver", 0);

    let totalVal = 0;

    campaigns.forEach((c) => {
      const val = c[metric] || 0;
      grouped.set(c.platform, (grouped.get(c.platform) || 0) + val);
      totalVal += val;
    });

    return Array.from(grouped.entries())
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
        percentage:
          totalVal > 0 ? ((value / totalVal) * 100).toFixed(1) : "0.0",
      }));
  }, [campaigns, metric]);

  const handleSliceClick = (data: any) => {
    const platformName = data.name as Platform;
    if (platforms.includes(platformName)) {
      setPlatforms(platforms.filter((p) => p !== platformName));
    } else {
      setPlatforms([...platforms, platformName]);
    }
  };

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percentage, name } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#64748b"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={11}
        className="font-semibold"
      >
        {`${name} ${percentage}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[250px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-[15px]">플랫폼별 성과</h3>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as Metric)}
          className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 outline-none"
        >
          <option value="totalCost">비용</option>
          <option value="impressions">노출수</option>
          <option value="clicks">클릭수</option>
          <option value="conversions">전환수</option>
        </select>
      </div>

      <div className="flex-1 w-full relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                onClick={handleSliceClick}
                cursor="pointer"
                label={renderCustomizedLabel}
                labelLine={false}
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name] || "#94a3b8"}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: unknown) =>
                  new Intl.NumberFormat("ko-KR").format(Number(value))
                }
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
            </PieChart>
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
