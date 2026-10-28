export interface EspecialidadeResponse {
  id: number;
  name: string;
}

export interface EspecialidadeComContagemResponse extends EspecialidadeResponse {
  doctorsCount: number;
}

export interface MedicoResponse {
  id: number;
  name: string;
  crm: string;
  phone: string | null;
  image: string | null;
  active: boolean;
  specialties: EspecialidadeResponse[];
}
