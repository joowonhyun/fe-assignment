import { create } from "zustand";
import { CampaignStatus, Platform } from "@/types";
import { getInitialDates } from "@/utils/dataset";

interface FilterState {
  startDate: string;
  endDate: string;
  statuses: CampaignStatus[];
  platforms: Platform[];
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setStatuses: (statuses: CampaignStatus[]) => void;
  setPlatforms: (platforms: Platform[]) => void;
  reset: () => void;
}

const initialDates = getInitialDates();

export const useFilterStore = create<FilterState>((set) => ({
  startDate: initialDates.startDate,
  endDate: initialDates.endDate,
  statuses: [],
  platforms: [],

  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setStatuses: (statuses) => set({ statuses }),
  setPlatforms: (platforms) => set({ platforms }),

  reset: () =>
    set({
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      statuses: [],
      platforms: [],
    }),
}));
