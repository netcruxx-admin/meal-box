import Button from '@/components/Button';
import { useGetMySubscriptionsQuery } from '@/services/subscriptionApi';
import { useDeleteAccountMutation, useGetProfileQuery } from '@/services/userApi';
import { removeToken } from '@/utils/authStorage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { data, isLoading, error } = useGetProfileQuery(undefined);
  const { data: subData } = useGetMySubscriptionsQuery(undefined);
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const confirmDelete = async () => {
    try {
      await deleteAccount(undefined).unwrap();
      await removeToken();
      setShowDeleteModal(false);
      Toast.show({
        type: "success",
        text1: "Account deleted successfully",
        visibilityTime: 2000,
      });
      setTimeout(() => router.replace("/welcome"), 2000);
    } catch (err: unknown) {
      setShowDeleteModal(false);
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      Toast.show({
        type: "error",
        text1: message || "Failed to delete account",
      });
    }
  };


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
        <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={styles.deleteLink}>
          <Text style={styles.deleteLinkText}>
            Want to delete your account?{" "}
            <Text style={styles.deleteLinkAction}>Delete Account</Text>
          </Text>
        </TouchableOpacity>

      </View>

      {/* DELETE CONFIRMATION MODAL — outside SafeAreaView to cover full screen */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🗑️</Text>
            </View>

            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                <Text style={styles.deleteText}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteLink: {
    alignItems: "center",
    paddingVertical: 4,
  },
  deleteLinkText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
  deleteLinkAction: {
    color: "#EF4444",
    fontWeight: "600",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  deleteBtnDisabled: {
    backgroundColor: "#FCA5A5",
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});