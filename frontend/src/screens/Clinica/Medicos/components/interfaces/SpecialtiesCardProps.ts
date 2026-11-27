import type { SpecialtyWithCount } from "../../../../../services/doctorService";

export interface SpecialtiesCardProps {
  specialties: SpecialtyWithCount[];
  onAdd: (name: string) => Promise<boolean>;
  onRemove: (specialty: SpecialtyWithCount) => void;
}
