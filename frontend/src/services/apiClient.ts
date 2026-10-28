import { getAuthToken } from "./authTokenStorage";
import { getErrorMessage, ProfileApiError } from "./profileService";

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export async function request(
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
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

export function getRequestErrorMessage(error: unknown): string {
  if (error instanceof ProfileApiError) {
    return error.message;
  }

  if (error instanceof Error && !(error instanceof TypeError)) {
    return error.message;
  }

  return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
}
