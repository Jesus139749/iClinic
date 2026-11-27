import type { TextInputProps } from "react-native";
import type { Mask } from "react-native-mask-input";
import type { IconName } from "./IconName";

export interface ProfileFieldProps
  extends Pick<
    TextInputProps,
    "placeholder" | "keyboardType" | "autoCapitalize" | "secureTextEntry" | "maxLength"
  > {
  label: string;
  value: string;
  icon?: IconName;
  /** Sem `editing`, mostra o valor como texto. */
  editing?: boolean;
  mask?: Mask;
  /** Recebe o valor sem máscara. */
  onChangeText?: (value: string) => void;
  last?: boolean;
}
