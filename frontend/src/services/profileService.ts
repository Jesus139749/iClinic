import { getAuthToken } from "./authTokenStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");

export interface PatientProfile {
  name: string;
  email: string;
  phone: string | null;
}

export interface UpdatePatientProfile {
  name: string;
  email: string;
  phone: string | null;
}

export interface ChangePatientPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class ProfileApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ProfileApiError";
  }
}

function getErrorMessage(payload: unknown, status: number): string {
  if (status === 401) {
    return "Sua sessão expirou. Volte à tela de login e entre novamente.";
  }

  if (status === 409) {
    return "Este e-mail já está sendo utilizado por outra conta.";
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    Array.isArray(payload.message)
  ) {
    return payload.message.join("\n");
  }

  if (status === 400) {
    return "Confira os dados informados e tente novamente.";
  }

  if (status === 403) {
    return "O acesso ao perfil não está permitido para esta conta.";
  }

  return "Não foi possível concluir a solicitação. Tente novamente.";
}

function isPatientProfile(value: unknown): value is PatientProfile {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    "name" in value &&
    typeof value.name === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "phone" in value &&
    (typeof value.phone === "string" || value.phone === null)
  );
}

async function requestProfile(
  method: "GET" | "PATCH",
  body?: UpdatePatientProfile,
): Promise<PatientProfile> {
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

  const response = await fetch(`${API_URL}/paciente/me`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    if (response.ok) {
      throw new Error("O servidor retornou uma resposta inválida.");
    }
  }

  if (!response.ok) {
    throw new ProfileApiError(
      getErrorMessage(payload, response.status),
      response.status,
    );
  }

  if (!isPatientProfile(payload)) {
    throw new Error("O servidor retornou dados de perfil inválidos.");
  }

  return payload;
}

export function getMyProfile(): Promise<PatientProfile> {
  return requestProfile("GET");
}

export function updateMyProfile(
  profile: UpdatePatientProfile,
): Promise<PatientProfile> {
  return requestProfile("PATCH", profile);
}

export async function changeMyPassword(
  password: ChangePatientPassword,
): Promise<void> {
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

  const response = await fetch(`${API_URL}/paciente/me/password`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(password),
  });

  let payload: unknown;
  if (!response.ok) {
    try {
      payload = await response.json();
    } catch {
      payload = undefined;
    }

    const message =
      response.status === 401 &&
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      payload.message === "Senha atual incorreta"
        ? "A senha atual informada está incorreta."
        : getErrorMessage(payload, response.status);

    throw new ProfileApiError(message, response.status);
  }
}
