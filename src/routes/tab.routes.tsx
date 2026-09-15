import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import Consultas from '../screens/Consultas/ConsultasScreen';
import Favoritos from '../screens/Favoritos/FavoritosScreen';
import Perfil from '../screens/Perfil/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen 
            name="Home"
            component={HomeScreen}
            >
            </Tab.Screen>
            <Tab.Screen
            name="Consultas"
            component={Consultas}
            >   
            </Tab.Screen>

            <Tab.Screen
            name="Favoritos"
            component={Favoritos}
            >
            </Tab.Screen>

            <Tab.Screen
            name="Perfil"
            component={Perfil}
            >
            </Tab.Screen>
        </Tab.Navigator>

    )
}