import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export interface DashboardShortcutCardProps {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  text: string;
  color?: string;
  navigationScreen: string;
}
