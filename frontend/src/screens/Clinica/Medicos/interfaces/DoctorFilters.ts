import type { DoctorStatus } from "./DoctorStatus";

export interface DoctorFilters {
  search: string;
  status: DoctorStatus;
  specialtyId: number | null;
}
