import { Text, TextInput, TextInputProps, View } from "react-native"

interface InputProps extends TextInputProps {
    label?: string;
    subText?: string;
    error?: string[];
}

export const TextInputStyled = (props: InputProps) => {
    return (
        <View>
            <Text className="mb-2 text-sm font-semibold text-gray-600 mt-4">
                {props.label}
            </Text>

            <TextInput
                className="rounded-xl border border-gray-200 bg-white px-4 text-base"
                placeholderTextColor="#A0A8B4"
                {...props}
            />

            {props.subText && (
                <Text className="mt-1 mb-3 text-sm font-semibold text-gray-400">
                    {props.subText}
                </Text>
            )}

            {props.error?.map(error => (
                <Text className="text-sm text-red-400">
                    {error}
                </Text>
            ))}
        </View>
    )
}