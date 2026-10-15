import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInputStyled } from "../../../components/TextInputStyled";
import { Masks } from "react-native-mask-input";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CadastroPacienteScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submissionInProgress = useRef(false);

  const [errors, setErrors] = useState<Record<string, string[]>>({
    name: [],
    email: [],
    phone: [],
    password: [],
    confirmPassword: [],
  });

  const onSubmit = async () => {
    if (submissionInProgress.current) return;

    setSubmitError("");
    const newErrors: Record<string, string[]> = {
      name: [],
      email: [],
      phone: [],
      password: [],
      confirmPassword: [],
    };

    if (!name.trim()) {
      newErrors.name.push("Nome é obrigatório");
    }
    if (!email.trim()) {
      newErrors.email.push("E-mail é obrigatório");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email.push("E-mail deve ser válido");
    }
    if (!phone.trim()) {
      newErrors.phone.push("Telefone é obrigatório");
    }
    if (phone.length < 11) {
      newErrors.phone.push("Telefone deve conter 11 dígitos");
    }
    if (!password.trim()) {
      newErrors.password.push("Senha é obrigatória");
    }
    if (password.length < 8) {
      newErrors.password.push("Senha deve conter no mínimo 8 caracteres");
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword.push("Confirmar Senha é obrigatório");
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword.push("As senhas não coincidem");
    }

    setErrors(newErrors);

    if (
      Object.values(newErrors).some((fieldErrors) => fieldErrors.length > 0)
    ) {
      return;
    }

    if (!API_URL) {
      setSubmitError(
        "A URL da API não está configurada. Verifique EXPO_PUBLIC_API_URL.",
      );
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/paciente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone,
          password,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        let apiMessage: string | string[] | undefined;

        try {
          const result = (await response.json()) as {
            message?: string | string[];
          };
          apiMessage = result.message;
        } catch {
          // A status-specific message below is used when the response isn't JSON.
        }

        if (response.status === 409) {
          setSubmitError(
            "Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.",
          );
        } else if (response.status === 400) {
          setSubmitError(
            Array.isArray(apiMessage)
              ? apiMessage.join("\n")
              : (apiMessage ??
                  "Confira os dados informados e tente novamente."),
          );
        } else {
          setSubmitError(
            "Não foi possível concluir o cadastro. Tente novamente mais tarde.",
          );
        }

        return;
      }

      Alert.alert(
        "Cadastro concluído",
        "Sua conta foi criada com sucesso. Você já pode fazer login.",
        [
          {
            text: "Fazer login",
            onPress: () => navigation.navigate("Login" as never),
          },
        ],
      );
    } catch {
      setSubmitError(
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-8">
        <Text className="text-2xl font-bold text-gray-800">
          Criar sua conta
        </Text>
        <Text className="color-slate-400">
          Preencha os dados abaixo para criar sua conta na plataforma iClinic.
        </Text>

        <TextInputStyled
          label="Nome completo"
          value={name}
          errors={errors.name}
          onChangeText={setName}
          placeholder="Ex: João da Silva"
          autoCapitalize="words"
        />
        <TextInputStyled
          label="E-mail"
          value={email}
          errors={errors.email}
          onChangeText={setEmail}
          placeholder="seuemail@exemplo.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInputStyled
          label="Telefone"
          value={phone}
          errors={errors.phone}
          onChangeText={(_masked, unmasked) => {
            setPhone(unmasked);
          }}
          mask={Masks.BRL_PHONE}
          placeholder="(DD) XXXX-XXXX"
          autoCapitalize="none"
          keyboardType="phone-pad"
        />
        <TextInputStyled
          label="Senha"
          value={password}
          errors={errors.password}
          onChangeText={setPassword}
          placeholder="Mínimo 8 caracteres"
          autoCapitalize="none"
          secureTextEntry
        />
        <TextInputStyled
          label="Confirmar Senha"
          value={confirmPassword}
          errors={errors.confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repita sua senha"
          autoCapitalize="none"
          secureTextEntry
        />

        <Text className="my-5 text-sm font-semibod text-gray-400">
          Ao criar sua conta, você concorda com os termos de serviço e a
          política de privacidade da iClinic.
        </Text>

        {submitError ? (
          <Text accessibilityRole="alert" className="mb-3 text-sm text-red-500">
            {submitError}
          </Text>
        ) : null}

        <Pressable
          className="bg-blue-400 p-5 rounded-xl mt-2 mb-4"
          onPress={onSubmit}
          disabled={isSubmitting}
          accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
        >
          {isSubmitting ? (
            <View className="flex-row items-center justify-center gap-2">
              <ActivityIndicator color="#FFFFFF" />
              <Text className="text-white text-center font-semibold text-lg">
                Criando conta...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Criar conta
            </Text>
          )}
        </Pressable>

        <View className="flex-row flex-1 justify-center gap-1">
          <Text className="mt-1 mb-5 text-sm font-semibold text-gray-400">
            Já possui uma conta?{" "}
          </Text>

          <Pressable onPress={() => navigation.navigate("Login" as never)}>
            <Text className="mt-1 mb-5 text-sm font-semibold text-blue-500">
              Fazer login
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
