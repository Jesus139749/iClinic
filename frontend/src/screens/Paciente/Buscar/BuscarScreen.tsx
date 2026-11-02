import { Ionicons } from "@expo/vector-icons";
import type { CompositeNavigationProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type {
  RootStackParamList,
  PacienteTabParamList,
} from "../../../routes/navigationTypes";
import type {
  ClinicaStatus,
  ClinicaPaciente,
} from "../Agendamento/data/clinicasMock";
import { clinicasMock } from "../Agendamento/data/clinicasMock";

const estiloStatus: Record<
  ClinicaStatus,
  { badge: string; texto: string; chip: string; chipTexto: string }
> = {
  Aberta: {
    badge: "bg-green-50",
    texto: "text-green-600",
    chip: "bg-blue-100",
    chipTexto: "text-blue-600",
  },
  Lotada: {
    badge: "bg-orange-50",
    texto: "text-orange-500",
    chip: "bg-orange-100",
    chipTexto: "text-orange-500",
  },
  Fechada: {
    badge: "bg-slate-100",
    texto: "text-slate-500",
    chip: "bg-slate-100",
    chipTexto: "text-slate-500",
  },
};

type BuscarNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<PacienteTabParamList, "Buscar">,
  NativeStackNavigationProp<RootStackParamList>
>;

function ClinicaBuscaCard({
  clinica,
  onPress,
}: {
  clinica: ClinicaPaciente;
  onPress: () => void;
}) {
  const estilo = estiloStatus[clinica.status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${clinica.nome}`}
      onPress={onPress}
      className="mb-4 flex-row rounded-2xl border border-slate-200 bg-white p-3"
    >
      <View className="h-16 w-16 items-center justify-center rounded-xl bg-slate-200">
        <Ionicons name="medkit-outline" size={26} color="#64748B" />
      </View>

      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="mr-2 flex-1 text-base font-bold text-slate-800">
            {clinica.nome}
          </Text>
          <View className={`rounded-full px-2 py-0.5 ${estilo.badge}`}>
            <Text className={`text-xs font-semibold ${estilo.texto}`}>
              {clinica.status}
            </Text>
          </View>
        </View>

        <Text className="mt-0.5 text-xs text-slate-500">
          {clinica.especialidades.join(" · ")}
        </Text>

        <Text className="mt-0.5 text-xs text-slate-500">
          {clinica.endereco} · {clinica.distanciaKm} km
        </Text>

        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text className="text-sm font-bold text-slate-800">
            {clinica.nota}
          </Text>
          <Text className="text-xs text-slate-400">
            ({clinica.avaliacoes} avaliações)
          </Text>
        </View>

        <View className="mt-2 flex-row flex-wrap gap-2">
          {clinica.horariosDisponiveis.map((horario) => (
            <View
              key={horario}
              className={`rounded-lg px-2 py-1.5 ${estilo.chip}`}
            >
              <Text className={`text-xs font-semibold ${estilo.chipTexto}`}>
                {horario}
              </Text>
            </View>
          ))}
          {clinica.horariosAdicionais > 0 && (
            <View className="rounded-lg bg-slate-100 px-2 py-1.5">
              <Text className="text-xs font-semibold text-slate-500">
                +{clinica.horariosAdicionais}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function BuscarPacienteScreen() {
  const [busca, setBusca] = useState("");
  const navigation = useNavigation<BuscarNavigationProp>();

  const resultados = clinicasMock.filter((clinica) =>
    `${clinica.nome} ${clinica.especialidades.join(" ")}`
      .toLowerCase()
      .includes(busca.trim().toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
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

        {/* Filtros: por enquanto só visuais */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ gap: 8 }}
        >
          <View className="rounded-full bg-[#2F80ED] px-3 py-1.5">
            <Text className="text-xs font-semibold text-white">
              Cardiologia
            </Text>
          </View>
          <View className="rounded-full bg-[#2F80ED] px-3 py-1.5">
            <Text className="text-xs font-semibold text-white">Até 10 km</Text>
          </View>
          <View className="rounded-full border border-slate-300 bg-white px-3 py-1.5">
            <Text className="text-xs font-semibold text-slate-600">
              Horário
            </Text>
          </View>
          <View className="rounded-full border border-slate-300 bg-white px-3 py-1.5">
            <Text className="text-xs font-semibold text-slate-600">Data</Text>
          </View>
        </ScrollView>

        <View className="mb-3 mt-4 flex-row items-center justify-between">
          <Pressable onPress={() => setBusca("")}>
            <Text className="text-xs font-semibold text-blue-500">
              Limpar filtros
            </Text>
          </Pressable>
          <Text className="text-xs text-slate-400">
            {resultados.length} resultados
          </Text>
        </View>

        {resultados.map((clinica) => (
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

        {resultados.length === 0 && (
          <Text className="mt-10 text-center text-slate-400">
            Nenhuma clínica encontrada.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
