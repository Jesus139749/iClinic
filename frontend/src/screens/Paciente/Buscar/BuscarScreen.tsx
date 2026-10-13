import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Status = 'Aberta' | 'Lotada' | 'Fechada';

interface Clinica {
  id: number;
  nome: string;
  especialidades: string;
  endereco: string;
  distanciaKm: number;
  nota: number;
  avaliacoes: number;
  status: Status;
  horarios: string[];
  maisHorarios: number;
}

const clinicas: Clinica[] = [
  {
    id: 1,
    nome: 'Clínica CardioVida',
    especialidades: 'Cardiologia · Clínica Geral',
    endereco: 'R. Augusta, 1200',
    distanciaKm: 2.3,
    nota: 4.8,
    avaliacoes: 127,
    status: 'Aberta',
    horarios: ['Hoje 14:00', 'Hoje 15:30'],
    maisHorarios: 3,
  },
  {
    id: 2,
    nome: 'Centro Médico São Lucas',
    especialidades: 'Cardiologia · Endocrinologia',
    endereco: 'Av. Paulista, 900',
    distanciaKm: 4.1,
    nota: 4.6,
    avaliacoes: 89,
    status: 'Aberta',
    horarios: ['Amanhã 09:00', 'Amanhã 10:30'],
    maisHorarios: 5,
  },
  {
    id: 3,
    nome: 'Hospital do Coração',
    especialidades: 'Cardiologia · Cirurgia Cardíaca',
    endereco: 'R. Consolação, 340',
    distanciaKm: 5.7,
    nota: 4.9,
    avaliacoes: 214,
    status: 'Lotada',
    horarios: ['Qua 08:00', 'Qua 11:00'],
    maisHorarios: 0,
  },
  {
    id: 4,
    nome: 'Clínica Bem Estar',
    especialidades: 'Cardiologia · Pneumologia',
    endereco: 'R. Bela Cintra, 780',
    distanciaKm: 8.2,
    nota: 4.5,
    avaliacoes: 56,
    status: 'Fechada',
    horarios: ['Qui 09:00', 'Qui 14:00'],
    maisHorarios: 2,
  },
];

const estiloStatus: Record<
  Status,
  { badge: string; texto: string; chip: string; chipTexto: string }
> = {
  Aberta: {
    badge: 'bg-green-50',
    texto: 'text-green-600',
    chip: 'bg-blue-100',
    chipTexto: 'text-blue-600',
  },
  Lotada: {
    badge: 'bg-orange-50',
    texto: 'text-orange-500',
    chip: 'bg-orange-100',
    chipTexto: 'text-orange-500',
  },
  Fechada: {
    badge: 'bg-slate-100',
    texto: 'text-slate-500',
    chip: 'bg-slate-100',
    chipTexto: 'text-slate-500',
  },
};

function ClinicaBuscaCard({ clinica }: { clinica: Clinica }) {
  const estilo = estiloStatus[clinica.status];

  return (
    <View className="mb-4 flex-row rounded-2xl border border-slate-200 bg-white p-3">
      <View className="h-16 w-16 items-center justify-center rounded-xl bg-slate-200">
        <Ionicons name="medkit-outline" size={26} color="#64748B" />
      </View>

      <View className="ml-3 flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="mr-2 flex-1 text-base font-bold text-slate-800">
            {clinica.nome}
          </Text>
          <View className={`rounded-full px-2 py-0.5 ${estilo.badge}`}>
            <Text className={`text-xs font-semibold ${estilo.texto}`}>
              {clinica.status}
            </Text>
          </View>
        </View>

        <Text className="mt-0.5 text-xs text-slate-500">{clinica.especialidades}</Text>

        <Text className="mt-0.5 text-xs text-slate-500">
          {clinica.endereco} · {clinica.distanciaKm} km
        </Text>

        <View className="mt-1 flex-row items-center gap-1">
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text className="text-sm font-bold text-slate-800">{clinica.nota}</Text>
          <Text className="text-xs text-slate-400">({clinica.avaliacoes} avaliações)</Text>
        </View>

        <View className="mt-2 flex-row flex-wrap gap-2">
          {clinica.horarios.map((horario) => (
            <View key={horario} className={`rounded-lg px-2 py-1.5 ${estilo.chip}`}>
              <Text className={`text-xs font-semibold ${estilo.chipTexto}`}>{horario}</Text>
            </View>
          ))}
          {clinica.maisHorarios > 0 && (
            <View className="rounded-lg bg-slate-100 px-2 py-1.5">
              <Text className="text-xs font-semibold text-slate-500">
                +{clinica.maisHorarios}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default function BuscarPacienteScreen() {
  const [busca, setBusca] = useState('');

  const resultados = clinicas.filter((c) =>
    `${c.nome} ${c.especialidades}`.toLowerCase().includes(busca.trim().toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={[]}>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mt-3 h-12 flex-row items-center rounded-xl border border-slate-200 bg-white px-4">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar clínica ou especialidade..."
            placeholderTextColor="#94A3B8"
            className="ml-2 flex-1 text-sm"
          />
          {busca.length > 0 && (
            <Pressable onPress={() => setBusca('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        {/* Filtros: por enquanto só visuais */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ gap: 8 }}
        >
          <View className="rounded-full bg-[#2F80ED] px-3 py-1.5">
            <Text className="text-xs font-semibold text-white">Cardiologia</Text>
          </View>
          <View className="rounded-full bg-[#2F80ED] px-3 py-1.5">
            <Text className="text-xs font-semibold text-white">Até 10 km</Text>
          </View>
          <View className="rounded-full border border-slate-300 bg-white px-3 py-1.5">
            <Text className="text-xs font-semibold text-slate-600">Horário</Text>
          </View>
          <View className="rounded-full border border-slate-300 bg-white px-3 py-1.5">
            <Text className="text-xs font-semibold text-slate-600">Data</Text>
          </View>
        </ScrollView>

        <View className="mb-3 mt-4 flex-row items-center justify-between">
          <Pressable onPress={() => setBusca('')}>
            <Text className="text-xs font-semibold text-blue-500">Limpar filtros</Text>
          </Pressable>
          <Text className="text-xs text-slate-400">{resultados.length} resultados</Text>
        </View>

        {resultados.map((clinica) => (
          <ClinicaBuscaCard key={clinica.id} clinica={clinica} />
        ))}

        {resultados.length === 0 && (
          <Text className="mt-10 text-center text-slate-400">
            Nenhuma clínica encontrada.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}