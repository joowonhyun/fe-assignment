"use client";

import React, { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { useCampaignForm } from "@/features/campaign/hooks/useCampaignForm";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";
import {
  sanitizeNumericInput,
  formatNumericDisplay,
} from "@/shared/utils/formatters";
import { PLATFORM_OPTIONS } from "@/shared/constants/options";
import { CAMPAIGN_LIMITS } from "@/shared/constants/campaign";

export default function CampaignRegistrationModal() {
  const {
    isOpen,
    register,
    control,
    errors,
    isSubmitting,
    handleSubmit,
    closeModal,
  } = useCampaignForm();

  const dialogRef = useRef<HTMLDialogElement>(null);

  useLockBodyScroll(isOpen);

  // showModal()이 포커스 트랩·ESC 닫기·트리거로의 포커스 복귀·배경 비활성화를 담당한다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // close 이벤트는 버블링되지 않아 React의 onClose(루트 위임)로는 잡히지 않는다.
  // ESC로 닫은 뒤 상태가 열림으로 남으면 재오픈이 막히므로 ref에 직접 붙인다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.addEventListener("close", closeModal);
    return () => dialog.removeEventListener("close", closeModal);
  }, [closeModal]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdrop}
      aria-labelledby="campaign-modal-title"
      className="m-auto w-full max-w-lg overflow-y-auto max-h-[90vh] p-0 bg-white dark:bg-slate-900 rounded-xl shadow-2xl text-slate-900 dark:text-slate-100 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 id="campaign-modal-title" className="text-xl font-bold">
          캠페인 등록
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
        {/* 캠페인명 */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="campaign-name" className="text-sm font-semibold">
            캠페인명 <span className="text-red-500">*</span>
          </label>
          <input
            id="campaign-name"
            type="text"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "campaign-name-error" : undefined}
            {...register("name")}
            placeholder={`캠페인명을 입력하세요 (${CAMPAIGN_LIMITS.NAME_MIN_LENGTH}~${CAMPAIGN_LIMITS.NAME_MAX_LENGTH}자)`}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
          />
          {errors.name && (
            <span id="campaign-name-error" role="alert" className="text-xs text-red-500">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* 광고 매체 */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="campaign-platform" className="text-sm font-semibold">
            광고 매체 <span className="text-red-500">*</span>
          </label>
          <select
            id="campaign-platform"
            aria-invalid={!!errors.platform}
            aria-describedby={errors.platform ? "campaign-platform-error" : undefined}
            {...register("platform")}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
          >
            <option value="">매체 선택</option>
            {PLATFORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.platform && (
            <span id="campaign-platform-error" role="alert" className="text-xs text-red-500">
              {errors.platform.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 예산 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="campaign-budget" className="text-sm font-semibold">
              예산 (원) <span className="text-red-500">*</span>
            </label>
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <input
                  id="campaign-budget"
                  type="text"
                  inputMode="numeric"
                  aria-invalid={!!errors.budget}
                  aria-describedby={errors.budget ? "campaign-budget-error" : undefined}
                  value={formatNumericDisplay(field.value)}
                  onChange={(e) =>
                    field.onChange(sanitizeNumericInput(e.target.value))
                  }
                  onBlur={field.onBlur}
                  placeholder={`${CAMPAIGN_LIMITS.BUDGET_MIN.toLocaleString()} ~ ${CAMPAIGN_LIMITS.BUDGET_MAX.toLocaleString()}`}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
                />
              )}
            />
            {errors.budget && (
              <span id="campaign-budget-error" role="alert" className="text-xs text-red-500">
                {errors.budget.message}
              </span>
            )}
          </div>

          {/* 집행 금액 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="campaign-cost" className="text-sm font-semibold">
              집행 금액 (원) <span className="text-red-500">*</span>
            </label>
            <Controller
              name="cost"
              control={control}
              render={({ field }) => (
                <input
                  id="campaign-cost"
                  type="text"
                  inputMode="numeric"
                  aria-invalid={!!errors.cost}
                  aria-describedby={errors.cost ? "campaign-cost-error" : undefined}
                  value={formatNumericDisplay(field.value)}
                  onChange={(e) =>
                    field.onChange(sanitizeNumericInput(e.target.value))
                  }
                  onBlur={field.onBlur}
                  placeholder="0 ~ 예산 내"
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
                />
              )}
            />
            {errors.cost && (
              <span id="campaign-cost-error" role="alert" className="text-xs text-red-500">
                {errors.cost.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 시작일 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="campaign-start-date" className="text-sm font-semibold">
              시작일 <span className="text-red-500">*</span>
            </label>
            <input
              id="campaign-start-date"
              type="date"
              aria-invalid={!!errors.startDate}
              aria-describedby={errors.startDate ? "campaign-start-date-error" : undefined}
              {...register("startDate")}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
            />
            {errors.startDate && (
              <span id="campaign-start-date-error" role="alert" className="text-xs text-red-500">
                {errors.startDate.message}
              </span>
            )}
          </div>

          {/* 종료일 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="campaign-end-date" className="text-sm font-semibold">
              종료일 <span className="text-red-500">*</span>
            </label>
            <input
              id="campaign-end-date"
              type="date"
              aria-invalid={!!errors.endDate}
              aria-describedby={errors.endDate ? "campaign-end-date-error" : undefined}
              {...register("endDate")}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
            />
            {errors.endDate && (
              <span id="campaign-end-date-error" role="alert" className="text-xs text-red-500">
                {errors.endDate.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
            className="px-4 py-2 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? "저장중" : "등록하기"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
