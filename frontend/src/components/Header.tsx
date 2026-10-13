import {
    View,
    Text,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Header() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="bg-[#F7FBFF]" edges={['top']}>
            <View className="h-[50px] flex-row items-center px-6">

                <Pressable
                    className="mr-4"
                    onPress={() => navigation.goBack()}
                    hitSlop={12}
                >
                    <Ionicons
                        name="arrow-back"
                        size={28}
                        color="#2F80ED"
                    />
                </Pressable>

                <View className="mr-4 h-[29px] w-[29px] items-center justify-center rounded-full bg-[#2F80ED]">
                    <Ionicons
                        name="add"
                        size={23}
                        color="#FFFFFF"
                    />
                </View>

                <Text className="text-xl font-bold text-[#2F80ED]">iClinic</Text>

            </View>
        </SafeAreaView>
    );
}
