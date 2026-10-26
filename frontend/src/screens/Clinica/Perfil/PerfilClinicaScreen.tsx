import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  type NavigationProp,
  type ParamListBase,
} from "@react-navigation/native";
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
import MaskInput, { Masks } from "react-native-mask-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearAuthToken } from "../../../services/authTokenStorage";
import {
  changeMyClinicPassword,
  getMyClinicProfile,
  updateMyClinicImage,
  updateMyClinicProfile,
} from "../../../services/clinicProfileService";
import { ProfileApiError } from "../../../services/profileService";
import { ViaCepResponse } from "../Cadastro/interfaces/ViaCepResponse";

type IconName = ComponentProps<typeof Ionicons>["name"];

function getErrorMessage(error: unknown): string {
  if (error instanceof ProfileApiError) {
    return error.message;
  }

  if (error instanceof Error && !(error instanceof TypeError)) {
    return error.message;
  }

  return "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
}

function formatCnpj(cnpj: string): string {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}

function formatAddress(p: {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}): string {
  const line1 = [p.street, p.number].filter(Boolean).join(", ");
  const line2 = [p.complement, p.neighborhood].filter(Boolean).join(" - ");
  const line3 = [p.city, p.state].filter(Boolean).join(" - ");
  return [line1, line2, line3].filter(Boolean).join(", ");
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 pb-2 pt-4">
      <Text className="mb-2 text-base font-bold text-slate-800">{titulo}</Text>
      {children}
    </View>
  );
}

interface CampoProps {
  icon?: IconName;
  label: string;
  value: string;
  editing?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  maxLength?: number;
  mask?: typeof Masks.BRL_PHONE;
  onChangeText?: (value: string) => void;
  ultimo?: boolean;
}

