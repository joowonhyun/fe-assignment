import { useState, useMemo, useEffect } from "react";
import { NormalizedCampaign, CampaignStatus } from "@/shared/types";
import {
  updateCampaignStatusesAction,
  deleteCampaignsAction,
} from "../services/actions";
import { useRouter } from "next/navigation";

export type SortCol = "period" | "totalCost" | "ctr" | "cpc" | "roas" | null;

const ITEMS_PER_PAGE = 10;

export const useCampaignTable = (campaigns: NormalizedCampaign[]) => {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<CampaignStatus | "">("");

  // 필터링된 데이터 기반이 바뀌면(전역 필터 변경 등) 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [campaigns]);

  // ── Derived data ────────────────────────────────────────
  const filtered = useMemo(
    () =>
      campaigns.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [campaigns, searchTerm],
  );

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    const key = sortCol === "period" ? "startDate" : sortCol;
    return [...filtered].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (typeof valA === "string" && typeof valB === "string")
        return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      if (typeof valA === "number" && typeof valB === "number")
        return sortDesc ? valB - valA : valA - valB;
      return 0;
    });
  }, [filtered, sortCol, sortDesc]);

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const pageData = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Handlers ────────────────────────────────────────────
  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDesc((d) => !d);
    else {
      setSortCol(col);
      setSortDesc(true);
    }
    setCurrentPage(1);
  };

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCheckAll = () => {
    const allSelected =
      checkedIds.size === pageData.length && pageData.length > 0;
    setCheckedIds(allSelected ? new Set() : new Set(pageData.map((c) => c.id)));
  };

  const handleBulkUpdate = async () => {
    if (!checkedIds.size || !bulkStatus) return;
    const result = await updateCampaignStatusesAction(
      Array.from(checkedIds),
      bulkStatus,
    );
    if (!result.success) {
      alert(`상태 변경 실패: ${result.message}`);
      return;
    }
    setCheckedIds(new Set());
    setBulkStatus("");
    router.refresh();
  };

  const handleBulkDelete = async () => {
    if (!checkedIds.size) return;
    if (
      !window.confirm(
        `선택한 ${checkedIds.size}개의 캠페인을 삭제하시겠습니까?`,
      )
    )
      return;
    const result = await deleteCampaignsAction(Array.from(checkedIds));
    if (!result.success) {
      alert(`삭제 실패: ${result.message}`);
      return;
    }
    setCheckedIds(new Set());
    router.refresh();
  };

  // ── Return ──────────────────────────────────────────────
  return {
    searchTerm,
    sortCol,
    sortDesc,
    currentPage,
    totalPages,
    totalItems,
    checkedIds,
    bulkStatus,
    setBulkStatus,
    setCurrentPage,
    pageData,
    totalCampaignsLength: campaigns.length,
    handleSearch,
    handleSort,
    toggleCheck,
    toggleCheckAll,
    handleBulkUpdate,
    handleBulkDelete,
  };
};
