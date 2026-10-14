import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputStyled } from '../../../components/TextInputStyled';
import { Masks } from 'react-native-mask-input';
import { ViaCepResponse } from './interfaces/ViaCepResponse';
import { estadosBrasileiros } from './utils/EstadosBrasileiros';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
  const [isStatePickerVisible, setIsStatePickerVisible] = useState(false);
  const [isLookingUpPostalCode, setIsLookingUpPostalCode] = useState(false);
  const [postalCodeLookupError, setPostalCodeLookupError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  useEffect(() => {
    if (postalCode.length !== 8) {
      setIsLookingUpPostalCode(false);
      setPostalCodeLookupError('');
      return;
    }

    const lookupPostalCode = async () => {
      setIsLookingUpPostalCode(true);
      setPostalCodeLookupError('');

      try {
        const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`);

        if (!response.ok) {
          throw new Error('Não foi possível consultar o CEP. Tente novamente.');
        }

        const result = (await response.json()) as ViaCepResponse;
        if (result.erro) {
          setPostalCodeLookupError('CEP não encontrado. Confira o número digitado.');
          return;
        }

        setState(result.uf);
        setCity(result.localidade);
        setNeighborhood(result.bairro);
      } catch {
        setPostalCodeLookupError('Não foi possível consultar o CEP. Verifique sua conexão e tente novamente.');
      } finally {
        setIsLookingUpPostalCode(false);
      }
    };

    lookupPostalCode();
  }, [postalCode]);

  const onSubmit = async () => {
    setSubmitError('');

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
    };

    if (!name.trim()) newErrors.name.push('Nome é obrigatório');

    if (!cnpj.trim()) newErrors.cnpj.push('CNPJ é obrigatório');

    if (cnpj.length < 14) newErrors.cnpj.push('CNPJ deve conter 14 caracteres');

    if (!email.trim()) newErrors.email.push('E-mail é obrigatório');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email.push('E-mail deve ser válido');

    if (!phone.trim()) newErrors.phone.push('Telefone é obrigatório');

    if (phone.length < 11) newErrors.phone.push('Telefone deve conter 11 dígitos');

    if (!street.trim()) newErrors.street.push('Logradouro é obrigatório');

    if (!number.trim()) newErrors.number.push('Número é obrigatório');

    if (!neighborhood.trim()) newErrors.neighborhood.push('Bairro é obrigatório');

    if (!city.trim()) newErrors.city.push('Cidade é obrigatória');

    if (!state.trim()) newErrors.state.push('Estado é obrigatório');

    if (!postalCode.trim()) newErrors.postalCode.push('CEP é obrigatório');

    if (postalCode.length < 8) newErrors.postalCode.push('CEP deve conter 8 dígitos');

    if (!password.trim()) newErrors.password.push('Senha é obrigatória');

    if (confirmPassword.trim() != password.trim()) newErrors.confirmPassword.push('As senhas não conferem');

    setErrors(newErrors);

    if (Object.values(newErrors).some((fieldErrors) => fieldErrors.length > 0)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/clinica`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string | string[] };
        const message = result.message;
        setSubmitError(Array.isArray(message) ? message.join('\n') : (message ?? 'Não foi possível cadastrar a clínica. Tente novamente.'));
        return;
      }

      Alert.alert('Cadastro concluído', 'Clínica cadastrada com sucesso. Você já pode fazer login.');
      navigation.navigate('Login' as never);
    } catch {
      setSubmitError(`Não foi possível conectar à API (${API_URL}). Verifique se o backend está ativo e tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-slate-50'>
      <ScrollView className='flex-1 px-8'>
        <Text className='text-2xl font-bold text-gray-800'>Cadastrar clínica</Text>

        <Text className='text-slate-400'>Preencha os dados abaixo para cadastrar sua clínica na plataforma iClinic.</Text>

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

        <View className='mt-6 rounded-2xl border border-slate-200 bg-white p-4'>
          <Text className='text-lg font-bold text-gray-800'>Endereço da clínica</Text>
          <Text className='mt-1 text-sm text-slate-400'>Informe o CEP para preencher cidade, bairro e estado automaticamente.</Text>

          <TextInputStyled
            label='CEP'
            value={postalCode}
            errors={errors.postalCode}
            mask={Masks.ZIP_CODE}
            onChangeText={(_masked, unmasked) => {
              setPostalCode(unmasked);
              setCity('');
              setState('');
              setNeighborhood('');
            }}
            placeholder='00000-000'
            keyboardType='numeric'
          />
          {isLookingUpPostalCode && (
            <View className='mt-2 flex-row items-center'>
              <ActivityIndicator size='small' color='#2F80ED' />
              <Text className='ml-2 text-sm text-slate-500'>Consultando CEP...</Text>
            </View>
          )}
          {!!postalCodeLookupError && <Text className='mt-2 text-sm text-red-400'>{postalCodeLookupError}</Text>}

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

          <Text className='mb-2 mt-4 text-sm font-semibold text-gray-600'>Estado (UF)</Text>
          <Pressable className='rounded-xl border border-gray-200 bg-white px-4 py-3' onPress={() => setIsStatePickerVisible(true)}>
            <Text className={state ? 'text-base text-gray-800' : 'text-base text-slate-400'}>
              {state ? (estadosBrasileiros.find((estado) => estado.sigla === state)?.nome ?? state) : 'Selecione o estado'}
            </Text>
          </Pressable>
          {errors.state.map((error) => (
            <Text key={error} className='text-sm text-red-400'>
              {error}
            </Text>
          ))}

          <TextInputStyled
            label='Cidade'
            value={city}
            errors={errors.city}
            onChangeText={setCity}
            placeholder='Ex: São Paulo'
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
            label='Complemento (opcional)'
            value={complement}
            onChangeText={setComplement}
            placeholder='Ex: Sala 4'
            autoCapitalize='words'
          />
        </View>

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

        <Text className='my-5 text-sm font-semibold text-gray-400'>
          Ao cadastrar sua clínica, você concorda com os Termos de Uso e a Política de Privacidade da iClinic.
        </Text>

        {!!submitError && (
          <Text accessibilityRole='alert' className='mb-3 text-sm text-red-500'>
            {submitError}
          </Text>
        )}
        <Pressable
          className={`rounded-xl p-5 mt-2 mb-4 ${isSubmitting ? 'bg-blue-300' : 'bg-blue-400'}`}
          disabled={isSubmitting}
          onPress={() => onSubmit()}
        >
          <Text className='text-center text-white font-bold'>{isSubmitting ? 'Cadastrando...' : 'Cadastrar clínica'}</Text>
        </Pressable>

        <View className='flex-row flex-1 justify-center gap-1'>
          <Text className='mt-1 mb-5 text-sm font-semibold text-gray-400'>Já tem uma conta?</Text>
          <Pressable onPress={() => navigation.navigate('Login' as never)}>
            <Text className='mt-1 mb-5 text-sm font-semibold text-blue-500'>Fazer login</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={isStatePickerVisible} transparent animationType='fade' onRequestClose={() => setIsStatePickerVisible(false)}>
        <View className='flex-1 justify-center bg-black/40 px-8'>
          <View className='max-h-3/4 rounded-2xl bg-white p-5'>
            <Text className='mb-3 text-lg font-bold text-gray-800'>Selecione o estado</Text>
            <ScrollView>
              {estadosBrasileiros.map((estado) => (
                <Pressable
                  key={estado.sigla}
                  className='border-b border-slate-100 py-3'
                  onPress={() => {
                    setState(estado.sigla);
                    setIsStatePickerVisible(false);
                  }}
                >
                  <Text className='text-base text-gray-700'>
                    {estado.nome} ({estado.sigla})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable className='mt-3 items-center rounded-xl bg-slate-100 py-3' onPress={() => setIsStatePickerVisible(false)}>
              <Text className='font-semibold text-slate-600'>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
