import { Ionicons } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { EspecialidadesCard } from "./components/EspecialidadesCard";
import { MedicoCard } from "./components/MedicoCard";

type StatusFilter = "todos" | "ativos" | "inativos";

type MedicosRoute = RouteProp<{ Médicos: { mensagem?: string } | undefined }>;

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export const MedicosScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<MedicosRoute>();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState<number | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  // Recarrega ao voltar do formulário e ao tentar novamente.
  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;

      async function load() {
        try {
          const [loadedDoctors, loadedSpecialties] = await Promise.all([
            listDoctors(),
            listSpecialties(),
          ]);
          if (!isCurrent) return;
          setDoctors(loadedDoctors);
          setSpecialties(loadedSpecialties);
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
    }, [loadAttempt]),
  );

  // Mensagem de sucesso enviada pelo formulário.
  const incomingMessage = route.params?.mensagem;
  useEffect(() => {
    if (!incomingMessage) return;

    setBanner(incomingMessage);
    navigation.setParams({ mensagem: undefined });
    const timeout = setTimeout(() => setBanner(null), 4000);
    return () => clearTimeout(timeout);
  }, [incomingMessage, navigation]);

  const counts = useMemo(
    () => ({
      todos: doctors.length,
      ativos: doctors.filter((doctor) => doctor.active).length,
      inativos: doctors.filter((doctor) => !doctor.active).length,
    }),
    [doctors],
  );

  const visibleDoctors = useMemo(() => {
    const term = normalize(search.trim());

    return doctors.filter((doctor) => {
      if (status === "ativos" && !doctor.active) return false;
      if (status === "inativos" && doctor.active) return false;
      if (
        specialtyFilter !== null &&
        !doctor.specialties.some((item) => item.id === specialtyFilter)
      ) {
        return false;
      }
      if (!term) return true;

      return [doctor.name, doctor.crm, ...doctor.specialties.map((s) => s.name)]
        .map(normalize)
        .some((value) => value.includes(term));
    });
  }, [doctors, search, status, specialtyFilter]);

  function openForm(doctor?: Doctor) {
    const parent = navigation.getParent();
    if (doctor) {
      parent?.navigate("EditarMedico", { medicoId: doctor.id });
    } else {
      parent?.navigate("CadastroMedico");
    }
  }

  async function reactivate(doctor: Doctor) {
    setUpdatingId(doctor.id);
    try {
      const updated = await updateDoctor(doctor.id, { active: true });
      setDoctors((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setBanner(`${updated.name} reativado com sucesso!`);
    } catch (error) {
      Alert.alert("Não foi possível reativar", getRequestErrorMessage(error));
    } finally {
      setUpdatingId(null);
    }
  }

  async function addSpecialty(name: string): Promise<boolean> {
    try {
      const created = await createSpecialty(name);
      setSpecialties((current) =>
        [...current, created].sort((a, b) => a.name.localeCompare(b.name)),
      );
      return true;
    } catch (error) {
      Alert.alert(
        "Não foi possível adicionar a especialidade",
        getRequestErrorMessage(error),
      );
      return false;
    }
  }

  function confirmRemoveSpecialty(specialty: SpecialtyWithCount) {
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
            setSpecialties((current) =>
              current.filter((item) => item.id !== specialty.id),
            );
            if (specialtyFilter === specialty.id) setSpecialtyFilter(null);
          } catch (error) {
            Alert.alert(
              "Não foi possível remover",
              getRequestErrorMessage(error),
            );
          }
        },
      },
    ]);
  }

  const chips: { key: StatusFilter; label: string }[] = [
    { key: "todos", label: `Todos (${counts.todos})` },
    { key: "ativos", label: `Ativos (${counts.ativos})` },
    { key: "inativos", label: `Inativos (${counts.inativos})` },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="flex-1 pr-3 text-xl font-bold text-slate-800">
            Médicos e{"\n"}Especialidades
          </Text>
          <Pressable
            onPress={() => openForm()}
            className="items-center justify-center rounded-xl bg-[#2F80ED] px-4 py-3"
            accessibilityRole="button"
          >
            <Text className="text-center text-sm font-bold text-white">
              Novo{"\n"}Médico
            </Text>
          </Pressable>
        </View>

        <View className="mb-3 flex-row items-center">
          <View className="mr-2 h-[38px] flex-1 flex-row items-center rounded-xl border border-slate-200 bg-white px-3">
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <TextInput
              className="ml-2 flex-1 p-0 text-sm text-slate-800"
              placeholder="Buscar médico..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              returnKeyType="search"
            />
          </View>
          <Pressable
            onPress={() => setShowFilters((current) => !current)}
            className={`h-[38px] flex-row items-center rounded-xl border px-3 ${
              showFilters || specialtyFilter !== null
                ? "border-blue-200 bg-blue-50"
                : "border-slate-200 bg-white"
            }`}
            accessibilityRole="button"
            accessibilityState={{ expanded: showFilters }}
          >
            <Ionicons name="funnel" size={14} color="#2F80ED" />
            <Text className="ml-2 text-sm font-bold text-[#2F80ED]">Filtrar</Text>
          </Pressable>
        </View>

        {showFilters ? (
          <View className="mb-3 rounded-2xl border border-slate-200 bg-white p-3">
            <Text className="mb-2 text-xs text-slate-400">
              Filtrar por especialidade
            </Text>
            {specialties.length === 0 ? (
              <Text className="text-sm text-slate-400">
                Nenhuma especialidade cadastrada.
              </Text>
            ) : (
              <View className="flex-row flex-wrap">
                {specialties.map((specialty) => {
                  const selected = specialtyFilter === specialty.id;
                  return (
                    <Pressable
                      key={specialty.id}
                      onPress={() =>
                        setSpecialtyFilter(selected ? null : specialty.id)
                      }
                      className={`mb-2 mr-2 rounded-lg border px-3 py-1.5 ${
                        selected
                          ? "border-[#2F80ED] bg-[#2F80ED]"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          selected ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {specialty.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 flex-grow-0"
          keyboardShouldPersistTaps="handled"
        >
          {chips.map((chip) => {
            const selected = status === chip.key;
            return (
              <Pressable
                key={chip.key}
                onPress={() => setStatus(chip.key)}
                className={`mr-2 rounded-full border px-4 py-2 ${
                  selected
                    ? "border-[#2F80ED] bg-[#2F80ED]"
                    : "border-slate-200 bg-white"
                }`}
                accessibilityState={{ selected }}
              >
                <Text
                  className={`text-xs font-bold ${
                    selected ? "text-white" : "text-slate-600"
                  }`}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {banner ? (
          <View
            className="mb-4 flex-row items-center rounded-lg border border-green-300 bg-green-50 px-3 py-3"
            accessibilityRole="alert"
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
            <Text className="ml-2 flex-1 text-sm text-green-700">{banner}</Text>
            <Pressable onPress={() => setBanner(null)} hitSlop={8}>
              <Ionicons name="close" size={16} color="#16a34a" />
            </Pressable>
          </View>
        ) : null}

        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#2F80ED" />
          </View>
        ) : loadError ? (
          <View
            className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3"
            accessibilityRole="alert"
          >
            <Text className="text-sm text-red-700">{loadError}</Text>
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
          </View>
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
                <MedicoCard
                  key={doctor.id}
                  doctor={doctor}
                  isUpdating={updatingId === doctor.id}
                  onEdit={() => openForm(doctor)}
                  onReactivate={() => void reactivate(doctor)}
                />
              ))
            )}

            <EspecialidadesCard
              specialties={specialties}
              onAdd={addSpecialty}
              onRemove={confirmRemoveSpecialty}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
