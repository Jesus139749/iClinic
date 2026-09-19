import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardPacienteScreen from '../Dashboard/DashboardPacienteScreen';
import ConsultasScreen from '../Consultas/ConsultasScreen';
import FavoritosScreen from '../Favoritos/FavoritosScreen';
import PerfilScreen from '../Perfil/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function PacienteTabRoutes() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Inicio"
                component={DashboardPacienteScreen}
            />

            <Tab.Screen
                name="Consultas"
                component={ConsultasScreen}
            />

            <Tab.Screen
                name="Favoritos"
                component={FavoritosScreen}
            />

            <Tab.Screen
                name="Perfil"
                component={PerfilScreen}
            />
        </Tab.Navigator>
    );
}