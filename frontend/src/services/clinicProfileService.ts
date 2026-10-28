import { File } from "expo-file-system";
import { Platform } from "react-native";
import { request } from "./apiClient";
import { ChangePatientPassword, ProfileImageFile } from "./profileService";

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

export async function updateMyClinicImage(
  image: ProfileImageFile,
): Promise<ClinicProfile> {
  const mimeType = image.mimeType ?? "image/jpeg";
  const extension = mimeType.split("/")[1] ?? "jpg";
  const fileName = image.fileName ?? `perfil.${extension}`;
  const formData = new FormData();

  if (Platform.OS === "web") {
    // No web o FormData exige um Blob.
    formData.append("image", await (await fetch(image.uri)).blob(), fileName);
  } else {
    formData.append("image", new File(image.uri), fileName);
  }

  return requestProfile("PUT", "/clinica/me/image", formData);
}

export async function changeMyClinicPassword(
  password: ChangePatientPassword,
): Promise<void> {
  await request("PUT", "/clinica/me/password", password);
}
