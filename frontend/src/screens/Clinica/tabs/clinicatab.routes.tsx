import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { tabIcon } from "../../../routes/tabIcon";
import { ScheduleScreen } from "../Agenda/AgendaScreen";
import { ClinicAppointmentsScreen } from "../Consultas/ConsultasScreen";
import ClinicDashboardScreen from "../Dashboard/DashboardClinicaScreen";
import { DoctorsScreen } from "../Medicos/MedicosScreen";
import ClinicProfileScreen from "../Perfil/PerfilClinicaScreen";

const Tab = createBottomTabNavigator();

export default function ClinicTabRoutes() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={ClinicDashboardScreen} options={tabIcon("home")} />
      <Tab.Screen name="Médicos" component={DoctorsScreen} options={tabIcon("people")} />
      <Tab.Screen name="Agenda" component={ScheduleScreen} options={tabIcon("calendar")} />
      <Tab.Screen name="Consultas" component={ClinicAppointmentsScreen} options={tabIcon("clipboard")} />
      <Tab.Screen name="Perfil" component={ClinicProfileScreen} options={tabIcon("person")} />
    </Tab.Navigator>
  );
}
