import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Masks } from "react-native-mask-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInputStyled } from "../../../components/TextInputStyled";
import type { RootStackParamList } from "../../../routes/navigationTypes";
import { getRequestErrorMessage } from "../../../services/apiClient";
import { signUpClinic, type ClinicSignUp } from "../../../services/authService";
import { brazilianStates } from "../../../utils/brazilianStates";
import { EMAIL_REGEX } from "../../../utils/format";
import { lookupPostalCode } from "../../../utils/viaCep";
import type { ClinicSignUpErrors } from "./interfaces/ClinicSignUpErrors";

const EMPTY_FORM: ClinicSignUp = {
  name: "",
  cnpj: "",
  email: "",
  phone: "",
  postalCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  password: "",
  confirmPassword: "",
};

function validate(form: ClinicSignUp): ClinicSignUpErrors {
  const errors: ClinicSignUpErrors = {};
  const required = (field: keyof ClinicSignUp, message: string) => {
    if (!form[field].trim()) errors[field] = message;
  };

  required("name", "Nome é obrigatório");
  required("street", "Logradouro é obrigatório");
  required("number", "Número é obrigatório");
  required("neighborhood", "Bairro é obrigatório");
  required("city", "Cidade é obrigatória");
  required("state", "Estado é obrigatório");
  required("password", "Senha é obrigatória");

  if (!form.cnpj) errors.cnpj = "CNPJ é obrigatório";
  else if (form.cnpj.length < 14) errors.cnpj = "CNPJ deve conter 14 caracteres";

  if (!form.email.trim()) errors.email = "E-mail é obrigatório";
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = "E-mail deve ser válido";

  if (!form.phone) errors.phone = "Telefone é obrigatório";
  else if (form.phone.length < 11) errors.phone = "Telefone deve conter 11 dígitos";

  if (!form.postalCode) errors.postalCode = "CEP é obrigatório";
  else if (form.postalCode.length < 8) errors.postalCode = "CEP deve conter 8 dígitos";

  if (form.password !== form.confirmPassword) errors.confirmPassword = "As senhas não conferem";

  return errors;
}

