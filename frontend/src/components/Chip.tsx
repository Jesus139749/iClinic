import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import type { ChipProps } from "./interfaces/ChipProps";

export function Chip({ label, selected, onPress, check = false, rounded = false }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityState={{ selected }}
      className={`mb-2 mr-2 flex-row items-center border px-3 py-2 ${rounded ? "rounded-full" : "rounded-lg"} ${
        selected ? "border-[#2F80ED] bg-[#2F80ED]" : "border-slate-200 bg-white"
      }`}
    >
      {check && selected ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
      <Text
        className={`text-xs font-bold ${selected ? "text-white" : "text-slate-600"} ${
          check && selected ? "ml-1" : ""
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
