import Button from '@/components/Button';
import GoBack from '@/components/GoBack';
import { useLoginMutation } from '@/services/authApi';
import { saveToken } from '@/utils/authStorage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async () => {
    if (!phone || !password) {
      alert('Phone and password are required');
      return;
    }

    try {
      const res = await login({
        phone,
        password,
      }).unwrap();

      await saveToken(res.token);
      alert('Login successful.');
      router.replace('/(tabs)');
    } catch (err: any) {
      alert(err?.data?.message || 'Login failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <GoBack />
      </View>
      <View style={styles.form_container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          autoCapitalize="none"
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
          title="Login"
          variant="fill"
          fullWidth
          onPress={handleLogin}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.linkText}>
            Don’t have an account? Register
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
