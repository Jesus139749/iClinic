import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ButtonProps } from "./interfaces/ButtonProps";

const VARIANTS = {
  primary: {
    box: "h-12 bg-[#2F80ED]",
    text: "text-base font-bold text-white",
    spinner: "#FFFFFF",
  },
  secondary: {
    box: "h-11 border border-blue-200 bg-blue-50",
    text: "text-sm font-bold text-blue-600",
    spinner: "#2F80ED",
  },
  outline: {
    box: "h-11 border border-slate-200 bg-white",
    text: "text-sm font-bold text-slate-600",
    spinner: "#64748B",
  },
  danger: {
    box: "h-12 bg-red-50",
    text: "text-base font-semibold text-red-500",
    spinner: "#EF4444",
  },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  loadingLabel,
  disabled = false,
  className = "",
}: ButtonProps) {
  const style = VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center rounded-xl ${style.box} ${className}`}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color={style.spinner} />
          {loadingLabel ? <Text className={style.text}>{loadingLabel}</Text> : null}
        </View>
      ) : (
        <Text className={style.text}>{label}</Text>
      )}
    </Pressable>
  );
}
