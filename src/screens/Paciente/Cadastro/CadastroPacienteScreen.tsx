import {View, Text, TextInput, Pressable,ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TextInputStyled} from '../../../components/TextInputStyled';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { Masks } from 'react-native-mask-input';

export default function CadastroPacienteScreen() {

  const navigation = useNavigation();

  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = () => {
    console.log(name);
    console.log(phone);
  };

  return (

    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-8">
        <Text className="text-2xl font-bold text-gray-800">
          Criar sua conta
        </Text>
        <Text className='color-slate-400'>Preencha os dados abaixo para criar sua conta na plataforma iClinic.</Text>

        <TextInputStyled
          label='Nome completo'
          value={name}
          onChangeText={setName}
          placeholder='Ex: João da Silva'
          autoCapitalize='words'
        />
        <TextInputStyled
          label='E-mail'
          value={email}
          onChangeText={setEmail}
          placeholder='seuemail@exemplo.com'
          autoCapitalize='none'
          keyboardType='email-address'
        />
        <TextInputStyled
          label='Telefone'
          value={phone}
          onChangeText={(_masked, unmasked) => {
            setPhone(unmasked);
          }}
          mask={Masks.BRL_PHONE}
          placeholder='(DD) XXXX-XXXX'
          autoCapitalize='none'
          keyboardType='phone-pad'
        />
        <TextInputStyled
          label='Senha'
          value={password}
          onChangeText={setPassword}
          placeholder='Mínimo 8 caracteres'
          autoCapitalize='none'
          secureTextEntry
        />
        <TextInputStyled
          label='Confirmar Senha'
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder='Repita sua senha'
          autoCapitalize='none'
          secureTextEntry
        />
        
        <Text className= "my-5 text-sm font-semibod text-gray-400">
          Ao criar sua conta, você concorda com os termos de serviço e a política de privacidade da iClinic.
        </Text>
        
        <Pressable
          className="bg-blue-400 p-5 rounded-xl mt-2 mb-4"
          onPress={()=>
          onSubmit()
          }
        >
          <Text className="text-white text-center font-semibold text-lg">
            Criar conta
          </Text>
        </Pressable>

        <View className="flex-row flex-1 justify-center gap-1">
          <Text className="mt-1 mb-5 text-sm font-semibold text-gray-400">
            Já possui uma conta? </Text>
          
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