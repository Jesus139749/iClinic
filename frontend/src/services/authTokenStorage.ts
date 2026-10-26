import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const AUTH_TOKEN_KEY = "iclinic.authToken";
let webSessionToken: string | null = null;

export async function saveAuthToken(token: string): Promise<void> {

  if (!(await SecureStore.isAvailableAsync())) {
    if (Platform.OS === "web") {
      webSessionToken = token;
      return;
    }

    throw new Error(
      "O armazenamento seguro não está disponível neste dispositivo.",
    );
  }

  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  webSessionToken = null;

  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (!(await SecureStore.isAvailableAsync())) {
    if (Platform.OS === "web") {
      return webSessionToken;
    }

    throw new Error(
      "O armazenamento seguro não está disponível neste dispositivo.",
    );
  }

  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}
