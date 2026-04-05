import { CampaignStatus, Platform } from "@/types";

export const STATUS_OPTIONS: { label: string; value: CampaignStatus }[] = [
  { label: "진행중", value: "active" },
  { label: "일시중지", value: "paused" },
  { label: "종료", value: "ended" },
];

export const PLATFORM_OPTIONS: { label: string; value: Platform }[] = [
  { label: "Google", value: "Google" },
  { label: "Meta", value: "Meta" },
  { label: "Naver", value: "Naver" },
];
