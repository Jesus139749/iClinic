import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { lightenColor } from "../../../../utils/color";
import type { DashboardShortcutCardProps } from "./interfaces/DashboardShortcutCardProps";

export function DashboardShortcutCard({ icon, title, text, color = "#2563eb", navigationScreen }: DashboardShortcutCardProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate(navigationScreen as never)}
      className="mb-3 flex-row items-center justify-between rounded-[22px] border border-slate-200 bg-slate-100 p-4"
    >
      <View
        style={{ backgroundColor: lightenColor(color) }}
        className="mr-3 h-14 w-14 items-center justify-center rounded-2xl"
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>

      <View className="mr-3 flex-1">
        <Text className="text-base font-bold text-slate-800">{title}</Text>
        <Text className="text-sm font-medium text-gray-600">{text}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} />
    </Pressable>
  );
}
