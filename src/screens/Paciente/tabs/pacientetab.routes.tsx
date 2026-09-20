import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardPacienteScreen from '../Dashboard/DashboardPacienteScreen';
import ConsultasScreen from '../Consultas/ConsultasScreen';
import FavoritosScreen from '../Favoritos/FavoritosScreen';
import PerfilScreen from '../Perfil/PerfilScreen';
import Ionicons from '@expo/vector-icons/build/Ionicons';

const Tab = createBottomTabNavigator();

export default function PacienteTabRoutes() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Inicio"
                component={DashboardPacienteScreen}
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
                name="Consultas"
                component={ConsultasScreen}
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
                name="Favoritos"
                component={FavoritosScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'heart' : 'heart-outline'}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </Tab.Navigator>
    );
}