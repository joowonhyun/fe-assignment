"use client";

import React from "react";
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
    form,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    closeModal,
  } = useCampaignForm();

  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={handleBackdrop}
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh] text-slate-900 dark:text-slate-100">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold">캠페인 등록</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">
              캠페인명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={`캠페인명을 입력하세요 (${CAMPAIGN_LIMITS.NAME_MIN_LENGTH}~${CAMPAIGN_LIMITS.NAME_MAX_LENGTH}자)`}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
            />
            {errors.name && (
              <span className="text-xs text-red-500">{errors.name}</span>
            )}
          </div>

          {/* Platform */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold">
              광고 매체 <span className="text-red-500">*</span>
            </label>
            <select
              value={form.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
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
              <span className="text-xs text-red-500">{errors.platform}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">
                예산 (원) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formatNumericDisplay(form.budget)}
                onChange={(e) =>
                  handleChange("budget", sanitizeNumericInput(e.target.value))
                }
                placeholder={`${CAMPAIGN_LIMITS.BUDGET_MIN.toLocaleString()} ~ ${CAMPAIGN_LIMITS.BUDGET_MAX.toLocaleString()}`}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.budget && (
                <span className="text-xs text-red-500">{errors.budget}</span>
              )}
            </div>

            {/* Cost */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">
                집행 금액 (원) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={formatNumericDisplay(form.cost)}
                onChange={(e) =>
                  handleChange("cost", sanitizeNumericInput(e.target.value))
                }
                placeholder="0 ~ 예산 내"
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.cost && (
                <span className="text-xs text-red-500">{errors.cost}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">
                시작일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.startDate && (
                <span className="text-xs text-red-500">{errors.startDate}</span>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">
                종료일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.endDate && (
                <span className="text-xs text-red-500">{errors.endDate}</span>
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
      </div>
    </div>
  );
}
