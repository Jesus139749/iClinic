import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header } from "../../../components/Header";
import type { AgendamentoStackParamList } from "../../../routes/navigationTypes";
import DetalhesClinicaScreen from "./DetalhesClinica/DetalhesClinicaScreen";

const Stack = createNativeStackNavigator<AgendamentoStackParamList>();

export default function AgendamentoStackRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: () => <Header />,
      }}
    >
      <Stack.Screen
        name="DetalhesClinica"
        component={DetalhesClinicaScreen}
        options={{ title: "Detalhes da clínica" }}
      />
    </Stack.Navigator>
  );
}
