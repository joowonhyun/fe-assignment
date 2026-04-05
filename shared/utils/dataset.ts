import {
  Campaign,
  CampaignStatus,
  DailyStat,
  NormalizedCampaign,
  Platform,
} from "@/shared/types";
import { calculateCPC, calculateCTR, calculateROAS } from "./calc";

export const normalizePlatform = (platform: string): Platform => {
  const lower = platform.toLowerCase();
  if (lower.includes("facebook") || lower.includes("meta")) return "Meta";
  if (lower.includes("naver") || lower.includes("네이버")) return "Naver";
  return "Google";
};

export const normalizeStatus = (status: string): CampaignStatus => {
  const lower = status.toLowerCase();
  if (lower === "running") return "active";
  if (lower === "stopped") return "ended";
  if (["active", "paused", "ended"].includes(lower))
    return lower as CampaignStatus;
  return "active"; // 기본값 (Fallback)
};

export const normalizeNumber = (
  val: string | number | null | undefined,
): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  const parsed = parseInt(val.replace(/[^0-9-]/g, ""), 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const normalizeDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "2026-01-01"; // 기본 날짜 (Fallback)
  // 슬래시나 점 형식의 문자열을 대시(-)로 통일하고 공백 제거 (예: 2026. 04. 12 -> 2026-04-12)
  let cleaned = dateStr.replace(/[\/\.]/g, "-").replace(/\s/g, "");
  if (cleaned.endsWith("-")) cleaned = cleaned.slice(0, -1);
  return cleaned;
};

/**
 * 현재 달의 1일과 말일을 YYYY-MM-DD 형식의 객체로 반환합니다.
 */
export const getInitialDates = () => {
  const now = new Date();
  const year = now.getFullYear();

  // 현재 과제의 모의 데이터는 2026년 기준입니다.
  // 요구사항의 "당월 1일~말일" 구연을 위해 실제 시스템 시간을 사용합니다.
  const firstDay = new Date(year, now.getMonth(), 1);
  const lastDay = new Date(year, now.getMonth() + 1, 0);

  const formatDate = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  return {
    startDate: formatDate(firstDay),
    endDate: formatDate(lastDay),
  };
};

export const normalizeCampaignData = (
  campaigns: Campaign[],
  dailyStats: DailyStat[],
): NormalizedCampaign[] => {
  // 캠페인 아이디를 기준으로 일별 통계 맵핑
  const statsMap = new Map<string, DailyStat[]>();
  dailyStats.forEach((stat) => {
    if (!statsMap.has(stat.campaignId)) {
      statsMap.set(stat.campaignId, []);
    }
    statsMap.get(stat.campaignId)!.push(stat);
  });

  return campaigns.map((c) => {
    const stats = statsMap.get(c.id) || [];
    let impressions = 0;
    let clicks = 0;
    let conversions = 0;
    let cost = 0;
    let conversionsValue = 0;

    stats.forEach((s) => {
      impressions += normalizeNumber(s.impressions);
      clicks += normalizeNumber(s.clicks);
      conversions += normalizeNumber(s.conversions);
      cost += normalizeNumber(s.cost);
      conversionsValue += normalizeNumber(s.conversionsValue);
    });

    return {
      id: c.id,
      name: c.name || `캠페인 ${c.id}`, // 캠페인명 빈값 처리
      status: normalizeStatus(c.status),
      platform: normalizePlatform(c.platform),
      budget: normalizeNumber(c.budget),
      startDate: normalizeDate(c.startDate),
      endDate: normalizeDate(c.endDate),
      totalCost: cost,
      impressions,
      clicks,
      conversions,
      conversionsValue,
      ctr: calculateCTR(clicks, impressions),
      cpc: calculateCPC(cost, clicks),
      roas: calculateROAS(conversionsValue, cost),
    };
  });
};

export interface DailyChartPoint {
  date: string;
  impressions: number;
  clicks: number;
}

/**
 * DailyStat 배열을 날짜별로 집계하고 날짜 오름차순으로 정렬합니다.
 */
export const aggregateDailyStats = (
  dailyStats: DailyStat[],
): DailyChartPoint[] => {
  const grouped = new Map<string, DailyChartPoint>();

  dailyStats.forEach((stat) => {
    if (!grouped.has(stat.date)) {
      grouped.set(stat.date, { date: stat.date, impressions: 0, clicks: 0 });
    }
    const entry = grouped.get(stat.date)!;
    entry.impressions += Number(stat.impressions) || 0;
    entry.clicks += Number(stat.clicks) || 0;
  });

  return Array.from(grouped.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
};
