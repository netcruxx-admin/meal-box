import Button from '@/components/Button';
import GoBack from '@/components/GoBack';
import { useRegisterMutation } from '@/services/authApi';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const [register, { isLoading, error }] = useRegisterMutation();

    const handleRegister = async () => {
        if (!name || !phone || !password) {
            alert('All fields are required');
            return;
        }

        try {
            await register({
                name,
                phone,
                password,
            }).unwrap();

            alert('Registration successful. Please login.');

            router.replace('/(auth)/login');
        } catch (err: any) {
            alert(err?.data?.message || 'Registration failed');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <GoBack />
            </View>

            <View style={styles.form_container}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />

                <Button
                    title={isLoading ? 'Creating...' : 'Create Account'}
                    variant="fill"
                    fullWidth
                    disabled={isLoading}
                    onPress={handleRegister}
                />

                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.linkText}>
                        Already have an account? Login
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
    },
    form_container: {
        flex: 1,
        padding: 14,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    linkText: {
        textAlign: 'center',
        marginTop: 16,
        color: '#555',
    },
});
