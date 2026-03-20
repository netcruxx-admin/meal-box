import AppText from '@/components/AppText';
import Button from '@/components/Button';
import ErrorText from '@/components/ErrorText';
import GoBack from '@/components/GoBack';
import { colors } from '@/constants/theme';
import { useRegisterMutation } from '@/services/authApi';
import { AuthErrors, hasErrors, validateRegisterForm } from '@/utils/authValidation';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<AuthErrors>({});

    const [register, { isLoading, error }] = useRegisterMutation();

    const handleRegister = async () => {
        const validationErrors = validateRegisterForm(name, phone, password);
        setErrors(validationErrors);
        if (hasErrors(validationErrors)) return;
        try {
            await register({
                name,
                phone,
                password,
            }).unwrap();

            Toast.show({ type: 'success', text1: 'Registration successful', text2: 'Please login.' });

            router.replace('/(auth)/login');
        } catch (err: any) {
            Toast.show({ type: 'error', text1: err?.data?.message || 'Registration failed' });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <GoBack />
            </View>

            <View style={styles.form_container}>
                <View style={styles.header}>
                    <AppText type="title">
                        Create Account
                    </AppText>

                    <AppText>
                        Get fresh homemade meals delivered daily
                    </AppText>
                </View>

                <AppText style={styles.label}>Full Name</AppText>

                <TextInput
                    placeholder="Full Name"
                    value={name}
                    onChangeText={(val) => {
                        setName(val);
                        setErrors(prev => ({ ...prev, fullName: undefined }));
                    }}
                    style={[styles.input, errors.fullName ? styles.inputError : null]}
                />
                <ErrorText message={errors.fullName} />

                <AppText style={styles.label}>Phone</AppText>

                <TextInput
                    value={phone}
                    onChangeText={(val) => {
                        setPhone(val);
                        setErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    style={[styles.input, errors.phone ? styles.inputError : null]}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                />
                <ErrorText message={errors.phone} />


                <AppText style={styles.label}>Password</AppText>
                <View style={[styles.passwordWrapper, errors.password ? styles.inputError : null]}>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={(val) => {
                            setPassword(val);
                            setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        style={styles.passwordInput}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeBtn}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#9ca3af" />
                    </TouchableOpacity>
                </View>
                <ErrorText message={errors.password} />

                <View style={{ marginTop: 20 }}>
                    <Button
                        title={isLoading ? 'Creating...' : 'Create Account'}
                        variant="fill"
                        fullWidth
                        disabled={isLoading}
                        onPress={handleRegister}
                    />
                </View>

                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                    <Text style={styles.linkText}>
                        Already have an account? <Text style={styles.link}>Login</Text>
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
    header: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 40
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        color: '#111',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        borderRadius: 8,
        marginBottom: 4,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#ef4444',
    },
    linkText: {
        textAlign: 'center',
        marginTop: 18,
        fontSize: 14,
        color: '#555',
    },
    link: {
        color: colors.primary,
        fontWeight: '600',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 4,
    },
    passwordInput: {
        flex: 1,
        padding: 14,
        fontSize: 16,
    },
    eyeBtn: {
        paddingHorizontal: 14,
    },
});
