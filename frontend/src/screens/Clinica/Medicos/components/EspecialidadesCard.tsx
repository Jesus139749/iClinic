import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import type { SpecialtiesCardProps } from "./interfaces/SpecialtiesCardProps";

export function SpecialtiesCard({ specialties, onAdd, onRemove }: SpecialtiesCardProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name.trim() || saving) return;

    setSaving(true);
    const created = await onAdd(name.trim());
    setSaving(false);

    if (created) {
      setName("");
      setAdding(false);
    }
  }

  function cancel() {
    setAdding(false);
    setName("");
  }

  return (
    <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
      <View className="mb-3 flex-row items-center">
        <Ionicons name="ribbon-outline" size={20} color="#2F80ED" />
        <Text className="ml-2 text-base font-bold text-slate-800">Especialidades da Clínica</Text>
      </View>

      {specialties.length === 0 ? (
        <Text className="mb-3 text-sm text-slate-400">Nenhuma especialidade cadastrada ainda.</Text>
      ) : (
        <>
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
                  <Text className="text-xs font-normal"> ({specialty.doctorsCount})</Text>
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="mb-2 text-xs text-slate-400">
            Mantenha pressionada uma especialidade para removê-la.
          </Text>
        </>
      )}

      {adding ? (
        <View className="flex-row items-center">
          <TextInput
            className="mr-2 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            placeholder="Nome da especialidade"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleAdd}
            autoFocus
            returnKeyType="done"
          />
          <Pressable
            onPress={handleAdd}
            disabled={saving}
            accessibilityLabel="Salvar especialidade"
            className="h-10 w-10 items-center justify-center rounded-xl bg-[#2F80ED]"
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            )}
          </Pressable>
          <Pressable
            onPress={cancel}
            accessibilityLabel="Cancelar"
            className="ml-2 h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
          >
            <Ionicons name="close" size={20} color="#64748B" />
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => setAdding(true)} className="flex-row items-center self-start py-1">
          <Ionicons name="add-circle-outline" size={20} color="#2F80ED" />
          <Text className="ml-1 text-sm font-bold text-[#2F80ED]">Adicionar Especialidade</Text>
        </Pressable>
      )}
    </View>
  );
}
