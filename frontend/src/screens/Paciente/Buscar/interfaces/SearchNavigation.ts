import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { PatientTabParamList, RootStackParamList } from "../../../../routes/navigationTypes";

export type SearchNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<PatientTabParamList, "Buscar">,
  NativeStackNavigationProp<RootStackParamList>
>;
