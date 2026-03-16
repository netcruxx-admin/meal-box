import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();
    const { width: screenWidth } = useWindowDimensions()
    const horizontalPadding = 20

    return (
        <SafeAreaView style={styles.container}>
            {/* Top content */}
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Text style={styles.tiffinEmoji}>🍱</Text>
                </View>

                <Text style={styles.title}>Meal Box</Text>
                <Text style={styles.tagline}>
                    Fresh homemade meals delivered
                </Text>

                <Text style={styles.description}>
                    Subscribe to your favorite vendors{'\n'}
                    Get daily fresh tiffins at your doorstep
                </Text>
            </View>

            {/* Bottom buttons */}
            <View style={styles.footer}>
                <Button
                    title="Sign Up"
                    variant="outline"
                    fullWidth
                    onPress={() => router.push('/(auth)/register')}
                />
                <View style={{ height: 14 }} />
                <Button
                    title="Login"
                    variant="fill"
                    fullWidth
                    onPress={() => router.push('/(auth)/login')}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconWrapper: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#FBE7CC',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    tiffinEmoji: {
        fontSize: 48,
      },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },

    tagline: {
        fontSize: 18,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 20,
    },

    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },

    footer: {
        paddingBottom: 32,
    },
});