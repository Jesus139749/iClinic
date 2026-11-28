import type { ClinicListItem } from "../../../../../services/clinicSearchService";

export interface PatientClinicCardProps {
  clinic: ClinicListItem;
  onPress: () => void;
}
