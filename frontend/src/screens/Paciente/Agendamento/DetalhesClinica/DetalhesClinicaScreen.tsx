import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AgendamentoStackParamList } from "../../../../routes/navigationTypes";
import { getRequestErrorMessage } from "../../../../services/apiClient";
import type { ClinicDetail } from "../../../../services/clinicSearchService";
import { getClinic } from "../../../../services/clinicSearchService";

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

export default function DetalhesClinicaScreen({ route, navigation }: Props) {
  const { clinicaId } = route.params;
  const [clinica, setClinica] = useState<ClinicDetail | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro(null);

    getClinic(clinicaId)
      .then((resultado) => {
        if (!cancelado) setClinica(resultado);
      })
      .catch((error) => {
        if (!cancelado) setErro(getRequestErrorMessage(error));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [clinicaId]);

  if (carregando) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#2F80ED" />
      </SafeAreaView>
    );
  }

  if (!clinica) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Ionicons name="medical-outline" size={40} color="#94A3B8" />
        <Text className="mt-3 text-center text-base text-slate-600">
          {erro ?? "Não foi possível encontrar os detalhes desta clínica."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F9FE]" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-6"
      >
        {/* Imagem principal */}
        <View className="relative">
          {clinica.image ? (
            <Image
              source={{ uri: clinica.image }}
              className="h-64 w-full bg-slate-200"
              resizeMode="cover"
              accessibilityLabel={`Imagem de ${clinica.name}`}
            />
          ) : (
            <View className="h-64 w-full items-center justify-center bg-slate-200">
              <Ionicons name="medkit-outline" size={56} color="#64748B" />
            </View>
          )}

          <View className="absolute left-5 top-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => navigation.goBack()}
              className="h-10 w-10 items-center justify-center rounded-full bg-white"
            >
              <Ionicons name="arrow-back" size={21} color="#2F80ED" />
            </Pressable>
          </View>
        </View>

        {/* Conteúdo principal */}
        <View className="-mt-5 rounded-t-3xl bg-[#F5F9FE] px-5 pt-5">
          <View className="rounded-2xl bg-white px-4 py-4">
            <Text className="text-xl font-extrabold text-slate-800">
              {clinica.name}
            </Text>

            <View className="mt-3 flex-row items-start">
              <Ionicons name="location" size={15} color="#2F80ED" />
              <Text className="ml-2 flex-1 text-xs text-slate-600">
                {clinica.address}
              </Text>
            </View>

            {clinica.phone && (
              <View className="mt-3 flex-row flex-wrap items-center gap-2">
                <View className="flex-row items-center rounded-full bg-blue-50 px-3 py-2">
                  <Ionicons name="call" size={13} color="#2F80ED" />
                  <Text className="ml-1.5 text-xs font-medium text-blue-600">
                    {clinica.phone}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Especialidades */}
          {clinica.specialties.length > 0 && (
            <Secao titulo="Especialidades disponíveis">
              <View className="flex-row flex-wrap gap-2">
                {clinica.specialties.map((especialidade) => (
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
          )}

          {/* Médicos */}
          <Secao titulo="Médicos no local">
            {clinica.doctors.length === 0 ? (
              <Text className="text-sm text-slate-400">
                Nenhum médico cadastrado.
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-3"
              >
                {clinica.doctors.map((medico) => (
                  <View
                    key={medico.id}
                    className="w-36 items-center rounded-2xl bg-white px-3 py-4"
                  >
                    {medico.image ? (
                      <Image
                        source={{ uri: medico.image }}
                        className="h-16 w-16 rounded-full bg-blue-50"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                        <Ionicons
                          name="person-outline"
                          size={30}
                          color="#438BFF"
                        />
                      </View>
                    )}

                    <Text
                      className="mt-3 text-center text-sm font-bold text-slate-800"
                      numberOfLines={2}
                    >
                      {medico.name}
                    </Text>

                    <Text
                      className="mt-1 text-center text-xs text-blue-500"
                      numberOfLines={2}
                    >
                      {medico.specialties.join(", ")}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
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
