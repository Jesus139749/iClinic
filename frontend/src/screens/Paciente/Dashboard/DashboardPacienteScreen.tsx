import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorBox, Loading } from "../../../components/Feedback";
import { useLoad } from "../../../hooks/useLoad";
import type { ClinicListItem } from "../../../services/clinicSearchService";
import { listClinics } from "../../../services/clinicSearchService";
import { getMyProfile } from "../../../services/profileService";
import { PatientClinicCard } from "./components/ClinicaCardPaciente";
import { PatientQuickAction } from "./components/QuickActionPaciente";
import type { PatientDashboardNavigation } from "./interfaces/PatientDashboardNavigation";

// Dados fictícios até o backend expor recomendações.
const popularSpecialties = ["Clínico Geral", "Dermatologia", "Ortopedia", "Cardiologia", "Pediatria"];

function getUniqueClinics(clinics: ClinicListItem[] | null): ClinicListItem[] {
  const uniqueClinics = new Map<number, ClinicListItem>();

  for (const clinic of clinics ?? []) {
    if (!uniqueClinics.has(clinic.id)) uniqueClinics.set(clinic.id, clinic);
  }

  return [...uniqueClinics.values()];
}

export default function DashboardPacienteScreen() {
  const navigation = useNavigation<PatientDashboardNavigation>();
  const { data: patient, error, reload } = useLoad(getMyProfile);
  const {
    data: clinics,
    loading: clinicsLoading,
    error: clinicsError,
    reload: reloadClinics,
  } = useLoad(listClinics);
  const patientName = patient?.name.trim();
  const recommendedClinics = getUniqueClinics(clinics).slice(0, 3);
  const goToSearch = () => navigation.navigate("Buscar");

  function openClinic(clinicId: number) {
    navigation.navigate("Agendamento", {
      screen: "DetalhesClinica",
      params: { clinicId },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>

        <Text className="text-2xl font-bold text-slate-800">
          Olá{patientName ? `, ${patientName}` : ""}!
        </Text>
        <Text className="mt-1 text-sm text-slate-500">Encontre o cuidado ideal para você</Text>
        {error ? <ErrorBox message={error} onRetry={reload} /> : null}

        <View className="mt-4 h-12 flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            placeholder="Buscar clínica ou especialidade..."
            placeholderTextColor="#94A3B8"
            className="ml-2 flex-1 text-sm"
            onFocus={goToSearch}
          />
        </View>

        <View className="mt-5 flex-row items-center justify-between">
          <Text className="text-sm font-bold text-slate-800">Atalhos Rápidos</Text>
          <Text className="text-sm font-semibold text-blue-500">Ver todos</Text>
        </View>

        <View className="mt-3 flex-row gap-3">
          <PatientQuickAction icon="location-outline" label="Clínicas Próximas" onPress={goToSearch} />
          <PatientQuickAction icon="calendar-outline" label="Minhas Consultas" onPress={() => navigation.navigate("Consultas")} />
          <PatientQuickAction icon="medkit-outline" label="Especialidades" onPress={goToSearch} />
        </View>

        <Text className="mt-6 text-sm font-bold text-slate-800">Especialidades Populares</Text>
        <View className="mt-3 flex-row flex-wrap gap-3">
          {popularSpecialties.map((specialty) => (
            <TouchableOpacity key={specialty} onPress={goToSearch}>
              <Text className="text-sm font-semibold text-blue-500">{specialty}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-sm font-bold text-slate-800">Clínicas Recomendadas</Text>
          <Text className="text-sm font-semibold text-blue-500">Ver mais</Text>
        </View>
        <View className="mt-3">
          {clinicsLoading ? (
            <Loading />
          ) : clinicsError ? (
            <ErrorBox message={clinicsError} onRetry={reloadClinics} />
          ) : recommendedClinics.length === 0 ? (
            <Text className="py-6 text-center text-sm text-slate-400">
              Nenhuma clínica cadastrada no momento.
            </Text>
          ) : (
            recommendedClinics.map((clinic) => (
              <PatientClinicCard
                key={clinic.id}
                clinic={clinic}
                onPress={() => openClinic(clinic.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
