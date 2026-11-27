import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "../../../../components/Feedback";
import { useLoad } from "../../../../hooks/useLoad";
import { getClinic } from "../../../../services/clinicSearchService";
import type { ClinicDetailsProps } from "./interfaces/ClinicDetailsProps";
import type { ClinicDoctorCardProps } from "./interfaces/ClinicDoctorCardProps";
import type { DetailsSectionProps } from "./interfaces/DetailsSectionProps";

function DetailsSection({ title, children }: DetailsSectionProps) {
  return (
    <View className="mt-7">
      <Text className="mb-3 text-base font-bold text-slate-800">{title}</Text>
      {children}
    </View>
  );
}

function ClinicDoctorCard({ doctor }: ClinicDoctorCardProps) {
  return (
    <View className="w-36 items-center rounded-2xl bg-white px-3 py-4">
      {doctor.image ? (
        <Image source={{ uri: doctor.image }} className="h-16 w-16 rounded-full bg-blue-50" resizeMode="cover" />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <Ionicons name="person-outline" size={30} color="#438BFF" />
        </View>
      )}
      <Text className="mt-3 text-center text-sm font-bold text-slate-800" numberOfLines={2}>
        {doctor.name}
      </Text>
      <Text className="mt-1 text-center text-xs text-blue-500" numberOfLines={2}>
        {doctor.specialties.join(", ")}
      </Text>
    </View>
  );
}

export default function DetalhesClinicaScreen({ route, navigation }: ClinicDetailsProps) {
  const { clinicId } = route.params;
  const { data: clinic, loading, error } = useLoad(() => getClinic(clinicId), [clinicId]);

  if (loading) return <Loading fullScreen />;

  if (!clinic) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Ionicons name="medical-outline" size={40} color="#94A3B8" />
        <Text className="mt-3 text-center text-base text-slate-600">
          {error ?? "Não foi possível encontrar os detalhes desta clínica."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F9FE]" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="pb-6">
        <View>
          {clinic.image ? (
            <Image
              source={{ uri: clinic.image }}
              className="h-64 w-full bg-slate-200"
              resizeMode="cover"
              accessibilityLabel={`Imagem de ${clinic.name}`}
            />
          ) : (
            <View className="h-64 w-full items-center justify-center bg-slate-200">
              <Ionicons name="medkit-outline" size={56} color="#64748B" />
            </View>
          )}
          <Pressable
            accessibilityLabel="Voltar"
            onPress={() => navigation.goBack()}
            className="absolute left-5 top-4 h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <Ionicons name="arrow-back" size={21} color="#2F80ED" />
          </Pressable>
        </View>

        <View className="-mt-5 rounded-t-3xl bg-[#F5F9FE] px-5 pt-5">
          <View className="rounded-2xl bg-white px-4 py-4">
            <Text className="text-xl font-extrabold text-slate-800">{clinic.name}</Text>

            <View className="mt-3 flex-row items-start">
              <Ionicons name="location" size={15} color="#2F80ED" />
              <Text className="ml-2 flex-1 text-xs text-slate-600">{clinic.address}</Text>
            </View>

            {clinic.phone ? (
              <View className="mt-3 flex-row items-center self-start rounded-full bg-blue-50 px-3 py-2">
                <Ionicons name="call" size={13} color="#2F80ED" />
                <Text className="ml-1.5 text-xs font-medium text-blue-600">{clinic.phone}</Text>
              </View>
            ) : null}
          </View>

          {clinic.specialties.length > 0 ? (
            <DetailsSection title="Especialidades disponíveis">
              <View className="flex-row flex-wrap gap-2">
                {clinic.specialties.map((specialty) => (
                  <View key={specialty} className="flex-row items-center rounded-xl bg-white px-3 py-2.5">
                    <Ionicons name="medkit" size={15} color="#438BFF" />
                    <Text className="ml-2 text-xs font-medium text-slate-700">{specialty}</Text>
                  </View>
                ))}
              </View>
            </DetailsSection>
          ) : null}

          <DetailsSection title="Médicos no local">
            {clinic.doctors.length === 0 ? (
              <Text className="text-sm text-slate-400">Nenhum médico cadastrado.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
                {clinic.doctors.map((doctor) => (
                  <ClinicDoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </ScrollView>
            )}
          </DetailsSection>
        </View>
      </ScrollView>

      {/* Agendamento ainda não implementado no backend. */}
      <View className="border-t border-slate-200 bg-white px-5 py-3">
        <Pressable disabled className="items-center rounded-xl bg-[#2F80ED] py-3.5 opacity-60">
          <Text className="text-base font-bold text-white">Agendar Consulta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
