import VendorSubscriptionScreen from "@/components/vendor/VendorSubscriptionScreen";
import { useLocalSearchParams } from "expo-router";

export default function SubscriptionPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <VendorSubscriptionScreen vendorId={id} />;
}