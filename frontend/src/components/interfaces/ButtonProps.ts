import type { ButtonVariant } from "./ButtonVariant";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
}
