import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Pressable, Text, View } from "react-native";
import type { RootStackParamList } from "../../routes/navigationTypes";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={require("../../../assets/logo/logo-with-text.png")}
        style={{ width: 300, height: 300 }}
      />

      <Text className="text-slate-400">Cuidado inteligente ao seu alcance</Text>

      <Pressable
        className="mb-6 mt-14 w-9/12 rounded-xl bg-blue-400 p-5"
        onPress={() => navigation.navigate("Login")}
      >
        <Text className="text-center font-bold text-white">Começar agora</Text>
      </Pressable>

      <Text className="text-slate-400">Tecnologia • Segurança • Acolhimento</Text>
    </View>
  );
}