function Campo({
  icon,
  label,
  value,
  editing = false,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry,
  maxLength,
  mask,
  onChangeText,
  ultimo,
}: CampoProps) {
  const inputClass =
    "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800";

  return (
    <View
      className={`flex-row items-center py-3 ${ultimo ? "" : "border-b border-slate-100"}`}
    >
      {icon ? <Ionicons name={icon} size={20} color="#2F80ED" /> : null}
      <View className={`flex-1 ${icon ? "ml-3" : ""}`}>
        <Text className="mb-1 text-xs text-slate-400">{label}</Text>
        {editing ? (
          mask ? (
            <MaskInput
              value={value}
              onChangeText={(_masked, unmasked) => onChangeText?.(unmasked)}
              mask={mask}
              placeholder={placeholder}
              keyboardType={keyboardType}
              placeholderTextColor="#94A3B8"
              className={inputClass}
            />
          ) : (
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              secureTextEntry={secureTextEntry}
              maxLength={maxLength}
              placeholderTextColor="#94A3B8"
              className={inputClass}
            />
          )
        ) : (
          <Text className="text-sm font-medium text-slate-800">
            {secureTextEntry ? "••••••••" : value || "—"}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function PerfilClinicaScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isLookingUpPostalCode, setIsLookingUpPostalCode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const isChangingPasswordRef = useRef(false);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const isUploadingPhotoRef = useRef(false);

  // CEP original, para só consultar o ViaCEP quando o usuário alterá-lo.
  const loadedPostalCode = useRef("");

  function applyProfile(profile: Awaited<ReturnType<typeof getMyClinicProfile>>) {
    setName(profile.name);
    setCnpj(profile.cnpj);
    setEmail(profile.email);
    setPhone(profile.phone ?? "");
    setPostalCode(profile.postalCode);
    loadedPostalCode.current = profile.postalCode;
    setStreet(profile.street);
    setNumber(profile.number);
    setComplement(profile.complement ?? "");
    setNeighborhood(profile.neighborhood);
    setCity(profile.city);
    setState(profile.state);
  }

  useEffect(() => {
    let isCurrent = true;

    async function loadProfile() {
      setIsLoading(true);
      setLoadError("");

      try {
        const profile = await getMyClinicProfile();
        if (!isCurrent) return;
        applyProfile(profile);
        setPhotoUri(profile.image);
      } catch (error) {
        if (!isCurrent) return;
        setLoadError(getErrorMessage(error));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadProfile();
    return () => {
      isCurrent = false;
    };
  }, [loadAttempt]);

  useEffect(() => {
    if (!editing || postalCode.length !== 8) return;
    if (postalCode === loadedPostalCode.current) return;

    let isCurrent = true;
    setIsLookingUpPostalCode(true);

    fetch(`https://viacep.com.br/ws/${postalCode}/json/`)
      .then((response) => response.json() as Promise<ViaCepResponse>)
      .then((result) => {
        if (!isCurrent || result.erro) return;
        setState(result.uf);
        setCity(result.localidade);
        setNeighborhood(result.bairro);
      })
      .catch(() => {
        // Sem ViaCEP o usuário ainda pode preencher o endereço manualmente.
      })
      .finally(() => {
        if (isCurrent) setIsLookingUpPostalCode(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [editing, postalCode]);

  async function handleSaveProfile() {
    if (isSaving || isLoading) return;

    if (
      !name.trim() ||
      !email.trim() ||
      phone.length !== 11 ||
      postalCode.length !== 8 ||
      !street.trim() ||
      !number.trim() ||
      !neighborhood.trim() ||
      !city.trim() ||
      state.length !== 2
    ) {
      Alert.alert(
        "Dados incompletos",
        "Preencha nome, e-mail, telefone com DDD, CEP e todos os campos do endereço.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateMyClinicProfile({
        name: name.trim(),
        email: email.trim(),
        phone,
        postalCode,
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim() || null,
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.toUpperCase(),
      });
      applyProfile(updated);
      setEditing(false);
      Alert.alert("Perfil atualizado", "Os dados da clínica foram salvos.");
    } catch (error) {
      Alert.alert("Não foi possível salvar o perfil", getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditing(false);
    setLoadAttempt((attempt) => attempt + 1);
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
      await changeMyClinicPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      Alert.alert("Senha atualizada", "Sua senha foi alterada com sucesso.");
    } catch (error) {
      Alert.alert("Não foi possível alterar a senha", getErrorMessage(error));
    } finally {
      isChangingPasswordRef.current = false;
      setIsChangingPassword(false);
    }
  }

  async function uploadPhoto(photo: ImagePicker.ImagePickerAsset) {
    if (isUploadingPhotoRef.current) return;

    const previousUri = photoUri;
    isUploadingPhotoRef.current = true;
    setIsUploadingPhoto(true);
    setPhotoUri(photo.uri);

    try {
      const updated = await updateMyClinicImage({
        uri: photo.uri,
        mimeType: photo.mimeType,
        fileName: photo.fileName,
      });
      setPhotoUri(updated.image);
    } catch (error) {
      setPhotoUri(previousUri);
      Alert.alert("Não foi possível enviar a foto", getErrorMessage(error));
    } finally {
      isUploadingPhotoRef.current = false;
      setIsUploadingPhoto(false);
    }
  }

  async function selectPhoto(source: "camera" | "gallery") {
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

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };
      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      const selected = result.canceled ? undefined : result.assets[0];
      if (selected) {
        await uploadPhoto(selected);
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

    Alert.alert("Foto da clínica", "Escolha uma opção", [
      { text: "Tirar foto", onPress: () => void selectPhoto("camera") },
      {
        text: "Escolher da galeria",
        onPress: () => void selectPhoto("gallery"),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  async function handleLogout() {
    try {
      await clearAuthToken();
    } finally {
      // O navegador pai é o stack raiz; o atual é o das abas.
      (navigation.getParent() ?? navigation).reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }

  const disabled = isLoading || isSaving || Boolean(loadError);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isLoading ? (
          <View
            accessibilityLiveRegion="polite"
            className="mt-4 flex-row items-center justify-center gap-2"
          >
            <ActivityIndicator color="#2F80ED" />
            <Text className="text-sm text-slate-500">Carregando perfil...</Text>
          </View>
        ) : null}

        {loadError ? (
          <View className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
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

        <View className="mb-4 mt-4 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4">
          <View className="relative">
            <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#2F80ED]">
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  className="h-16 w-16"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="medkit" size={30} color="#FFFFFF" />
              )}
              {isUploadingPhoto ? (
                <View className="absolute h-16 w-16 items-center justify-center bg-black/40">
                  <ActivityIndicator color="#FFFFFF" />
                </View>
              ) : null}
            </View>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-slate-800">
              {name || "Clínica"}
            </Text>
            {cnpj ? (
              <Text className="mt-1 text-xs text-slate-500">
                CNPJ: {formatCnpj(cnpj)}
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trocar foto da clínica"
            disabled={isUploadingPhoto || isLoading}
            onPress={showPhotoOptions}
            className="h-9 w-9 items-center justify-center rounded-full bg-blue-50"
          >
            <Ionicons name="camera-outline" size={18} color="#2F80ED" />
          </Pressable>
        </View>

        <Secao titulo="Informações Gerais">
          {editing ? (
            <Campo
              icon="business-outline"
              label="Nome da clínica"
              value={name}
              editing
              autoCapitalize="words"
              onChangeText={setName}
            />
          ) : null}
          <Campo
            icon="call-outline"
            label="Telefone"
            value={phone}
            editing={editing}
            placeholder="(DD) XXXXX-XXXX"
            keyboardType="phone-pad"
            mask={Masks.BRL_PHONE}
            onChangeText={setPhone}
          />
          <Campo
            icon="mail-outline"
            label="E-mail"
            value={email}
            editing={editing}
            placeholder="contato@clinica.com.br"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          {editing ? (
            <>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Campo
                    icon="location-outline"
                    label="CEP"
                    value={postalCode}
                    editing
                    placeholder="00000000"
                    keyboardType="numeric"
                    maxLength={8}
                    onChangeText={(value) =>
                      setPostalCode(value.replace(/\D/g, ""))
                    }
                  />
                </View>
                {isLookingUpPostalCode ? (
                  <ActivityIndicator color="#2F80ED" className="ml-2" />
                ) : null}
              </View>
              <Campo
                label="Logradouro"
                value={street}
                editing
                autoCapitalize="words"
                onChangeText={setStreet}
              />
              <Campo
                label="Número"
                value={number}
                editing
                onChangeText={setNumber}
              />
              <Campo
                label="Complemento"
                value={complement}
                editing
                onChangeText={setComplement}
              />
              <Campo
                label="Bairro"
                value={neighborhood}
                editing
                autoCapitalize="words"
                onChangeText={setNeighborhood}
              />
              <Campo
                label="Cidade"
                value={city}
                editing
                autoCapitalize="words"
                onChangeText={setCity}
              />
              <Campo
                label="UF"
                value={state}
                editing
                autoCapitalize="characters"
                maxLength={2}
                onChangeText={(value) => setState(value.toUpperCase())}
                ultimo
              />
            </>
          ) : (
            <Campo
              icon="navigate-outline"
              label="Endereço"
              value={formatAddress({
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
              })}
              ultimo
            />
          )}
        </Secao>

        <Pressable
          accessibilityRole="button"
          onPress={editing ? handleSaveProfile : () => setEditing(true)}
          disabled={disabled}
          accessibilityState={{ disabled, busy: isSaving }}
          className="mb-3 h-12 items-center justify-center rounded-xl bg-[#2F80ED]"
        >
          {isSaving ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color="#FFFFFF" />
              <Text className="text-base font-bold text-white">Salvando...</Text>
            </View>
          ) : (
            <Text className="text-base font-bold text-white">
              {editing ? "Salvar alterações" : "Editar perfil"}
            </Text>
          )}
        </Pressable>

        {editing ? (
          <Pressable
            accessibilityRole="button"
            onPress={handleCancelEdit}
            disabled={isSaving}
            className="mb-4 h-11 items-center justify-center rounded-xl border border-slate-200 bg-white"
          >
            <Text className="text-sm font-bold text-slate-600">Cancelar</Text>
          </Pressable>
        ) : (
          <View className="mb-1" />
        )}

        <Secao titulo="Segurança e Conta">
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowPassword((visible) => !visible)}
            className="flex-row items-center py-3"
          >
            <Ionicons name="lock-closed" size={20} color="#2F80ED" />
            <Text className="ml-3 flex-1 text-sm font-medium text-slate-800">
              Alterar senha
            </Text>
            <Ionicons
              name={showPassword ? "chevron-down" : "chevron-forward"}
              size={18}
              color="#94A3B8"
            />
          </Pressable>

          {showPassword ? (
            <View className="pb-2">
              <Campo
                label="Senha atual"
                value={currentPassword}
                editing
                autoCapitalize="none"
                secureTextEntry
                onChangeText={setCurrentPassword}
              />
              <Campo
                label="Nova senha"
                value={newPassword}
                editing
                autoCapitalize="none"
                secureTextEntry
                onChangeText={setNewPassword}
              />
              <Campo
                label="Confirmar nova senha"
                value={confirmPassword}
                editing
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
                  <ActivityIndicator color="#2F80ED" />
                ) : (
                  <Text className="text-sm font-bold text-blue-600">
                    Salvar nova senha
                  </Text>
                )}
              </Pressable>
            </View>
          ) : null}
        </Secao>

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          className="h-12 items-center justify-center rounded-xl bg-red-50"
        >
          <Text className="text-base font-semibold text-red-500">
            Sair da conta
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
