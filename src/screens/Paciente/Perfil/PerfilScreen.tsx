import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type IconName = ComponentProps<typeof Ionicons>['name'];

function PerfilSecao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <View className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 pt-4">
      <Text className="mb-1 text-sm font-bold text-slate-800">{titulo}</Text>
      {children}
    </View>
  );
}

interface PerfilItemProps {
  icon: IconName;
  label: string;
  value: string;
  alerta?: boolean;
  destaque?: string;
  bloqueado?: boolean;
  ultimo?: boolean;
}

function PerfilItem({ icon, label, value, alerta, destaque, bloqueado, ultimo }: PerfilItemProps) {
  return (
    <Pressable
      className={`flex-row items-center py-3 ${ultimo ? '' : 'border-b border-slate-100'}`}
    >
      <Ionicons name={icon} size={20} color="#2563eb" />

      <View className="ml-3 flex-1">
        <Text className="text-xs text-slate-400">{label}</Text>
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-sm ${alerta ? 'font-bold text-orange-500' : 'font-medium text-slate-800'}`}
          >
            {value}
          </Text>
          {destaque && (
            <Text className="text-xs font-semibold text-orange-500">{destaque}</Text>
          )}
        </View>
      </View>

      <Ionicons
        name={bloqueado ? 'lock-closed' : 'chevron-forward'}
        size={bloqueado ? 14 : 18}
        color="#94A3B8"
      />
    </Pressable>
  );
}

interface PerfilSwitchItemProps {
  icon: IconName;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  ultimo?: boolean;
}

function PerfilSwitchItem({ icon, label, value, onValueChange, ultimo }: PerfilSwitchItemProps) {
  return (
    <View
      className={`flex-row items-center py-3 ${ultimo ? '' : 'border-b border-slate-100'}`}
    >
      <Ionicons name={icon} size={20} color="#2563eb" />
      <Text className="ml-3 flex-1 text-sm font-medium text-slate-800">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CBD5E1', true: '#2F80ED' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

// ---------- Tela ----------

export default function PerfilPacienteScreen() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="h-12 flex-row items-center justify-between px-6">
        <View className="flex-row items-center">
          <View className="mr-2 h-[26px] w-[26px] items-center justify-center rounded-full bg-[#2F80ED]">
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
          <Text className="text-lg font-bold text-[#2F80ED]">iClinic</Text>
        </View>
        <Ionicons name="notifications-outline" size={22} color="#2F80ED" />
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="mb-5 mt-4 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-[#2F80ED]">
            <Ionicons name="person-outline" size={40} color="#FFFFFF" />
          </View>

          <Text className="mt-3 text-xl font-bold text-slate-800">Mariana Tavares</Text>
          <Text className="text-sm text-slate-500">mariana.tavares@email.com</Text>

          <View className="mt-2 flex-row items-center gap-1 rounded-full bg-green-50 px-3 py-1">
            <Ionicons name="checkmark-circle-outline" size={14} color="#16A34A" />
            <Text className="text-xs font-semibold text-green-600">Perfil completo</Text>
          </View>
        </View>

        <PerfilSecao titulo="Dados Pessoais">
          <PerfilItem icon="person-outline" label="Nome completo" value="Mariana Tavares de Souza" />
          <PerfilItem icon="card-outline" label="CPF" value="•••.456.789-00" bloqueado />
          <PerfilItem icon="calendar-outline" label="Data de nascimento" value="14/03/1992" />
          <PerfilItem
            icon="water-outline"
            label="Tipo sanguíneo"
            value="Não informado"
            alerta
            destaque="Completar"
            ultimo
          />
        </PerfilSecao>

        <PerfilSecao titulo="Contato">
          <PerfilItem icon="call-outline" label="Telefone" value="(11) 98765-4321" />
          <PerfilItem icon="mail-outline" label="E-mail" value="mariana.tavares@email.com" />
          <PerfilItem
            icon="navigate-outline"
            label="Endereço"
            value="Rua das Flores, 234 - São Paulo"
            ultimo
          />
        </PerfilSecao>

        <PerfilSecao titulo="Preferências">
          <PerfilSwitchItem
            icon="notifications-outline"
            label="Notificações por push"
            value={push}
            onValueChange={setPush}
          />
          <PerfilSwitchItem
            icon="mail-outline"
            label="Notificações por e-mail"
            value={email}
            onValueChange={setEmail}
          />
          <PerfilSwitchItem
            icon="chatbubble-ellipses-outline"
            label="Lembretes por SMS"
            value={sms}
            onValueChange={setSms}
            ultimo
          />
        </PerfilSecao>

        <PerfilSecao titulo="Privacidade e Segurança">
          <PerfilItem icon="lock-closed-outline" label="Segurança" value="Alterar senha" ultimo />
        </PerfilSecao>
      </ScrollView>
    </SafeAreaView>
  );
}