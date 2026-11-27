import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../../../components/Feedback";
import { useLoad } from "../../../../hooks/useLoad";
import { getClinic, type ClinicDetail } from "../../../../services/clinicSearchService";
import { normalize } from "../../../../utils/format";
import type { SelectSpecialtyProps } from "./interfaces/SelectSpecialtyProps";
import type { SpecialtyStyle } from "./interfaces/SpecialtyStyle";
import type { SpecialtyStyleRule } from "./interfaces/SpecialtyStyleRule";

const SPECIALTY_STYLES: SpecialtyStyleRule[] = [
  { terms: ["cardiologia", "cardio"], icon: "heart-pulse", background: "#E8F1FF", color: "#2F80ED" },
  { terms: ["neurologia", "neuro"], icon: "brain", background: "#F1EAFE", color: "#7C3AED" },
  { terms: ["nutricao"], icon: "leaf", background: "#E8F7ED", color: "#16A34A" },
  { terms: ["ortopedia", "ortoped"], icon: "bone", background: "#FFF3E8", color: "#EA7A24" },
  { terms: ["pediatria", "pediatr"], icon: "baby-face-outline", background: "#FDEBF2", color: "#DB4F84" },
  { terms: ["oftalmologia", "oftalmo"], icon: "eye", background: "#E6F7F8", color: "#1596A0" },
  { terms: ["odontologia", "dentista"], icon: "tooth-outline", background: "#E8F1FF", color: "#2F80ED" },
  { terms: ["pneumologia", "pneumo"], icon: "lungs", background: "#FDEBF2", color: "#DB4F84" },
  { terms: ["otorrinolaringologia", "otorrino"], icon: "ear-hearing", background: "#F1EAFE", color: "#7C3AED" },
];

const DEFAULT_STYLE: SpecialtyStyle = { icon: "stethoscope", background: "#E8F1FF", color: "#2F80ED" };

function getSpecialtyStyle(specialty: string): SpecialtyStyle {
  const name = normalize(specialty);
  return SPECIALTY_STYLES.find(({ terms }) => terms.some((term) => name.includes(term))) ?? DEFAULT_STYLE;
}

/** Especialidades dos médicos da clínica, sem repetição e em ordem alfabética. */
function getClinicSpecialties(clinic: ClinicDetail): string[] {
  const unique = new Map<string, string>();

  for (const doctor of clinic.doctors) {
    for (const specialty of doctor.specialties) {
      const name = specialty.trim();
      const key = name.toLocaleLowerCase("pt-BR");
      if (name && !unique.has(key)) unique.set(key, name);
    }
  }

  return [...unique.values()].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export default function EscolherEspecialidadeScreen({ route, navigation }: SelectSpecialtyProps) {
  const { clinicId } = route.params;
  const { data: clinic, loading, error } = useLoad(() => getClinic(clinicId), [clinicId]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  if (loading) return <Loading fullScreen />;

  if (!clinic) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F5F9FE] px-6">
        <Ionicons name="medical-outline" size={40} color="#94A3B8" />
        <Text className="mt-3 text-center text-base text-slate-600">
          {error ?? "Não foi possível encontrar esta clínica."}
        </Text>
        <Pressable onPress={() => navigation.goBack()} className="mt-5 rounded-xl bg-[#2F80ED] px-6 py-3">
          <Text className="font-bold text-white">Voltar</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const specialties = getClinicSpecialties(clinic);

  function handleContinue() {
    if (!selectedSpecialty) return;

    navigation.navigate("EscolherMedico", { clinicId, specialty: selectedSpecialty });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F9FE]" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6">
        <Pressable
          accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()}
          className="mb-5 mt-3 h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="arrow-back" size={21} color="#2F80ED" />
        </Pressable>

        <Text className="text-2xl font-extrabold text-slate-800">Escolha uma especialidade</Text>
        <Text className="mt-2 text-sm leading-5 text-slate-500">
          Selecione a área de atendimento para encontrar o profissional ideal.
        </Text>

        <View className="mt-5 flex-row items-center rounded-2xl bg-white px-4 py-3">
          <Ionicons name="business-outline" size={18} color="#2F80ED" />
          <Text className="ml-2 flex-1 text-sm font-semibold text-slate-700">{clinic.name}</Text>
        </View>

        <Text className="mb-3 mt-7 text-base font-bold text-slate-800">Especialidades disponíveis</Text>

        {specialties.length === 0 ? (
          <Text className="rounded-2xl bg-white px-4 py-5 text-sm text-slate-500">
            Esta clínica ainda não possui especialidades vinculadas a médicos.
          </Text>
        ) : (
          specialties.map((specialty) => {
            const selected = selectedSpecialty === specialty;
            const style = getSpecialtyStyle(specialty);

            return (
              <Pressable
                key={specialty}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => setSelectedSpecialty(specialty)}
                className={`mb-3 flex-row items-center rounded-2xl border px-4 py-4 ${
                  selected ? "border-[#2F80ED] bg-blue-50" : "border-slate-200 bg-white"
                }`}
              >
                <View
                  className="h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: style.background }}
                >
                  <MaterialCommunityIcons name={style.icon} size={24} color={style.color} />
                </View>
                <Text className="ml-4 flex-1 text-sm font-semibold text-slate-800">{specialty}</Text>
                <Ionicons
                  name={selected ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={selected ? "#2F80ED" : "#CBD5E1"}
                />
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <View className="border-t border-slate-200 bg-white px-5 py-3">
        <Pressable
          disabled={!selectedSpecialty}
          onPress={handleContinue}
          className={`items-center rounded-xl bg-[#2F80ED] py-3.5 ${selectedSpecialty ? "" : "opacity-50"}`}
        >
          <Text className="text-base font-bold text-white">Continuar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
