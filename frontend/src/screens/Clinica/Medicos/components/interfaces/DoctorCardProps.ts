import type { Doctor } from "../../../../../services/doctorService";

export interface DoctorCardProps {
  doctor: Doctor;
  isUpdating: boolean;
  onEdit: () => void;
  onReactivate: () => void;
}
