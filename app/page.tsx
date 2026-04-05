import GlobalFilter from "@/components/globalFilter/GlobalFilter";
import CampaignRegistrationModal from "@/components/campaign/CampaignRegistrationModal";
import CreateCampaignButton from "@/components/campaign/CreateCampaignButton";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          마케팅 캠페인 대시보드
        </h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <CreateCampaignButton />
        </div>
      </div>

      <GlobalFilter />
      <CampaignRegistrationModal />
    </div>
  );
}
