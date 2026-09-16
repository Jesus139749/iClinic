import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import { lightenColor } from "../../../../utils/color";

export interface DashboardCardProps {
    icon: ComponentProps<typeof Ionicons>["name"];
    badgeText: string;
    number: number;
    text: string;
    color: string;
}

export const DashboardCard = ({ icon, badgeText, number, text, color }: DashboardCardProps) => {
    const iconBackgroundColor = lightenColor(color, 0.8);

    return (
        <View className="w-[46%] rounded-[26px] border border-slate-200 bg-slate-100 p-4">
            <View className="mb-4 flex-row items-center justify-between">
                <View
                    style={{ backgroundColor: iconBackgroundColor }}
                    className="h-14 w-14 items-center justify-center rounded-2xl"
                >
                    <Ionicons name={icon} size={24} color={color} />
                </View>

                <Text style={{ color }} className="text-base font-bold">
                    {badgeText}
                </Text>
            </View>

            <Text className="text-[2.2rem] font-bold leading-none text-black">{number}</Text>
            <Text className="mt-2 text-base leading-5 text-slate-700">{text}</Text>
        </View>
    );
};