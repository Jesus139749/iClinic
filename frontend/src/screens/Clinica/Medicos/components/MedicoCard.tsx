import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { DoctorCardProps } from "./interfaces/DoctorCardProps";
import { DoctorAvatar } from "./MedicoAvatar";

export function DoctorCard({ doctor, isUpdating, onEdit, onReactivate }: DoctorCardProps) {
  const { active } = doctor;

  return (
    <View className={`mb-4 rounded-2xl border border-slate-200 bg-white p-4 ${active ? "" : "opacity-90"}`}>
      <View className="flex-row items-start">
        <DoctorAvatar uri={doctor.image} name={doctor.name} />

        <View className="ml-3 flex-1">
          <View className="flex-row items-start justify-between">
            <Text className="flex-1 pr-2 text-base font-bold text-slate-800" numberOfLines={2}>
              {doctor.name}
            </Text>
            <View className={`rounded-full px-3 py-1 ${active ? "bg-green-100" : "bg-slate-100"}`}>
              <Text className={`text-xs font-bold ${active ? "text-green-600" : "text-slate-500"}`}>
                {active ? "Ativo" : "Inativo"}
              </Text>
            </View>
          </View>

          <Text className="mt-0.5 text-xs text-slate-400">CRM {doctor.crm}</Text>

          <View className="mt-2 flex-row flex-wrap">
            {doctor.specialties.map((specialty) => (
              <View
                key={specialty.id}
                className={`mb-1 mr-2 rounded-md px-2 py-0.5 ${active ? "bg-blue-50" : "bg-slate-100"}`}
              >
                <Text className={`text-xs ${active ? "text-[#2F80ED]" : "text-slate-500"}`}>
                  {specialty.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <Text className="text-xs text-slate-400">{active ? "Em atendimento" : "Desativado"}</Text>

        {isUpdating ? (
          <ActivityIndicator color="#2F80ED" />
        ) : (
          <Pressable onPress={active ? onEdit : onReactivate} hitSlop={8}>
            <Text className="text-sm font-bold text-[#2F80ED]">{active ? "Editar" : "Reativar"}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
