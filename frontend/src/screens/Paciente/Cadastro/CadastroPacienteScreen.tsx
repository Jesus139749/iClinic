import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Masks } from "react-native-mask-input";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInputStyled } from "../../../components/TextInputStyled";
import type { RootStackParamList } from "../../../routes/navigationTypes";
import { getRequestErrorMessage } from "../../../services/apiClient";
import { signUpPatient, type PatientSignUp } from "../../../services/authService";
import { EMAIL_REGEX } from "../../../utils/format";
import type { PatientSignUpErrors } from "./interfaces/PatientSignUpErrors";

function validate(form: PatientSignUp): PatientSignUpErrors {
  const errors: PatientSignUpErrors = {};

  if (!form.name.trim()) errors.name = "Nome é obrigatório";

  if (!form.email.trim()) errors.email = "E-mail é obrigatório";
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = "E-mail deve ser válido";

  if (!form.phone) errors.phone = "Telefone é obrigatório";
  else if (form.phone.length < 11) errors.phone = "Telefone deve conter 11 dígitos";

  if (!form.password.trim()) errors.password = "Senha é obrigatória";
  else if (form.password.length < 8) errors.password = "Senha deve conter no mínimo 8 caracteres";

  if (!form.confirmPassword.trim()) errors.confirmPassword = "Confirmar Senha é obrigatório";
  else if (form.password !== form.confirmPassword) errors.confirmPassword = "As senhas não coincidem";

  return errors;
}

export default function CadastroPacienteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [form, setForm] = useState<PatientSignUp>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<PatientSignUpErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (field: keyof PatientSignUp) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  async function handleSignUp() {
    const newErrors = validate(form);
    setErrors(newErrors);
    setSubmitError("");
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signUpPatient({ ...form, name: form.name.trim(), email: form.email.trim() });
      Alert.alert("Cadastro concluído", "Sua conta foi criada com sucesso. Você já pode fazer login.", [
        { text: "Fazer login", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (e) {
      setSubmitError(getRequestErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-8">
        <Text className="text-2xl font-bold text-gray-800">Criar sua conta</Text>
        <Text className="text-slate-400">
          Preencha os dados abaixo para criar sua conta na plataforma iClinic.
        </Text>

        <TextInputStyled
          label="Nome completo"
          value={form.name}
          error={errors.name}
          onChangeText={set("name")}
          placeholder="Ex: João da Silva"
          autoCapitalize="words"
        />
        <TextInputStyled
          label="E-mail"
          value={form.email}
          error={errors.email}
          onChangeText={set("email")}
          placeholder="seuemail@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInputStyled
          label="Telefone"
          value={form.phone}
          error={errors.phone}
          onChangeText={set("phone")}
          mask={Masks.BRL_PHONE}
          placeholder="(DD) XXXX-XXXX"
          keyboardType="phone-pad"
        />
        <TextInputStyled
          label="Senha"
          value={form.password}
          error={errors.password}
          onChangeText={set("password")}
          placeholder="Mínimo 8 caracteres"
          autoCapitalize="none"
          secureTextEntry
        />
        <TextInputStyled
          label="Confirmar Senha"
          value={form.confirmPassword}
          error={errors.confirmPassword}
          onChangeText={set("confirmPassword")}
          placeholder="Repita sua senha"
          autoCapitalize="none"
          secureTextEntry
        />

        <Text className="my-5 text-sm font-semibold text-gray-400">
          Ao criar sua conta, você concorda com os termos de serviço e a política de privacidade
          da iClinic.
        </Text>

        {submitError ? (
          <Text accessibilityRole="alert" className="mb-3 text-sm text-red-500">
            {submitError}
          </Text>
        ) : null}

        <Pressable
          className="mb-4 mt-2 flex-row items-center justify-center gap-2 rounded-xl bg-blue-400 p-5"
          onPress={handleSignUp}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : null}
          <Text className="text-center text-lg font-semibold text-white">
            {submitting ? "Criando conta..." : "Criar conta"}
          </Text>
        </Pressable>

        <View className="flex-row justify-center gap-1">
          <Text className="mb-5 mt-1 text-sm font-semibold text-gray-400">Já possui uma conta?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text className="mb-5 mt-1 text-sm font-semibold text-blue-500">Fazer login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
