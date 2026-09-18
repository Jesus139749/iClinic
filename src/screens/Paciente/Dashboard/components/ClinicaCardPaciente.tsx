import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

export interface ClinicaCardPacienteProps {
  name: string;
  imageUrl: string;
  distanceKm: number;
  hours: string;
  rating: number;
  specialties: string[];
  nextAvailable: string;
  actionLabel: 'Ver Detalhes' | 'Agendar';
}

export function ClinicaCardPaciente({
  name,
  imageUrl,
  distanceKm,
  hours,
  rating,
  specialties,
  nextAvailable,
  actionLabel,
}: ClinicaCardPacienteProps) {
  return (
    <View className="mb-4 flex-row rounded-2xl border border-slate-200 bg-white p-3">
      <Image source={{ uri: imageUrl }} className="h-16 w-16 rounded-xl" />

      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-slate-800">{name}</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text className="text-sm font-semibold text-slate-700">{rating}</Text>
          </View>
        </View>

        <Text className="mt-0.5 text-xs text-slate-500">
          {distanceKm} km · {hours}
        </Text>

        <Text className="mt-0.5 text-xs text-blue-500">{specialties.join(' • ')}</Text>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-xs font-medium text-slate-600">Próximo: {nextAvailable}</Text>

          <Pressable className="rounded-lg bg-blue-500 px-3 py-1.5">
            <Text className="text-xs font-bold text-white">{actionLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}