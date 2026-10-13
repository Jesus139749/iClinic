import { Text, TextInput, TextInputProps, View } from "react-native"
import MaskInput, { Mask } from "react-native-mask-input";

interface InputProps extends Omit<TextInputProps, "onChangeText"> {
    label?: string;
    subText?: string;
    errors?: string[];
    mask?: Mask;

    onChangeText?: (masked: string, unmasked: string) => void;
}

export const TextInputStyled = (props: InputProps) => {
    return (
        <View>
            <Text className="mb-2 text-sm font-semibold text-gray-600 mt-4">
                {props.label}
            </Text>

            <MaskInput
                {...props}
                mask={props.mask}
                className="rounded-xl border border-gray-200 bg-white px-4 text-base"
                placeholderTextColor="#A0A8B4"
            />

            {props.subText && (
                <Text className="mt-1 mb-3 text-sm font-semibold text-gray-400">
                    {props.subText}
                </Text>
            )}

            {props.errors?.map(error => (
                <Text key={error} className="text-sm text-red-400">
                    {error}
                </Text>
            ))}
        </View>
    )
}