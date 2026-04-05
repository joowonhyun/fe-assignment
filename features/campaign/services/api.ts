import { Campaign } from "@/shared/types";

const API_BASE_URL = "http://127.0.0.1:3001";

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const res = await fetch(`${API_BASE_URL}/campaigns`, {
    next: { tags: ["campaigns"] },
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("캠페인 목록을 불러오는 데 실패했습니다.");
  return res.json();
};



export const updateCampaignStatus = async (
  id: string,
  status: string,
): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("캠페인 상태를 변경하는 데 실패했습니다.");
};

export const createCampaign = async (
  campaign: Omit<Campaign, "id">,
): Promise<Campaign> => {
  const newId = `CAMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const campaignWithId = { ...campaign, id: newId };

  const res = await fetch(`${API_BASE_URL}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(campaignWithId),
  });

  if (!res.ok) throw new Error("캠페인을 등록하는 데 실패했습니다.");
  return res.json();
};

export const deleteCampaign = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("캠페인을 삭제하는 데 실패했습니다.");
};
