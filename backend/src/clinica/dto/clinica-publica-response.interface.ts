export interface ClinicaListItem {
  id: number;
  name: string;
  image: string | null;
  address: string;
  specialties: string[];
}

export interface ClinicaMedicoPublico {
  id: number;
  name: string;
  image: string | null;
  specialties: string[];
}

export interface ClinicaDetalhe extends ClinicaListItem {
  phone: string | null;
  doctors: ClinicaMedicoPublico[];
}
