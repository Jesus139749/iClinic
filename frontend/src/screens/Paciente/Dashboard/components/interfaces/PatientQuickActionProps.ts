import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export interface PatientQuickActionProps {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  color?: string;
  onPress?: () => void;
}
