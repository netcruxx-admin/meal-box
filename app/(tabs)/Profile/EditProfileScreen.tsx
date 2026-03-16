import Button from '@/components/Button';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/userApi';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function EditProfileScreen() {
  const router = useRouter();

  const { data, isLoading } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const user = data?.user;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          line1: user.address?.line1 || '',
          line2: user.address?.line2 || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
        },
      });
    }
  }, [user]);


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleChange = (key: 'name' | 'phone', value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddressChange = (
    key: 'line1' | 'line2' | 'city' | 'state' | 'pincode',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    const { name, phone, address } = form;

    if (!name || !phone) {
      Toast.show({ type: 'error', text1: 'Name and phone are required' });
      return;
    }

    if (phone.length !== 10) {
      Toast.show({ type: 'error', text1: 'Enter valid phone number' });
      return;
    }

    // Send address only if user entered something
    const hasAddress = Object.values(address).some(Boolean);

    try {
      await updateProfile({
        name,
        phone,
        ...(hasAddress && { address }),
      }).unwrap();

      Toast.show({ type: 'success', text1: 'Profile updated successfully' });
      router.back();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.data?.message || 'Update failed' });
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TextInput
        placeholder="Full Name"
        value={form.name}
        onChangeText={(v) => handleChange('name', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        value={form.phone}
        onChangeText={(v) => handleChange('phone', v)}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text>Address</Text>
      <TextInput
        placeholder="Address Line 1"
        value={form.address.line1}
        onChangeText={(v) => handleAddressChange('line1', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="Address Line 2 (Optional)"
        value={form.address.line2}
        onChangeText={(v) => handleAddressChange('line2', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={form.address.city}
        onChangeText={(v) => handleAddressChange('city', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="State"
        value={form.address.state}
        onChangeText={(v) => handleAddressChange('state', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="Pincode"
        value={form.address.pincode}
        onChangeText={(v) => handleAddressChange('pincode', v)}
        style={styles.input}
        keyboardType="number-pad"
      />

      <Button
        title={isUpdating ? 'Saving...' : 'Save Changes'}
        variant="fill"
        fullWidth
        disabled={isUpdating}
        onPress={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});