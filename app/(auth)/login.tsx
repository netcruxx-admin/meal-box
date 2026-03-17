import AppText from '@/components/AppText';
import Button from '@/components/Button';
import GoBack from '@/components/GoBack';
import { colors } from '@/constants/theme';
import { useLoginMutation } from '@/services/authApi';
import { saveToken } from '@/utils/authStorage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async () => {
    if (!phone || !password) {
      Toast.show({ type: 'error', text1: 'Phone and password are required' });
      return;
    }

    try {
      const res = await login({
        phone,
        password,
        role: 'user'
      }).unwrap();

      await saveToken(res.token);
      Toast.show({ type: 'success', text1: 'Login successful' });
      router.replace('/(tabs)');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.data?.message || 'Login failed' });
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
            Welcome Back
          </AppText>

          <AppText>
            Login to continue enjoying fresh tiffins
          </AppText>
        </View>

        <AppText style={styles.label}>Phone</AppText>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          autoCapitalize="none"
          placeholder="Phone"
          keyboardType="phone-pad"

        />

        <AppText style={styles.label}>Password</AppText>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <Button
          title="Login"
          variant="fill"
          fullWidth
          onPress={handleLogin}
          disabled={isLoading}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>
            Don&apos;t have an account? <Text style={styles.link}>Sign Up</Text>
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
    marginBottom: 6,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeBtn: {
    paddingHorizontal: 14,
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
});
