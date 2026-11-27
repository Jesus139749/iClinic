import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export interface DashboardCardProps {
  icon: ComponentProps<typeof Ionicons>["name"];
  badgeText: string;
  number: number | string;
  text: string;
  color: string;
}
