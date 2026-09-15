
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Login/LoginScreen';
import CadastroPacienteScreen from '../screens/CadastroPaciente/CadastroPacienteScreen';
import CadastroClinicaScreen from '../screens/CadastroClinica/CadastroClinicaScreen';
import TabRoutes from './tab.routes';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CadastroPaciente" component={CadastroPacienteScreen} />
      <Stack.Screen name="CadastroClinica" component={CadastroClinicaScreen} />
      <Stack.Screen name="Main" component={TabRoutes} />
    </Stack.Navigator>
  );
}