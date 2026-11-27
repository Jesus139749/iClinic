import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import type { PatientQuickActionProps } from "./interfaces/PatientQuickActionProps";

export function PatientQuickAction({ icon, label, color = "#2563eb", onPress }: PatientQuickActionProps) {
  return (
    <Pressable
      className="flex-1 items-center rounded-2xl border border-slate-200 bg-slate-100 py-4"
      onPress={onPress}
    >
      <View className="mb-2 h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-center text-xs font-semibold text-slate-700">{label}</Text>
    </Pressable>
  );
}
