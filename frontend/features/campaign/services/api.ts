import { Campaign } from "@/shared/types";
import { serverFetch, actionFetch } from "@/shared/utils/api-client";

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  return serverFetch<Campaign[]>("/campaigns");
};

/**
 * 여러 건을 한 요청으로 변경한다. id마다 따로 호출하면 요청 수만큼 왕복이 생기고,
 * 토큰이 만료된 상태면 각 요청이 제각기 refresh를 시도한다.
 */
export const updateCampaignStatuses = async (
  ids: string[],
  status: string,
): Promise<void> => {
  await actionFetch("/campaigns", {
    method: "PATCH",
    body: JSON.stringify({ ids, status }),
  });
};

export const createCampaign = async (
  campaign: Omit<Campaign, "id">,
): Promise<Campaign> => {
  return actionFetch<Campaign>("/campaigns", {
    method: "POST",
    body: JSON.stringify(campaign),
  });
};

export const deleteCampaigns = async (ids: string[]): Promise<void> => {
  await actionFetch("/campaigns", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
};
