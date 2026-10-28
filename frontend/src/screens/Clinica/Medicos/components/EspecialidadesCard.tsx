import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import type { SpecialtyWithCount } from "../../../../services/doctorService";

interface EspecialidadesCardProps {
  specialties: SpecialtyWithCount[];
  onAdd: (name: string) => Promise<boolean>;
  onRemove: (specialty: SpecialtyWithCount) => void;
}

export function EspecialidadesCard({
  specialties,
  onAdd,
  onRemove,
}: EspecialidadesCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleAdd() {
    if (!name.trim() || isSaving) return;

    setIsSaving(true);
    const created = await onAdd(name.trim());
    setIsSaving(false);

    if (created) {
      setName("");
      setIsAdding(false);
    }
  }

  return (
    <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
      <View className="mb-3 flex-row items-center">
        <Ionicons name="ribbon-outline" size={20} color="#2F80ED" />
        <Text className="ml-2 text-base font-bold text-slate-800">
          Especialidades da Clínica
        </Text>
      </View>

      {specialties.length === 0 ? (
        <Text className="mb-3 text-sm text-slate-400">
          Nenhuma especialidade cadastrada ainda.
        </Text>
      ) : (
        <View className="mb-1 flex-row flex-wrap">
          {specialties.map((specialty) => (
            <Pressable
              key={specialty.id}
              onLongPress={() => onRemove(specialty)}
              accessibilityHint="Mantenha pressionado para remover"
              className="mb-2 mr-2 rounded-lg bg-blue-50 px-3 py-2"
            >
              <Text className="text-sm font-bold text-[#2F80ED]">
                {specialty.name}
                <Text className="text-xs font-normal">
                  {" "}
                  ({specialty.doctorsCount})
                </Text>
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {specialties.length > 0 ? (
        <Text className="mb-2 text-xs text-slate-400">
          Mantenha pressionada uma especialidade para removê-la.
        </Text>
      ) : null}

      {isAdding ? (
        <View className="flex-row items-center">
          <TextInput
            className="mr-2 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            placeholder="Nome da especialidade"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => void handleAdd()}
            autoFocus
            returnKeyType="done"
          />
          <Pressable
            onPress={() => void handleAdd()}
            disabled={isSaving}
            className="h-10 w-10 items-center justify-center rounded-xl bg-[#2F80ED]"
            accessibilityLabel="Salvar especialidade"
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              setIsAdding(false);
              setName("");
            }}
            className="ml-2 h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
            accessibilityLabel="Cancelar"
          >
            <Ionicons name="close" size={20} color="#64748B" />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => setIsAdding(true)}
          className="flex-row items-center self-start py-1"
          accessibilityRole="button"
        >
          <Ionicons name="add-circle-outline" size={20} color="#2F80ED" />
          <Text className="ml-1 text-sm font-bold text-[#2F80ED]">
            Adicionar Especialidade
          </Text>
        </Pressable>
      )}
    </View>
  );
}
