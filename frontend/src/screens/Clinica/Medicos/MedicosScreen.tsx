import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, type NavigationProp, type ParamListBase } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chip } from "../../../components/Chip";
import { ErrorBox, Loading, SuccessBanner } from "../../../components/Feedback";
import { useLoad } from "../../../hooks/useLoad";
import { getRequestErrorMessage } from "../../../services/apiClient";
import {
  createSpecialty,
  deleteSpecialty,
  listDoctors,
  listSpecialties,
  updateDoctor,
  type Doctor,
  type SpecialtyWithCount,
} from "../../../services/doctorService";
import { normalize } from "../../../utils/format";
import { SpecialtiesCard } from "./components/EspecialidadesCard";
import { DoctorCard } from "./components/MedicoCard";
import type { DoctorFilters } from "./interfaces/DoctorFilters";
import type { DoctorsRoute } from "./interfaces/DoctorsRoute";
import type { StatusOption } from "./interfaces/StatusOption";

function filterDoctors(doctors: Doctor[], { search, status, specialtyId }: DoctorFilters): Doctor[] {
  const term = normalize(search.trim());

  return doctors.filter((doctor) => {
    if (status === "ativos" && !doctor.active) return false;
    if (status === "inativos" && doctor.active) return false;
    if (specialtyId !== null && !doctor.specialties.some((s) => s.id === specialtyId)) {
      return false;
    }
    const texts = [doctor.name, doctor.crm, ...doctor.specialties.map((s) => s.name)];
    return !term || texts.some((text) => normalize(text).includes(term));
  });
}

export const MedicosScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const incomingMessage = useRoute<DoctorsRoute>().params?.message;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [filters, setFilters] = useState<DoctorFilters>({ search: "", status: "todos", specialtyId: null });
  const [showFilters, setShowFilters] = useState(false);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  // Recarrega ao voltar do formulário.
  const { loading, error, reload } = useLoad(
    async () => {
      const [doctorList, specialtyList] = await Promise.all([listDoctors(), listSpecialties()]);
      setDoctors(doctorList);
      setSpecialties(specialtyList);
    },
    [],
    { onFocus: true },
  );

  // Mensagem de sucesso enviada pelo formulário.
  useEffect(() => {
    if (!incomingMessage) return;
    setBanner(incomingMessage);
    navigation.setParams({ message: undefined });
  }, [incomingMessage, navigation]);

  // O banner some sozinho depois de 4 segundos.
  useEffect(() => {
    if (!banner) return;
    const timeout = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(timeout);
  }, [banner]);

  const visibleDoctors = filterDoctors(doctors, filters);
  const activeCount = doctors.filter((d) => d.active).length;
  const statusOptions: StatusOption[] = [
    { status: "todos", label: `Todos (${doctors.length})` },
    { status: "ativos", label: `Ativos (${activeCount})` },
    { status: "inativos", label: `Inativos (${doctors.length - activeCount})` },
  ];

  function openForm(doctor?: Doctor) {
    const root = navigation.getParent();
    if (doctor) root?.navigate("EditarMedico", { doctorId: doctor.id });
    else root?.navigate("CadastroMedico");
  }

  async function reactivate(doctor: Doctor) {
    setReactivatingId(doctor.id);
    try {
      const updated = await updateDoctor(doctor.id, { active: true });
      setDoctors((current) => current.map((d) => (d.id === updated.id ? updated : d)));
      setBanner(`${updated.name} reativado com sucesso!`);
    } catch (e) {
      Alert.alert("Não foi possível reativar", getRequestErrorMessage(e));
    } finally {
      setReactivatingId(null);
    }
  }

  async function addSpecialty(name: string): Promise<boolean> {
    try {
      const created = await createSpecialty(name);
      setSpecialties((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)));
      return true;
    } catch (e) {
      Alert.alert("Não foi possível adicionar a especialidade", getRequestErrorMessage(e));
      return false;
    }
  }

  function removeSpecialty(specialty: SpecialtyWithCount) {
    // Regra: só pode remover especialidade sem médicos vinculados.
    if (specialty.doctorsCount > 0) {
      Alert.alert(
        "Especialidade em uso",
        `${specialty.name} está vinculada a ${specialty.doctorsCount} médico(s). Remova o vínculo antes de excluí-la.`,
      );
      return;
    }

    Alert.alert("Remover especialidade", `Remover ${specialty.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSpecialty(specialty.id);
            setSpecialties((current) => current.filter((s) => s.id !== specialty.id));
            setFilters((f) => (f.specialtyId === specialty.id ? { ...f, specialtyId: null } : f));
          } catch (e) {
            Alert.alert("Não foi possível remover", getRequestErrorMessage(e));
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="flex-1 pr-3 text-xl font-bold text-slate-800">Médicos e Especialidades</Text>
          <Pressable
            onPress={() => openForm()}
            className="items-center justify-center rounded-xl bg-[#2F80ED] px-4 py-3"
          >
            <Text className="text-center text-sm font-bold text-white">Novo Médico</Text>
          </Pressable>
        </View>

        <View className="mb-3 flex-row items-center">
          <View className="mr-2 h-[38px] flex-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3">
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <TextInput
              className="ml-2 flex-1 p-0 text-sm text-slate-800"
              placeholder="Buscar médico..."
              placeholderTextColor="#94A3B8"
              value={filters.search}
              onChangeText={(search) => setFilters({ ...filters, search })}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            className={`h-[38px] flex-row items-center rounded-xl border px-3 ${
              showFilters || filters.specialtyId !== null
                ? "border-blue-200 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <Ionicons name="funnel" size={14} color="#2F80ED" />
            <Text className="ml-2 text-sm font-bold text-[#2F80ED]">Filtrar</Text>
          </Pressable>
        </View>

        {showFilters ? (
          <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-3">
            <Text className="mb-2 text-xs text-slate-400">Filtrar por especialidade</Text>
            {specialties.length === 0 ? (
              <Text className="text-sm text-slate-400">Nenhuma especialidade cadastrada.</Text>
            ) : (
              <View className="flex-row flex-wrap">
                {specialties.map((specialty) => {
                  const selected = filters.specialtyId === specialty.id;
                  return (
                    <Chip
                      key={specialty.id}
                      label={specialty.name}
                      selected={selected}
                      onPress={() => setFilters({ ...filters, specialtyId: selected ? null : specialty.id })}
                    />
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        <View className="mb-2 flex-row flex-wrap">
          {statusOptions.map((option) => (
            <Chip
              key={option.status}
              label={option.label}
              selected={filters.status === option.status}
              onPress={() => setFilters({ ...filters, status: option.status })}
              rounded
            />
          ))}
        </View>

        {banner ? <SuccessBanner message={banner} onClose={() => setBanner(null)} /> : null}

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} onRetry={reload} />
        ) : (
          <>
            {visibleDoctors.length === 0 ? (
              <View className="mb-4 items-center rounded-2xl border border-slate-200 bg-white px-4 py-8">
                <Ionicons name="people-outline" size={32} color="#94A3B8" />
                <Text className="mt-2 text-center text-sm text-slate-500">
                  {doctors.length === 0
                    ? "Nenhum médico cadastrado ainda. Toque em “Novo Médico” para começar."
                    : "Nenhum médico encontrado com os filtros atuais."}
                </Text>
              </View>
            ) : (
              visibleDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  isUpdating={reactivatingId === doctor.id}
                  onEdit={() => openForm(doctor)}
                  onReactivate={() => reactivate(doctor)}
                />
              ))
            )}

            <SpecialtiesCard specialties={specialties} onAdd={addSpecialty} onRemove={removeSpecialty} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
