import Button from '@/components/Button';
import { removeToken } from '@/utils/authStorage';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();

    const handleLogout = async () => {
      await removeToken();
      router.replace('/welcome');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home Screen</Text>

            <Button
                title={'Logout'}
                variant="fill"
                onPress={handleLogout}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
    },
});