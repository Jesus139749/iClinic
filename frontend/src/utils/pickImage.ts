import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export type Photo = ImagePicker.ImagePickerAsset;

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ["images"],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

async function openPicker(source: "camera" | "gallery"): Promise<Photo | null> {
  try {
    const isCamera = source === "camera";
    const permission = isCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        isCamera
          ? "Permita o acesso à câmera para tirar uma foto."
          : "Permita o acesso às fotos para escolher uma imagem.",
      );
      return null;
    }

    const result = isCamera
      ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
      : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);

    return result.canceled ? null : result.assets[0];
  } catch (error) {
    Alert.alert(
      "Não foi possível selecionar a foto",
      error instanceof Error ? error.message : "Tente novamente.",
    );
    return null;
  }
}

/** Pergunta se o usuário quer tirar ou escolher uma foto e devolve a imagem (ou null). */
export function pickPhoto(title: string): Promise<Photo | null> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      "Escolha uma opção",
      [
        { text: "Tirar foto", onPress: () => resolve(openPicker("camera")) },
        { text: "Escolher da galeria", onPress: () => resolve(openPicker("gallery")) },
        { text: "Cancelar", style: "cancel", onPress: () => resolve(null) },
      ],
      { onDismiss: () => resolve(null) },
    );
  });
}
