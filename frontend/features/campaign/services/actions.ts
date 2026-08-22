"use server";

import { updateCampaignStatuses, createCampaign, deleteCampaigns } from "./api";
import { Campaign } from "@/shared/types";

type ActionResult = { success: true } | { success: false; message: string };

export async function updateCampaignStatusesAction(
  ids: string[],
  status: string,
): Promise<ActionResult> {
  try {
    await updateCampaignStatuses(ids, status);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : "상태 변경 중 알 수 없는 오류가 발생했습니다.";
    return { success: false, message };
  }
}

export async function createCampaignAction(
  campaign: Omit<Campaign, "id">,
): Promise<ActionResult> {
  try {
    await createCampaign(campaign);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : "캠페인 등록 중 알 수 없는 오류가 발생했습니다.";
    return { success: false, message };
  }
}

export async function deleteCampaignsAction(
  ids: string[],
): Promise<ActionResult> {
  try {
    await deleteCampaigns(ids);
    return { success: true };
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : "캠페인 삭제 중 알 수 없는 오류가 발생했습니다.";
    return { success: false, message };
  }
}
