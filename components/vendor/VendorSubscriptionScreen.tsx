import { MEAL_GROUPS, MEAL_LABEL, MealType } from "@/constants/mealPlans";
import {
  useCreateSubscriptionMutation,
  useGetMySubscriptionsQuery,
} from "@/services/subscriptionApi";
import {
  useGetVendorByIdQuery,
  useGetVendorPlansQuery,
} from "@/services/vendorApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Button from "../Button";
import GoBack from "../GoBack";

type Props = {
  vendorId: string;
};

export default function VendorSubscriptionScreen({ vendorId }: Props) {
  const router = useRouter();

  const { data, isLoading } = useGetVendorPlansQuery(vendorId);
  const { data: vendorData } = useGetVendorByIdQuery(vendorId);
  const { data: mySubscriptions } = useGetMySubscriptionsQuery(undefined);
  const [createSubscription, { isLoading: isSubscribing }] =
    useCreateSubscriptionMutation();

  const existingRequest = mySubscriptions?.subscriptions?.find(
    (s: any) =>
      s.vendor?._id === vendorId &&
      ["pending", "accepted", "active", "paused"].includes(s.status),
  );

  const plans = data?.plans;

  const weeklyMealPlans: Record<string, number> = plans?.weekly?.mealPlans ?? {};
  const monthlyMealPlans: Record<string, number> = plans?.monthly?.mealPlans ?? {};
  const weeklyDiscount: number = plans?.weekly?.discount ?? 0;
  const monthlyDiscount: number = plans?.monthly?.discount ?? 0;

  const getMinDiscounted = (mealPlans: Record<string, number>, discount: number) => {
    const prices = Object.values(mealPlans);
    if (prices.length === 0) return 0;
    const min = Math.min(...prices);
    return Math.round(min * (1 - discount / 100));
  };

  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly">("weekly");
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);

  const currentMealPlans = selectedPlan === "weekly" ? weeklyMealPlans : monthlyMealPlans;
  const currentDiscount = selectedPlan === "weekly" ? weeklyDiscount : monthlyDiscount;
  const availableMealTypes = Object.keys(currentMealPlans) as MealType[];

  const effectiveMealType: MealType | null =
    selectedMealType && currentMealPlans[selectedMealType] != null
      ? selectedMealType
      : availableMealTypes[0] ?? null;

  const rawPrice = effectiveMealType ? (currentMealPlans[effectiveMealType] ?? 0) : 0;
  const discountedPrice = rawPrice > 0 ? Math.round(rawPrice * (1 - currentDiscount / 100)) : 0;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const handleSubscribe = async () => {
    if (!effectiveMealType) return;
    try {
      await createSubscription({
        vendorId,
        planDuration: selectedPlan,
        mealType: effectiveMealType,
      }).unwrap();

      Toast.show({
        type: "success",
        text1: "Request sent to vendor",
        text2: "Waiting for approval",
      });

      router.replace("/(tabs)/Subscription");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err?.data?.message || "Subscription failed",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <GoBack />
          <Text style={styles.title}>Choose Your Plan</Text>
        </View>

        <Text style={styles.vendorName}>{vendorData?.vendor?.businessName}</Text>

        {/* ── Step 1: Duration ── */}
        <Text style={styles.stepLabel}>Step 1 — Plan Duration</Text>

        <View style={styles.durationRow}>
          {/* Weekly */}
          <TouchableOpacity
            style={[styles.durationCard, selectedPlan === "weekly" && styles.selectedCard]}
            onPress={() => setSelectedPlan("weekly")}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.planTitle}>Weekly</Text>
              {selectedPlan === "weekly" ? (
                <View style={styles.selectedIcon}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
              ) : (
                <View style={styles.circle} />
              )}
            </View>
            <Text style={styles.subtitle}>7 days</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {getMinDiscounted(weeklyMealPlans, weeklyDiscount) > 0
                  ? `from ₹${getMinDiscounted(weeklyMealPlans, weeklyDiscount)}`
                  : "—"}
              </Text>
            </View>
            {weeklyDiscount > 0 && (
              <Text style={styles.discount}>Save {weeklyDiscount}%</Text>
            )}
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            style={[styles.durationCard, selectedPlan === "monthly" && styles.selectedCard]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.planTitle}>Monthly</Text>
              {selectedPlan === "monthly" ? (
                <View style={styles.selectedIcon}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
              ) : (
                <View style={styles.circle} />
              )}
            </View>
            <Text style={styles.subtitle}>30 days</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {getMinDiscounted(monthlyMealPlans, monthlyDiscount) > 0
                  ? `from ₹${getMinDiscounted(monthlyMealPlans, monthlyDiscount)}`
                  : "—"}
              </Text>
            </View>
            {monthlyDiscount > 0 && (
              <Text style={styles.discount}>Save {monthlyDiscount}%</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Step 2: Meal Combination ── */}
        <Text style={styles.stepLabel}>Step 2 — Meal Combination</Text>

        {MEAL_GROUPS.map((group) => {
          const visibleOptions = group.options.filter(
            (opt) => currentMealPlans[opt.value] != null
          );
          if (visibleOptions.length === 0) return null;
          return (
            <View key={group.label} style={styles.mealGroup}>
              <Text style={styles.mealGroupLabel}>{group.label}</Text>
              {visibleOptions.map((opt) => {
                const active = effectiveMealType === opt.value;
                const raw = currentMealPlans[opt.value] ?? 0;
                const discounted = Math.round(raw * (1 - currentDiscount / 100));
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.mealOption, active && styles.mealOptionActive]}
                    onPress={() => setSelectedMealType(opt.value)}
                  >
                    <View style={[styles.mealRadio, active && styles.mealRadioActive]}>
                      {active && <View style={styles.mealRadioDot} />}
                    </View>
                    <Text style={[styles.mealOptionText, active && styles.mealOptionTextActive]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.optionPrice}>₹{discounted}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

        {/* ── Summary ── */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Your Selection</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>
              {selectedPlan === "weekly" ? "Weekly (7 days)" : "Monthly (30 days)"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Meals</Text>
            <Text style={styles.summaryValue}>
              {effectiveMealType ? MEAL_LABEL[effectiveMealType] : "—"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>
              {discountedPrice > 0 ? `₹${discountedPrice}` : "—"}
              {currentDiscount > 0 && rawPrice > 0
                ? ` (Save ${currentDiscount}%)`
                : ""}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {existingRequest ? (
          <View
            style={[
              styles.statusBanner,
              existingRequest.status === "pending"
                ? styles.statusPending
                : styles.statusActive,
            ]}
          >
            <Ionicons
              name={existingRequest.status === "pending" ? "time" : "checkmark-circle"}
              size={20}
              color={existingRequest.status === "pending" ? "#d97706" : "#16a34a"}
            />
            <Text
              style={[
                styles.statusText,
                existingRequest.status === "pending"
                  ? styles.statusTextPending
                  : styles.statusTextActive,
              ]}
            >
              {existingRequest.status === "pending"
                ? "Request sent — waiting for vendor approval"
                : existingRequest.status === "accepted"
                ? "Your subscription has been accepted"
                : existingRequest.status === "paused"
                ? "Your subscription is currently paused"
                : "You already have an active subscription"}
            </Text>
          </View>
        ) : (
          <Button
            title={isSubscribing ? "Subscribing..." : "Subscribe Now"}
            variant="fill"
            fullWidth
            disabled={isSubscribing || !effectiveMealType || discountedPrice <= 0}
            onPress={handleSubscribe}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  vendorName: {
    color: "#6b7280",
    marginBottom: 20,
  },

  // Step labels
  stepLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  // Duration cards (side by side)
  durationRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  durationCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 14,
  },
  selectedCard: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 13,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
  },
  duration: {
    color: "#6b7280",
    fontSize: 13,
  },
  discount: {
    color: "#16a34a",
    fontWeight: "600",
    fontSize: 12,
    marginTop: 4,
  },
  selectedIcon: {
    backgroundColor: "#f97316",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },

  // Meal groups
  mealGroup: {
    marginBottom: 20,
  },
  mealGroupLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  mealOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  mealOptionActive: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },
  mealRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  mealRadioActive: {
    borderColor: "#f97316",
  },
  mealRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f97316",
  },
  mealOptionText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  mealOptionTextActive: {
    color: "#c2410c",
    fontWeight: "600",
  },
  optionPrice: {
    marginLeft: "auto",
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  // Summary box
  summary: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    color: "#6b7280",
    fontSize: 13,
  },
  summaryValue: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 13,
    flexShrink: 1,
    textAlign: "right",
  },

  // Footer
  footer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusPending: {
    backgroundColor: "#fffbeb",
    borderColor: "#fcd34d",
  },
  statusActive: {
    backgroundColor: "#f0fdf4",
    borderColor: "#86efac",
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  statusTextPending: {
    color: "#d97706",
  },
  statusTextActive: {
    color: "#16a34a",
 },
});
