import { File } from "expo-file-system";
import { Platform } from "react-native";
import { getAuthToken } from "./authTokenStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ImageFile {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
}

function getErrorMessage(payload: unknown, status: number, auth: boolean): string {
  const message =
    payload && typeof payload === "object" && "message" in payload
      ? payload.message
      : undefined;

  if (status === 401 && message === "Senha atual incorreta") {
    return "A senha atual informada está incorreta.";
  }
  // Em rotas públicas (login) o 401 é credencial inválida, não sessão expirada.
  if (status === 401 && auth) {
    return "Sua sessão expirou. Volte à tela de login e entre novamente.";
  }
  if (status === 409 && auth) {
    return "Este e-mail já está sendo utilizado por outra conta.";
  }
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.join("\n");
  if (status === 400) return "Confira os dados informados e tente novamente.";
  if (status === 403) return "O acesso não está permitido para esta conta.";
  return "Não foi possível concluir a solicitação. Tente novamente.";
}

export async function request(
  method: Method,
  path: string,
  body?: object | FormData,
  { auth = true } = {},
): Promise<unknown> {
  if (!API_URL) {
    throw new Error("A variável EXPO_PUBLIC_API_URL não está configurada.");
  }

  const headers: Record<string, string> = {};

  if (auth) {
    const token = await getAuthToken();
    if (!token) {
      throw new ApiError(
        "Sua sessão não foi encontrada. Volte à tela de login e entre novamente.",
        401,
      );
    }
    headers.Authorization = `Bearer ${token}`;
  }

  // Em multipart o fetch define o Content-Type com o boundary.
  const isFormData = body instanceof FormData;
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const payload: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(payload, response.status, auth), response.status);
  }

  return payload;
}

/** Monta o FormData com o campo `image` esperado pela API. */
export async function imageFormData(image: ImageFile, defaultName: string): Promise<FormData> {
  const extension = (image.mimeType ?? "image/jpeg").split("/")[1] ?? "jpg";
  const fileName = image.fileName ?? `${defaultName}.${extension}`;
  const formData = new FormData();

  if (Platform.OS === "web") {
    // No web o FormData exige um Blob.
    formData.append("image", await (await fetch(image.uri)).blob(), fileName);
  } else {
    // O fetch do Expo só aceita Blob/File no FormData, não { uri, name, type }.
    formData.append("image", new File(image.uri), fileName);
  }

  return formData;
}

export function getRequestErrorMessage(error: unknown): string {
  if (error instanceof Error && !(error instanceof TypeError)) {
    return error.message;
  }
  return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
}
