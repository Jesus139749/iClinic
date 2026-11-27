import { Ionicons } from "@expo/vector-icons";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

/** Opções da aba: ícone cheio quando selecionada, contorno quando não. */
export function tabIcon(icon: "home" | "calendar" | "search" | "person" | "people" | "clipboard"): BottomTabNavigationOptions {
  return {
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons name={focused ? icon : `${icon}-outline`} size={size} color={color} />
    ),
  };
}
