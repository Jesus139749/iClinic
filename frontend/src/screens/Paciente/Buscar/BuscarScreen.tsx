import { Ionicons } from "@expo/vector-icons";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type {
  RootStackParamList,
  PacienteTabParamList,
} from "../../../routes/navigationTypes";
import { getRequestErrorMessage } from "../../../services/apiClient";
import type { ClinicListItem } from "../../../services/clinicSearchService";
import { listClinics } from "../../../services/clinicSearchService";

type BuscarNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<PacienteTabParamList, "Buscar">,
  NativeStackNavigationProp<RootStackParamList>
>;

function ClinicaBuscaCard({
  clinica,
  onPress,
}: {
  clinica: ClinicListItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${clinica.name}`}
      onPress={onPress}
      className="mb-4 flex-row rounded-2xl border border-slate-200 bg-white p-3"
    >
      {clinica.image ? (
        <Image
          source={{ uri: clinica.image }}
          className="h-16 w-16 rounded-xl bg-slate-200"
          resizeMode="cover"
        />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-xl bg-slate-200">
          <Ionicons name="medkit-outline" size={26} color="#64748B" />
        </View>
      )}

      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-slate-800">
          {clinica.name}
        </Text>

        {clinica.specialties.length > 0 && (
          <Text className="mt-0.5 text-xs text-slate-500">
            {clinica.specialties.join(" · ")}
          </Text>
        )}

        <Text className="mt-0.5 text-xs text-slate-500">
          {clinica.address}
        </Text>
      </View>
    </Pressable>
  );
}

export default function BuscarPacienteScreen() {
  const [busca, setBusca] = useState("");
  const [clinicas, setClinicas] = useState<ClinicListItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigation = useNavigation<BuscarNavigationProp>();

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);

    // Debounce para não consultar a API a cada tecla digitada.
    const timer = setTimeout(async () => {
      try {
        const resultado = await listClinics(busca);
        if (!cancelado) {
          setClinicas(resultado);
          setErro(null);
        }
      } catch (error) {
        if (!cancelado) {
          setErro(getRequestErrorMessage(error));
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }, 300);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [busca]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-3 h-12 flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar clínica ou especialidade..."
            placeholderTextColor="#94A3B8"
            className="ml-2 flex-1 text-sm"
          />
          {busca.length > 0 && (
            <Pressable onPress={() => setBusca("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        <View className="mb-3 mt-4 flex-row items-center justify-end">
          {!carregando && !erro && (
            <Text className="text-xs text-slate-400">
              {clinicas.length} resultados
            </Text>
          )}
        </View>

        {carregando && <ActivityIndicator className="mt-10" color="#2F80ED" />}

        {!carregando && erro && (
          <Text className="mt-10 text-center text-red-500">{erro}</Text>
        )}

        {!carregando &&
          !erro &&
          clinicas.map((clinica) => (
            <ClinicaBuscaCard
              key={clinica.id}
              clinica={clinica}
              onPress={() =>
                navigation.navigate("Agendamento", {
                  screen: "DetalhesClinica",
                  params: { clinicaId: clinica.id },
                })
              }
            />
          ))}

        {!carregando && !erro && clinicas.length === 0 && (
          <Text className="mt-10 text-center text-slate-400">
            Nenhuma clínica encontrada.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
