import { Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PatientTabParamList } from "../../../routes/navigationTypes";
import { PatientClinicCard } from "./components/ClinicaCardPaciente";
import type { PatientClinicCardProps } from "./components/interfaces/PatientClinicCardProps";
import { PatientQuickAction } from "./components/QuickActionPaciente";

// Dados fictícios até o backend expor recomendações.
const popularSpecialties = ["Clínico Geral", "Dermatologia", "Ortopedia", "Cardiologia", "Pediatria"];

const recommendedClinics: PatientClinicCardProps[] = [
  {
    name: "Clínica Vida Plena",
    imageUrl: "https://placehold.co/80x80",
    distanceKm: 1.2,
    hours: "08h-20h",
    rating: 4.8,
    specialties: ["Clínico Geral", "Dermatologia", "Ortopedia"],
    nextAvailable: "Hoje, 14:30",
    actionLabel: "Ver Detalhes",
  },
  {
    name: "Centro Médico São Lucas",
    imageUrl: "https://placehold.co/80x80",
    distanceKm: 2.8,
    hours: "07h-19h",
    rating: 4.6,
    specialties: ["Cardiologia", "Pediatria"],
    nextAvailable: "Amanhã, 09:00",
    actionLabel: "Ver Detalhes",
  },
];

export default function DashboardPacienteScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<PatientTabParamList>>();
  const goToSearch = () => navigation.navigate("Buscar");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="mt-2 text-xs text-slate-400">São Paulo, SP</Text>
        <Text className="text-2xl font-bold text-slate-800">Olá, Mariana! 👋</Text>
        <Text className="mt-1 text-sm text-slate-500">Encontre o cuidado ideal para você</Text>

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
          {recommendedClinics.map((clinic) => (
            <PatientClinicCard key={clinic.name} {...clinic} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
