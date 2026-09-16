import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Text, View } from "react-native";
import { lightenColor } from "../../../../utils/color";

interface DashboardShortcutCardProps {
    icon: ComponentProps<typeof Ionicons>["name"];
    title: string;
    text: string;
    color?: string;
}

export const DashboardShortcutCard = ({ icon, title, text, color = "#2563eb" }: DashboardShortcutCardProps) => {
    const iconBackgroundColor = lightenColor(color, 0.8);

    return (
        <View className="mb-3 flex-row items-center justify-between rounded-[22px] border border-slate-200 bg-slate-100 p-4">
            <View className="flex-row items-center">
                <View
                    style={{ backgroundColor: iconBackgroundColor }}
                    className="mr-3 h-14 w-14 items-center justify-center rounded-2xl"
                >
                    <Ionicons name={icon} size={24} color={color} />
                </View>
            </View>

            <View className="mr-3 flex-1">
                <Text className="text-base font-bold text-slate-800">{title}</Text>
                <Text className="text-sm font-medium text-gray-600">{text}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} />
        </View>
    );
};