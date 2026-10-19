import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskInput, { Masks } from "react-native-mask-input";
import {
  changeMyPassword,
  getMyProfile,
  ProfileApiError,
  updateMyProfile,
  updateMyProfileImage,
} from "../../../services/profileService";

type IconName = ComponentProps<typeof Ionicons>["name"];

function getProfileErrorMessage(error: unknown): string {
  if (error instanceof ProfileApiError) {
    return error.message;
  }

  if (error instanceof Error && !(error instanceof TypeError)) {
    return error.message;
  }

  return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
}

function PerfilSecao({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <View className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 pb-3 pt-4">
      <Text className="mb-1 text-sm font-bold text-slate-800">{titulo}</Text>
      {children}
    </View>
  );
}

interface CampoPerfilProps {
  icon: IconName;
  label: string;
  value: string;
  editing?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words";
  secureTextEntry?: boolean;
  mask?: typeof Masks.BRL_PHONE;
  onChangeText?: (value: string) => void;
  ultimo?: boolean;
}

function CampoPerfil({
  icon,
  label,
  value,
  editing = false,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry,
  mask,
  onChangeText,
  ultimo,
}: CampoPerfilProps) {
  return (
    <View
      className={`flex-row items-center py-2 ${ultimo ? "" : "border-b border-slate-100"}`}
    >
      <Ionicons name={icon} size={20} color="#2563eb" />
      <View className="ml-3 flex-1">
        <Text className="mb-1 text-xs text-slate-400">{label}</Text>
        {editing ? (
          mask ? (
            <MaskInput
              value={value}
              onChangeText={(_masked, unmasked) => onChangeText?.(unmasked)}
              mask={mask}
              placeholder={placeholder}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#94A3B8"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            />
          ) : (
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#94A3B8"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            />
          )
        ) : (
          <Text className="text-sm font-medium text-slate-800">
            {secureTextEntry ? "••••••••" : value}
          </Text>
        )}
      </View>
      {!editing && (
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      )}
    </View>
  );
}

