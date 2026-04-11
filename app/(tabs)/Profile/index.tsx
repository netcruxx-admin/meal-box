import Button from '@/components/Button';
import { useGetMySubscriptionsQuery } from '@/services/subscriptionApi';
import { useGetProfileQuery } from '@/services/userApi';
import { removeToken } from '@/utils/authStorage';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { data, isLoading, error } = useGetProfileQuery(undefined);
  const { data: subData } = useGetMySubscriptionsQuery(undefined);
  const router = useRouter();

  const activeSubscription = subData?.subscriptions?.find(
    (sub: any) =>
      sub.status === 'accepted' ||
      sub.status === 'active' ||
      sub.status === 'paused'
  );
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

  console.log(activeSubscription, 'activeSubscription');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

          {/* Subscription Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Subscription</Text>
            {activeSubscription ? (
              <View style={[styles.subCard, activeSubscription.status === 'active' ? styles.activeSubCard : styles.pausedSubCard]}>
                <View style={styles.subCardHeader}>
                  <Text style={styles.subVendor}>{activeSubscription.vendor?.businessName}</Text>
                  <View
                    style={[
                      styles.badge,
                      activeSubscription.status === 'accepted' || activeSubscription.status === 'active'
                        ? styles.activeBadge
                        : styles.pausedBadge,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {activeSubscription.status === 'accepted'
                        ? 'Active'
                        : activeSubscription.status === 'active'
                          ? 'Active'
                          : 'Paused'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.subPlan}>
                  {activeSubscription.planType === 'weekly' ? 'Weekly Plan' : 'Monthly Plan'}
                </Text>
                <View style={styles.subRow}>
                  <Text style={styles.subLabel}>Ends on:</Text>
                  <Text style={styles.subValue}>{new Date(activeSubscription.endDate).toDateString()}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.subText}>No active subscription</Text>
            )}
          </View>
        </View>
      </ScrollView>

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
    flexDirection: 'column',
    paddingVertical: 16,
  },
  subCard: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  activeSubCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  pausedSubCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#f59e0b',
  },
  subCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subVendor: {
    fontSize: 16,
    fontWeight: '700',
  },
  subPlan: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subLabel: {
    color: '#6b7280',
    fontSize: 14,
  },
  subValue: {
    fontWeight: '600',
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeBadge: {
    backgroundColor: '#22c55e',
  },
  pausedBadge: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});