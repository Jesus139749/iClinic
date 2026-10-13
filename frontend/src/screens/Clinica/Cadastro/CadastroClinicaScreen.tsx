import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputStyled } from '../../../components/TextInputStyled';
import { Masks } from 'react-native-mask-input';

export default function CadastroClinicaScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string[]>>({
    name: [],
    cnpj: [],
    email: [],
    phone: [],
    street: [],
    number: [],
    neighborhood: [],
    city: [],
    state: [],
    postalCode: [],
    password: [],
    confirmPassword: [],
  });

  const onSubmit = () => {
    const newErrors: Record<string, string[]> = {
      name: [],
      cnpj: [],
      email: [],
      phone: [],
      street: [],
      number: [],
      neighborhood: [],
      city: [],
      state: [],
      postalCode: [],
      password: [],
      confirmPassword: [],
    }

    if (!name.trim())
      newErrors.name.push('Nome é obrigatório');

    if (!cnpj.trim())
      newErrors.cnpj.push('CNPJ é obrigatório');

    if (cnpj.length < 14)
      newErrors.cnpj.push('CNPJ deve conter 14 caracteres');

    if (!email.trim())
      newErrors.email.push('E-mail é obrigatório');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email.push('E-mail deve ser válido');

    if (!phone.trim())
      newErrors.phone.push('Telefone é obrigatório');

    if (phone.length < 11)
      newErrors.phone.push('Telefone deve conter 11 dígitos');

    if (!street.trim())
      newErrors.street.push('Logradouro é obrigatório');

    if (!number.trim())
      newErrors.number.push('Número é obrigatório');

    if (!neighborhood.trim())
      newErrors.neighborhood.push('Bairro é obrigatório');

    if (!city.trim())
      newErrors.city.push('Cidade é obrigatória');

    if (!state.trim())
      newErrors.state.push('Estado é obrigatório');

    if (!postalCode.trim())
      newErrors.postalCode.push('CEP é obrigatório');

    if (postalCode.length < 8)
      newErrors.postalCode.push('CEP deve conter 8 dígitos');

    if (!password.trim())
      newErrors.password.push('Senha é obrigatória');

    if (confirmPassword.trim() != password.trim())
      newErrors.confirmPassword.push('As senhas não conferem');

    setErrors(newErrors);

    if (Object.values(newErrors).some((fieldErrors) => fieldErrors.length > 0))
      return;

    console.log({
      name,
      cnpj,
      email,
      phone,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      postalCode,
      password,
      confirmPassword
    });
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
          errors={errors.name}
          onChangeText={setName}
          placeholder='Ex: Clínica São Lucas'
          autoCapitalize='words'
        />

        <TextInputStyled
          label='CNPJ'
          value={cnpj}
          mask={Masks.BRL_CNPJ}
          errors={errors.cnpj}
          onChangeText={(_masked, unmasked) => {
            setCnpj(unmasked);
          }}
          keyboardType='numeric'
          placeholder='XX.XXX.XXX/XXXX-XX'
        />

        <TextInputStyled
          label='E-mail institucional'
          subText='Usaremos para login e recuperação de senha'
          value={email}
          errors={errors.email}
          onChangeText={setEmail}
          placeholder='contato@clinica.com.br'
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <TextInputStyled
          label='Telefone comercial'
          value={phone}
          errors={errors.phone}
          mask={Masks.BRL_PHONE}
          onChangeText={(_masked, unmasked) => {
            setPhone(unmasked);
          }}
          placeholder='(DD) XXXX-XXXX'
          keyboardType='phone-pad'
        />

        <TextInputStyled
          label='Logradouro'
          value={street}
          errors={errors.street}
          onChangeText={setStreet}
          placeholder='Ex: Rua das Flores'
          autoCapitalize='words'
        />

        <TextInputStyled
          label='Número'
          value={number}
          errors={errors.number}
          onChangeText={setNumber}
          placeholder='Ex: 123'
          keyboardType='numeric'
        />

        <TextInputStyled
          label='Complemento (opcional)'
          value={complement}
          onChangeText={setComplement}
          placeholder='Ex: Sala 4'
          autoCapitalize='words'
        />

        <TextInputStyled
          label='Bairro'
          value={neighborhood}
          errors={errors.neighborhood}
          onChangeText={setNeighborhood}
          placeholder='Ex: Centro'
          autoCapitalize='words'
        />

        <TextInputStyled
          label='Cidade'
          value={city}
          errors={errors.city}
          onChangeText={setCity}
          placeholder='Ex: São Paulo'
          autoCapitalize='words'
        />

        <TextInputStyled
          label='Estado (UF)'
          value={state}
          errors={errors.state}
          onChangeText={setState}
          placeholder='Ex: SP'
          autoCapitalize='characters'
          maxLength={2}
        />

        <TextInputStyled
          label='CEP'
          value={postalCode}
          errors={errors.postalCode}
          mask={Masks.ZIP_CODE}
          onChangeText={(_masked, unmasked) => setPostalCode(unmasked)}
          placeholder='00000-000'
          keyboardType='numeric'
        />

        <TextInputStyled
          label='Senha'
          subText='Use letras, números e caracteres especiais'
          value={password}
          errors={errors.password}
          onChangeText={setPassword}
          placeholder='Mínimo 8 caracteres'
          secureTextEntry
        />

        <TextInputStyled
          label='Confirmar senha'
          value={confirmPassword}
          errors={errors.confirmPassword}
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