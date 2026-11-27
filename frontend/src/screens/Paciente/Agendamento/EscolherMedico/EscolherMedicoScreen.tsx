import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../../components/Button";
import { ErrorBox, Loading } from "../../../../components/Feedback";
import { Section } from "../../../../components/Section";
import { useLoad } from "../../../../hooks/useLoad";
import { getClinic, type ClinicDoctor } from "../../../../services/clinicSearchService";
import { normalize } from "../../../../utils/format";
import type { SelectDoctorProps } from "./interfaces/SelectDoctorProps";

function getDoctorsForSpecialty(doctors: ClinicDoctor[], specialty: string): ClinicDoctor[] {
  const normalizedSpecialty = normalize(specialty.trim());
  if (!normalizedSpecialty) return [];

  const matchingDoctors = new Map<number, ClinicDoctor>();

  for (const doctor of doctors) {
    const servesSpecialty = doctor.specialties.some(
      (doctorSpecialty) => normalize(doctorSpecialty.trim()) === normalizedSpecialty,
    );

    if (servesSpecialty) matchingDoctors.set(doctor.id, doctor);
  }

  return [...matchingDoctors.values()];
}

export default function EscolherMedicoScreen({ route, navigation }: SelectDoctorProps) {
  const { clinicId, specialty } = route.params;
  const { data: clinic, loading, error, reload } = useLoad(() => getClinic(clinicId), [clinicId]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  if (loading) return <Loading fullScreen />;

  if (!clinic) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-[#F5F9FE] px-5">
        <ErrorBox message={error ?? "Não foi possível carregar os médicos desta clínica."} onRetry={reload} />
        <Button label="Voltar" variant="outline" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const doctors = getDoctorsForSpecialty(clinic.doctors, specialty);
  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId);

  function handleContinue() {
    if (!selectedDoctor) return;

    Alert.alert(
      "Próxima etapa indisponível",
      `A escolha de data e horário ainda não está disponível. Médico selecionado: ${selectedDoctor.name}.`,
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F9FE]" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="px-5 pb-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => navigation.goBack()}
          className="mb-5 mt-3 h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <Ionicons name="arrow-back" size={21} color="#2F80ED" />
        </Pressable>

        <Text className="text-2xl font-extrabold text-slate-800">Escolha um médico</Text>
        <Text className="mt-2 text-sm leading-5 text-slate-500">
          Selecione um profissional que atenda à especialidade escolhida.
        </Text>

        <View className="mt-5 flex-row items-center rounded-2xl bg-white px-4 py-3">
          <Ionicons name="business-outline" size={18} color="#2F80ED" />
          <Text className="ml-2 flex-1 text-sm font-semibold text-slate-700">{clinic.name}</Text>
        </View>
        <View className="mt-2 flex-row items-center rounded-2xl bg-white px-4 py-3">
          <Ionicons name="medkit-outline" size={18} color="#2F80ED" />
          <Text className="ml-2 flex-1 text-sm font-semibold text-slate-700">{specialty}</Text>
        </View>

        <Section title="Médicos disponíveis">
          {doctors.length === 0 ? (
            <Text className="py-3 text-sm text-slate-500">
              Esta clínica não possui médicos disponíveis para esta especialidade.
            </Text>
          ) : (
            doctors.map((doctor) => {
              const selected = doctor.id === selectedDoctorId;

              return (
                <Pressable
                  key={doctor.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => setSelectedDoctorId(doctor.id)}
                  className={`mb-3 flex-row items-center rounded-2xl border px-4 py-4 ${
                    selected ? "border-[#2F80ED] bg-blue-50" : "border-slate-200 bg-white"
                  }`}
                >
                  {doctor.image ? (
                    <Image
                      source={{ uri: doctor.image }}
                      className="h-16 w-16 rounded-full bg-blue-50"
                      resizeMode="cover"
                      accessibilityLabel={`Foto de ${doctor.name}`}
                    />
                  ) : (
                    <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                      <Ionicons name="person-outline" size={30} color="#438BFF" />
                    </View>
                  )}
                  <View className="ml-4 flex-1">
                    <Text className="text-sm font-bold text-slate-800">{doctor.name}</Text>
                    <Text className="mt-1 text-xs text-blue-600">{specialty}</Text>
                  </View>
                  <Ionicons
                    name={selected ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={selected ? "#2F80ED" : "#CBD5E1"}
                  />
                </Pressable>
              );
            })
          )}
        </Section>
      </ScrollView>

      <View className="border-t border-slate-200 bg-white px-5 py-3">
        <Button
          label="Continuar"
          onPress={handleContinue}
          disabled={!selectedDoctor}
          className={`w-full ${selectedDoctor ? "" : "opacity-50"}`}
        />
      </View>
    </SafeAreaView>
  );
}
