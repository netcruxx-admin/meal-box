import { MEAL_LABEL } from "@/constants/mealPlans";
import {
  useCancelSubscriptionMutation,
  useGetMySubscriptionsQuery,
  usePauseSubscriptionMutation,
  useResumeSubscriptionMutation,
} from "@/services/subscriptionApi";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type Subscription = {
  _id: string;
  planType?: string;
  planDuration?: string;
  mealType?: string;
  price?: number;
  basePrice?: number;
  finalPrice?: number;
  discount?: number;
  duration?: number;
  startDate: string;
  endDate: string;
  status:
    | "pending"
    | "accepted"
    | "active"
    | "paused"
    | "expired"
    | "rejected"
    | "completed"
    | "cancelled"
    | string;
  vendor: {
    _id: string;
    businessName?: string;
    name?: string;
    foodType?: string;
    address?: any;
  };
};

const ACTIVE_STATUSES = ["pending", "accepted", "active", "paused"];
const EXPIRED_STATUSES = ["expired", "completed"];
const CANCELLED_STATUSES = ["cancelled", "rejected"];

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  active: "Active",
  paused: "Paused",
  expired: "Expired",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_BADGE_STYLE: Record<string, object> = {
  pending: { backgroundColor: "#f59e0b" },
  accepted: { backgroundColor: "#22c55e" },
  active: { backgroundColor: "#16a34a" },
  paused: { backgroundColor: "#f97316" },
  expired: { backgroundColor: "#6b7280" },
  rejected: { backgroundColor: "#ef4444" },
  completed: { backgroundColor: "#6b7280" },
  cancelled: { backgroundColor: "#9ca3af" },
};

const toYMD = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fmtDisplay = (d: Date) =>
  d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ─────────────────────────────────────────────
