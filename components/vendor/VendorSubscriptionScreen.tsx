import { useCreateSubscriptionMutation } from "@/services/subscriptionApi";
import { useGetVendorByIdQuery, useGetVendorPlansQuery } from "@/services/vendorApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const [createSubscription, { isLoading: isSubscribing }] = useCreateSubscriptionMutation();

  const plans = data?.plans;

  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly">(
    "weekly"
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const weeklyPrice = plans?.weekly?.price || 0;
  const weeklyDiscount = plans?.weekly?.discount || 0;

  const monthlyPrice = plans?.monthly?.price || 0;
  const monthlyDiscount = plans?.monthly?.discount || 0;

  const formatPlanType = (type?: string) => {
    switch (type) {
      case "full_day":
        return "Full Day (Breakfast + Lunch + Dinner)";
      case "lunch_dinner":
        return "Lunch + Dinner";
      case "lunch_only":
        return "Lunch Only";
      default:
        return "";
    }
  };

  const weeklyPlanType = plans?.weekly?.planType;
  const monthlyPlanType = plans?.monthly?.planType;

  type PlanArg = { type: "weekly" | "monthly"; price: number; duration: number };

  const handleSubscribe = async (plan: PlanArg) => {
    try {
      await createSubscription({
        vendorId,
        planType: plan.type,
        price: plan.price,
        duration: plan.duration,
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

  const selectedPlanData: PlanArg =
    selectedPlan === "weekly"
      ? { type: "weekly", price: weeklyPrice, duration: 7 }
      : { type: "monthly", price: monthlyPrice, duration: 30 };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <GoBack />

            <Text style={styles.title}>Choose Your Plan</Text>
          </View>

          <Text style={styles.vendorName}>
            {vendorData?.vendor?.businessName}
          </Text>

          {/* Weekly Plan */}
          <TouchableOpacity
            style={[
              styles.card,
              selectedPlan === "weekly" && styles.selectedCard,
            ]}
            onPress={() => setSelectedPlan("weekly")}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.planTitle}>Weekly Plan</Text>

              {selectedPlan === "weekly" ? (
                <View style={styles.selectedIcon}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              ) : (
                <View style={styles.circle} />
              )}
            </View>

            <Text style={styles.planType}>
              {formatPlanType(weeklyPlanType)}
            </Text>

            <Text style={styles.subtitle}>7 days subscription</Text>

            <Text style={styles.feature}>✓ Fresh meals daily</Text>
            <Text style={styles.feature}>✓ Flexible delivery time</Text>
            <Text style={styles.feature}>✓ Cancel anytime</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{weeklyPrice}</Text>
              <Text style={styles.duration}> /week</Text>

              <Text style={styles.discount}>Save {weeklyDiscount}%</Text>
            </View>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.card,
              selectedPlan === "monthly" && styles.selectedCard,
            ]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.planTitle}>Monthly Plan</Text>

              {selectedPlan === "monthly" ? (
                <View style={styles.selectedIcon}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              ) : (
                <View style={styles.circle} />
              )}
            </View>

            <Text style={styles.planType}>
              {formatPlanType(monthlyPlanType)}
            </Text>

            <Text style={styles.subtitle}>30 days subscription</Text>

            <Text style={styles.feature}>✓ Fresh meals daily</Text>
            <Text style={styles.feature}>✓ Flexible delivery time</Text>
            <Text style={styles.feature}>✓ Priority support</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{monthlyPrice}</Text>
              <Text style={styles.duration}> /month</Text>

              <Text style={styles.discount}>Save {monthlyDiscount}%</Text>
            </View>
          </TouchableOpacity>
      </View>

      {/* Subscribe Button */}
      <View style={styles.footer}>
        <Button
          title={isSubscribing ? "Subscribing..." : "Subscribe Now"}
          variant="fill"
          fullWidth
          disabled={isSubscribing || selectedPlanData.price <= 0}
          onPress={() => handleSubscribe(selectedPlanData)}
        />
      </View>
    </View>
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
    paddingTop: 30,
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

  vendorName: {
    color: "#6b7280",
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },

  selectedCard: {
    borderColor: "#f97316",
    backgroundColor: "#fff7ed",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  planTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  subtitle: {
    marginVertical: 6,
    color: "#6b7280",
  },

  feature: {
    color: "#374151",
    marginTop: 4,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  price: {
    fontSize: 28,
    fontWeight: "700",
  },

  duration: {
    marginLeft: 4,
    color: "#6b7280",
  },

  discount: {
    marginLeft: 10,
    color: "#16a34a",
    fontWeight: "600",
  },

  selectedIcon: {
    backgroundColor: "#f97316",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },

  // footer: {
  //   paddingVertical: 20,
  // },
  planType: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
  }
});