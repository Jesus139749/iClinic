import { File } from "expo-file-system";
import { Platform } from "react-native";
import { getAuthToken } from "./authTokenStorage";
import {
  ChangePatientPassword,
  getErrorMessage,
  ProfileApiError,
  ProfileImageFile,
} from "./profileService";

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

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

async function request(
  method: "GET" | "PATCH" | "PUT",
  path: string,
  body?: object | FormData,
): Promise<unknown> {
  if (!API_URL) {
    throw new Error("A variável EXPO_PUBLIC_API_URL não está configurada.");
  }

  const token = await getAuthToken();
  if (!token) {
    throw new ProfileApiError(
      "Sua sessão não foi encontrada. Volte à tela de login e entre novamente.",
      401,
    );
  }

  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      // Em multipart o fetch define o Content-Type com o boundary.
      ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok) {
    const isWrongPassword =
      response.status === 401 &&
      path.endsWith("/password") &&
      !!payload &&
      typeof payload === "object" &&
      "message" in payload &&
      payload.message === "Senha atual incorreta";

    throw new ProfileApiError(
      isWrongPassword
        ? "A senha atual informada está incorreta."
        : getErrorMessage(payload, response.status),
      response.status,
    );
  }

  return payload;
}

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
