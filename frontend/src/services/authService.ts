import { request } from "./apiClient";

export type Role = "PACIENTE" | "CLINICA";

export interface PatientSignUp {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface ClinicSignUp extends PatientSignUp {
  cnpj: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
}

export async function login(email: string, password: string) {
  return (await request("POST", "/login", { email, password }, { auth: false })) as {
    token: string;
    role: Role;
  };
}

export async function signUpPatient(data: PatientSignUp): Promise<void> {
  await request("POST", "/paciente", data, { auth: false });
}

export async function signUpClinic(data: ClinicSignUp): Promise<void> {
  await request("POST", "/clinica", data, { auth: false });
}
