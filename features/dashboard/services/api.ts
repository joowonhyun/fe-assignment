import { DailyStat } from "@/shared/types";

const API_BASE_URL = "http://127.0.0.1:3001";

export const fetchDailyStats = async (): Promise<DailyStat[]> => {
  const res = await fetch(`${API_BASE_URL}/daily_stats`, {
    next: { tags: ["daily_stats"] },
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("일별 통계를 불러오는 데 실패했습니다.");
  return res.json();
};
