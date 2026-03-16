import VendorListing from '@/components/vendor/VendorListing';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <VendorListing />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});