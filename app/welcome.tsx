import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import {
    Image,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from 'react-native';

export default function WelcomeScreen() {
    const router = useRouter();
    const { width: screenWidth } = useWindowDimensions()
    const horizontalPadding = 20

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/cooking.png')}
                style={[styles.image, { width: screenWidth - horizontalPadding * 2 }]}
                resizeMode="contain"
            />

            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
                Let’s get started with your journey
            </Text>

            <Button
                title="Register"
                variant="fill"
                fullWidth
                onPress={() => router.push('/(auth)/register')}
            />

            <View style={{ height: 14 }} />

            <Button
                title="Login"
                variant="outline"
                fullWidth
                onPress={() => router.push('/(auth)/login')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: 260,
        marginBottom: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    }
});
