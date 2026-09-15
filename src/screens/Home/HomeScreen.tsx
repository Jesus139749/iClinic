import { useNavigation } from '@react-navigation/native';
import { Button, Image, Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View className='flex-1 justify-center items-center'>
      <Image
        source={require('../../../assets/logo/logo-with-text.png')}
        style={{ width: 300, height: 300 }}
      />

      <Text className='color-slate-400'>Cuidado inteligente ao seu alcance</Text>

      <Pressable
        className='bg-blue-400 w-9/12 p-5 rounded-xl mt-14 mb-6'
        onPress={() =>
          navigation.navigate('Login')
        }
      >
        <Text className='text-center color-white font-bold'>Começar agora</Text>
      </Pressable>

      <Text className='color-slate-400'>Tecnologia • Segurança • Acolhimento</Text>
    </View>
  );
}