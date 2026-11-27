import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header } from "../components/Header";
import ClinicSignUpScreen from "../screens/Clinica/Cadastro/CadastroClinicaScreen";
import DoctorFormScreen from "../screens/Clinica/Medicos/MedicoFormScreen";
import ClinicTabRoutes from "../screens/Clinica/tabs/clinicatab.routes";
import HomeScreen from "../screens/Home/HomeScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import AppointmentStackRoutes from "../screens/Paciente/Agendamento/AgendamentoStackRoutes";
import PatientSignUpScreen from "../screens/Paciente/Cadastro/CadastroPacienteScreen";
import PatientTabRoutes from "../screens/Paciente/tabs/pacientetab.routes";
import type { RootStackParamList } from "./navigationTypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

const withHeader = { headerShown: true, header: () => <Header /> };

export default function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CadastroPaciente" component={PatientSignUpScreen} options={withHeader} />
      <Stack.Screen name="CadastroClinica" component={ClinicSignUpScreen} options={withHeader} />
      <Stack.Screen name="DashboardPaciente" component={PatientTabRoutes} options={withHeader} />
      <Stack.Screen name="Agendamento" component={AppointmentStackRoutes} />
      <Stack.Screen name="DashboardClinica" component={ClinicTabRoutes} options={withHeader} />
      <Stack.Screen name="CadastroMedico" component={DoctorFormScreen} options={withHeader} />
      <Stack.Screen name="EditarMedico" component={DoctorFormScreen} options={withHeader} />
    </Stack.Navigator>
  );
}