export default function CadastroClinicaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [form, setForm] = useState<ClinicSignUp>(EMPTY_FORM);
  const [errors, setErrors] = useState<ClinicSignUpErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [lookingUpPostalCode, setLookingUpPostalCode] = useState(false);
  const [postalCodeError, setPostalCodeError] = useState("");
  const [statePickerOpen, setStatePickerOpen] = useState(false);

  const set = (field: keyof ClinicSignUp) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  // CEP completo: preenche estado, cidade e bairro pelo ViaCEP.
  useEffect(() => {
    setPostalCodeError("");
    if (form.postalCode.length !== 8) return;

    setLookingUpPostalCode(true);
    lookupPostalCode(form.postalCode)
      .then((address) => {
        if (address) setForm((current) => ({ ...current, ...address }));
        else setPostalCodeError("CEP não encontrado. Confira o número digitado.");
      })
      .catch(() =>
        setPostalCodeError("Não foi possível consultar o CEP. Verifique sua conexão e tente novamente."),
      )
      .finally(() => setLookingUpPostalCode(false));
  }, [form.postalCode]);

  function changePostalCode(postalCode: string) {
    // O endereço anterior não vale mais para o novo CEP.
    setForm((current) => ({ ...current, postalCode, state: "", city: "", neighborhood: "" }));
  }

  async function handleSignUp() {
    const newErrors = validate(form);
    setErrors(newErrors);
    setSubmitError("");
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signUpClinic(form);
      Alert.alert("Cadastro concluído", "Clínica cadastrada com sucesso. Você já pode fazer login.");
      navigation.navigate("Login");
    } catch (e) {
      setSubmitError(getRequestErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  const stateName = brazilianStates.find((s) => s.code === form.state)?.name ?? form.state;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-8">
        <Text className="text-2xl font-bold text-gray-800">Cadastrar clínica</Text>
        <Text className="text-slate-400">
          Preencha os dados abaixo para cadastrar sua clínica na plataforma iClinic.
        </Text>

        <TextInputStyled
          label="Nome da clínica"
          value={form.name}
          error={errors.name}
          onChangeText={set("name")}
          placeholder="Ex: Clínica São Lucas"
          autoCapitalize="words"
        />
        <TextInputStyled
          label="CNPJ"
          value={form.cnpj}
          error={errors.cnpj}
          onChangeText={set("cnpj")}
          mask={Masks.BRL_CNPJ}
          keyboardType="numeric"
          placeholder="XX.XXX.XXX/XXXX-XX"
        />
        <TextInputStyled
          label="E-mail institucional"
          subText="Usaremos para login e recuperação de senha"
          value={form.email}
          error={errors.email}
          onChangeText={set("email")}
          placeholder="contato@clinica.com.br"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInputStyled
          label="Telefone comercial"
          value={form.phone}
          error={errors.phone}
          onChangeText={set("phone")}
          mask={Masks.BRL_PHONE}
          placeholder="(DD) XXXX-XXXX"
          keyboardType="phone-pad"
        />

        <View className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="text-lg font-bold text-gray-800">Endereço da clínica</Text>
          <Text className="mt-1 text-sm text-slate-400">
            Informe o CEP para preencher cidade, bairro e estado automaticamente.
          </Text>

          <TextInputStyled
            label="CEP"
            value={form.postalCode}
            error={errors.postalCode}
            onChangeText={changePostalCode}
            mask={Masks.ZIP_CODE}
            placeholder="00000-000"
            keyboardType="numeric"
          />
          {lookingUpPostalCode ? (
            <View className="mt-2 flex-row items-center">
              <ActivityIndicator size="small" color="#2F80ED" />
              <Text className="ml-2 text-sm text-slate-500">Consultando CEP...</Text>
            </View>
          ) : null}
          {postalCodeError ? <Text className="mt-2 text-sm text-red-400">{postalCodeError}</Text> : null}

          <TextInputStyled
            label="Logradouro"
            value={form.street}
            error={errors.street}
            onChangeText={set("street")}
            placeholder="Ex: Rua das Flores"
            autoCapitalize="words"
          />
          <TextInputStyled
            label="Número"
            value={form.number}
            error={errors.number}
            onChangeText={set("number")}
            placeholder="Ex: 123"
            keyboardType="numeric"
          />

          <Text className="mb-2 mt-4 text-sm font-semibold text-gray-600">Estado (UF)</Text>
          <Pressable
            className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            onPress={() => setStatePickerOpen(true)}
          >
            <Text className={form.state ? "text-base text-gray-800" : "text-base text-slate-400"}>
              {form.state ? stateName : "Selecione o estado"}
            </Text>
          </Pressable>
          {errors.state ? <Text className="text-sm text-red-400">{errors.state}</Text> : null}

          <TextInputStyled
            label="Cidade"
            value={form.city}
            error={errors.city}
            onChangeText={set("city")}
            placeholder="Ex: São Paulo"
            autoCapitalize="words"
          />
          <TextInputStyled
            label="Bairro"
            value={form.neighborhood}
            error={errors.neighborhood}
            onChangeText={set("neighborhood")}
            placeholder="Ex: Centro"
            autoCapitalize="words"
          />
          <TextInputStyled
            label="Complemento (opcional)"
            value={form.complement}
            onChangeText={set("complement")}
            placeholder="Ex: Sala 4"
            autoCapitalize="words"
          />
        </View>

        <TextInputStyled
          label="Senha"
          subText="Use letras, números e caracteres especiais"
          value={form.password}
          error={errors.password}
          onChangeText={set("password")}
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
        />
        <TextInputStyled
          label="Confirmar senha"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChangeText={set("confirmPassword")}
          placeholder="Repita sua senha"
          secureTextEntry
        />

        <Text className="my-5 text-sm font-semibold text-gray-400">
          Ao cadastrar sua clínica, você concorda com os Termos de Uso e a Política de Privacidade
          da iClinic.
        </Text>

        {submitError ? (
          <Text accessibilityRole="alert" className="mb-3 text-sm text-red-500">
            {submitError}
          </Text>
        ) : null}

        <Pressable
          className={`mb-4 mt-2 rounded-xl p-5 ${submitting ? "bg-blue-300" : "bg-blue-400"}`}
          disabled={submitting}
          onPress={handleSignUp}
        >
          <Text className="text-center font-bold text-white">
            {submitting ? "Cadastrando..." : "Cadastrar clínica"}
          </Text>
        </Pressable>

        <View className="flex-row justify-center gap-1">
          <Text className="mb-5 mt-1 text-sm font-semibold text-gray-400">Já tem uma conta?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text className="mb-5 mt-1 text-sm font-semibold text-blue-500">Fazer login</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={statePickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setStatePickerOpen(false)}
      >
        <View className="flex-1 justify-center bg-black/40 px-8">
          <View className="max-h-3/4 rounded-2xl bg-white p-5">
            <Text className="mb-3 text-lg font-bold text-gray-800">Selecione o estado</Text>
            <ScrollView>
              {brazilianStates.map((brazilianState) => (
                <Pressable
                  key={brazilianState.code}
                  className="border-b border-slate-100 py-3"
                  onPress={() => {
                    set("state")(brazilianState.code);
                    setStatePickerOpen(false);
                  }}
                >
                  <Text className="text-base text-gray-700">
                    {brazilianState.name} ({brazilianState.code})
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              className="mt-3 items-center rounded-xl bg-slate-100 py-3"
              onPress={() => setStatePickerOpen(false)}
            >
              <Text className="font-semibold text-slate-600">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
