"use client";

import { Campaign, DailyStat } from "@/types";
import { Table } from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { useCampaignTable } from "@/hooks/useCampaignTable";
import { useFilteredData } from "@/hooks/useFilteredData";
import CampaignTableToolbar from "@/components/campaign/CampaignTableToolbar";
import CampaignTableHeader from "@/components/campaign/CampaignTableHeader";
import CampaignTableRow from "@/components/campaign/CampaignTableRow";

interface Props {
  allCampaigns: Campaign[];
  allDailyStats: DailyStat[];
}

export default function CampaignTable({ allCampaigns, allDailyStats }: Props) {
  const { campaigns } = useFilteredData(allCampaigns, allDailyStats);
  const {
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
    totalCampaignsLength,
    handleSearch,
    handleSort,
    toggleCheck,
    toggleCheckAll,
    handleBulkUpdate,
    handleBulkDelete,
  } = useCampaignTable(campaigns);

  return (
    <div className="flex flex-col gap-4">
      <CampaignTableToolbar
        searchTerm={searchTerm}
        totalItems={totalItems}
        totalCampaignsLength={totalCampaignsLength}
        bulkStatus={bulkStatus}
        checkedCount={checkedIds.size}
        onSearch={handleSearch}
        onBulkStatusChange={setBulkStatus}
        onBulkUpdate={handleBulkUpdate}
        onBulkDelete={handleBulkDelete}
      />

      <Table>
        <CampaignTableHeader
          pageData={pageData}
          checkedIds={checkedIds}
          sortCol={sortCol}
          sortDesc={sortDesc}
          onToggleCheckAll={toggleCheckAll}
          onSort={handleSort}
        />
        <Table.Body>
          {pageData.length > 0 ? (
            pageData.map((c) => (
              <CampaignTableRow
                key={c.id}
                campaign={c}
                checked={checkedIds.has(c.id)}
                onToggle={toggleCheck}
              />
            ))
          ) : (
            <Table.Row>
              <Table.Cell
                colSpan={9}
                className="text-center py-8 text-slate-500"
              >
                검색된 캠페인이 없습니다.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
