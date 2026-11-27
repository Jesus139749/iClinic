import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { TextInputStyled } from "../../components/TextInputStyled";
import type { RootStackParamList } from "../../routes/navigationTypes";
import { getRequestErrorMessage } from "../../services/apiClient";
import { login } from "../../services/authService";
import { saveAuthToken } from "../../services/authTokenStorage";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Informe seu e-mail e sua senha para entrar.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const { token, role } = await login(email.trim(), password);
      await saveAuthToken(token);
      navigation.navigate(role === "PACIENTE" ? "DashboardPaciente" : "DashboardClinica");
    } catch (e) {
      setError(getRequestErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-slate-50 px-8">
      <View className="mb-10 items-center">
        <Text className="text-4xl font-bold text-blue-500">iClinic</Text>
        <Text className="mt-1 text-sm text-gray-400">Saúde ao seu alcance</Text>
      </View>

      <TextInputStyled
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInputStyled
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        autoCapitalize="none"
        secureTextEntry
      />

      <TouchableOpacity className="mb-7 mt-4 self-end">
        <Text className="font-semibold text-blue-500">Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={submitting}
        className="h-14 flex-row items-center justify-center gap-2 rounded-xl bg-blue-500"
      >
        {submitting ? <ActivityIndicator color="#FFFFFF" /> : null}
        <Text className="text-base font-bold text-white">{submitting ? "Entrando..." : "Entrar"}</Text>
      </TouchableOpacity>

      {error ? (
        <Text accessibilityRole="alert" className="mt-3 text-center text-sm text-red-500">
          {error}
        </Text>
      ) : null}

      <View className="border-t border-gray-200 pt-6">
        <Text className="mb-3 text-center text-sm font-semibold text-gray-600">
          Não tem uma conta? Cadastre-se como:
        </Text>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => navigation.navigate("CadastroPaciente")}
            className="h-14 flex-1 flex-row items-center justify-center rounded-xl border border-[#3182E8] bg-[#3182E8]"
          >
            <Ionicons name="person-outline" size={21} color="#FFFFFF" />
            <Text className="ml-2 text-base font-medium text-white">Paciente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("CadastroClinica")}
            className="h-14 flex-1 flex-row items-center justify-center rounded-xl border border-[#E0E4EA] bg-white"
          >
            <Ionicons name="home" size={20} color="#000000" />
            <Text className="ml-2 text-base font-medium text-[#333333]">Clínica</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
