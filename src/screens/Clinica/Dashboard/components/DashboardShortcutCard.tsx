import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { lightenColor } from "../../../../utils/color";
import { useNavigation } from "@react-navigation/native";

interface DashboardShortcutCardProps {
    icon: ComponentProps<typeof Ionicons>["name"];
    title: string;
    text: string;
    color?: string;
    navigationScreen?: string;
}

export const DashboardShortcutCard = ({ icon, title, text, color = "#2563eb", navigationScreen }: DashboardShortcutCardProps) => {
    const iconBackgroundColor = lightenColor(color, 0.8);
    const navigation = useNavigation();

    return (
        <Pressable onPress={() => {navigation.navigate(navigationScreen as never)}} className="mb-3 flex-row items-center justify-between rounded-[22px] border border-slate-200 bg-slate-100 p-4">
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
        </Pressable>
    );
};