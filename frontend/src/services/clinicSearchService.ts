import { request } from "./apiClient";

export interface ClinicListItem {
  id: number;
  name: string;
  image: string | null;
  address: string;
  specialties: string[];
}

export interface ClinicDoctor {
  id: number;
  name: string;
  image: string | null;
  specialties: string[];
}

export interface ClinicDetail extends ClinicListItem {
  phone: string | null;
  doctors: ClinicDoctor[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isClinicListItem(value: unknown): value is ClinicListItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    isNullableString(item.image) &&
    typeof item.address === "string" &&
    isStringArray(item.specialties)
  );
}

function isClinicDoctor(value: unknown): value is ClinicDoctor {
  if (!value || typeof value !== "object") {
    return false;
  }

  const doctor = value as Record<string, unknown>;
  return (
    typeof doctor.id === "number" &&
    typeof doctor.name === "string" &&
    isNullableString(doctor.image) &&
    isStringArray(doctor.specialties)
  );
}

function isClinicDetail(value: unknown): value is ClinicDetail {
  if (!isClinicListItem(value)) {
    return false;
  }

  const clinic = value as unknown as Record<string, unknown>;
  return (
    isNullableString(clinic.phone) &&
    Array.isArray(clinic.doctors) &&
    clinic.doctors.every(isClinicDoctor)
  );
}

export async function listClinics(search?: string): Promise<ClinicListItem[]> {
  const term = search?.trim();
  const query = term ? `?search=${encodeURIComponent(term)}` : "";
  const payload = await request("GET", `/clinica${query}`);

  if (!Array.isArray(payload) || !payload.every(isClinicListItem)) {
    throw new Error("O servidor retornou a lista de clínicas inválida.");
  }

  return payload;
}

export async function getClinic(id: number): Promise<ClinicDetail> {
  const payload = await request("GET", `/clinica/${id}`);

  if (!isClinicDetail(payload)) {
    throw new Error("O servidor retornou dados de clínica inválidos.");
  }

  return payload;
}
