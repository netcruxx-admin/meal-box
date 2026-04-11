import Button from '@/components/Button';
import GoBack from '@/components/GoBack';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/userApi';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <GoBack />
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            style={styles.input}
          />
        </View>

        {/* Phone */}
        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter phone number"
            value={form.phone}
            onChangeText={(v) => handleChange('phone', v)}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        {/* Address Section */}
        <Text style={styles.sectionTitle}>Address</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 1</Text>
          <TextInput
            placeholder="House no, street"
            value={form.address.line1}
            onChangeText={(v) => handleAddressChange('line1', v)}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 2 (Optional)</Text>
          <TextInput
            placeholder="Landmark, area"
            value={form.address.line2}
            onChangeText={(v) => handleAddressChange('line2', v)}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <TextInput
            placeholder="Enter city"
            value={form.address.city}
            onChangeText={(v) => handleAddressChange('city', v)}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>State</Text>
          <TextInput
            placeholder="Enter state"
            value={form.address.state}
            onChangeText={(v) => handleAddressChange('state', v)}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            placeholder="Enter pincode"
            value={form.address.pincode}
            onChangeText={(v) => handleAddressChange('pincode', v)}
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            placeholder="Enter pincode"
            value={form.address.pincode}
            onChangeText={(v) => handleAddressChange('pincode', v)}
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            placeholder="Enter pincode"
            value={form.address.pincode}
            onChangeText={(v) => handleAddressChange('pincode', v)}
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>

        <Button
          title={isUpdating ? 'Saving...' : 'Save Changes'}
          variant="fill"
          fullWidth
          disabled={isUpdating}
          onPress={handleSave}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  field: {
    marginBottom: 10,
    // backgroundColor: 'red'
  },

  label: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});