import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { tabIcon } from "../../../routes/tabIcon";
import { AgendaScreen } from "../Agenda/AgendaScreen";
import { ConsultasScreen } from "../Consultas/ConsultasScreen";
import ClinicDashboardScreen from "../Dashboard/DashboardClinicaScreen";
import { MedicosScreen } from "../Medicos/MedicosScreen";
import ClinicProfileScreen from "../Perfil/PerfilClinicaScreen";

const Tab = createBottomTabNavigator();

export default function ClinicTabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={ClinicDashboardScreen} options={tabIcon("home")} />
      <Tab.Screen name="Médicos" component={MedicosScreen} options={tabIcon("people")} />
      <Tab.Screen name="Agenda" component={AgendaScreen} options={tabIcon("calendar")} />
      <Tab.Screen name="Consultas" component={ConsultasScreen} options={tabIcon("clipboard")} />
      <Tab.Screen name="Perfil" component={ClinicProfileScreen} options={tabIcon("person")} />
    </Tab.Navigator>
  );
}
