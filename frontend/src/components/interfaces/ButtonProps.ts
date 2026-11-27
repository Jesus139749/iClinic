export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
}
