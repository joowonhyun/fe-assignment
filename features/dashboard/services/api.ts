import { DailyStat } from "@/shared/types";
import { API_BASE_URL } from "@/shared/constants/api";

export const fetchDailyStats = async (): Promise<DailyStat[]> => {
  const res = await fetch(`${API_BASE_URL}/daily_stats`);
  if (!res.ok) throw new Error("일별 통계를 불러오는 데 실패했습니다.");
  return res.json();
};
