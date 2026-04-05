import { fetchCampaigns, fetchDailyStats } from "@/services/api";
import DashboardChartsWrapper from "@/components/dashboard/DashboardChartsWrapper";

export default async function ChartsSlot() {
  const [campaigns, dailyStats] = await Promise.all([
    fetchCampaigns(),
    fetchDailyStats(),
  ]);

  return (
    <DashboardChartsWrapper campaigns={campaigns} dailyStats={dailyStats} />
  );
}
