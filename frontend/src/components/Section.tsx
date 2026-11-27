import { Text, View } from "react-native";
import type { SectionProps } from "./interfaces/SectionProps";

export function Section({ title, children }: SectionProps) {
  return (
    <View className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 pb-2 pt-4">
      {title ? <Text className="mb-2 text-base font-bold text-slate-800">{title}</Text> : null}
      {children}
    </View>
  );
}
