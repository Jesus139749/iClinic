import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="Médicos"
                component={MedicosScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'people' : 'people-outline'}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="Agenda"
                component={AgendaScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="Consultas"
                component={ConsultasScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'clipboard' : 'clipboard-outline'}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    );
}