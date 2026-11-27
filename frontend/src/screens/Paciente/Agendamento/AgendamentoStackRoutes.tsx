import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header } from "../../../components/Header";
import type { AppointmentStackParamList } from "../../../routes/navigationTypes";
import ClinicDetailsScreen from "./DetalhesClinica/DetalhesClinicaScreen";
import EscolherEspecialidadeScreen from "./EscolherEspecialidade/EscolherEspecialidadeScreen";

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
    </Stack.Navigator>
  );
}
