import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { Doctor } from "../../../../services/doctorService";
import { MedicoAvatar } from "./MedicoAvatar";

interface MedicoCardProps {
  doctor: Doctor;
  isUpdating: boolean;
  onEdit: () => void;
  onReactivate: () => void;
}

export function MedicoCard({
  doctor,
  isUpdating,
  onEdit,
  onReactivate,
}: MedicoCardProps) {
  return (
    <View
      className={`mb-4 rounded-2xl border border-slate-200 bg-white p-4 ${
        doctor.active ? "" : "opacity-90"
      }`}
    >
      <View className="flex-row items-start">
        <MedicoAvatar uri={doctor.image} name={doctor.name} />

        <View className="ml-3 flex-1">
          <View className="flex-row items-start justify-between">
            <Text
              className="flex-1 pr-2 text-base font-bold text-slate-800"
              numberOfLines={2}
            >
              {doctor.name}
            </Text>
            <View
              className={`rounded-full px-3 py-1 ${
                doctor.active ? "bg-green-100" : "bg-slate-100"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  doctor.active ? "text-green-600" : "text-slate-500"
                }`}
              >
                {doctor.active ? "Ativo" : "Inativo"}
              </Text>
            </View>
          </View>

          <Text className="mt-0.5 text-xs text-slate-400">CRM {doctor.crm}</Text>

          <View className="mt-2 flex-row flex-wrap">
            {doctor.specialties.map((specialty) => (
              <View
                key={specialty.id}
                className={`mb-1 mr-2 rounded-md px-2 py-0.5 ${
                  doctor.active ? "bg-blue-50" : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-xs ${
                    doctor.active ? "text-[#2F80ED]" : "text-slate-500"
                  }`}
                >
                  {specialty.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <Text className="text-xs text-slate-400">
          {doctor.active ? "Em atendimento" : "Desativado"}
        </Text>

        {doctor.active ? (
          <Pressable onPress={onEdit} hitSlop={8} accessibilityRole="button">
            <Text className="text-sm font-bold text-[#2F80ED]">Editar</Text>
          </Pressable>
        ) : isUpdating ? (
          <ActivityIndicator color="#2F80ED" />
        ) : (
          <Pressable
            onPress={onReactivate}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text className="text-sm font-bold text-[#2F80ED]">Reativar</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
