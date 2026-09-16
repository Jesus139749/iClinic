import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CadastroClinicaScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');


  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-8">
        <Text className="text-2xl font-bold text-gray-800">
          Cadastrar clínica
        </Text>

        <Text className='color-slate-400'>Preencha os dados abaixo para cadastrar sua clínica na plataforma iClinic.</Text>

        <Text className="mb-2 text-sm font-semibold text-gray-600 mt-8">
          Nome da clínica
        </Text>

        <TextInput
          className="mb-5 rounded-xl border border-gray-200 bg-white px-4 text-base"
          placeholder="Ex: Clínica São Lucas"
          placeholderTextColor="#A0A8B4"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text className="mb-2 text-sm font-semibold text-gray-600">
          CNPJ
        </Text>
        <TextInput
          className="mb-5 h-14 rounded-xl border border-gray-200 bg-white px-4 text-base"
          placeholder="XX.XXX.XXX/XXXX-XX"
          placeholderTextColor="#A0A8B4"
          value={cnpj}
          onChangeText={setCnpj}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="mb-2 text-sm font-semibold text-gray-600">
          E-mail institucional
        </Text>
        <TextInput
          className="h-14 rounded-xl border border-gray-200 bg-white px-4 text-base"
          placeholder="contato@clinica.com.br"
          placeholderTextColor="#A0A8B4"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="mt-1 mb-5 text-sm font-semibold text-gray-400">
          Usaremos para login e recuperação de senha
        </Text>

        <Text className="mb-2 text-sm font-semibold text-gray-600">
          Telefone comercial
        </Text>
        <TextInput
          className="mb-5 h-14 rounded-xl border border-gray-200 bg-white px-4 text-base"
          placeholder="(DD) XXXX-XXXX"
          placeholderTextColor="#A0A8B4"
          value={phone}
          onChangeText={setPhone}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="mb-2 text-sm font-semibold text-gray-600">
          Endereço completo
        </Text>
        <TextInput
          className="mb-5 h-14 rounded-xl border border-gray-200 bg-white px-4 text-base"
          placeholder="Rua, número, bairro, cidade – UF"
          placeholderTextColor="#A0A8B4"
          value={address}
          onChangeText={setAddress}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="mb-2 text-sm font-semibold text-gray-600">
          Senha
        </Text>
        <TextInput
          className="h-14 rounded-xl border border-gray-200 bg-white px-4 text-base"
          placeholder="Mínimo 8 caracteres"
          placeholderTextColor="#A0A8B4"
          value={password}
          onChangeText={setPassword}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="mt-1 mb-5 text-sm font-semibold text-gray-400">
          Use letras, números e caracteres especiais
        </Text>

        <Text className="mb-2 text-sm font-semibold text-gray-600">
          Confirmar senha
        </Text>
        <TextInput
          className="mb-5 h-14 rounded-xl border border-gray-200 bg-white px-4 text-base"
          placeholder="Repita sua senha"
          placeholderTextColor="#A0A8B4"
          value={''}
          onChangeText={() => { }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="mt-1 mb-5 text-sm font-semibold text-gray-400">
          Ao cadastrar sua clínica, você concorda com os Termos de Uso e a Política de Privacidade da iClinic.
        </Text>

        <Pressable
          className='bg-blue-400 p-5 rounded-xl mt-2 mb-4'
          onPress={() =>
            navigation.navigate('Login')
          }
        >
          <Text className='text-center color-white font-bold'>Cadastrar clínica</Text>
        </Pressable>

        <View className='flex-row flex-1 justify-center gap-1'>
          <Text className="mt-1 mb-5 text-sm font-semibold text-gray-400">
            Não tem uma conta?
          </Text>
          <Pressable onPress={() => navigation.navigate('Login' as never)}>
            <Text className="mt-1 mb-5 text-sm font-semibold text-blue-500">
              Fazer login
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}