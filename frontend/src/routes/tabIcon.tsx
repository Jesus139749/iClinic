import { Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import type { TabIconName } from "./interfaces/TabIconName";

/** Opções da aba: ícone cheio quando selecionada, contorno quando não. */
export function tabIcon(icon: TabIconName): BottomTabNavigationOptions {
  return {
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons name={focused ? icon : `${icon}-outline`} size={size} color={color} />
    ),
  };
}
