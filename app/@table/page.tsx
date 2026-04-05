import { fetchCampaigns, fetchDailyStats } from "@/services/api";
import CampaignTableWrapper from "@/components/campaign/CampaignTableWrapper";

export default async function TableSlot() {
  const [campaigns, dailyStats] = await Promise.all([
    fetchCampaigns(),
    fetchDailyStats(),
  ]);

  return <CampaignTableWrapper campaigns={campaigns} dailyStats={dailyStats} />;
}
