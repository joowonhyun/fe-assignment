import { CampaignStatus } from "@/shared/types";

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; className: string }
> = {
  active: {
    label: "진행중",
    className:
      "whitespace-nowrap px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold",
  },
  paused: {
    label: "일시중지",
    className:
      "whitespace-nowrap px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold",
  },
  ended: {
    label: "종료",
    className:
      "whitespace-nowrap px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold",
  },
};

/**
 * 캠페인 상태값을 한국어 배지 엘리먼트로 변환합니다.
 * @param status 'active' | 'paused' | 'ended'
 */
export const getStatusLabel = (status: string) => {
  const config = STATUS_CONFIG[status as CampaignStatus];
  if (!config) return <span>{status}</span>;
  return <span className={config.className}>{config.label}</span>;
};
