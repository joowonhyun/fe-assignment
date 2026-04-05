import { Platform } from "@/shared/types";

export interface ChartDataEntry {
  name: Platform;
  value: number;
  fill: string;
  percentage: string;
}

export interface PieLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  name?: string;
  percentage?: string;
  [key: string]: any;
}
