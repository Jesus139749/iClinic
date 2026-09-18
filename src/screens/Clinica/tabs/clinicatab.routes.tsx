import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardClinicaScreen from '../Dashboard/DashboardClinicaScreen';
import { MedicosScreen } from '../Medicos/MedicosScreen';
import { AgendaScreen } from '../Agenda/AgendaScreen';
import { ConsultasScreen } from '../Consultas/ConsultasScreen';

const Tab = createBottomTabNavigator();

export default function ClinicaTabRoutes() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Inicio"
                component={DashboardClinicaScreen}
            />

            <Tab.Screen
                name="Médicos"
                component={MedicosScreen}
            />

            <Tab.Screen
                name="Agenda"
                component={AgendaScreen}
            />

            <Tab.Screen
                name="Consultas"
                component={ConsultasScreen}
            />
        </Tab.Navigator>
    );
}