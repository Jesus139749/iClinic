import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import type { PatientClinicCardProps } from "./interfaces/PatientClinicCardProps";

export function PatientClinicCard({ clinic, onPress }: PatientClinicCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${clinic.name}`}
      onPress={onPress}
      className="mb-4 flex-row rounded-2xl border border-slate-200 bg-white p-3"
    >
      {clinic.image ? (
        <Image
          source={{ uri: clinic.image }}
          className="h-16 w-16 rounded-xl bg-slate-200"
          resizeMode="cover"
          accessibilityLabel={`Imagem de ${clinic.name}`}
        />
      ) : (
        <View className="h-16 w-16 items-center justify-center rounded-xl bg-slate-200">
          <Ionicons name="medkit-outline" size={26} color="#64748B" />
        </View>
      )}

      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-slate-800" numberOfLines={1}>
          {clinic.name}
        </Text>

        {clinic.specialties.length > 0 ? (
          <Text className="mt-0.5 text-xs text-blue-500" numberOfLines={2}>
            {clinic.specialties.join(" • ")}
          </Text>
        ) : null}
        {clinic.address ? (
          <View className="mt-1 flex-row items-start">
            <Ionicons name="location-outline" size={13} color="#64748B" />
            <Text className="ml-1 flex-1 text-xs text-slate-500" numberOfLines={2}>
              {clinic.address}
            </Text>
          </View>
        ) : null}

        <View className="mt-2 flex-row justify-end">
          <View className="rounded-lg bg-blue-500 px-3 py-1.5">
            <Text className="text-xs font-bold text-white">Ver Detalhes</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
