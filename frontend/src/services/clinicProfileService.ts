import { imageFormData, request, type ImageFile } from "./apiClient";
import type { ChangePassword } from "./profileService";

export interface ClinicProfile {
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

export type UpdateClinicProfile = Omit<ClinicProfile, "image" | "cnpj">;

function isClinicProfile(value: unknown): value is ClinicProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const profile = value as Record<string, unknown>;
  const isString = (key: string) => typeof profile[key] === "string";
  const isNullableString = (key: string) =>
    typeof profile[key] === "string" || profile[key] === null;

  return (
    ["name", "email", "cnpj", "street", "number", "neighborhood", "city", "state", "postalCode"].every(isString) &&
    ["phone", "image", "complement"].every(isNullableString)
  );
}

async function requestProfile(
  method: "GET" | "PATCH" | "PUT",
  path: string,
  body?: object | FormData,
): Promise<ClinicProfile> {
  const payload = await request(method, path, body);

  if (!isClinicProfile(payload)) {
    throw new Error("O servidor retornou dados de perfil inválidos.");
  }

  return payload;
}

export function getMyClinicProfile(): Promise<ClinicProfile> {
  return requestProfile("GET", "/clinica/me");
}

export function updateMyClinicProfile(
  profile: UpdateClinicProfile,
): Promise<ClinicProfile> {
  return requestProfile("PATCH", "/clinica/me", profile);
}

export async function updateMyClinicImage(image: ImageFile): Promise<ClinicProfile> {
  return requestProfile("PUT", "/clinica/me/image", await imageFormData(image, "perfil"));
}

export async function changeMyClinicPassword(password: ChangePassword): Promise<void> {
  await request("PUT", "/clinica/me/password", password);
}
