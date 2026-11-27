import type { SpecialtyStyle } from "./SpecialtyStyle";

/** Estilo aplicado quando o nome da especialidade contém algum dos termos. */
export interface SpecialtyStyleRule extends SpecialtyStyle {
  terms: string[];
}