// Card component
// ─────────────────────────────────────────────
function SubscriptionCard({
  sub,
  onPause,
  onResume,
  onCancel,
  pausing,
  resuming,
  cancelling,
}: {
  sub: Subscription;
  onPause: (id: string, pauseStartDate: string, pauseEndDate: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  pausing: boolean;
  resuming: boolean;
  cancelling: boolean;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [showPauseInput, setShowPauseInput] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(today);
  const [toDate, setToDate] = useState<Date>(
    new Date(today.getTime() + 24 * 60 * 60 * 1000)
  );
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [dateError, setDateError] = useState("");

  const canPause = sub.status === "accepted" || sub.status === "active";
  const canResume = sub.status === "paused";
  const canCancel = sub.status === "pending" || sub.status === "accepted";
  const isTerminal = [
    ...EXPIRED_STATUSES,
    ...CANCELLED_STATUSES,
  ].includes(sub.status);

  const handlePausePress = () => {
    setFromDate(today);
    setToDate(new Date(today.getTime() + 24 * 60 * 60 * 1000));
    setDateError("");
    setShowPauseInput(true);
  };

  const handlePauseDismiss = () => {
    setShowPauseInput(false);
    setDateError("");
    setShowFromPicker(false);
    setShowToPicker(false);
  };

  const handlePauseConfirm = () => {
    if (toDate <= fromDate) {
      setDateError("'Pause Until' date must be after 'Pause From' date.");
      return;
    }
    setDateError("");
    setShowPauseInput(false);
    onPause(sub._id, toYMD(fromDate), toYMD(toDate));
  };

  const onFromChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowFromPicker(Platform.OS === "ios");
    if (selected) {
      selected.setHours(0, 0, 0, 0);
      setFromDate(selected);
      setDateError("");
      if (toDate <= selected) {
        setToDate(new Date(selected.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  };

  const onToChange = (_: DateTimePickerEvent, selected?: Date) => {
    setShowToPicker(Platform.OS === "ios");
    if (selected) {
      selected.setHours(0, 0, 0, 0);
      setToDate(selected);
      setDateError("");
    }
  };

  const isAnyBusy = pausing || resuming || cancelling;

  return (
    <View
      style={[
        styles.card,
        sub.status === "active" && styles.activeCard,
        sub.status === "paused" && styles.pausedCard,
      ]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.vendor}>
          {sub.vendor?.businessName || sub.vendor?.name}
        </Text>
        <View style={[styles.badge, STATUS_BADGE_STYLE[sub.status] ?? {}]}>
          <Text style={styles.badgeText}>
            {STATUS_LABEL[sub.status] ?? sub.status}
          </Text>
        </View>
      </View>

      {/* Plan & meal info */}
      <Text style={styles.plan}>
        {(sub.planDuration ?? sub.planType) === "weekly" ? "Weekly Plan" : "Monthly Plan"} · ₹
        {sub.finalPrice ?? sub.price ?? 0}
      </Text>
      {sub.mealType && (
        <Text style={styles.mealType}>
          {MEAL_LABEL[sub.mealType] ?? sub.mealType}
        </Text>
      )}

      {/* Dates */}
      <View style={styles.row}>
        <Text style={styles.label}>Start Date</Text>
        <Text style={styles.value}>
          {new Date(sub.startDate).toDateString()}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>End Date</Text>
        <Text style={styles.value}>{new Date(sub.endDate).toDateString()}</Text>
      </View>

      {/* Status messages */}
      {sub.status === "pending" && (
        <Text style={styles.pendingMsg}>Waiting for vendor approval</Text>
      )}
      {sub.status === "paused" && (
        <Text style={styles.pausedMsg}>Plan is currently paused</Text>
      )}
      {sub.status === "expired" && (
        <Text style={styles.expiredMsg}>This subscription has expired</Text>
      )}
      {sub.status === "rejected" && (
        <Text style={styles.rejectedMsg}>Subscription rejected by vendor</Text>
      )}
      {sub.status === "cancelled" && (
        <Text style={styles.cancelledMsg}>Subscription cancelled</Text>
      )}

      {/* ── Pause date picker panel ── */}
      {showPauseInput && (
        <View style={styles.pauseInputBox}>
          <Text style={styles.pauseInputTitle}>Select pause dates</Text>

          <Text style={styles.dateLabel}>Pause From</Text>
          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => {
              setShowFromPicker(true);
              setShowToPicker(false);
            }}
          >
            <Text style={styles.dateValue}>{fmtDisplay(fromDate)}</Text>
            <Text style={styles.calIcon}>📅</Text>
          </TouchableOpacity>
          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              minimumDate={today}
              onChange={onFromChange}
            />
          )}

          <Text style={[styles.dateLabel, { marginTop: 12 }]}>Pause Until</Text>
          <TouchableOpacity
            style={styles.dateRow}
            onPress={() => {
              setShowToPicker(true);
              setShowFromPicker(false);
            }}
          >
            <Text style={styles.dateValue}>{fmtDisplay(toDate)}</Text>
            <Text style={styles.calIcon}>📅</Text>
          </TouchableOpacity>
          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              minimumDate={new Date(fromDate.getTime() + 24 * 60 * 60 * 1000)}
              onChange={onToChange}
            />
          )}

          {dateError ? (
            <Text style={styles.inputErrorText}>{dateError}</Text>
          ) : null}

          <View style={styles.pauseInputActions}>
            <TouchableOpacity
              style={[styles.confirmPauseBtn, pausing && styles.btnDisabled]}
              onPress={handlePauseConfirm}
              disabled={pausing}
            >
              {pausing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmPauseText}>Confirm Pause</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={handlePauseDismiss}
              disabled={pausing}
            >
              <Text style={styles.dismissText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Action buttons ── */}
      {!isTerminal && !showPauseInput && (
        <View style={styles.actions}>
          {/* Pause button */}
          {canPause && (
            <TouchableOpacity
              style={[styles.pauseBtn, isAnyBusy && styles.btnDisabled]}
              onPress={handlePausePress}
              disabled={isAnyBusy}
            >
              <Text style={styles.pauseBtnText}>Pause Plan</Text>
            </TouchableOpacity>
          )}

          {/* Resume button */}
          {canResume && (
            <TouchableOpacity
              style={[styles.resumeBtn, isAnyBusy && styles.btnDisabled]}
              onPress={() => onResume(sub._id)}
              disabled={isAnyBusy}
            >
              {resuming ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.resumeBtnText}>Resume Plan</Text>
              )}
            </TouchableOpacity>
          )}

          {/* Cancel button */}
          {canCancel && (
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                isAnyBusy && styles.btnDisabled,
                !canPause && !canResume && styles.cancelBtnFull,
              ]}
              onPress={() => onCancel(sub._id)}
              disabled={isAnyBusy}
            >
              {cancelling ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.cancelText}>Cancel Plan</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────
export default function MySubscriptionsScreen() {
  const [tab, setTab] = useState<"active" | "expired" | "cancelled">("active");
  const [pausingId, setPausingId] = useState<string | null>(null);
  const [resumingId, setResumingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data, isLoading } = useGetMySubscriptionsQuery(undefined);
  const [pauseSubscription] = usePauseSubscriptionMutation();
  const [resumeSubscription] = useResumeSubscriptionMutation();
  const [cancelSubscription] = useCancelSubscriptionMutation();

  const subscriptions: Subscription[] = data?.subscriptions || [];
  const filtered = subscriptions.filter((sub) => {
    if (tab === "active") return ACTIVE_STATUSES.includes(sub.status);
    if (tab === "expired") return EXPIRED_STATUSES.includes(sub.status);
    return CANCELLED_STATUSES.includes(sub.status);
  });

  const handlePause = async (
    id: string,
    pauseStartDate: string,
    pauseEndDate: string
  ) => {
    setPausingId(id);
    try {
      const res = await pauseSubscription({ id, pauseStartDate, pauseEndDate }).unwrap();
      Toast.show({
        type: "success",
        text1: "Subscription paused",
        text2: res.message,
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.data?.message || "Could not pause subscription",
      });
    } finally {
      setPausingId(null);
    }
  };

  const handleResume = (id: string) => {
    Alert.alert(
      "Resume Subscription",
      "Resume your subscription now?",
      [
        { text: "Not yet", style: "cancel" },
        {
          text: "Yes, Resume",
          onPress: async () => {
            setResumingId(id);
            try {
              await resumeSubscription(id).unwrap();
              Toast.show({ type: "success", text1: "Subscription resumed" });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: err?.data?.message || "Could not resume subscription",
              });
            } finally {
              setResumingId(null);
            }
          },
        },
      ]
    );
  };

  const handleCancel = (id: string) => {
    Alert.alert(
      "Cancel Plan",
      "Are you sure you want to cancel this plan? This cannot be undone.",
      [
        { text: "Keep Plan", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setCancellingId(id);
            try {
              await cancelSubscription(id).unwrap();
              Toast.show({ type: "success", text1: "Subscription cancelled" });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: err?.data?.message || "Could not cancel subscription",
              });
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1f2937" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Subscriptions</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(["active", "expired", "cancelled"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={tab === t ? styles.tabTextActive : styles.tabText}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty state */}
      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📭</Text>
          <Text style={styles.emptyTitle}>No subscriptions found</Text>
          <Text style={styles.emptySubText}>
            {tab === "active"
              ? "You have no active subscriptions right now."
              : tab === "expired"
              ? "You have no expired subscriptions."
              : "You have no cancelled subscriptions."}
          </Text>
        </View>
      )}

      {/* Cards */}
      {filtered.map((sub) => (
        <SubscriptionCard
          key={sub._id}
          sub={sub}
          onPause={handlePause}
          onResume={handleResume}
          onCancel={handleCancel}
          pausing={pausingId === sub._id}
          resuming={resumingId === sub._id}
          cancelling={cancellingId === sub._id}
        />
      ))}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9fafb", flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { fontSize: 26, fontWeight: "700", marginBottom: 20 },

  tabs: { flexDirection: "row", marginBottom: 20, gap: 10 },
  tabBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#1f2937" },
  tabText: { color: "#374151", fontWeight: "600" },
  tabTextActive: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeCard: { borderColor: "#22c55e", backgroundColor: "#f0fdf4" },
  pausedCard: { borderColor: "#f97316", backgroundColor: "#fff7ed" },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  vendor: { fontSize: 18, fontWeight: "700", flex: 1, marginRight: 8 },

  plan: { color: "#4b5563", marginBottom: 4 },
  mealType: {
    color: "#f97316",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: { color: "#6b7280" },
  value: { fontWeight: "600" },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  pendingMsg: { color: "#d97706", marginTop: 10, fontSize: 13 },
  pausedMsg: { color: "#f97316", marginTop: 10, fontSize: 13 },
  expiredMsg: { color: "#6b7280", marginTop: 10, fontSize: 13 },
  rejectedMsg: { color: "#ef4444", marginTop: 10, fontSize: 13 },
  cancelledMsg: { color: "#9ca3af", marginTop: 10, fontSize: 13 },

  // Pause date picker panel
  pauseInputBox: {
    marginTop: 14,
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  pauseInputTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9a3412",
    marginBottom: 14,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateValue: { fontSize: 15, color: "#111827", fontWeight: "600" },
  calIcon: { fontSize: 18 },
  inputErrorText: { color: "#ef4444", fontSize: 12, marginTop: 10 },
  pauseInputActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  confirmPauseBtn: {
    flex: 1,
    backgroundColor: "#f97316",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  confirmPauseText: { color: "#fff", fontWeight: "600" },
  dismissBtn: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  dismissText: { color: "#374151", fontWeight: "600" },

  // Action buttons row
  actions: { flexDirection: "row", marginTop: 14, gap: 10 },
  pauseBtn: {
    flex: 1,
    backgroundColor: "#f97316",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  pauseBtnText: { color: "#fff", fontWeight: "600" },
  resumeBtn: {
    flex: 1,
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  resumeBtnText: { color: "#fff", fontWeight: "600" },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  cancelBtnFull: { flex: 1 },
  cancelText: { color: "#fff", fontWeight: "600" },
  btnDisabled: { opacity: 0.6 },

  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#111827",
  },
  emptySubText: { fontSize: 14, color: "#6b7280", textAlign: "center" },
});
