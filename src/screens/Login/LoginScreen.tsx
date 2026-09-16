import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TextInputStyled } from '../../components/TextInputStyled';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation();

  function handleEntrar() {
    navigation.navigate('Main' as never);
  }

  return (
    <View className="flex-1 justify-center bg-slate-50 px-8">

      {/* Logo */}
      <View className="mb-10 items-center">
        <Text className="text-4xl font-bold text-blue-500">iClinic</Text>
        <Text className="mt-1 text-sm text-gray-400">Saúde ao seu alcance</Text>
      </View>

      {/* LOGIN */}
      <TextInputStyled
        label='E-mail'
        value={email}
        onChangeText={setEmail}
        placeholder='seuemail@exemplo.com'
        autoCapitalize='none'
      />

      <TextInputStyled
        label='Senha'
        value={senha}
        onChangeText={setSenha}
        placeholder='Digite sua senha'
        autoCapitalize='none'
        secureTextEntry
      />

      <TouchableOpacity className="mb-7 mt-4 self-end">
        <Text className="font-semibold text-blue-500">
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('DashboardClinica' as never)}
        className="h-14 items-center justify-center rounded-xl bg-blue-500"
      >
        <Text className="text-base font-bold text-white">Entrar</Text>
      </TouchableOpacity>

      {/* CRIAR CONTA — separado do login */}
      <View className="border-t border-gray-200 pt-6">
        <Text className="mb-3 text-center text-sm font-semibold text-gray-600">
          Não tem uma conta? Cadastre-se como:
        </Text>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate('CadastroPaciente' as never)}
            className="h-14 flex-1 flex-row items-center justify-center rounded-xl border border-[#3182E8] bg-[#3182E8]"
          >
            <Ionicons name="person-outline" size={21} color="#FFFFFF" />
            <Text className="ml-2 text-base font-medium text-white">
              Paciente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('CadastroClinica' as never)}
            className="h-14 flex-1 flex-row items-center justify-center rounded-xl border border-[#E0E4EA] bg-white"
          >
            <Ionicons name="home" size={20} color="#000000" />
            <Text className="ml-2 text-base font-medium text-[#333333]">
              Clínica
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}