import VendorDetailsScreen from '@/components/vendor/VendorDetailsScreen';
import { useLocalSearchParams } from 'expo-router';

export default function VendorDetailsRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return <VendorDetailsScreen vendorId={id} />;
}