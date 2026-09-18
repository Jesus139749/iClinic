import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardPacienteScreen from '../Dashboard/DashboardPacienteScreen';
import Consultas from '../Consultas/ConsultasScreen';
import Favoritos from '../Favoritos/FavoritosScreen';
import Perfil from '../Perfil/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Inicio"
                component={DashboardPacienteScreen}
            />

            <Tab.Screen
                name="Consultas"
                component={Consultas}
            />

            <Tab.Screen
                name="Favoritos"
                component={Favoritos}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
            />
        </Tab.Navigator>
    );
}