import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputStyled } from '../../../components/TextInputStyled';

export default function CadastroClinicaScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = () => {
    console.log(name);
  }


  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-8">
        <Text className="text-2xl font-bold text-gray-800">
          Cadastrar clínica
        </Text>

        <Text className='color-slate-400'>Preencha os dados abaixo para cadastrar sua clínica na plataforma iClinic.</Text>

        <TextInputStyled
          label='Nome da clínica'
          value={name}
          onChangeText={setName}
          placeholder='Ex: Clínica São Lucas'
          autoCapitalize='words'
        />

        <TextInputStyled
          label='CNPJ'
          value={cnpj}
          onChangeText={setCnpj}
          placeholder='XX.XXX.XXX/XXXX-XX'
        />

        <TextInputStyled
          label='E-mail institucional'
          value={email}
          onChangeText={setEmail}
          placeholder='contato@clinica.com.br'
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <Text className="mt-1 mb-3 text-sm font-semibold text-gray-400">
          Usaremos para login e recuperação de senha
        </Text>

        <TextInputStyled
          label='Telefone comercial'
          value={phone}
          onChangeText={setPhone}
          placeholder='(DD) XXXX-XXXX'
          keyboardType='email-address'
        />

        <TextInputStyled
          label='Endereço completo'
          value={address}
          onChangeText={setAddress}
          placeholder='Rua, número, bairro, cidade – UF'
          keyboardType='email-address'
        />

        <TextInputStyled
          label='Senha'
          value={password}
          onChangeText={setPassword}
          placeholder='Mínimo 8 caracteres'
          secureTextEntry
        />

        <Text className="mt-1 mb-3 text-sm font-semibold text-gray-400">
          Use letras, números e caracteres especiais
        </Text>

        <TextInputStyled
          label='Confirmar senha'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder='Repita sua senha'
          secureTextEntry
        />

        <Text className="my-5 text-sm font-semibold text-gray-400">
          Ao cadastrar sua clínica, você concorda com os Termos de Uso e a Política de Privacidade da iClinic.
        </Text>

        <Pressable
          className='bg-blue-400 p-5 rounded-xl mt-2 mb-4'
          onPress={() =>
            onSubmit()
          }
        >
          <Text className='text-center color-white font-bold'>Cadastrar clínica</Text>
        </Pressable>

        <View className='flex-row flex-1 justify-center gap-1'>
          <Text className="mt-1 mb-5 text-sm font-semibold text-gray-400">
            Já tem uma conta?
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