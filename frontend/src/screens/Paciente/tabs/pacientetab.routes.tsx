import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { PatientTabParamList } from "../../../routes/navigationTypes";
import { tabIcon } from "../../../routes/tabIcon";
import SearchClinicsScreen from "../Buscar/BuscarScreen";
import PatientAppointmentsScreen from "../Consultas/ConsultasScreen";
import PatientDashboardScreen from "../Dashboard/DashboardPacienteScreen";
import PatientProfileScreen from "../Perfil/PerfilScreen";

const Tab = createBottomTabNavigator<PatientTabParamList>();

export default function PatientTabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={PatientDashboardScreen} options={tabIcon("home")} />
      <Tab.Screen name="Consultas" component={PatientAppointmentsScreen} options={tabIcon("calendar")} />
      <Tab.Screen name="Buscar" component={SearchClinicsScreen} options={tabIcon("search")} />
      <Tab.Screen name="Perfil" component={PatientProfileScreen} options={tabIcon("person")} />
    </Tab.Navigator>
  );
}
