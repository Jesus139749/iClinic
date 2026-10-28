import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRequestErrorMessage } from "../../../services/apiClient";
import {
  createDoctor,
  createSpecialty,
  getDoctor,
  listSpecialties,
  updateDoctor,
  updateDoctorImage,
  type Doctor,
  type SpecialtyWithCount,
} from "../../../services/doctorService";
import { MedicoAvatar } from "./components/MedicoAvatar";

type MedicoFormRoute = RouteProp<{
  MedicoForm: { medicoId?: number } | undefined;
}>;

const INPUT_CLASS =
  "rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800";

export default function MedicoFormScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<MedicoFormRoute>();
  const medicoId = route.params?.medicoId;
  const isEditing = medicoId !== undefined;

  const [name, setName] = useState("");
  const [crm, setCrm] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  // Foto escolhida mas ainda não enviada ao servidor.
  const [pendingPhoto, setPendingPhoto] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const [newSpecialty, setNewSpecialty] = useState("");
  const [isAddingSpecialty, setIsAddingSpecialty] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      try {
        const [loadedSpecialties, doctor] = await Promise.all([
          listSpecialties(),
          isEditing ? getDoctor(medicoId) : Promise.resolve<Doctor | null>(null),
        ]);
        if (!isCurrent) return;

        setSpecialties(loadedSpecialties);
        if (doctor) {
          setName(doctor.name);
          setCrm(doctor.crm);
          setPhone(doctor.phone ?? "");
          setActive(doctor.active);
          setPhotoUri(doctor.image);
          setSelectedIds(doctor.specialties.map((item) => item.id));
        }
        setLoadError(null);
      } catch (error) {
        if (isCurrent) setLoadError(getRequestErrorMessage(error));
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void load();

    return () => {
      isCurrent = false;
    };
  }, [isEditing, medicoId, loadAttempt]);

  function toggleSpecialty(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  async function addSpecialty() {
    const value = newSpecialty.trim();
    if (!value) return;

    setIsAddingSpecialty(true);
    try {
      const created = await createSpecialty(value);
      setSpecialties((current) =>
        [...current, created].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setSelectedIds((current) => [...current, created.id]);
      setNewSpecialty("");
    } catch (error) {
      Alert.alert(
        "Não foi possível adicionar a especialidade",
        getRequestErrorMessage(error),
      );
    } finally {
      setIsAddingSpecialty(false);
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
        // A foto só é enviada ao salvar, junto com os demais dados.
        setPendingPhoto(selected);
        setPhotoUri(selected.uri);
      }
    } catch (error) {
      Alert.alert(
        "Não foi possível selecionar a foto",
        error instanceof Error ? error.message : "Tente novamente.",
      );
    }
  }

  function showPhotoOptions() {
    Alert.alert("Foto do médico", "Escolha uma opção", [
      { text: "Tirar foto", onPress: () => void selectPhoto("camera") },
      {
        text: "Escolher da galeria",
        onPress: () => void selectPhoto("gallery"),
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  function validate(): string | null {
    if (!name.trim()) return "Informe o nome do médico.";
    if (!crm.trim()) return "Informe o CRM do médico.";
    if (phone && phone.length !== 11) {
      return "O telefone deve ter 11 dígitos (DDD + número).";
    }
    if (selectedIds.length === 0) {
      return "Selecione ao menos uma especialidade.";
    }
    return null;
  }

  async function handleSave() {
    if (isSaving) return;

    const validationError = validate();
    if (validationError) {
      Alert.alert("Dados incompletos", validationError);
      return;
    }

    setIsSaving(true);
    let saved: Doctor | undefined;

    try {
      saved = isEditing
        ? await updateDoctor(medicoId, {
            name: name.trim(),
            crm: crm.trim(),
            phone: phone || undefined,
            specialtyIds: selectedIds,
            active,
          })
        : await createDoctor({
            name: name.trim(),
            crm: crm.trim(),
            phone: phone || undefined,
            specialtyIds: selectedIds,
          });
    } catch (error) {
      Alert.alert("Não foi possível salvar", getRequestErrorMessage(error));
      setIsSaving(false);
      return;
    }

    let photoFailed = false;
    if (pendingPhoto) {
      try {
        saved = await updateDoctorImage(saved.id, {
          uri: pendingPhoto.uri,
          mimeType: pendingPhoto.mimeType,
          fileName: pendingPhoto.fileName,
        });
      } catch (error) {
        photoFailed = true;
        Alert.alert(
          "Médico salvo, mas a foto não foi enviada",
          `${getRequestErrorMessage(error)}\nEdite o médico para tentar novamente.`,
        );
      }
    }

    setIsSaving(false);

    const mensagem = `${saved.name} ${isEditing ? "atualizado" : "cadastrado"} com sucesso!`;
    navigation.navigate("DashboardClinica", {
      screen: "Médicos",
      params: { mensagem: photoFailed ? undefined : mensagem },
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#2F80ED" />
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-6" edges={[]}>
        <View
          className="rounded-xl border border-red-200 bg-red-50 p-3"
          accessibilityRole="alert"
        >
          <Text className="text-sm text-red-700">{loadError}</Text>
        </View>
        <Pressable
          onPress={() => {
            setIsLoading(true);
            setLoadAttempt((attempt) => attempt + 1);
          }}
          className="mt-3 h-11 items-center justify-center rounded-xl border border-blue-200 bg-blue-50"
        >
          <Text className="text-sm font-bold text-blue-600">
            Tentar novamente
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-4 text-xl font-bold text-slate-800">
          {isEditing ? "Editar Médico" : "Novo Médico"}
        </Text>

        <View className="mb-4 flex-row items-center rounded-2xl border border-slate-200 bg-white p-4">
          <MedicoAvatar uri={photoUri} name={name} size={64} />
          <View className="ml-4 flex-1">
            <Text className="text-sm font-bold text-slate-800">
              Foto do médico
            </Text>
            <Text className="text-xs text-slate-400">JPEG, PNG ou WebP, até 5 MB</Text>
          </View>
          <Pressable
            onPress={showPhotoOptions}
            className="h-9 w-9 items-center justify-center rounded-full bg-blue-50"
            accessibilityLabel="Alterar foto"
          >
            <Ionicons name="camera-outline" size={18} color="#2F80ED" />
          </Pressable>
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-3 text-base font-bold text-slate-800">
            Dados do médico
          </Text>

          <Text className="mb-1 text-xs text-slate-400">Nome completo</Text>
          <TextInput
            className={INPUT_CLASS}
            placeholder="Dra. Camila Ferreira"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text className="mb-1 mt-3 text-xs text-slate-400">CRM</Text>
          <TextInput
            className={INPUT_CLASS}
            placeholder="123456SP"
            placeholderTextColor="#94A3B8"
            value={crm}
            onChangeText={setCrm}
            autoCapitalize="characters"
          />

          <Text className="mb-1 mt-3 text-xs text-slate-400">
            Telefone (opcional)
          </Text>
          <MaskInput
            className={INPUT_CLASS}
            placeholder="(11) 98765-4321"
            placeholderTextColor="#94A3B8"
            value={phone}
            mask={Masks.BRL_PHONE}
            onChangeText={(_masked, unmasked) => setPhone(unmasked)}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-1 text-base font-bold text-slate-800">
            Especialidades
          </Text>
          <Text className="mb-3 text-xs text-slate-400">
            Selecione uma ou mais.
          </Text>

          <View className="flex-row flex-wrap">
            {specialties.map((specialty) => {
              const selected = selectedIds.includes(specialty.id);
              return (
                <Pressable
                  key={specialty.id}
                  onPress={() => toggleSpecialty(specialty.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  className={`mb-2 mr-2 flex-row items-center rounded-lg border px-3 py-2 ${
                    selected
                      ? "border-[#2F80ED] bg-[#2F80ED]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {selected ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : null}
                  <Text
                    className={`text-sm font-bold ${
                      selected ? "ml-1 text-white" : "text-slate-600"
                    }`}
                  >
                    {specialty.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-1 flex-row items-center">
            <TextInput
              className="mr-2 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
              placeholder="Nova especialidade"
              placeholderTextColor="#94A3B8"
              value={newSpecialty}
              onChangeText={setNewSpecialty}
              onSubmitEditing={() => void addSpecialty()}
              returnKeyType="done"
            />
            <Pressable
              onPress={() => void addSpecialty()}
              disabled={isAddingSpecialty || !newSpecialty.trim()}
              className={`h-10 w-10 items-center justify-center rounded-xl bg-[#2F80ED] ${
                !newSpecialty.trim() ? "opacity-40" : ""
              }`}
              accessibilityLabel="Adicionar especialidade"
            >
              {isAddingSpecialty ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name="add" size={20} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
        </View>

        {isEditing ? (
          <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
            <View className="flex-1 pr-3">
              <Text className="text-base font-bold text-slate-800">
                Médico ativo
              </Text>
              <Text className="text-xs text-slate-400">
                Médicos inativos ficam indisponíveis para atendimento.
              </Text>
            </View>
            <Switch
              value={active}
              onValueChange={setActive}
              trackColor={{ true: "#2F80ED" }}
            />
          </View>
        ) : null}

        <Pressable
          onPress={() => void handleSave()}
          disabled={isSaving}
          accessibilityState={{ disabled: isSaving, busy: isSaving }}
          className={`mb-3 h-12 flex-row items-center justify-center rounded-xl bg-[#2F80ED] ${
            isSaving ? "opacity-70" : ""
          }`}
        >
          {isSaving ? <ActivityIndicator color="#FFFFFF" /> : null}
          <Text className={`text-base font-bold text-white ${isSaving ? "ml-2" : ""}`}>
            {isSaving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar médico"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          disabled={isSaving}
          className="h-11 items-center justify-center rounded-xl border border-slate-200 bg-white"
        >
          <Text className="text-sm font-bold text-slate-600">Cancelar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
