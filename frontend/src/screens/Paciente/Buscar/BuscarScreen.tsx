import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../../components/Feedback";
import { getRequestErrorMessage } from "../../../services/apiClient";
import { listClinics, type ClinicListItem } from "../../../services/clinicSearchService";
import type { ClinicCardProps } from "./interfaces/ClinicCardProps";
import type { SearchNavigation } from "./interfaces/SearchNavigation";

function ClinicCard({ clinic, onPress }: ClinicCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Ver detalhes de ${clinic.name}`}
      onPress={onPress}
      className="mb-4 flex-row rounded-2xl border border-slate-200 bg-white p-3"
    >
      {clinic.image ? (
        <Image source={{ uri: clinic.image }} className="h-16 w-16 rounded-xl bg-slate-200" resizeMode="cover" />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-xl bg-slate-200">
          <Ionicons name="medkit-outline" size={26} color="#64748B" />
        </View>
      )}

      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-slate-800">{clinic.name}</Text>
        {clinic.specialties.length > 0 ? (
          <Text className="mt-0.5 text-xs text-slate-500">{clinic.specialties.join(" · ")}</Text>
        ) : null}
        <Text className="mt-0.5 text-xs text-slate-500">{clinic.address}</Text>
      </View>
    </Pressable>
  );
}

export default function BuscarScreen() {
  const navigation = useNavigation<SearchNavigation>();
  const [search, setSearch] = useState("");
  const [clinics, setClinics] = useState<ClinicListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Espera o usuário parar de digitar (300 ms) antes de consultar a API.
  useEffect(() => {
    let current = true;
    setLoading(true);

    const timer = setTimeout(() => {
      listClinics(search)
        .then((result) => {
          if (!current) return;
          setClinics(result);
          setError(null);
        })
        .catch((e) => current && setError(getRequestErrorMessage(e)))
        .finally(() => current && setLoading(false));
    }, 300);

    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [search]);

  function openClinic(clinic: ClinicListItem) {
    navigation.navigate("Agendamento", {
      screen: "DetalhesClinica",
      params: { clinicId: clinic.id },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View className="mt-3 h-12 flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar clínica ou especialidade..."
            placeholderTextColor="#94A3B8"
            className="ml-2 flex-1 text-sm"
          />
          {search ? (
            <Pressable onPress={() => setSearch("")} hitSlop={8} accessibilityLabel="Limpar busca">
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          ) : null}
        </View>

        {loading ? (
          <Loading />
        ) : error ? (
          <Text className="mt-10 text-center text-red-500">{error}</Text>
        ) : (
          <>
            <Text className="mb-3 mt-4 text-right text-xs text-slate-400">{clinics.length} resultados</Text>
            {clinics.length === 0 ? (
              <Text className="mt-10 text-center text-slate-400">Nenhuma clínica encontrada.</Text>
            ) : (
              clinics.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} onPress={() => openClinic(clinic)} />
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
