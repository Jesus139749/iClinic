import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import CadastroPacienteScreen from '../screens/Paciente/Cadastro/CadastroPacienteScreen';
import CadastroClinicaScreen from '../screens/Clinica/Cadastro/CadastroClinicaScreen';
import TabRoutes from './tab.routes';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CadastroPaciente" component={CadastroPacienteScreen} />
      <Stack.Screen name="CadastroClinica" component={CadastroClinicaScreen} />
      <Stack.Screen name="Main" component={TabRoutes} />
    </Stack.Navigator>
  );
}