import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import MaskInput from "react-native-mask-input";
import type { ProfileFieldProps } from "./interfaces/ProfileFieldProps";

/** Linha de perfil: ícone + rótulo + valor (ou campo editável). */
export function ProfileField({
  label,
  value,
  icon,
  editing = false,
  mask,
  onChangeText,
  last = false,
  ...inputProps
}: ProfileFieldProps) {
  return (
    <View className={`flex-row items-center py-3 ${last ? "" : "border-b border-slate-100"}`}>
      {icon ? <Ionicons name={icon} size={20} color="#2F80ED" /> : null}
      <View className={`flex-1 ${icon ? "ml-3" : ""}`}>
        <Text className="mb-1 text-xs text-slate-400">{label}</Text>
        {editing ? (
          <MaskInput
            {...inputProps}
            value={value}
            mask={mask}
            onChangeText={(_masked, unmasked) => onChangeText?.(unmasked)}
            placeholderTextColor="#94A3B8"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
          />
        ) : (
          <Text className="text-sm font-medium text-slate-800">
            {inputProps.secureTextEntry ? "••••••••" : value || "—"}
          </Text>
        )}
      </View>
    </View>
  );
}
