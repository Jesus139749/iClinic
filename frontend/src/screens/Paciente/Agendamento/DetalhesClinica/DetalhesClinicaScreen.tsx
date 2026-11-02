
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

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <View className="mt-7">
      <Text className="mb-3 text-base font-bold text-slate-800">
        {titulo}
      </Text>
      {children}
    </View>
  );
}

function getIniciais(nome: string): string {
  return nome
    .replace(/^(Dra?\.|Dr\.|Dra\.)\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0] ?? "")
    .join("")
    .toUpperCase();
}

export default function DetalhesClinicaScreen({ route }: Props) {
  const clinica = clinicasMock.find(
    (item) => item.id === route.params.clinicaId
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
    <SafeAreaView
      className="flex-1 bg-[#F5F9FE]"
      edges={["bottom"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-6"
      >
        {/* Imagem principal */}
        <View className="relative">
          <Image
            source={{ uri: clinica.imagemUrl }}
            className="h-64 w-full bg-slate-200"
            resizeMode="cover"
            accessibilityLabel={`Imagem de ${clinica.nome}`}
          />

          <View className="absolute left-5 right-5 top-4 flex-row justify-between">
            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <Ionicons name="arrow-back" size={21} color="#2F80ED" />
            </Pressable>

            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <Ionicons name="heart-outline" size={21} color="#64748B" />
            </Pressable>
          </View>
        </View>

        {/* Conteúdo principal */}
        <View className="-mt-5 rounded-t-3xl bg-[#F5F9FE] px-5 pt-5">

          {/* Nome e avaliação */}
          <View className="rounded-2xl bg-white px-4 py-4">
            <Text className="text-xl font-extrabold text-slate-800">
              {clinica.nome}
            </Text>

            <View className="mt-2 flex-row items-center">
              <Ionicons name="star" size={16} color="#F5B301" />

              <Text className="ml-1 text-sm font-bold text-slate-800">
                {clinica.nota.toFixed(1)}
              </Text>

              <Text className="ml-1 text-xs text-slate-400">
                ({clinica.avaliacoes} avaliações)
              </Text>
            </View>

            <View className="mt-3 flex-row items-start">
              <Ionicons
                name="location"
                size={15}
                color="#2F80ED"
              />
              <Text className="ml-2 flex-1 text-xs text-slate-600">
                {clinica.endereco}
              </Text>
            </View>

            <View className="mt-3 flex-row items-center">
              <View className="flex-row items-center">
                <View className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                <Text className="text-xs font-semibold text-emerald-600">
                  {clinica.status}
                </Text>
              </View>
            </View>

            <View className="mt-3 flex-row flex-wrap items-center gap-2">
              <View className="flex-row items-center rounded-full bg-blue-50 px-3 py-2">
                <Ionicons name="call" size={13} color="#2F80ED" />
                <Text className="ml-1.5 text-xs font-medium text-blue-600">
                  {clinica.telefone}
                </Text>
              </View>
            </View>
          </View>

          {/* Informações */}
          <Secao titulo="Informações">
            <View className="rounded-2xl border border-slate-200 bg-white px-4">
              <View className="flex-row items-center border-b border-slate-100 py-3.5">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                  <Ionicons name="location-outline" size={19} color="#438BFF" />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-slate-400">Endereço</Text>
                  <Text className="mt-0.5 text-sm font-semibold text-slate-700">
                    {clinica.endereco}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center border-b border-slate-100 py-3.5">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                  <Ionicons name="call-outline" size={19} color="#438BFF" />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-slate-400">Telefone</Text>
                  <Text className="mt-0.5 text-sm font-semibold text-slate-700">
                    {clinica.telefone}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-start py-3.5">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                  <Ionicons name="time-outline" size={19} color="#438BFF" />
                </View>

                <View className="ml-3 flex-1">
                  <Text className="text-xs text-slate-400">
                    Horário de funcionamento
                  </Text>

                  {clinica.horarioFuncionamento.map((horario) => (
                    <Text
                      key={horario}
                      className="mt-1 text-sm font-semibold text-slate-700"
                    >
                      {horario}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </Secao>

          {/* Especialidades */}
          <Secao titulo="Especialidades disponíveis">
            <View className="flex-row flex-wrap gap-2">
              {clinica.especialidades.map((especialidade) => (
                <View
                  key={especialidade}
                  className="flex-row items-center rounded-xl bg-white px-3 py-2.5"
                >
                  <Ionicons name="medkit" size={15} color="#438BFF" />
                  <Text className="ml-2 text-xs font-medium text-slate-700">
                    {especialidade}
                  </Text>
                </View>
              ))}
            </View>
          </Secao>

          {/* Médicos */}
          <Secao titulo="Médicos no local">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              {clinica.medicos.map((medico) => (
                <View
                  key={medico.id}
                  className="w-36 items-center rounded-2xl bg-white px-3 py-4"
                >
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <Ionicons name="person-outline" size={30} color="#438BFF" />
                  </View>

                  <Text
                    className="mt-3 text-center text-sm font-bold text-slate-800"
                    numberOfLines={2}
                  >
                    {medico.nome}
                  </Text>

                  <Text
                    className="mt-1 text-center text-xs text-blue-500"
                    numberOfLines={2}
                  >
                    {medico.especialidade}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </Secao>

          {/* Horários */}
          <Secao titulo="Próximos horários livres">
            <View className="gap-3">
              {clinica.medicos.map((medico) => (
                <View
                  key={medico.id}
                  className="rounded-2xl bg-white p-4"
                >
                  <View className="flex-row items-center">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <Ionicons name="person-outline" size={21} color="#438BFF" />
                    </View>

                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-bold text-slate-800">
                        {medico.nome}
                      </Text>
                      <Text className="mt-0.5 text-xs text-slate-400">
                        {medico.especialidade}
                      </Text>
                    </View>

                    <View className="rounded-lg bg-blue-50 px-2.5 py-1.5">
                      <Text className="text-xs font-semibold text-blue-600">
                        Disponível
                      </Text>
                    </View>
                  </View>

                  <View className="mt-3 flex-row flex-wrap gap-2">
                    {medico.horariosDisponiveis.map((horario) => (
                      <View
                        key={horario}
                        className="rounded-lg border border-blue-300 bg-white px-3 py-2"
                      >
                        <Text className="text-xs font-semibold text-blue-600">
                          {horario}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </Secao>

          {/* Diferenciais */}
          <Secao titulo="Diferenciais da unidade">
            <View className="gap-3 rounded-2xl bg-white p-4">
              {clinica.diferenciais.map((diferencial) => (
                <View
                  key={diferencial}
                  className="flex-row items-center"
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={19}
                    color="#438BFF"
                  />
                  <Text className="ml-2.5 text-sm text-slate-600">
                    {diferencial}
                  </Text>
                </View>
              ))}
            </View>
          </Secao>
        </View>
      </ScrollView>

      {/* Botão inferior: comportamento mantido */}
      <View className="border-t border-slate-200 bg-white px-5 py-3">
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
