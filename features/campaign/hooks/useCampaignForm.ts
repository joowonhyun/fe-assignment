import { useState, useEffect } from "react";
import { Platform } from "@/shared/types";
import { PLATFORM_NAMES } from "@/shared/constants/platforms";
import { createCampaignAction } from "@/features/campaign/services/actions";
import { useModalStore } from "@/features/campaign/store/useModalStore";
import { useRouter } from "next/navigation";
import { CAMPAIGN_LIMITS, DEFAULT_RADIX } from "@/shared/constants/campaign";

export interface CampaignFormData {
  name: string;
  platform: Platform | "";
  budget: string;
  startDate: string;
  endDate: string;
  cost: string;
}

const initialForm: CampaignFormData = {
  name: "",
  platform: "",
  budget: "",
  cost: "",
  startDate: "",
  endDate: "",
};

/**
 * 캠페인 등록 폼의 상태, 유효성 검사 및 서버 제출용 커스텀 훅입니다.
 * 세션 스토리지(Session Storage)를 활용하여 입력 중인 임시 데이터를 자동으로 캐싱하고 복원합니다.
 *
 * @returns {Object} 폼 렌더링 및 제어에 필요한 묶음 객체
 * @property {boolean} isOpen - 모달 열림 여부
 * @property {CampaignFormData} form - 현재 입력된 폼 데이터 상태
 * @property {Partial<Record<keyof CampaignFormData, string>>} errors - 각 폼 필드의 유효성 검사 에러 메시지
 * @property {boolean} isSubmitting - 현재 폼이 서버에 제출 중인지 여부
 * @property {function} handleChange - 특정 폼 필드의 값을 업데이트하는 핸들러 함수
 * @property {function} handleSubmit - 폼 검증을 통과한 후 서버 액션을 호출하는 제출 핸들러
 * @property {function} closeModal - 등록 모달을 닫고 상태를 초기화하는 함수
 */
export const useCampaignForm = () => {
  const router = useRouter();
  const { isOpen, closeModal } = useModalStore();
  const [form, setForm] = useState<CampaignFormData>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CampaignFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 세션 스토리지에서 에디터 임시 저장 데이터 불러오기
  useEffect(() => {
    if (isOpen) {
      const saved = sessionStorage.getItem("campaignDraft");
      if (saved) {
        setForm(JSON.parse(saved));
      } else {
        setForm(initialForm);
      }
      setErrors({});
    }
  }, [isOpen]);

  // 임시 데이터 자동 저장 (form 내용이 바뀔 때마다)
  useEffect(() => {
    sessionStorage.setItem("campaignDraft", JSON.stringify(form));
  }, [form]);

  // 폼 입력값 변경 핸들러
  const handleChange = (field: keyof CampaignFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 폼 로컬 유효성 검증
  const validate = () => {
    const errs: Partial<Record<keyof CampaignFormData, string>> = {};

    if (
      !form.name ||
      form.name.length < CAMPAIGN_LIMITS.NAME_MIN_LENGTH ||
      form.name.length > CAMPAIGN_LIMITS.NAME_MAX_LENGTH
    ) {
      errs.name = `캠페인명은 ${CAMPAIGN_LIMITS.NAME_MIN_LENGTH}자 이상 ${CAMPAIGN_LIMITS.NAME_MAX_LENGTH}자 이하로 입력해주세요.`;
    }

    if (
      !form.platform ||
      !(PLATFORM_NAMES as string[]).includes(form.platform)
    ) {
      errs.platform = "플랫폼을 선택해주세요.";
    }

    const bud = parseInt(form.budget, DEFAULT_RADIX);
    if (
      !form.budget ||
      isNaN(bud) ||
      bud < CAMPAIGN_LIMITS.BUDGET_MIN ||
      bud > CAMPAIGN_LIMITS.BUDGET_MAX
    ) {
      errs.budget = `예산은 ${CAMPAIGN_LIMITS.BUDGET_MIN.toLocaleString()}원에서 ${CAMPAIGN_LIMITS.BUDGET_MAX.toLocaleString()}원 사이의 정수여야 합니다.`;
    }

    const cst = parseInt(form.cost, DEFAULT_RADIX);
    if (
      !form.cost ||
      isNaN(cst) ||
      cst < CAMPAIGN_LIMITS.COST_MIN ||
      cst > CAMPAIGN_LIMITS.COST_MAX
    ) {
      errs.cost = `집행 금액은 ${CAMPAIGN_LIMITS.COST_MIN.toLocaleString()}원에서 ${CAMPAIGN_LIMITS.COST_MAX.toLocaleString()}원 사이여야 합니다.`;
    } else if (bud && cst > bud) {
      errs.cost = "집행 금액은 예산을 초과할 수 없습니다.";
    }

    if (!form.startDate) {
      errs.startDate = "시작일을 선택해주세요.";
    }

    if (!form.endDate) {
      errs.endDate = "종료일을 선택해주세요.";
    } else if (
      form.startDate &&
      new Date(form.endDate) <= new Date(form.startDate)
    ) {
      errs.endDate = "종료일은 시작일 이후여야 합니다.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 제출 동작 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await createCampaignAction({
        name: form.name,
        platform: form.platform as Platform,
        budget: parseInt(form.budget, DEFAULT_RADIX),
        status: "active", // 상태 고정 요구사항
        startDate: form.startDate,
        endDate: form.endDate,
      });

      if (!result.success) {
        alert(`캠페인 등록 실패: ${result.message}`);
        return;
      }

      // 등록 성공 시 임시 캐시 밀고 모달 닫기
      sessionStorage.removeItem("campaignDraft");
      setForm(initialForm);
      closeModal();
      router.refresh();
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      alert(`캠페인 등록 중 오류가 발생했습니다: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isOpen,
    form,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    closeModal,
  };
};
