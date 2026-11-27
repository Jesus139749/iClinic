import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header } from "../../../components/Header";
import type { AppointmentStackParamList } from "../../../routes/navigationTypes";
import ClinicDetailsScreen from "./DetalhesClinica/DetalhesClinicaScreen";
import EscolherEspecialidadeScreen from "./EscolherEspecialidade/EscolherEspecialidadeScreen";
import EscolherMedicoScreen from "./EscolherMedico/EscolherMedicoScreen";

const Stack = createNativeStackNavigator<AppointmentStackParamList>();

export default function AppointmentStackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, header: () => <Header /> }}>
      <Stack.Screen
        name="DetalhesClinica"
        component={ClinicDetailsScreen}
        options={{ title: "Detalhes da clínica" }}
      />
      <Stack.Screen
        name="EscolherEspecialidade"
        component={EscolherEspecialidadeScreen}
        options={{ title: "Escolher especialidade" }}
      />
      <Stack.Screen
        name="EscolherMedico"
        component={EscolherMedicoScreen}
        options={{ title: "Escolher médico" }}
      />
    </Stack.Navigator>
  );
}
