import {useNavigation} from '@react-navigation/native';
import { Button } from 'react-native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Button
      title="Começar agora"
      onPress={() =>
        navigation.navigate('Login')
      }
    />
  );
}