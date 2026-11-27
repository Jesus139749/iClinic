import { Text, View } from "react-native";
import MaskInput from "react-native-mask-input";
import type { TextInputStyledProps } from "./interfaces/TextInputStyledProps";

export function TextInputStyled({ label, subText, error, mask, onChangeText, ...props }: TextInputStyledProps) {
  return (
    <View>
      <Text className="mb-2 mt-4 text-sm font-semibold text-gray-600">{label}</Text>

      <MaskInput
        {...props}
        mask={mask}
        onChangeText={(_masked, unmasked) => onChangeText?.(unmasked)}
        className="rounded-xl border border-gray-200 bg-white px-4 text-base"
        placeholderTextColor="#A0A8B4"
      />

      {subText ? (
        <Text className="mb-3 mt-1 text-sm font-semibold text-gray-400">{subText}</Text>
      ) : null}

      {error ? <Text className="text-sm text-red-400">{error}</Text> : null}
    </View>
  );
}
