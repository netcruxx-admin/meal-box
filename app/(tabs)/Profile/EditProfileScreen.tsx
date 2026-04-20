import Button from '@/components/Button';
import GoBack from '@/components/GoBack';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/userApi';
import { isProfileComplete } from '@/utils/profileValidation';
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

  const { data, isLoading, refetch } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const user = data?.user;
  const profileIsComplete = isProfileComplete(user);

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Only letters, digits, spaces, and common address punctuation (, . - / # &)
  const ADDRESS_REGEX = /^[a-zA-Z0-9\s,.\-/#&()]+$/;

  const validate = () => {
    const { name, phone, address } = form;
    const e: Record<string, string> = {};

    // Full Name
    if (!name.trim()) {
      e.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      e.name = 'Name must be at least 3 characters';
    } else if (name.trim().length > 50) {
      e.name = 'Name must be at most 50 characters';
    }

    // Phone
    if (!phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (phone.length !== 10) {
      e.phone = 'Enter a valid 10-digit phone number';
    }

    // Address Line 1
    if (!address.line1.trim()) {
      e.line1 = 'Address Line 1 is required';
    } else if (!ADDRESS_REGEX.test(address.line1)) {
      e.line1 = 'Address contains invalid characters';
    } else if (address.line1.length > 100) {
      e.line1 = 'Address Line 1 must be at most 100 characters';
    }

    // Address Line 2 (optional but validate if filled)
    if (address.line2) {
      if (!ADDRESS_REGEX.test(address.line2)) {
        e.line2 = 'Address contains invalid characters';
      } else if (address.line2.length > 100) {
        e.line2 = 'Address Line 2 must be at most 100 characters';
      }
    }

    // City
    if (!address.city.trim()) {
      e.city = 'City is required';
    } else if (!ADDRESS_REGEX.test(address.city)) {
      e.city = 'City contains invalid characters';
    } else if (address.city.length > 50) {
      e.city = 'City must be at most 50 characters';
    }

    // State
    if (!address.state.trim()) {
      e.state = 'State is required';
    } else if (!ADDRESS_REGEX.test(address.state)) {
      e.state = 'State contains invalid characters';
    } else if (address.state.length > 50) {
      e.state = 'State must be at most 50 characters';
    }

    // Pincode
    if (!address.pincode.trim()) {
      e.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(address.pincode)) {
      e.pincode = 'Pincode must be exactly 6 digits';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

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
    setForm((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const handleAddressChange = (
    key: 'line1' | 'line2' | 'city' | 'state' | 'pincode',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
    clearError(key);
  };

  const handleSave = async () => {
    if (!validate()) return;

    const { name, phone, address } = form;
    const hasAddress = Object.values(address).some(Boolean);

    try {
      await updateProfile({
        name,
        phone,
        ...(hasAddress && { address }),
      }).unwrap();

      await refetch();

      Toast.show({ type: 'success', text1: 'Profile updated successfully' });

      setTimeout(() => {
        if (profileIsComplete) {
          router.back();
        } else {
          router.replace('/(tabs)/Profile');
        }
      }, 2000);
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
          {profileIsComplete && <GoBack />}
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {!profileIsComplete && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Please complete your profile to access all features
            </Text>
          </View>
        )}

        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            style={[styles.input, errors.name ? styles.inputError : null]}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        {/* Phone */}
        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            placeholder="Enter phone number"
            value={form.phone}
            onChangeText={(v) => handleChange('phone', v)}
            style={[styles.input, errors.phone ? styles.inputError : null]}
            keyboardType="phone-pad"
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        </View>

        {/* Address Section */}
        <Text style={styles.sectionTitle}>Address</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 1</Text>
          <TextInput
            placeholder="House no, street"
            value={form.address.line1}
            onChangeText={(v) => handleAddressChange('line1', v)}
            style={[styles.input, errors.line1 ? styles.inputError : null]}
            maxLength={100}
          />
          {errors.line1 ? <Text style={styles.errorText}>{errors.line1}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address Line 2 (Optional)</Text>
          <TextInput
            placeholder="Landmark, area"
            value={form.address.line2}
            onChangeText={(v) => handleAddressChange('line2', v)}
            style={[styles.input, errors.line2 ? styles.inputError : null]}
            maxLength={100}
          />
          {errors.line2 ? <Text style={styles.errorText}>{errors.line2}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <TextInput
            placeholder="Enter city"
            value={form.address.city}
            onChangeText={(v) => handleAddressChange('city', v)}
            style={[styles.input, errors.city ? styles.inputError : null]}
            maxLength={50}
          />
          {errors.city ? <Text style={styles.errorText}>{errors.city}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>State</Text>
          <TextInput
            placeholder="Enter state"
            value={form.address.state}
            onChangeText={(v) => handleAddressChange('state', v)}
            style={[styles.input, errors.state ? styles.inputError : null]}
            maxLength={50}
          />
          {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Pincode</Text>
          <TextInput
            placeholder="Enter pincode"
            value={form.address.pincode}
            onChangeText={(v) => handleAddressChange('pincode', v)}
            style={[styles.input, errors.pincode ? styles.inputError : null]}
            keyboardType="number-pad"
            maxLength={6}
          />
          {errors.pincode ? <Text style={styles.errorText}>{errors.pincode}</Text> : null}
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
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
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
  warningBox: {
    backgroundColor: '#fef3c7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  warningText: {
    color: '#92400e',
    fontSize: 14,
  },
});