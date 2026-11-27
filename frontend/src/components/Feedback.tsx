import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ErrorBoxProps } from "./interfaces/ErrorBoxProps";
import type { LoadingProps } from "./interfaces/LoadingProps";
import type { SuccessBannerProps } from "./interfaces/SuccessBannerProps";

export function Loading({ label, fullScreen }: LoadingProps) {
  return (
    <View
      className={`flex-row items-center justify-center gap-2 ${fullScreen ? "flex-1 bg-slate-50" : "py-6"}`}
    >
      <ActivityIndicator color="#2F80ED" />
      {label ? <Text className="text-sm text-slate-500">{label}</Text> : null}
    </View>
  );
}

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <View className="my-4 rounded-xl border border-red-200 bg-red-50 p-3">
      <Text accessibilityRole="alert" className="text-sm text-red-700">
        {message}
      </Text>
      {onRetry ? (
        <Pressable accessibilityRole="button" onPress={onRetry} className="mt-2 self-start">
          <Text className="text-sm font-bold text-blue-600">Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SuccessBanner({ message, onClose }: SuccessBannerProps) {
  return (
    <View
      accessibilityRole="alert"
      className="mb-4 flex-row items-center rounded-lg border border-green-300 bg-green-50 px-3 py-3"
    >
      <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
      <Text className="ml-2 flex-1 text-sm text-green-700">{message}</Text>
      <Pressable onPress={onClose} hitSlop={8} accessibilityLabel="Fechar">
        <Ionicons name="close" size={16} color="#16a34a" />
      </Pressable>
    </View>
  );
}
