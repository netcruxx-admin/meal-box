import { useGetMySubscriptionsQuery } from "@/services/subscriptionApi";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MySubscriptionsScreen() {
  const [tab, setTab] = useState<"active" | "past">("active");

  const { data, isLoading } = useGetMySubscriptionsQuery(undefined);

  if (isLoading) {
    return <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>;
  }

  const subscriptions = data?.subscriptions || [];

  const filtered = subscriptions.filter((sub: any) =>
    tab === "active"
      ? ["pending", "accepted"].includes(sub.status)
      : ["rejected", "completed", "cancelled"].includes(sub.status)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Subscriptions</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "active" && styles.tabActive]}
          onPress={() => setTab("active")}
        >
          <Text style={tab === "active" ? styles.tabTextActive : styles.tabText}>
            Active
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === "past" && styles.tabActive]}
          onPress={() => setTab("past")}
        >
          <Text style={tab === "past" ? styles.tabTextActive : styles.tabText}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No subscriptions found</Text>
          <Text style={styles.emptySubText}>
            {tab === "active"
              ? "You have no active subscriptions right now."
              : "You have no past subscriptions."}
          </Text>
        </View>
      )}

      {/* Cards */}
      {filtered.map((sub: any) => (
        <View
          key={sub._id}
          style={[
            styles.card,
            sub.status === "active" && styles.activeCard,
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.vendor}>{sub.vendor?.businessName || sub.vendor?.name}</Text>

            <View
              style={[
                styles.badge,
                sub.status === "accepted"
                  ? styles.activeBadge
                  : sub.status === "pending"
                    ? styles.pendingBadge
                    : styles.rejectedBadge,
              ]}
            >
              <Text style={styles.badgeText}>
                {sub.status === "pending"
                  ? "Pending"
                  : sub.status === "accepted"
                    ? "Active"
                    : sub.status === "rejected"
                      ? "Rejected"
                      : sub.status}
              </Text>
            </View>
          </View>

          <Text style={styles.plan}>
            {sub.planType === "weekly"
              ? "Full Day Meals - Weekly"
              : "Full Day Meals - Monthly"}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>
              {new Date(sub.startDate).toDateString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>
              {new Date(sub.endDate).toDateString()}
            </Text>
          </View>

          {/* Actions */}
          {sub.status === "pending" && (
            <Text style={{ color: "#f59e0b", marginTop: 10 }}>
              Waiting for vendor approval
            </Text>
          )}

          {sub.status === "accepted" && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.manageBtn}>
                <Text style={styles.manageText}>Manage</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pauseBtn}>
                <Text style={styles.pauseText}>Pause</Text>
              </TouchableOpacity>
            </View>
          )}

          {sub.status === "rejected" && (
            <Text style={{ color: "#ef4444", marginTop: 10 }}>
              Subscription rejected by vendor
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flex: 1,
  },

  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 20,
  },

  tabBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  tabActive: {
    backgroundColor: "#1f2937",
  },

  tabText: {
    color: "#374151",
    fontWeight: "600",
  },

  tabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  activeCard: {
    borderColor: "#22c55e",
    backgroundColor: "#f0fdf4",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  vendor: {
    fontSize: 18,
    fontWeight: "700",
  },

  plan: {
    color: "#4b5563",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  label: {
    color: "#6b7280",
  },

  value: {
    fontWeight: "600",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  activeBadge: {
    backgroundColor: "#22c55e",
  },
  pendingBadge: {
    backgroundColor: "#f59e0b",
  },

  rejectedBadge: {
    backgroundColor: "#ef4444",
  },
  pauseBadge: {
    backgroundColor: "#f59e0b",
  },

  badgeText: {
    color: "#fff",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    marginTop: 14,
  },

  manageBtn: {
    flex: 1,
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  manageText: {
    color: "#fff",
    fontWeight: "600",
  },

  pauseBtn: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  resumeBtn: {
    flex: 1,
    backgroundColor: "#dbeafe",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  pauseText: {
    color: "#111827",
    fontWeight: "600",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },

  emptySubText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});