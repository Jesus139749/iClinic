import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, type NavigationProp, type ParamListBase } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/Button";
import { Chip } from "../../../components/Chip";
import { ErrorBox, Loading } from "../../../components/Feedback";
import { useLoad } from "../../../hooks/useLoad";
import { getRequestErrorMessage } from "../../../services/apiClient";
import {
  createDoctor,
  createSpecialty,
  getDoctor,
  listSpecialties,
  updateDoctor,
  updateDoctorImage,
  type SpecialtyWithCount,
} from "../../../services/doctorService";
import { pickPhoto, type Photo } from "../../../utils/pickImage";
import { DoctorAvatar } from "./components/MedicoAvatar";
import type { DoctorForm } from "./interfaces/DoctorForm";
import type { DoctorFormRoute } from "./interfaces/DoctorFormRoute";

const INPUT = "rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800";

function validate(form: DoctorForm): string | null {
  if (!form.name.trim()) return "Informe o nome do médico.";
  if (!form.crm.trim()) return "Informe o CRM do médico.";
  if (form.phone && form.phone.length !== 11) return "O telefone deve ter 11 dígitos (DDD + número).";
  if (form.specialtyIds.length === 0) return "Selecione ao menos uma especialidade.";
  return null;
}

function sortByName<T extends { name: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export default function MedicoFormScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const doctorId = useRoute<DoctorFormRoute>().params?.doctorId;
  const isEditing = doctorId !== undefined;

  const [form, setForm] = useState<DoctorForm>({ name: "", crm: "", phone: "", active: true, specialtyIds: [] });
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<Photo | null>(null); // enviada só ao salvar
  const [newSpecialty, setNewSpecialty] = useState("");
  const [addingSpecialty, setAddingSpecialty] = useState(false);
  const [saving, setSaving] = useState(false);

  const { loading, error, reload } = useLoad(async () => {
    const [specialtyList, doctor] = await Promise.all([
      listSpecialties(),
      isEditing ? getDoctor(doctorId) : null,
    ]);
    setSpecialties(specialtyList);
    if (doctor) {
      setForm({
        name: doctor.name,
        crm: doctor.crm,
        phone: doctor.phone ?? "",
        active: doctor.active,
        specialtyIds: doctor.specialties.map((s) => s.id),
      });
      setPhoto(doctor.image);
    }
  }, [doctorId]);

  function toggleSpecialty(id: number) {
    setForm((current) => ({
      ...current,
      specialtyIds: current.specialtyIds.includes(id)
        ? current.specialtyIds.filter((item) => item !== id)
        : [...current.specialtyIds, id],
    }));
  }

  async function addSpecialty() {
    const name = newSpecialty.trim();
    if (!name) return;

    setAddingSpecialty(true);
    try {
      const created = await createSpecialty(name);
      setSpecialties((current) => sortByName([...current, created]));
      setForm((current) => ({ ...current, specialtyIds: [...current.specialtyIds, created.id] }));
      setNewSpecialty("");
    } catch (e) {
      Alert.alert("Não foi possível adicionar a especialidade", getRequestErrorMessage(e));
    } finally {
      setAddingSpecialty(false);
    }
  }

  async function selectPhoto() {
    const newPhoto = await pickPhoto("Foto do médico");
    if (!newPhoto) return;
    setPendingPhoto(newPhoto);
    setPhoto(newPhoto.uri);
  }

  async function save() {
    const validationError = validate(form);
    if (validationError) {
      Alert.alert("Dados incompletos", validationError);
      return;
    }

    const data = {
      name: form.name.trim(),
      crm: form.crm.trim(),
      phone: form.phone || undefined,
      specialtyIds: form.specialtyIds,
    };

    setSaving(true);
    let doctor;
    try {
      doctor = isEditing
        ? await updateDoctor(doctorId, { ...data, active: form.active })
        : await createDoctor(data);
    } catch (e) {
      Alert.alert("Não foi possível salvar", getRequestErrorMessage(e));
      setSaving(false);
      return;
    }

    // O médico já foi salvo; uma falha na foto não desfaz o cadastro.
    let message: string | undefined = `${doctor.name} ${isEditing ? "atualizado" : "cadastrado"} com sucesso!`;
    if (pendingPhoto) {
      try {
        await updateDoctorImage(doctor.id, pendingPhoto);
      } catch (e) {
        message = undefined;
        Alert.alert(
          "Médico salvo, mas a foto não foi enviada",
          `${getRequestErrorMessage(e)}\nEdite o médico para tentar novamente.`,
        );
      }
    }

    setSaving(false);
    navigation.navigate("DashboardClinica", { screen: "Médicos", params: { message } });
  }

  if (loading) return <Loading fullScreen />;

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-4 pt-2" edges={[]}>
        <ErrorBox message={error} onRetry={reload} />
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
          <DoctorAvatar uri={photo} name={form.name} size={64} />
          <View className="ml-4 flex-1">
            <Text className="text-sm font-bold text-slate-800">Foto do médico</Text>
            <Text className="text-xs text-slate-400">JPEG, PNG ou WebP, até 5 MB</Text>
          </View>
          <Pressable
            onPress={selectPhoto}
            accessibilityLabel="Alterar foto"
            className="h-9 w-9 items-center justify-center rounded-full bg-blue-50"
          >
            <Ionicons name="camera-outline" size={18} color="#2F80ED" />
          </Pressable>
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-3 text-base font-bold text-slate-800">Dados do médico</Text>

          <Text className="mb-1 text-xs text-slate-400">Nome completo</Text>
          <TextInput
            className={INPUT}
            placeholder="Dra. Camila Ferreira"
            placeholderTextColor="#94A3B8"
            value={form.name}
            onChangeText={(name) => setForm({ ...form, name })}
            autoCapitalize="words"
          />

          <Text className="mb-1 mt-3 text-xs text-slate-400">CRM</Text>
          <TextInput
            className={INPUT}
            placeholder="123456SP"
            placeholderTextColor="#94A3B8"
            value={form.crm}
            onChangeText={(crm) => setForm({ ...form, crm })}
            autoCapitalize="characters"
          />

          <Text className="mb-1 mt-3 text-xs text-slate-400">Telefone (opcional)</Text>
          <MaskInput
            className={INPUT}
            placeholder="(11) 98765-4321"
            placeholderTextColor="#94A3B8"
            value={form.phone}
            mask={Masks.BRL_PHONE}
            onChangeText={(_masked, phone) => setForm({ ...form, phone })}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-1 text-base font-bold text-slate-800">Especialidades</Text>
          <Text className="mb-3 text-xs text-slate-400">Selecione uma ou mais.</Text>

          <View className="flex-row flex-wrap">
            {specialties.map((specialty) => (
              <Chip
                key={specialty.id}
                label={specialty.name}
                selected={form.specialtyIds.includes(specialty.id)}
                onPress={() => toggleSpecialty(specialty.id)}
                check
              />
            ))}
          </View>

          <View className="mt-1 flex-row items-center">
            <TextInput
              className="mr-2 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
              placeholder="Nova especialidade"
              placeholderTextColor="#94A3B8"
              value={newSpecialty}
              onChangeText={setNewSpecialty}
              onSubmitEditing={addSpecialty}
              returnKeyType="done"
            />
            <Pressable
              onPress={addSpecialty}
              disabled={addingSpecialty || !newSpecialty.trim()}
              accessibilityLabel="Adicionar especialidade"
              className={`h-10 w-10 items-center justify-center rounded-xl bg-[#2F80ED] ${
                newSpecialty.trim() ? "" : "opacity-40"
              }`}
            >
              {addingSpecialty ? (
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
              <Text className="text-base font-bold text-slate-800">Médico ativo</Text>
              <Text className="text-xs text-slate-400">
                Médicos inativos ficam indisponíveis para atendimento.
              </Text>
            </View>
            <Switch
              value={form.active}
              onValueChange={(active) => setForm({ ...form, active })}
              trackColor={{ true: "#2F80ED" }}
            />
          </View>
        ) : null}

        <Button
          label={isEditing ? "Salvar alterações" : "Cadastrar médico"}
          onPress={save}
          loading={saving}
          loadingLabel="Salvando..."
          className="mb-3"
        />
        <Button variant="outline" label="Cancelar" onPress={() => navigation.goBack()} disabled={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}
