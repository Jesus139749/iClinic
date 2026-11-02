import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ReactNode } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AgendamentoStackParamList } from "../../../../routes/navigationTypes";
import { clinicasMock } from "../data/clinicasMock";

type Props = NativeStackScreenProps<
  AgendamentoStackParamList,
  "DetalhesClinica"
>;

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View className="mt-6">
      <Text className="mb-3 text-base font-bold text-slate-800">{titulo}</Text>
      {children}
    </View>
  );
}

export default function DetalhesClinicaScreen({ route }: Props) {
  const clinica = clinicasMock.find(
    (item) => item.id === route.params.clinicaId,
  );

  if (!clinica) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Ionicons name="medical-outline" size={40} color="#94A3B8" />
        <Text className="mt-3 text-center text-base text-slate-600">
          Não foi possível encontrar os detalhes desta clínica.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: clinica.imagemUrl }}
          className="h-56 w-full bg-slate-200"
          resizeMode="cover"
          accessibilityLabel={`Imagem de ${clinica.nome}`}
        />

        <View className="-mt-5 rounded-t-3xl bg-slate-50 px-6 pt-5">
          <View className="flex-row items-start justify-between">
            <View className="mr-3 flex-1">
              <Text className="text-2xl font-bold text-slate-800">
                {clinica.nome}
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                {clinica.endereco}
              </Text>
            </View>
            <View className="flex-row items-center rounded-full bg-amber-50 px-2.5 py-1">
              <Ionicons name="star" size={15} color="#F59E0B" />
              <Text className="ml-1 text-sm font-bold text-slate-800">
                {clinica.nota.toFixed(1)}
              </Text>
            </View>
          </View>

          <Text className="mt-1 text-xs text-slate-400">
            {clinica.avaliacoes} avaliações
          </Text>

          <Secao titulo="Informações">
            <View className="rounded-2xl border border-slate-200 bg-white px-4">
              <View className="flex-row items-center border-b border-slate-100 py-3">
                <Ionicons name="location-outline" size={20} color="#2F80ED" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-slate-400">Endereço</Text>
                  <Text className="mt-0.5 text-sm font-medium text-slate-700">
                    {clinica.endereco}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center border-b border-slate-100 py-3">
                <Ionicons name="call-outline" size={20} color="#2F80ED" />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-slate-400">Telefone</Text>
                  <Text className="mt-0.5 text-sm font-medium text-slate-700">
                    {clinica.telefone}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start py-3">
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#2F80ED"
                  style={{ marginTop: 2 }}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-xs text-slate-400">
                    Horário de funcionamento
                  </Text>
                  {clinica.horarioFuncionamento.map((horario) => (
                    <Text
                      key={horario}
                      className="mt-0.5 text-sm font-medium text-slate-700"
                    >
                      {horario}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </Secao>

          <Secao titulo="Especialidades">
            <View className="flex-row flex-wrap gap-2">
              {clinica.especialidades.map((especialidade) => (
                <View
                  key={especialidade}
                  className="rounded-full bg-blue-50 px-3 py-2"
                >
                  <Text className="text-sm font-semibold text-blue-600">
                    {especialidade}
                  </Text>
                </View>
              ))}
            </View>
          </Secao>

          <Secao titulo="Médicos da clínica">
            <View className="gap-3">
              {clinica.medicos.map((medico) => (
                <View
                  key={medico.id}
                  className="flex-row items-center rounded-2xl border border-slate-200 bg-white p-3"
                >
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                    <Ionicons name="person-outline" size={21} color="#2F80ED" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-sm font-bold text-slate-800">
                      {medico.nome}
                    </Text>
                    <Text className="mt-0.5 text-xs text-slate-500">
                      {medico.especialidade}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Secao>

          <Secao titulo="Próximos horários livres">
            <View className="flex-row flex-wrap gap-2">
              {clinica.horariosDisponiveis.map((horario) => (
                <View
                  key={horario}
                  className="rounded-xl border border-blue-100 bg-white px-3 py-2"
                >
                  <Text className="text-sm font-semibold text-blue-600">
                    {horario}
                  </Text>
                </View>
              ))}
              {clinica.horariosAdicionais > 0 && (
                <View className="justify-center rounded-xl bg-slate-100 px-3 py-2">
                  <Text className="text-sm font-medium text-slate-500">
                    +{clinica.horariosAdicionais} horários
                  </Text>
                </View>
              )}
            </View>
          </Secao>

          <Secao titulo="Diferenciais da unidade">
            <View className="gap-2">
              {clinica.diferenciais.map((diferencial) => (
                <View key={diferencial} className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={18} color="#2F80ED" />
                  <Text className="ml-2 text-sm text-slate-600">
                    {diferencial}
                  </Text>
                </View>
              ))}
            </View>
          </Secao>
        </View>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white px-6 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          disabled
          className="items-center rounded-xl bg-[#2F80ED] py-3.5 opacity-60"
        >
          <Text className="text-base font-bold text-white">
            Agendar Consulta
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
