import Button from '@/components/Button';
import { useGetProfileQuery } from '@/services/userApi';
import { removeToken } from '@/utils/authStorage';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { data, isLoading, error } = useGetProfileQuery(undefined);
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Failed to load profile</Text>
      </View>
    );
  }

  const user = data?.user;

  const handleLogout = async () => {
    await removeToken();
    router.replace('/welcome');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Profile</Text>

        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.subText}>+91 {user?.phone}</Text>
        </View>

        {/* Future Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Address</Text>
          {user?.address ? (
            <Text style={styles.subText}>
              {user.address.line1},{'\n'}
              {user.address.city}, {user.address.state} {user.address.pincode}
            </Text>
          ) : (
            <Text style={styles.subText}>No address added</Text>
          )}
        </View>

        {/* Future Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Subscription</Text>
          <Text style={styles.subText}>No active subscription</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Edit Profile"
          variant="outline"
          fullWidth
          onPress={() => router.push('/(tabs)/Profile/EditProfileScreen')}
        />
        <Button
          title="Logout"
          variant="fill"
          fullWidth
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    gap: 10,
    flexDirection: 'column'
  }
});