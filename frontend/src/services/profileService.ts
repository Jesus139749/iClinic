import { imageFormData, request, type ImageFile } from "./apiClient";

export interface PatientProfile {
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
}

export type UpdatePatientProfile = Omit<PatientProfile, "image">;

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function isPatientProfile(value: unknown): value is PatientProfile {
  if (!value || typeof value !== "object") return false;

  const profile = value as Record<string, unknown>;
  return (
    typeof profile.name === "string" &&
    typeof profile.email === "string" &&
    (typeof profile.phone === "string" || profile.phone === null) &&
    (typeof profile.image === "string" || profile.image === null)
  );
}

async function requestProfile(
  method: "GET" | "PATCH" | "PUT",
  path: string,
  body?: object | FormData,
): Promise<PatientProfile> {
  const payload = await request(method, path, body);

  if (!isPatientProfile(payload)) {
    throw new Error("O servidor retornou dados de perfil inválidos.");
  }

  return payload;
}

export function getMyProfile(): Promise<PatientProfile> {
  return requestProfile("GET", "/paciente/me");
}

export function updateMyProfile(profile: UpdatePatientProfile): Promise<PatientProfile> {
  return requestProfile("PATCH", "/paciente/me", profile);
}

export async function updateMyProfileImage(image: ImageFile): Promise<PatientProfile> {
  return requestProfile("PUT", "/paciente/me/image", await imageFormData(image, "perfil"));
}

export async function changeMyPassword(password: ChangePassword): Promise<void> {
  await request("PUT", "/paciente/me/password", password);
}
