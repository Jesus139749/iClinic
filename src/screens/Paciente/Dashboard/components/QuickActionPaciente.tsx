import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

interface QuickActionPacienteProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  color?: string;
}

export function QuickActionPaciente({ icon, label, color = '#2563eb' }: QuickActionPacienteProps) {
  return (
    <Pressable className="flex-1 items-center rounded-2xl border border-slate-200 bg-slate-100 py-4">
      <View className="mb-2 h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-center text-xs font-semibold text-slate-700">{label}</Text>
    </Pressable>
  );
}