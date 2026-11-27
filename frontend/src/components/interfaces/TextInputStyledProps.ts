import type { TextInputProps } from "react-native";
import type { Mask } from "react-native-mask-input";

export interface TextInputStyledProps extends Omit<TextInputProps, "onChangeText"> {
  label?: string;
  subText?: string;
  error?: string;
  mask?: Mask;
  /** Recebe o valor sem máscara (só dígitos quando há máscara). */
  onChangeText?: (value: string) => void;
}
