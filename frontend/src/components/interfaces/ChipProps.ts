export interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Mostra um ✓ quando selecionado (seleção múltipla). */
  check?: boolean;
  rounded?: boolean;
}
