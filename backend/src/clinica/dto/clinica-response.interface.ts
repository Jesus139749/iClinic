export interface ClinicaResponse {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  cnpj: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
}
