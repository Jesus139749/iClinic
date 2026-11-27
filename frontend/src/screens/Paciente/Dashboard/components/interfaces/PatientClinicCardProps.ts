export interface PatientClinicCardProps {
  name: string;
  imageUrl: string;
  distanceKm: number;
  hours: string;
  rating: number;
  specialties: string[];
  nextAvailable: string;
  actionLabel: "Ver Detalhes" | "Agendar";
}
