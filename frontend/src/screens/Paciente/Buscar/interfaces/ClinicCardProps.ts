import type { ClinicListItem } from "../../../../services/clinicSearchService";

export interface ClinicCardProps {
  clinic: ClinicListItem;
  onPress: () => void;
}
