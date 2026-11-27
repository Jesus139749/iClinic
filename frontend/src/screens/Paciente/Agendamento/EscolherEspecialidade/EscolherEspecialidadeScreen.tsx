import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  "EscolherEspecialidade"
>;

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const estilosEspecialidades: {
  termos: string[];
  icone: IconName;
  fundo: string;
  cor: string;
}[] = [
  {
    termos: ["cardiologia", "cardio"],
    icone: "heart-pulse",
    fundo: "#E8F1FF",
    cor: "#2F80ED",
  },
  {
    termos: ["neurologia", "neuro"],
    icone: "brain",
    fundo: "#F1EAFE",
    cor: "#7C3AED",
  },
  {
    termos: ["nutricao"],
    icone: "leaf",
    fundo: "#E8F7ED",
    cor: "#16A34A",
  },
  {
    termos: ["ortopedia", "ortoped"],
    icone: "bone",
    fundo: "#FFF3E8",
    cor: "#EA7A24",
  },
  {
    termos: ["pediatria", "pediatr"],
    icone: "baby-face-outline",
    fundo: "#FDEBF2",
    cor: "#DB4F84",
  },
  {
    termos: ["oftalmologia", "oftalmo"],
    icone: "eye",
    fundo: "#E6F7F8",
    cor: "#1596A0",
  },
  {
    termos: ["odontologia", "dentista"],
    icone: "tooth-outline",
    fundo: "#E8F1FF",
    cor: "#2F80ED",
  },
  {
    termos: ["pneumologia", "pneumo"],
    icone: "lungs",
    fundo: "#FDEBF2",
    cor: "#DB4F84",
  },
  {
    termos: ["otorrinolaringologia", "otorrino"],
    icone: "ear-hearing",
    fundo: "#F1EAFE",
    cor: "#7C3AED",
  },
];

function obterEstiloEspecialidade(especialidade: string) {
  const normalizada = especialidade
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
  const estilo = estilosEspecialidades.find(({ termos }) =>
    termos.some((termo) => normalizada.includes(termo)),
  );

  return (
    estilo ?? {
      icone: "stethoscope" as const,
      fundo: "#E8F1FF",
      cor: "#2F80ED",
    }
  );
}

export default function EscolherEspecialidadeScreen({
  route,
  navigation,
}: Props) {
  const { clinicaId } = route.params;
  const [clinica, setClinica] = useState<ClinicDetail | null>(null);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<
    string | null
  >(null);
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

  const especialidades = useMemo(() => {
    if (!clinica) return [];

    const unicas = new Map<string, string>();
    clinica.doctors
      .flatMap((medico) => medico.specialties)
      .map((especialidade) => especialidade.trim())
      .filter(Boolean)
      .forEach((especialidade) => {
        const chave = especialidade.toLocaleLowerCase("pt-BR");
        if (!unicas.has(chave)) unicas.set(chave, especialidade);
      });

    return Array.from(unicas.values()).sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );
  }, [clinica]);

  if (carregando) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F5F9FE]">
        <ActivityIndicator color="#2F80ED" />
      </SafeAreaView>
    );
  }

  if (!clinica) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F5F9FE] px-6">
        <Ionicons name="medical-outline" size={40} color="#94A3B8" />
        <Text className="mt-3 text-center text-base text-slate-600">
          {erro ?? "Não foi possível encontrar esta clínica."}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          className="mt-5 rounded-xl bg-[#2F80ED] px-6 py-3"
        >
          <Text className="font-bold text-white">Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const continuar = () => {
    if (!especialidadeSelecionada) return;

    Alert.alert(
      "Próxima etapa indisponível",
      "A escolha de médico ainda não foi implementada. Sua clínica e especialidade selecionadas estão prontas para essa etapa.",
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F9FE]" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-6"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()}
          className="mb-5 mt-3 h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="arrow-back" size={21} color="#2F80ED" />
        </Pressable>

        <Text className="text-2xl font-extrabold text-slate-800">
          Escolha uma especialidade
        </Text>
        <Text className="mt-2 text-sm leading-5 text-slate-500">
          Selecione a área de atendimento para encontrar o profissional ideal.
        </Text>

        <View className="mt-5 flex-row items-center rounded-2xl bg-white px-4 py-3">
          <Ionicons name="business-outline" size={18} color="#2F80ED" />
          <Text className="ml-2 flex-1 text-sm font-semibold text-slate-700">
            {clinica.name}
          </Text>
        </View>

        <Text className="mb-3 mt-7 text-base font-bold text-slate-800">
          Especialidades disponíveis
        </Text>

        {especialidades.length === 0 ? (
          <Text className="rounded-2xl bg-white px-4 py-5 text-sm text-slate-500">
            Esta clínica ainda não possui especialidades vinculadas a médicos.
          </Text>
        ) : (
          especialidades.map((especialidade) => {
            const selecionada = especialidadeSelecionada === especialidade;
            const estiloIcone = obterEstiloEspecialidade(especialidade);

            return (
              <Pressable
                key={especialidade}
                accessibilityRole="radio"
                accessibilityState={{ checked: selecionada }}
                onPress={() => setEspecialidadeSelecionada(especialidade)}
                className={`mb-3 flex-row items-center rounded-2xl border px-4 py-4 ${
                  selecionada
                    ? "border-[#2F80ED] bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: estiloIcone.fundo }}
                >
                  <MaterialCommunityIcons
                    name={estiloIcone.icone}
                    size={24}
                    color={estiloIcone.cor}
                  />
                </View>
                <Text className="ml-4 flex-1 text-sm font-semibold text-slate-800">
                  {especialidade}
                </Text>
                <Ionicons
                  name={selecionada ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={selecionada ? "#2F80ED" : "#CBD5E1"}
                />
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <View className="border-t border-slate-200 bg-white px-5 py-3">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !especialidadeSelecionada }}
          disabled={!especialidadeSelecionada}
          onPress={continuar}
          className={`items-center rounded-xl py-3.5 ${
            especialidadeSelecionada
              ? "bg-[#2F80ED]"
              : "bg-[#2F80ED] opacity-50"
          }`}
        >
          <Text className="text-base font-bold text-white">Continuar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