export default function PerfilPacienteScreen() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const isChangingPasswordRef = useRef(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const isUploadingPhotoRef = useRef(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadProfile() {
      setIsLoading(true);
      setLoadError("");

      try {
        const profile = await getMyProfile();
        if (!isCurrent) return;
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone ?? "");
        setProfilePhotoUri(profile.image);
      } catch (error) {
        if (!isCurrent) return;
        setLoadError(getProfileErrorMessage(error));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadProfile();
    return () => {
      isCurrent = false;
    };
  }, [loadAttempt]);

  async function handleSaveProfile() {
    if (isSaving || isLoading) return;
    setIsSaving(true);

    try {
      const updatedProfile = await updateMyProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
      });
      setName(updatedProfile.name);
      setEmail(updatedProfile.email);
      setPhone(updatedProfile.phone ?? "");
      setEditing(false);
      Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.");
    } catch (error) {
      Alert.alert(
        "Não foi possível salvar o perfil",
        getProfileErrorMessage(error),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordChange() {
    if (isChangingPasswordRef.current) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Campos obrigatórios", "Preencha os três campos de senha.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Senhas diferentes",
        "A nova senha e a confirmação não coincidem.",
      );
      return;
    }

    isChangingPasswordRef.current = true;
    setIsChangingPassword(true);
    try {
      await changeMyPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Senha atualizada", "Sua senha foi alterada com sucesso.");
    } catch (error) {
      Alert.alert(
        "Não foi possível alterar a senha",
        getProfileErrorMessage(error),
      );
    } finally {
      isChangingPasswordRef.current = false;
      setIsChangingPassword(false);
    }
  }

  async function uploadProfilePhoto(photo: ImagePicker.ImagePickerAsset) {
    if (isUploadingPhotoRef.current) return;

    const previousPhotoUri = profilePhotoUri;
    isUploadingPhotoRef.current = true;
    setIsUploadingPhoto(true);
    setProfilePhotoUri(photo.uri);

    try {
      const updatedProfile = await updateMyProfileImage({
        uri: photo.uri,
        mimeType: photo.mimeType,
        fileName: photo.fileName,
      });
      setProfilePhotoUri(updatedProfile.image);
    } catch (error) {
      setProfilePhotoUri(previousPhotoUri);
      Alert.alert(
        "Não foi possível enviar a foto",
        getProfileErrorMessage(error),
      );
    } finally {
      isUploadingPhotoRef.current = false;
      setIsUploadingPhoto(false);
    }
  }

  async function selectProfilePhoto(source: "camera" | "gallery") {
    try {
      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          source === "camera"
            ? "Permita o acesso à câmera para tirar uma foto."
            : "Permita o acesso às fotos para escolher uma imagem.",
        );
        return;
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

      const selectedPhoto = result.canceled ? undefined : result.assets[0];
      if (selectedPhoto) {
        await uploadProfilePhoto(selectedPhoto);
      }
    } catch (error) {
      Alert.alert(
        "Não foi possível selecionar a foto",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    }
  }

  function showPhotoOptions() {
    if (isUploadingPhotoRef.current) return;

    Alert.alert("Foto de perfil", "Escolha uma opção", [
      {
        text: "Tirar foto",
        onPress: () => void selectProfilePhoto("camera"),
      },
      {
        text: "Escolher da galeria",
        onPress: () => void selectProfilePhoto("gallery"),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View
            accessibilityLiveRegion="polite"
            className="mb-3 flex-row items-center justify-center gap-2"
          >
            <ActivityIndicator color="#2563EB" />
            <Text className="text-sm text-slate-500">Carregando perfil...</Text>
          </View>
        ) : null}

        {loadError ? (
          <View className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text accessibilityRole="alert" className="text-sm text-red-700">
              {loadError}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setLoadAttempt((attempt) => attempt + 1)}
              className="mt-2 self-start"
            >
              <Text className="text-sm font-bold text-blue-600">
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View className="mb-5 mt-4 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4">
          <View className="relative">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              {profilePhotoUri ? (
                <Image
                  source={{ uri: profilePhotoUri }}
                  className="h-20 w-20 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={38} color="#2F80ED" />
              )}
              {isUploadingPhoto ? (
                <View className="absolute h-20 w-20 items-center justify-center rounded-full bg-black/40">
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Adicionar ou trocar foto de perfil"
              disabled={isUploadingPhoto}
              onPress={showPhotoOptions}
              className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#2F80ED]"
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </Pressable>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-slate-800">
              {name || "Perfil do paciente"}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">{email}</Text>
            <Pressable
              accessibilityRole="button"
              disabled={isUploadingPhoto}
              onPress={showPhotoOptions}
              className="mt-2 flex-row items-center self-start"
            >
              <Ionicons name="camera-outline" size={16} color="#2563EB" />
              <Text className="ml-1 text-sm font-semibold text-blue-600">
                {isUploadingPhoto
                  ? "Enviando..."
                  : profilePhotoUri
                    ? "Trocar foto"
                    : "Adicionar foto"}
              </Text>
            </Pressable>
          </View>
        </View>

        <PerfilSecao titulo="Dados do cadastro">
          <CampoPerfil
            icon="person-outline"
            label="Nome completo"
            value={name}
            editing={editing}
            placeholder="Ex: João da Silva"
            autoCapitalize="words"
            onChangeText={setName}
          />
          <CampoPerfil
            icon="mail-outline"
            label="E-mail"
            value={email}
            editing={editing}
            placeholder="seuemail@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <CampoPerfil
            icon="call-outline"
            label="Telefone"
            value={phone}
            editing={editing}
            placeholder="(DD) XXXX-XXXX"
            keyboardType="phone-pad"
            autoCapitalize="none"
            mask={Masks.BRL_PHONE}
            onChangeText={setPhone}
            ultimo
          />
        </PerfilSecao>

        <Pressable
          accessibilityRole="button"
          onPress={editing ? handleSaveProfile : () => setEditing(true)}
          disabled={isLoading || isSaving || Boolean(loadError)}
          accessibilityState={{
            disabled: isLoading || isSaving || Boolean(loadError),
            busy: isSaving,
          }}
          className="mb-4 h-12 items-center justify-center rounded-xl bg-[#2F80ED]"
        >
          {isSaving ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color="#FFFFFF" />
              <Text className="text-base font-bold text-white">
                Salvando...
              </Text>
            </View>
          ) : (
            <Text className="text-base font-bold text-white">
              {editing ? "Salvar alterações" : "Editar perfil"}
            </Text>
          )}
        </Pressable>

        <PerfilSecao titulo="Alterar senha">
          <Text className="mb-2 text-xs text-slate-500">
            Sua senha atual será verificada antes de salvar.
          </Text>
          <CampoPerfil
            icon="lock-closed-outline"
            label="Senha atual"
            value={currentPassword}
            editing
            placeholder="Digite sua senha atual"
            autoCapitalize="none"
            secureTextEntry
            onChangeText={setCurrentPassword}
          />
          <CampoPerfil
            icon="key-outline"
            label="Nova senha"
            value={newPassword}
            editing
            placeholder="Digite a nova senha"
            autoCapitalize="none"
            secureTextEntry
            onChangeText={setNewPassword}
          />
          <CampoPerfil
            icon="checkmark-circle-outline"
            label="Confirmar nova senha"
            value={confirmPassword}
            editing
            placeholder="Repita a nova senha"
            autoCapitalize="none"
            secureTextEntry
            onChangeText={setConfirmPassword}
            ultimo
          />
          <Pressable
            accessibilityRole="button"
            onPress={handlePasswordChange}
            disabled={isChangingPassword}
            accessibilityState={{
              disabled: isChangingPassword,
              busy: isChangingPassword,
            }}
            className="mt-3 h-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50"
          >
            {isChangingPassword ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#2563EB" />
                <Text className="text-sm font-bold text-blue-600">
                  Alterando...
                </Text>
              </View>
            ) : (
              <Text className="text-sm font-bold text-blue-600">
                Salvar nova senha
              </Text>
            )}
          </Pressable>
        </PerfilSecao>
      </ScrollView>
    </SafeAreaView>
  );
}
