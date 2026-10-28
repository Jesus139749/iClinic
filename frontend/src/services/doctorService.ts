import { File } from "expo-file-system";
import { Platform } from "react-native";
import { request } from "./apiClient";
import { ProfileImageFile } from "./profileService";

export interface Specialty {
  id: number;
  name: string;
}

export interface SpecialtyWithCount extends Specialty {
  doctorsCount: number;
}

export interface Doctor {
  id: number;
  name: string;
  crm: string;
  phone: string | null;
  image: string | null;
  active: boolean;
  specialties: Specialty[];
}

export interface DoctorInput {
  name: string;
  crm: string;
  phone?: string;
  specialtyIds: number[];
}

export type UpdateDoctorInput = Partial<DoctorInput> & { active?: boolean };

function isSpecialty(value: unknown): value is Specialty {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return typeof item.id === "number" && typeof item.name === "string";
}

function isSpecialtyWithCount(value: unknown): value is SpecialtyWithCount {
  return (
    isSpecialty(value) &&
    typeof (value as unknown as Record<string, unknown>).doctorsCount ===
      "number"
  );
}

function isDoctor(value: unknown): value is Doctor {
  if (!value || typeof value !== "object") {
    return false;
  }

  const doctor = value as Record<string, unknown>;
  return (
    typeof doctor.id === "number" &&
    typeof doctor.name === "string" &&
    typeof doctor.crm === "string" &&
    (typeof doctor.phone === "string" || doctor.phone === null) &&
    (typeof doctor.image === "string" || doctor.image === null) &&
    typeof doctor.active === "boolean" &&
    Array.isArray(doctor.specialties) &&
    doctor.specialties.every(isSpecialty)
  );
}

async function requestDoctor(
  method: "GET" | "POST" | "PATCH" | "PUT",
  path: string,
  body?: object | FormData,
): Promise<Doctor> {
  const payload = await request(method, path, body);

  if (!isDoctor(payload)) {
    throw new Error("O servidor retornou dados de médico inválidos.");
  }

  return payload;
}

export async function listDoctors(): Promise<Doctor[]> {
  const payload = await request("GET", "/clinica/medicos");

  if (!Array.isArray(payload) || !payload.every(isDoctor)) {
    throw new Error("O servidor retornou a lista de médicos inválida.");
  }

  return payload;
}

export function getDoctor(id: number): Promise<Doctor> {
  return requestDoctor("GET", `/clinica/medicos/${id}`);
}

export function createDoctor(input: DoctorInput): Promise<Doctor> {
  return requestDoctor("POST", "/clinica/medicos", input);
}

export function updateDoctor(
  id: number,
  input: UpdateDoctorInput,
): Promise<Doctor> {
  return requestDoctor("PATCH", `/clinica/medicos/${id}`, input);
}

export async function updateDoctorImage(
  id: number,
  image: ProfileImageFile,
): Promise<Doctor> {
  const mimeType = image.mimeType ?? "image/jpeg";
  const extension = mimeType.split("/")[1] ?? "jpg";
  const fileName = image.fileName ?? `medico.${extension}`;
  const formData = new FormData();

  if (Platform.OS === "web") {
    // No web o FormData exige um Blob.
    formData.append("image", await (await fetch(image.uri)).blob(), fileName);
  } else {
    formData.append("image", new File(image.uri), fileName);
  }

  return requestDoctor("PUT", `/clinica/medicos/${id}/image`, formData);
}

export async function listSpecialties(): Promise<SpecialtyWithCount[]> {
  const payload = await request("GET", "/clinica/especialidades");

  if (!Array.isArray(payload) || !payload.every(isSpecialtyWithCount)) {
    throw new Error("O servidor retornou a lista de especialidades inválida.");
  }

  return payload;
}

export async function createSpecialty(
  name: string,
): Promise<SpecialtyWithCount> {
  const payload = await request("POST", "/clinica/especialidades", { name });

  if (!isSpecialtyWithCount(payload)) {
    throw new Error("O servidor retornou dados de especialidade inválidos.");
  }

  return payload;
}

export async function deleteSpecialty(id: number): Promise<void> {
  await request("DELETE", `/clinica/especialidades/${id}`);
}
